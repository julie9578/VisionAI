function initializeArcade() {
  const games = [
      { id: 'valorant', title: '발로란트', english: 'VALORANT', genre: '액션', tag: '전술 슈팅', reviewScore: null, steamRank: null, ratingSource: null, emoji: '🎯', cover: 'valorant', url: 'https://playvalorant.com/ko-kr/', image: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/9167b57d3c081d04e75abe28387d87a27bb83953-3440x1020.jpg?accountingTag=VAL', imagePosition: 'center 43%', description: '요원마다 고유한 능력을 활용해 공격과 수비를 펼치는 5대5 전술 슈팅 게임입니다. 정확한 사격과 팀 전략으로 라운드를 승리로 이끄세요.', screenshots: ['https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/b7e3f4fddaad9797eff1541359ed6c7ec4222f17-1920x1080.jpg?accountingTag=VAL', 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/afb2198aaba170268feaaf799511a56ee40192be-1920x1080.jpg?accountingTag=VAL'] },
      { id: 'hades-2', title: '하데스 II', english: 'HADES II', genre: '액션', tag: '로그라이크 RPG', reviewScore: 93, steamRank: null, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '🔥', cover: 'hades', url: 'https://www.supergiantgames.com/games/hades-ii/', image: 'https://images.ctfassets.net/5owu3y35gz1g/2J66RQRNqhF3jK5dbPOt9h/6fe752a31a2b87715c56cd0612cbcaed/3840x2160_v1.0_KeyArt.png?w=900&q=80', imagePosition: 'center 38%', description: '시간의 타이탄에 맞서 지하 세계 너머를 탐험하는 로그라이크 액션 게임입니다. 어둠의 마법과 다양한 무기를 조합해 매번 새로운 전투에 도전하세요.', screenshots: ['https://images.ctfassets.net/5owu3y35gz1g/2J66RQRNqhF3jK5dbPOt9h/6fe752a31a2b87715c56cd0612cbcaed/3840x2160_v1.0_KeyArt.png?w=1200&q=80'] },
      { id: 'stardew-valley', title: '스타듀 밸리', english: 'STARDEW VALLEY', genre: '인디', tag: '농장 시뮬레이션', reviewScore: 98, steamRank: 23, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '🌻', cover: 'stardew', url: 'https://www.stardewvalley.net/', image: 'https://www.stardewvalley.net/wp-content/uploads/2017/12/stardewbackground.png', imagePosition: 'center 48%', description: '할아버지에게 물려받은 농장을 가꾸며 나만의 새로운 삶을 시작하세요. 작물을 기르고, 낚시와 채집을 즐기고, 마을 주민들과 관계를 쌓을 수 있습니다.', screenshots: ['https://www.stardewvalley.net/wp-content/uploads/2018/12/1_1screenshot15.png'] },
      { id: 'elden-ring', title: '엘든 링', english: 'ELDEN RING', genre: 'RPG', tag: '다크 판타지', reviewScore: 92, steamRank: 67, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '🐉', cover: 'elden', url: 'https://www.bandainamcoent.com/games/elden-ring', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900_2x.jpg', imageFit: 'contain', imagePosition: 'center 35%', description: '광활한 틈새의 땅을 탐험하는 다크 판타지 액션 RPG입니다. 자신만의 캐릭터와 전투 방식을 만들고, 숨겨진 이야기와 강력한 적들을 만나보세요.', screenshots: ['https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900_2x.jpg'] },
      { id: 'zelda-totk', title: '젤다의 전설', english: 'TEARS OF THE KINGDOM', genre: '어드벤처', tag: '오픈월드 탐험', reviewScore: null, steamRank: null, ratingSource: null, emoji: '🗡️', cover: 'zelda', url: 'https://www.nintendo.com/us/store/products/the-legend-of-zelda-tears-of-the-kingdom-switch/', image: 'https://assets.nintendo.com/image/upload/ar_16:9,b_auto:border,c_lpad/b_white/f_auto/q_auto/dpr_2.0/store/software/switch/70010000063714/fb30eab428df3fc993b41c76e20f72e4d76d49734d17d31996b5ab61c414b117', imagePosition: 'center 38%', description: '하이랄의 대지와 하늘섬을 자유롭게 누비는 어드벤처입니다. 링크의 새로운 능력으로 탐험하고, 물체를 조합해 나만의 해법을 만들어 보세요.', screenshots: ['https://assets.nintendo.com/video/upload/so_1,f_jpg,q_auto/Microsites/zelda-tears-of-the-kingdom/videos/totk_microsite_features_ultrahand.jpg', 'https://assets.nintendo.com/video/upload/so_1,f_jpg,q_auto/Microsites/zelda-tears-of-the-kingdom/videos/totk_microsite_features_fuse.jpg', 'https://assets.nintendo.com/video/upload/so_1,f_jpg,q_auto/Microsites/zelda-tears-of-the-kingdom/videos/totk_microsite_features_ascend.jpg'] },
      { id: 'cyberpunk-2077', title: '사이버펑크 2077', english: 'CYBERPUNK 2077', genre: 'RPG', tag: '오픈월드 미래', reviewScore: 94, steamRank: 8, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '🌆', cover: 'cyber', url: 'https://www.cyberpunk.net/', image: 'https://www.cyberpunk.net/build/images/social-thumbnail-en-ddcf4d23.jpg', imagePosition: 'center 40%', description: '거대 도시 나이트 시티를 무대로 펼쳐지는 오픈월드 액션 RPG입니다. 용병 V가 되어 의뢰를 수행하고, 선택에 따라 달라지는 이야기를 경험하세요.', screenshots: ['https://www.cyberpunk.net/build/images/social-thumbnail-en-ddcf4d23.jpg'] },
      { id: 'persona-5-royal', title: '페르소나 5 더 로열', english: 'PERSONA 5 ROYAL', genre: 'RPG', tag: '턴제 스토리', reviewScore: 95, steamRank: null, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '🎭', cover: 'persona', url: 'https://persona.atlus.com/p5r/', image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1687950/header.jpg?t=1783356822", imagePosition: 'center 35%', description: '낮에는 도쿄에서 학생으로 생활하고 밤에는 마음의 세계를 바꾸는 괴도로 활약하는 스타일리시 JRPG입니다. 동료들과의 관계와 턴제 전투를 즐겨보세요.', screenshots: ["https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1687950/ss_663171dc3afce8fe987e57e8659f91b69faa39bc.1920x1080.jpg?t=1783356822", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1687950/ss_a3258aba84ae2f2ff13a02a160f7495bfc152adb.1920x1080.jpg?t=1783356822", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1687950/ss_ddcc016b8e5c434ccbd1a89c0157ce73acf905ae.1920x1080.jpg?t=1783356822"] },
      { id: 'ori-will-of-wisps', title: '오리와 도깨비불', english: 'ORI AND THE WILL', genre: '인디', tag: '플랫포머 어드벤처', reviewScore: 94, steamRank: null, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '🦋', cover: 'ori', url: 'https://www.orithegame.com/', image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1057090/header.jpg?t=1759530749", imageFit: 'contain', imagePosition: 'center 42%', description: '작은 정령 오리가 올빼미 쿠를 구하고 가족을 다시 만나기 위해 떠나는 감성적인 플랫포머 어드벤처입니다. 손으로 그린 듯한 세계를 탐험하고 정교한 플랫폼 액션을 경험하세요.', screenshots: ["https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1057090/ss_0cf0ec6681ae5771173790dbc99ddb3bf3b886ad.1920x1080.jpg?t=1759530749", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1057090/ss_f8ac174b7949e89fe1939a7bd2c471785dee55f0.1920x1080.jpg?t=1759530749", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1057090/ss_3ae04b208aaff3869f69617c47449ec1d7a06513.1920x1080.jpg?t=1759530749"] },
      { id: 'team-fortress-2', title: '팀 포트리스 2', english: 'TEAM FORTRESS 2', genre: '액션', source: 'steam', tag: '슈팅', reviewScore: 92, steamRank: 12, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '💥', cover: 'tf2', url: 'https://store.steampowered.com/app/440/Team_Fortress_2/', image: 'https://cdn.akamai.steamstatic.com/steam/apps/440/header.jpg', description: '개성 넘치는 아홉 병과 중 하나를 선택해 팀 대전에 뛰어드는 무료 액션 게임입니다. 다양한 모드와 맵, 장비를 활용해 팀을 승리로 이끄세요.', screenshots: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/440/ss_ea21f7bbf4f79bada4554df5108d04b6889d3453.1920x1080.jpg?t=1757348372', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/440/ss_e3aedb2ab36bba8cfe611b1e0eaa807e4bb2d742.1920x1080.jpg?t=1757348372'] },
      { id: 'apex-legends', title: '에이펙스 레전드', english: 'APEX LEGENDS', genre: '액션', source: 'steam', tag: '슈팅', reviewScore: 65, steamRank: 10, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '🛡️', cover: 'apex', url: 'https://store.steampowered.com/app/1172470/Apex_Legends/', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg', description: '각기 다른 능력을 지닌 레전드들이 분대 단위로 경쟁하는 무료 히어로 슈팅 게임입니다. 팀워크와 전술을 활용해 최후의 승리를 차지하세요.', screenshots: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/3fc2dfcf0e8d7d7202a3ca32ae26c7afaec723e2/ss_3fc2dfcf0e8d7d7202a3ca32ae26c7afaec723e2.1920x1080.jpg?t=1790164440', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/d64ce54903a3ba6429c6e3189ad746a7db70ee3e/ss_d64ce54903a3ba6429c6e3189ad746a7db70ee3e.1920x1080.jpg?t=1790164440'] },
      { id: 'overwatch', title: '오버워치 2', english: 'OVERWATCH 2', genre: '액션', source: 'steam', tag: '5대5 팀 슈팅', reviewScore: 55, steamRank: 26, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '🦸', cover: 'overwatch', url: 'https://store.steampowered.com/app/2357570/Overwatch/', image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2357570/5c208b2699cd38ed6125d039be388fa744db54a4/header_alt_assets_23.jpg?t=1793732501', description: '오버워치 2는 개성 있는 영웅들이 5대5 또는 6대6 전장에서 맞붙는 무료 팀 기반 슈팅 게임입니다. 영웅의 능력을 조합해 팀 목표를 달성하세요.', screenshots: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2357570/c48aa3d3379473f92df5f2665e1a28144900b1f8/ss_c48aa3d3379473f92df5f2665e1a28144900b1f8.1920x1080.jpg?t=1793732501', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2357570/6cea8a8817ae0a8dd5198052ffeba742b1a90b8e/ss_6cea8a8817ae0a8dd5198052ffeba742b1a90b8e.1920x1080.jpg?t=1793732501', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2357570/2830b5babd473e7e76fa522d4c1858386d3acfb1/ss_2830b5babd473e7e76fa522d4c1858386d3acfb1.1920x1080.jpg?t=1793732501'] },
      { id: 'rainbow-six-siege', title: '레인보우 식스 시즈', english: 'RAINBOW SIX SIEGE', genre: '액션', source: 'steam', tag: '슈팅', reviewScore: 75, steamRank: 25, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '🎯', cover: 'siege', url: 'https://store.steampowered.com/app/359550/Tom_Clancys_Rainbow_Six_Siege/', image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/359550/1c7b1ea3405a69c54429e2aa3dc31f3cbbeaa456/header_alt_assets_28.jpg?t=1792001976", description: '공격과 방어 팀이 정보 수집, 장비, 파괴 가능한 환경을 활용해 맞붙는 전술 슈팅 게임입니다. 팀원과 계획을 세우고 매 라운드 상황에 대응하세요.', screenshots: ["https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/359550/2efed3587d876f560cbf3f25d9a72fbd387b74e6/ss_2efed3587d876f560cbf3f25d9a72fbd387b74e6.1920x1080.jpg?t=1792001976", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/359550/ee34a63203916d39dc50d96c14aefc24dc3ff34e/ss_ee34a63203916d39dc50d96c14aefc24dc3ff34e.1920x1080.jpg?t=1792001976", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/359550/00fb4ac1f236cfd2e364ebfecb599a30b72560fe/ss_00fb4ac1f236cfd2e364ebfecb599a30b72560fe.1920x1080.jpg?t=1792001976"] },
      { id: 'valheim', title: '발헤임', english: 'VALHEIM', genre: '어드벤처', source: 'steam', tag: '생존·탐험', reviewScore: 78, steamRank: 30, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '🪓', cover: 'valheim', url: 'https://store.steampowered.com/app/892970/Valheim/', image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/892970/1888731b59362fca6c026cdbafa3dfffd45c3146/header_alt_assets_6.jpg?t=1791544831", description: '북유럽 신화에서 영감을 받은 세계를 탐험하는 생존·제작 게임입니다. 자원을 모으고 집과 배를 만들며 혼자 또는 친구들과 모험을 이어가세요.', screenshots: ["https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/892970/5a31353178f635b67f0c8720ebb8a1a95b637276/ss_5a31353178f635b67f0c8720ebb8a1a95b637276.1920x1080.jpg?t=1791544831", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/892970/bc7c361dab1780543a3ceca50c8fba831e5bc8db/ss_bc7c361dab1780543a3ceca50c8fba831e5bc8db.1920x1080.jpg?t=1791544831", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/892970/ss_a600a7d4ca954543e22f571a9629521a13f82143.1920x1080.jpg?t=1791544831"] },
      { id: 'warframe', title: '워프레임', english: 'WARFRAME', genre: '액션', source: 'steam', tag: '협동 RPG', reviewScore: 86, steamRank: 17, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '⚔️', cover: 'warframe', url: 'https://store.steampowered.com/app/230410/Warframe/', image: 'https://cdn.akamai.steamstatic.com/steam/apps/230410/header.jpg', description: '강력한 워프레임 전사로 깨어나 광대한 태양계를 누비는 무료 온라인 액션 게임입니다. 다양한 장비를 성장시키고 친구들과 임무를 완수하세요.', screenshots: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/230410/ss_2e4077f215eccde84171a4b8e0f2bc8a3264c776.1920x1080.jpg?t=1792613117', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/230410/ss_0a541a8bf59e212870ea8d82260ac1b3ae2d0354.1920x1080.jpg?t=1792613117'] },
      { id: 'rocket-league', title: '로켓 리그', english: 'ROCKET LEAGUE', genre: '스포츠', source: 'steam', tag: '차량 축구', reviewScore: 71, steamRank: null, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '🚗', cover: 'rocket-league', url: 'https://store.steampowered.com/app/252950/Rocket_League/', image: 'https://cdn.akamai.steamstatic.com/steam/apps/252950/header.jpg', description: '아케이드 축구와 자동차 액션을 결합한 스포츠 게임입니다. 로켓 추진 자동차를 조종해 온라인 대전에서 골을 넣고 팀을 승리로 이끄세요.', screenshots: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252950/4fa01c320d22f31d78fd9fcb27dbd3bd8871b903/ss_4fa01c320d22f31d78fd9fcb27dbd3bd8871b903.1920x1080.jpg?t=1791210513', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252950/23e7d4fcf10475923be9078e55b449b7fc9792d9/ss_23e7d4fcf10475923be9078e55b449b7fc9792d9.1920x1080.jpg?t=1791210513'] },
      { id: 'project-zomboid', title: '프로젝트 좀보이드', english: 'PROJECT ZOMBOID', genre: '인디', source: 'steam', tag: '생존·탐험', reviewScore: 92, steamRank: 36, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '🧟', cover: 'zomboid', url: 'https://store.steampowered.com/app/108600/Project_Zomboid/', image: 'https://cdn.akamai.steamstatic.com/steam/apps/108600/header.jpg', description: '좀비 사태가 벌어진 세계에서 식량과 물자를 모으고 거점을 세워 살아남는 하드코어 생존 RPG입니다. 혼자 또는 멀티플레이로 매일의 생존을 이어가세요.', screenshots: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/108600/e0dd37d69051f7da85896d11027ab018d23893fa/ss_e0dd37d69051f7da85896d11027ab018d23893fa.1920x1080.jpg?t=1793224893', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/108600/d9df2102dd12526700b15660bc5ec8f039dc8742/ss_d9df2102dd12526700b15660bc5ec8f039dc8742.1920x1080.jpg?t=1793224893'] },
      { id: 'no-mans-sky', title: '노 맨즈 스카이', english: 'NO MAN\'S SKY', genre: '어드벤처', source: 'steam', tag: '생존·탐험', reviewScore: 90, steamRank: null, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '🚀', cover: 'no-mans-sky', url: 'https://store.steampowered.com/app/275850/No_Mans_Sky/', image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/275850/9f1ca9e3b7d1dccb7b5af404a6739ddc1118ef32/header_alt_assets_26.jpg?t=1793196605", description: '절차적으로 생성되는 광활한 우주에서 행성을 탐험하고 생존하는 어드벤처 게임입니다. 비행과 탐험, 거래와 전투를 혼자 또는 친구와 함께 즐기세요.', screenshots: ["https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/275850/7d45478fbac8b1a41172adf8e598784a7d04b41d/ss_7d45478fbac8b1a41172adf8e598784a7d04b41d.1920x1080.jpg?t=1793196605", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/275850/53afb343452e839000d5eab38d0656fcdad9547b/ss_53afb343452e839000d5eab38d0656fcdad9547b.1920x1080.jpg?t=1793196605", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/275850/6c2ddcffe192b0e155a69aa2a1dd3f33b863033d/ss_6c2ddcffe192b0e155a69aa2a1dd3f33b863033d.1920x1080.jpg?t=1793196605"] },
      { id: 'lethal-company', title: '리썰 컴퍼니', english: 'LETHAL COMPANY', genre: '인디', source: 'steam', tag: '협동 호러', reviewScore: 89, steamRank: null, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '👻', cover: 'lethal-company', url: 'https://store.steampowered.com/app/1966720/Lethal_Company/', image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1966720/header.jpg?t=1775380053", description: '버려진 달에서 고철을 수집해 회사의 할당량을 채우는 협동 호러 게임입니다. 동료와 소통하며 위험한 시설을 탐색하고 무사히 탈출하세요.', screenshots: ["https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1966720/ss_78075e9a94675823024f12fce9d69b243cca94f8.1920x1080.jpg?t=1775380053", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1966720/ss_51860be59845771c01a3a4d9ab1ebf773f16fef5.1920x1080.jpg?t=1775380053", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1966720/ss_08fa3ef83b6eb70313119096f82285fa411f02e5.1920x1080.jpg?t=1775380053"] },
      { id: 'cities-skylines', title: '시티즈: 스카이라인', english: 'CITIES: SKYLINES', genre: '시뮬레이션', source: 'steam', tag: '도시 건설', reviewScore: null, steamRank: null, ratingSource: null, emoji: '🏙️', cover: 'cities-skylines', url: 'https://store.steampowered.com/app/255710/Cities_Skylines/', image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/255710/header.jpg?t=1791468493", description: '도시를 설계하고 성장시키는 도시 건설 시뮬레이션입니다. 도로와 대중교통, 구역 정책, 시민들의 일상을 관리하며 나만의 도시를 만들어 보세요.', screenshots: ["https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/255710/ss_0754001c88ad4dbfff92faf9a97e8d87cf3f8840.1920x1080.jpg?t=1791468493", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/255710/ss_e0f842c9327df9defabf120b6c59e1ba42f54a75.1920x1080.jpg?t=1791468493", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/255710/ss_b5a4b72062b8c4ad677b242963e88c2e624cb1f9.1920x1080.jpg?t=1791468493"] },
      { id: 'euro-truck-simulator-2', title: '유로 트럭 시뮬레이터 2', english: 'EURO TRUCK SIMULATOR 2', genre: '시뮬레이션', source: 'steam', tag: '운전', reviewScore: 96, steamRank: 81, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '🚛', cover: 'euro-truck-2', url: 'https://store.steampowered.com/app/227300/Euro_Truck_Simulator_2/', image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/227300/9a81dc3126c56637297b654f9dcac057cfd79b77/header.jpg?t=1793285269", description: '유럽의 도시와 도로를 달리며 화물을 운송하는 트럭 운전 시뮬레이션입니다. 배송으로 회사를 키우고 트럭과 차고를 확장해 보세요.', screenshots: ["https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/227300/e040f74641ac21f15e3ec7c2415fc8b4de0b6bf9/ss_e040f74641ac21f15e3ec7c2415fc8b4de0b6bf9.1920x1080.jpg?t=1793285269", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/227300/edbff61a062a49d1d97269e53b8afbffde05bb24/ss_edbff61a062a49d1d97269e53b8afbffde05bb24.1920x1080.jpg?t=1793285269", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/227300/c610d985eb21cc22c26507b53cd843cfa0b3a00d/ss_c610d985eb21cc22c26507b53cd843cfa0b3a00d.1920x1080.jpg?t=1793285269"] },
      { id: 'the-sims-4', title: '심즈 4', english: 'THE SIMS 4', genre: '시뮬레이션', source: 'steam', tag: '생활', reviewScore: 83, steamRank: 80, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '💚', cover: 'sims-4', url: 'https://store.steampowered.com/app/1222670/The_Sims_4/', image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1222670/header.jpg?t=1793293287", description: '심들의 삶과 집을 만들고 나만의 이야기를 꾸미는 생활 시뮬레이션입니다. 캐릭터의 외모와 성격을 설정하고 관계와 일상을 자유롭게 만들어 보세요.', screenshots: ["https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1222670/ss_537683e5e29c2d6d02c64aa7321dcb26166f7d82.1920x1080.jpg?t=1793293287", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1222670/ss_2fc938d99a1e87893852cb2d2113478190607941.1920x1080.jpg?t=1793293287", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1222670/ss_b447d6436d2d00cd5e7c170e509b2246dfc879e8.1920x1080.jpg?t=1793293287"] },
      { id: 'ea-sports-fc-26', title: 'EA SPORTS FC 26', english: 'EA SPORTS FC 26', genre: '스포츠', source: 'steam', tag: '축구', reviewScore: 66, steamRank: 73, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '⚽', cover: 'fc-26', url: 'https://store.steampowered.com/app/3405690/EA_SPORTS_FC_26/', image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3405690/2d96aa1b06e453cd62dae9029d412f19e61932c3/header.jpg?t=1789751159', description: '클럽과 국가대표 팀을 선택해 축구 경기를 즐기는 EA SPORTS FC 시리즈입니다. 커리어와 온라인 모드에서 팀을 꾸리고 경쟁해 보세요.', screenshots: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3405690/1d3064a6f7b0f8e1c00fa8a70307a67e95c090ea/ss_1d3064a6f7b0f8e1c00fa8a70307a67e95c090ea.1920x1080.jpg?t=1789751159', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3405690/b61caa1b54537a4e5ba6ca186ed661a0d03debee/ss_b61caa1b54537a4e5ba6ca186ed661a0d03debee.1920x1080.jpg?t=1789751159'] },
      { id: 'efootball', title: 'eFootball', english: 'eFOOTBALL', genre: '스포츠', source: 'steam', tag: '축구', reviewScore: 64, steamRank: null, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '⚽', cover: 'efootball', url: 'https://store.steampowered.com/app/1665460/eFootball/', image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1665460/86619d0fb7126b3d5276004175f9a62181223c0f/header.jpg?t=1792635226', description: '전 세계 이용자와 겨루는 무료 축구 게임입니다. 팀과 선수를 구성하고 온라인 경기에서 패스와 전술을 활용해 승리를 노려보세요.', screenshots: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1665460/3b0db0c05317dec6063cfcdbc1ed7d079a33c87d/ss_3b0db0c05317dec6063cfcdbc1ed7d079a33c87d.1920x1080.jpg?t=1792635226', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1665460/6c864a19497fbad11d70fd3078819e341b53e710/ss_6c864a19497fbad11d70fd3078819e341b53e710.1920x1080.jpg?t=1792635226'] },
      { id: 'farming-simulator-25', title: '파밍 시뮬레이터 25', english: 'FARMING SIMULATOR 25', genre: '시뮬레이션', source: 'steam', tag: '농업', reviewScore: 91, steamRank: 87, ratingSource: 'Steam 최근 30일 긍정 리뷰 · 2026-11-01 확인', emoji: '🚜', cover: 'farming-simulator-25', url: 'https://store.steampowered.com/app/2300320/Farming_Simulator_25/', image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2300320/c2a205133d23cd24faf3c152d972a1d0177661b8/header.jpg?t=1793106374', description: '농장을 운영하며 작물을 재배하고 수확하는 농업 시뮬레이션입니다. 다양한 농기계를 운전하고 혼자 또는 멀티플레이로 농장을 키워보세요.', screenshots: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2300320/0bd36a1bd96d3c4a428bfd56f8697d045011e23c/ss_0bd36a1bd96d3c4a428bfd56f8697d045011e23c.1920x1080.jpg?t=1793106374', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2300320/4fa589ab4b102a4b346d03295b5d26c6a14726be/ss_4fa589ab4b102a4b346d03295b5d26c6a14726be.1920x1080.jpg?t=1793106374'] }
    ];
    const extraScreenshots = {
      valorant: ['https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/7a9fef9c2e67d0dc32e555a6bf3f75a6879bad5d-1920x1080.jpg?accountingTag=VAL'],
      'hades-2': ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145350/ss_ef0f63061d0a0a9a7e46f3b84f125d25330e8f19.1920x1080.jpg?t=1779901265', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145350/ss_f28befd916e59b8bf0a8a801b8a498b8adaa01eb.1920x1080.jpg?t=1779901265', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145350/ss_b88cb7b48a86f07a7288bf37141f6558279f9bfc.1920x1080.jpg?t=1779901265'],
      'stardew-valley': ['https://www.stardewvalley.net/wp-content/uploads/2018/12/NightMarket-1-1.png', 'https://www.stardewvalley.net/wp-content/uploads/2018/12/Multiplayer_Screenshot2-1.png', 'https://www.stardewvalley.net/wp-content/uploads/2018/12/StardewValley_12-1.png'],
      'elden-ring': ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/ss_943bf6fe62352757d9070c1d33e50b92fe8539f1.1920x1080.jpg?t=1790290043', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/ss_dcdac9e4b26ac0ee5248bfd2967d764fd00cdb42.1920x1080.jpg?t=1790290043', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/ss_3c41384a24d86dddd58a8f61db77f9dc0bfda8b5.1920x1080.jpg?t=1790290043'],
      'cyberpunk-2077': ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/ss_2f649b68d579bf87011487d29bc4ccbfdd97d34f.1920x1080.jpg?t=1792682505', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/900f9bda156599fcd235f08ffb64667f9baa1afe/ss_900f9bda156599fcd235f08ffb64667f9baa1afe.1920x1080.jpg?t=1792682505', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/f678ed77c2fe7060ac9c64e32e1472e3ec3ab7dc/ss_f678ed77c2fe7060ac9c64e32e1472e3ec3ab7dc.1920x1080.jpg?t=1792682505'],
      'persona-5-royal': ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1687950/ss_0d70c3b765f8b769153ac69541753745ec023a6f.1920x1080.jpg', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1687950/ss_7b253f91a62895af594c84370194f4a3f9b6166d.1920x1080.jpg', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1687950/ss_b65a28e459b886feef348c8e16f8b9ca721a56e9.1920x1080.jpg'],
      'ori-will-of-wisps': ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1057090/ss_8f7f5c0d10fb9bca99a8a449c9a22c941e978fe6.1920x1080.jpg', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1057090/ss_4dd5c9a4e8bc4033ad4f1f72d86e9500b60c2dcf.1920x1080.jpg', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1057090/ss_f65eae01a42a09776e237dd7797f2aa0b5a69b53.1920x1080.jpg'],
      'team-fortress-2': ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/440/ss_ea21f7bbf4f79bada4554df5108d04b6889d3453.1920x1080.jpg?t=1757348372', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/440/ss_e3aedb2ab36bba8cfe611b1e0eaa807e4bb2d742.1920x1080.jpg?t=1757348372', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/440/ss_ee24a769dc1d81dcbd7b250d16530394adee4264.1920x1080.jpg?t=1757348372'],
      'apex-legends': ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/61bab081f3fdc1373da42fa962497ed2ea760890/ss_61bab081f3fdc1373da42fa962497ed2ea760890.1920x1080.jpg?t=1793909605'],
      overwatch: ['https://cdn.cloudflare.steamstatic.com/steam/apps/2357570/ss_1f4a12d12a4bc9b476a507ca4e22d9adf2938112.1920x1080.jpg'],
      'rainbow-six-siege': ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/359550/ss_21b13eef2a6e8e8b8b4025a477b8f8c1c0ee2f74.1920x1080.jpg'],
      valheim: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/892970/ss_9b2c14db463ed85a174c3468b8f9bf9bf6d5f37c.1920x1080.jpg'],
      warframe: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/230410/ss_2e4077f215eccde84171a4b8e0f2bc8a3264c776.1920x1080.jpg?t=1792613117', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/230410/ss_0a541a8bf59e212870ea8d82260ac1b3ae2d0354.1920x1080.jpg?t=1792613117', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/230410/ss_ce00a212a29e9a6c1fc37b16dbd802b2844a901d.1920x1080.jpg?t=1793987416'],
      'rocket-league': ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252950/4fa01c320d22f31d78fd9fcb27dbd3bd8871b903/ss_4fa01c320d22f31d78fd9fcb27dbd3bd8871b903.1920x1080.jpg?t=1791210513', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252950/23e7d4fcf10475923be9078e55b449b7fc9792d9/ss_23e7d4fcf10475923be9078e55b449b7fc9792d9.1920x1080.jpg?t=1791210513', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252950/41bd974bde088dc623fae68db333f5b8bb42700e/ss_41bd974bde088dc623fae68db333f5b8bb42700e.1920x1080.jpg?t=1791210513'],
      'project-zomboid': ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/108600/e0dd37d69051f7da85896d11027ab018d23893fa/ss_e0dd37d69051f7da85896d11027ab018d23893fa.1920x1080.jpg?t=1793224893', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/108600/d9df2102dd12526700b15660bc5ec8f039dc8742/ss_d9df2102dd12526700b15660bc5ec8f039dc8742.1920x1080.jpg?t=1793224893', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/108600/4c8860818ac52c685bbe0988aa137d52bad4aac5/ss_4c8860818ac52c685bbe0988aa137d52bad4aac5.1920x1080.jpg?t=1793224893'],
      'no-mans-sky': ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/275850/7d45478fbac8b1a41172adf8e598784a7d04b41d/ss_7d45478fbac8b1a41172adf8e598784a7d04b41d.1920x1080.jpg?t=1793196605', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/275850/53afb343452e839000d5eab38d0656fcdad9547b/ss_53afb343452e839000d5eab38d0656fcdad9547b.1920x1080.jpg?t=1793196605', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/275850/1c56a91d19399fc1fac11b9d1d5437d143ae707d/ss_1c56a91d19399fc1fac11b9d1d5437d143ae707d.1920x1080.jpg?t=1793196605'],
      'lethal-company': ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1966720/ss_78075e9a94675823024f12fce9d69b243cca94f8.1920x1080.jpg?t=1775380053', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1966720/ss_51860be59845771c01a3a4d9ab1ebf773f16fef5.1920x1080.jpg?t=1775380053', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1966720/ss_0efb5b9a0fa14cc4c3e69eaa.1920x1080.jpg?t=1775380053'],
      'cities-skylines': ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/255710/ss_8efc29a6fcecd2ea5d0740e99bc8135d6f0671c6.1920x1080.jpg'],
      'euro-truck-simulator-2': ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/227300/ss_178725de0a79ccce8be5f9c1d6fa7f059b05d4d2.1920x1080.jpg'],
      'the-sims-4': ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1222670/ss_537683e5e29c2d6d02c64aa7321dcb26166f7d82.1920x1080.jpg?t=1793293287', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1222670/ss_2fc938d99a1e87893852cb2d2113478190607941.1920x1080.jpg?t=1793293287', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1222670/ss_9b3d2c580798512963fa64801b42820f168eab09.1920x1080.jpg?t=1793293287'],
      'ea-sports-fc-26': ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3405690/1d3064a6f7b0f8e1c00fa8a70307a67e95c090ea/ss_1d3064a6f7b0f8e1c00fa8a70307a67e95c090ea.1920x1080.jpg?t=1789751159', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3405690/b61caa1b54537a4e5ba6ca186ed661a0d03debee/ss_b61caa1b54537a4e5ba6ca186ed661a0d03debee.1920x1080.jpg?t=1789751159', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3405690/725a1067d83dba8514b5ecae4f39d59b4bd73bb2/ss_725a1067d83dba8514b5ecae4f39d59b4bd73bb2.1920x1080.jpg?t=1789751159'],
      efootball: ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1665460/3b0db0c05317dec6063cfcdbc1ed7d079a33c87d/ss_3b0db0c05317dec6063cfcdbc1ed7d079a33c87d.1920x1080.jpg?t=1792635226', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1665460/6c864a19497fbad11d70fd3078819e341b53e710/ss_6c864a19497fbad11d70fd3078819e341b53e710.1920x1080.jpg?t=1792635226', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1665460/19198cc1acc851a60c4f29f5b906b1e1890eaa8a/ss_19198cc1acc851a60c4f29f5b906b1e1890eaa8a.1920x1080.jpg?t=1792635226'],
      'farming-simulator-25': ['https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2300320/0bd36a1bd96d3c4a428bfd56f8697d045011e23c/ss_0bd36a1bd96d3c4a428bfd56f8697d045011e23c.1920x1080.jpg?t=1793106374', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2300320/4fa589ab4b102a4b346d03295b5d26c6a14726be/ss_4fa589ab4b102a4b346d03295b5d26c6a14726be.1920x1080.jpg?t=1793106374', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2300320/a91040d614c5f319b0fa5d02dde31e9835d0cc4e/ss_a91040d614c5f319b0fa5d02dde31e9835d0cc4e.1920x1080.jpg?t=1793106374']
    };
    const latestUpdates = {
      'team-fortress-2': { title: 'Team Fortress 2 Update Released', date: '2026-10-30', summary: '호박으로 변장한 스파이의 모델 누락을 수정하고 토너먼트 메달을 업데이트했습니다.', url: 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1847920302240743' },
      'apex-legends': { title: 'Apex Legends: Latest Update - 11/6/2026', date: '2026-11-06', summary: '야간 E-District를 맵 로테이션에서 제외하고 주간 버전으로 교체했습니다. 야간 맵은 시야 개선 후 다시 추가할 예정입니다.', url: 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1848664643347036' },
      'rainbow-six-siege': { title: 'COMMUNITY CHECKPOINT #6: Y11S3.3 UPDATES', date: '2026-11-02', summary: 'Y11 시즌 중간 업데이트의 밸런스 조정과 테스트 그라운드, 인질 모드 변경 사항 및 향후 계획을 정리했습니다.', url: 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1847920302249111' },
      valheim: { title: 'Patch 1.0.21', date: '2026-10-28', summary: '적 위로 점프할 때 비정상적으로 튀어 오르는 현상과 집 안으로 폭풍이 들어오는 문제 등 여러 버그를 수정했습니다.', url: 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1847920302230913' },
      'rocket-league': { title: 'Rocket League S24 Patch Notes v2.76', date: '2026-09-22', summary: '시즌 24에 1대1 명예 결투와 중복 블랙마켓 아이템 교환 기능을 추가하고 MVP 골 폭발 표시를 개선했습니다.', url: 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1844751498216898' },
      'project-zomboid': { title: '42.22.2 Pre-Release Hotfix Released', date: '2026-11-06', summary: 'Windows에서 무결성 검사 상태가 잘못 표시되던 기술·디버그 문제를 수정했습니다.', url: 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1848664643345808' },
      'lethal-company': { title: 'Version 80 - The Blooming Update', date: '2026-04-05', summary: '숲 달 신규 생물 3종, 도구 전용 슬롯, 시설 방과 지형 개선을 추가하고 그래픽·접근성 설정과 성능을 보완했습니다.', url: 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1828894815563326' },
      'cities-skylines': { title: 'Patch Notes for 1.21.1-f9', date: '2026-04-15', summary: '도로 위에 배치한 나무가 불러오기 후 기본 나무로 바뀌는 문제와 트롤리버스가 보이지 않는 문제를 수정했습니다.', url: 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1830163047254137' },
      'euro-truck-simulator-2': { title: 'Euro Truck Simulator 2: 1.62 Update Release', date: '2026-11-05', summary: '1.62 업데이트를 배포했습니다. 변경 내역과 적용 범위는 공식 공지에서 확인할 수 있습니다.', url: 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1848664643340236' },
      'the-sims-4': { title: 'Order Up! The Next Quality of Life Update is here!', date: '2026-10-27', summary: '새로운 노년 심 의상·헤어와 체형 변화 설정을 추가하고 요리 메뉴·레시피, TV 설정 및 저장 백업 기능을 개선했습니다.', url: 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1847286114049797' },
      'farming-simulator-25': { title: 'Patch 1.25 for Farming Simulator 25 now available!', date: '2026-10-20', summary: '일출·일몰 조명, 울타리 배치, 장비와 입력 설정 등 여러 문제를 수정하고 HUD 건설 진행 표시를 개선했습니다.', url: 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1846651706695207' },
      'elden-ring': { title: 'Patch Notes Version 1.17', date: '2026-08-27', summary: 'Tarnished Pack DLC 지원과 새 시작 직업·장비를 추가하고 게임 밸런스를 조정했습니다.', url: 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1842212951300120' },
      'hades-2': { title: 'Post-Launch Patch 2 - Hotfix 5', date: '2026-07-28', summary: 'Dream Dive 보상과 무기·신의 은혜 조합, 보스전 발사체 등 여러 전투 및 진행 오류를 수정했습니다.', url: 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1839041357038855' },
      'stardew-valley': { title: 'Stardew Valley 1.6.15 Patch now available', date: '2024-12-20', summary: '잔여 오류를 수정하고 일부 밸런스와 편의성을 개선했습니다. 전설 물고기 연못의 생산량도 조정했습니다.', url: 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1786573930663336' },
      'cyberpunk-2077': { title: 'Cyberpunk 2077: Edgerunners 2 Update (2.5)', date: '2026-10-22', summary: 'Edgerunners 2에서 영감을 받은 신규 콘텐츠와 기능을 추가했습니다. 세부 항목은 공식 패치 노트에서 확인할 수 있습니다.', url: 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1847286114032016' },
      'ori-will-of-wisps': { title: 'Ori and the Will of the Wisps Patch 3.1', date: '2020-11-19', summary: '게임 내 여러 문제를 수정하고 플레이 안정성을 개선한 패치입니다.', url: 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/3856732771954959202' }
    };
    const recommendedOrder = ['hades-2', 'valorant', 'stardew-valley', 'elden-ring', 'zelda-totk', 'cyberpunk-2077', 'persona-5-royal', 'ori-will-of-wisps', 'team-fortress-2', 'apex-legends', 'overwatch', 'rainbow-six-siege', 'valheim', 'warframe', 'rocket-league', 'project-zomboid', 'no-mans-sky', 'lethal-company', 'cities-skylines', 'euro-truck-simulator-2', 'the-sims-4', 'ea-sports-fc-26', 'efootball', 'farming-simulator-25'];

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
        const steamAppId = game.url.match(/store\.steampowered\.com\/app\/(\d+)/)?.[1];
        const newsHubUrl = steamAppId ? `https://store.steampowered.com/news/app/${steamAppId}` : game.url;
        const update = latestUpdates[game.id];
        const screenshots = [...new Set([game.image, ...(game.screenshots || []), ...(extraScreenshots[game.id] || [])].filter(Boolean))].slice(0, 4);
        detailPage.innerHTML = `
          <p class="detail-breadcrumb"><a href="index.html">홈</a>　/　<a href="index.html#games">게임 둘러보기</a>　/　${game.title}</p>
          <article class="detail-hero">
            <div class="detail-art" role="img" aria-label="${game.title} 대표 이미지" style="--detail-image: url('${game.image || ''}'); --detail-fit: ${game.imageFit || 'cover'}; --detail-position: ${game.imagePosition || 'center'}"><span class="detail-art-label">${game.english}</span></div>
            <div class="detail-copy">
              <p class="detail-kicker">${game.genre} · ${game.tag}${game.source === 'steam' ? ' · Steam 인기 게임' : ''}</p>
              <h1 class="detail-title">${game.title}</h1>
              <p class="detail-english">${game.english}</p>
              <div class="detail-badges"><span class="detail-badge">${game.genre}</span><span class="detail-badge">${game.tag}</span>${game.source === 'steam' ? '<span class="detail-badge">Steam 인기 게임</span>' : ''}<span class="detail-badge review-score" title="${game.ratingSource || 'Steam 최근 30일 긍정 리뷰 자료 없음'}">${game.reviewScore === null ? 'Steam 평가 정보 없음' : `최근 30일 긍정 ${game.reviewScore}%`}</span>${game.steamRank === null ? '' : `<span class="detail-badge">Steam 인기 순위 ${game.steamRank}위</span>`}</div>
              ${game.ratingSource ? `<p class="detail-rating-source">${game.ratingSource} 기준 · 2026-11-01 확인</p>` : ''}
              <p class="detail-description">${game.description}</p>
              <a class="button official-site-button" href="${game.url}" target="_blank" rel="noopener noreferrer">공식 사이트 방문 <span aria-hidden="true">↗</span></a>
            </div>
          </article>
          <section class="detail-section" aria-labelledby="screenshotsTitle">
            <div class="detail-section-heading"><p class="section-kicker">SCREENSHOTS & ARTWORK</p><h2 id="screenshotsTitle">스크린샷 및 이미지</h2></div>
            <div class="screenshot-grid">${screenshots.map((image, index) => `<figure class="screenshot-card"><img src="${image}" alt="${game.title} 게임 이미지 ${index + 1}" loading="lazy" /><figcaption class="screenshot-caption">${game.title} · ${index === 0 ? '대표 이미지' : '게임 이미지'}</figcaption></figure>`).join('')}</div>
          </section>
          <section class="detail-section latest-news" aria-labelledby="latestNewsTitle">
            <div class="detail-section-heading"><p class="section-kicker">LATEST UPDATES</p><h2 id="latestNewsTitle">최신 변경 및 업데이트</h2></div>
            ${update ? `<article class="latest-news-item"><p class="latest-news-summary">${update.summary}</p><div class="latest-news-meta"><time datetime="${update.date}">${update.date}</time><span>Steam 공식 공지 · 2026-11-08 확인</span></div><a href="${update.url}" target="_blank" rel="noopener noreferrer">원문 보기 <span aria-hidden="true">↗</span></a></article>` : `<p class="latest-news-empty">2026-11-08 확인 기준으로 표시할 공식 업데이트 공지가 없습니다. 아래 공식 채널에서 최신 소식을 확인해 주세요.</p>`}
            <a class="latest-news-hub" href="${newsHubUrl}" target="_blank" rel="noopener noreferrer">${steamAppId ? 'Steam 최신 소식 모두 보기' : '게임 공식 홈페이지에서 소식 확인'} <span aria-hidden="true">↗</span></a>
          </section>`;
      }
    }

    const grid = document.getElementById('gameGrid');
    if (grid) {

    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('gameSort');
    const filters = [...document.querySelectorAll('.filter')];
    let activeFilter = '전체';
    let activeSort = 'recommended';
    let sortDirection = 'asc';
    let favorites = new Set();
    try {
      const stored = JSON.parse(localStorage.getItem('arcade-favorites') || '[]');
      if (Array.isArray(stored)) favorites = new Set(stored.filter(title => games.some(game => game.title === title)));
    } catch { favorites = new Set(); }

    function renderGames() {
      const query = searchInput.value.trim().toLocaleLowerCase('ko');
      const visibleGames = games.filter(game => {
        const matchesFilter = activeFilter === '전체'
          || (activeFilter === '즐겨찾기' ? favorites.has(game.title)
            : activeFilter === 'Steam' ? game.source === 'steam'
              : game.genre === activeFilter);
        const matchesSearch = `${game.title} ${game.english} ${game.genre} ${game.tag}`.toLocaleLowerCase('ko').includes(query);
        return matchesFilter && matchesSearch;
      }).sort((left, right) => {
        if (activeSort === 'rating-desc') {
          if (left.reviewScore === null) return right.reviewScore === null ? 0 : 1;
          if (right.reviewScore === null) return -1;
          const difference = right.reviewScore - left.reviewScore;
          return sortDirection === 'asc' ? difference : -difference;
        }
        if (activeSort === 'steam-rank') {
          if (left.steamRank === null) return right.steamRank === null ? 0 : 1;
          if (right.steamRank === null) return -1;
          const difference = left.steamRank - right.steamRank;
          return sortDirection === 'asc' ? difference : -difference;
        }
        if (activeSort === 'name') {
          const difference = left.title.localeCompare(right.title, 'ko');
          return sortDirection === 'asc' ? difference : -difference;
        }
        const difference = recommendedOrder.indexOf(left.id) - recommendedOrder.indexOf(right.id);
        return sortDirection === 'asc' ? difference : -difference;
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
            <div class="game-info"><div class="game-title-row"><h3 class="game-title">${game.title}<span class="official-link-icon" aria-hidden="true">↗</span></h3><span class="review-score" title="${game.ratingSource || 'Steam 최근 30일 긍정 리뷰 자료 없음'}">${game.reviewScore === null ? '평가 정보 없음' : `Steam ${game.reviewScore}%`}</span></div><div class="game-meta"><span>${game.genre} · ${game.tag}</span><span>상세 정보 보기</span></div></div>
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
    sortSelect.addEventListener('change', () => {
      activeSort = sortSelect.value;
      const sortButton = document.getElementById('sortDirection');
      sortButton.disabled = false;
      sortButton.textContent = sortDirection === 'asc' ? '↑' : '↓';
      sortButton.setAttribute('aria-label', sortDirection === 'asc' ? '오름차순으로 정렬' : '내림차순으로 정렬');
      renderGames();
    });
    document.getElementById('sortDirection').addEventListener('click', event => {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      event.currentTarget.textContent = sortDirection === 'asc' ? '↑' : '↓';
      event.currentTarget.setAttribute('aria-label', sortDirection === 'asc' ? '오름차순으로 정렬' : '내림차순으로 정렬');
      event.currentTarget.setAttribute('aria-pressed', String(sortDirection === 'desc'));
      renderGames();
    });
    filters.forEach(button => button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      filters.forEach(filter => {
        const selected = filter === button;
        filter.classList.toggle('active', selected);
        filter.setAttribute('aria-pressed', String(selected));
      });
      renderGames();
    }));

    let rouletteReturnScrollY = 0;
    document.getElementById('randomButton').addEventListener('click', () => {
      rouletteReturnScrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${rouletteReturnScrollY}px`;
      document.body.style.width = '100%';
      const rouletteDialog = document.getElementById('rouletteDialog');
      const result = document.getElementById('rouletteResult');
      const gameLink = document.getElementById('rouletteGameLink');
      result.classList.remove('winner');
      result.textContent = '버튼을 눌러 룰렛을 시작하세요.';
      gameLink.hidden = true;
      rouletteDialog.showModal();
      window.scrollTo(0, rouletteReturnScrollY);
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
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, rouletteReturnScrollY);
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
    }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeArcade, { once: true });
} else {
  initializeArcade();
}
