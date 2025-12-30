import { describe, it, expect } from 'vitest';
import generateCSV from './generateCsv.js';

describe('generateCSV', () => {
  describe('CSV format', () => {
    it('should include correct headers', () => {
      const csv = generateCSV('Test Account', []);
      const lines = csv.split('\n');
      expect(lines[0]).toBe('"Date","Merchant","Category","Account","Original Statement","Notes","Amount","Tags"');
    });

    it('should create single row for one transaction', () => {
      const transactions = [
        {
          Date: '2025-01-01',
          Merchant: 'Coffee Shop',
          Category: 'Food',
          Notes: 'Morning coffee',
          Amount: '-5.00',
          Tags: ''
        }
      ];

      const csv = generateCSV('Checking', transactions);
      const lines = csv.split('\n');

      expect(lines.length).toBe(2); // header + 1 row
      expect(lines[1]).toBe('"2025-01-01","Coffee Shop","Food","Checking","","Morning coffee","-5.00",""');
    });

    it('should create multiple rows for multiple transactions', () => {
      const transactions = [
        {
          Date: '2025-01-01',
          Merchant: 'Coffee Shop',
          Category: 'Food',
          Notes: 'Morning coffee',
          Amount: '-5.00',
          Tags: 'daily'
        },
        {
          Date: '2025-01-02',
          Merchant: 'Grocery Store',
          Category: 'Groceries',
          Notes: 'Weekly groceries',
          Amount: '-75.50',
          Tags: 'weekly'
        }
      ];

      const csv = generateCSV('Checking', transactions);
      const lines = csv.split('\n');

      expect(lines.length).toBe(3); // header + 2 rows
      expect(lines[1]).toContain('Coffee Shop');
      expect(lines[2]).toContain('Grocery Store');
    });
  });

  describe('Account name handling', () => {
    it('should include account name in all rows', () => {
      const transactions = [
        {
          Date: '2025-01-01',
          Merchant: 'Shop A',
          Category: 'Expenses',
          Notes: '',
          Amount: '-10.00',
          Tags: ''
        },
        {
          Date: '2025-01-02',
          Merchant: 'Shop B',
          Category: 'Expenses',
          Notes: '',
          Amount: '-20.00',
          Tags: ''
        }
      ];

      const csv = generateCSV('My Savings', transactions);
      const lines = csv.split('\n');

      expect(lines[1]).toContain('"My Savings"');
      expect(lines[2]).toContain('"My Savings"');
    });

    it('should handle account names with special characters', () => {
      const transactions = [
        {
          Date: '2025-01-01',
          Merchant: 'Store',
          Category: 'Food',
          Notes: '',
          Amount: '-5.00',
          Tags: ''
        }
      ];

      const csv = generateCSV('Account-123 & Co.', transactions);
      expect(csv).toContain('Account-123 & Co.');
    });
  });

  describe('Field handling', () => {
    it('should properly quote all fields', () => {
      const transactions = [
        {
          Date: '2025-01-01',
          Merchant: 'Store',
          Category: 'Food',
          Notes: 'Note text',
          Amount: '100.00',
          Tags: 'tag1,tag2'
        }
      ];

      const csv = generateCSV('Account', transactions);
      const row = csv.split('\n')[1];

      // Count quotes - should be 16 (opening and closing for 8 fields)
      const quoteCount = (row.match(/"/g) || []).length;
      expect(quoteCount).toBe(16);
    });

    it('should handle empty notes field', () => {
      const transactions = [
        {
          Date: '2025-01-01',
          Merchant: 'Store',
          Category: 'Food',
          Notes: '',
          Amount: '-5.00',
          Tags: ''
        }
      ];

      const csv = generateCSV('Account', transactions);
      const row = csv.split('\n')[1];

      expect(row).toContain('""'); // Empty notes field
    });

    it('should handle empty tags field', () => {
      const transactions = [
        {
          Date: '2025-01-01',
          Merchant: 'Store',
          Category: 'Food',
          Notes: 'Test',
          Amount: '-5.00',
          Tags: ''
        }
      ];

      const csv = generateCSV('Account', transactions);
      const row = csv.split('\n')[1];

      expect(row).toContain(',"Test","',); // Notes followed by empty Tags
    });

    it('should keep original statement column empty', () => {
      const transactions = [
        {
          Date: '2025-01-01',
          Merchant: 'Store',
          Category: 'Food',
          Notes: 'Test',
          Amount: '-5.00',
          Tags: ''
        }
      ];

      const csv = generateCSV('Account', transactions);
      const row = csv.split('\n')[1];

      // Original Statement should be empty (5th column)
      const fields = row.split('","');
      expect(fields[4]).toBe(''); // 5th field (0-indexed as 4)
    });
  });

  describe('Amount formatting', () => {
    it('should handle negative amounts', () => {
      const transactions = [
        {
          Date: '2025-01-01',
          Merchant: 'Store',
          Category: 'Food',
          Notes: '',
          Amount: '-50.99',
          Tags: ''
        }
      ];

      const csv = generateCSV('Account', transactions);
      expect(csv).toContain('-50.99');
    });

    it('should handle positive amounts', () => {
      const transactions = [
        {
          Date: '2025-01-01',
          Merchant: 'Salary',
          Category: 'Income',
          Notes: '',
          Amount: '5000.00',
          Tags: ''
        }
      ];

      const csv = generateCSV('Account', transactions);
      expect(csv).toContain('5000.00');
    });

    it('should handle numeric amounts', () => {
      const transactions = [
        {
          Date: '2025-01-01',
          Merchant: 'Store',
          Category: 'Food',
          Notes: '',
          Amount: 25.5,
          Tags: ''
        }
      ];

      const csv = generateCSV('Account', transactions);
      expect(csv).toContain('25.5');
    });

    it('should handle zero amounts', () => {
      const transactions = [
        {
          Date: '2025-01-01',
          Merchant: 'Store',
          Category: 'Food',
          Notes: '',
          Amount: 0,
          Tags: ''
        }
      ];

      const csv = generateCSV('Account', transactions);
      expect(csv).toContain('0');
    });
  });

  describe('Date handling', () => {
    it('should preserve date format', () => {
      const transactions = [
        {
          Date: '2025-12-31',
          Merchant: 'Store',
          Category: 'Food',
          Notes: '',
          Amount: '-5.00',
          Tags: ''
        }
      ];

      const csv = generateCSV('Account', transactions);
      expect(csv).toContain('2025-12-31');
    });

    it('should handle various date formats', () => {
      const dates = ['2025-01-01', '01/01/2025', '2025.01.01'];

      dates.forEach(date => {
        const transactions = [
          {
            Date: date,
            Merchant: 'Store',
            Category: 'Food',
            Notes: '',
            Amount: '-5.00',
            Tags: ''
          }
        ];

        const csv = generateCSV('Account', transactions);
        expect(csv).toContain(date);
      });
    });
  });

  describe('Merchant and Category', () => {
    it('should handle merchant names with spaces', () => {
      const transactions = [
        {
          Date: '2025-01-01',
          Merchant: 'Coffee Shop Express',
          Category: 'Food & Beverage',
          Notes: '',
          Amount: '-5.00',
          Tags: ''
        }
      ];

      const csv = generateCSV('Account', transactions);
      expect(csv).toContain('Coffee Shop Express');
    });

    it('should handle special characters in merchant', () => {
      const transactions = [
        {
          Date: '2025-01-01',
          Merchant: "O'Reilly's Restaurant & Bar",
          Category: 'Dining',
          Notes: '',
          Amount: '-45.00',
          Tags: ''
        }
      ];

      const csv = generateCSV('Account', transactions);
      expect(csv).toContain("O'Reilly's Restaurant & Bar");
    });
  });

  describe('Edge cases', () => {
    it('should handle empty transaction list', () => {
      const csv = generateCSV('Account', []);
      const lines = csv.split('\n');

      expect(lines.length).toBe(1);
      expect(lines[0]).toContain('Date');
    });

    it('should handle large number of transactions', () => {
      const transactions = Array.from({ length: 100 }, (_, i) => ({
        Date: `2025-01-${String(i % 28 + 1).padStart(2, '0')}`,
        Merchant: `Store ${i}`,
        Category: 'Expenses',
        Notes: `Transaction ${i}`,
        Amount: `-${(Math.random() * 100).toFixed(2)}`,
        Tags: `tag${i}`
      }));

      const csv = generateCSV('Account', transactions);
      const lines = csv.split('\n');

      expect(lines.length).toBe(101); // header + 100 rows
    });

    it('should output newline-separated rows', () => {
      const transactions = [
        {
          Date: '2025-01-01',
          Merchant: 'Store 1',
          Category: 'Food',
          Notes: 'First',
          Amount: '-5.00',
          Tags: ''
        },
        {
          Date: '2025-01-02',
          Merchant: 'Store 2',
          Category: 'Food',
          Notes: 'Second',
          Amount: '-10.00',
          Tags: ''
        }
      ];

      const csv = generateCSV('Account', transactions);
      expect(csv).not.toContain('\r\n');
      expect(csv.split('\n').length).toBe(3);
    });
  });

  describe('CSV validity', () => {
    it('should produce valid CSV that can be split into rows', () => {
      const transactions = [
        {
          Date: '2025-01-01',
          Merchant: 'Store',
          Category: 'Food',
          Notes: 'Test',
          Amount: '-5.00',
          Tags: 'test'
        }
      ];

      const csv = generateCSV('Account', transactions);
      const rows = csv.split('\n');

      rows.forEach(row => {
        expect(row).toBeTruthy();
        expect(row.startsWith('"')).toBe(true);
      });
    });

    it('should have consistent field count across all rows', () => {
      const transactions = [
        {
          Date: '2025-01-01',
          Merchant: 'Store 1',
          Category: 'Food',
          Notes: 'Note',
          Amount: '-5.00',
          Tags: 'tag'
        },
        {
          Date: '2025-01-02',
          Merchant: 'Store 2',
          Category: 'Food',
          Notes: 'Note 2',
          Amount: '-10.00',
          Tags: 'tag2'
        }
      ];

      const csv = generateCSV('Account', transactions);
      const rows = csv.split('\n');
      const headerFields = rows[0].split(',').length;

      rows.forEach((row, i) => {
        if (row) {
          // Count fields by counting quotes, dividing by 2 for open/close
          const fieldCount = (row.match(/"/g) || []).length / 2;
          expect(fieldCount).toBe(headerFields);
        }
      });
    });
  });
});
