import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";

import { auth, isFirebaseConfigured } from "@/lib/firebase";

export const AUTH_ACCESS_TOKEN_STORAGE_KEY = "vocafy:accessToken";
export const AUTH_REFRESH_TOKEN_STORAGE_KEY = "vocafy:refreshToken";

export interface DecodedToken {
  sub: string; // user_id
  email?: string;
  role?: string;
  roles?: string[];
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

function canUseLocalStorage() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

function saveTokensToLocalStorage(accessToken: string, refreshToken: string) {
  if (!canUseLocalStorage()) return;

  // Save to localStorage
  window.localStorage.setItem(AUTH_ACCESS_TOKEN_STORAGE_KEY, accessToken);
  window.localStorage.setItem(AUTH_REFRESH_TOKEN_STORAGE_KEY, refreshToken);

  // Also save to cookies for middleware
  setCookie(AUTH_ACCESS_TOKEN_STORAGE_KEY, accessToken, 7);
  setCookie(AUTH_REFRESH_TOKEN_STORAGE_KEY, refreshToken, 7);
}

function removeTokensFromLocalStorage() {
  if (!canUseLocalStorage()) return;

  // Remove from localStorage
  window.localStorage.removeItem(AUTH_ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_REFRESH_TOKEN_STORAGE_KEY);

  // Remove from cookies
  deleteCookie(AUTH_ACCESS_TOKEN_STORAGE_KEY);
  deleteCookie(AUTH_REFRESH_TOKEN_STORAGE_KEY);
}

function getAccessToken(): string | null {
  if (!canUseLocalStorage()) return null;
  return window.localStorage.getItem(AUTH_ACCESS_TOKEN_STORAGE_KEY);
}

function getRefreshToken(): string | null {
  if (!canUseLocalStorage()) return null;
  return window.localStorage.getItem(AUTH_REFRESH_TOKEN_STORAGE_KEY);
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BACKEND_URL ||
  "https://vocafy.milize-lena.space/api";

async function signInWithGoogleAndSync(): Promise<{
  user: User;
  accessToken: string;
  refreshToken: string;
}> {
  if (!auth || !isFirebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Please set up environment variables.",
    );
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const idToken = await user.getIdToken();

  // Sync with backend API using new /api/auth/firebase endpoint
  const response = await fetch(`${API_BASE_URL}/auth/firebase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_token: idToken,
      fcm_token: "", // Optional: Add FCM token for push notifications if needed
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to authenticate with backend");
  }

  const data = await response.json();

  if (!data.success || !data.result) {
    throw new Error(data.message || "Authentication failed");
  }

  const { accessToken, refreshToken } = data.result;
  saveTokensToLocalStorage(accessToken, refreshToken);

  return { user, accessToken, refreshToken };
}

async function logout(): Promise<void> {
  // Call backend logout endpoint if we have an access token
  const accessToken = getAccessToken();

  if (accessToken) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Backend logout failed:", error);
      // Continue with local logout even if backend call fails
    }
  }

  // Sign out from Firebase
  if (auth && isFirebaseConfigured) {
    await signOut(auth);
  }

  // Clear local tokens
  removeTokensFromLocalStorage();
}

function getCurrentUser(): User | null {
  if (!auth || !isFirebaseConfigured) {
    return null;
  }
  return auth.currentUser;
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to refresh token");
  }

  const data = await response.json();

  if (!data.success || !data.result) {
    throw new Error(data.message || "Token refresh failed");
  }

  const { accessToken, refreshToken: newRefreshToken } = data.result;
  saveTokensToLocalStorage(accessToken, newRefreshToken);

  return accessToken;
}

function decodeToken(token: string): DecodedToken | null {
  try {
    // JWT has 3 parts separated by dots: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];

    // Replace URL-safe characters and add padding if needed
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padding = base64.length % 4;
    const padded = padding ? base64 + "=".repeat(4 - padding) : base64;

    // Decode base64
    const decoded = atob(padded);

    // Parse JSON
    return JSON.parse(decoded) as DecodedToken;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

function getUserInfoFromToken(): DecodedToken | null {
  const token = getAccessToken();
  if (!token) {
    return null;
  }
  return decodeToken(token);
}

function getUserRole(): string | null {
  const userInfo = getUserInfoFromToken();
  if (!userInfo) {
    return null;
  }

  // Check for role field (singular)
  if (userInfo.role) {
    return userInfo.role;
  }

  // Check for roles array (plural)
  if (
    userInfo.roles &&
    Array.isArray(userInfo.roles) &&
    userInfo.roles.length > 0
  ) {
    return userInfo.roles[0];
  }

  return null;
}

export const authService = {
  signInWithGoogleAndSync,
  logout,
  getCurrentUser,
  saveTokensToLocalStorage,
  removeTokensFromLocalStorage,
  getAccessToken,
  getRefreshToken,
  refreshAccessToken,
  decodeToken,
  getUserInfoFromToken,
  getUserRole,
};
