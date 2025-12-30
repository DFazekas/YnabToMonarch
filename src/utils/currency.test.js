import { describe, it, expect } from 'vitest';
import parseCurrencyToCents from './currency.js';

describe('parseCurrencyToCents', () => {
  describe('valid currency formats', () => {
    it('should parse dollar amount with cents', () => {
      expect(parseCurrencyToCents('$1,234.56')).toBe(123456);
    });

    it('should parse dollar amount without cents', () => {
      expect(parseCurrencyToCents('$1,234')).toBe(123400);
    });

    it('should parse plain number', () => {
      expect(parseCurrencyToCents('1234.56')).toBe(123456);
    });

    it('should parse negative amount', () => {
      expect(parseCurrencyToCents('-$123.45')).toBe(-12345);
    });

    it('should parse negative amount without dollar sign', () => {
      expect(parseCurrencyToCents('-123.45')).toBe(-12345);
    });

    it('should parse zero', () => {
      expect(parseCurrencyToCents('$0.00')).toBe(0);
    });

    it('should parse decimal only', () => {
      expect(parseCurrencyToCents('0.99')).toBe(99);
    });

    it('should handle spaces', () => {
      expect(parseCurrencyToCents(' $1,234.56 ')).toBe(123456);
    });

    it('should parse large amounts', () => {
      expect(parseCurrencyToCents('$1,234,567.89')).toBe(123456789);
    });

    it('should round to nearest cent', () => {
      expect(parseCurrencyToCents('1.234')).toBe(123);
      expect(parseCurrencyToCents('1.235')).toBe(124);
    });
  });

  describe('edge cases', () => {
    it('should throw on empty string', () => {
      expect(() => parseCurrencyToCents('')).toThrow('Invalid currency string -- Empty input');
    });

    it('should throw on null', () => {
      expect(() => parseCurrencyToCents(null)).toThrow('Invalid currency string -- Empty input');
    });

    it('should throw on undefined', () => {
      expect(() => parseCurrencyToCents(undefined)).toThrow('Invalid currency string -- Empty input');
    });

    it('should throw on non-numeric string', () => {
      expect(() => parseCurrencyToCents('abc')).toThrow('Invalid currency string -- Not a number');
    });

    it('should throw on whitespace only', () => {
      expect(() => parseCurrencyToCents('   ')).toThrow('Invalid currency string -- Empty input');
    });
  });

  describe('various currency symbols', () => {
    it('should handle euro symbol', () => {
      expect(parseCurrencyToCents('€123.45')).toBe(12345);
    });

    it('should handle pound symbol', () => {
      expect(parseCurrencyToCents('£123.45')).toBe(12345);
    });

    it('should handle yen symbol', () => {
      expect(parseCurrencyToCents('¥123')).toBe(12300);
    });
  });
});
