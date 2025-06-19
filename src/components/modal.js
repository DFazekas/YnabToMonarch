/**
 * Opens a modal dialog by ID with a smooth slide-up animation.
 * 
 * Expects the modal to have `pointer-events-none opacity-0` when hidden,
 * and the inner `.relative` element to be initially translated off-screen (`translate-y-full`).
 *
 * Example HTML structure:
 * ```html
 * <div id="myModal" class="modal pointer-events-none opacity-0 transition-opacity duration-500">
 *   <div class="relative transform translate-y-full transition-transform duration-500">
 *     <!-- modal content -->
 *   </div>
 * </div>
 * ```
 *
 * @param {string} id - The DOM ID of the modal element to show.
 */
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

/**
 * Closes a modal dialog by ID with a smooth slide-down animation.
 * 
 * After the transition, the modal is hidden via `opacity-0` and `pointer-events-none`.
 * The inner content slides back down using `translate-y-full`.
 *
 * The animation duration must match the timeout value (default 500ms).
 *
 * @param {string} id - The DOM ID of the modal element to hide.
 */
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
