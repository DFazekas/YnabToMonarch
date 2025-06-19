import {
  SALT,
  PBKDF2_ITERATIONS,
  AUTH_TAG_LENGTH,
  ALGORITHM_WEB,
  DIGEST,
  IV_LENGTH
} from './cryptoSpec.js';

function concatBuffers(...buffers) {
  let totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
  let combined = new Uint8Array(totalLength);
  let offset = 0;
  for (let b of buffers) {
    combined.set(b, offset);
    offset += b.length;
  }
  return combined;
}

/**
 * Encrypts a plaintext password using AES-GCM in the browser.
 *
 * The encryption uses a key derived via PBKDF2 from the user's email and a static salt.
 * The output is a base64-encoded string composed of:
 *   [ IV (12 bytes) | Ciphertext | Auth Tag (16 bytes) ]
 *
 * This format ensures compatibility with the corresponding Node.js decryption logic.
 *
 * @param {string} email - The email used as input to the PBKDF2 key derivation function.
 * @param {string} plaintextPassword - The password to encrypt.
 * @returns {Promise<string>} - A base64-encoded string containing the encrypted payload.
 * @throws {Error} - Throws if encryption fails for any reason (e.g., unsupported algorithm).
 */
export async function encryptPassword(email, plaintextPassword) {
  console.group("encryptPassword");
  try {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    const keyMaterial = await crypto.subtle.importKey(
      'raw', encoder.encode(email), { name: 'PBKDF2' }, false, ['deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode(SALT),
        iterations: PBKDF2_ITERATIONS,
        hash: DIGEST
      },
      keyMaterial,
      { name: ALGORITHM_WEB, length: 256 },
      true,
      ['encrypt']
    );

    const encoded = encoder.encode(plaintextPassword);
    const encrypted = await crypto.subtle.encrypt({ name: ALGORITHM_WEB, iv }, key, encoded);
    const bytes = new Uint8Array(encrypted);

    const tag = bytes.slice(-AUTH_TAG_LENGTH);
    const ciphertext = bytes.slice(0, -AUTH_TAG_LENGTH);
    const full = concatBuffers(iv, ciphertext, tag);

    return btoa(String.fromCharCode(...full));
  } catch (err) {
    console.error("❌ Error encrypting password:", err);
    console.groupEnd("encryptPassword");
    throw new Error("Failed to encrypt password. Please try again.");
  }
}
