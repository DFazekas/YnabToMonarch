import { describe, it, expect, beforeEach } from 'vitest';
import initFaqView from './faq.js';

describe('FAQ View', () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="pageLayout"></div>
      <section class="w-full max-w-4xl mx-auto">
        <div class="space-y-3">
          <div class="faq-item border border-gray-200 rounded-lg overflow-hidden">
            <button class="faq-toggle w-full flex items-center justify-between px-5 py-4" data-index="0">
              <span>Test Question?</span>
              <svg class="faq-icon w-5 h-5"></svg>
            </button>
            <div class="faq-content hidden overflow-hidden max-h-0 transition-all duration-300" data-index="0">
              <div class="px-5 py-4 bg-gray-50">Test Answer</div>
            </div>
          </div>
        </div>
      </section>
    `;
  });

  it('should toggle faq item visibility', () => {
    const button = document.querySelector('.faq-toggle');
    const content = document.querySelector('.faq-content');

    expect(content.classList.contains('hidden')).toBe(true);

    button.click();

    expect(content.classList.contains('open')).toBe(true);
    expect(content.classList.contains('hidden')).toBe(false);

    button.click();

    expect(content.classList.contains('open')).toBe(false);
    expect(content.classList.contains('hidden')).toBe(true);
  });

  it('should rotate icon when toggling', () => {
    const button = document.querySelector('.faq-toggle');
    const icon = button.querySelector('.faq-icon');

    button.click();

    expect(icon.style.transform).toBe('rotate(180deg)');

    button.click();

    expect(icon.style.transform).toBe('rotate(0deg)');
  });

  it('should allow multiple items to be expanded at once', () => {
    document.body.innerHTML = `
      <div id="pageLayout"></div>
      <section class="w-full max-w-4xl mx-auto">
        <div class="space-y-3">
          <div class="faq-item border border-gray-200 rounded-lg overflow-hidden">
            <button class="faq-toggle" data-index="0">
              <span>Question 1?</span>
              <svg class="faq-icon w-5 h-5"></svg>
            </button>
            <div class="faq-content hidden" data-index="0">
              <div>Answer 1</div>
            </div>
          </div>
          <div class="faq-item border border-gray-200 rounded-lg overflow-hidden">
            <button class="faq-toggle" data-index="1">
              <span>Question 2?</span>
              <svg class="faq-icon w-5 h-5"></svg>
            </button>
            <div class="faq-content hidden" data-index="1">
              <div>Answer 2</div>
            </div>
          </div>
        </div>
      </section>
    `;

    const buttons = document.querySelectorAll('.faq-toggle');
    const contents = document.querySelectorAll('.faq-content');

    buttons[0].click();
    buttons[1].click();

    expect(contents[0].classList.contains('open')).toBe(true);
    expect(contents[1].classList.contains('open')).toBe(true);
  });
});
