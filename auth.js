(() => {
  const apiBase = 'https://arcade-board-api.nextarcade.workers.dev';
  const tokenKey = 'arcade-session-token';
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  const profileForm = document.getElementById('profileForm');
  const token = () => sessionStorage.getItem(tokenKey);

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
      request('/api/auth/me').then(() => window.location.replace('profile.html')).catch(() => sessionStorage.removeItem(tokenKey));
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
        window.location.assign('profile.html');
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
    if (!token()) {
      showLoggedOutProfile();
    } else {
      request('/api/auth/me')
        .then(data => showProfile(data.user))
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