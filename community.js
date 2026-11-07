(() => {
  const API = 'https://arcade-board-api.nextarcade.workers.dev';
  const TOKEN_KEY = 'arcade-session-token';
  const token = () => sessionStorage.getItem(TOKEN_KEY);
  const headers = (withJson = false) => ({
    accept: 'application/json',
    ...(withJson ? { 'content-type': 'application/json' } : {}),
    ...(token() ? { authorization: `Bearer ${token()}` } : {}),
  });

  function setMessage(element, text, success = false) {
    if (!element) return;
    element.textContent = text;
    element.classList.toggle('success', success);
  }

  async function api(path, options = {}) {
    const response = await fetch(`${API}${path}`, { ...options, headers: { ...headers(Boolean(options.body)), ...(options.headers || {}) } });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `요청에 실패했습니다 (${response.status}).`);
    return result;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  function formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }

  async function initializeWritePage() {
    const editor = document.getElementById('editorPanel');
    const loginRequired = document.getElementById('writeLoginRequired');
    const message = document.getElementById('writeMessage');
    if (!token()) {
      loginRequired.hidden = false;
      return;
    }
    try {
      const me = await api('/api/auth/me');
      editor.hidden = false;
      editor.querySelector('.editor-hint').textContent = `작성자: ${me.user.nickname} · 최대 10,000자`;
    } catch {
      sessionStorage.removeItem(TOKEN_KEY);
      loginRequired.hidden = false;
      return;
    }

    document.getElementById('writeForm').addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget;
      const submit = form.querySelector('[type="submit"]');
      const values = new FormData(form);
      submit.disabled = true;
      setMessage(message, '게시글을 저장하는 중…');
      try {
        const result = await api('/api/posts', {
          method: 'POST',
          body: JSON.stringify({ category: values.get('category'), title: values.get('title'), content: values.get('content') }),
        });
        window.location.assign(`post.html?id=${encodeURIComponent(result.post.id)}`);
      } catch (error) {
        setMessage(message, error.message);
      } finally {
        submit.disabled = false;
      }
    });
  }

  async function initializePostPage() {
    const status = document.getElementById('postStatus');
    const content = document.getElementById('postContent');
    const commentsPanel = document.getElementById('commentsPanel');
    const commentList = document.getElementById('commentList');
    const commentMessage = document.getElementById('commentMessage');
    const postId = new URLSearchParams(window.location.search).get('id');
    if (!/^\d+$/.test(postId || '')) {
      setMessage(status, '올바르지 않은 게시글 주소입니다.');
      return;
    }

    function renderComments(comments) {
      document.getElementById('commentCount').textContent = String(comments.length);
      commentList.innerHTML = comments.length ? comments.map(comment => `<article class="comment-item"><div class="comment-meta"><a class="comment-author-link" href="user.html?id=${encodeURIComponent(comment.author_id)}">${escapeHtml(comment.author)}</a><time>${escapeHtml(formatDate(comment.created_at))}</time></div><p class="comment-content">${escapeHtml(comment.content)}</p></article>`).join('') : '<p class="empty-comments">아직 댓글이 없습니다.</p>';
    }

    async function loadComments() {
      const data = await api(`/api/posts/${postId}/comments`);
      renderComments(data.comments || []);
    }

    try {
      const data = await api(`/api/posts/${postId}`);
      const post = data.post;
      if (!post) throw new Error('게시글을 찾을 수 없습니다.');
      document.title = `${post.title} — 게시판 | ARCADE`;
      status.textContent = '';
      content.hidden = false;
      commentsPanel.hidden = false;
      const authorLink = post.author_id ? `user.html?id=${encodeURIComponent(post.author_id)}` : `user.html?name=${encodeURIComponent(post.author)}`;
      content.innerHTML = `<span class="post-detail-category">${escapeHtml(({ notice: '공지', free: '자유', recommend: '게임 추천', guide: '공략·팁', recruit: '모집' })[post.category] || post.category)}</span><h1 class="post-detail-title">${escapeHtml(post.title)}</h1><div class="post-detail-meta"><a href="${authorLink}">${escapeHtml(post.author)}</a><time>${escapeHtml(formatDate(post.created_at))}</time><span>댓글 ${Number(post.comments_count) || 0}</span></div><div class="post-detail-content">${escapeHtml(post.content)}</div><div class="post-action-row"><button class="post-action-button ${post.liked_by_me ? 'active' : ''}" type="button" id="likePostButton" aria-pressed="${Boolean(post.liked_by_me)}">♥ 좋아요 <span>${Number(post.likes_count) || 0}</span></button><button class="post-action-button ${post.bookmarked_by_me ? 'active' : ''}" type="button" id="bookmarkPostButton" aria-pressed="${Boolean(post.bookmarked_by_me)}">▣ 북마크 <span>${Number(post.bookmarks_count) || 0}</span></button></div>`;
      await loadComments();

      for (const [buttonId, kind] of [['likePostButton', 'like'], ['bookmarkPostButton', 'bookmark']]) {
        document.getElementById(buttonId).addEventListener('click', async event => {
          if (!token()) {
            window.location.assign('login.html?next=' + encodeURIComponent(`post.html?id=${postId}`));
            return;
          }
          const button = event.currentTarget;
          const method = button.getAttribute('aria-pressed') === 'true' ? 'DELETE' : 'PUT';
          button.disabled = true;
          try {
            await api(`/api/posts/${postId}/${kind}`, { method });
            window.location.reload();
          } catch (error) { setMessage(status, error.message); }
          finally { button.disabled = false; }
        });
      }

      document.getElementById('commentForm').addEventListener('submit', async event => {
        event.preventDefault();
        if (!token()) {
          window.location.assign('login.html?next=' + encodeURIComponent(`post.html?id=${postId}`));
          return;
        }
        const form = event.currentTarget;
        const button = form.querySelector('[type="submit"]');
        const textarea = document.getElementById('commentContent');
        button.disabled = true;
        setMessage(commentMessage, '댓글을 등록하는 중…');
        try {
          await api(`/api/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ content: textarea.value }) });
          textarea.value = '';
          setMessage(commentMessage, '댓글을 등록했습니다.', true);
          await loadComments();
        } catch (error) { setMessage(commentMessage, error.message); }
        finally { button.disabled = false; }
      });
    } catch (error) {
      setMessage(status, error.message || '게시글을 불러오지 못했습니다.');
    }
  }

  async function initializeUserPage() {
    const status = document.getElementById('userStatus');
    const params = new URLSearchParams(window.location.search);
    const fallbackName = params.get('name');
    const card = document.getElementById('userProfile');
    const userId = params.get('id');
    const nickname = fallbackName;
    try {
      const endpoint = userId ? `/api/users/${encodeURIComponent(userId)}` : `/api/users?nickname=${encodeURIComponent(nickname || '')}`;
      const data = await api(endpoint);
      const user = data.user;
      card.hidden = false;
      status.textContent = '';
      document.title = `${user.nickname} — 플레이어 프로필 | ARCADE`;
      document.getElementById('userNickname').textContent = user.nickname;
      document.getElementById('userAvatar').textContent = user.nickname.slice(0, 2).toUpperCase();
      document.getElementById('userAvatar').dataset.color = user.avatar_color || 'violet';
      document.getElementById('userBio').textContent = user.bio || '아직 자기소개가 없습니다.';
      document.getElementById('userMemberSince').textContent = `가입일 ${formatDate(user.created_at)}`;
    } catch (error) {
      if (!userId && fallbackName) {
        card.hidden = false;
        document.getElementById('userNickname').textContent = fallbackName;
        document.getElementById('userAvatar').textContent = fallbackName.slice(0, 2).toUpperCase();
        document.getElementById('userBio').textContent = '이 작성자의 계정은 아직 ARCADE 회원으로 등록되지 않아 공개 프로필 정보가 없습니다.';
        document.getElementById('userMemberSince').textContent = '회원 프로필 정보 없음';
        status.textContent = '';
        return;
      }
      setMessage(status, error.message || '프로필을 불러오지 못했습니다.');
    }
  }

  if (document.getElementById('editorPanel')) initializeWritePage();
  if (document.getElementById('postContent')) initializePostPage();
  if (document.getElementById('userProfile')) initializeUserPage();
})();