const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

async function run() {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'visionai-session-test-'));
  const workerPath = path.join(tempDirectory, 'worker.mjs');
  fs.copyFileSync(path.join(__dirname, 'src', 'worker.js'), workerPath);
  try {
    const { default: worker } = await import(pathToFileURL(workerPath).href);
    const secret = 'isolated-session-test-secret';
    const oldPassword = 'old-password-123';
    const newPassword = 'new-password-456';
    const salt = Buffer.alloc(16, 3);
    const user = {
      id: 7, nickname: 'Tester', email: 'tester@example.test', gender: 'prefer_not_to_say',
      bio: '', avatar_color: 'violet', avatar_image: null, role: 'user', session_version: 0,
      created_at: '2025-01-01T00:00:00Z', password_salt: salt.toString('base64url'),
      password_hash: crypto.pbkdf2Sync(oldPassword, salt, 100000, 32, 'sha256').toString('base64url'),
    };
    const db = {
      prepare(sql) {
        return {
          bind(...values) {
            return {
              async first() {
                if (sql.includes('SELECT session_version')) return { session_version: user.session_version };
                if (sql.includes('SELECT password_hash')) return { password_hash: user.password_hash, password_salt: user.password_salt };
                if (sql.includes('FROM users WHERE email')) return values[0] === user.email ? user : null;
                if (sql.includes('FROM users WHERE id')) return Number(values[0]) === user.id ? user : null;
                throw new Error(`Unexpected query: ${sql}`);
              },
              async run() {
                if (sql.includes('UPDATE users SET password_hash')) {
                  user.password_hash = values[0];
                  user.password_salt = values[1];
                  user.session_version += 1;
                  return { success: true };
                }
                if (sql.includes('UPDATE users SET last_login_at')) return { success: true };
                throw new Error(`Unexpected update: ${sql}`);
              },
            };
          },
        };
      },
    };
    const limiter = { idFromName: value => value, get: () => ({ fetch: async () => new Response(null, { status: 204 }) }) };
    const env = { DB: db, SESSION_SECRET: secret, AUTH_RATE_LIMITER: limiter, ALLOWED_ORIGINS: '' };
    const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
    const now = Math.floor(Date.now() / 1000);
    const unsigned = `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ sub: String(user.id), iat: now, exp: now + 3600 })}`;
    const oldToken = `${unsigned}.${crypto.createHmac('sha256', secret).update(unsigned).digest('base64url')}`;
    const request = (endpoint, token, options = {}) => new Request(`https://example.test${endpoint}`, {
      ...options,
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    });

    assert.equal((await worker.fetch(request('/api/auth/me', oldToken), env)).status, 200, 'legacy token should work before password change');
    const incorrect = await worker.fetch(request('/api/auth/change-password', oldToken, {
      method: 'POST', body: JSON.stringify({ current_password: 'wrong-password', new_password: newPassword }),
    }), env);
    assert.equal(incorrect.status, 403);
    assert.equal(user.session_version, 0, 'incorrect password must not invalidate sessions');
    const changed = await worker.fetch(request('/api/auth/change-password', oldToken, {
      method: 'POST', body: JSON.stringify({ current_password: oldPassword, new_password: newPassword }),
    }), env);
    assert.equal(changed.status, 200);
    assert.equal(user.session_version, 1);
    assert.equal((await worker.fetch(request('/api/auth/me', oldToken), env)).status, 401, 'old session must be rejected');
    assert.equal((await worker.fetch(request('/api/users/me/posts', oldToken), env)).status, 401, 'other authenticated APIs must reject old session');

    const login = await worker.fetch(new Request('https://example.test/api/auth/login', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: user.email, password: newPassword }),
    }), env);
    assert.equal(login.status, 200);
    const { token: newToken } = await login.json();
    assert.ok(newToken);
    assert.equal((await worker.fetch(request('/api/auth/me', newToken), env)).status, 200, 'new session must work');
    console.log('PASS: password changes revoke existing sessions and new login succeeds.');
  } finally {
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});