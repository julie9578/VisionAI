const games = [
      { id: 'valorant', title: '발로란트', english: 'VALORANT', genre: '액션', tag: '경쟁 FPS', emoji: '🎯', cover: 'valorant', rating: '4.8', url: 'https://playvalorant.com/ko-kr/', image: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/9167b57d3c081d04e75abe28387d87a27bb83953-3440x1020.jpg?accountingTag=VAL', imagePosition: 'center 43%', description: '요원마다 고유한 능력을 활용해 공격과 수비를 펼치는 5대5 전술 슈팅 게임입니다. 정확한 사격과 팀 전략으로 라운드를 승리로 이끄세요.', screenshots: ['https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/b7e3f4fddaad9797eff1541359ed6c7ec4222f17-1920x1080.jpg?accountingTag=VAL', 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/afb2198aaba170268feaaf799511a56ee40192be-1920x1080.jpg?accountingTag=VAL'] },
      { id: 'hades-2', title: '하데스 II', english: 'HADES II', genre: '액션', tag: '로그라이크', emoji: '🔥', cover: 'hades', rating: '4.9', url: 'https://www.supergiantgames.com/games/hades-ii/', image: 'https://images.ctfassets.net/5owu3y35gz1g/2J66RQRNqhF3jK5dbPOt9h/6fe752a31a2b87715c56cd0612cbcaed/3840x2160_v1.0_KeyArt.png?w=900&q=80', imagePosition: 'center 38%', description: '시간의 타이탄에 맞서 지하 세계 너머를 탐험하는 로그라이크 액션 게임입니다. 어둠의 마법과 다양한 무기를 조합해 매번 새로운 전투에 도전하세요.', screenshots: ['https://images.ctfassets.net/5owu3y35gz1g/2J66RQRNqhF3jK5dbPOt9h/6fe752a31a2b87715c56cd0612cbcaed/3840x2160_v1.0_KeyArt.png?w=1200&q=80'] },
      { id: 'stardew-valley', title: '스타듀 밸리', english: 'STARDEW VALLEY', genre: '인디', tag: '힐링 · 농장', emoji: '🌻', cover: 'stardew', rating: '4.9', url: 'https://www.stardewvalley.net/', image: 'https://www.stardewvalley.net/wp-content/uploads/2017/12/stardewbackground.png', imagePosition: 'center 48%', description: '할아버지에게 물려받은 농장을 가꾸며 나만의 새로운 삶을 시작하세요. 작물을 기르고, 낚시와 채집을 즐기고, 마을 주민들과 관계를 쌓을 수 있습니다.', screenshots: ['https://www.stardewvalley.net/wp-content/uploads/2018/12/1_1screenshot15.png'] },
      { id: 'elden-ring', title: '엘든 링', english: 'ELDEN RING', genre: 'RPG', tag: '오픈월드', emoji: '🐉', cover: 'elden', rating: '4.9', url: 'https://www.bandainamcoent.com/games/elden-ring', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900_2x.jpg', imageFit: 'contain', imagePosition: 'center 35%', description: '광활한 틈새의 땅을 탐험하는 다크 판타지 액션 RPG입니다. 자신만의 캐릭터와 전투 방식을 만들고, 숨겨진 이야기와 강력한 적들을 만나보세요.', screenshots: ['https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900_2x.jpg'] },
      { id: 'zelda-totk', title: '젤다의 전설', english: 'TEARS OF THE KINGDOM', genre: '어드벤처', tag: '오픈월드', emoji: '🗡️', cover: 'zelda', rating: '4.9', url: 'https://www.nintendo.com/us/store/products/the-legend-of-zelda-tears-of-the-kingdom-switch/', image: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto/f_auto/dpr_2.0/store/software/switch/70010000063714/fb30eab428df3fc993b41c76e20f72e4d76d49734d17d31996b5ab61c414b117', imagePosition: 'center 38%', description: '하이랄의 대지와 하늘섬을 자유롭게 누비는 어드벤처입니다. 링크의 새로운 능력으로 탐험하고, 물체를 조합해 나만의 해법을 만들어 보세요.', screenshots: ['https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto/f_auto/dpr_2.0/store/software/switch/70010000063714/fb30eab428df3fc993b41c76e20f72e4d76d49734d17d31996b5ab61c414b117'] },
      { id: 'cyberpunk-2077', title: '사이버펑크 2077', english: 'CYBERPUNK 2077', genre: 'RPG', tag: '오픈월드', emoji: '🌆', cover: 'cyber', rating: '4.7', url: 'https://www.cyberpunk.net/', image: 'https://www.cyberpunk.net/build/images/social-thumbnail-en-ddcf4d23.jpg', imagePosition: 'center 40%', description: '거대 도시 나이트 시티를 무대로 펼쳐지는 오픈월드 액션 RPG입니다. 용병 V가 되어 의뢰를 수행하고, 선택에 따라 달라지는 이야기를 경험하세요.', screenshots: ['https://www.cyberpunk.net/build/images/social-thumbnail-en-ddcf4d23.jpg'] },
      { id: 'persona-5-royal', title: '페르소나 5 더 로열', english: 'PERSONA 5 ROYAL', genre: 'RPG', tag: 'JRPG', emoji: '🎭', cover: 'persona', rating: '4.8', url: 'https://persona.atlus.com/p5r/', image: 'https://persona.atlus.com/p5r/resources/img/ogp.jpg', imagePosition: 'center 35%', description: '낮에는 도쿄에서 학생으로 생활하고 밤에는 마음의 세계를 바꾸는 괴도로 활약하는 스타일리시 JRPG입니다. 동료들과의 관계와 턴제 전투를 즐겨보세요.', screenshots: ['https://persona.atlus.com/p5r/resources/img/ogp.jpg'] },
      { id: 'ori-will-of-wisps', title: '오리와 도깨비불', english: 'ORI AND THE WILL', genre: '인디', tag: '플랫포머', emoji: '🦋', cover: 'ori', rating: '4.8', url: 'https://www.orithegame.com/', image: 'https://ori-prod.azureedge.net/wp-content/uploads/2021/08/WOTW-boxArt-1024x786.png', imageFit: 'contain', imagePosition: 'center 42%', description: '작은 정령 오리가 올빼미 쿠를 구하고 가족을 다시 만나기 위해 떠나는 감성적인 플랫포머 어드벤처입니다. 손으로 그린 듯한 세계를 탐험하고 정교한 플랫폼 액션을 경험하세요.', screenshots: ['https://ori-prod.azureedge.net/wp-content/uploads/2021/08/WOTW-boxArt-1024x786.png'] },
      { id: 'team-fortress-2', title: '팀 포트리스 2', english: 'TEAM FORTRESS 2', genre: '액션', tag: '팀 기반 슈터', emoji: '💥', cover: 'tf2', rating: '4.8', url: 'https://store.steampowered.com/app/440/Team_Fortress_2/', image: 'https://cdn.akamai.steamstatic.com/steam/apps/440/header.jpg', description: '개성 넘치는 아홉 병과 중 하나를 선택해 팀 대전에 뛰어드는 무료 액션 게임입니다. 다양한 모드와 맵, 장비를 활용해 팀을 승리로 이끄세요.', screenshots: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/440/ss_ea21f7bbf4f79bada4554df5108d04b6889d3453.1920x1080.jpg?t=1757348372', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/440/ss_e3aedb2ab36bba8cfe611b1e0eaa807e4bb2d742.1920x1080.jpg?t=1757348372'] },
      { id: 'apex-legends', title: '에이펙스 레전드', english: 'APEX LEGENDS', genre: '액션', tag: '배틀로얄', emoji: '🛡️', cover: 'apex', rating: '4.7', url: 'https://store.steampowered.com/app/1172470/Apex_Legends/', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg', description: '각기 다른 능력을 지닌 레전드들이 분대 단위로 경쟁하는 무료 히어로 슈팅 게임입니다. 팀워크와 전술을 활용해 최후의 승리를 차지하세요.', screenshots: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/3fc2dfcf0e8d7d7202a3ca32ae26c7afaec723e2/ss_3fc2dfcf0e8d7d7202a3ca32ae26c7afaec723e2.1920x1080.jpg?t=1790164440', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/d64ce54903a3ba6429c6e3189ad746a7db70ee3e/ss_d64ce54903a3ba6429c6e3189ad746a7db70ee3e.1920x1080.jpg?t=1790164440'] },
      { id: 'overwatch', title: '오버워치', english: 'OVERWATCH', genre: '액션', tag: '히어로 슈터', emoji: '🦸', cover: 'overwatch', rating: '4.6', url: 'https://store.steampowered.com/app/2357570/Overwatch/', image: 'https://cdn.akamai.steamstatic.com/steam/apps/2357570/header.jpg', description: '개성 있는 영웅과 능력을 조합해 팀으로 목표를 겨루는 무료 팀 기반 액션 게임입니다. 빠른 전투와 협동 플레이를 즐겨보세요.', screenshots: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2357570/c48aa3d3379473f92df5f2665e1a28144900b1f8/ss_c48aa3d3379473f92df5f2665e1a28144900b1f8.1920x1080.jpg?t=1791576843', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2357570/6cea8a8817ae0a8dd5198052ffeba742b1a90b8e/ss_6cea8a8817ae0a8dd5198052ffeba742b1a90b8e.1920x1080.jpg?t=1791576843'] },
      { id: 'rainbow-six-siege', title: '레인보우 식스 시즈', english: 'RAINBOW SIX SIEGE', genre: '액션', tag: '전술 FPS', emoji: '🎯', cover: 'siege', rating: '4.6', url: 'https://store.steampowered.com/app/359550/Tom_Clancys_Rainbow_Six_Siege/', image: 'https://cdn.akamai.steamstatic.com/steam/apps/359550/header.jpg', description: '공격과 방어 팀이 정보 수집, 장비, 파괴 가능한 환경을 활용해 맞붙는 전술 슈팅 게임입니다. 팀원과 계획을 세우고 매 라운드 상황에 대응하세요.', screenshots: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/359550/2efed3587d876f560cbf3f25d9a72fbd387b74e6/ss_2efed3587d876f560cbf3f25d9a72fbd387b74e6.1920x1080.jpg?t=1792001976', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/359550/ee34a63203916d39dc50d96c14aefc24dc3ff34e/ss_ee34a63203916d39dc50d96c14aefc24dc3ff34e.1920x1080.jpg?t=1792001976'] },
      { id: 'valheim', title: '발헤임', english: 'VALHEIM', genre: 'RPG', tag: '생존 · 협동', emoji: '🪓', cover: 'valheim', rating: '4.8', url: 'https://store.steampowered.com/app/892970/Valheim/', image: 'https://cdn.akamai.steamstatic.com/steam/apps/892970/header.jpg', description: '북유럽 신화에서 영감을 받은 세계를 탐험하는 생존·제작 게임입니다. 자원을 모으고 집과 배를 만들며 혼자 또는 친구들과 모험을 이어가세요.', screenshots: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/892970/5a31353178f635b67f0c8720ebb8a1a95b637276/ss_5a31353178f635b67f0c8720ebb8a1a95b637276.1920x1080.jpg?t=1791544831', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/892970/bc7c361dab1780543a3ceca50c8fba831e5bc8db/ss_bc7c361dab1780543a3ceca50c8fba831e5bc8db.1920x1080.jpg?t=1791544831'] },
      { id: 'warframe', title: '워프레임', english: 'WARFRAME', genre: '액션', tag: '협동 액션 RPG', emoji: '⚔️', cover: 'warframe', rating: '4.7', url: 'https://store.steampowered.com/app/230410/Warframe/', image: 'https://cdn.akamai.steamstatic.com/steam/apps/230410/header.jpg', description: '강력한 워프레임 전사로 깨어나 광대한 태양계를 누비는 무료 온라인 액션 게임입니다. 다양한 장비를 성장시키고 친구들과 임무를 완수하세요.', screenshots: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/230410/ss_2e4077f215eccde84171a4b8e0f2bc8a3264c776.1920x1080.jpg?t=1792613117', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/230410/ss_0a541a8bf59e212870ea8d82260ac1b3ae2d0354.1920x1080.jpg?t=1792613117'] },
      { id: 'rocket-league', title: '로켓 리그', english: 'ROCKET LEAGUE', genre: '스포츠', tag: '아케이드 축구', emoji: '🚗', cover: 'rocket-league', rating: '4.6', url: 'https://store.steampowered.com/app/252950/Rocket_League/', image: 'https://cdn.akamai.steamstatic.com/steam/apps/252950/header.jpg', description: '아케이드 축구와 자동차 액션을 결합한 스포츠 게임입니다. 로켓 추진 자동차를 조종해 온라인 대전에서 골을 넣고 팀을 승리로 이끄세요.', screenshots: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252950/4fa01c320d22f31d78fd9fcb27dbd3bd8871b903/ss_4fa01c320d22f31d78fd9fcb27dbd3bd8871b903.1920x1080.jpg?t=1791210513', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252950/23e7d4fcf10475923be9078e55b449b7fc9792d9/ss_23e7d4fcf10475923be9078e55b449b7fc9792d9.1920x1080.jpg?t=1791210513'] },
      { id: 'project-zomboid', title: '프로젝트 좀보이드', english: 'PROJECT ZOMBOID', genre: 'RPG', tag: '좀비 생존', emoji: '🧟', cover: 'zomboid', rating: '4.8', url: 'https://store.steampowered.com/app/108600/Project_Zomboid/', image: 'https://cdn.akamai.steamstatic.com/steam/apps/108600/header.jpg', description: '좀비 사태가 벌어진 세계에서 식량과 물자를 모으고 거점을 세워 살아남는 하드코어 생존 RPG입니다. 혼자 또는 멀티플레이로 매일의 생존을 이어가세요.', screenshots: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/108600/e0dd37d69051f7da85896d11027ab018d23893fa/ss_e0dd37d69051f7da85896d11027ab018d23893fa.1920x1080.jpg?t=1793224893', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/108600/d9df2102dd12526700b15660bc5ec8f039dc8742/ss_d9df2102dd12526700b15660bc5ec8f039dc8742.1920x1080.jpg?t=1793224893'] },
      { id: 'no-mans-sky', title: '노 맨즈 스카이', english: 'NO MAN\'S SKY', genre: '어드벤처', tag: '우주 탐험', emoji: '🚀', cover: 'no-mans-sky', rating: '4.7', url: 'https://store.steampowered.com/app/275850/No_Mans_Sky/', image: 'https://cdn.akamai.steamstatic.com/steam/apps/275850/header.jpg', description: '절차적으로 생성되는 광활한 우주에서 행성을 탐험하고 생존하는 어드벤처 게임입니다. 비행과 탐험, 거래와 전투를 혼자 또는 친구와 함께 즐기세요.', screenshots: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/275850/7d45478fbac8b1a41172adf8e598784a7d04b41d/ss_7d45478fbac8b1a41172adf8e598784a7d04b41d.1920x1080.jpg?t=1793196605', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/275850/53afb343452e839000d5eab38d0656fcdad9547b/ss_53afb343452e839000d5eab38d0656fcdad9547b.1920x1080.jpg?t=1793196605'] },
      { id: 'lethal-company', title: '리썰 컴퍼니', english: 'LETHAL COMPANY', genre: '인디', tag: '협동 호러', emoji: '👻', cover: 'lethal-company', rating: '4.8', url: 'https://store.steampowered.com/app/1966720/Lethal_Company/', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1966720/header.jpg', description: '버려진 달에서 고철을 수집해 회사의 할당량을 채우는 협동 호러 게임입니다. 동료와 소통하며 위험한 시설을 탐색하고 무사히 탈출하세요.', screenshots: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1966720/ss_78075e9a94675823024f12fce9d69b243cca94f8.1920x1080.jpg?t=1775380053', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1966720/ss_51860be59845771c01a3a4d9ab1ebf773f16fef5.1920x1080.jpg?t=1775380053'] }
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
      const rouletteDialog = document.getElementById('rouletteDialog');
      const result = document.getElementById('rouletteResult');
      const gameLink = document.getElementById('rouletteGameLink');
      result.classList.remove('winner');
      result.textContent = '버튼을 눌러 룰렛을 시작하세요.';
      gameLink.hidden = true;
      rouletteDialog.showModal();
      document.getElementById('spinRouletteButton').focus();
    });
    const rouletteDialog = document.getElementById('rouletteDialog');
    const reelElements = [
      document.getElementById('slotReelOne'),
      document.getElementById('slotReelTwo'),
      document.getElementById('slotReelThree')
    ];
    let spinTimers = [];
    let isSpinning = false;

    document.getElementById('closeRouletteButton').addEventListener('click', () => rouletteDialog.close());
    rouletteDialog.addEventListener('click', event => {
      if (event.target === rouletteDialog) rouletteDialog.close();
    });
    rouletteDialog.addEventListener('close', () => {
      spinTimers.forEach(clearInterval);
      spinTimers = [];
      isSpinning = false;
      document.getElementById('slotMachine').classList.remove('spinning');
      document.getElementById('spinRouletteButton').disabled = false;
      document.getElementById('spinRouletteButton').textContent = '🎰 룰렛 돌리기';
      document.getElementById('randomButton').focus();
    });

    document.getElementById('spinRouletteButton').addEventListener('click', () => {
      if (isSpinning) return;
      isSpinning = true;
      const machine = document.getElementById('slotMachine');
      const spinButton = document.getElementById('spinRouletteButton');
      const result = document.getElementById('rouletteResult');
      const gameLink = document.getElementById('rouletteGameLink');
      const selectedGame = games[Math.floor(Math.random() * games.length)];
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const selectedEmojis = [selectedGame.emoji, selectedGame.emoji, selectedGame.emoji];

      spinButton.disabled = true;
      spinButton.textContent = '룰렛 진행 중…';
      gameLink.hidden = true;
      result.classList.remove('winner');
      result.textContent = '룰렛이 돌아가고 있어요…';
      machine.classList.add('spinning');

      reelElements.forEach((reel, index) => {
        const label = reel.querySelector('span');
        let tick = 0;
        const delay = reducedMotion ? 0 : 850 + index * 480;
        const interval = setInterval(() => {
          const randomGame = games[Math.floor(Math.random() * games.length)];
          label.textContent = randomGame.emoji;
          label.setAttribute('aria-label', randomGame.title);
          tick += 1;
          if (tick >= Math.max(1, Math.floor(delay / 75))) {
            clearInterval(interval);
            label.textContent = selectedEmojis[index];
            label.setAttribute('aria-label', selectedGame.title);
            if (index === reelElements.length - 1) {
              machine.classList.remove('spinning');
              result.innerHTML = `오늘의 추천은 <strong>${selectedGame.title}</strong>! ${selectedGame.emoji}`;
              result.classList.add('winner');
              gameLink.href = `game.html?game=${encodeURIComponent(selectedGame.id)}`;
              gameLink.hidden = false;
              spinButton.disabled = false;
              spinButton.textContent = '다시 돌리기';
              isSpinning = false;
            }
          }
        }, reducedMotion ? 1 : 75);
        spinTimers.push(interval);
      });
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
