import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('./config.js', () => ({
  API: {
    login: '/.netlify/functions/monarchLogin',
    fetchAccounts: '/.netlify/functions/fetchMonarchAccounts',
    createAccounts: '/.netlify/functions/createMonarchAccounts',
    generateStatements: '/.netlify/functions/generateStatements',
    getUploadStatus: '/.netlify/functions/getUploadStatus',
  },
}));

vi.mock('./utils.js', () => ({
  postJson: vi.fn(),
}));

import { monarchApi } from './monarchApi.js';
import { postJson } from './utils.js';

describe('monarchApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('login', () => {
    it('should call postJson with login endpoint and credentials', async () => {
      const loginData = {
        email: 'user@example.com',
        encryptedPassword: 'encrypted123',
        deviceUuid: 'uuid-123',
        otp: '123456',
      };
      postJson.mockResolvedValueOnce({ token: 'auth-token' });

      const result = await monarchApi.login(
        loginData.email,
        loginData.encryptedPassword,
        loginData.deviceUuid,
        loginData.otp
      );

      expect(postJson).toHaveBeenCalledWith(
        '/.netlify/functions/monarchLogin',
        loginData
      );
      expect(result).toEqual({ token: 'auth-token' });
    });

    it('should pass all login parameters correctly', async () => {
      const email = 'test@example.com';
      const password = 'enc_pwd_123';
      const uuid = 'device-uuid-456';
      const otp = '654321';
      postJson.mockResolvedValueOnce({});

      await monarchApi.login(email, password, uuid, otp);

      expect(postJson).toHaveBeenCalledWith(
        expect.any(String),
        { email, encryptedPassword: password, deviceUuid: uuid, otp }
      );
    });

    it('should handle login error', async () => {
      postJson.mockRejectedValueOnce(new Error('Invalid credentials'));

      await expect(
        monarchApi.login('user@example.com', 'pwd', 'uuid', '123')
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('fetchMonarchAccounts', () => {
    it('should call postJson with token', async () => {
      const token = 'auth-token-123';
      const accounts = [{ id: 1, name: 'Account 1' }];
      postJson.mockResolvedValueOnce({ accounts });

      const result = await monarchApi.fetchMonarchAccounts(token);

      expect(postJson).toHaveBeenCalledWith(
        expect.stringContaining('fetchMonarch'),
        { token }
      );
      expect(result).toEqual({ accounts });
    });

    it('should return accounts from API', async () => {
      const mockAccounts = [
        { id: 1, name: 'Checking', type: 'bank' },
        { id: 2, name: 'Savings', type: 'bank' },
      ];
      postJson.mockResolvedValueOnce(mockAccounts);

      const result = await monarchApi.fetchMonarchAccounts('token');

      expect(result).toEqual(mockAccounts);
    });

    it('should handle fetch error', async () => {
      postJson.mockRejectedValueOnce(new Error('Token expired'));

      await expect(monarchApi.fetchMonarchAccounts('expired-token'))
        .rejects.toThrow('Token expired');
    });
  });

  describe('createAccounts', () => {
    it('should call postJson with token and accounts', async () => {
      const token = 'auth-token';
      const accounts = [{ name: 'New Account', type: 'bank' }];
      postJson.mockResolvedValueOnce({ created: 1 });

      const result = await monarchApi.createAccounts(token, accounts);

      expect(postJson).toHaveBeenCalledWith(
        expect.stringContaining('createMonarch'),
        { token, accounts }
      );
      expect(result).toEqual({ created: 1 });
    });

    it('should handle multiple accounts', async () => {
      const token = 'token-123';
      const accounts = [
        { name: 'Account 1', type: 'checking' },
        { name: 'Account 2', type: 'savings' },
        { name: 'Account 3', type: 'credit' },
      ];
      postJson.mockResolvedValueOnce({ created: 3 });

      await monarchApi.createAccounts(token, accounts);

      expect(postJson).toHaveBeenCalledWith(
        expect.any(String),
        { token, accounts }
      );
    });

    it('should handle creation error', async () => {
      postJson.mockRejectedValueOnce(new Error('Duplicate account'));

      await expect(
        monarchApi.createAccounts('token', [{ name: 'Account' }])
      ).rejects.toThrow('Duplicate account');
    });
  });

  describe('generateAccounts', () => {
    it('should send POST request with accounts', async () => {
      const accounts = [{ id: 1, name: 'Account' }];
      const mockResponse = { status: 200, json: vi.fn().mockResolvedValueOnce({}) };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await monarchApi.generateAccounts(accounts);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('generateStatements'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accounts }),
        }
      );
    });

    it('should set correct headers', async () => {
      global.fetch.mockResolvedValueOnce({ status: 200, json: vi.fn().mockResolvedValueOnce({}) });

      await monarchApi.generateAccounts([]);

      const callArgs = global.fetch.mock.calls[0];
      expect(callArgs[1].headers['Content-Type']).toBe('application/json');
    });

    it('should stringify accounts as JSON', async () => {
      const accounts = [{ id: 1, name: 'Test' }];
      global.fetch.mockResolvedValueOnce({ status: 200, json: vi.fn().mockResolvedValueOnce({}) });

      await monarchApi.generateAccounts(accounts);

      const callArgs = global.fetch.mock.calls[0];
      expect(callArgs[1].body).toBe(JSON.stringify({ accounts }));
    });

    it('should return fetch response', async () => {
      const mockResponse = { ok: true, status: 200 };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const result = await monarchApi.generateAccounts([]);

      expect(result).toEqual(mockResponse);
    });

    it('should handle fetch error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(monarchApi.generateAccounts([]))
        .rejects.toThrow('Network error');
    });
  });

  describe('queryUploadStatus', () => {
    it('should call postJson with token and session key', async () => {
      const token = 'auth-token';
      const sessionKey = 'session-123';
      postJson.mockResolvedValueOnce({ status: 'complete' });

      const result = await monarchApi.queryUploadStatus(token, sessionKey);

      expect(postJson).toHaveBeenCalledWith(
        expect.stringContaining('getUploadStatus'),
        { token, sessionKey }
      );
      expect(result).toEqual({ status: 'complete' });
    });

    it('should return upload status', async () => {
      const expectedStatus = {
        status: 'in_progress',
        progress: 50,
        message: 'Processing...',
      };
      postJson.mockResolvedValueOnce(expectedStatus);

      const result = await monarchApi.queryUploadStatus('token', 'session-key');

      expect(result).toEqual(expectedStatus);
    });

    it('should handle status query error', async () => {
      postJson.mockRejectedValueOnce(new Error('Session not found'));

      await expect(monarchApi.queryUploadStatus('token', 'invalid-key'))
        .rejects.toThrow('Session not found');
    });

    it('should handle various status values', async () => {
      const statuses = [
        { status: 'pending' },
        { status: 'in_progress' },
        { status: 'complete' },
        { status: 'failed', error: 'Upload failed' },
      ];

      for (const statusResponse of statuses) {
        postJson.mockResolvedValueOnce(statusResponse);

        const result = await monarchApi.queryUploadStatus('token', 'key');

        expect(result).toEqual(statusResponse);
      }
    });
  });

  describe('API endpoints', () => {
    it('should call correct endpoints', async () => {
      postJson.mockResolvedValue({});

      await monarchApi.login('email', 'pwd', 'uuid', 'otp');
      await monarchApi.fetchMonarchAccounts('token');
      await monarchApi.createAccounts('token', []);
      await monarchApi.queryUploadStatus('token', 'key');

      expect(postJson).toHaveBeenCalledTimes(4);

      // Verify endpoints contain expected path segments
      expect(postJson.mock.calls[0][0]).toContain('monarchLogin');
      expect(postJson.mock.calls[1][0]).toContain('fetchMonarch');
      expect(postJson.mock.calls[2][0]).toContain('createMonarch');
      expect(postJson.mock.calls[3][0]).toContain('getUploadStatus');
    });
  });
});
