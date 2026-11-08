const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(new URL('./board.js', `file://${__filename.replaceAll('\\', '/')}`), 'utf8');
const pagination = { innerHTML: '', hidden: true, querySelectorAll: () => [] };
const elements = {
  boardPagination: pagination,
  boardStatus: { textContent: '' },
  boardSearchForm: { addEventListener() {} },
  boardSearchCategory: { value: '', addEventListener() {} },
  boardSearchScope: { value: 'all', addEventListener() {} },
  boardQuery: { value: '', addEventListener() {} },
  boardSkeleton: { hidden: true },
  postRows: { setAttribute() {}, removeAttribute() {} },
  postListTitle: { innerHTML: '' },
};
const document = {
  getElementById: id => elements[id] || null,
  querySelectorAll: () => [],
  querySelector: () => ({ addEventListener() {} }),
};
const sourceForPagination = source.replace('  loadPosts();', '  // isolated pagination test');
vm.runInNewContext(sourceForPagination, {
  document,
  pagination,
  location: { search: '' },
  window: { location: { search: '' } },
  URLSearchParams,
  sessionStorage: { getItem: () => null },
  localStorage: { getItem: () => null },
  fetch: () => new Promise(() => {}),
});
const functionStart = sourceForPagination.indexOf('  function renderPagination(');
const functionEnd = sourceForPagination.indexOf('\n  async function loadPosts()', functionStart);
const paginationFunction = sourceForPagination.slice(functionStart, functionEnd);
vm.runInNewContext(`${paginationFunction}\nrenderPagination(50, 1000000, 20);`, {
  document,
  pagination,
  location: { search: '' },
  window: { location: { search: '' } },
  URLSearchParams,
  sessionStorage: { getItem: () => null },
  localStorage: { getItem: () => null },
  fetch: () => new Promise(() => {}),
});
const pageButtons = (pagination.innerHTML.match(/class="page-number/g) || []).length;
if (pageButtons > 7) throw new Error(`Too many numbered page buttons: ${pageButtons}`);
if (!pagination.innerHTML.includes('…')) throw new Error('Expected pagination ellipses for a large result set.');
if (!pagination.innerHTML.includes('data-page="1"') || !pagination.innerHTML.includes('data-page="50000"')) {
  throw new Error('Expected first and last page shortcuts.');
}
console.log(`PASS: one-million-item pagination has ${pageButtons} numbered buttons and ellipses.`);