import crypto from 'crypto';
import {
  SALT,
  PBKDF2_ITERATIONS,
  AUTH_TAG_LENGTH,
  ALGORITHM_NODE,
  DIGEST,
  IV_LENGTH,
  KEY_LENGTH,
  ENCODING
} from './cryptoSpec.js';

/**
 * Decrypts a base64-encoded password using AES-GCM and PBKDF2.
 *
 * The function expects a base64-encoded string that was previously encrypted with:
 * - a derived key using the user's email and a fixed salt
 * - AES-GCM mode, with the IV prepended and auth tag appended to the ciphertext
 *
 * @param {string} email - The email used as the key derivation input.
 * @param {string} base64Encrypted - The base64-encoded encrypted password string.
 * @returns {string} - The decrypted plaintext password.
 * @throws {Error} - Throws an error if decryption fails (e.g., invalid auth tag, bad input).
 */
export function decryptPassword(email, base64Encrypted) {
  console.group("decryptPassword");
  try {
    const encryptedBuffer = Buffer.from(base64Encrypted, 'base64');

    const iv = encryptedBuffer.slice(0, IV_LENGTH);
    const ciphertext = encryptedBuffer.slice(IV_LENGTH, encryptedBuffer.length - AUTH_TAG_LENGTH);
    const authTag = encryptedBuffer.slice(encryptedBuffer.length - AUTH_TAG_LENGTH);

    const key = crypto.pbkdf2Sync(email, SALT, PBKDF2_ITERATIONS, KEY_LENGTH, DIGEST);
    const decipher = crypto.createDecipheriv(ALGORITHM_NODE, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    console.groupEnd("decryptPassword");
    return decrypted.toString(ENCODING);
  } catch (err) {
    console.error("❌ Error decrypting password:", err);
    console.groupEnd("decryptPassword");
    throw new Error("Failed to decrypt password. Please try again.");
  }
}

