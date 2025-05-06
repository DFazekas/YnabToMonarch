export class Logger {
  constructor(container) { this.container = container; }
  clear() { this.container.innerHTML = ''; }
  log(message) { append(this.container, message, 'info'); }
  error(message) { append(this.container, message, 'error'); }
}

function append(container, text, level) {
  const div = document.createElement('div');
  div.textContent = text;
  div.classList.add(level === 'error' ? 'log-error' : 'log-info');
  container.appendChild(div);
}
