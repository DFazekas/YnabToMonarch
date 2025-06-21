export function updateBulkActionBar(barId, count) {
  const bar = document.getElementById(barId);
  if (!bar) return;
  const countEl = bar.querySelector('#selectedCount');
  if (countEl) countEl.textContent = count;
  bar.classList.toggle('active', count > 0);
}
