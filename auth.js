(() => {
  window.dataLayer = window.dataLayer || [];
  if (!window.__arcadeGtmLoaded) {
    window.__arcadeGtmLoaded = true;
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const gtmScript = document.createElement('script');
    gtmScript.async = true;
    gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-W6VF6X92';
    document.head.append(gtmScript);
  }
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-TZTL3TCNB5');

  function trackAuthEvent(event) {
    window.dataLayer.push({ event });
    window.gtag('event', event);
  }

  const apiBase = 'https://arcade-board-api.nextarcade.workers.dev';
  const tokenKey = 'arcade-session-token';
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  const profileForm = document.getElementById('profileForm');
  const homeProfileButton = document.getElementById('profileButton');
  const passwordResetForm = document.getElementById('passwordResetForm');
  const showPasswordResetButton = document.getElementById('showPasswordReset');
  if (showPasswordResetButton && passwordResetForm) {
    showPasswordResetButton.addEventListener('click', () => {
      const expanded = showPasswordResetButton.getAttribute('aria-expanded') === 'true';
      showPasswordResetButton.setAttribute('aria-expanded', String(!expanded));
      passwordResetForm.hidden = expanded;
      showPasswordResetButton.textContent = expanded ? '비밀번호 재설정' : '비밀번호 재설정 취소';
      if (!expanded) document.getElementById('currentPassword').focus();
    });
  }
  const token = () => localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey);
  function saveToken(value) {
    localStorage.setItem(tokenKey, value);
    sessionStorage.removeItem(tokenKey);
  }
  function clearToken() {
    localStorage.removeItem(tokenKey);
    sessionStorage.removeItem(tokenKey);
  }
  document.getElementById('profileLogout')?.addEventListener('click', () => {
    clearToken();
    window.location.replace('login.html');
  });
  const requestedNext = new URLSearchParams(window.location.search).get('next') || '';
  const allowedNext = ['post-write.html', 'board.html', 'profile.html', 'profile-edit.html'].includes(requestedNext) || /^post\.html\?id=\d+$/.test(requestedNext);
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

  function showHomeProfile(user) {
    if (!homeProfileButton) return;
    const initials = document.getElementById('profileButtonInitials');
    if (initials) {
      initials.textContent = (user.nickname || 'AR').slice(0, 2).toUpperCase();
      initials.hidden = Boolean(user.avatar_image);
      const oldImage = homeProfileButton.querySelector('.avatar-image');
      oldImage?.remove();
      if (user.avatar_image) {
        const image = document.createElement('img');
        image.className = 'avatar-image';
        image.src = user.avatar_image;
        image.alt = '';
        image.addEventListener('error', () => {
          image.remove();
          initials.hidden = false;
        }, { once: true });
        homeProfileButton.prepend(image);
      }
    }
    homeProfileButton.dataset.color = user.avatar_color || 'violet';
    homeProfileButton.setAttribute('aria-label', `${user.nickname} 프로필 보기`);
    homeProfileButton.classList.add('is-signed-in');

    const profileControl = document.getElementById('profileControl');
    const profilePopover = document.getElementById('profilePopover');
    const profilePopoverAvatar = document.getElementById('profilePopoverAvatar');
    const profilePopoverNickname = document.getElementById('profilePopoverNickname');
    const profilePopoverEmail = document.getElementById('profilePopoverEmail');
    const profilePopoverAction = document.getElementById('profilePopoverAction');
    const nickname = user.nickname || 'ARCADE 회원';
    if (profilePopoverNickname) profilePopoverNickname.textContent = nickname;
    if (profilePopoverEmail) profilePopoverEmail.textContent = user.email || '이메일 정보 없음';
    if (profilePopoverAction) {
      profilePopoverAction.href = 'profile-edit.html';
      profilePopoverAction.textContent = '프로필 편집';
    }
    if (profilePopoverAvatar) {
      profilePopoverAvatar.dataset.color = user.avatar_color || 'violet';
      profilePopoverAvatar.textContent = user.avatar_image ? '' : nickname.slice(0, 2).toUpperCase();
      profilePopoverAvatar.replaceChildren();
      if (user.avatar_image) {
        const image = document.createElement('img');
        image.src = user.avatar_image;
        image.alt = `${nickname} 프로필 사진`;
        image.addEventListener('error', () => {
          image.remove();
          profilePopoverAvatar.textContent = nickname.slice(0, 2).toUpperCase();
        }, { once: true });
        profilePopoverAvatar.append(image);
      }
    }
    if (profilePopover) profilePopover.dataset.signedIn = 'true';
  }

  const profileControl = document.getElementById('profileControl');
  const profilePopover = document.getElementById('profilePopover');
  if (profileControl && profilePopover) {
    const profileButton = profileControl.querySelector('#profileButton');
    const openPopover = () => {
      profilePopover.hidden = false;
      profileButton?.setAttribute('aria-expanded', 'true');
    };
    const closePopover = event => {
      if (event?.relatedTarget && profileControl.contains(event.relatedTarget)) return;
      profilePopover.hidden = true;
      profileButton?.setAttribute('aria-expanded', 'false');
    };
    profileControl.addEventListener('pointerenter', openPopover);
    profileControl.addEventListener('pointerleave', closePopover);
    profileControl.addEventListener('focusin', openPopover);
    profileControl.addEventListener('focusout', closePopover);
  }

  if (homeProfileButton) {
    homeProfileButton.addEventListener('click', async () => {
      if (!token()) {
        window.location.assign('login.html');
        return;
      }
      homeProfileButton.disabled = true;
      try {
        await request('/api/auth/me');
        window.location.assign('profile.html');
      } catch {
        clearToken();
        window.location.assign('login.html');
      } finally {
        homeProfileButton.disabled = false;
      }
    });

    if (token()) {
      request('/api/auth/me')
        .then(data => showHomeProfile(data.user))
        .catch(() => clearToken());
    }
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


  if (signupForm) {
    const nicknameInput = document.getElementById('nickname');
    const nicknameHint = document.getElementById('nicknameHint');
    const emailInput = document.getElementById('email');
    const emailHint = document.getElementById('emailHint');
    const signupSubmit = document.getElementById('signupSubmit');
    let nicknameAvailable = false;
    let nicknameRequestId = 0;
    let nicknameTimer;

    function setHint(element, message, state = '') {
      element.textContent = message;
      element.classList.toggle('error', state === 'error');
      element.classList.toggle('success', state === 'success');
    }

    function utf8ByteLength(value) {
      return new TextEncoder().encode(value).length;
    }

    function validNicknameCharacters(value) {
      return /^[가-힣A-Za-z]+$/u.test(value);
    }

    function updateSignupAvailability() {
      signupSubmit.disabled = !signupForm.checkValidity() || !nicknameAvailable;
    }

    function validateEmail() {
      const value = emailInput.value.trim();
      if (!value) {
        emailInput.setAttribute('aria-invalid', 'false');
        setHint(emailHint, '로그인에 사용할 이메일 주소를 입력해 주세요.');
        updateSignupAvailability();
        return false;
      }
      if (!emailInput.validity.valid) {
        emailInput.setAttribute('aria-invalid', 'true');
        setHint(emailHint, '올바른 이메일 형식으로 입력해 주세요.', 'error');
        updateSignupAvailability();
        return false;
      }
      emailInput.setAttribute('aria-invalid', 'false');
      setHint(emailHint, '사용할 수 있는 이메일 형식입니다.', 'success');
      updateSignupAvailability();
      return true;
    }

    async function checkNickname() {
      const value = nicknameInput.value.trim();
      const requestId = ++nicknameRequestId;
      nicknameAvailable = false;
      nicknameInput.removeAttribute('aria-invalid');
      if (!value) {
        setHint(nicknameHint, '2~20바이트');
        updateSignupAvailability();
        return;
      }
      const byteLength = utf8ByteLength(value);
      if (!validNicknameCharacters(value)) {
        nicknameInput.setAttribute('aria-invalid', 'true');
        setHint(nicknameHint, '닉네임은 한글과 영문 대소문자만 사용할 수 있습니다.', 'error');
        updateSignupAvailability();
        return;
      }
      if (byteLength < 2 || byteLength > 20) {
        nicknameInput.setAttribute('aria-invalid', 'true');
        setHint(nicknameHint, `현재 ${byteLength}바이트입니다. 닉네임은 2~20바이트로 입력해 주세요.`, 'error');
        updateSignupAvailability();
        return;
      }
      setHint(nicknameHint, '중복 여부를 확인하고 있습니다…');
      updateSignupAvailability();
      try {
        const result = await request(`/api/auth/nickname-availability?nickname=${encodeURIComponent(value)}`);
        if (requestId !== nicknameRequestId) return;
        nicknameAvailable = result.available === true;
        nicknameInput.setAttribute('aria-invalid', String(!nicknameAvailable));
        setHint(nicknameHint, nicknameAvailable ? '사용할 수 있는 닉네임입니다.' : '이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해 주세요.', nicknameAvailable ? 'success' : 'error');
      } catch {
        if (requestId !== nicknameRequestId) return;
        nicknameAvailable = false;
        setHint(nicknameHint, '닉네임을 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.', 'error');
      }
      updateSignupAvailability();
    }

    nicknameInput.addEventListener('input', () => {
      nicknameAvailable = false;
      clearTimeout(nicknameTimer);
      nicknameTimer = setTimeout(checkNickname, 300);
      updateSignupAvailability();
    });
    nicknameInput.addEventListener('blur', checkNickname);
    emailInput.addEventListener('input', validateEmail);
    emailInput.addEventListener('blur', validateEmail);
    signupForm.addEventListener('input', updateSignupAvailability);
    signupForm.addEventListener('change', updateSignupAvailability);

    signupForm.addEventListener('submit', async event => {
      event.preventDefault();
      const message = document.getElementById('signupMessage');
      const submit = signupForm.querySelector('[type="submit"]');
      const form = new FormData(signupForm);
      validateEmail();
      await checkNickname();
      if (!nicknameAvailable) {
        setMessage(message, '사용할 수 있는 닉네임을 입력해 주세요.');
        return;
      }
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
            password: form.get('password'),
          }),
        });
        saveToken(data.token);
        trackAuthEvent('sign_up');
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

  function setProfileAvatarImage(imageData, nickname) {
    for (const id of ['profileAvatar', 'profileAvatarPreview']) {
      const element = document.getElementById(id);
      if (!element) continue;
      element.replaceChildren();
      if (imageData) {
        const image = document.createElement('img');
        image.className = 'profile-avatar-image';
        image.src = imageData;
        image.alt = '';
        image.addEventListener('error', () => {
          image.remove();
          element.textContent = (nickname || 'AR').slice(0, 2).toUpperCase();
        }, { once: true });
        element.append(image);
      } else {
        element.textContent = (nickname || 'AR').slice(0, 2).toUpperCase();
      }
    }
  }

  function showProfile(user) {
    const content = document.getElementById('profilePage');
    if (content) content.hidden = false;
    const profileView = document.getElementById('profileViewPage');
    if (profileView) profileView.hidden = false;
    const nicknameInput = document.getElementById('profileNickname');
    const emailInput = document.getElementById('profileEmail');
    const genderInput = document.getElementById('profileGender');
    const bioInput = document.getElementById('profileBio');
    if (nicknameInput) nicknameInput.value = user.nickname || '';
    if (emailInput) emailInput.value = user.email || '';
    if (genderInput) genderInput.value = user.gender || 'prefer_not_to_say';
    if (bioInput) bioInput.value = user.bio || '';
    const viewNickname = document.getElementById('profileViewNickname');
    const viewEmail = document.getElementById('profileViewEmail');
    const viewBio = document.getElementById('profileViewBio');
    if (viewNickname) viewNickname.textContent = user.nickname || '이름 없음';
    if (viewEmail) viewEmail.textContent = user.email || '이메일 정보 없음';
    if (viewBio) viewBio.textContent = user.bio || '소개가 없습니다.';
    const color = user.avatar_color || 'violet';
    const radio = profileForm?.querySelector(`input[name="avatar_color"][value="${color}"]`);
    if (radio) radio.checked = true;
    setAvatarColor(color);
    const sidebarNickname = document.getElementById('sidebarNickname');
    if (sidebarNickname) sidebarNickname.textContent = user.nickname || '플레이어';
    setProfileAvatarImage(user.avatar_image, user.nickname);
    const createdAt = new Date(user.created_at);
    const memberSince = document.getElementById('memberSince');
    if (memberSince) memberSince.textContent = Number.isNaN(createdAt.getTime())
      ? '정보 없음'
      : new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(createdAt);
  }

  const profileViewPage = document.getElementById('profileViewPage');
  if (profileViewPage) {
    if (!token()) {
      window.location.replace(`login.html?next=${encodeURIComponent('profile.html')}`);
    } else {
      request('/api/auth/me')
        .then(data => showProfile(data.user))
        .catch(() => {
          clearToken();
          window.location.replace(`login.html?next=${encodeURIComponent('profile.html')}`);
        });
    }
  }

  if (passwordResetForm) {
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmNewPassword = document.getElementById('confirmNewPassword');
    const message = document.getElementById('passwordResetMessage');
    const submit = document.getElementById('submitPasswordReset');

    passwordResetForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (newPassword.value !== confirmNewPassword.value) {
        setMessage(message, '새 비밀번호와 확인이 일치하지 않습니다.');
        confirmNewPassword.focus();
        return;
      }
      if (newPassword.value.length < 10 || newPassword.value.length > 128) {
        setMessage(message, '새 비밀번호는 10~128자로 입력해 주세요.');
        newPassword.focus();
        return;
      }

      submit.disabled = true;
      setMessage(message, '비밀번호를 변경하는 중…');
      try {
        await request('/api/auth/change-password', {
          method: 'POST',
          body: JSON.stringify({
            current_password: currentPassword.value,
            new_password: newPassword.value,
          }),
        });
        passwordResetForm.reset();
        passwordResetForm.hidden = true;
        showPasswordResetButton.setAttribute('aria-expanded', 'false');
        showPasswordResetButton.textContent = '비밀번호 재설정';
        setMessage(message, '비밀번호를 안전하게 변경했습니다.', true);
      } catch (error) {
        setMessage(message, error.message || '비밀번호를 변경하지 못했습니다.');
      } finally {
        submit.disabled = false;
      }
    });
  }

  if (loginForm) {
    const message = document.getElementById('loginMessage');
    if (token()) {
      request('/api/auth/me').then(() => window.location.replace(loginDestination)).catch(() => clearToken());
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
        saveToken(data.token);
        trackAuthEvent('login');
        setMessage(message, '로그인됐습니다. 내 프로필 페이지로 이동합니다.', true);
        window.location.assign(loginDestination);
      } catch (error) {
        setMessage(message, error.message || '로그인하지 못했습니다.');
      } finally {
        submit.disabled = false;
      }
    });

    document.getElementById('logoutButton')?.addEventListener('click', () => {
      clearToken();
      window.location.reload();
    });
  }

  if (profileForm) {
    const message = document.getElementById('profileMessage');
    const colorInputs = [...profileForm.querySelectorAll('input[name="avatar_color"]')];
    const avatarFileInput = document.getElementById('profileAvatarFile');
    const clearAvatarButton = document.getElementById('clearProfileAvatar');
    let avatarImage = null;
    if (!token()) {
      const next = encodeURIComponent('profile-edit.html');
      window.location.replace(`login.html?next=${next}`);
    } else {
      request('/api/auth/me')
        .then(data => {
          avatarImage = data.user.avatar_image || null;
          showProfile(data.user);
          loadProfilePosts();
        })
        .catch(() => {
          clearToken();
          const next = encodeURIComponent('profile-edit.html');
          window.location.replace(`login.html?next=${next}`);
        });
    }

    colorInputs.forEach(input => input.addEventListener('change', () => setAvatarColor(input.value)));
    avatarFileInput?.addEventListener('change', async () => {
      const file = avatarFileInput.files?.[0];
      if (!file) return;
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setMessage(message, 'JPG, PNG 또는 WebP 이미지를 선택해 주세요.');
        avatarFileInput.value = '';
        return;
      }
      try {
        const image = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        const scale = Math.max(256 / image.width, 256 / image.height);
        const width = image.width * scale;
        const height = image.height * scale;
        context.drawImage(image, (256 - width) / 2, (256 - height) / 2, width, height);
        image.close();
        let quality = 0.82;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        while (dataUrl.length > 115000 && quality > 0.35) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        if (dataUrl.length > 115000) throw new Error('선택한 이미지가 너무 커서 저장할 수 없습니다.');
        avatarImage = dataUrl;
        setProfileAvatarImage(avatarImage, document.getElementById('profileNickname').value);
        setMessage(message, '이미지를 미리보기로 설정했습니다. 저장을 눌러 적용해 주세요.', true);
      } catch (error) {
        setMessage(message, error.message || '이미지를 불러오지 못했습니다.');
      }
    });
    clearAvatarButton?.addEventListener('click', () => {
      avatarImage = null;
      avatarFileInput.value = '';
      setProfileAvatarImage(null, document.getElementById('profileNickname').value);
      setMessage(message, '프로필 이미지 삭제를 선택했습니다. 저장을 눌러 적용해 주세요.');
    });
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
            avatar_image: avatarImage,
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
  }

})();