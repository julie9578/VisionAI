(() => {
  const API = 'https://arcade-board-api.nextarcade.workers.dev';
  const TOKEN_KEY = 'arcade-session-token';
  const token = () => localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
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

  function renderUserAvatar(element, user) {
    const nickname = user.nickname || 'AR';
    const fallback = nickname.slice(0, 2).toUpperCase();
    element.dataset.color = user.avatar_color || 'violet';
    element.replaceChildren();
    if (!user.avatar_image) {
      element.textContent = fallback;
      return;
    }
    const image = document.createElement('img');
    image.className = 'user-profile-avatar-image';
    image.src = user.avatar_image;
    image.alt = `${nickname} 프로필 사진`;
    image.addEventListener('error', () => {
      image.remove();
      element.textContent = fallback;
    }, { once: true });
    element.append(image);
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
      localStorage.removeItem(TOKEN_KEY);
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
    const postParams = new URLSearchParams(window.location.search);
    const postId = postParams.get('id');
    const showDeletedPost = postParams.get('deleted') === '1';
    if (!/^\d+$/.test(postId || '')) {
      setMessage(status, '올바르지 않은 게시글 주소입니다.');
      return;
    }

    function renderComments(comments) {
      document.getElementById('commentCount').textContent = String(comments.length);
      const viewerId = Number(window.__arcadeViewerId) || 0;
      commentList.innerHTML = comments.length ? comments.map(comment => {
        const ownerActions = viewerId && Number(comment.author_id) === viewerId
          ? `<div class="comment-owner-actions"><button class="comment-owner-edit-button" type="button" data-comment-id="${Number(comment.id)}">수정</button><button class="comment-delete-button" type="button" data-comment-id="${Number(comment.id)}">삭제</button></div>`
          : '';
        return `<article class="comment-item" data-comment-id="${Number(comment.id)}"><div class="comment-meta"><a class="comment-author-link" href="user.html?id=${encodeURIComponent(comment.author_id)}">${escapeHtml(comment.author)}</a><time>${escapeHtml(formatDate(comment.created_at))}</time>${ownerActions}</div><p class="comment-content">${escapeHtml(comment.content)}</p></article>`;
      }).join('') : '<p class="empty-comments">아직 댓글이 없습니다.</p>';
      commentList.querySelectorAll('.comment-owner-edit-button').forEach(button => button.addEventListener('click', async () => {
        const item = button.closest('.comment-item');
        const paragraph = item.querySelector('.comment-content');
        const originalContent = paragraph.textContent;
        const textarea = document.createElement('textarea');
        textarea.maxLength = 2000;
        textarea.value = originalContent;
        textarea.setAttribute('aria-label', '댓글 수정 내용');
        const actions = document.createElement('div');
        actions.className = 'comment-edit-actions';
        const save = document.createElement('button');
        save.type = 'button';
        save.className = 'comment-edit-save-button';
        save.textContent = '저장';
        const cancel = document.createElement('button');
        cancel.type = 'button';
        cancel.className = 'comment-edit-cancel-button';
        cancel.textContent = '취소';
        actions.append(save, cancel);
        paragraph.replaceWith(textarea);
        button.parentElement.replaceWith(actions);
        textarea.focus();
        cancel.addEventListener('click', async () => {
          await loadComments();
          setMessage(commentMessage, '댓글 수정을 취소했습니다.');
        });
        save.addEventListener('click', async () => {
          save.disabled = true;
          const normalized = textarea.value.trim();
          if (!normalized || normalized.length > 2000) {
            setMessage(commentMessage, '댓글은 1~2,000자로 입력해 주세요.');
            save.disabled = false;
            textarea.focus();
            return;
          }
          try {
            await api(`/api/posts/${postId}/comments/${button.dataset.commentId}`, {
              method: 'PUT', body: JSON.stringify({ content: normalized }),
            });
            await loadComments();
            setMessage(commentMessage, '댓글을 수정했습니다.', true);
          } catch (error) {
            setMessage(commentMessage, error.message);
            save.disabled = false;
          }
        });
      }));
      commentList.querySelectorAll('.comment-delete-button').forEach(button => button.addEventListener('click', async () => {
        if (!window.confirm('이 댓글을 삭제할까요?')) return;
        button.disabled = true;
        try {
          await api(`/api/posts/${postId}/comments/${button.dataset.commentId}`, { method: 'DELETE' });
          await loadComments();
          setMessage(commentMessage, '댓글을 삭제했습니다.', true);
        } catch (error) {
          setMessage(commentMessage, error.message);
          button.disabled = false;
        }
      }));
    }

    async function loadComments() {
      const data = await api(`/api/posts/${postId}/comments`);
      renderComments(data.comments || []);
    }

    try {
      const [data, currentUser] = await Promise.all([
        api(`/api/posts/${postId}${showDeletedPost ? '?include_deleted=1' : ''}`),
        token() ? api('/api/auth/me').catch(() => null) : Promise.resolve(null),
      ]);
      const post = data.post;
      if (!post) throw new Error('게시글을 찾을 수 없습니다.');
      window.__arcadeViewerId = currentUser?.user?.id || 0;
      document.title = `${post.title} — 게시판 | ARCADE`;
      status.textContent = '';
      if (data.deleted || post.deleted_at) {
        document.getElementById('postDeletedNotice').hidden = false;
        document.getElementById('postDeletedNotice').querySelector('h1').textContent = '삭제된 게시글입니다.';
        document.getElementById('postDeletedNotice').querySelector('p:not(.section-kicker)').textContent = `“${post.title}” 게시글은 작성자가 삭제했습니다.`;
        content.hidden = true;
        commentsPanel.hidden = true;
        return;
      }
      content.hidden = false;
      commentsPanel.hidden = false;
      const authorLink = post.author_id ? `user.html?id=${encodeURIComponent(post.author_id)}` : `user.html?name=${encodeURIComponent(post.author)}`;
      const isAuthor = Boolean(currentUser?.user?.id && post.author_id && Number(currentUser.user.id) === Number(post.author_id));
      content.innerHTML = `<span class="post-detail-category">${escapeHtml(({ notice: '공지', free: '자유', recommend: '게임 추천', guide: '공략·팁', recruit: '모집' })[post.category] || post.category)}</span><h1 class="post-detail-title">${escapeHtml(post.title)}</h1><div class="post-detail-meta"><a href="${authorLink}">${escapeHtml(post.author)}</a><time>${escapeHtml(formatDate(post.created_at))}</time><span>댓글 ${Number(post.comments_count) || 0}</span>${post.updated_at && post.updated_at !== post.created_at ? '<span class="post-edited-label">수정됨</span>' : ''}</div><div class="post-detail-content">${escapeHtml(post.content)}</div>${isAuthor ? '<div class="post-owner-actions"><button class="post-action-button" type="button" id="editPostButton">✎ 수정</button><button class="post-action-button danger" type="button" id="deletePostButton">삭제</button></div>' : ''}<div class="post-action-row"><button class="post-action-button ${post.liked_by_me ? 'active' : ''}" type="button" id="likePostButton" aria-pressed="${Boolean(post.liked_by_me)}">♥ 좋아요 <span>${Number(post.likes_count) || 0}</span></button><button class="post-action-button ${post.bookmarked_by_me ? 'active' : ''}" type="button" id="bookmarkPostButton" aria-pressed="${Boolean(post.bookmarked_by_me)}">▣ 북마크 <span>${Number(post.bookmarks_count) || 0}</span></button></div><section class="post-edit-panel" id="postEditPanel" hidden><h2>게시글 수정</h2><form id="editPostForm" class="post-edit-form"><label for="editPostCategory">분류</label><select id="editPostCategory" name="category" required><option value="free">자유</option><option value="recommend">게임 추천</option><option value="guide">공략·팁</option><option value="recruit">모집</option></select><label for="editPostTitle">제목</label><input id="editPostTitle" name="title" maxlength="160" required /><label for="editPostContent">내용</label><textarea id="editPostContent" name="content" rows="10" maxlength="10000" required></textarea><p class="community-message" id="editPostMessage" role="status" aria-live="polite"></p><div class="post-edit-actions"><button class="button secondary" type="button" id="cancelEditPost">취소</button><button class="button" type="submit">수정 저장</button></div></form></section>`;
      await loadComments();

      if (isAuthor) {
        const editPanel = document.getElementById('postEditPanel');
        const editForm = document.getElementById('editPostForm');
        document.getElementById('editPostButton').addEventListener('click', () => {
          document.getElementById('editPostCategory').value = post.category;
          document.getElementById('editPostTitle').value = post.title;
          document.getElementById('editPostContent').value = post.content;
          editPanel.hidden = false;
          editPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
          document.getElementById('editPostTitle').focus();
        });
        document.getElementById('cancelEditPost').addEventListener('click', () => { editPanel.hidden = true; });
        document.getElementById('deletePostButton').addEventListener('click', async event => {
          if (!window.confirm('이 게시글을 삭제할까요? 삭제한 글은 목록에서 보이지 않습니다.')) return;
          const button = event.currentTarget;
          button.disabled = true;
          setMessage(status, '게시글을 삭제하는 중…');
          try {
            await api(`/api/posts/${postId}`, { method: 'DELETE' });
            window.location.assign('board.html');
          } catch (error) {
            setMessage(status, error.message);
            button.disabled = false;
          }
        });
        editForm.addEventListener('submit', async event => {
          event.preventDefault();
          const button = editForm.querySelector('[type="submit"]');
          const values = new FormData(editForm);
          button.disabled = true;
          setMessage(document.getElementById('editPostMessage'), '수정 내용을 저장하는 중…');
          try {
            await api(`/api/posts/${postId}`, {
              method: 'PUT',
              body: JSON.stringify({ category: values.get('category'), title: values.get('title'), content: values.get('content') }),
            });
            window.location.reload();
          } catch (error) {
            setMessage(document.getElementById('editPostMessage'), error.message);
            button.disabled = false;
          }
        });
      }

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
      const endpoint = userId
        ? `/api/users/${encodeURIComponent(userId)}`
        : `/api/users?nickname=${encodeURIComponent(nickname || '')}`;
      const data = await api(endpoint);
      const user = data.user;
      card.hidden = false;
      status.textContent = '';
      document.title = `${user.nickname} — 플레이어 프로필 | ARCADE`;
      document.getElementById('userNickname').textContent = user.nickname;
      renderUserAvatar(document.getElementById('userAvatar'), user);
      document.getElementById('userBio').textContent = user.bio || '아직 자기소개가 없습니다.';
      document.getElementById('userMemberSince').textContent = `가입일 ${formatDate(user.created_at)}`;
    } catch (error) {
      if (!userId && fallbackName) {
        card.hidden = false;
        document.getElementById('userNickname').textContent = fallbackName;
        renderUserAvatar(document.getElementById('userAvatar'), { nickname: fallbackName });
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