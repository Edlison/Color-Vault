import Cookies from 'js-cookie';

const CONSENT_COOKIE_KEY = 'cv_consent';
const CONSENT_VALUE = 'accepted';

/**
 * Check if the user has accepted the cookie/storage consent
 */
export function hasConsent(): boolean {
  return Cookies.get(CONSENT_COOKIE_KEY) === CONSENT_VALUE;
}

/**
 * Set the consent cookie (expires in 1 year)
 */
export function setConsent(): void {
  Cookies.set(CONSENT_COOKIE_KEY, CONSENT_VALUE, { 
    expires: 365,
    sameSite: 'lax'
  });
}

/**
 * Remove the consent cookie
 */
export function revokeConsent(): void {
  Cookies.remove(CONSENT_COOKIE_KEY);
}
