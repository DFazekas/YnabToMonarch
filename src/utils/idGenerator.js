/**
 * Generate a short, pseudo-random unique ID
 * 
 * @returns {string} A unique ID string prefixed with "id-"
 * @example
 * generateId(); // Returns: "id-x3k9m2p"
 */
export default function generateId() {
  return 'id-' + Math.random().toString(36).slice(2, 11);
}
