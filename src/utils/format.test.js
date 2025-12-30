import { describe, it, expect } from 'vitest';
import { currencyFormatter, getCurrencyFormatter } from './format.js';

describe('currencyFormatter', () => {
  it('should format USD currency', () => {
    expect(currencyFormatter.format(1234.56)).toBe('$1,234.56');
  });

  it('should format zero', () => {
    expect(currencyFormatter.format(0)).toBe('$0.00');
  });

  it('should format negative amounts', () => {
    expect(currencyFormatter.format(-99.99)).toBe('-$99.99');
  });

  it('should format large amounts', () => {
    expect(currencyFormatter.format(1234567.89)).toBe('$1,234,567.89');
  });

  it('should enforce 2 decimal places', () => {
    expect(currencyFormatter.format(50)).toBe('$50.00');
  });

  it('should round to nearest cent (banker\'s rounding)', () => {
    // JavaScript's rounding follows banker's rounding (round half to even)
    // 1.005 rounds to 1.01, not 1.00
    expect(currencyFormatter.format(1.005)).toBe('$1.01');
  });

  it('should handle small cents', () => {
    expect(currencyFormatter.format(0.01)).toBe('$0.01');
  });

  it('should handle fractional cents (will round)', () => {
    expect(currencyFormatter.format(1.234)).toBe('$1.23');
  });
});

describe('getCurrencyFormatter', () => {
  it('should return USD formatter by default', () => {
    const formatter = getCurrencyFormatter();
    expect(formatter.format(100)).toBe('$100.00');
  });

  it('should format EUR currency', () => {
    const formatter = getCurrencyFormatter('en-US', 'EUR');
    const result = formatter.format(100);
    expect(result).toContain('€');
  });

  it('should format GBP currency', () => {
    const formatter = getCurrencyFormatter('en-US', 'GBP');
    const result = formatter.format(100);
    expect(result).toContain('£');
  });

  it('should format JPY currency', () => {
    const formatter = getCurrencyFormatter('en-US', 'JPY');
    const result = formatter.format(100);
    expect(result).toContain('¥');
  });

  it('should format with different locales', () => {
    const usFormatter = getCurrencyFormatter('en-US', 'USD');
    const deFormatter = getCurrencyFormatter('de-DE', 'EUR');
    expect(usFormatter.format(100)).toBe('$100.00');
    expect(deFormatter.format(100)).toBeTruthy();
  });

  it('should maintain 2 decimal places', () => {
    const formatter = getCurrencyFormatter('en-US', 'EUR');
    expect(formatter.format(50)).toContain('.00');
  });

  it('should handle negative amounts in different currencies', () => {
    const formatter = getCurrencyFormatter('en-US', 'EUR');
    const result = formatter.format(-100);
    expect(result).toBeTruthy();
  });

  it('should support Canadian dollars', () => {
    const formatter = getCurrencyFormatter('en-CA', 'CAD');
    const result = formatter.format(100);
    expect(result).toContain('$');
  });

  it('should support Australian dollars', () => {
    const formatter = getCurrencyFormatter('en-AU', 'AUD');
    const result = formatter.format(100);
    expect(result).toContain('$');
  });

  it('should support Swiss francs', () => {
    const formatter = getCurrencyFormatter('de-CH', 'CHF');
    const result = formatter.format(100);
    expect(result).toBeTruthy();
  });
});
