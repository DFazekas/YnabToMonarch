export class Logger {
  constructor(container) {
    this.container = container
    this.logs = []
  }

  add(message) {
    this.logs.push({ type: 'success', message })
    this.displayLogs()
  }

  addError(message) {
    this.logs.push({ type: 'error', message })
    this.displayLogs()
  }

  merge(otherLogs) {
    this.logs.push(...otherLogs)
    this.displayLogs()
  }

  clear() {
    this.logs = []
    this.displayLogs()
  }

  displayLogs() {
    this.container.innerHTML = ''
    this.logs.forEach(log => {
      const logElement = document.createElement('div')
      logElement.textContent = log.type === 'error' ? `❌ ${log.message}` : `✅ ${log.message}`;
      logElement.style.marginBottom = '8px'
      logElement.style.color = log.type === 'error' ? '#d9534f' : '#5cb85c'
      this.container.appendChild(logElement)
    })

    document.getElementById('logsSection').hidden = this.logs.length === 0;
  }
}
