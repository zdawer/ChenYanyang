(() => {
 const section = document.querySelector('#research');
 if (!section) return;
 const filters = section.querySelector('.research-filters');
 const entries = [...section.querySelectorAll('.publication-grid > .publication-entry')];
 if (!filters || !entries.length) return;
 filters.hidden = false;
 filters.addEventListener('click', event => {
  const button = event.target.closest('button[data-filter]');
  if (!button) return;
  filters.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  let visible = 0;
  entries.forEach(entry => {
   const accepted = /published|accepted/i.test(entry.querySelector('.publication-status')?.textContent || '');
   entry.hidden = button.dataset.filter !== 'all' && (button.dataset.filter === 'published' ? !accepted : accepted);
   if (!entry.hidden) visible++;
  });
  section.querySelector('.filter-count').textContent = `${visible} research works shown`;
 });
})();
