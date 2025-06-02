import Papa from 'papaparse';

// Generate unique IDs for each account
function generateId() {
  return 'id-' + Math.random().toString(36).substr(2, 9);
}

// Clean string like "$1,234.56" into integer cents: 123456
function parseCurrencyToCents(str) {
  if (!str) return 0;
  const normalized = str.replace(/[^0-9.-]+/g, '').trim();
  const floatVal = parseFloat(normalized);
  return Math.round(floatVal * 100);
}

// The main parsing function now accepts monarchAccountTypes argument
export default async function parseYNABCSV(file, monarchAccountTypes) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;

        if (!data || data.length === 0) {
          return reject(new Error("CSV file appears empty"));
        }

        const groupedAccounts = {};

        data.forEach(row => {
          const accountName = row['Account']?.trim() || 'Unknown';

          const inflowCents = parseCurrencyToCents(row['Inflow']);
          const outflowCents = parseCurrencyToCents(row['Outflow']);
          const amountCents = inflowCents - outflowCents;

          if (!groupedAccounts[accountName]) {
            const { type, subtype } = inferMonarchType(accountName, monarchAccountTypes);

            groupedAccounts[accountName] = {
              id: generateId(),
              name: accountName,
              type,         // Monarch compatible type (ex: 'depository')
              subtype,      // Monarch compatible subtype (ex: 'checking')
              transactions: [],
              transactionCount: 0,
              balanceCents: 0,
              excluded: false
            };
          }

          groupedAccounts[accountName].transactions.push(row);
          groupedAccounts[accountName].transactionCount += 1;
        });

        // Convert object into array and back into dollars
        const accountArray = Object.values(groupedAccounts).map(acc => ({
          ...acc,
          balance: (acc.balanceCents / 100),
          excluded: (acc.transactionCount === 0)
        }));
        resolve(accountArray);
      },
      error: (err) => reject(err)
    });
  });
}

// New smarter inference function that maps to Monarch types
function inferMonarchType(accountName, monarchAccountTypes) {
  const lowered = accountName.toLowerCase();

  // Attempt simple keyword detection
  if (lowered.includes("credit")) {
    return { type: 'credit', subtype: 'credit_card' };
  }

  if (lowered.includes("loan") || lowered.includes("mortgage") || lowered.includes("student loan")) {
    return { type: 'loan', subtype: 'loan' };
  }

  if (lowered.includes("savings")) {
    return { type: 'depository', subtype: 'savings' };
  }

  if (lowered.includes("checking") || lowered.includes("debit")) {
    return { type: 'depository', subtype: 'checking' };
  }

  // Default fallback to Monarch's "Cash -> Checking"
  return { type: 'depository', subtype: 'checking' };
}
