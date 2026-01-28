import { describe, it, expect, beforeEach, vi } from 'vitest';
import initFaqView from './faq.js';

vi.mock('../../components/pageLayout.js', () => ({
  renderPageLayout: vi.fn()
}));

describe('FAQ View', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="pageLayout" data-back-text="Back"></div>
      <section id="faqContainer" class="w-full max-w-4xl mx-auto"></section>
    `;

    initFaqView();
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
    const buttons = document.querySelectorAll('.faq-toggle');
    const contents = document.querySelectorAll('.faq-content');

    buttons[0].click();
    buttons[1].click();

    expect(contents[0].classList.contains('open')).toBe(true);
    expect(contents[1].classList.contains('open')).toBe(true);
  });
});
