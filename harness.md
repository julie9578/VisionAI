# ARCADE 저장소 작업 하네스

이 문서는 `julie9578/VisionAI` 저장소에서 코딩 에이전트가 작업할 때 따라야 할 저장소별 절차와 주의사항을 정리합니다. 사용자가 지정한 브랜치와 변경 범위를 우선하며, 검증하지 않은 작업이나 배포를 완료했다고 표현하지 않습니다. 특히 이 저장소는 여러 worktree와 배포 대상이 동시에 사용되므로, 파일을 수정하기 전에 **어느 로컬 폴더와 브랜치를 대상으로 하는지**를 확정합니다.

## 1. 저장소 및 주요 구조

- GitHub: <https://github.com/julie9578/VisionAI>
- 로컬 기본 저장소: `C:\Users\user\Documents\VisionAI`
- 정적 홈페이지: GitHub Pages, <https://julie9578.github.io/VisionAI/>
- API: Cloudflare Worker `arcade-board-api`, <https://arcade-board-api.nextarcade.workers.dev/>
- D1 데이터베이스: `arcade-board` (`wrangler.jsonc`의 `DB` 바인딩)
- 주요 프런트엔드 파일: `index.html`, `styles.css`, `script.js`, `game.html`, `game.css`
- 게시판 및 회원 파일: `board.html`, `board.js`, `community.js`, `signup.html`, `login.html`, `auth.js`, `profile.html`
- Worker: `src/worker.js`; 스키마 변경: `migrations/`
- 로컬 테스트 DB가 있으면 `data/arcade-board.sqlite`를 포함해 SQLite 파일은 민감 데이터로 취급합니다.

## 2. 폴더·브랜치 선택과 작업 전 확인

### 작업 시작 체크리스트

1. 기본 폴더 `C:\Users\user\Documents\VisionAI`에서 다음을 실행하고 기록합니다.

   ```powershell
   git -C C:\Users\user\Documents\VisionAI status --short --branch
   git -C C:\Users\user\Documents\VisionAI remote -v
   git -C C:\Users\user\Documents\VisionAI worktree list --porcelain
   git -C C:\Users\user\Documents\VisionAI branch -vv

   사용자가 다른 절대 경로를 지정하면 해당 경로를 우선하며, 수정·체크아웃 전에 실제 대상 저장소와 브랜치를 확인합니다.
   ```

2. **각 폴더의 remote URL, 현재 브랜치, HEAD와 작업 트리 상태를 따로 확인합니다.** 폴더 이름이 `main`이나 `merge`를 포함한다고 최신 또는 안전한 폴더라고 가정하지 않습니다.
3. `HEAD`, `origin/<branch>`, 사용자 목표 브랜치의 SHA와 앞섬/뒤처짐 커밋 수를 확인합니다. 로컬 저장소가 여러 개면 같은 `origin`을 가리키더라도 서로 다른 저장소 상태로 취급합니다.
4. `git status`의 staged, unstaged, untracked 파일과 merge/rebase 진행 여부를 확인합니다. **작업 시작 당시 있던 파일을 새로 만든 파일로 오인하지 말고**, 대상 파일이 이미 있으면 내용을 읽고 보존합니다.
5. 다른 worktree가 목표 브랜치를 이미 체크아웃했는지 확인합니다. 같은 브랜치는 한 번에 하나의 worktree에서만 체크아웃할 수 있습니다.
6. 기존 구현·네이밍·정적 HTML/CSS/브라우저 JavaScript 패턴을 먼저 읽고 필요한 파일만 수정합니다. 백엔드 추가나 새 의존성 설치는 요청이 있는 경우에만 합니다.
7. `harness/AGENTS.md`와 이 문서를 함께 따릅니다. 두 지침과 사용자 요청이 충돌하면 충돌 지점을 알리고 사용자 요청을 우선합니다.

### 기본 로컬 폴더를 `main`으로 전환하라는 요청

1. 먼저 기본 폴더의 `git status --short --branch`를 확인합니다. 변경 또는 untracked 파일이 있으면 **삭제·stash·강제 checkout하지 않습니다**.
2. 목표 브랜치가 다른 worktree에서 체크아웃되어 있으면 그 worktree의 상태와 변경 소유자를 먼저 확인합니다. 충돌이 있거나 변경이 정리되지 않았다면 그 worktree를 `reset --hard`, 삭제, 강제 이동하지 않습니다.
3. 안전하게 전환할 수 없는 경우 기본 폴더를 그대로 보존하고, 최신 `origin/main`에서 별도 worktree를 만듭니다. 예:

   ```powershell
   git -C C:\Users\user\Documents\VisionAI fetch origin
   git -C C:\Users\user\Documents\VisionAI worktree add -b main-local C:\Users\user\Documents\VisionAI-main origin/main
   ```

   대상 폴더나 브랜치가 이미 있으면 임의로 재사용·덮어쓰지 않습니다. 새 이름을 선택하고 기존 worktree를 보고합니다.
4. 최종 응답에는 실제로 전환된 폴더의 절대 경로와 브랜치를 명시합니다. 별도 worktree를 만들었으면 기본 폴더도 `main`으로 전환했다고 표현하지 않습니다.

### `harness.md` 또는 비슷한 문서를 다룰 때

- 루트 `harness.md`, 루트 `하네스.md`, `harness/AGENTS.md`는 서로 다른 파일입니다. 사용자가 지정한 정확한 경로와 대소문자를 적용합니다.
- 파일을 만들기 전에 루트와 `harness/` 아래의 비슷한 이름 파일을 검색합니다. 기존 파일이 있으면 먼저 읽고 내용을 갱신하며, 이름만 바꾸거나 동일 문서를 복제한 것을 “내용을 수정했다”고 보고하지 않습니다.
- 새 문서는 UTF-8로 저장하고, 저장 후 파일명·경로·내용·Git status를 다시 확인합니다.
- 사용자가 “로컬에만” 요청했으면 원격 푸시를 하지 않습니다. “업로드”라고 요청하면 대상이 로컬 파일, GitHub 원격, 정적 사이트 중 무엇인지 문맥과 상태로 판별하고 수행한 대상을 정확히 보고합니다.

## 3. 구현 원칙

- `script.js`의 `games` 배열은 카드와 상세 페이지가 공유하는 카탈로그 원본입니다. 게임을 변경할 때 `id`의 유일성, 태그 중복, Steam 여부, 이미지 및 링크를 함께 확인합니다.
- 이미지 목록은 대표 이미지와 스크린샷을 합칠 때 URL 중복을 제거합니다. 상세 갤러리의 장수 제한이 요구되면 렌더링 결과 기준으로 검증합니다.
- 즐겨찾기는 브라우저 `localStorage`에 저장되며, 가입·로그인 데이터와 혼동하지 않습니다.
- UI 변경은 데스크톱과 좁은 화면을 모두 확인합니다. 네비게이션·필터·정렬은 작은 폭에서 의도치 않은 줄바꿈이나 컨트롤 겹침이 없는지 검사합니다.
- 사용자 계정·게시판 데이터는 Worker/D1 API를 사용합니다. API 연결 오류를 정적 페이지 기능 문제로 단정하지 말고 각 계층을 구분해 확인합니다.
- 접근성 이름, 키보드 포커스, `aria-pressed`, 이미지 대체 텍스트, 팝업 열기·닫기 동작을 보존합니다.

## 4. 검증 절차

변경에 해당하는 항목만 실행하되, 가능한 검증을 생략하지 않습니다.

### 정적 사이트 및 스크립트

```powershell
node --check .\script.js
node --check .\board.js
node --check .\community.js
node --check .\auth.js
node --check .\src\worker.js
git diff --check
```

- 모든 JavaScript 파일이 항상 존재하는 것은 아니므로 대상 파일이 있는지 먼저 확인합니다.
- 게임 데이터 변경 시 고유 ID, 추천 배열과 ID 대응, 모든 기대 이미지 수, 이미지 URL 중복을 자동 검사합니다.
- 가능하면 Chrome/Edge에서 실제 페이지를 열어 카드 수, 메뉴·정렬·필터·즐겨찾기·대화상자 동작을 확인합니다. 테스트 하네스가 실패하거나 브라우저를 사용할 수 없으면 이를 분명히 보고합니다.
- 공개 이미지 URL은 가능할 때 HTTP HEAD/GET 요청으로 확인합니다. 응답 오류는 게임 기능 테스트 실패와 구분합니다.

### Cloudflare Worker 및 D1

- `wrangler.jsonc`의 이름, entry point, D1 binding, `ALLOWED_ORIGINS`를 확인한 뒤 `wrangler whoami`로 인증 상태를 확인합니다.
- 스키마 변경은 새 migration 파일을 추가합니다. 원격 DB에 migration을 적용하거나 Worker를 배포하기 전에 대상 데이터베이스·프로젝트를 확인합니다.
- 게시글 API와 회원 API를 따로 확인하고, HTTP 상태·CORS·응답 구조를 검증합니다. 비밀 키나 사용자 실데이터를 테스트 결과로 출력하지 않습니다.

### GitHub Pages와 Worker 배포 구분

- GitHub Pages는 `main` 루트의 정적 파일을 게시합니다. 사이트 파일 변경은 Pages 빌드 및 공개 URL의 실제 파일 내용까지 확인합니다.
- `wrangler.jsonc`는 `arcade-board-api` Worker와 D1 API를 설정합니다. 이 Worker는 정적 사이트와 별개입니다. Worker 루트 URL의 404만으로 API 배포 실패라고 판단하지 말고 `/api/...` 경로를 확인합니다.
- README에 적힌 `https://arcade.nextarcade.workers.dev/`는 별도 확인 전까지 정상적인 정적 사이트 주소라고 가정하지 않습니다. 현재 확인된 GitHub Pages 주소를 기준 URL로 사용합니다.
- “푸시”와 “배포”를 구분합니다. Git 푸시 성공, Pages 빌드 성공, Worker 배포 성공을 각각 독립적으로 검증해 보고합니다.

## 5. 보안 및 데이터 보호

- `.env`, `.dev.vars`, Wrangler 인증 파일, secret 값, access token, 실제 주소·이메일·비밀번호를 출력하거나 커밋하지 않습니다.
- 실제 secret 값은 Wrangler secret으로만 관리합니다. secret 변경은 기존 세션이나 암호화 데이터에 영향을 줄 수 있으므로 요청과 검토 없이 변경하지 않습니다.
- `data/`, `*.sqlite`, `*.sqlite3`를 커밋하지 않습니다. 테스트 DB가 untracked라고 해서 자동 추가하거나 업로드하지 않습니다.
- 사용자 테이블·개인정보·D1 레코드를 삭제하거나 초기화하지 않습니다. 테스트 레코드는 식별 가능한 임시 이메일과 명시적인 정리 절차를 사용합니다.
- 기존 migrations는 수정·삭제하지 않습니다. 새 스키마는 새 번호의 migration으로 추가합니다.

## 6. 파일 수정·검증 절차

1. 사용자가 지정한 파일과 그 파일을 실제로 로드하는 HTML/스크립트/설정 파일을 함께 확인합니다. 중복 CSS 규칙이나 동일 파일의 여러 사본이 있으면 적용 순서와 활성 worktree를 확인합니다.
2. 수정 전 원본 내용을 읽고, 가능한 한 정확한 작은 patch를 적용합니다. patch가 실패하거나 fuzzy 적용되면 성공으로 간주하지 말고 파일을 다시 읽어 실제 반영 상태를 확인합니다.
3. 파일을 수정했으면 **같은 절대 경로의 파일을 다시 읽어** 변경 내용과 위치를 확인합니다. 비슷한 이름의 다른 worktree나 임시 복사본을 확인한 결과를 실제 대상 파일에 적용된 것으로 간주하지 않습니다.
4. 변경 범위에 맞는 검증을 실행합니다. 예: `node --check`, 데이터 개수·중복 검사, 이미지 HTTP 응답, API 응답, 브라우저 이벤트 및 반응형 레이아웃.
5. 테스트 하네스/PowerShell/브라우저 명령이 실패하면 그 테스트 실행 오류와 애플리케이션 오류를 구분합니다. 실패한 검증을 바로 재사용하지 말고 하네스를 수정하거나 더 단순한 검사로 교차 확인합니다.
6. Chrome/Edge에서 확인했다면 실제 관찰한 페이지·viewport·상호작용을 구체적으로 기록합니다. 정적 검사만 했으면 브라우저 동작도 검증했다고 표현하지 않습니다.

## 7. Git 커밋 및 업로드 절차

1. `git status --short --branch`, `git diff --name-only`, `git diff --cached --name-only`, `git diff --name-only --diff-filter=U`를 확인합니다. 커밋 전 변경 파일과 충돌 파일이 예상 범위인지 확인합니다.
2. 사용자 변경을 포함한 대상 파일만 명시적으로 stage합니다. 기존 staged 변경, untracked 파일, 로컬 DB를 `git add -A`로 무심코 포함하지 않습니다.
3. `git diff --cached --check` 및 해당 코드 검증을 통과시킵니다.
4. 사용자가 요청했거나 작업 범위상 명확히 승인한 경우에만 커밋·푸시합니다. 푸시 전에 `git fetch origin` 후 `HEAD`와 `origin/<branch>`를 비교합니다.
5. 원격이 앞서 있으면 최신 커밋을 병합하거나 rebase합니다. 충돌이 생기면 세 파일의 내용과 양쪽 의도를 비교하고 수동 해결합니다. 충돌 중 `--ours`/`--theirs`를 통째로 선택해 기능을 잃지 않도록 합니다.
6. 충돌 표식(`<<<<<<<`, `=======`, `>>>>>>>`)이 없고 `git status`가 예상대로일 때만 병합을 완료합니다. 사용자 작업이 든 다른 worktree는 명시적 승인 없이 정리·삭제·강제 리셋하지 않습니다.
7. Push 후 local `HEAD`와 `origin/<branch>` SHA가 일치하는지 확인합니다. GitHub API의 커밋 SHA/파일 경로로 원격 업로드를 교차 확인합니다.
8. 로컬 파일과 원격 파일을 각각 요청받았으면 두 경로를 구분해 저장하고, 기존 파일이 있으면 해시나 diff로 내용 차이를 보고합니다. 파일명 변경과 문서 내용 개정은 서로 다른 작업입니다.

## 8. 배포와 최종 보고

- GitHub Pages는 `main` 루트의 정적 파일을 게시합니다. 사이트 파일 변경 후 Pages build의 commit과 `built` 상태를 확인하고, 공개 URL에서 해당 HTML/CSS/JS의 새 내용을 읽어 검증합니다.
- `wrangler.jsonc`는 `arcade-board-api` Worker와 D1 API를 설정합니다. 이 Worker는 정적 사이트와 별개입니다. Worker 루트 URL의 404만으로 API 배포 실패라고 판단하지 말고 `/api/...` 경로를 확인합니다.
- README에 적힌 `https://arcade.nextarcade.workers.dev/`는 별도 확인 전까지 정상적인 정적 사이트 주소라고 가정하지 않습니다. 현재 확인된 GitHub Pages 주소는 `https://julie9578.github.io/VisionAI/`입니다.
- “로컬 파일 작성”, “GitHub 푸시”, “GitHub Pages 배포”, “Cloudflare Worker 배포”는 별개의 결과입니다. 사용자가 요청한 대상만 수행하며 각 결과를 독립적으로 검증합니다.
- `building`은 진행 중일 뿐 성공이 아닙니다. `built`와 새 commit 파일의 공개 응답을 확인하기 전에는 완료라고 보고하지 않습니다.
- 마지막 응답에는 변경 파일, 실제 검증, 커밋 SHA, 푸시/배포 상태, 공개 URL, 미완료 항목을 사실대로 요약합니다. 혼선이 있으면 잘못된 경로·명령과 복구 여부를 분명하게 설명하고 불필요한 내부 세부정보는 줄입니다.

## 7. 오류 및 보고

- 명령, patch, 브라우저 테스트가 실패하면 실패한 정확한 단계와 원인을 기록합니다. 테스트 도구의 실패를 애플리케이션 오류라고 단정하지 않습니다.
- 브라우저에서 확인하지 못한 동작을 시각적으로 검증했다고 주장하지 않습니다.
- `building`은 Pages 배포가 진행 중이라는 뜻이지 성공이 아닙니다. `built`와 새 커밋의 공개 파일 확인이 모두 끝나기 전에 배포 완료라고 보고하지 않습니다.
- 이미 공개된 사이트가 캐시되었을 수 있으므로 commit query string 등을 사용해 캐시 우회 확인을 수행합니다.
- 완료 보고는 한국어로 간단하고 사실에 기반해 작성합니다. 커밋·푸시·배포 여부를 각각 명시합니다.