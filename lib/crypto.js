// PIN hashing using the browser's built-in Web Crypto API (SubtleCrypto).
// SHA-256 is used so the PIN is never stored as plain text in localStorage.
// Limitation (documented in project brief): SHA-256 without salt is not
// production-grade. A future iteration would use bcrypt via a Server Action.

/**
 * Hash a PIN string with SHA-256 using SubtleCrypto.
 * Returns a hex string like "a665a45920422f..."
 * This is an async function because SubtleCrypto.digest() returns a Promise.
 */
export async function hashPIN(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  // Convert ArrayBuffer → hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Compare an entered PIN against a stored SHA-256 hash.
 * Returns true if they match.
 */
export async function verifyPIN(enteredPin, storedHash) {
  const enteredHash = await hashPIN(enteredPin);
  return enteredHash === storedHash;
}
