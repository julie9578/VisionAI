(() => {
  const apiBase = 'https://arcade-board-api.nextarcade.workers.dev';
  const tokenKey = 'arcade-session-token';
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  const profileForm = document.getElementById('profileForm');
  const token = () => sessionStorage.getItem(tokenKey);
  const requestedNext = new URLSearchParams(window.location.search).get('next') || '';
  const allowedNext = ['post-write.html', 'board.html', 'profile.html'].includes(requestedNext) || /^post\.html\?id=\d+$/.test(requestedNext);
  const loginDestination = allowedNext ? requestedNext : 'profile.html';

  async function request(path, options = {}) {
    const headers = { accept: 'application/json', ...(options.headers || {}) };
    if (options.body) headers['content-type'] = 'application/json';
    if (token()) headers.authorization = `Bearer ${token()}`;
    const response = await fetch(`${apiBase}${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `요청에 실패했습니다. (${response.status})`);
    return data;
  }

  function setMessage(element, message, success = false) {
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('success', success);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]);
  }

  async function loadProfilePosts() {
    const list = document.getElementById('profilePostList');
    const status = document.getElementById('profilePostsStatus');
    if (!list || !status) return;
    try {
      const data = await request('/api/users/me/posts');
      const posts = Array.isArray(data.posts) ? data.posts : [];
      if (!posts.length) {
        status.textContent = '아직 작성한 게시글이 없습니다.';
        return;
      }
      status.textContent = `${posts.length}개의 게시글`;
      list.innerHTML = posts.map(post => {
        const date = new Date(post.created_at);
        const dateLabel = Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
        const title = escapeHtml(post.title);
        const category = escapeHtml(({ free: '자유', recommend: '게임 추천', guide: '공략·팁', recruit: '모집', notice: '공지' })[post.category] || '게시글');
        return `<li class="profile-post-item"><a href="post.html?id=${encodeURIComponent(post.id)}"><span class="profile-post-category">${category}</span><strong>${title}</strong><time datetime="${escapeHtml(post.created_at)}">${escapeHtml(dateLabel)}</time></a></li>`;
      }).join('');
    } catch (error) {
      status.textContent = error.message || '게시글을 불러오지 못했습니다.';
    }
  }

  async function loadProfileComments() {
    const list = document.getElementById('profileCommentList');
    const status = document.getElementById('profileCommentsStatus');
    if (!list || !status) return;
    status.textContent = '댓글을 불러오는 중…';
    try {
      const data = await request('/api/users/me/comments');
      const comments = Array.isArray(data.comments) ? data.comments : [];
      if (!comments.length) {
        status.textContent = '아직 작성한 댓글이 없습니다.';
        return;
      }
      status.textContent = `${comments.length}개의 댓글`;
      list.innerHTML = comments.map(comment => {
        const date = new Date(comment.created_at);
        const dateLabel = Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
        const postTitle = escapeHtml(comment.post_title || '삭제된 게시글');
        const body = escapeHtml(comment.content);
        const deletedLabel = comment.post_deleted_at ? '<span class="profile-deleted-post-label">삭제된 게시글</span>' : '';
        const postLink = `post.html?id=${encodeURIComponent(comment.post_id)}${comment.post_deleted_at ? '&deleted=1' : ''}`;
        const content = `<span class="profile-post-category">댓글</span><span class="profile-comment-copy"><strong>${postTitle}${deletedLabel}</strong><span>${body}</span></span><time datetime="${escapeHtml(comment.created_at)}">${escapeHtml(dateLabel)}</time>`;
        return `<li class="profile-post-item profile-comment-item"><a href="${postLink}">${content}</a></li>`;
      }).join('');
    } catch (error) {
      status.textContent = error.message || '댓글을 불러오지 못했습니다.';
    }
  }

  async function loadProfilePostCollection(path, listId, statusId, emptyMessage, marker) {
    const list = document.getElementById(listId);
    const status = document.getElementById(statusId);
    if (!list || !status) return;
    status.textContent = '목록을 불러오는 중…';
    try {
      const data = await request(path);
      const posts = Array.isArray(data.posts) ? data.posts : [];
      if (!posts.length) {
        status.textContent = emptyMessage;
        list.innerHTML = '';
        return;
      }
      status.textContent = `${posts.length}개의 게시글`;
      list.innerHTML = posts.map(post => {
        const date = new Date(post.activity_at || post.created_at);
        const dateLabel = Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
        const category = escapeHtml(({ free: '자유', recommend: '게임 추천', guide: '공략·팁', recruit: '모집', notice: '공지' })[post.category] || '게시글');
        const title = escapeHtml(post.title);
        const detail = post.my_comment_count ? `<span class="profile-post-activity-count">댓글 ${Number(post.my_comment_count)}개</span>` : '';
        return `<li class="profile-post-item"><a href="post.html?id=${encodeURIComponent(post.id)}"><span class="profile-post-category">${escapeHtml(marker || category)}</span><span class="profile-post-copy"><strong>${title}</strong>${detail}</span><time datetime="${escapeHtml(post.activity_at || post.created_at)}">${escapeHtml(dateLabel)}</time></a></li>`;
      }).join('');
    } catch (error) {
      status.textContent = error.message || '목록을 불러오지 못했습니다.';
    }
  }

  function initializeProfileActivityTabs() {
    const tabs = [...document.querySelectorAll('[data-activity-tab]')];
    const panels = {
      posts: document.getElementById('profilePostsPanel'),
      comments: document.getElementById('profileCommentsPanel'),
      'commented-posts': document.getElementById('profileCommentedPostsPanel'),
      'liked-posts': document.getElementById('profileLikedPostsPanel'),
      'bookmarked-posts': document.getElementById('profileBookmarkedPostsPanel'),
    };
    const loaders = {
      posts: loadProfilePosts,
      comments: loadProfileComments,
      'commented-posts': () => loadProfilePostCollection('/api/users/me/commented-posts', 'profileCommentedPostsList', 'profileCommentedPostsStatus', '아직 댓글 단 게시글이 없습니다.', '내 댓글'),
      'liked-posts': () => loadProfilePostCollection('/api/users/me/liked-posts', 'profileLikedPostsList', 'profileLikedPostsStatus', '아직 좋아요한 게시글이 없습니다.', '♥ 좋아요'),
      'bookmarked-posts': () => loadProfilePostCollection('/api/users/me/bookmarked-posts', 'profileBookmarkedPostsList', 'profileBookmarkedPostsStatus', '아직 북마크한 게시글이 없습니다.', '▣ 북마크'),
    };
    tabs.forEach(tab => tab.addEventListener('click', () => {
      const selected = tab.dataset.activityTab;
      tabs.forEach(item => {
        const active = item === tab;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
      });
      for (const [name, panel] of Object.entries(panels)) panel.hidden = name !== selected;
      if (token() && loaders[selected]) loaders[selected]();
    }));
    tabs.forEach((tab, index) => { tab.tabIndex = index === 0 ? 0 : -1; });
  }


  if (signupForm) {
    signupForm.addEventListener('submit', async event => {
      event.preventDefault();
      const message = document.getElementById('signupMessage');
      const submit = signupForm.querySelector('[type="submit"]');
      const form = new FormData(signupForm);
      if (form.get('password') !== form.get('passwordConfirm')) {
        setMessage(message, '비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        return;
      }
      submit.disabled = true;
      setMessage(message, '계정을 만들고 있습니다…');
      try {
        const data = await request('/api/auth/signup', {
          method: 'POST',
          body: JSON.stringify({
            nickname: form.get('nickname'),
            email: form.get('email'),
            gender: form.get('gender'),
            address: form.get('address'),
            password: form.get('password'),
          }),
        });
        sessionStorage.setItem(tokenKey, data.token);
        setMessage(message, '가입이 완료됐습니다. 프로필 페이지로 이동합니다.', true);
        window.location.assign('profile.html');
      } catch (error) {
        setMessage(message, error.message || '회원가입을 완료하지 못했습니다.');
      } finally {
        submit.disabled = false;
      }
    });
  }

  function showAccount(user) {
    const panel = document.getElementById('accountPanel');
    const form = document.getElementById('loginForm');
    if (!panel || !form) return;
    form.closest('.auth-shell').hidden = true;
    panel.hidden = false;
    document.getElementById('accountNickname').textContent = user.nickname;
    document.getElementById('accountEmail').textContent = user.email;
    const profileLink = document.getElementById('openProfileLink');
    if (profileLink) profileLink.hidden = false;
  }

  function setAvatarColor(color) {
    for (const id of ['profileAvatar', 'profileAvatarPreview']) {
      const avatar = document.getElementById(id);
      if (avatar) avatar.dataset.color = color || 'violet';
    }
  }

  function showProfile(user) {
    const required = document.getElementById('profileAuthRequired');
    const content = document.getElementById('profilePage');
    if (!required || !content) return;
    required.hidden = true;
    content.hidden = false;
    document.getElementById('profileNickname').value = user.nickname || '';
    document.getElementById('profileEmail').value = user.email || '';
    document.getElementById('profileGender').value = user.gender || 'prefer_not_to_say';
    document.getElementById('profileBio').value = user.bio || '';
    const color = user.avatar_color || 'violet';
    const radio = profileForm.querySelector(`input[name="avatar_color"][value="${color}"]`);
    if (radio) radio.checked = true;
    setAvatarColor(color);
    for (const id of ['sidebarNickname', 'profileAvatar', 'profileAvatarPreview']) {
      const element = document.getElementById(id);
      if (element) element.textContent = id.includes('Avatar') ? user.nickname.slice(0, 2).toUpperCase() : user.nickname;
    }
    const createdAt = new Date(user.created_at);
    document.getElementById('memberSince').textContent = Number.isNaN(createdAt.getTime())
      ? '정보 없음'
      : new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(createdAt);
  }

  function showLoggedOutProfile() {
    const required = document.getElementById('profileAuthRequired');
    const content = document.getElementById('profilePage');
    if (required) required.hidden = false;
    if (content) content.hidden = true;
  }

  if (loginForm) {
    const message = document.getElementById('loginMessage');
    if (token()) {
      request('/api/auth/me').then(() => window.location.replace(loginDestination)).catch(() => sessionStorage.removeItem(tokenKey));
    }

    loginForm.addEventListener('submit', async event => {
      event.preventDefault();
      const submit = loginForm.querySelector('[type="submit"]');
      const form = new FormData(loginForm);
      submit.disabled = true;
      setMessage(message, '로그인 중…');
      try {
        const data = await request('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
        });
        sessionStorage.setItem(tokenKey, data.token);
        setMessage(message, '로그인됐습니다. 내 프로필 페이지로 이동합니다.', true);
        window.location.assign(loginDestination);
      } catch (error) {
        setMessage(message, error.message || '로그인하지 못했습니다.');
      } finally {
        submit.disabled = false;
      }
    });

    document.getElementById('logoutButton')?.addEventListener('click', () => {
      sessionStorage.removeItem(tokenKey);
      window.location.reload();
    });
  }

  if (profileForm) {
    const message = document.getElementById('profileMessage');
    const logoutButton = document.getElementById('profileLogout');
    const colorInputs = [...profileForm.querySelectorAll('input[name="avatar_color"]')];
    initializeProfileActivityTabs();
    if (!token()) {
      showLoggedOutProfile();
    } else {
      request('/api/auth/me')
        .then(data => {
          showProfile(data.user);
          loadProfilePosts();
        })
        .catch(() => {
          sessionStorage.removeItem(tokenKey);
          showLoggedOutProfile();
        });
    }

    colorInputs.forEach(input => input.addEventListener('change', () => setAvatarColor(input.value)));
    profileForm.addEventListener('submit', async event => {
      event.preventDefault();
      const submit = profileForm.querySelector('[type="submit"]');
      const data = new FormData(profileForm);
      submit.disabled = true;
      setMessage(message, '프로필을 저장하는 중…');
      try {
        const result = await request('/api/auth/me', {
          method: 'PUT',
          body: JSON.stringify({
            nickname: data.get('nickname'),
            gender: data.get('gender'),
            bio: data.get('bio'),
            avatar_color: data.get('avatar_color'),
          }),
        });
        showProfile(result.user);
        setMessage(message, '프로필 변경사항을 저장했습니다.', true);
      } catch (error) {
        setMessage(message, error.message || '프로필을 저장하지 못했습니다.');
      } finally {
        submit.disabled = false;
      }
    });
    logoutButton.addEventListener('click', () => {
      sessionStorage.removeItem(tokenKey);
      window.location.assign('login.html');
    });
  }

})();