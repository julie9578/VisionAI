(() => {
  const apiBase = 'https://arcade-board-api.nextarcade.workers.dev';
  const rows = document.getElementById('postRows');
  const status = document.getElementById('boardStatus');
  const searchForm = document.getElementById('boardSearchForm');
  const searchInput = document.getElementById('boardQuery');
  const categoryButtons = [...document.querySelectorAll('[data-category]')];
  const postDialog = document.getElementById('postDialog');
  const postForm = document.getElementById('postForm');
  const formError = document.getElementById('postFormError');
  const writeButton = document.querySelector('.board-write');
  let selectedCategory = '';
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

  function renderPosts(posts, total) {
    if (!posts.length) {
      rows.innerHTML = '<tr><td class="board-empty" colspan="6">게시글이 없습니다. 첫 글을 작성해 보세요.</td></tr>';
    } else {
      rows.innerHTML = posts.map(post => {
        const category = categoryLabels[post.category] || '자유';
        return `<tr>
          <td><span class="post-badge ${escapeHtml(post.category)}">${escapeHtml(category)}</span></td>
          <td><a class="post-title" href="post.html?id=${encodeURIComponent(post.id)}">${escapeHtml(post.title)}</a></td>
          <td class="post-author">${escapeHtml(post.author)}</td>
          <td class="post-date">${escapeHtml(formatDate(post.created_at))}</td>
          <td class="post-views">—</td>
          <td class="post-actions"><span class="post-reaction-count" aria-label="좋아요 ${Number(post.likes_count) || 0}개">♥ <span>${Number(post.likes_count) || 0}</span></span><span class="post-reaction-count" aria-label="북마크 ${Number(post.bookmarks_count) || 0}개">▣ <span>${Number(post.bookmarks_count) || 0}</span></span></td>
        </tr>`;
      }).join('');
    }
    document.getElementById('postListTitle').innerHTML = `전체 게시글 <span>${Number(total) || 0}</span>`;
  }

  async function loadPosts() {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (query) params.set('q', query);
    status.textContent = '게시글을 불러오는 중…';
    try {
      const response = await fetch(`${apiBase}/api/posts?${params.toString()}`, { headers: { accept: 'application/json' } });
      if (!response.ok) throw new Error(`API ${response.status}`);
      const data = await response.json();
      renderPosts(data.posts || [], data.total);
      status.textContent = '';
      apiAvailable = true;
    } catch {
      apiAvailable = false;
      status.textContent = '데이터베이스 연결을 기다리는 중입니다. Cloudflare D1 설정과 API 배포가 완료되면 게시글을 불러옵니다.';
    }
  }

  searchInput.value = query;
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    query = searchInput.value.trim();
    loadPosts();
  });

  categoryButtons.forEach(button => button.addEventListener('click', () => {
    selectedCategory = button.dataset.category;
    categoryButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    loadPosts();
  }));

  writeButton.addEventListener('click', event => {
    event.preventDefault();
    if (!apiAvailable) {
      status.textContent = 'Cloudflare D1 게시판 API가 아직 배포되지 않아 글을 저장할 수 없습니다.';
      return;
    }
    formError.textContent = '';
    postDialog.showModal();
    document.getElementById('postCategory').focus();
  });
  document.getElementById('closePostDialog').addEventListener('click', () => postDialog.close());
  postDialog.addEventListener('click', event => {
    if (event.target === postDialog) postDialog.close();
  });

  postForm.addEventListener('submit', async event => {
    event.preventDefault();
    const submit = postForm.querySelector('[type="submit"]');
    submit.disabled = true;
    formError.textContent = '';
    const formData = new FormData(postForm);
    try {
      const response = await fetch(`${apiBase}/api/posts`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '게시글을 저장하지 못했습니다.');
      postDialog.close();
      postForm.reset();
      query = '';
      searchInput.value = '';
      selectedCategory = '';
      categoryButtons.forEach((item, index) => {
        const selected = index === 0;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      status.textContent = '게시글을 저장했습니다.';
      await loadPosts();
    } catch (error) {
      formError.textContent = error.message || '게시글을 저장하지 못했습니다.';
    } finally {
      submit.disabled = false;
    }
  });

  loadPosts();
})();