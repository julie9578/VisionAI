(() => {
  const API = 'https://arcade-board-api.nextarcade.workers.dev';
  const TOKEN_KEY = 'arcade-session-token';
  const token = () => localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  const status = document.getElementById('adminStatus');
  const consolePanel = document.getElementById('adminConsole');
  const list = document.getElementById('adminPostList');
  const resultStatus = document.getElementById('adminResultStatus');
  const categoryFilter = document.getElementById('adminCategory');
  const queryInput = document.getElementById('adminQuery');
  const pagination = document.getElementById('adminPagination');
  const commentsPanel = document.getElementById('adminComments');
  const commentList = document.getElementById('adminCommentList');
  const commentStatus = document.getElementById('adminCommentStatus');
  const labels = { free: '자유', recommend: '게임 추천', guide: '공략·팁', recruit: '모집', notice: '공지' };
  let page = 1;
  let totalPages = 1;

  function setStatus(element, message, success = false) {
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('success', success);
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]);
  }

  async function api(path, options = {}) {
    const headers = {
      accept: 'application/json',
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...(token() ? { authorization: `Bearer ${token()}` } : {}),
      ...(options.headers || {}),
    };
    const response = await fetch(`${API}${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error || `요청 실패 (${response.status})`);
      error.status = response.status;
      throw error;
    }
    return data;
  }

  function renderPagination() {
    const buttons = [];
    for (let number = 1; number <= totalPages; number += 1) {
      buttons.push(`<button class="admin-page-button ${number === page ? 'active' : ''}" type="button" data-page="${number}" ${number === page ? 'aria-current="page"' : ''}>${number}</button>`);
    }
    pagination.innerHTML = buttons.join('');
    pagination.querySelectorAll('[data-page]').forEach(button => button.addEventListener('click', () => {
      page = Number(button.dataset.page);
      loadPosts();
    }));
  }

  function renderPosts(posts) {
    if (!posts.length) {
      list.innerHTML = '<p class="admin-empty">관리할 게시글이 없습니다.</p>';
      return;
    }
    list.innerHTML = posts.map(post => `<article class="admin-post-card" data-post-id="${Number(post.id)}">
      <div class="admin-post-main"><div class="admin-post-heading"><span class="post-badge ${escapeHtml(post.category)}">${escapeHtml(labels[post.category] || '게시글')}</span><h2><a href="post.html?id=${Number(post.id)}">${escapeHtml(post.title)}</a></h2></div>
      <p class="admin-post-meta">작성자 ${escapeHtml(post.author)} · 댓글 ${Number(post.comments_count) || 0}개 · ${escapeHtml(new Intl.DateTimeFormat('ko-KR',{dateStyle:'medium'}).format(new Date(post.created_at)))}</p>
      <p class="admin-post-excerpt">${escapeHtml(post.content)}</p></div>
      <div class="admin-post-actions"><label class="visually-hidden" for="adminPostCategory${Number(post.id)}">게시글 카테고리 변경</label>
      <select id="adminPostCategory${Number(post.id)}" class="admin-post-category" aria-label="게시글 카테고리 변경">${Object.entries(labels).map(([value,label])=>`<option value="${value}" ${value===post.category?'selected':''}>${label}</option>`).join('')}</select>
      <button class="button secondary admin-change-category" type="button">카테고리 저장</button><button class="button secondary admin-open-comments" type="button">댓글 관리</button><button class="button danger admin-delete-post" type="button">게시글 삭제</button></div></article>`).join('');

    list.querySelectorAll('.admin-change-category').forEach(button => button.addEventListener('click', async () => {
      const card = button.closest('.admin-post-card');
      const select = card.querySelector('.admin-post-category');
      const original = button.textContent;
      button.disabled = true;
      button.textContent = '저장 중…';
      try {
        await api(`/api/admin/posts/${card.dataset.postId}/category`, { method: 'PUT', body: JSON.stringify({ category: select.value }) });
        setStatus(resultStatus, '게시글 카테고리를 변경했습니다.', true);
        await loadPosts();
      } catch (error) {
        setStatus(resultStatus, error.message);
        button.disabled = false;
        button.textContent = original;
      }
    }));

    list.querySelectorAll('.admin-delete-post').forEach(button => button.addEventListener('click', async () => {
      const card = button.closest('.admin-post-card');
      if (!window.confirm('이 게시글을 숨길까요? 복구 가능한 상태로 보관되며 일반 목록에서는 보이지 않습니다.')) return;
      button.disabled = true;
      try {
        await api(`/api/admin/posts/${card.dataset.postId}`, { method: 'DELETE' });
        setStatus(resultStatus, '게시글을 숨겼습니다. 게시글과 관련 반응 데이터는 보존됩니다.', true);
        await loadPosts();
        commentsPanel.hidden = true;
      } catch (error) {
        setStatus(resultStatus, error.message);
        button.disabled = false;
      }
    }));

    list.querySelectorAll('.admin-open-comments').forEach(button => button.addEventListener('click', async () => {
      const card = button.closest('.admin-post-card');
      commentsPanel.hidden = false;
      document.getElementById('adminCommentPostTitle').textContent = card.querySelector('h2').textContent;
      commentsPanel.dataset.postId = card.dataset.postId;
      await loadComments();
      commentsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
  }

  async function loadPosts() {
    list.setAttribute('aria-busy', 'true');
    setStatus(resultStatus, '게시글을 불러오는 중…');
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (categoryFilter.value) params.set('category', categoryFilter.value);
      if (queryInput.value.trim()) params.set('q', queryInput.value.trim());
      const data = await api(`/api/admin/posts?${params}`);
      totalPages = Math.max(1, Math.ceil((Number(data.total) || 0) / (Number(data.pageSize) || 20)));
      renderPosts(data.posts || []);
      renderPagination();
      setStatus(resultStatus, `${Number(data.total) || 0}개 게시글`);
    } catch (error) {
      setStatus(resultStatus, error.message);
      if ([401, 403].includes(error.status)) consoleConsoleRedirect();
    } finally {
      list.removeAttribute('aria-busy');
    }
  }

  function consoleConsoleRedirect() {
    consolePanel.hidden = true;
    window.location.replace(`login.html?next=${encodeURIComponent('admin.html')}`);
  }

  async function loadComments() {
    const postId = commentsPanel.dataset.postId;
    if (!postId) return;
    commentList.setAttribute('aria-busy', 'true');
    try {
      const data = await api(`/api/admin/posts/${postId}/comments`);
      const comments = data.comments || [];
      commentList.innerHTML = comments.length ? comments.map(comment => `<article class="admin-comment" data-comment-id="${Number(comment.id)}"><div><strong>${escapeHtml(comment.author)}</strong><time>${escapeHtml(new Intl.DateTimeFormat('ko-KR',{dateStyle:'medium',timeStyle:'short'}).format(new Date(comment.created_at)))}</time></div><p>${escapeHtml(comment.content)}</p><button class="button danger admin-delete-comment" type="button">댓글 삭제</button></article>`).join('') : '<p class="admin-empty">댓글이 없습니다.</p>';
      commentList.querySelectorAll('.admin-delete-comment').forEach(button => button.addEventListener('click', async () => {
        if (!window.confirm('이 댓글을 삭제할까요? 삭제한 댓글은 복구할 수 없습니다.')) return;
        const comment = button.closest('.admin-comment');
        button.disabled = true;
        try {
          await api(`/api/admin/comments/${comment.dataset.commentId}`, { method: 'DELETE' });
          setStatus(commentStatus, '댓글을 삭제했습니다.', true);
          await loadComments();
          await loadPosts();
        } catch (error) {
          setStatus(commentStatus, error.message);
          button.disabled = false;
        }
      }));
      setStatus(commentStatus, `${comments.length}개 댓글`);
    } catch (error) {
      setStatus(commentStatus, error.message);
    } finally {
      commentList.removeAttribute('aria-busy');
    }
  }

  document.getElementById('adminSearchForm').addEventListener('submit', event => {
    event.preventDefault();
    page = 1;
    loadPosts();
  });
  document.getElementById('closeAdminComments').addEventListener('click', () => { commentsPanel.hidden = true; });
  document.getElementById('adminLogout').addEventListener('click', () => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    window.location.replace('login.html');
  });

  (async () => {
    if (!token()) {
      consoleConsoleRedirect();
      return;
    }
    try {
      await api('/api/admin/posts?page=1');
      consolePanel.hidden = false;
      await loadPosts();
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      if (error.status === 403) {
        window.location.replace('board.html');
      } else {
        consoleConsoleRedirect();
      }
    }
  })();
})();