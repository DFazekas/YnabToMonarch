export function bind(selector, event, handler) {
  const el = document.querySelector(selector);
  if (!el) {
    console.warn(`bind: No element found for selector: ${selector}`);
    return;
  }
  el.addEventListener(event, handler);
}
