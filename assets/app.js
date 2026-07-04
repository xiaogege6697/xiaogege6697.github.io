(function () {
  'use strict';
  const data = window.__PORTFOLIO_V2__;
  if (!data) return;

  const state = { category: 'all', query: '', sort: 'updated' };
  const grid = document.querySelector('#project-grid');
  const filters = document.querySelector('#filters');
  const empty = document.querySelector('#empty');
  const dialog = document.querySelector('#project-dialog');
  const categoryLabel = Object.fromEntries(data.categories.map(c => [c.id, c.label]));
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const date = iso => new Intl.DateTimeFormat('zh-CN', { year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date(iso));

  document.querySelector('#repo-count').textContent = data.repos.length;
  document.querySelector('#year').textContent = new Date().getFullYear();

  filters.innerHTML = [{id:'all', label:'全部', count:data.repos.length}, ...data.categories].map((c, i) =>
    `<button data-category="${c.id}" aria-pressed="${i === 0}">${c.label}<sup>${c.count}</sup></button>`).join('');

  function visibleRepos() {
    const query = state.query.toLowerCase().trim();
    return data.repos.filter(repo => {
      const text = [repo.name, repo.description, repo.language, ...(repo.topics || [])].join(' ').toLowerCase();
      return (state.category === 'all' || repo.category === state.category) && (!query || text.includes(query));
    }).sort((a, b) => state.sort === 'name' ? a.name.localeCompare(b.name) : state.sort === 'stars' ? b.stars - a.stars : b.updatedAt.localeCompare(a.updatedAt));
  }

  function render() {
    const repos = visibleRepos();
    empty.hidden = repos.length > 0;
    grid.innerHTML = repos.map((repo, index) => `
      <article class="project-card project-card--${esc(repo.category)}" style="--index:${index}" tabindex="0" data-repo="${esc(repo.name)}">
        <div class="project-card__top"><span>${esc(categoryLabel[repo.category] || '实验')}</span><small>${String(index + 1).padStart(2, '0')}</small></div>
        <h3>${esc(repo.name)}</h3>
        <p>${esc(repo.description || '一个仍在生长的开源实验。')}</p>
        <div class="project-card__tags">${[repo.language, ...(repo.topics || []).slice(0, 2)].filter(Boolean).map(t => `<span>${esc(t)}</span>`).join('')}</div>
        <div class="project-card__foot"><span>★ ${repo.stars}</span><span>${date(repo.updatedAt)}</span><b>展开 ↗</b></div>
      </article>`).join('');
  }

  function openProject(name) {
    const repo = data.repos.find(item => item.name === name);
    if (!repo) return;
    document.querySelector('#dialog-content').innerHTML = `
      <p class="dialog-kicker">${esc(categoryLabel[repo.category])} / OPEN SOURCE</p>
      <h2>${esc(repo.name)}</h2><p class="dialog-desc">${esc(repo.description || '持续建设中。')}</p>
      <dl><div><dt>主要技术</dt><dd>${esc(repo.language || 'Documentation')}</dd></div><div><dt>最近更新</dt><dd>${date(repo.updatedAt)}</dd></div><div><dt>GitHub Stars</dt><dd>${repo.stars}</dd></div></dl>
      <a class="dialog-link" href="${esc(repo.url)}" target="_blank" rel="noopener">打开 GitHub 仓库 <span>↗</span></a>`;
    dialog.showModal();
  }

  filters.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button) return;
    state.category = button.dataset.category;
    filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', item === button)); render();
  });
  document.querySelector('#search').addEventListener('input', event => { state.query = event.target.value; render(); });
  document.querySelector('#sort').addEventListener('change', event => { state.sort = event.target.value; render(); });
  grid.addEventListener('click', event => { const card = event.target.closest('.project-card'); if (card) openProject(card.dataset.repo); });
  grid.addEventListener('keydown', event => { if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.project-card')) { event.preventDefault(); openProject(event.target.dataset.repo); } });
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  window.addEventListener('pointermove', event => { document.documentElement.style.setProperty('--mx', event.clientX + 'px'); document.documentElement.style.setProperty('--my', event.clientY + 'px'); });
  render();
})();
