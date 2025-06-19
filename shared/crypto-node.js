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

