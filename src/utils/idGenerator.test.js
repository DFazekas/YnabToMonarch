import { describe, it, expect } from 'vitest';
import generateId from './idGenerator.js';

describe('generateId', () => {
  it('should return a string', () => {
    expect(typeof generateId()).toBe('string');
  });

  it('should have "id-" prefix', () => {
    expect(generateId()).toMatch(/^id-/);
  });

  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('should have correct length', () => {
    // "id-" (3 chars) + 9 chars from Math.random().toString(36).slice(2, 11)
    expect(generateId()).toHaveLength(12);
  });

  it('should contain only alphanumeric characters after prefix', () => {
    const id = generateId();
    expect(id).toMatch(/^id-[a-z0-9]{9}$/);
  });

  it('should generate multiple unique IDs', () => {
    const ids = Array.from({ length: 100 }, () => generateId());
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(100);
  });

  it('should not contain special characters', () => {
    for (let i = 0; i < 50; i++) {
      expect(generateId()).toMatch(/^id-[a-z0-9]+$/);
    }
  });
});
