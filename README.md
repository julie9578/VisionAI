# ARCADE — 게임 라운지

인기 게임을 둘러보고, 취향에 맞는 다음 플레이를 발견할 수 있는 한국어 게임 큐레이션 홈페이지입니다.

**라이브 홈페이지:** https://julie9578.github.io/VisionAI/

## 주요 기능

- 게임 제목, 영문명, 장르와 태그를 기준으로 게임 검색
- 액션, RPG, 인디, 어드벤처 장르별 필터 및 즐겨찾기 필터
- 게임 카드에서 즐겨찾기 추가·해제 및 브라우저에 저장
- 게임 공식 홈페이지로 이동하는 링크
- 오늘의 랜덤 게임 추천
- 프로필 카드에서 게이머 이름과 즐겨찾기 수 확인
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
```

## 배포

GitHub Pages가 `main` 브랜치의 저장소 루트를 배포합니다. `main`에 변경 사항을 푸시하면 홈페이지가 업데이트됩니다.

- 홈페이지: <https://julie9578.github.io/VisionAI/>
- 크롤러 정책: <https://julie9578.github.io/VisionAI/robots.txt>
- 사이트맵: <https://julie9578.github.io/VisionAI/sitemap.xml>

## 기술

- HTML
- CSS
- JavaScript (브라우저 기본 API)