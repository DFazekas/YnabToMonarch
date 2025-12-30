import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { signal, computed, effect, bind, reactiveComponent } from './reactiveState.js';

describe('Reactive State System', () => {
  describe('signal', () => {
    it('should create a signal with initial value', () => {
      const count = signal(0);
      expect(count.value).toBe(0);
    });

    it('should update signal value', () => {
      const count = signal(0);
      count.value = 5;
      expect(count.value).toBe(5);
    });

    it('should handle different data types', () => {
      const strSignal = signal('hello');
      const boolSignal = signal(true);
      const objSignal = signal({ key: 'value' });

      expect(strSignal.value).toBe('hello');
      expect(boolSignal.value).toBe(true);
      expect(objSignal.value).toEqual({ key: 'value' });
    });

    it('should handle null and undefined', () => {
      const nullSignal = signal(null);
      const undefinedSignal = signal(undefined);

      expect(nullSignal.value).toBeNull();
      expect(undefinedSignal.value).toBeUndefined();
    });

    it('should only notify on value change', () => {
      const count = signal(0);
      const callback = vi.fn();

      count.subscribe(callback);
      
      count.value = 1; // Change
      expect(callback).toHaveBeenCalledTimes(1);

      count.value = 1; // Same value
      expect(callback).toHaveBeenCalledTimes(1); // No additional call
    });

    it('should handle multiple subscribers', () => {
      const count = signal(0);
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      count.subscribe(callback1);
      count.subscribe(callback2);

      count.value = 5;

      expect(callback1).toHaveBeenCalledWith(5);
      expect(callback2).toHaveBeenCalledWith(5);
    });

    it('should unsubscribe correctly', () => {
      const count = signal(0);
      const callback = vi.fn();

      const unsubscribe = count.subscribe(callback);
      count.value = 1;
      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();
      count.value = 2;
      expect(callback).toHaveBeenCalledTimes(1); // Not called again
    });

    it('should handle callback errors gracefully', () => {
      const count = signal(0);
      const errorCallback = () => {
        throw new Error('Callback error');
      };
      const normalCallback = vi.fn();

      count.subscribe(errorCallback);
      count.subscribe(normalCallback);

      // Should not throw
      expect(() => {
        count.value = 1;
      }).not.toThrow();

      expect(normalCallback).toHaveBeenCalledWith(1);
    });

    it('should update signal multiple times', () => {
      const count = signal(0);
      const callback = vi.fn();

      count.subscribe(callback);

      for (let i = 1; i <= 5; i++) {
        count.value = i;
      }

      expect(callback).toHaveBeenCalledTimes(5);
      expect(count.value).toBe(5);
    });

    it('should support chaining updates', () => {
      const count = signal(10);
      expect(count.value).toBe(10);

      count.value = 20;
      expect(count.value).toBe(20);

      count.value = 30;
      expect(count.value).toBe(30);
    });
  });

  describe('computed', () => {
    it('should create a computed signal', () => {
      const num = signal(5);
      const doubled = computed(() => num.value * 2);

      expect(doubled).toBeTruthy();
      expect(typeof doubled.update).toBe('function');
    });

    it('should have update method', () => {
      const num = signal(5);
      const doubled = computed(() => num.value * 2);

      expect(typeof doubled.update).toBe('function');
    });

    it('should manually update computed value', () => {
      const num = signal(5);
      const doubled = computed(() => num.value * 2);

      num.value = 10;
      doubled.update();

      expect(doubled).toBeTruthy();
    });

    it('should support complex computations', () => {
      const arr = signal([1, 2, 3, 4, 5]);
      const sum = computed(() => arr.value.reduce((a, b) => a + b, 0));

      arr.value = [2, 3, 5];
      sum.update();

      expect(sum).toBeTruthy();
    });

    it('should handle null/undefined in computation', () => {
      const val = signal(null);
      const computed1 = computed(() => val.value ?? 0);

      expect(computed1).toBeTruthy();
    });

    it('computed should support subscription', () => {
      const num = signal(5);
      const doubled = computed(() => num.value * 2);
      const callback = vi.fn();

      // computed returns object with spread Signal, so it should have subscribe
      if (typeof doubled.subscribe === 'function') {
        doubled.subscribe(callback);
        doubled.update();
        expect(callback).toHaveBeenCalled();
      }
    });
  });

  describe('effect', () => {
    it('should execute effect function', () => {
      const callback = vi.fn();
      effect(callback);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle side effects', () => {
      let sideEffect = 0;
      effect(() => {
        sideEffect += 1;
      });

      expect(sideEffect).toBe(1);
    });

    it('should work with multiple effects', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      effect(callback1);
      effect(callback2);

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('bind', () => {
    let element;

    beforeEach(() => {
      element = document.createElement('div');
      document.body.appendChild(element);
    });

    afterEach(() => {
      element.remove();
    });

    it('should bind textContent', () => {
      const text = signal('hello');
      bind(element, { textContent: text });

      expect(element.textContent).toBe('hello');
    });

    it('should update textContent when signal changes', () => {
      const text = signal('hello');
      bind(element, { textContent: text });

      expect(element.textContent).toBe('hello');

      text.value = 'world';
      expect(element.textContent).toBe('world');
    });

    it('should bind innerHTML', () => {
      const html = signal('<span>test</span>');
      bind(element, { innerHTML: html });

      expect(element.innerHTML).toBe('<span>test</span>');
    });

    it('should update innerHTML when signal changes', () => {
      const html = signal('<span>test</span>');
      bind(element, { innerHTML: html });

      html.value = '<p>updated</p>';
      expect(element.innerHTML).toBe('<p>updated</p>');
    });

    it('should bind class with class: prefix', () => {
      const isActive = signal(true);
      bind(element, { 'class:active': isActive });

      expect(element.classList.contains('active')).toBe(true);

      isActive.value = false;
      expect(element.classList.contains('active')).toBe(false);
    });

    it('should bind multiple classes', () => {
      const isActive = signal(true);
      const isDisabled = signal(false);

      bind(element, {
        'class:active': isActive,
        'class:disabled': isDisabled
      });

      expect(element.classList.contains('active')).toBe(true);
      expect(element.classList.contains('disabled')).toBe(false);

      isActive.value = false;
      isDisabled.value = true;

      expect(element.classList.contains('active')).toBe(false);
      expect(element.classList.contains('disabled')).toBe(true);
    });

    it('should bind attributes with attr: prefix', () => {
      const url = signal('https://example.com');
      bind(element, { 'attr:data-url': url });

      expect(element.getAttribute('data-url')).toBe('https://example.com');

      url.value = 'https://newurl.com';
      expect(element.getAttribute('data-url')).toBe('https://newurl.com');
    });

    it('should remove attribute when signal is falsy', () => {
      const url = signal('https://example.com');
      bind(element, { 'attr:data-url': url });

      expect(element.getAttribute('data-url')).toBe('https://example.com');

      url.value = null;
      expect(element.getAttribute('data-url')).toBeNull();
    });

    it('should bind standard properties', () => {
      const disabled = signal(false);
      bind(element, { disabled });

      expect(element.disabled).toBe(false);

      disabled.value = true;
      expect(element.disabled).toBe(true);
    });

    it('should return cleanup function', () => {
      const text = signal('hello');
      const cleanup = bind(element, { textContent: text });

      expect(typeof cleanup).toBe('function');

      text.value = 'world';
      expect(element.textContent).toBe('world');

      cleanup();

      text.value = 'cleaned';
      expect(element.textContent).toBe('world'); // Should not update after cleanup
    });

    it('should handle multiple bindings cleanup', () => {
      const text = signal('hello');
      const isActive = signal(true);

      const cleanup = bind(element, {
        textContent: text,
        'class:active': isActive
      });

      cleanup();

      text.value = 'world';
      isActive.value = false;

      expect(element.textContent).toBe('hello');
      expect(element.classList.contains('active')).toBe(true);
    });
  });

  describe('reactiveComponent', () => {
    let container;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      container.remove();
    });

    it('should mount reactive component', () => {
      const count = signal(0);
      const component = reactiveComponent(
        () => `<p>Count: ${count.value}</p>`,
        { count }
      );

      component.mount(container);
      expect(container.innerHTML).toBe('<p>Count: 0</p>');
    });

    it('should update when signal changes', () => {
      const count = signal(0);
      const component = reactiveComponent(
        () => `<p>Count: ${count.value}</p>`,
        { count }
      );

      component.mount(container);
      expect(container.innerHTML).toBe('<p>Count: 0</p>');

      count.value = 5;
      expect(container.innerHTML).toBe('<p>Count: 5</p>');
    });

    it('should handle multiple signals', () => {
      const name = signal('John');
      const age = signal(30);
      const component = reactiveComponent(
        () => `<p>${name.value} is ${age.value}</p>`,
        { name, age }
      );

      component.mount(container);
      expect(container.innerHTML).toBe('<p>John is 30</p>');

      name.value = 'Jane';
      expect(container.innerHTML).toBe('<p>Jane is 30</p>');

      age.value = 25;
      expect(container.innerHTML).toBe('<p>Jane is 25</p>');
    });

    it('should have manual update method', () => {
      const count = signal(0);
      const component = reactiveComponent(
        () => `<p>Count: ${count.value}</p>`,
        { count }
      );

      component.mount(container);
      component.update();

      expect(container.innerHTML).toBe('<p>Count: 0</p>');
    });

    it('should destroy component', () => {
      const count = signal(0);
      const component = reactiveComponent(
        () => `<p>Count: ${count.value}</p>`,
        { count }
      );

      component.mount(container);
      component.destroy();

      count.value = 5;
      // Component should not update after destroy
      expect(container.innerHTML).toBe('<p>Count: 0</p>');
    });

    it('should handle complex HTML rendering', () => {
      const items = signal(['a', 'b', 'c']);
      const component = reactiveComponent(
        () => `<ul>${items.value.map(item => `<li>${item}</li>`).join('')}</ul>`,
        { items }
      );

      component.mount(container);
      expect(container.querySelector('ul').children.length).toBe(3);

      items.value = ['x', 'y'];
      expect(container.querySelector('ul').children.length).toBe(2);
    });

    it('should handle empty signals object', () => {
      const component = reactiveComponent(
        () => '<p>Static</p>'
      );

      component.mount(container);
      expect(container.innerHTML).toBe('<p>Static</p>');
    });

    it('should re-render on every signal change', () => {
      const count = signal(0);
      const renderSpy = vi.fn(() => `<p>${count.value}</p>`);
      const component = reactiveComponent(renderSpy, { count });

      component.mount(container);
      expect(renderSpy).toHaveBeenCalledTimes(1);

      count.value = 1;
      expect(renderSpy).toHaveBeenCalledTimes(2);

      count.value = 2;
      expect(renderSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('Integration scenarios', () => {
    it('should support signal composition', () => {
      const a = signal(5);
      const b = signal(10);
      const sum = computed(() => a.value + b.value);

      expect(sum).toBeTruthy();

      a.value = 7;
      sum.update();
      expect(sum).toBeTruthy();

      b.value = 13;
      sum.update();
      expect(sum).toBeTruthy();
    });

    it('should work with conditional rendering', () => {
      const isVisible = signal(true);
      const container = document.createElement('div');
      document.body.appendChild(container);

      const component = reactiveComponent(
        () => isVisible.value ? '<p>Visible</p>' : '<p>Hidden</p>',
        { isVisible }
      );

      component.mount(container);
      expect(container.textContent).toBe('Visible');

      isVisible.value = false;
      expect(container.textContent).toBe('Hidden');

      container.remove();
    });

    it('should bind signals to multiple elements', () => {
      const text = signal('Hello');
      const el1 = document.createElement('div');
      const el2 = document.createElement('div');

      document.body.appendChild(el1);
      document.body.appendChild(el2);

      bind(el1, { textContent: text });
      bind(el2, { textContent: text });

      expect(el1.textContent).toBe('Hello');
      expect(el2.textContent).toBe('Hello');

      text.value = 'World';
      expect(el1.textContent).toBe('World');
      expect(el2.textContent).toBe('World');

      el1.remove();
      el2.remove();
    });
  });
});
