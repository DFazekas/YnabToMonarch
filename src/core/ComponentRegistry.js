/**
 * Component Registry & Auto-Initialization System
 * Automatically detects and initializes components when they're added to the DOM
 * No manual initialization needed - works like React but with vanilla JS
 */

class ComponentRegistry {
  constructor() {
    this.components = new Map();
    this.initialized = new WeakSet();
    this.observer = null;
  }

  /**
   * Register a component initializer
   * @param {string} selector - CSS selector to match elements
   * @param {Function} init - Initialization function(element)
   */
  register(selector, init) {
    this.components.set(selector, init);
  }

  /**
   * Start watching the DOM for components
   */
  start() {
    if (this.observer) return;

    // Initialize existing components
    this.scanAndInit(document.body);

    // Watch for new components
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.scanAndInit(node);
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Stop watching the DOM
   */
  stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /**
   * Scan an element and initialize matching components
   */
  scanAndInit(root) {
    this.components.forEach((init, selector) => {
      const elements = root.matches?.(selector) 
        ? [root] 
        : Array.from(root.querySelectorAll?.(selector) || []);

      elements.forEach(element => {
        if (!this.initialized.has(element)) {
          try {
            init(element);
            this.initialized.add(element);
          } catch (error) {
            console.error(`Failed to initialize component ${selector}:`, error);
          }
        }
      });
    });
  }

  /**
   * Manually initialize a specific element
   */
  init(element) {
    this.scanAndInit(element);
  }
}

// Global registry instance
export const registry = new ComponentRegistry();

// Auto-start on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => registry.start());
} else {
  registry.start();
}

// Component decorator for cleaner registration
export function component(selector) {
  return function(init) {
    registry.register(selector, init);
    return init;
  };
}
