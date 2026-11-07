# ARCADE 작업 하네스

> **먼저 브랜치와 작업 상태를 확인하고, 요청한 범위만 수정·검증한 뒤 원격에 푸시한다. GitHub Pages와 Cloudflare Worker는 별도 배포 대상이므로 각각 상태를 확인한다.**

이 문서는 후속 작업자가 ARCADE 프로젝트와 사용자의 작업 방식을 빠르게 파악하도록 핵심 정보와 절차를 정리한다.

## 작업 원칙

1. 수정 전에 현재 브랜치, 작업 트리, 관련 파일, 프로젝트 관례와 사용 가능한 도구를 확인한다.
2. 사용자가 지정한 브랜치에서 작업한다. 병합이나 전환을 요청받지 않았다면 임의로 `main`에 합치지 않는다.
3. 기존의 미커밋 변경을 보존한다. 요청 범위와 무관한 파일은 스테이징하거나 커밋하지 않는다.
4. 변경 후 가능한 검증을 실행한다. 검증하지 않은 빌드·배포를 성공했다고 표현하지 않는다.
5. 사용자는 작업 완료 후 원격 푸시를 기대한다. 요청한 변경만 커밋·푸시하고 브랜치와 커밋을 알린다.
6. 비밀번호, 토큰, 암호화 키 등 비밀값을 파일·로그·문서에 기록하지 않는다.

## 프로젝트 개요

- 저장소: `https://github.com/julie9578/VisionAI`
- 로컬 경로: `C:\Users\user\Documents\VisionAI`
- 기본 브랜치: `main`
- ARCADE는 한국어 게임 카탈로그다. HTML·CSS·브라우저 JavaScript를 사용하며 게임 데이터는 `script.js`의 `games` 배열에 있다.
- 게임을 추가하거나 수정할 때 고유 `id`, 장르, 넓은 태그, 출처, 대표 이미지, 설명, 상세 페이지 데이터와 링크를 기존 형식에 맞춘다. ID 중복과 전체 개수도 확인한다.

## 파일 구성

| 파일·폴더 | 역할 |
|---|---|
| `index.html`, `styles.css`, `script.js` | 게임 목록·검색·필터·즐겨찾기·프로필·룰렛 |
| `game.html`, `game.css` | 게임별 설명·이미지·공식 사이트 링크 |
| `board.html`, `board.css`, `board.js` | 게시판 화면과 게시글 API 연결 |
| `signup.html`, `login.html`, `auth.css`, `auth.js` | 회원가입·로그인 화면과 인증 API 연결 |
| `src/worker.js` | 게시판 및 회원 API Worker |
| `wrangler.jsonc` | Worker·D1 바인딩과 허용 Origin 설정 |
| `migrations/` | D1 스키마 마이그레이션 |
| `data/arcade-board.sqlite` | 로컬 SQLite 검증·가져오기 파일. Git에서 제외됨 |
| `robots.txt`, `sitemap.xml`, `README.md` | 크롤러 정책·사이트맵·프로젝트 문서 |

## 배포 구조

- GitHub Pages는 `main` 루트를 배포한다: `https://julie9578.github.io/VisionAI/`.
- 기존 홈페이지 Workers 주소는 `https://arcade.nextarcade.workers.dev/`다. GitHub에 푸시해도 이 Worker가 자동으로 갱신되지는 않는다.
- 게시판·인증 API는 `https://arcade-board-api.nextarcade.workers.dev/`에서 제공한다.
- Cloudflare D1 데이터베이스는 `arcade-board`, Worker 바인딩은 `DB`다.
- 로컬 SQLite와 원격 D1은 별개다. 로컬 파일을 수정해도 D1에 자동 반영되지 않는다.
- Worker 배포에는 Node.js, Wrangler, Cloudflare 로그인, 올바른 D1 `database_id` 및 필요한 secret 설정이 필요하다. Pages와 Worker 배포 상태를 각각 확인한다.

## 인증과 개인정보 보호

- Worker secret 이름은 `SESSION_SECRET`, `ADDRESS_ENCRYPTION_KEY`다. 값은 Wrangler secret 또는 Cloudflare 대시보드에서만 관리한다.
- 비밀번호는 PBKDF2 해시와 솔트로 저장하고, 집 주소는 AES-GCM으로 암호화한다. API에서 주소 원문을 반환하지 않는다.
- 로그인 토큰은 현재 탭의 `sessionStorage`에 보관한다. URL이나 로그에 토큰을 남기지 않는다.
- 성별과 집 주소는 민감한 개인정보다. 공개 운영 전에 수집 필요성, 동의, 보유 기간, 개인정보 처리방침을 검토한다.
- 인증 테스트에는 가짜 `.invalid` 이메일과 임시 데이터를 사용하고 테스트 계정을 삭제한다. 실제 개인 계정으로 테스트하지 않는다.

## 검증과 완료 기준

- 커밋 전 `git diff --check`를 실행한다.
- 정적 페이지는 링크·자산 경로·필수 입력·접근성·반응형 표시를 확인한다. 게임 변경은 고유 ID, 필터, 태그 분포와 상세 링크를 검증한다.
- Node.js가 있으면 JavaScript에 `node --check`를 실행한다. 사용할 수 없으면 그 한계를 알리고 다른 검증을 수행한다.
- API 변경은 HTTP 상태, CORS, D1 스키마·응답을 확인한다. 회원 기능은 가입, 중복 이메일, 로그인 실패, 토큰 없는 `/api/auth/me`를 검사한다.
- D1 변경은 먼저 SQLite에서 마이그레이션을 검증하고, 원격 적용 후 테이블·행 또는 API 응답을 확인한다.
- 배포 여부는 해당 호스트의 상태와 공개 URL로 확인한다. GitHub Pages 빌드 성공을 Cloudflare Worker 배포 성공으로 간주하지 않는다.
- 완료 보고에는 변경 사항, 검증 결과, 커밋·브랜치, 실제 배포 상태를 구분해 적는다.

## 마이그레이션 주의사항

- `migrations/0003_create_users.sql`과 `migrations/0004_create_users.sql`은 `users` 테이블을 만드는 중복 이력이 있고 원격에 이미 적용됐다. 적용된 마이그레이션 파일을 임의로 수정·삭제하지 말고, 새 변경은 새 번호 파일로 추가한다.
- `README.md`가 실제 배포 상태와 다를 수 있으므로 문서 수정 전에 Pages·Worker 상태를 확인한다.

## 한국어 문서 작성

사용자는 한국어 설명과 두괄식 표현을 선호한다. 핵심 결론과 필요한 행동을 먼저 쓰고, 세부 근거를 뒤에 둔다. 사실·수치·기술적 의미를 바꾸지 않으며, 과장·기계적인 반복·불필요한 도입과 결론은 줄인다. 이 문체 원칙은 [`epoko77-ai/im-not-ai`](https://github.com/epoko77-ai/im-not-ai)의 의미 보존·자연스러운 한국어 윤문 방향을 참고한다.