/**
 * Toggles button styling based on active state.
 * @param {HTMLElement} button
 * @param {boolean} isActive
 */
export function toggleButtonActive(button, isActive) {
  const activeClasses = ['bg-blue-500', 'text-white'];
  const inactiveClasses = ['bg-transparent', 'text-gray-700', 'hover:bg-blue-100'];

  if (isActive) {
    button.classList.add(...activeClasses);
    button.classList.remove(...inactiveClasses);
  } else {
    button.classList.remove(...activeClasses);
    button.classList.add(...inactiveClasses);
  }
}

/**
 * Toggles visibility using `hidden` and `active` classes with transition support.
 * @param {HTMLElement} el - The element to show or hide
 * @param {boolean} show - Whether to show or hide the element
 */
export function toggleElementVisible(el, show) {
  if (show) {
    el.classList.remove('hidden');
    requestAnimationFrame(() => el.classList.add('active'));
  } else {
    el.classList.remove('active');
    setTimeout(() => el.classList.add('hidden'), 300); // Match transition duration
  }
}

/**
 * Toggles the disabled state of an element and adjusts `cursor` and `opacity` classes accordingly.
 * @param {HTMLElement} el - The element to modify
 * @param {boolean} disabled - Whether the element should be disabled
 */
export function toggleDisabled(el, disabled) {
  el.disabled = disabled;
  el.classList.toggle('cursor-default', disabled);
  el.classList.toggle('cursor-pointer', !disabled);
  el.classList.toggle('opacity-50', disabled);
}

/**
 * Toggles visibility.
 * @param {HTMLElement} el - The element to show or hide
 * @param {boolean} show - Whether to show or hide the element
 */
export function toggleElementVisibility(el, show) {
  if (show) {
    el.classList.remove('hidden');
    el.removeAttribute('aria-hidden');
    el.removeAttribute('hidden');
  } else {
    el.classList.add('hidden');
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('hidden', 'true');
  }
}
