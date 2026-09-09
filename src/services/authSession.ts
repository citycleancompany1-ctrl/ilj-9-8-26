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
const REMEMBERED_SHOP_KEY = 'INDIANLALAJI_REMEMBERED_SHOP_ID';

/**
 * Loads the active user session from browser sessionStorage.
 * Using sessionStorage ensures that when the browser/tab is closed or reopened,
 * or when the website URL is typed in a fresh tab, the user MUST log in with password
 * and the dashboard does NOT open automatically without authentication.
 */
export function loadUserSession(): AuthSession {
  if (typeof window === 'undefined') {
    return { role: 'VISITOR', shopId: null, loginAt: 0 };
  }

  try {
    // Only check sessionStorage for active authenticated login state
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
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
 * Persists the user session to sessionStorage for the active window.
 * Also saves the remembered shopId for prefilling login forms conveniently.
 */
export function saveUserSession(session: AuthSession): void {
  if (typeof window === 'undefined') return;

  try {
    const serialized = JSON.stringify(session);
    sessionStorage.setItem(AUTH_STORAGE_KEY, serialized);
    // Remove persistent full login from localStorage so typing URL in a new tab requires login
    localStorage.removeItem(AUTH_STORAGE_KEY);

    if (session.shopId) {
      localStorage.setItem(REMEMBERED_SHOP_KEY, session.shopId);
    }
  } catch (err) {
    console.error('Failed to save auth session:', err);
  }
}

/**
 * Gets the last remembered shop ID (for login form prefilling only, not auto-login)
 */
export function getRememberedShopId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(REMEMBERED_SHOP_KEY) || null;
  } catch {
    return null;
  }
}

/**
 * Completely clears and invalidates the session upon logout.
 */
export function clearUserSession(): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
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
