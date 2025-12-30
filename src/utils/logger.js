/**
 * Default configuration for the logging system.
 * @type {Object}
 * @property {boolean} enabled - Global toggle for logging
 * @property {Object} levels - Log level controls (log, debug, warn, error, group, groupEnd)
 * @property {Object} namespaces - Namespace-specific toggles
 * @property {Object} methods - Method-specific toggles
 */
const DEFAULT_CONFIG = {
  enabled: true,
  levels: {
    log: false,
    debug: false,
    warn: true,
    error: true,
    group: false,
    groupEnd: false,
  },
  namespaces: {}, // e.g., { Transaction: true }
  methods: {}, // e.g., { 'Transaction.setAmount': true }
};

/**
 * Retrieves the current logger configuration from global scope.
 * Initializes the configuration if it doesn't exist.
 * 
 * @returns {Object} The current logger configuration object
 * 
 * @example
 * const config = getConfig();
 * console.log(config.enabled); // true
 */
function getConfig() {
  const g = globalThis;
  if (!g.__LOG_CFG) {
    g.__LOG_CFG = { ...DEFAULT_CONFIG };
  }
  return g.__LOG_CFG;
}

/**
 * Updates the global logger configuration with partial settings.
 * Merges new settings with existing configuration.
 * 
 * @param {Object} partial - Partial configuration object to merge
 * @param {boolean} [partial.enabled] - Enable/disable all logging
 * @param {Object} [partial.levels] - Log level toggles
 * @param {Object} [partial.namespaces] - Namespace-specific toggles
 * @param {Object} [partial.methods] - Method-specific toggles
 * 
 * @example
 * setLoggerConfig({ 
 *   levels: { debug: true }, 
 *   namespaces: { Transaction: true } 
 * });
 */
export function setLoggerConfig(partial) {
  const current = getConfig();
  globalThis.__LOG_CFG = {
    ...current,
    ...partial,
    levels: { ...current.levels, ...(partial?.levels || {}) },
    namespaces: { ...current.namespaces, ...(partial?.namespaces || {}) },
    methods: { ...current.methods, ...(partial?.methods || {}) },
  };
}

/**
 * Converts various input types to boolean values.
 * Handles booleans, numbers, strings, and truthy/falsy values.
 * 
 * @param {*} v - Value to convert to boolean
 * @returns {boolean} Converted boolean value
 * 
 * @example
 * asBool(true);      // true
 * asBool(1);         // true
 * asBool("false");   // false
 * asBool("yes");     // true
 * asBool(0);         // false
 */
function asBool(v) {
  if (v === true || v === false) return v;
  if (typeof v === 'number') return v !== 0;
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase();
    if (s === 'false' || s === '0' || s === 'off' || s === 'no') return false;
    if (s === 'true' || s === '1' || s === 'on' || s === 'yes') return true;
    return Boolean(s);
  }
  return Boolean(v);
}

/**
 * Determines if logging is enabled for a specific level, namespace, and method.
 * Checks configuration in order: method-specific, namespace-specific, wildcard, then default.
 * 
 * @param {string} level - Log level to check (log, debug, warn, error, group, groupEnd)
 * @param {string} ns - Namespace identifier
 * @param {string} [methodName] - Optional method name for method-specific checks
 * @returns {boolean} True if logging should occur, false otherwise
 * 
 * @example
 * isEnabled('debug', 'Transaction');              // checks namespace config
 * isEnabled('log', 'Transaction', 'setAmount');   // checks method-specific config
 */
function isEnabled(level, ns, methodName) {
  const cfg = getConfig();
  if (!cfg.enabled) return false;

  const lvl = asBool(cfg.levels[level]);
  if (!lvl) return false;

  const methodKey = methodName ? `${ns}.${methodName}` : ns;
  if (Object.prototype.hasOwnProperty.call(cfg.methods, methodKey)) {
    return asBool(cfg.methods[methodKey]);
  }
  if (Object.prototype.hasOwnProperty.call(cfg.namespaces, ns)) {
    return asBool(cfg.namespaces[ns]);
  }
  if (Object.prototype.hasOwnProperty.call(cfg.namespaces, '*')) {
    return asBool(cfg.namespaces['*']);
  }
  return true;
}

/**
 * Creates a namespaced logger instance with scoped logging methods.
 * Each log method includes the namespace and optional method name as a prefix.
 * 
 * @param {string} namespace - Namespace identifier for the logger
 * @returns {Object} Logger instance with group, groupEnd, log, debug, warn, and error methods
 * 
 * @example
 * const logger = getLogger('Transaction');
 * logger.log('setAmount', 'Amount set to', 100);  // [Transaction.setAmount] Amount set to 100
 * logger.error('validate', 'Validation failed');  // [Transaction.validate] Validation failed
 * 
 * @example
 * const logger = getLogger('API');
 * logger.group('fetchData', 'Starting fetch');
 * logger.debug('fetchData', 'Request details:', { url: '/api/data' });
 * logger.groupEnd('fetchData');
 */
export function getLogger(namespace) {
  const ns = String(namespace || 'log');
  const buildPrefix = (m) => `[${ns}${m ? `.${m}` : ''}]`;

  return {
    group(methodName, ...args) {
      if (!isEnabled('group', ns, methodName)) return;
      console.group(buildPrefix(methodName), ...args);
    },
    groupEnd(methodName) {
      const cfg = getConfig();
      if (!cfg.enabled) return;
      // End group if the original group was enabled or if groupEnd level is explicitly enabled
      if (isEnabled('group', ns, methodName) || asBool(cfg.levels.groupEnd)) {
        console.groupEnd();
      }
    },
    log(methodName, ...args) {
      if (!isEnabled('log', ns, methodName)) return;
      console.log(buildPrefix(methodName), ...args);
    },
    debug(methodName, ...args) {
      if (!isEnabled('debug', ns, methodName)) return;
      console.debug(buildPrefix(methodName), ...args);
    },
    warn(methodName, ...args) {
      if (!isEnabled('warn', ns, methodName)) return;
      console.warn(buildPrefix(methodName), ...args);
    },
    error(methodName, ...args) {
      if (!isEnabled('error', ns, methodName)) return;
      console.error(buildPrefix(methodName), ...args);
    },
  };
}

export default getLogger;
