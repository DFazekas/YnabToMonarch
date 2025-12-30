import { describe, it, expect } from 'vitest';
import { capitalize } from './string.js';

describe('capitalize', () => {
  it('should capitalize first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should handle already capitalized strings', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('should handle single character', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('should handle uppercase single character', () => {
    expect(capitalize('A')).toBe('A');
  });

  it('should preserve rest of string case', () => {
    expect(capitalize('hELLO')).toBe('HELLO');
  });

  it('should handle empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('should handle strings with numbers', () => {
    expect(capitalize('123abc')).toBe('123abc');
  });

  it('should handle strings with special characters', () => {
    expect(capitalize('!hello')).toBe('!hello');
  });

  it('should handle whitespace prefix', () => {
    expect(capitalize(' hello')).toBe(' hello');
  });

  it('should handle multiword strings', () => {
    expect(capitalize('hello world')).toBe('Hello world');
  });
});
