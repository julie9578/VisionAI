(() => {
  const apiBase = 'https://arcade-board-api.nextarcade.workers.dev';
  const tokenKey = 'arcade-session-token';
  const rows = document.getElementById('postRows');
  const status = document.getElementById('boardStatus');
  const searchForm = document.getElementById('boardSearchForm');
  const searchInput = document.getElementById('boardQuery');
  const searchCategory = document.getElementById('boardSearchCategory');
  const searchScope = document.getElementById('boardSearchScope');
  const pagination = document.getElementById('boardPagination');
  const skeleton = document.getElementById('boardSkeleton');
  const boardCategoryToggle = document.getElementById('boardCategoryToggle');
  const boardCategories = document.getElementById('boardCategories');
  const categoryButtons = [...document.querySelectorAll('[data-category]')];
  const writeButton = document.querySelector('.board-write');
  let selectedCategory = new URLSearchParams(location.search).get('category') || '';
  let selectedPage = 1;
  let selectedSearchScope = new URLSearchParams(location.search).get('scope') || 'all';
  let query = new URLSearchParams(window.location.search).get('q') || '';
  let apiAvailable = true;

  const categoryLabels = {
    notice: '공지',
    free: '자유',
    recommend: '게임 추천',
    guide: '공략·팁',
    recruit: '모집',
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]);
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('ko-KR', { month: '2-digit', day: '2-digit' }).format(date).replace('. ', '.').replace('.', '');
  }

  function renderPosts(posts, total, page, pageSize) {
    if (!posts.length) {
      rows.innerHTML = '<tr><td class="board-empty" colspan="7">게시글이 없습니다. 첫 글을 작성해 보세요.</td></tr>';
    } else {
      rows.innerHTML = posts.map((post, index) => {
        const category = categoryLabels[post.category] || '자유';
        const authorHref = post.author_id ? `user.html?id=${encodeURIComponent(post.author_id)}` : `user.html?name=${encodeURIComponent(post.author || '운영팀')}`;
        const postNumber = Math.max(1, Number(total) - ((Number(page) - 1) * Number(pageSize)) - index);
        return `<tr>
          <td class="post-number">${postNumber}</td>
          <td><span class="post-badge ${escapeHtml(post.category)}">${escapeHtml(category)}</span></td>
          <td><a class="post-title" href="post.html?id=${encodeURIComponent(post.id)}">${escapeHtml(post.title)} <span class="reply-count">[${Number(post.comments_count) || 0}]</span></a></td>
          <td class="post-author"><a href="${authorHref}">${escapeHtml(post.author)}</a></td>
          <td class="post-date">${escapeHtml(formatDate(post.created_at))}</td>
          <td class="post-views">—</td>
          <td class="post-actions"><span class="post-reaction-count" aria-label="좋아요 ${Number(post.likes_count) || 0}개">♥ <span>${Number(post.likes_count) || 0}</span></span><span class="post-reaction-count" aria-label="북마크 ${Number(post.bookmarks_count) || 0}개">▣ <span>${Number(post.bookmarks_count) || 0}</span></span></td>
        </tr>`;
      }).join('');
    }
    const heading = selectedCategory ? {
      free: '자유 게시글',
      recommend: '게임 추천글',
      guide: '공략·팁 게시글',
      recruit: '모집 게시글',
      notice: '공지사항',
    }[selectedCategory] || '전체 게시글' : '전체 게시글';
    document.getElementById('postListTitle').innerHTML = `${heading} <span>${Number(total) || 0}</span>`;
  }

  function renderPagination(page, total, pageSize) {
    const pageCount = Math.max(1, Math.ceil((Number(total) || 0) / pageSize));
    const items = [];
    if (pageCount > 1) items.push('<button class="page-arrow" type="button" data-page="' + (page - 1) + '" aria-label="이전 페이지" ' + (page <= 1 ? 'disabled' : '') + '>‹</button>');
    const windowSize = 5;
    const firstPage = Math.max(1, Math.min(page - Math.floor(windowSize / 2), pageCount - windowSize + 1));
    const lastPage = Math.min(pageCount, firstPage + windowSize - 1);
    if (firstPage > 1) {
      items.push('<button class="page-number" type="button" data-page="1">1</button>');
      if (firstPage > 2) items.push('<span class="page-ellipsis" aria-hidden="true">…</span>');
    }
    for (let number = firstPage; number <= lastPage; number += 1) items.push('<button class="page-number ' + (number === page ? 'active' : '') + '" type="button" data-page="' + number + '" ' + (number === page ? 'aria-current="page"' : '') + '>' + number + '</button>');
    if (lastPage < pageCount) {
      if (lastPage < pageCount - 1) items.push('<span class="page-ellipsis" aria-hidden="true">…</span>');
      items.push('<button class="page-number" type="button" data-page="' + pageCount + '">' + pageCount + '</button>');
    }
    if (pageCount > 1) items.push('<button class="page-arrow" type="button" data-page="' + (page + 1) + '" aria-label="다음 페이지" ' + (page >= pageCount ? 'disabled' : '') + '>›</button>');
    pagination.innerHTML = items.join('');
    pagination.hidden = false;
    pagination.querySelectorAll('[data-page]').forEach(button => button.addEventListener('click', () => { if (button.disabled) return; selectedPage = Number(button.dataset.page); loadPosts(); document.getElementById('all-posts').scrollIntoView({behavior:'smooth',block:'start'}); }));
  }

  async function loadPosts() {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedSearchScope) params.set('scope', selectedSearchScope);
    params.set('page', String(selectedPage));
    if (query) params.set('q', query);
    if (skeleton) skeleton.hidden = false;
    rows.setAttribute('aria-busy', 'true');
    status.textContent = '게시글을 불러오는 중…';
    try {
      const requestHeaders = { accept: 'application/json' };
      const authToken = localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey);
      if (authToken) requestHeaders.authorization = `Bearer ${authToken}`;
      const response = await fetch(`${apiBase}/api/posts?${params.toString()}`, { headers: requestHeaders });
      if (!response.ok) throw new Error(`API ${response.status}`);
      const data = await response.json();
      const notices = selectedCategory === '' || selectedCategory === 'notice' ? data.notices || [] : [];
      const posts = data.posts || [];
      const page = Number(data.page) || selectedPage;
      const pageSize = Number(data.pageSize) || 20;
      const visibleNotices = selectedPage === 1 ? notices : [];
      const total = Number(data.total) + (selectedCategory === '' ? notices.length : 0);
      renderPosts([...visibleNotices, ...posts], total, page, pageSize);
      renderPagination(page, data.total, pageSize);
      status.textContent = '';
      apiAvailable = true;
    } catch {
      apiAvailable = false;
      status.textContent = '데이터베이스 연결을 기다리는 중입니다. Cloudflare D1 설정과 API 배포가 완료되면 게시글을 불러옵니다.';
    } finally {
      if (skeleton) skeleton.hidden = true;
      rows.removeAttribute('aria-busy');
    }
  }

  searchInput.value = query;
  searchCategory.value = selectedCategory;
  searchScope.value = selectedSearchScope;
  categoryButtons.forEach(button => { const active = button.dataset.category === selectedCategory; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  boardCategoryToggle?.addEventListener('click', () => {
    const expanded = boardCategoryToggle.getAttribute('aria-expanded') === 'true';
    boardCategoryToggle.setAttribute('aria-expanded', String(!expanded));
    boardCategoryToggle.setAttribute('aria-label', expanded ? '게시판 카테고리 펼치기' : '게시판 카테고리 접기');
    boardCategories.classList.toggle('categories-open', !expanded);
  });
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    query = searchInput.value.trim();
    selectedCategory = searchCategory.value;
    selectedSearchScope = searchScope.value || 'all';
    selectedPage = 1;
    categoryButtons.forEach(button => { const active = button.dataset.category === selectedCategory; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    loadPosts();
  });

  categoryButtons.forEach(button => button.addEventListener('click', () => {
    selectedCategory = button.dataset.category;
    searchCategory.value = selectedCategory;
    selectedPage = 1;
    categoryButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    if (boardCategoryToggle) {
      boardCategoryToggle.setAttribute('aria-expanded', 'false');
      boardCategoryToggle.setAttribute('aria-label', '게시판 카테고리 펼치기');
      boardCategories.classList.remove('categories-open');
    }
    loadPosts();
  }));

  searchCategory.addEventListener('change', () => {
    selectedCategory = searchCategory.value;
    selectedPage = 1;
    categoryButtons.forEach(button => { const active = button.dataset.category === selectedCategory; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    if (boardCategoryToggle) {
      boardCategoryToggle.setAttribute('aria-expanded', 'false');
      boardCategoryToggle.setAttribute('aria-label', '게시판 카테고리 펼치기');
      boardCategories.classList.remove('categories-open');
    }
    loadPosts();
  });

  writeButton.addEventListener('click', event => {
    event.preventDefault();
    if (!sessionStorage.getItem(tokenKey) && !localStorage.getItem(tokenKey)) {
      window.open(`login.html?next=${encodeURIComponent('post-write.html')}`, '_blank');
      return;
    }
    if (!apiAvailable) {
      status.textContent = 'Cloudflare D1 게시판 API가 아직 배포되지 않아 글을 저장할 수 없습니다.';
      return;
    }
    window.open('post-write.html', '_blank');
  });

  loadPosts();
})();