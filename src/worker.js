const ALLOWED_CATEGORIES = new Set(["free", "recommend", "guide", "recruit", "notice"]);
const PAGE_SIZE = 20;

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
      "access-control-allow-headers": "content-type",
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

async function handleApi(request, env, url) {
  if (!env.DB) return json({ error: "게시판 데이터베이스가 설정되지 않았습니다." }, 503);
  const headers = corsHeaders(request, env);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }
  if (!validOrigin(request, env)) return json({ error: "허용되지 않은 요청 출처입니다." }, 403, headers);

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