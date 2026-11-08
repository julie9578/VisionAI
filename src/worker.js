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
      "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
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
  return { id: user.id, nickname: user.nickname, email: user.email, gender: user.gender, bio: user.bio || "", avatar_color: user.avatar_color || "violet", avatar_image: user.avatar_image || null, created_at: user.created_at };
}

function isValidNickname(nickname) {
  return /^[가-힣A-Za-z]+$/u.test(nickname) && new TextEncoder().encode(nickname).length >= 2 && new TextEncoder().encode(nickname).length <= 20;
}

async function handleAuth(request, env, url, headers) {
  if (url.pathname === "/api/auth/nickname-availability" && request.method === "GET") {
    const nickname = (url.searchParams.get("nickname") || "").trim();
    if (!isValidNickname(nickname)) return json({ available: false, error: "닉네임은 한글과 영문 대소문자만 사용해 2~20바이트로 입력해 주세요." }, 400, headers);
    const existing = await env.DB.prepare("SELECT 1 AS found FROM users WHERE nickname = ? COLLATE NOCASE LIMIT 1").bind(nickname).first();
    return json({ available: !existing }, 200, headers);
  }

  if (url.pathname === "/api/auth/signup" && request.method === "POST") {
    if (!env.SESSION_SECRET) return json({ error: "회원 API 보안 키가 설정되지 않았습니다." }, 503, headers);
    let body;
    try { body = await request.json(); } catch { return json({ error: "JSON 요청 본문이 필요합니다." }, 400, headers); }
    const nickname = typeof body.nickname === "string" ? body.nickname.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const gender = typeof body.gender === "string" ? body.gender : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!isValidNickname(nickname)) return json({ error: "닉네임은 한글과 영문 대소문자만 사용해 2~20바이트로 입력해 주세요." }, 400, headers);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return json({ error: "올바른 이메일 주소를 입력해 주세요." }, 400, headers);
    if (!["female", "male", "nonbinary", "prefer_not_to_say"].includes(gender)) return json({ error: "성별 항목을 선택해 주세요." }, 400, headers);
    if (password.length < 10 || password.length > 128) return json({ error: "비밀번호는 10~128자로 입력해 주세요." }, 400, headers);

    const duplicate = await env.DB.prepare("SELECT 1 AS found FROM users WHERE nickname = ? COLLATE NOCASE LIMIT 1").bind(nickname).first();
    if (duplicate) return json({ error: "이미 사용 중인 닉네임입니다." }, 409, headers);

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const passwordHash = await hashPassword(password, salt);
    try {
      const inserted = await env.DB.prepare("INSERT INTO users (nickname, email, gender, address_ciphertext, address_iv, password_hash, password_salt) VALUES (?, ?, ?, '', '', ?, ?)")
        .bind(nickname, email, gender, toBase64Url(passwordHash), toBase64Url(salt)).run();
      const user = await env.DB.prepare("SELECT id, nickname, email, gender, bio, avatar_color, avatar_image, created_at FROM users WHERE id = ?").bind(inserted.meta.last_row_id).first();
      const token = await signSession(user.id, env.SESSION_SECRET);
      return json({ user, token }, 201, headers);
    } catch (error) {
      if (String(error.message).toLowerCase().includes("unique")) {
        if (String(error.message).toLowerCase().includes("nickname")) return json({ error: "이미 사용 중인 닉네임입니다." }, 409, headers);
        return json({ error: "이 이메일은 이미 가입되어 있습니다." }, 409, headers);
      }
      throw error;
    }
  }

  if (url.pathname === "/api/auth/login" && request.method === "POST") {
    if (!env.SESSION_SECRET) return json({ error: "회원 API 보안 키가 설정되지 않았습니다." }, 503, headers);
    let body;
    try { body = await request.json(); } catch { return json({ error: "JSON 요청 본문이 필요합니다." }, 400, headers); }
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const user = await env.DB.prepare("SELECT id, nickname, email, gender, bio, avatar_color, avatar_image, password_hash, password_salt, created_at FROM users WHERE email = ?").bind(email).first();
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
    const user = await env.DB.prepare("SELECT id, nickname, email, gender, bio, avatar_color, avatar_image, created_at FROM users WHERE id = ?").bind(userId).first();
    return user ? json({ user: publicUser(user) }, 200, headers) : json({ error: "사용자를 찾을 수 없습니다." }, 404, headers);
  }

  if (url.pathname === "/api/auth/me" && request.method === "PUT") {
    const userId = await readSession(request, env.SESSION_SECRET);
    if (!userId) return json({ error: "로그인이 필요합니다." }, 401, headers);
    let body;
    try { body = await request.json(); }
    catch { return json({ error: "JSON 요청 본문이 필요합니다." }, 400, headers); }
    const nickname = typeof body.nickname === "string" ? body.nickname.trim() : "";
    const gender = typeof body.gender === "string" ? body.gender : "";
    const bio = typeof body.bio === "string" ? body.bio.trim() : "";
    const avatarColor = typeof body.avatar_color === "string" ? body.avatar_color : "violet";
    const avatarImage = body.avatar_image === null || body.avatar_image === "" ? null : typeof body.avatar_image === "string" ? body.avatar_image : undefined;
    if (!isValidNickname(nickname)) return json({ error: "닉네임은 한글과 영문 대소문자만 사용해 2~20바이트로 입력해 주세요." }, 400, headers);
    if (!["female", "male", "nonbinary", "prefer_not_to_say"].includes(gender)) return json({ error: "성별 항목을 선택해 주세요." }, 400, headers);
    if (bio.length > 240) return json({ error: "소개는 240자 이내로 입력해 주세요." }, 400, headers);
    if (!["violet", "cyan", "rose", "amber"].includes(avatarColor)) return json({ error: "올바르지 않은 아바타 색상입니다." }, 400, headers);
    if (avatarImage === undefined || (avatarImage !== null && (!/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(avatarImage) || avatarImage.length > 120000))) return json({ error: "프로필 이미지는 JPG, PNG 또는 WebP 형식의 90KB 이하 파일이어야 합니다." }, 400, headers);

    const duplicate = await env.DB.prepare("SELECT 1 AS found FROM users WHERE nickname = ? COLLATE NOCASE AND id != ? LIMIT 1").bind(nickname, userId).first();
    if (duplicate) return json({ error: "이미 사용 중인 닉네임입니다." }, 409, headers);
    await env.DB.prepare("UPDATE users SET nickname = ?, gender = ?, bio = ?, avatar_color = ?, avatar_image = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?").bind(nickname, gender, bio, avatarColor, avatarImage, userId).run();
    const user = await env.DB.prepare("SELECT id, nickname, email, gender, bio, avatar_color, avatar_image, created_at FROM users WHERE id = ?").bind(userId).first();
    return user ? json({ user: publicUser(user) }, 200, headers) : json({ error: "사용자를 찾을 수 없습니다." }, 404, headers);
  }

  if (url.pathname === "/api/auth/change-password" && request.method === "POST") {
    const userId = await readSession(request, env.SESSION_SECRET);
    if (!userId) return json({ error: "로그인이 필요합니다." }, 401, headers);
    let body;
    try { body = await request.json(); }
    catch { return json({ error: "JSON 요청 본문이 필요합니다." }, 400, headers); }

    const currentPassword = typeof body.current_password === "string" ? body.current_password : "";
    const newPassword = typeof body.new_password === "string" ? body.new_password : "";
    if (!currentPassword) return json({ error: "현재 비밀번호를 입력해 주세요." }, 400, headers);
    if (newPassword.length < 10 || newPassword.length > 128) {
      return json({ error: "새 비밀번호는 10~128자로 입력해 주세요." }, 400, headers);
    }
    if (currentPassword === newPassword) {
      return json({ error: "새 비밀번호는 현재 비밀번호와 달라야 합니다." }, 400, headers);
    }

    const user = await env.DB.prepare("SELECT password_hash, password_salt FROM users WHERE id = ?").bind(userId).first();
    if (!user) return json({ error: "사용자를 찾을 수 없습니다." }, 404, headers);
    const currentHash = await hashPassword(currentPassword, fromBase64Url(user.password_salt));
    if (!constantTimeEqual(currentHash, fromBase64Url(user.password_hash))) {
      return json({ error: "현재 비밀번호가 올바르지 않습니다." }, 403, headers);
    }

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const passwordHash = await hashPassword(newPassword, salt);
    await env.DB.prepare("UPDATE users SET password_hash = ?, password_salt = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?")
      .bind(toBase64Url(passwordHash), toBase64Url(salt), userId)
      .run();
    return json({ ok: true }, 200, headers);
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

  const publicUserMatch = url.pathname.match(/^\/api\/users\/(\d+)$/);
  if (publicUserMatch && request.method === "GET") {
    const user = await env.DB.prepare("SELECT id, nickname, bio, avatar_color, created_at FROM users WHERE id = ?").bind(Number(publicUserMatch[1])).first();
    return user ? json({ user }, 200, headers) : json({ error: "사용자를 찾을 수 없습니다." }, 404, headers);
  }
  if (url.pathname === "/api/users" && request.method === "GET") {
    const nickname = (url.searchParams.get("nickname") || "").trim().slice(0, 30);
    if (!nickname) return json({ error: "닉네임이 필요합니다." }, 400, headers);
    const user = await env.DB.prepare("SELECT id, nickname, bio, avatar_color, created_at FROM users WHERE nickname = ? COLLATE NOCASE").bind(nickname).first();
    return user ? json({ user }, 200, headers) : json({ error: "사용자를 찾을 수 없습니다." }, 404, headers);
  }

  if (url.pathname === "/api/users/me/posts" && request.method === "GET") {
    const userId = await readSession(request, env.SESSION_SECRET);
    if (!userId) return json({ error: "로그인이 필요합니다." }, 401, headers);
    const result = await env.DB.prepare("SELECT id, category, title, author, created_at FROM posts WHERE author_id = ? AND deleted_at IS NULL ORDER BY created_at DESC, id DESC LIMIT 100").bind(userId).all();
    return json({ posts: result.results }, 200, headers);
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
    const viewerId = await readSession(request, env.SESSION_SECRET);
    const [count, result] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) AS total FROM posts ${where}`).bind(...values).first(),
      env.DB.prepare(`SELECT p.id, p.category, p.title, p.content, p.author, p.author_id, p.created_at, p.updated_at, p.deleted_at,
        (SELECT COUNT(*) FROM post_interactions i WHERE i.post_id = p.id AND i.interaction_type = 'comment') AS comments_count,
        (SELECT COUNT(*) FROM post_interactions i WHERE i.post_id = p.id AND i.interaction_type = 'like') AS likes_count,
        (SELECT COUNT(*) FROM post_interactions i WHERE i.post_id = p.id AND i.interaction_type = 'bookmark') AS bookmarks_count,
        CASE WHEN ? IS NULL THEN 0 ELSE EXISTS(SELECT 1 FROM post_interactions i WHERE i.post_id = p.id AND i.user_id = ? AND i.interaction_type = 'like') END AS liked_by_me,
        CASE WHEN ? IS NULL THEN 0 ELSE EXISTS(SELECT 1 FROM post_interactions i WHERE i.post_id = p.id AND i.user_id = ? AND i.interaction_type = 'bookmark') END AS bookmarked_by_me
        FROM posts p ${where} ORDER BY p.created_at DESC, p.id DESC LIMIT ? OFFSET ?`).bind(viewerId, viewerId, viewerId, viewerId, ...values, PAGE_SIZE, offset).all(),
    ]);
    return json({ posts: result.results, page, pageSize: PAGE_SIZE, total: count.total }, 200, headers);
  }

  const commentsMatch = url.pathname.match(/^\/api\/posts\/(\d+)\/comments$/);
  if (commentsMatch && request.method === "GET") {
    const postId = Number(commentsMatch[1]);
    const post = await env.DB.prepare("SELECT id FROM posts WHERE id = ? AND deleted_at IS NULL").bind(postId).first();
    if (!post) return json({ error: "게시글을 찾을 수 없습니다." }, 404, headers);
    const comments = await env.DB.prepare("SELECT i.id, i.content, i.created_at, u.id AS author_id, u.nickname AS author FROM post_interactions i JOIN users u ON u.id = i.user_id WHERE i.post_id = ? AND i.interaction_type = 'comment' ORDER BY i.created_at ASC, i.id ASC").bind(postId).all();
    return json({ comments: comments.results }, 200, headers);
  }

  if (commentsMatch && request.method === "POST") {
    const userId = await readSession(request, env.SESSION_SECRET);
    if (!userId) return json({ error: "댓글 작성은 로그인 후 이용할 수 있습니다." }, 401, headers);
    let body;
    try { body = await request.json(); } catch { return json({ error: "JSON 요청 본문이 필요합니다." }, 400, headers); }
    const content = typeof body.content === "string" ? body.content.trim() : "";
    if (!content || content.length > 2000) return json({ error: "댓글은 1~2,000자로 입력해 주세요." }, 400, headers);
    const postId = Number(commentsMatch[1]);
    const result = await env.DB.prepare("INSERT INTO post_interactions (post_id, user_id, interaction_type, content) SELECT id, ?, 'comment', ? FROM posts WHERE id = ? AND deleted_at IS NULL").bind(userId, content, postId).run();
    if (!result.meta.changes) return json({ error: "게시글을 찾을 수 없습니다." }, 404, headers);
    return json({ ok: true, id: result.meta.last_row_id }, 201, headers);
  }

  const reactionMatch = url.pathname.match(/^\/api\/posts\/(\d+)\/(like|bookmark)$/);
  if (reactionMatch && ["PUT", "DELETE"].includes(request.method)) {
    const userId = await readSession(request, env.SESSION_SECRET);
    if (!userId) return json({ error: "좋아요와 북마크는 로그인 후 이용할 수 있습니다." }, 401, headers);
    const postId = Number(reactionMatch[1]);
    const interactionType = reactionMatch[2];
    const post = await env.DB.prepare("SELECT id FROM posts WHERE id = ? AND deleted_at IS NULL").bind(postId).first();
    if (!post) return json({ error: "게시글을 찾을 수 없습니다." }, 404, headers);
    if (request.method === "PUT") {
      await env.DB.prepare("INSERT OR IGNORE INTO post_interactions (post_id, user_id, interaction_type) VALUES (?, ?, ?)").bind(postId, userId, interactionType).run();
    } else {
      await env.DB.prepare("DELETE FROM post_interactions WHERE post_id = ? AND user_id = ? AND interaction_type = ?").bind(postId, userId, interactionType).run();
    }
    return json({ ok: true, active: request.method === "PUT" }, 200, headers);
  }

  const singleMatch = url.pathname.match(/^\/api\/posts\/(\d+)$/);
  if (singleMatch && request.method === "GET") {
    const postId = Number(singleMatch[1]);
    const viewerId = await readSession(request, env.SESSION_SECRET);
    const post = await env.DB.prepare(`SELECT p.id, p.category, p.title, p.content, p.author, p.author_id, p.created_at, p.updated_at, p.deleted_at,
      (SELECT COUNT(*) FROM post_interactions i WHERE i.post_id = p.id AND i.interaction_type = 'comment') AS comments_count,
      (SELECT COUNT(*) FROM post_interactions i WHERE i.post_id = p.id AND i.interaction_type = 'like') AS likes_count,
      (SELECT COUNT(*) FROM post_interactions i WHERE i.post_id = p.id AND i.interaction_type = 'bookmark') AS bookmarks_count,
      CASE WHEN ? IS NULL THEN 0 ELSE EXISTS(SELECT 1 FROM post_interactions i WHERE i.post_id = p.id AND i.user_id = ? AND i.interaction_type = 'like') END AS liked_by_me,
      CASE WHEN ? IS NULL THEN 0 ELSE EXISTS(SELECT 1 FROM post_interactions i WHERE i.post_id = p.id AND i.user_id = ? AND i.interaction_type = 'bookmark') END AS bookmarked_by_me
      FROM posts p WHERE p.id = ? AND p.deleted_at IS NULL`).bind(viewerId, viewerId, viewerId, viewerId, postId).first();
    return post ? json({ post }, 200, headers) : json({ error: "게시글을 찾을 수 없습니다." }, 404, headers);
  }

  if (url.pathname === "/api/posts" && request.method === "POST") {
    const userId = await readSession(request, env.SESSION_SECRET);
    if (!userId) return json({ error: "게시글 작성은 로그인 후 이용할 수 있습니다." }, 401, headers);
    let body;
    try { body = await request.json(); }
    catch { return json({ error: "JSON 요청 본문이 필요합니다." }, 400, headers); }
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    if (!ALLOWED_CATEGORIES.has(category)) return json({ error: "올바른 게시글 분류를 선택해 주세요." }, 400, headers);
    if (!title || title.length > 160) return json({ error: "제목은 1~160자로 입력해 주세요." }, 400, headers);
    if (!content || content.length > 10000) return json({ error: "내용은 1~10,000자로 입력해 주세요." }, 400, headers);
    const authorUser = await env.DB.prepare("SELECT nickname FROM users WHERE id = ?").bind(userId).first();
    if (!authorUser) return json({ error: "사용자 계정을 찾을 수 없습니다." }, 401, headers);

    const result = await env.DB.prepare("INSERT INTO posts (category, title, content, author, author_id) VALUES (?, ?, ?, ?, ?)").bind(category, title, content, authorUser.nickname, userId).run();
    const post = await env.DB.prepare("SELECT id, category, title, content, author, author_id, created_at, updated_at, deleted_at FROM posts WHERE id = ?").bind(result.meta.last_row_id).first();
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