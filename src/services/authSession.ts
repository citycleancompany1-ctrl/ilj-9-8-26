/**
 * Authentication Session Management for IndianLalaJi Platform.
 * Ensures strict route guarding and prevents unauthorized dashboard access after logout.
 */

export interface AuthSession {
  role: 'VISITOR' | 'VENDOR' | 'ADMIN';
  shopId: string | null;
  vendorName?: string;
  email?: string;
  loginAt: number;
}

const AUTH_STORAGE_KEY = 'INDIANLALAJI_AUTH_SESSION_V2';

/**
 * Loads the active user session from browser storage.
 */
export function loadUserSession(): AuthSession {
  if (typeof window === 'undefined') {
    return { role: 'VISITOR', shopId: null, loginAt: 0 };
  }

  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return { role: 'VISITOR', shopId: null, loginAt: 0 };
    }

    const session: AuthSession = JSON.parse(raw);
    if (session && (session.role === 'VENDOR' || session.role === 'ADMIN')) {
      if (session.role === 'VENDOR' && !session.shopId) {
        clearUserSession();
        return { role: 'VISITOR', shopId: null, loginAt: 0 };
      }
      return session;
    }
  } catch (err) {
    console.warn('Failed to parse auth session:', err);
  }

  return { role: 'VISITOR', shopId: null, loginAt: 0 };
}

/**
 * Persists the user session to both localStorage and sessionStorage.
 */
export function saveUserSession(session: AuthSession): void {
  if (typeof window === 'undefined') return;

  try {
    const serialized = JSON.stringify(session);
    localStorage.setItem(AUTH_STORAGE_KEY, serialized);
    sessionStorage.setItem(AUTH_STORAGE_KEY, serialized);
  } catch (err) {
    console.error('Failed to save auth session:', err);
  }
}

/**
 * Completely clears and invalidates the session upon logout.
 */
export function clearUserSession(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    // Also clear any legacy keys
    localStorage.removeItem('INDIANLALAJI_AUTH_SESSION_V1');
    sessionStorage.removeItem('INDIANLALAJI_AUTH_SESSION_V1');
  } catch (err) {
    console.error('Failed to clear auth session:', err);
  }
}

/**
 * Verifies if currently authenticated as a valid Vendor.
 */
export function isVendorAuthenticated(): boolean {
  const session = loadUserSession();
  return session.role === 'VENDOR' && Boolean(session.shopId);
}

/**
 * Verifies if currently authenticated as Super Admin.
 */
export function isAdminAuthenticated(): boolean {
  const session = loadUserSession();
  return session.role === 'ADMIN';
}
