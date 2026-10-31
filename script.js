const games = [
      { title: '발로란트', english: 'VALORANT', genre: '액션', tag: '경쟁 FPS', emoji: '🎯', cover: 'valorant', rating: '4.8', url: 'https://playvalorant.com/ko-kr/' },
      { title: '하데스 II', english: 'HADES II', genre: '액션', tag: '로그라이크', emoji: '🔥', cover: 'hades', rating: '4.9', url: 'https://www.supergiantgames.com/games/hades-ii/', image: 'https://images.ctfassets.net/5owu3y35gz1g/2J66RQRNqhF3jK5dbPOt9h/6fe752a31a2b87715c56cd0612cbcaed/3840x2160_v1.0_KeyArt.png?w=900&q=80' },
      { title: '스타듀 밸리', english: 'STARDEW VALLEY', genre: '인디', tag: '힐링 · 농장', emoji: '🌻', cover: 'stardew', rating: '4.9', url: 'https://www.stardewvalley.net/' },
      { title: '엘든 링', english: 'ELDEN RING', genre: 'RPG', tag: '오픈월드', emoji: '🐉', cover: 'elden', rating: '4.9', url: 'https://www.bandainamcoent.com/games/elden-ring' },
      { title: '젤다의 전설', english: 'TEARS OF THE KINGDOM', genre: '어드벤처', tag: '오픈월드', emoji: '🗡️', cover: 'zelda', rating: '4.9', url: 'https://www.nintendo.com/us/store/products/the-legend-of-zelda-tears-of-the-kingdom-switch/', image: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto/f_auto/dpr_2.0/store/software/switch/70010000063714/fb30eab428df3fc993b41c76e20f72e4d76d49734d17d31996b5ab61c414b117' },
      { title: '사이버펑크 2077', english: 'CYBERPUNK 2077', genre: 'RPG', tag: '오픈월드', emoji: '🌆', cover: 'cyber', rating: '4.7', url: 'https://www.cyberpunk.net/', image: 'https://www.cyberpunk.net/build/images/social-thumbnail-en-ddcf4d23.jpg' },
      { title: '페르소나 5 더 로열', english: 'PERSONA 5 ROYAL', genre: 'RPG', tag: 'JRPG', emoji: '🎭', cover: 'persona', rating: '4.8', url: 'https://persona.atlus.com/p5r/', image: 'https://persona.atlus.com/p5r/resources/img/ogp.jpg' },
      { title: '오리와 도깨비불', english: 'ORI AND THE WILL', genre: '인디', tag: '플랫포머', emoji: '🦋', cover: 'ori', rating: '4.8', url: 'https://www.orithegame.com/' }
    ];

    const grid = document.getElementById('gameGrid');
    const searchInput = document.getElementById('searchInput');
    const filters = [...document.querySelectorAll('.filter')];
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
          <div class="game-cover cover-${game.cover}"${game.image ? ` style="--game-image: url('${game.image}')"` : ''}>
            <span class="cover-label">${game.english}</span>
            ${game.image ? '' : `<span class="cover-emoji" aria-hidden="true">${game.emoji}</span>`}
            <button class="favorite ${favorites.has(game.title) ? 'saved' : ''}" type="button" data-title="${encodeURIComponent(game.title)}" aria-label="${game.title} ${favorites.has(game.title) ? '즐겨찾기 해제' : '즐겨찾기 추가'}" aria-pressed="${favorites.has(game.title)}">♥</button>
          </div>
          <div class="game-info"><div class="game-title-row"><h3 class="game-title"><a href="${game.url}" target="_blank" rel="noopener noreferrer" aria-label="${game.title} 공식 홈페이지 새 탭에서 열기">${game.title}<span class="official-link-icon" aria-hidden="true">↗</span></a></h3><span class="rating">★ ${game.rating}</span></div><div class="game-meta"><span>${game.genre} · ${game.tag}</span><span>인기 게임</span></div></div>
        </article>`).join('');

      grid.querySelectorAll('.favorite').forEach(button => button.addEventListener('click', () => {
        const title = decodeURIComponent(button.dataset.title);
        favorites.has(title) ? favorites.delete(title) : favorites.add(title);
        try { localStorage.setItem('arcade-favorites', JSON.stringify([...favorites])); } catch { showToast('즐겨찾기를 저장할 수 없어요.'); }
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
    document.getElementById('profileButton').addEventListener('click', () => showToast('프로필 기능은 준비 중이에요. 즐거운 플레이! 👾'));
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

    renderGames();
