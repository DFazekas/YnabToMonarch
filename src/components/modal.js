export function openModal(id) {
  const modal = document.getElementById(id);
  const content = modal.querySelector('.relative');

  modal.classList.remove('pointer-events-none', 'opacity-0');
  modal.classList.add('pointer-events-auto', 'opacity-100');

  requestAnimationFrame(() => {
    content.classList.remove('translate-y-full');
    content.classList.add('translate-y-0');
  });
}

export function closeModal(id) {
  const modal = document.getElementById(id);
  const content = modal.querySelector('.relative');

  content.classList.remove('translate-y-0');
  content.classList.add('translate-y-full');

  // Wait for slide animation before hiding completely
  setTimeout(() => {
    modal.classList.add('pointer-events-none', 'opacity-0');
    modal.classList.remove('pointer-events-auto', 'opacity-100');
  }, 500); // matches duration-500 above
}
