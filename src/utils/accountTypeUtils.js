import monarchAccountTypes from '../../public/static-data/monarchAccountTypes.json';

/**
 * Find an account type object by its internal display name.
 * @param {string} typeDisplayName
 * @returns {object | undefined}
 */
export function getAccountTypeByDisplayName(typeDisplayName) {
  return monarchAccountTypes.data.find(t => t.typeDisplay === typeDisplayName);
}

/**
 * Find a subtype object by its parent type and internal display name.
 * @param {string} typeName
 * @param {string} subtypeName
 * @returns {object | undefined}
 */
export function getSubtypeByDisplayName(typeDisplayName, subtypeDisplayName) {
  const type = getAccountTypeByName(typeDisplayName);
  return type?.subtypes.find(s => s.display === subtypeDisplayName);
}

import monarchAccountTypes from '../../public/static-data/monarchAccountTypes.json';

/**
 * Find an account type object by its internal name.
 * @param {string} typeName
 * @returns {object | undefined}
 */
export function getAccountTypeByName(typeName) {
  return monarchAccountTypes.data.find(t => t.typeName === typeName);
}

/**
 * Find a subtype object by its parent type and internal name.
 * @param {string} typeName
 * @param {string} subtypeName
 * @returns {object | undefined}
 */
export function getSubtypeByName(typeName, subtypeName) {
  const type = getAccountTypeByName(typeName);
  return type?.subtypes.find(s => s.name === subtypeName);
}
