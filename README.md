# ARCADE — 게임 라운지

인기 게임을 둘러보고, 취향에 맞는 다음 플레이를 발견할 수 있는 한국어 게임 큐레이션 홈페이지입니다.

## 공식 사이트와 배포

**공식 홈페이지는 Cloudflare Pages에서 제공하며 보안 헤더가 적용됩니다.** 방문 주소는 <https://visionai-arcade.pages.dev/>입니다. 게시판 페이지도 같은 도메인에서 이용할 수 있습니다.

**GitHub Pages 주소는 레거시 미러입니다.** <https://julie9578.github.io/VisionAI/>는 GitHub Pages의 호환성 때문에 사용자 지정 HTTP 보안 헤더를 설정할 수 없습니다. 따라서 보안 헤더가 적용된 공식 사이트로 Cloudflare Pages 링크를 사용합니다.

**게시판·회원 API는 Cloudflare Worker에서 별도로 운영됩니다.** API 주소는 <https://arcade-board-api.nextarcade.workers.dev/>이며, 정적 사이트 배포와 Worker 배포는 서로 별도 작업입니다.

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

Cloudflare Pages에서 정적 사이트를 제공하며 Cloudflare D1은 별도 Worker API를 통해 접근합니다. 게시판 API Worker `https://arcade-board-api.nextarcade.workers.dev`와 D1 데이터베이스 `arcade-board`가 배포되어 있습니다. 회원 API는 같은 Worker에서 `/api/auth/signup`, `/api/auth/login`, `/api/auth/me` 경로로 제공됩니다. 회원가입·로그인 페이지는 `/signup`, `/login`입니다.

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

## 배포 방법

**Cloudflare Pages 배포는 저장소의 전용 스크립트로 수행합니다.** `cloudflare-pages/_headers`가 HTML과 정적 자산에 보안 응답 헤더를 적용합니다. 배포 전에는 `main` 브랜치를 최신 상태로 맞추고 모든 변경을 커밋해 작업 트리를 깨끗하게 합니다.

```powershell
.\scripts\deploy-cloudflare-pages.ps1
```

**이 스크립트는 공개 웹 파일만 업로드합니다.** HTML, CSS, 브라우저 JavaScript, 이미지, `robots.txt`, `sitemap.xml`과 보안 헤더 설정만 staging 디렉터리에 복사합니다. Worker 소스, D1 마이그레이션, 로컬 SQLite, `.env`와 Wrangler 설정은 정적 배포물에 포함하지 않습니다.

**게시판 API는 별도로 배포합니다.** `wrangler.jsonc`의 `ALLOWED_ORIGINS`에는 공식 Cloudflare Pages origin이 포함되어야 하며, API 코드를 변경한 경우에만 별도의 Wrangler Worker 배포가 필요합니다.

## 관리자 페이지 계획 및 권한 범위

`admin.html`은 `noindex,nofollow` 설정을 사용하는 관리자 전용 게시판 도구입니다. 관리자 판정은 화면의 버튼 노출에 의존하지 않고, 모든 `/api/admin/*` 요청에서 Worker가 로그인 세션과 DB의 `users.role='admin'`, `ADMIN_EMAILS` secret 목록 일치를 각각 확인합니다. 따라서 일반 회원이 관리자 URL을 직접 열거나 API를 직접 호출해도 403으로 차단됩니다.

### 운영자가 관리 페이지에서 할 수 있는 일

1. 페이지 진입 시 관리자 권한을 확인하고 관리 글 목록을 불러옵니다.
2. 전체 글을 제목·본문·작성자 검색 및 카테고리별로 필터링할 수 있습니다.
3. 다른 회원 글을 자유·게임 추천·공략·팁·모집·공지 카테고리로 변경할 수 있습니다. 공지로 변경하는 동작도 `ADMIN_EMAILS`에 등록된 실제 관리자인지 다시 확인합니다.
4. 글을 삭제하면 행을 물리적으로 지우지 않고 `deleted_at`을 기록해 일반 목록에서 숨깁니다.
5. 글별 댓글을 확인하고 특정 댓글을 삭제할 수 있습니다. 일반 작성자의 댓글 삭제 요청과 달리 관리 API에서 관리자 권한을 재검증하며, 삭제는 댓글 행만 제거합니다.

### 현재 UI 구성

- 관리자 로그인 계정의 기존 프로필 팝오버에만 “게시판 관리자” 이동 링크를 표시합니다. 이 링크 표시는 편의를 위한 것으로, 권한 보안은 전적으로 서버 API가 담당합니다.
- `admin.html`은 검색/분류 필터, 게시글 목록, 카테고리 변경, 게시글 삭제, 게시글별 댓글 관리 패널을 포함합니다.
- 모든 삭제 작업은 확인 대화상자를 보여주며, 오류·성공은 접근 가능한 status 메시지로 알립니다.

### 의도적으로 제공하지 않는 기능

- 이 계획은 게시판 콘텐츠 관리에만 한정합니다. 계정·비밀번호·이메일·관리자 권한 목록을 브라우저 관리자 페이지에서 편집하지 않습니다.
- 관리자 추가는 Cloudflare의 `ADMIN_EMAILS` secret과 명시적 `users.role='admin'` 운영 절차로 처리합니다.
- 게시글 댓글·카테고리 조작에만 적용되며, 게임 카탈로그·사용자 계정·가입 인증 정책을 바꾸지 않습니다.

### 운영 공지 관리자 설정 후속 작업 (미완료)

- 2026-11-14 보안 조치로 D1의 `users.role` 컬럼과 Worker 공지 권한 검사가 적용됐습니다. 공개 가입은 항상 `user` 역할만 받으며, 기존 계정도 기본 `user`로 유지됩니다.
- Cloudflare Worker secret `ADMIN_EMAILS`에 쉼표, 세미콜론 또는 줄바꿈으로 관리자 이메일을 여러 개 넣을 수 있습니다. 기존의 단일 `ADMIN_EMAIL` secret도 호환됩니다. 둘 다 설정된 경우 두 목록을 합쳐 사용합니다. **이메일 목록만으로 관리자 권한이 생기지는 않습니다.**
- 새 관리자를 추가할 때는 승인한 이메일을 secret 전체 목록에 넣고, 해당 기존 계정을 별도로 `users.role='admin'`으로 승격한 뒤 Worker를 재배포합니다. 목록 또는 역할 중 하나라도 제거되면 공지 쓰기 권한이 거부됩니다. 공개 회원가입은 언제나 `user` 역할만 부여합니다. 이메일 주소와 secret 값은 문서/Git/공개 이슈에 기록하지 마세요.
- `ADMIN_EMAILS` 목록이 비어 있거나 사용자 역할이 `admin`이 아닌 경우 공지 작성은 거부됩니다( fail-closed ).
- 완료 확인: `GET /api/posts`를 정상 조회하고, 일반 사용자 공지 등록은 403, 지정된 관리자 공지 등록은 성공함을 승인된 테스트 계정으로 검증합니다. 후속 GitHub 이슈: <https://github.com/julie9578/VisionAI/issues/21>.

## 기술

- HTML
- CSS
- JavaScript (브라우저 기본 API)