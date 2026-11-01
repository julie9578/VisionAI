const ALLOWED_CATEGORIES = new Set(["free", "recommend", "guide", "recruit", "notice"]);
const PAGE_SIZE = 20;
// Cloudflare Workers Web Crypto currently rejects PBKDF2 counts above 100,000.
const PASSWORD_ITERATIONS = 100000;
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  });
}

function corsHeaders(request, env) {
  const origin = request.headers.get("origin");
  const allowed = new Set((env.ALLOWED_ORIGINS || "").split(",").map((value) => value.trim()).filter(Boolean));
  if (origin && allowed.has(origin)) {
    return {
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "content-type, authorization",
      "access-control-max-age": "86400",
      vary: "Origin",
    };
  }
  return {};
}

function validOrigin(request, env) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const allowed = new Set((env.ALLOWED_ORIGINS || "").split(",").map((value) => value.trim()).filter(Boolean));
  return allowed.has(origin);
}

function toBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index];
  return difference === 0;
}

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: PASSWORD_ITERATIONS }, key, 256);
  return new Uint8Array(bits);
}

async function deriveEncryptionKey(secret) {
  const raw = fromBase64Url(secret);
  if (raw.length !== 32) throw new Error("ADDRESS_ENCRYPTION_KEY must decode to 32 bytes");
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function encryptAddress(address, secret) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveEncryptionKey(secret);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(address));
  return { ciphertext: toBase64Url(new Uint8Array(encrypted)), iv: toBase64Url(iv) };
}

async function signSession(userId, secret) {
  const header = toBase64Url(new TextEncoder().encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const now = Math.floor(Date.now() / 1000);
  const payload = toBase64Url(new TextEncoder().encode(JSON.stringify({ sub: String(userId), iat: now, exp: now + SESSION_TTL_SECONDS })));
  const unsigned = `${header}.${payload}`;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(unsigned));
  return `${unsigned}.${toBase64Url(new Uint8Array(signature))}`;
}

async function readSession(request, secret) {
  try {
    const token = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    const parts = token.split(".");
    if (parts.length !== 3 || !secret) return null;
    const unsigned = `${parts[0]}.${parts[1]}`;
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const valid = await crypto.subtle.verify("HMAC", key, fromBase64Url(parts[2]), new TextEncoder().encode(unsigned));
    if (!valid) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(parts[1])));
    if (!payload.sub || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return Number(payload.sub);
  } catch {
    return null;
  }
}

function publicUser(user) {
  return { id: user.id, nickname: user.nickname, email: user.email, gender: user.gender, created_at: user.created_at };
}

async function handleAuth(request, env, url, headers) {
  if (url.pathname === "/api/auth/signup" && request.method === "POST") {
    if (!env.ADDRESS_ENCRYPTION_KEY || !env.SESSION_SECRET) return json({ error: "회원 API 보안 키가 설정되지 않았습니다." }, 503, headers);
    let body;
    try { body = await request.json(); } catch { return json({ error: "JSON 요청 본문이 필요합니다." }, 400, headers); }
    const nickname = typeof body.nickname === "string" ? body.nickname.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const gender = typeof body.gender === "string" ? body.gender : "";
    const address = typeof body.address === "string" ? body.address.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (nickname.length < 2 || nickname.length > 30) return json({ error: "닉네임은 2~30자로 입력해 주세요." }, 400, headers);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return json({ error: "올바른 이메일 주소를 입력해 주세요." }, 400, headers);
    if (!["female", "male", "nonbinary", "prefer_not_to_say"].includes(gender)) return json({ error: "성별 항목을 선택해 주세요." }, 400, headers);
    if (address.length < 5 || address.length > 500) return json({ error: "집 주소는 5~500자로 입력해 주세요." }, 400, headers);
    if (password.length < 10 || password.length > 128) return json({ error: "비밀번호는 10~128자로 입력해 주세요." }, 400, headers);

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const passwordHash = await hashPassword(password, salt);
    const encryptedAddress = await encryptAddress(address, env.ADDRESS_ENCRYPTION_KEY);
    try {
      const inserted = await env.DB.prepare("INSERT INTO users (nickname, email, gender, address_ciphertext, address_iv, password_hash, password_salt) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind(nickname, email, gender, encryptedAddress.ciphertext, encryptedAddress.iv, toBase64Url(passwordHash), toBase64Url(salt)).run();
      const user = await env.DB.prepare("SELECT id, nickname, email, gender, created_at FROM users WHERE id = ?").bind(inserted.meta.last_row_id).first();
      const token = await signSession(user.id, env.SESSION_SECRET);
      return json({ user, token }, 201, headers);
    } catch (error) {
      if (String(error.message).toLowerCase().includes("unique")) return json({ error: "이 이메일은 이미 가입되어 있습니다." }, 409, headers);
      throw error;
    }
  }

  if (url.pathname === "/api/auth/login" && request.method === "POST") {
    if (!env.SESSION_SECRET) return json({ error: "회원 API 보안 키가 설정되지 않았습니다." }, 503, headers);
    let body;
    try { body = await request.json(); } catch { return json({ error: "JSON 요청 본문이 필요합니다." }, 400, headers); }
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const user = await env.DB.prepare("SELECT id, nickname, email, gender, password_hash, password_salt, created_at FROM users WHERE email = ?").bind(email).first();
    if (!user || !password) return json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, 401, headers);
    const candidate = await hashPassword(password, fromBase64Url(user.password_salt));
    const expected = fromBase64Url(user.password_hash);
    if (!constantTimeEqual(candidate, expected)) {
      return json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, 401, headers);
    }
    await env.DB.prepare("UPDATE users SET last_login_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?").bind(user.id).run();
    return json({ user: publicUser(user), token: await signSession(user.id, env.SESSION_SECRET) }, 200, headers);
  }

  if (url.pathname === "/api/auth/me" && request.method === "GET") {
    const userId = await readSession(request, env.SESSION_SECRET);
    if (!userId) return json({ error: "로그인이 필요합니다." }, 401, headers);
    const user = await env.DB.prepare("SELECT id, nickname, email, gender, created_at FROM users WHERE id = ?").bind(userId).first();
    return user ? json({ user: publicUser(user) }, 200, headers) : json({ error: "사용자를 찾을 수 없습니다." }, 404, headers);
  }

  return null;
}

async function handleApi(request, env, url) {
  if (!env.DB) return json({ error: "게시판 데이터베이스가 설정되지 않았습니다." }, 503);
  const headers = corsHeaders(request, env);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }
  if (!validOrigin(request, env)) return json({ error: "허용되지 않은 요청 출처입니다." }, 403, headers);

  if (url.pathname.startsWith("/api/auth/")) {
    const authResponse = await handleAuth(request, env, url, headers);
    if (authResponse) return authResponse;
  }

  if (url.pathname.startsWith("/api/auth/")) {
    const authResponse = await handleAuth(request, env, url, headers);
    if (authResponse) return authResponse;
  }

  if (url.pathname === "/api/posts" && request.method === "GET") {
    const page = Math.max(1, Math.min(10000, Number.parseInt(url.searchParams.get("page") || "1", 10) || 1));
    const category = url.searchParams.get("category") || "";
    const query = (url.searchParams.get("q") || "").trim().slice(0, 100);
    if (category && !ALLOWED_CATEGORIES.has(category)) return json({ error: "올바르지 않은 분류입니다." }, 400, headers);

    const conditions = ["deleted_at IS NULL"];
    const values = [];
    if (category) { conditions.push("category = ?"); values.push(category); }
    if (query) { conditions.push("(title LIKE ? ESCAPE '\\' OR content LIKE ? ESCAPE '\\')"); const escaped = `%${query.replace(/[\\%_]/g, "\\$&")}%`; values.push(escaped, escaped); }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const offset = (page - 1) * PAGE_SIZE;
    const [count, result] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) AS total FROM posts ${where}`).bind(...values).first(),
      env.DB.prepare(`SELECT id, category, title, content, author, created_at, updated_at, deleted_at FROM posts ${where} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`).bind(...values, PAGE_SIZE, offset).all(),
    ]);
    return json({ posts: result.results, page, pageSize: PAGE_SIZE, total: count.total }, 200, headers);
  }

  const singleMatch = url.pathname.match(/^\/api\/posts\/(\d+)$/);
  if (singleMatch && request.method === "GET") {
    const post = await env.DB.prepare("SELECT id, category, title, content, author, created_at, updated_at, deleted_at FROM posts WHERE id = ? AND deleted_at IS NULL").bind(Number(singleMatch[1])).first();
    return post ? json({ post }, 200, headers) : json({ error: "게시글을 찾을 수 없습니다." }, 404, headers);
  }

  if (url.pathname === "/api/posts" && request.method === "POST") {
    let body;
    try { body = await request.json(); }
    catch { return json({ error: "JSON 요청 본문이 필요합니다." }, 400, headers); }
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const author = typeof body.author === "string" ? body.author.trim() : "";
    if (!ALLOWED_CATEGORIES.has(category)) return json({ error: "올바른 게시글 분류를 선택해 주세요." }, 400, headers);
    if (!title || title.length > 160) return json({ error: "제목은 1~160자로 입력해 주세요." }, 400, headers);
    if (!content || content.length > 10000) return json({ error: "내용은 1~10,000자로 입력해 주세요." }, 400, headers);
    if (!author || author.length > 40) return json({ error: "작성자 이름은 1~40자로 입력해 주세요." }, 400, headers);

    const result = await env.DB.prepare("INSERT INTO posts (category, title, content, author) VALUES (?, ?, ?, ?)").bind(category, title, content, author).run();
    const post = await env.DB.prepare("SELECT id, category, title, content, author, created_at, updated_at, deleted_at FROM posts WHERE id = ?").bind(result.meta.last_row_id).first();
    return json({ post }, 201, headers);
  }

  return json({ error: "지원하지 않는 API 경로 또는 메서드입니다." }, 404, headers);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return handleApi(request, env, url);
    return json({ error: "이 Worker는 게시판 API 전용입니다." }, 404);
  },
};