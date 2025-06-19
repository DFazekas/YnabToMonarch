// utils/state.js — utility to patch state objects
export function patchState(target, updates) {
  if (!target || typeof target !== 'object') throw new Error('Target must be an object');
  Object.entries(updates).forEach(([key, value]) => {
    target[key] = value;
  });
}

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
