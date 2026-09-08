/**
 * Security & Password hashing utilities for IndianLalaJi Multi-Vendor Platform.
 * Enforces per-vendor unique secure passwords without universal fallbacks.
 */

// Generate a hex string from an ArrayBuffer
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hash a password using browser Web Crypto SHA-256 salted with shopId & platform secret.
 */
export async function hashPassword(password: string, shopId: string): Promise<string> {
  const cleanPass = (password || '').trim();
  if (!cleanPass) return '';

  const salt = `ILJ_${shopId || 'GLOBAL'}_SALT_2026#`;
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${cleanPass}`);

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return `sha256$${bufferToHex(hashBuffer)}`;
  }

  // Fallback simple bitwise hash for environments without crypto.subtle
  let hash = 0;
  const str = `${salt}:${cleanPass}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash$${Math.abs(hash).toString(16)}`;
}

/**
 * Verify an input password against stored hash or existing password.
 * Strictly checks the specific vendor's credentials with NO universal fallback.
 */
export async function verifyPassword(
  inputPassword: string,
  storedValue: string | undefined,
  shopId: string
): Promise<boolean> {
  if (!inputPassword || !storedValue) {
    return false;
  }

  const trimmedInput = inputPassword.trim();
  const trimmedStored = storedValue.trim();

  // If stored as sha256$...
  if (trimmedStored.startsWith('sha256$') || trimmedStored.startsWith('hash$')) {
    const computed = await hashPassword(trimmedInput, shopId);
    return computed === trimmedStored;
  }

  // If stored as plain string (e.g. newly set by admin or legacy), direct exact comparison
  return trimmedInput === trimmedStored;
}

/**
 * Generate an 8-character human-friendly random secure password
 */
export function generateSecurePassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '@#$*';
  
  let pwd = '';
  pwd += upper.charAt(Math.floor(Math.random() * upper.length));
  pwd += lower.charAt(Math.floor(Math.random() * lower.length));
  pwd += numbers.charAt(Math.floor(Math.random() * numbers.length));
  pwd += symbols.charAt(Math.floor(Math.random() * symbols.length));

  const all = upper + lower + numbers + symbols;
  for (let i = 4; i < 8; i++) {
    pwd += all.charAt(Math.floor(Math.random() * all.length));
  }
  
  // Shuffle characters
  return pwd.split('').sort(() => 0.5 - Math.random()).join('');
}
