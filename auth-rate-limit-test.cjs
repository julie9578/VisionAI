const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const os = require('node:os');

async function run() {
  const source = fs.readFileSync(path.join(__dirname, 'src', 'worker.js'), 'utf8');
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'visionai-auth-rate-test-'));
  const workerPath = path.join(temporaryDirectory, 'worker.mjs');
  fs.writeFileSync(workerPath, source);

  try {
    const { default: worker } = await import(pathToFileURL(workerPath).href);
    let dbReads = 0;
    const db = {
      prepare() {
        return {
          bind() {
            return {
              async first() { dbReads += 1; return null; },
            };
          },
        };
      },
    };
    const baseEnv = {
      DB: db,
      SESSION_SECRET: 'isolated-test-secret',
      ALLOWED_ORIGINS: 'https://visionai-arcade.pages.dev',
    };
    const makeLimiter = (status, retryAfter) => ({
      idFromName: value => value,
      get: () => ({
        fetch: async () => new Response(null, {
          status,
          headers: retryAfter ? { 'retry-after': retryAfter } : {},
        }),
      }),
    });
    const request = (endpoint, method = 'POST') => new Request(`https://example.test${endpoint}`, {
      method,
      headers: { origin: 'https://visionai-arcade.pages.dev', 'content-type': 'application/json' },
      ...(method === 'POST' ? { body: JSON.stringify({ email: 'nobody@example.test', password: 'not-a-real-password' }) } : {}),
    });

    for (const endpoint of ['/api/auth/login', '/api/auth/signup']) {
      for (const [name, limiter] of [
        ['missing binding', undefined],
        ['limiter 503', makeLimiter(503)],
        ['unexpected limiter 200', makeLimiter(200)],
        ['limiter exception', { idFromName: () => 'id', get: () => ({ fetch: async () => { throw new Error('test failure'); } }) }],
      ]) {
        dbReads = 0;
        const response = await worker.fetch(request(endpoint), { ...baseEnv, AUTH_RATE_LIMITER: limiter });
        assert.equal(response.status, 503, `${endpoint}: ${name} must fail closed`);
        assert.equal(dbReads, 0, `${endpoint}: ${name} must not query authentication data`);
        assert.equal(response.headers.get('access-control-allow-origin'), 'https://visionai-arcade.pages.dev');
        assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
      }

      dbReads = 0;
      const limited = await worker.fetch(request(endpoint), { ...baseEnv, AUTH_RATE_LIMITER: makeLimiter(429, '37') });
      assert.equal(limited.status, 429);
      assert.equal(limited.headers.get('retry-after'), '37');
      assert.equal(dbReads, 0);
    }

    dbReads = 0;
    const allowed = await worker.fetch(request('/api/auth/login'), { ...baseEnv, AUTH_RATE_LIMITER: makeLimiter(204) });
    assert.equal(allowed.status, 401, '204 must allow the normal login handler to reject an unknown account');
    assert.equal(dbReads, 1);

    const unrelated = await worker.fetch(request('/api/not-found', 'GET'), { ...baseEnv });
    assert.equal(unrelated.status, 404, 'unrelated API requests must not require the limiter');
    console.log('PASS: authentication rate limiting fails closed and preserves normal 204/429 behavior.');
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});