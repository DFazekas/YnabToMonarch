/**
 * Simple Reactive State System
 * Similar to React useState but for vanilla JS
 * Automatically triggers re-renders when state changes
 */

class Signal {
  constructor(initialValue) {
    this._value = initialValue;
    this._subscribers = new Set();
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._notify();
    }
  }

  subscribe(callback) {
    this._subscribers.add(callback);
    return () => this._subscribers.delete(callback);
  }

  _notify() {
    this._subscribers.forEach(callback => {
      try {
        callback(this._value);
      } catch (error) {
        console.error('Signal callback error:', error);
      }
    });
  }
}

/**
 * Create a reactive signal
 * @param {*} initialValue 
 * @returns {Signal}
 */
export function signal(initialValue) {
  return new Signal(initialValue);
}

/**
 * Create a computed signal that derives from other signals
 * @param {Function} compute - Function that computes the value
 * @returns {Signal}
 */
export function computed(compute) {
  const result = new Signal(compute());
  
  // Re-compute when dependencies change
  // Note: This is a simplified version. For production, you'd want automatic dependency tracking
  const update = () => {
    result.value = compute();
  };
  
  return { ...result, update };
}

/**
 * Effect that runs when signals change
 * @param {Function} fn - Effect function
 */
export function effect(fn) {
  fn();
}

/**
 * Bind element properties to signals
 * @param {HTMLElement} element 
 * @param {Object} bindings - { property: signal }
 */
export function bind(element, bindings) {
  const unsubscribers = [];

  Object.entries(bindings).forEach(([prop, signal]) => {
    // Initial set
    if (prop === 'textContent' || prop === 'innerHTML') {
      element[prop] = signal.value;
    } else if (prop.startsWith('class:')) {
      const className = prop.slice(6);
      element.classList.toggle(className, signal.value);
    } else if (prop.startsWith('attr:')) {
      const attrName = prop.slice(5);
      if (signal.value) {
        element.setAttribute(attrName, signal.value);
      } else {
        element.removeAttribute(attrName);
      }
    } else {
      element[prop] = signal.value;
    }

    // Subscribe to changes
    const unsub = signal.subscribe((value) => {
      if (prop === 'textContent' || prop === 'innerHTML') {
        element[prop] = value;
      } else if (prop.startsWith('class:')) {
        const className = prop.slice(6);
        element.classList.toggle(className, value);
      } else if (prop.startsWith('attr:')) {
        const attrName = prop.slice(5);
        if (value) {
          element.setAttribute(attrName, value);
        } else {
          element.removeAttribute(attrName);
        }
      } else {
        element[prop] = value;
      }
    });

    unsubscribers.push(unsub);
  });

  // Return cleanup function
  return () => unsubscribers.forEach(unsub => unsub());
}

/**
 * Create a reactive component
 * @param {Function} render - Render function that returns HTML string
 * @param {Object} signals - Reactive signals to watch
 */
export function reactiveComponent(render, signals = {}) {
  let container = null;
  
  const update = () => {
    if (container) {
      container.innerHTML = render();
    }
  };

  // Subscribe to all signals
  Object.values(signals).forEach(sig => {
    if (sig instanceof Signal) {
      sig.subscribe(update);
    }
  });

  return {
    mount(element) {
      container = element;
      update();
    },
    update,
    destroy() {
      container = null;
    }
  };
}
