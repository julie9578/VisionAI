const games = [
      { id: 'valorant', title: '발로란트', english: 'VALORANT', genre: '액션', tag: '경쟁 FPS', emoji: '🎯', cover: 'valorant', rating: '4.8', url: 'https://playvalorant.com/ko-kr/', image: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/9167b57d3c081d04e75abe28387d87a27bb83953-3440x1020.jpg?accountingTag=VAL', imagePosition: 'center 43%', description: '요원마다 고유한 능력을 활용해 공격과 수비를 펼치는 5대5 전술 슈팅 게임입니다. 정확한 사격과 팀 전략으로 라운드를 승리로 이끄세요.', screenshots: ['https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/b7e3f4fddaad9797eff1541359ed6c7ec4222f17-1920x1080.jpg?accountingTag=VAL', 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/afb2198aaba170268feaaf799511a56ee40192be-1920x1080.jpg?accountingTag=VAL'] },
      { id: 'hades-2', title: '하데스 II', english: 'HADES II', genre: '액션', tag: '로그라이크', emoji: '🔥', cover: 'hades', rating: '4.9', url: 'https://www.supergiantgames.com/games/hades-ii/', image: 'https://images.ctfassets.net/5owu3y35gz1g/2J66RQRNqhF3jK5dbPOt9h/6fe752a31a2b87715c56cd0612cbcaed/3840x2160_v1.0_KeyArt.png?w=900&q=80', imagePosition: 'center 38%', description: '시간의 타이탄에 맞서 지하 세계 너머를 탐험하는 로그라이크 액션 게임입니다. 어둠의 마법과 다양한 무기를 조합해 매번 새로운 전투에 도전하세요.', screenshots: ['https://images.ctfassets.net/5owu3y35gz1g/2J66RQRNqhF3jK5dbPOt9h/6fe752a31a2b87715c56cd0612cbcaed/3840x2160_v1.0_KeyArt.png?w=1200&q=80'] },
      { id: 'stardew-valley', title: '스타듀 밸리', english: 'STARDEW VALLEY', genre: '인디', tag: '힐링 · 농장', emoji: '🌻', cover: 'stardew', rating: '4.9', url: 'https://www.stardewvalley.net/', image: 'https://www.stardewvalley.net/wp-content/uploads/2017/12/stardewbackground.png', imagePosition: 'center 48%', description: '할아버지에게 물려받은 농장을 가꾸며 나만의 새로운 삶을 시작하세요. 작물을 기르고, 낚시와 채집을 즐기고, 마을 주민들과 관계를 쌓을 수 있습니다.', screenshots: ['https://www.stardewvalley.net/wp-content/uploads/2018/12/1_1screenshot15.png'] },
      { id: 'elden-ring', title: '엘든 링', english: 'ELDEN RING', genre: 'RPG', tag: '오픈월드', emoji: '🐉', cover: 'elden', rating: '4.9', url: 'https://www.bandainamcoent.com/games/elden-ring', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900_2x.jpg', imageFit: 'contain', imagePosition: 'center 35%', description: '광활한 틈새의 땅을 탐험하는 다크 판타지 액션 RPG입니다. 자신만의 캐릭터와 전투 방식을 만들고, 숨겨진 이야기와 강력한 적들을 만나보세요.', screenshots: ['https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900_2x.jpg'] },
      { id: 'zelda-totk', title: '젤다의 전설', english: 'TEARS OF THE KINGDOM', genre: '어드벤처', tag: '오픈월드', emoji: '🗡️', cover: 'zelda', rating: '4.9', url: 'https://www.nintendo.com/us/store/products/the-legend-of-zelda-tears-of-the-kingdom-switch/', image: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto/f_auto/dpr_2.0/store/software/switch/70010000063714/fb30eab428df3fc993b41c76e20f72e4d76d49734d17d31996b5ab61c414b117', imagePosition: 'center 38%', description: '하이랄의 대지와 하늘섬을 자유롭게 누비는 어드벤처입니다. 링크의 새로운 능력으로 탐험하고, 물체를 조합해 나만의 해법을 만들어 보세요.', screenshots: ['https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto/f_auto/dpr_2.0/store/software/switch/70010000063714/fb30eab428df3fc993b41c76e20f72e4d76d49734d17d31996b5ab61c414b117'] },
      { id: 'cyberpunk-2077', title: '사이버펑크 2077', english: 'CYBERPUNK 2077', genre: 'RPG', tag: '오픈월드', emoji: '🌆', cover: 'cyber', rating: '4.7', url: 'https://www.cyberpunk.net/', image: 'https://www.cyberpunk.net/build/images/social-thumbnail-en-ddcf4d23.jpg', imagePosition: 'center 40%', description: '거대 도시 나이트 시티를 무대로 펼쳐지는 오픈월드 액션 RPG입니다. 용병 V가 되어 의뢰를 수행하고, 선택에 따라 달라지는 이야기를 경험하세요.', screenshots: ['https://www.cyberpunk.net/build/images/social-thumbnail-en-ddcf4d23.jpg'] },
      { id: 'persona-5-royal', title: '페르소나 5 더 로열', english: 'PERSONA 5 ROYAL', genre: 'RPG', tag: 'JRPG', emoji: '🎭', cover: 'persona', rating: '4.8', url: 'https://persona.atlus.com/p5r/', image: 'https://persona.atlus.com/p5r/resources/img/ogp.jpg', imagePosition: 'center 35%', description: '낮에는 도쿄에서 학생으로 생활하고 밤에는 마음의 세계를 바꾸는 괴도로 활약하는 스타일리시 JRPG입니다. 동료들과의 관계와 턴제 전투를 즐겨보세요.', screenshots: ['https://persona.atlus.com/p5r/resources/img/ogp.jpg'] },
      { id: 'ori-will-of-wisps', title: '오리와 도깨비불', english: 'ORI AND THE WILL', genre: '인디', tag: '플랫포머', emoji: '🦋', cover: 'ori', rating: '4.8', url: 'https://www.orithegame.com/', image: 'https://ori-prod.azureedge.net/wp-content/uploads/2021/08/WOTW-boxArt-1024x786.png', imageFit: 'contain', imagePosition: 'center 42%', description: '작은 정령 오리가 올빼미 쿠를 구하고 가족을 다시 만나기 위해 떠나는 감성적인 플랫포머 어드벤처입니다. 손으로 그린 듯한 세계를 탐험하고 정교한 플랫폼 액션을 경험하세요.', screenshots: ['https://ori-prod.azureedge.net/wp-content/uploads/2021/08/WOTW-boxArt-1024x786.png'] }
    ];

    const detailPage = document.getElementById('gameDetail');
    const currentGameId = new URLSearchParams(window.location.search).get('game');

    if (detailPage) {
      const game = games.find(item => item.id === currentGameId);
      if (!game) {
        document.title = '게임을 찾을 수 없음 — ARCADE';
        detailPage.innerHTML = '<p class="detail-error">요청한 게임을 찾을 수 없어요. <a href="index.html#games">게임 목록으로 돌아가기</a></p>';
      } else {
        document.title = `${game.title} — 게임 정보 | ARCADE`;
        document.querySelector('meta[name="description"]')?.setAttribute('content', `${game.title}: ${game.description}`);
        const screenshots = [...new Set([game.image, ...(game.screenshots || [])].filter(Boolean))];
        detailPage.innerHTML = `
          <p class="detail-breadcrumb"><a href="index.html">홈</a>　/　<a href="index.html#games">게임 둘러보기</a>　/　${game.title}</p>
          <article class="detail-hero">
            <div class="detail-art" role="img" aria-label="${game.title} 대표 이미지" style="--detail-image: url('${game.image || ''}'); --detail-fit: ${game.imageFit || 'cover'}; --detail-position: ${game.imagePosition || 'center'}"><span class="detail-art-label">${game.english}</span></div>
            <div class="detail-copy">
              <p class="detail-kicker">${game.genre} · ${game.tag}</p>
              <h1 class="detail-title">${game.title}</h1>
              <p class="detail-english">${game.english}</p>
              <div class="detail-badges"><span class="detail-badge">${game.genre}</span><span class="detail-badge">${game.tag}</span><span class="detail-badge detail-rating">★ ${game.rating}</span></div>
              <p class="detail-description">${game.description}</p>
              <a class="button official-site-button" href="${game.url}" target="_blank" rel="noopener noreferrer">공식 사이트 방문 <span aria-hidden="true">↗</span></a>
            </div>
          </article>
          <section class="detail-section" aria-labelledby="screenshotsTitle">
            <div class="detail-section-heading"><p class="section-kicker">SCREENSHOTS & ARTWORK</p><h2 id="screenshotsTitle">스크린샷 및 이미지</h2></div>
            <div class="screenshot-grid">${screenshots.map((image, index) => `<figure class="screenshot-card"><img src="${image}" alt="${game.title} 게임 이미지 ${index + 1}" loading="lazy" /><figcaption class="screenshot-caption">${game.title} · ${index === 0 ? '대표 이미지' : '게임 이미지'}</figcaption></figure>`).join('')}</div>
          </section>`;
      }
    }

    const grid = document.getElementById('gameGrid');
    if (!grid) return;

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
          <button class="favorite ${favorites.has(game.title) ? 'saved' : ''}" type="button" data-title="${encodeURIComponent(game.title)}" aria-label="${game.title} ${favorites.has(game.title) ? '즐겨찾기 해제' : '즐겨찾기 추가'}" aria-pressed="${favorites.has(game.title)}">♥</button>
          <a class="game-card-link" href="game.html?game=${encodeURIComponent(game.id)}" aria-label="${game.title} 상세 정보 보기">
            <div class="game-cover cover-${game.cover}"${game.image ? ` style="--game-image: url('${game.image}'); --game-image-fit: ${game.imageFit || 'cover'}; --game-image-position: ${game.imagePosition || 'center'}"` : ''}>
              <span class="cover-label">${game.english}</span>
              ${game.image ? '' : `<span class="cover-emoji" aria-hidden="true">${game.emoji}</span>`}
            </div>
            <div class="game-info"><div class="game-title-row"><h3 class="game-title">${game.title}<span class="official-link-icon" aria-hidden="true">↗</span></h3><span class="rating">★ ${game.rating}</span></div><div class="game-meta"><span>${game.genre} · ${game.tag}</span><span>상세 정보 보기</span></div></div>
          </a>
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
