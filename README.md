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
- 게시판 게시글을 Cloudflare D1에 저장하는 API (D1/Worker 배포 설정 필요)
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
wrangler.jsonc Cloudflare Worker와 D1 설정
migrations/  D1 데이터베이스 스키마 변경
src/worker.js 게시판 REST API
```

## 게시판 데이터베이스 (SQLite / Cloudflare D1)

게시판은 SQLite 호환 Cloudflare D1 데이터베이스의 단일 `posts` 테이블에 게시글을 저장하도록 준비되어 있습니다. 테이블에는 분류, 제목, 내용, 작성자, 생성·수정 시각이 들어갑니다. 스키마는 `migrations/0001_create_posts.sql`에 있습니다.

GitHub Pages는 정적 호스팅이므로 D1에 직접 접속할 수 없습니다. 게시판 데이터를 영구 저장하려면 Cloudflare D1 데이터베이스와 별도의 Worker API를 실제로 생성·배포해야 합니다. API 이름은 `arcade-board-api`로 설정했습니다. 현재 저장소에는 Wrangler 설정과 API 코드가 있지만, 실제 Cloudflare 계정에 DB/Worker를 만들거나 배포하지는 않았습니다.

필요 조건: Node.js, Cloudflare 계정, Wrangler 인증. 이 저장소에는 비밀 토큰을 커밋하지 말고, D1 생성 후 발급되는 `database_id`만 Wrangler 설정에 반영하세요.

1. Wrangler를 설치하고 Cloudflare에 로그인합니다.

   ```bash
   npm install --save-dev wrangler
   npx wrangler login
   ```

2. D1 데이터베이스를 만들고 Wrangler가 설정을 갱신하게 합니다.

   ```bash
   npx wrangler d1 create arcade-board --update-config
   ```

   또는 명령이 설정을 자동으로 수정하지 않으면 출력된 `database_id`를 `wrangler.jsonc`의 `d1_databases[0].database_id`에 입력합니다.

3. 게시글 테이블 마이그레이션을 로컬과 원격 DB에 적용합니다.

   ```bash
   npx wrangler d1 migrations apply arcade-board --local
   npx wrangler d1 migrations apply arcade-board --remote
   ```

4. 게시판을 제공할 origin을 `wrangler.jsonc`의 `ALLOWED_ORIGINS`에 포함한 뒤 Worker API를 배포합니다.

   ```bash
   npx wrangler deploy
   ```

5. 배포를 확인합니다.

   ```bash
   curl https://arcade-board-api.nextarcade.workers.dev/api/posts
   ```

게시판은 API가 연결되지 않으면 예시 목록과 연결 대기 안내를 표시합니다. 실제 데이터 조회·작성은 D1과 Worker를 배포한 뒤 활성화됩니다. 현재 GitHub Pages와 `arcade.nextarcade.workers.dev`는 별도 배포 대상이므로, 이 Worker API 배포만으로 기존 Workers 홈페이지 파일까지 업데이트되지는 않습니다.

## 배포

- 라이브 홈페이지: <https://arcade.nextarcade.workers.dev/>

## 기술

- HTML
- CSS
- JavaScript (브라우저 기본 API)