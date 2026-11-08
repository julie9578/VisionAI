(() => {
  const apiBase = 'https://arcade-board-api.nextarcade.workers.dev';
  const tokenKey = 'arcade-session-token';
  const rows = document.getElementById('postRows');
  const status = document.getElementById('boardStatus');
  const searchForm = document.getElementById('boardSearchForm');
  const searchInput = document.getElementById('boardQuery');
  const searchCategory = document.getElementById('boardSearchCategory');
  const searchScope = document.getElementById('boardSearchScope');
  const categoryButtons = [...document.querySelectorAll('[data-category]')];
  const writeButton = document.querySelector('.board-write');
  const pagination = document.getElementById('boardPagination');
  let selectedCategory = '';
  let selectedPage = 1;
  let query = new URLSearchParams(window.location.search).get('q') || '';
  let selectedSearchScope = new URLSearchParams(window.location.search).get('scope') || 'all';
  let selectedCategoryFromUrl = new URLSearchParams(window.location.search).get('category') || '';
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

  function renderPosts(posts, total) {
    if (!posts.length) {
      rows.innerHTML = '<tr><td class="board-empty" colspan="6">게시글이 없습니다. 첫 글을 작성해 보세요.</td></tr>';
    } else {
      rows.innerHTML = posts.map(post => {
        const category = categoryLabels[post.category] || '자유';
        const authorHref = post.author_id ? `user.html?id=${encodeURIComponent(post.author_id)}` : `user.html?name=${encodeURIComponent(post.author || '운영팀')}`;
        const noticeClass = post.category === 'notice' ? 'notice-row' : '';
        return `<tr class="${noticeClass}">
          <td><span class="post-badge ${escapeHtml(post.category)}">${escapeHtml(category)}</span></td>
          <td><a class="post-title" href="post.html?id=${encodeURIComponent(post.id)}">${post.category === 'notice' ? '<span class="notice-pin" aria-label="고정 공지">📌</span>' : ''}${escapeHtml(post.title)} <span class="reply-count">[${Number(post.comments_count) || 0}]</span></a></td>
          <td class="post-author"><a href="${authorHref}">${escapeHtml(post.author)}</a></td>
          <td class="post-date">${escapeHtml(formatDate(post.created_at))}</td>
          <td class="post-views">—</td>
          <td class="post-actions"><span class="post-reaction-count" aria-label="좋아요 ${Number(post.likes_count) || 0}개">♥ <span>${Number(post.likes_count) || 0}</span></span><span class="post-reaction-count" aria-label="북마크 ${Number(post.bookmarks_count) || 0}개">▣ <span>${Number(post.bookmarks_count) || 0}</span></span></td>
        </tr>`;
      }).join('');
    }
    document.getElementById('postListTitle').innerHTML = `전체 게시글 <span>${Number(total) || 0}</span>`;
  }

  function renderPagination(page, total, pageSize) {
    const pageCount = Math.max(1, Math.ceil((Number(total) || 0) / pageSize));
    if (pageCount <= 1) {
      pagination.innerHTML = '';
      pagination.hidden = true;
      return;
    }
    pagination.hidden = false;
    const items = [];
    items.push(`<button class="page-arrow ${page <= 1 ? 'disabled' : ''}" type="button" data-page="${page - 1}" aria-label="이전 페이지" ${page <= 1 ? 'disabled' : ''}>‹</button>`);
    for (let number = 1; number <= pageCount; number += 1) {
      items.push(`<button class="page-number ${number === page ? 'active' : ''}" type="button" data-page="${number}" ${number === page ? 'aria-current="page"' : ''}>${number}</button>`);
    }
    items.push(`<button class="page-arrow ${page >= pageCount ? 'disabled' : ''}" type="button" data-page="${page + 1}" aria-label="다음 페이지" ${page >= pageCount ? 'disabled' : ''}>›</button>`);
    pagination.innerHTML = items.join('');
    pagination.querySelectorAll('[data-page]').forEach(button => button.addEventListener('click', () => {
      if (button.disabled) return;
      selectedPage = Number(button.dataset.page);
      loadPosts();
      document.getElementById('all-posts').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
  }

  async function loadPosts() {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedSearchScope) params.set('scope', selectedSearchScope);
    if (query) params.set('q', query);
    params.set('page', String(selectedPage));
    status.textContent = '게시글을 불러오는 중…';
    try {
      const requestHeaders = { accept: 'application/json' };
      const authToken = sessionStorage.getItem(tokenKey);
      if (authToken) requestHeaders.authorization = `Bearer ${authToken}`;
      const response = await fetch(`${apiBase}/api/posts?${params.toString()}`, { headers: requestHeaders });
      if (!response.ok) throw new Error(`API ${response.status}`);
      const data = await response.json();
      const notices = data.notices || [];
      const posts = data.posts || [];
      renderPosts([...notices, ...posts], Number(data.total) + notices.length);
      renderPagination(data.page || selectedPage, data.total, data.pageSize || 10);
      status.textContent = '';
      apiAvailable = true;
    } catch {
      apiAvailable = false;
      status.textContent = '데이터베이스 연결을 기다리는 중입니다. Cloudflare D1 설정과 API 배포가 완료되면 게시글을 불러옵니다.';
    }
  }

  searchInput.value = query;
  searchCategory.value = selectedCategoryFromUrl;
  searchScope.value = selectedSearchScope;
  if (selectedCategoryFromUrl) {
    selectedCategory = selectedCategoryFromUrl;
    categoryButtons.forEach(button => {
      const selected = button.dataset.category === selectedCategory;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    query = searchInput.value.trim();
    selectedCategory = searchCategory.value;
    selectedCategoryFromUrl = selectedCategory;
    selectedSearchScope = searchScope.value || 'all';
    categoryButtons.forEach(button => {
      const selected = button.dataset.category === selectedCategory;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    selectedPage = 1;
    loadPosts();
  });

  categoryButtons.forEach(button => button.addEventListener('click', () => {
    selectedCategory = button.dataset.category;
    selectedCategoryFromUrl = selectedCategory;
    searchCategory.value = selectedCategory;
    selectedPage = 1;
    categoryButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    loadPosts();
  }));

  searchCategory.addEventListener('change', () => {
    selectedCategory = searchCategory.value;
    selectedCategoryFromUrl = selectedCategory;
    categoryButtons.forEach(button => {
      const selected = button.dataset.category === selectedCategory;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    selectedPage = 1;
    loadPosts();
  });

  writeButton.addEventListener('click', event => {
    event.preventDefault();
    if (!sessionStorage.getItem(tokenKey)) {
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