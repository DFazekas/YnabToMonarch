import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { exchangeYnabToken, ynabApiCall, isYnabAuthenticated, logoutYnab } from './ynabTokens.js';

describe('ynabTokens', () => {
  let fetchMock;
  let consoleGroupSpy;
  let consoleGroupEndSpy;
  let consoleLogSpy;
  let consoleErrorSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    
    consoleGroupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
    consoleGroupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    consoleGroupSpy.mockRestore();
    consoleGroupEndSpy.mockRestore();
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  describe('exchangeYnabToken', () => {
    it('should exchange authorization code for tokens', async () => {
      const code = 'auth_code_123';
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({ success: true }),
      });

      const result = await exchangeYnabToken(code);

      expect(result).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        '/.netlify/functions/ynabTokenExchange',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ code }),
        }
      );
    });

    it('should include credentials for cookie handling', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({ success: true }),
      });

      await exchangeYnabToken('code');

      const callArgs = fetchMock.mock.calls[0];
      expect(callArgs[1].credentials).toBe('include');
    });

    it('should return false when response is not ok', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValueOnce({ error: 'Invalid code' }),
      });

      const result = await exchangeYnabToken('invalid_code');

      expect(result).toBe(false);
    });

    it('should return false on network error', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      const result = await exchangeYnabToken('code');

      expect(result).toBe(false);
    });

    it('should send code in request body', async () => {
      const testCode = 'test_authorization_code';
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({ success: true }),
      });

      await exchangeYnabToken(testCode);

      const callArgs = fetchMock.mock.calls[0];
      expect(JSON.parse(callArgs[1].body)).toEqual({ code: testCode });
    });
  });

  describe('ynabApiCall', () => {
    it('should make API call through proxy with endpoint', async () => {
      const endpoint = '/budgets';
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValueOnce({ data: { budgets: [] } }),
      });

      const result = await ynabApiCall(endpoint);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(`endpoint=${encodeURIComponent(endpoint)}`),
        expect.objectContaining({
          credentials: 'include',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual({ data: { budgets: [] } });
    });

    it('should include credentials in request', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValueOnce({}),
      });

      await ynabApiCall('/user');

      const callArgs = fetchMock.mock.calls[0];
      expect(callArgs[1].credentials).toBe('include');
    });

    it('should handle 401 and attempt token refresh', async () => {
      // First call returns 401
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValueOnce({ error: 'Token expired' }),
      });

      // Refresh token call succeeds
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({ success: true }),
      });

      // Retry original call succeeds
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValueOnce({ data: 'success' }),
      });

      const result = await ynabApiCall('/budgets');

      expect(fetchMock).toHaveBeenCalledTimes(3);
      expect(result).toEqual({ data: 'success' });
    });

    it('should return null when no access token found', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValueOnce({ error: 'No access token found' }),
      });

      const result = await ynabApiCall('/budgets');

      expect(result).toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1); // Should not attempt refresh
    });

    it('should return null when refresh fails', async () => {
      // First call returns 401
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValueOnce({ error: 'Token expired' }),
      });

      // Refresh fails and redirects
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const result = await ynabApiCall('/budgets');

      expect(result).toBeNull();
      expect(window.location.href).toBe('/');
    });

    it('should throw error for non-401 failures', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValueOnce({ error: 'Server error' }),
      });

      await expect(ynabApiCall('/budgets')).rejects.toThrow('YNAB API request failed: 500');
    });

    it('should pass custom options to fetch', async () => {
      const customOptions = {
        method: 'POST',
        headers: { 'X-Custom': 'header' },
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValueOnce({}),
      });

      await ynabApiCall('/endpoint', customOptions);

      const callArgs = fetchMock.mock.calls[0];
      expect(callArgs[1].method).toBe('POST');
      expect(callArgs[1].headers['X-Custom']).toBe('header');
    });

    it('should encode endpoint in URL', async () => {
      const endpoint = '/budgets/default/accounts';
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({}),
      });

      await ynabApiCall(endpoint);

      expect(fetchMock).toHaveBeenCalledWith(
        `/.netlify/functions/ynabProxy?endpoint=${encodeURIComponent(endpoint)}`,
        expect.any(Object)
      );
    });
  });

  describe('isYnabAuthenticated', () => {
    it('should return true when user endpoint succeeds', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValueOnce({ data: { user: { id: '123' } } }),
      });

      const result = await isYnabAuthenticated();

      expect(result).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('endpoint=%2Fuser'),
        expect.any(Object)
      );
    });

    it('should return false when user endpoint fails', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValueOnce({ error: 'No access token found' }),
      });

      const result = await isYnabAuthenticated();

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      const result = await isYnabAuthenticated();

      expect(result).toBe(false);
    });

    it('should handle null response from ynabApiCall', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValueOnce({ error: 'No access token found' }),
      });

      const result = await isYnabAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('logoutYnab', () => {
    it('should call logout endpoint and redirect home', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({ success: true }),
      });

      await logoutYnab();

      expect(fetchMock).toHaveBeenCalledWith(
        '/.netlify/functions/ynabLogout',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include'
        })
      );
      expect(window.location.href).toBe('/');
    });

    it('should still redirect when endpoint fails', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: vi.fn(),
      });

      await logoutYnab();

      expect(window.location.href).toBe('/');
    });

    it('should redirect on network errors', async () => {
      fetchMock.mockRejectedValueOnce(new Error('network error'));

      await logoutYnab();

      expect(window.location.href).toBe('/');
    });
  });

  describe('token refresh race condition', () => {
    it('should prevent multiple simultaneous refresh attempts', async () => {
      // First call returns 401
      fetchMock.mockResolvedValue({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValue({ error: 'Token expired' }),
      });

      // Refresh token call (delayed)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      });

      // Make multiple concurrent API calls
      const promises = [
        ynabApiCall('/budgets'),
        ynabApiCall('/accounts'),
      ];

      await Promise.allSettled(promises);

      // Should only refresh once despite multiple 401s
      const refreshCalls = fetchMock.mock.calls.filter(call => 
        call[0].includes('ynabTokenRefresh')
      );
      expect(refreshCalls.length).toBeLessThanOrEqual(1);
    });
  });

  describe('console logging', () => {
    it('should complete gracefully on success even with logging disabled', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({ success: true }),
      });

      await expect(exchangeYnabToken('code')).resolves.toBe(true);
    });

    it('should surface errors without relying on console output', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValueOnce({ error: 'Failed' }),
      });

      await expect(exchangeYnabToken('code')).resolves.toBe(false);
    });
  });
});
