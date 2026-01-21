/**
 * Convert a currency-formatted string (e.g., "$1,234.56") into an integer value in cents.
 *
 * @param {string} str - The currency string to parse.
 * @returns {number} Amount in cents (e.g., 123456) or 0 if invalid.
 */
import getLogger, { setLoggerConfig } from './logger.js';
const currencyLogger = getLogger('Currency');

// Disable logging for the specific method `Currency.parseCurrencyToCents`
setLoggerConfig({ methods: { 'Currency.parseCurrencyToCents': false } });

export function parseCurrencyToCents(str) {
  currencyLogger.group('parseCurrencyToCents', str);
  const sanitizedStr = str?.trim() || '';
  if (sanitizedStr.length === 0) {
    currencyLogger.error('parseCurrencyToCents', `Invalid currency string -- Empty input: "${str}"`);
    currencyLogger.groupEnd('parseCurrencyToCents');
    throw new Error(`Invalid currency string -- Empty input: "${str}"`);
  }
  
  const normalized = str.replace(/[^0-9.-]+/g, '').trim();
  const floatVal = parseFloat(normalized);
  if (isNaN(floatVal)) {
    currencyLogger.error('parseCurrencyToCents', `Invalid currency string -- Not a number: "${str}"`);
    currencyLogger.groupEnd('parseCurrencyToCents');
    throw new Error(`Invalid currency string -- Not a number: "${str}"`);
  }

  const cents = Math.round(floatVal * 100);
  currencyLogger.debug('parseCurrencyToCents', `parseCurrencyToCents: '${str}' -> '${cents}' cents`);
  currencyLogger.groupEnd('parseCurrencyToCents');
  return cents;
}

/**
 * Convert cents to dollars as a float with 2 decimal places.
 *
 * @param {number|null|undefined} cents - The amount in cents (e.g., 143723).
 * @returns {number} Amount in dollars with 2 decimal places (e.g., 1437.23).
 */
export function centsToDollars(cents) {
  if (cents === null || cents === undefined) {
    return parseFloat((0).toFixed(2));
  }

  if (typeof cents !== 'number' || isNaN(cents)) {
    throw new Error(`Invalid cents value: ${cents}`);
  }

  return parseFloat((cents / 100).toFixed(2));
}

