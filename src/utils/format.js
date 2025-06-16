// Default USD formatter
export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Returns a currency formatter for a given locale and currency.
 * @param {string} locale - e.g. 'en-US'
 * @param {string} currency - e.g. 'USD'
 * @returns {Intl.NumberFormat}
 */
export function getCurrencyFormatter(locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
