import { describe, it, expect, beforeEach, vi } from 'vitest';
import { postJson } from './utils.js';

describe('postJson', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send a POST request with JSON body and return parsed response', async () => {
    const mockResponse = { success: true, data: { id: 123 } };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await postJson('https://api.example.com/test', { name: 'test' });

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'test' }),
    });
  });

  it('should set Content-Type header to application/json', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({}),
    });

    await postJson('https://api.example.com/test', {});

    const callArgs = global.fetch.mock.calls[0];
    expect(callArgs[1].headers['Content-Type']).toBe('application/json');
  });

  it('should throw error when response status is not ok', async () => {
    const errorMessage = 'Unauthorized';
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValueOnce({ error: errorMessage }),
    });

    await expect(postJson('https://api.example.com/test', {}))
      .rejects.toThrow(errorMessage);
  });

  it('should use error field from response when status is not ok', async () => {
    const errorData = { error: 'Custom error message' };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValueOnce(errorData),
    });

    await expect(postJson('https://api.example.com/test', {}))
      .rejects.toThrow('Custom error message');
  });

  it('should use message field when error field is not present', async () => {
    const errorData = { message: 'Fallback error' };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValueOnce(errorData),
    });

    await expect(postJson('https://api.example.com/test', {}))
      .rejects.toThrow('Fallback error');
  });

  it('should use generic error message when neither error nor message is present', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValueOnce({}),
    });

    await expect(postJson('https://api.example.com/test', {}))
      .rejects.toThrow('API error');
  });

  it('should stringify body as JSON', async () => {
    const body = { key: 'value', nested: { data: true } };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({}),
    });

    await postJson('https://api.example.com/test', body);

    const callArgs = global.fetch.mock.calls[0];
    expect(callArgs[1].body).toBe(JSON.stringify(body));
  });

  it('should handle empty body object', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({}),
    });

    const result = await postJson('https://api.example.com/test', {});

    expect(result).toEqual({});
    const callArgs = global.fetch.mock.calls[0];
    expect(callArgs[1].body).toBe('{}');
  });

  it('should handle response with multiple error fields preferring error over message', async () => {
    const errorData = { error: 'Primary error', message: 'Secondary message' };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValueOnce(errorData),
    });

    await expect(postJson('https://api.example.com/test', {}))
      .rejects.toThrow('Primary error');
  });

  it('should handle 4xx status codes', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: vi.fn().mockResolvedValueOnce({ error: 'Not found' }),
    });

    await expect(postJson('https://api.example.com/test', {}))
      .rejects.toThrow('Not found');
  });

  it('should handle 5xx status codes', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValueOnce({ error: 'Server error' }),
    });

    await expect(postJson('https://api.example.com/test', {}))
      .rejects.toThrow('Server error');
  });

  it('should preserve response data structure', async () => {
    const complexData = {
      users: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ],
      metadata: {
        total: 2,
        page: 1,
      },
    };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce(complexData),
    });

    const result = await postJson('https://api.example.com/test', {});

    expect(result).toEqual(complexData);
  });
});
