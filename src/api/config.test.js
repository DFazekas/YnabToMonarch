import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('getConfig', () => {
  let getConfig;
  let fetchMock;

  beforeEach(async () => {
    vi.resetModules();
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const module = await import('./config.js');
    getConfig = module.getConfig;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should fetch configuration from netlify functions', async () => {
    const mockConfig = {
      ynabClientId: 'test-client-id',
      ynabRedirectUri: 'https://example.com/callback',
    };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce(mockConfig),
    });

    const result = await getConfig();

    expect(result).toEqual(mockConfig);
    expect(fetchMock).toHaveBeenCalledWith('/.netlify/functions/config');
  });

  it('should call correct endpoint path', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({}),
    });

    await getConfig();

    expect(fetchMock).toHaveBeenCalledWith('/.netlify/functions/config');
  });

  it('should parse JSON response', async () => {
    const mockConfig = {
      ynabClientId: 'client-123',
      ynabRedirectUri: 'https://example.com/oauth',
      apiKey: 'secret-key',
    };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce(mockConfig),
    });

    const result = await getConfig();

    expect(result).toEqual(mockConfig);
  });

  it('should return fallback config when fetch fails', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'));

    const result = await getConfig();

    expect(result).toHaveProperty('ynabClientId');
    expect(result).toHaveProperty('ynabRedirectUri');
    expect(result.ynabClientId).toBe('FALLBACK_CLIENT_ID');
  });

  it('should return fallback config when response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const result = await getConfig();

    expect(result).toHaveProperty('ynabClientId', 'FALLBACK_CLIENT_ID');
    expect(result).toHaveProperty('ynabRedirectUri', 'http://localhost:3000/oauth/ynab/callback');
  });

  it('should handle 500 errors gracefully', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const result = await getConfig();

    expect(result.ynabClientId).toBe('FALLBACK_CLIENT_ID');
  });

  it('should handle malformed JSON response', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockRejectedValueOnce(new SyntaxError('Invalid JSON')),
    });

    const result = await getConfig();

    expect(result).toHaveProperty('ynabClientId');
  });

  it('should return complete fallback config object', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Failed'));

    const result = await getConfig();

    expect(result).toEqual({
      ynabClientId: 'FALLBACK_CLIENT_ID',
      ynabRedirectUri: 'http://localhost:3000/oauth/ynab/callback',
    });
  });

  it('should handle config with additional properties', async () => {
    const extendedConfig = {
      ynabClientId: 'client-id',
      ynabRedirectUri: 'https://example.com/callback',
      monarchApiUrl: 'https://monarch.example.com',
      apiVersion: 'v1',
    };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce(extendedConfig),
    });

    const result = await getConfig();

    expect(result).toEqual(extendedConfig);
  });

  it('should handle empty config response', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({}),
    });

    const result = await getConfig();

    expect(result).toEqual({});
  });

  it('should handle network timeout', async () => {
    const timeoutError = new Error('fetch timeout');
    timeoutError.name = 'AbortError';
    fetchMock.mockRejectedValueOnce(timeoutError);

    const result = await getConfig();

    expect(result).toHaveProperty('ynabClientId', 'FALLBACK_CLIENT_ID');
  });

  it('should use fallback when response status indicates error', async () => {
    const errorStatuses = [400, 401, 403, 404, 500, 502, 503];

    for (const status of errorStatuses) {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status,
      });

      const result = await getConfig();

      expect(result).toHaveProperty('ynabClientId', 'FALLBACK_CLIENT_ID');
      fetchMock.mockClear();
    }
  });

  it('should log errors to console on failure', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    fetchMock.mockRejectedValueOnce(new Error('Network error'));

    await getConfig();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Could not fetch app configuration:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
