import { describe, it, expect } from 'vitest';
import parseDate from './date.js';

describe('parseDate', () => {
  describe('MM/DD/YYYY format', () => {
    it('should parse standard date', () => {
      expect(parseDate('12/28/2025')).toBe('2025-12-28');
    });

    it('should parse with single digit month', () => {
      expect(parseDate('1/5/2025')).toBe('2025-01-05');
    });

    it('should parse with single digit day', () => {
      expect(parseDate('12/5/2025')).toBe('2025-12-05');
    });

    it('should parse with single digits for both', () => {
      expect(parseDate('1/1/2025')).toBe('2025-01-01');
    });

    it('should parse double digit month and day', () => {
      expect(parseDate('10/15/2025')).toBe('2025-10-15');
    });

    it('should parse leap year date', () => {
      expect(parseDate('2/29/2024')).toBe('2024-02-29');
    });
  });

  describe('edge cases', () => {
    it('should return null for empty string', () => {
      expect(parseDate('')).toBe(null);
    });

    it('should return null for null', () => {
      expect(parseDate(null)).toBe(null);
    });

    it('should return null for undefined', () => {
      expect(parseDate(undefined)).toBe(null);
    });

    it('should return null for unrecognized format', () => {
      expect(parseDate('2025-12-28')).toBe(null);
    });

    it('should return null for invalid date', () => {
      expect(parseDate('abc')).toBe(null);
    });

    it('should parse DD/MM/YYYY format as MM/DD/YYYY (no validation)', () => {
      // Current implementation doesn't validate dates, just parses format
      expect(parseDate('28/12/2025')).toBe('2025-28-12');
    });
  });

  describe('whitespace handling', () => {
    it('should handle leading whitespace', () => {
      expect(parseDate('  12/28/2025')).toBe('2025-12-28');
    });

    it('should handle trailing whitespace', () => {
      expect(parseDate('12/28/2025  ')).toBe('2025-12-28');
    });

    it('should handle both leading and trailing whitespace', () => {
      expect(parseDate('  12/28/2025  ')).toBe('2025-12-28');
    });
  });

  describe('year boundaries', () => {
    it('should parse year 1900', () => {
      expect(parseDate('1/1/1900')).toBe('1900-01-01');
    });

    it('should parse year 2099', () => {
      expect(parseDate('12/31/2099')).toBe('2099-12-31');
    });

    it('should parse year 2000', () => {
      expect(parseDate('1/1/2000')).toBe('2000-01-01');
    });
  });
});
