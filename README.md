# ARCADE — 게임 라운지

인기 게임을 둘러보고, 취향에 맞는 다음 플레이를 발견할 수 있는 한국어 게임 큐레이션 홈페이지입니다.

**라이브 홈페이지:** https://arcade.nextarcade.workers.dev/
**현재 GitHub Pages 배포:** https://julie9578.github.io/VisionAI/

## 주요 기능

- 게임 제목, 영문명, 장르와 태그를 기준으로 게임 검색
- 액션, RPG, 인디, 어드벤처 장르별 필터 및 즐겨찾기 필터
- 게임 카드에서 즐겨찾기 추가·해제 및 브라우저에 저장
- 게임 공식 홈페이지로 이동하는 링크
- 오늘의 랜덤 게임 추천
- 프로필 카드에서 게이머 이름과 즐겨찾기 수 확인
- 게시판 게시글을 Cloudflare D1에 저장하는 API
- 회원가입·로그인 및 Worker/D1 인증 API
- 데스크톱과 모바일 화면을 지원하는 반응형 레이아웃

## 로컬에서 실행하기

별도의 빌드 도구나 패키지 설치가 필요하지 않습니다.

1. 저장소를 복제합니다.

   ```bash
   git clone https://github.com/julie9578/VisionAI.git
   cd VisionAI
   ```

2. `index.html`을 브라우저에서 엽니다.

   또는 저장소 루트에서 간단한 정적 서버를 실행할 수 있습니다.

   ```bash
   python -m http.server 8000
   ```

   브라우저에서 <http://localhost:8000>으로 접속합니다.

## 프로젝트 파일

```text
index.html   홈페이지 구조와 SEO 메타데이터
styles.css   반응형 레이아웃과 시각 스타일
script.js    게임 목록, 검색, 필터, 즐겨찾기와 추천 기능
robots.txt   검색 엔진 크롤러 안내
sitemap.xml  공개 페이지 사이트맵
board.html   커뮤니티 게시판
board.js     게시글 목록 조회와 작성 API 클라이언트
signup.html  회원가입 페이지
login.html   로그인 페이지
auth.css     회원 페이지 스타일
auth.js      회원가입·로그인 API 클라이언트
profile.html 로그인한 사용자의 프로필 편집 페이지
profile.css  프로필 편집 페이지 스타일
post.html    게시글 상세 및 댓글 페이지
post-write.html 새 게시글 작성 페이지
user.html    공개 사용자 프로필 페이지
community.js 게시판 상세·작성·프로필 상호작용
wrangler.jsonc Cloudflare Worker와 D1 설정
| `migrations/`  | D1 게시글·사용자 테이블 스키마 변경 |
src/worker.js 게시판·회원 REST API
```

## 게시판 데이터베이스 (SQLite / Cloudflare D1)

Cloudflare D1에는 `posts`와 `users` 테이블을 사용합니다. `posts.deleted_at`은 soft-delete 시각입니다. 회원 정보에는 닉네임, 이메일, 성별, 암호화된 주소, 비밀번호 해시와 시간 정보가 저장됩니다.

GitHub Pages는 정적 호스팅이며 Cloudflare D1은 별도 Worker API를 통해 접근합니다. 게시판 API Worker `https://arcade-board-api.nextarcade.workers.dev`와 D1 데이터베이스 `arcade-board`가 배포되어 있습니다. 회원 API는 같은 Worker에서 `/api/auth/signup`, `/api/auth/login`, `/api/auth/me` 경로로 제공됩니다. 회원가입·로그인 페이지는 `/signup.html`, `/login.html`입니다.

필요 조건: Node.js, Cloudflare 계정, Wrangler 인증. 실제 secret 값은 저장소에 커밋하지 말고 Wrangler secret으로 관리합니다.

1. Wrangler를 설치하고 Cloudflare에 로그인합니다.

   ```bash
   npm install --save-dev wrangler
   npx wrangler login
   ```

2. D1 데이터베이스가 없다면 만들고 Wrangler가 설정을 갱신하게 합니다.

   ```bash
   npx wrangler d1 create arcade-board --update-config
   ```

   또는 명령이 설정을 자동으로 수정하지 않으면 출력된 `database_id`를 `wrangler.jsonc`의 `d1_databases[0].database_id`에 입력합니다.

3. 신규 테이블 마이그레이션을 원격 DB에 적용합니다.

   ```bash
   npx wrangler d1 migrations apply arcade-board --remote
   ```

4. 회원가입/로그인을 다시 배포할 때 보안 키가 아직 설정되지 않은 경우 Wrangler secrets로 등록합니다. 값은 저장소에 추가하지 않습니다. 현재 운영 Worker에는 두 키가 등록되어 있습니다.

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   npx wrangler secret put SESSION_SECRET
   npx wrangler secret put ADDRESS_ENCRYPTION_KEY
   ```

   각 secret에는 서로 다른 랜덤 키를 입력합니다. secret 값을 변경하면 기존 세션 토큰이 무효화되고 주소 복호화 키를 바꾸면 기존 주소를 복호화할 수 없으니 기존 키를 보존하세요.

5. `ALLOWED_ORIGINS`에 프런트엔드 origin을 포함하고 API Worker를 배포합니다.

   ```bash
   npx wrangler deploy
   ```

6. 배포를 확인합니다.

   ```bash
   curl https://arcade-board-api.nextarcade.workers.dev/api/posts
   ```

회원 정보는 이메일 중복을 방지하고 비밀번호를 PBKDF2 해시로 저장합니다. 집 주소는 AES-GCM 암호문과 IV로만 저장하며 API는 원문 주소를 반환하지 않습니다. 로그인 토큰은 브라우저 탭 세션(`sessionStorage`)에 저장됩니다. 집 주소와 성별은 민감한 개인정보이므로 실제 서비스 운영 전에 수집 필요성·보유기간·동의 및 개인정보 처리방침을 검토하고, 필요하지 않다면 수집 항목을 줄이세요.

## 배포

- 라이브 홈페이지: <https://arcade.nextarcade.workers.dev/>

## 기술

- HTML
- CSS
- JavaScript (브라우저 기본 API)