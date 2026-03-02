import {
  AUTH_ACCESS_TOKEN_STORAGE_KEY,
  AUTH_REFRESH_TOKEN_STORAGE_KEY,
} from "./auth-constants";

function canUseLocalStorage(): boolean {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

function setCookie(name: string, value: string, days = 7): void {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export function saveAuthTokens(accessToken: string, refreshToken: string): void {
  if (!canUseLocalStorage()) return;

  window.localStorage.setItem(AUTH_ACCESS_TOKEN_STORAGE_KEY, accessToken);
  window.localStorage.setItem(AUTH_REFRESH_TOKEN_STORAGE_KEY, refreshToken);

  setCookie(AUTH_ACCESS_TOKEN_STORAGE_KEY, accessToken, 7);
  setCookie(AUTH_REFRESH_TOKEN_STORAGE_KEY, refreshToken, 7);
}

export function clearAuthTokens(): void {
  if (!canUseLocalStorage()) return;

  window.localStorage.removeItem(AUTH_ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_REFRESH_TOKEN_STORAGE_KEY);

  deleteCookie(AUTH_ACCESS_TOKEN_STORAGE_KEY);
  deleteCookie(AUTH_REFRESH_TOKEN_STORAGE_KEY);
}

export function getStoredAccessToken(): string | null {
  if (!canUseLocalStorage()) return null;
  return window.localStorage.getItem(AUTH_ACCESS_TOKEN_STORAGE_KEY);
}

export function getStoredRefreshToken(): string | null {
  if (!canUseLocalStorage()) return null;
  return window.localStorage.getItem(AUTH_REFRESH_TOKEN_STORAGE_KEY);
}
