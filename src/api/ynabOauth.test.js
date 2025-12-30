import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { startYnabOauth, getExpectedState, clearExpectedState } from './ynabOauth.js';

describe('ynabOauth', () => {
  let fetchMock;
  let sessionStorageMock;
  let windowAlertMock;
  let windowLocationMock;

  beforeEach(() => {
    // Mock fetch
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    // Mock sessionStorage
    sessionStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true,
      configurable: true,
    });

    // Mock window.alert
    windowAlertMock = vi.fn();
    vi.stubGlobal('alert', windowAlertMock);

    // Mock window.location
    delete window.location;
    windowLocationMock = { assign: vi.fn(), origin: 'https://example.com' };
    window.location = windowLocationMock;

    // Mock crypto
    Object.defineProperty(window, 'crypto', {
      value: {
        randomUUID: vi.fn(() => 'uuid-12345'),
        getRandomValues: vi.fn((arr) => {
          for (let i = 0; i < arr.length; i++) {
            arr[i] = i;
          }
          return arr;
        }),
      },
      writable: true,
      configurable: true,
    });

    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('startYnabOauth', () => {
    it('should fetch client ID from config', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({ ynabClientId: 'test-client-id' }),
      });

      await startYnabOauth();

      expect(fetchMock).toHaveBeenCalledWith('/.netlify/functions/config');
    });

    it('should build authorize URL with correct parameters', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({ ynabClientId: 'test-client-id' }),
      });

      await startYnabOauth();

      const assignedUrl = windowLocationMock.assign.mock.calls[0][0];
      const url = new URL(assignedUrl);

      expect(url.origin).toBe('https://app.ynab.com');
      expect(url.pathname).toBe('/oauth/authorize');
      expect(url.searchParams.get('client_id')).toBe('test-client-id');
      expect(url.searchParams.get('response_type')).toBe('code');
      expect(url.searchParams.get('redirect_uri')).toBe('https://example.com/oauth/ynab/callback');
      expect(url.searchParams.get('state')).toBeTruthy();
    });

    it('should generate and store state value', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({ ynabClientId: 'test-client-id' }),
      });

      await startYnabOauth();

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'ynab_oauth_expected_state',
        expect.any(String)
      );
    });

    it('should use crypto.randomUUID for state generation', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({ ynabClientId: 'test-client-id' }),
      });

      await startYnabOauth();

      expect(window.crypto.randomUUID).toHaveBeenCalled();
      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'ynab_oauth_expected_state',
        'uuid-12345'
      );
    });

    it('should fall back to getRandomValues if randomUUID unavailable', async () => {
      window.crypto.randomUUID = undefined;

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({ ynabClientId: 'test-client-id' }),
      });

      await startYnabOauth();

      expect(window.crypto.getRandomValues).toHaveBeenCalled();
      expect(sessionStorageMock.setItem).toHaveBeenCalled();
    });

    it('should fall back to Math.random if crypto unavailable', async () => {
      delete window.crypto;

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({ ynabClientId: 'test-client-id' }),
      });

      const mathRandomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.123456);

      await startYnabOauth();

      expect(mathRandomSpy).toHaveBeenCalled();
      expect(sessionStorageMock.setItem).toHaveBeenCalled();

      mathRandomSpy.mockRestore();
    });

    it('should alert and return null when config fetch fails', async () => {
      vi.resetModules();
      vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({ ok: false }));
      vi.stubGlobal('alert', windowAlertMock);
      
      const { startYnabOauth: freshStart } = await import('./ynabOauth.js');
      const result = await freshStart();

      expect(windowAlertMock).toHaveBeenCalledWith(
        'Could not retrieve YNAB OAuth client ID. Please try again.'
      );
      expect(result).toBeNull();
    });

    it('should alert and return null on network error', async () => {
      vi.resetModules();
      vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('Network error')));
      vi.stubGlobal('alert', windowAlertMock);
      
      const { startYnabOauth: freshStart } = await import('./ynabOauth.js');
      const result = await freshStart();

      expect(windowAlertMock).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should redirect to authorization URL', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({ ynabClientId: 'test-client-id' }),
      });

      const url = await startYnabOauth();

      expect(windowLocationMock.assign).toHaveBeenCalledWith(url);
    });

    it('should cache client ID for subsequent calls', async () => {
      vi.resetModules();
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ ynabClientId: 'test-client-id' }),
      });
      vi.stubGlobal('fetch', mockFetch);
      
      const { startYnabOauth: freshStart } = await import('./ynabOauth.js');
      
      await freshStart();
      await freshStart();

      // Should only fetch once
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle sessionStorage unavailable', async () => {
      Object.defineProperty(window, 'sessionStorage', {
        get: () => {
          throw new Error('Storage unavailable');
        },
        configurable: true,
      });

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({ ynabClientId: 'test-client-id' }),
      });

      // Should not throw
      await expect(startYnabOauth()).resolves.toBeDefined();
    });

    it('should use correct redirect URI based on origin', async () => {
      window.location.origin = 'http://localhost:8888';

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({ ynabClientId: 'test-client-id' }),
      });

      await startYnabOauth();

      const assignedUrl = windowLocationMock.assign.mock.calls[0][0];
      const url = new URL(assignedUrl);

      expect(url.searchParams.get('redirect_uri')).toBe('http://localhost:8888/oauth/ynab/callback');
    });
  });

  describe('getExpectedState', () => {
    it('should retrieve state from sessionStorage', () => {
      sessionStorageMock.getItem.mockReturnValueOnce('stored-state-value');

      const state = getExpectedState();

      expect(sessionStorageMock.getItem).toHaveBeenCalledWith('ynab_oauth_expected_state');
      expect(state).toBe('stored-state-value');
    });

    it('should return null when state not found', () => {
      sessionStorageMock.getItem.mockReturnValueOnce(null);

      const state = getExpectedState();

      expect(state).toBeNull();
    });

    it('should return null when sessionStorage unavailable', () => {
      Object.defineProperty(window, 'sessionStorage', {
        get: () => {
          throw new Error('Storage unavailable');
        },
        configurable: true,
      });

      const state = getExpectedState();

      expect(state).toBeNull();
    });
  });

  describe('clearExpectedState', () => {
    it('should remove state from sessionStorage', () => {
      clearExpectedState();

      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('ynab_oauth_expected_state');
    });

    it('should handle sessionStorage unavailable', () => {
      Object.defineProperty(window, 'sessionStorage', {
        get: () => {
          throw new Error('Storage unavailable');
        },
        configurable: true,
      });

      // Should not throw
      expect(() => clearExpectedState()).not.toThrow();
    });
  });

  describe('state generation', () => {
    it('should generate different states on multiple calls', async () => {
      let uuidCounter = 0;
      window.crypto.randomUUID = vi.fn(() => `uuid-${uuidCounter++}`);

      fetchMock.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ ynabClientId: 'test-client-id' }),
      });

      // Clear cache
      vi.resetModules();
      const { startYnabOauth: freshStart1 } = await import('./ynabOauth.js');
      await freshStart1();

      vi.resetModules();
      const { startYnabOauth: freshStart2 } = await import('./ynabOauth.js');
      await freshStart2();

      const states = sessionStorageMock.setItem.mock.calls.map(call => call[1]);
      expect(states[0]).not.toBe(states[1]);
    });

    it('should generate hex string from getRandomValues', async () => {
      window.crypto.randomUUID = undefined;
      window.crypto.getRandomValues = vi.fn((arr) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = 255; // Will produce 'ff' in hex
        }
        return arr;
      });

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({ ynabClientId: 'test-client-id' }),
      });

      await startYnabOauth();

      const state = sessionStorageMock.setItem.mock.calls[0][1];
      expect(state).toMatch(/^[0-9a-f]+$/);
    });
  });
});
