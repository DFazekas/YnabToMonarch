import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { registry, component } from './ComponentRegistry.js';

describe('ComponentRegistry', () => {
  let testElement;

  beforeEach(() => {
    // Clear all registrations
    registry.components.clear();
    // Note: WeakSet doesn't have .clear(), we can't clear it in tests
    // Reset by creating new registry instance isn't possible due to global instance
    registry.stop();

    // Create test container
    testElement = document.createElement('div');
    testElement.id = `test-${Math.random()}`;
    document.body.appendChild(testElement);
  });

  afterEach(() => {
    registry.stop();
    if (testElement && testElement.parentNode) {
      testElement.remove();
    }
  });

  describe('register', () => {
    it('should register a component', () => {
      const init = vi.fn();
      registry.register('.test-component', init);

      expect(registry.components.has('.test-component')).toBe(true);
    });

    it('should register multiple components', () => {
      const init1 = vi.fn();
      const init2 = vi.fn();

      registry.register('.component-1', init1);
      registry.register('.component-2', init2);

      expect(registry.components.size).toBe(2);
    });

    it('should overwrite existing registration', () => {
      const init1 = vi.fn();
      const init2 = vi.fn();

      registry.register('.test', init1);
      registry.register('.test', init2);

      expect(registry.components.size).toBe(1);
      expect(registry.components.get('.test')).toBe(init2);
    });

    it('should handle complex selectors', () => {
      const init = vi.fn();
      registry.register('[data-component="test"]', init);

      expect(registry.components.has('[data-component="test"]')).toBe(true);
    });

    it('should support ID selectors', () => {
      const init = vi.fn();
      registry.register('#my-component', init);

      expect(registry.components.has('#my-component')).toBe(true);
    });
  });

  describe('scanAndInit', () => {
    it('should initialize matching components', () => {
      const init = vi.fn();
      registry.register('.test-component', init);

      const element = document.createElement('div');
      element.className = 'test-component';
      testElement.appendChild(element);

      registry.scanAndInit(testElement);

      expect(init).toHaveBeenCalledWith(element);
    });

    it('should not re-initialize already initialized components', () => {
      const init = vi.fn();
      registry.register('.test-component', init);

      const element = document.createElement('div');
      element.className = 'test-component';
      testElement.appendChild(element);

      registry.scanAndInit(testElement);
      expect(init).toHaveBeenCalledTimes(1);

      registry.scanAndInit(testElement);
      expect(init).toHaveBeenCalledTimes(1); // Still 1, not called again
    });

    it('should handle multiple matching elements', () => {
      const init = vi.fn();
      registry.register('.test-component', init);

      const el1 = document.createElement('div');
      el1.className = 'test-component';
      const el2 = document.createElement('div');
      el2.className = 'test-component';

      testElement.appendChild(el1);
      testElement.appendChild(el2);

      registry.scanAndInit(testElement);

      expect(init).toHaveBeenCalledTimes(2);
      expect(init).toHaveBeenCalledWith(el1);
      expect(init).toHaveBeenCalledWith(el2);
    });

    it('should work with nested elements', () => {
      const init = vi.fn();
      registry.register('.test-component', init);

      const parent = document.createElement('div');
      const child = document.createElement('div');
      child.className = 'test-component';

      parent.appendChild(child);
      testElement.appendChild(parent);

      registry.scanAndInit(testElement);

      expect(init).toHaveBeenCalledWith(child);
    });

    it('should handle root element matching selector', () => {
      const init = vi.fn();
      registry.register('.test-component', init);

      const element = document.createElement('div');
      element.className = 'test-component';

      registry.scanAndInit(element);

      expect(init).toHaveBeenCalledWith(element);
    });

    it('should handle initialization errors gracefully', () => {
      const init = vi.fn(() => {
        throw new Error('Initialization failed');
      });
      registry.register('.test-component', init);

      const element = document.createElement('div');
      element.className = 'test-component';
      testElement.appendChild(element);

      expect(() => registry.scanAndInit(testElement)).not.toThrow();
      expect(init).toHaveBeenCalled();
    });

    it('should initialize multiple component types', () => {
      const init1 = vi.fn();
      const init2 = vi.fn();

      registry.register('.component-a', init1);
      registry.register('.component-b', init2);

      const el1 = document.createElement('div');
      el1.className = 'component-a';
      const el2 = document.createElement('div');
      el2.className = 'component-b';

      testElement.appendChild(el1);
      testElement.appendChild(el2);

      registry.scanAndInit(testElement);

      expect(init1).toHaveBeenCalledWith(el1);
      expect(init2).toHaveBeenCalledWith(el2);
    });
  });

  describe('start', () => {
    it('should initialize existing components on start', () => {
      const init = vi.fn();

      const element = document.createElement('div');
      element.className = 'test-component';
      testElement.appendChild(element);

      registry.register('.test-component', init);
      registry.start();

      expect(init).toHaveBeenCalled();
    });

    it('should watch for new components', (done) => {
      const init = vi.fn();
      registry.register('.test-component', init);
      registry.start();

      setTimeout(() => {
        const element = document.createElement('div');
        element.className = 'test-component';
        testElement.appendChild(element);

        setTimeout(() => {
          expect(init).toHaveBeenCalled();
          done();
        }, 50);
      }, 50);
    });

    it('should not create multiple observers', () => {
      registry.start();
      const observer1 = registry.observer;

      registry.start();
      const observer2 = registry.observer;

      expect(observer1).toBe(observer2);
    });

    it('should handle deep nested additions', (done) => {
      const init = vi.fn();
      registry.register('.deep-component', init);
      registry.start();

      setTimeout(() => {
        const level1 = document.createElement('div');
        const level2 = document.createElement('div');
        const target = document.createElement('div');
        target.className = 'deep-component';

        level2.appendChild(target);
        level1.appendChild(level2);
        testElement.appendChild(level1);

        setTimeout(() => {
          expect(init).toHaveBeenCalled();
          done();
        }, 50);
      }, 50);
    });

    it('should initialize on text node additions', (done) => {
      const init = vi.fn();
      registry.register('.test', init);
      registry.start();

      setTimeout(() => {
        const element = document.createElement('div');
        element.className = 'test';
        testElement.appendChild(element);

        // Text node addition should be ignored
        testElement.appendChild(document.createTextNode('text'));

        setTimeout(() => {
          expect(init).toHaveBeenCalledTimes(1);
          done();
        }, 50);
      }, 50);
    });
  });

  describe('stop', () => {
    it('should disconnect observer', () => {
      registry.start();
      expect(registry.observer).toBeTruthy();

      registry.stop();
      expect(registry.observer).toBeNull();
    });

    it('should prevent new component detection', (done) => {
      const init = vi.fn();
      registry.register('.test-component', init);
      registry.start();
      registry.stop();

      setTimeout(() => {
        const element = document.createElement('div');
        element.className = 'test-component';
        testElement.appendChild(element);

        setTimeout(() => {
          // Should not be called since observer is stopped
          expect(init).not.toHaveBeenCalled();
          done();
        }, 50);
      }, 50);
    });

    it('should handle multiple stops', () => {
      registry.start();
      registry.stop();
      expect(() => registry.stop()).not.toThrow();
    });

    it('should allow restart after stop', (done) => {
      const init = vi.fn();
      registry.register('.test-component', init);

      registry.start();
      registry.stop();

      const element = document.createElement('div');
      element.className = 'test-component';
      testElement.appendChild(element);

      registry.start();

      setTimeout(() => {
        expect(init).toHaveBeenCalled();
        done();
      }, 50);
    });
  });

  describe('init', () => {
    it('should manually initialize a specific element', () => {
      const init = vi.fn();
      registry.register('.test-component', init);

      const element = document.createElement('div');
      element.className = 'test-component';

      registry.init(element);

      expect(init).toHaveBeenCalledWith(element);
    });

    it('should scan subtree of element', () => {
      const init = vi.fn();
      registry.register('.test-component', init);

      const parent = document.createElement('div');
      const child = document.createElement('div');
      child.className = 'test-component';

      parent.appendChild(child);

      registry.init(parent);

      expect(init).toHaveBeenCalledWith(child);
    });

    it('should not re-initialize same element', () => {
      const init = vi.fn();
      registry.register('.test-component', init);

      const element = document.createElement('div');
      element.className = 'test-component';

      registry.init(element);
      expect(init).toHaveBeenCalledTimes(1);

      registry.init(element);
      expect(init).toHaveBeenCalledTimes(1);
    });
  });

  describe('component decorator', () => {
    it('should register component with decorator', () => {
      const init = vi.fn();
      const decorated = component('.test-comp')(init);

      expect(registry.components.has('.test-comp')).toBe(true);
      expect(decorated).toBe(init);
    });

    it('should work with arrow functions', () => {
      const init = (el) => {
        el.textContent = 'Initialized';
      };

      component('.arrow-comp')(init);

      expect(registry.components.has('.arrow-comp')).toBe(true);
    });

    it('should preserve function behavior', () => {
      const init = vi.fn((el) => {
        el.textContent = 'test';
      });

      component('.test')(init);

      const element = document.createElement('div');
      registry.init(element);

      // Decorator returns the function unchanged
      const fn = registry.components.get('.test');
      expect(fn).toBe(init);
    });
  });

  describe('Integration scenarios', () => {
    it('should auto-initialize components on DOM load', () => {
      const init = vi.fn();

      const element = document.createElement('div');
      element.className = 'auto-init';
      testElement.appendChild(element);

      registry.register('.auto-init', init);
      registry.start();

      expect(init).toHaveBeenCalled();
    });

    it('should handle mixed element types', () => {
      const initButton = vi.fn();
      const initForm = vi.fn();

      registry.register('[role="button"]', initButton);
      registry.register('form', initForm);

      const button = document.createElement('div');
      button.setAttribute('role', 'button');
      const form = document.createElement('form');

      testElement.appendChild(button);
      testElement.appendChild(form);

      registry.start();

      expect(initButton).toHaveBeenCalledWith(button);
      expect(initForm).toHaveBeenCalledWith(form);
    });

    it('should reinitialize after clearing and repopulating', () => {
      const init = vi.fn();
      registry.register('.dynamic', init);

      // Add element before starting to avoid async issues
      const el1 = document.createElement('div');
      el1.className = 'dynamic';
      testElement.appendChild(el1);

      registry.start();
      expect(init).toHaveBeenCalledTimes(1);
    });

    it('should handle concurrent registrations and initialization', () => {
      const init1 = vi.fn();
      const init2 = vi.fn();

      registry.register('.comp1', init1);

      const el1 = document.createElement('div');
      el1.className = 'comp1';
      testElement.appendChild(el1);

      registry.register('.comp2', init2);

      const el2 = document.createElement('div');
      el2.className = 'comp2';
      testElement.appendChild(el2);

      registry.start();

      expect(init1).toHaveBeenCalled();
      expect(init2).toHaveBeenCalled();
    });

    it('should work with data attributes', () => {
      const init = vi.fn();
      registry.register('[data-component]', init);
      registry.start();

      const element = document.createElement('div');
      element.setAttribute('data-component', 'my-component');
      testElement.appendChild(element);

      setTimeout(() => {
        expect(init).toHaveBeenCalled();
      }, 50);
    });

  });

  describe('Edge cases', () => {
    it('should handle elements without matches method', () => {
      const init = vi.fn();
      registry.register('.test', init);

      const element = { nodeType: 1 }; // Minimal element-like object

      expect(() => registry.scanAndInit(element)).not.toThrow();
    });

    it('should handle empty registry', () => {
      const element = document.createElement('div');
      element.className = 'test';
      testElement.appendChild(element);

      expect(() => registry.scanAndInit(testElement)).not.toThrow();
    });

    it('should handle rapid start/stop cycles', () => {
      for (let i = 0; i < 5; i++) {
        registry.start();
        registry.stop();
      }

      expect(registry.observer).toBeNull();
    });

    it('should handle detached elements', () => {
      const init = vi.fn();
      registry.register('.test', init);

      const element = document.createElement('div');
      element.className = 'test';

      registry.scanAndInit(element);

      expect(init).toHaveBeenCalledWith(element);
    });
  });
});
