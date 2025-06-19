/**
 * Deeply applies an update object to a target state object by shallow merging properties.
 * This mutates the original target object.
 *
 * @param {Object} target - The state object to update.
 * @param {Object} updates - An object containing key-value pairs to apply to the target.
 * @throws Will throw an error if the target is not an object.
 */
export function patchState(target, updates) {
  if (!target || typeof target !== 'object') throw new Error('Target must be an object');
  Object.entries(updates).forEach(([key, value]) => {
    target[key] = value;
  });
}

/**
 * Resets all keys in a given state object to an appropriate default value.
 * - Arrays become empty arrays.
 * - Objects become empty objects.
 * - Booleans become false.
 * - All other types become empty strings.
 *
 * This is useful for clearing UI or API-related state without removing the keys themselves.
 *
 * @param {Object} target - The state object to clear.
 * @throws Will throw an error if the target is not an object.
 */
export function clearState(target) {
  if (!target || typeof target !== 'object') throw new Error('Target must be an object');
  Object.keys(target).forEach(key => {
    const value = target[key];
    if (Array.isArray(value)) target[key] = [];
    else if (typeof value === 'object' && value !== null) target[key] = {};
    else if (typeof value === 'boolean') target[key] = false;
    else target[key] = '';
  });
}
