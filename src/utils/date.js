/**
* Parse date string and convert to YYYY-MM-DD format.
* Supports multiple input formats with extensible pattern matching.
*
* @param {string} dateStr - The date string to parse (e.g., "MM/DD/YYYY").
* @returns {string|null} Formatted date as "YYYY-MM-DD" or null if format unrecognized.
*/
import getLogger, { setLoggerConfig } from './logger.js';
const dateLogger = getLogger('Date');

// Disable logging for the specific method `Date.parseDate`
setLoggerConfig({ methods: { 'Date.parseDate': false } });

export default function parseDate(dateStr) {
  dateLogger.group('parseDate', dateStr);
  if (!dateStr) {
    dateLogger.groupEnd('parseDate');
    return null;
  }

  const trimmed = dateStr.trim();

  // Pattern: MM/DD/YYYY
  const mmddyyyyMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mmddyyyyMatch) {
    const [, mm, dd, yyyy] = mmddyyyyMatch;
    const result = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    dateLogger.debug('parseDate', `Date '${dateStr}' parsed as MM/DD/YYYY -> ${result}`);
    dateLogger.groupEnd('parseDate');
    return result;
  }

  // Add more formats as needed (DD/MM/YYYY, YYYY-MM-DD, etc.)

  dateLogger.debug('parseDate', `parseDate: unrecognized format -> ${trimmed}`);
  dateLogger.groupEnd('parseDate');
  return null;
}