(() => {
  const apiBase = 'https://arcade-board-api.nextarcade.workers.dev';
  const tokenKey = 'arcade-session-token';
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
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
        setMessage(message, '가입이 완료됐습니다. 로그인 페이지로 이동합니다.', true);
        window.location.assign('login.html');
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
  }

  if (loginForm) {
    const message = document.getElementById('loginMessage');
    if (token()) {
      request('/api/auth/me').then(data => showAccount(data.user)).catch(() => sessionStorage.removeItem(tokenKey));
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
        showAccount(data.user);
        setMessage(message, '로그인됐습니다.', true);
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
})();