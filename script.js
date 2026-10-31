const games = [
      { title: '발로란트', english: 'VALORANT', genre: '액션', tag: '경쟁 FPS', emoji: '🎯', cover: 'valorant', rating: '4.8' },
      { title: '하데스 II', english: 'HADES II', genre: '액션', tag: '로그라이크', emoji: '🔥', cover: 'hades', rating: '4.9' },
      { title: '스타듀 밸리', english: 'STARDEW VALLEY', genre: '인디', tag: '힐링 · 농장', emoji: '🌻', cover: 'stardew', rating: '4.9' },
      { title: '엘든 링', english: 'ELDEN RING', genre: 'RPG', tag: '오픈월드', emoji: '🐉', cover: 'elden', rating: '4.9' },
      { title: '젤다의 전설', english: 'TEARS OF THE KINGDOM', genre: '어드벤처', tag: '오픈월드', emoji: '🗡️', cover: 'zelda', rating: '4.9' },
      { title: '사이버펑크 2077', english: 'CYBERPUNK 2077', genre: 'RPG', tag: '오픈월드', emoji: '🌆', cover: 'cyber', rating: '4.7' },
      { title: '페르소나 5 더 로열', english: 'PERSONA 5 ROYAL', genre: 'RPG', tag: 'JRPG', emoji: '🎭', cover: 'persona', rating: '4.8' },
      { title: '오리와 도깨비불', english: 'ORI AND THE WILL', genre: '인디', tag: '플랫포머', emoji: '🦋', cover: 'ori', rating: '4.8' }
    ];

    const grid = document.getElementById('gameGrid');
    const searchInput = document.getElementById('searchInput');
    const filters = [...document.querySelectorAll('.filter')];
    const profileDialog = document.getElementById('profileDialog');
    let activeFilter = '전체';
    let favorites = new Set();
    try {
      const stored = JSON.parse(localStorage.getItem('arcade-favorites') || '[]');
      if (Array.isArray(stored)) favorites = new Set(stored.filter(title => games.some(game => game.title === title)));
    } catch { favorites = new Set(); }

    function renderGames() {
      const query = searchInput.value.trim().toLocaleLowerCase('ko');
      const visibleGames = games.filter(game => {
        const matchesFilter = activeFilter === '전체' || (activeFilter === '즐겨찾기' ? favorites.has(game.title) : game.genre === activeFilter);
        const matchesSearch = `${game.title} ${game.english} ${game.genre} ${game.tag}`.toLocaleLowerCase('ko').includes(query);
        return matchesFilter && matchesSearch;
      });

      if (!visibleGames.length) {
        grid.innerHTML = '<div class="empty-state">표시할 게임이 없어요. 다른 검색어나 필터를 선택해 보세요.</div>';
        return;
      }

      grid.innerHTML = visibleGames.map(game => `
        <article class="game-card">
          <div class="game-cover cover-${game.cover}">
            <span class="cover-label">${game.english}</span>
            <span class="cover-emoji" aria-hidden="true">${game.emoji}</span>
            <button class="favorite ${favorites.has(game.title) ? 'saved' : ''}" type="button" data-title="${encodeURIComponent(game.title)}" aria-label="${game.title} ${favorites.has(game.title) ? '즐겨찾기 해제' : '즐겨찾기 추가'}" aria-pressed="${favorites.has(game.title)}">♥</button>
          </div>
          <div class="game-info"><div class="game-title-row"><h3 class="game-title">${game.title}</h3><span class="rating">★ ${game.rating}</span></div><div class="game-meta"><span>${game.genre} · ${game.tag}</span><span>인기 게임</span></div></div>
        </article>`).join('');

      grid.querySelectorAll('.favorite').forEach(button => button.addEventListener('click', () => {
        const title = decodeURIComponent(button.dataset.title);
        favorites.has(title) ? favorites.delete(title) : favorites.add(title);
        try { localStorage.setItem('arcade-favorites', JSON.stringify([...favorites])); } catch { showToast('즐겨찾기를 저장할 수 없어요.'); }
        updateProfileStats();
        renderGames();
      }));
    }

    let toastTimer;
    function showToast(message) {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
    }

    searchInput.addEventListener('input', renderGames);
    filters.forEach(button => button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      filters.forEach(filter => {
        const selected = filter === button;
        filter.classList.toggle('active', selected);
        filter.setAttribute('aria-pressed', String(selected));
      });
      renderGames();
    }));

    document.getElementById('randomButton').addEventListener('click', () => {
      const game = games[Math.floor(Math.random() * games.length)];
      showToast(`오늘의 추천은 ${game.title}! ${game.emoji} ${game.genre} · ${game.tag}`);
    });
    function updateProfileStats() {
      document.getElementById('favoriteCount').textContent = String(favorites.size);
    }

    function loadProfileName() {
      try {
        const savedName = localStorage.getItem('arcade-profile-name');
        if (savedName) document.getElementById('profileName').textContent = savedName;
      } catch { /* Keep the default profile name when storage is unavailable. */ }
    }

    document.getElementById('profileButton').addEventListener('click', () => {
      updateProfileStats();
      loadProfileName();
      profileDialog.showModal();
    });
    document.getElementById('closeProfileButton').addEventListener('click', () => profileDialog.close());
    profileDialog.addEventListener('click', event => {
      if (event.target === profileDialog) profileDialog.close();
    });
    document.getElementById('editProfileButton').addEventListener('click', () => {
      const currentName = document.getElementById('profileName').textContent;
      const nextName = window.prompt('프로필에 표시할 이름을 입력해 주세요.', currentName);
      if (nextName === null) return;
      const trimmedName = nextName.trim().slice(0, 20);
      if (!trimmedName) {
        showToast('이름은 한 글자 이상 입력해 주세요.');
        return;
      }
      document.getElementById('profileName').textContent = trimmedName;
      try { localStorage.setItem('arcade-profile-name', trimmedName); }
      catch { showToast('이름을 저장하지 못했지만 화면에는 반영했어요.'); }
    });
    document.getElementById('showAllLink').addEventListener('click', () => {
      activeFilter = '전체';
      searchInput.value = '';
      filters.forEach(filter => {
        const selected = filter.dataset.filter === '전체';
        filter.classList.toggle('active', selected);
        filter.setAttribute('aria-pressed', String(selected));
      });
      renderGames();
    });

    loadProfileName();
    updateProfileStats();
    renderGames();
