import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('./config.js', () => ({
  API: {
    parseCsv: '/.netlify/functions/parseCsv',
  },
}));

vi.mock('./utils.js', () => ({
  postJson: vi.fn(),
}));

import { parseCsv } from './parseCsv.js';
import { postJson } from './utils.js';

describe('parseCsv', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call postJson with correct API endpoint and CSV text', async () => {
    const csvText = 'column1,column2\nvalue1,value2';
    const mockResponse = { parsed: true, rows: 1 };
    postJson.mockResolvedValueOnce(mockResponse);

    const result = await parseCsv(csvText);

    expect(postJson).toHaveBeenCalledWith(
      expect.stringContaining('parseCsv'),
      { csvText }
    );
    expect(result).toEqual(mockResponse);
  });

  it('should pass CSV text to API endpoint', async () => {
    const csvText = 'a,b,c\n1,2,3\n4,5,6';
    postJson.mockResolvedValueOnce({ success: true });

    await parseCsv(csvText);

    expect(postJson).toHaveBeenCalledWith(
      expect.any(String),
      { csvText }
    );
  });

  it('should return parsed CSV response', async () => {
    const expectedResult = {
      headers: ['date', 'amount', 'description'],
      rows: [
        { date: '2024-01-01', amount: '100', description: 'Test' },
      ],
    };
    postJson.mockResolvedValueOnce(expectedResult);

    const result = await parseCsv('date,amount,description\n2024-01-01,100,Test');

    expect(result).toEqual(expectedResult);
  });

  it('should handle empty CSV text', async () => {
    const csvText = '';
    postJson.mockResolvedValueOnce({ rows: 0 });

    const result = await parseCsv(csvText);

    expect(postJson).toHaveBeenCalledWith(
      expect.any(String),
      { csvText: '' }
    );
    expect(result).toEqual({ rows: 0 });
  });

  it('should handle CSV with special characters', async () => {
    const csvText = 'name,email\n"Smith, Jr.",test@example.com';
    postJson.mockResolvedValueOnce({ parsed: true });

    await parseCsv(csvText);

    expect(postJson).toHaveBeenCalledWith(
      expect.any(String),
      { csvText }
    );
  });

  it('should propagate API errors', async () => {
    const errorMessage = 'Invalid CSV format';
    postJson.mockRejectedValueOnce(new Error(errorMessage));

    await expect(parseCsv('invalid')).rejects.toThrow(errorMessage);
  });

  it('should handle multiline CSV entries', async () => {
    const csvText = 'id,description\n1,"Line 1\nLine 2"';
    postJson.mockResolvedValueOnce({ rows: 1 });

    await parseCsv(csvText);

    expect(postJson).toHaveBeenCalledWith(
      expect.any(String),
      { csvText }
    );
  });
});
