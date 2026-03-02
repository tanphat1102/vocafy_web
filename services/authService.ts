import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";

import {
  AUTH_ACCESS_TOKEN_STORAGE_KEY,
  AUTH_REFRESH_TOKEN_STORAGE_KEY,
  AUTH_STATE_CHANGED_EVENT,
} from "@/lib/auth-constants";
import {
  clearAuthTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  saveAuthTokens,
} from "@/lib/auth-storage";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import {
  decodeToken,
  getUserRoleFromDecodedToken,
  type DecodedToken,
} from "@/lib/jwt";
import { API_BASE_URL } from "./config";

interface AuthTokenPair {
  accessToken: string;
  refreshToken: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  result: T;
}

function emitAuthStateChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT));
}

function saveTokensToLocalStorage(accessToken: string, refreshToken: string) {
  saveAuthTokens(accessToken, refreshToken);
  emitAuthStateChanged();
}

function removeTokensFromLocalStorage() {
  clearAuthTokens();
  emitAuthStateChanged();
}

function getAccessToken(): string | null {
  return getStoredAccessToken();
}

function getRefreshToken(): string | null {
  return getStoredRefreshToken();
}

function getApiMessage(payload: unknown, fallback: string): string {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  return fallback;
}

function isApiEnvelope<T>(payload: unknown): payload is ApiEnvelope<T> {
  return (
    !!payload &&
    typeof payload === "object" &&
    "success" in payload &&
    typeof payload.success === "boolean" &&
    "result" in payload
  );
}

async function parseApiEnvelope<T>(
  response: Response,
  fallbackError: string,
): Promise<ApiEnvelope<T>> {
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getApiMessage(payload, fallbackError));
  }

  if (!isApiEnvelope<T>(payload) || !payload.success) {
    throw new Error(getApiMessage(payload, fallbackError));
  }

  return payload;
}

async function postAuthEndpoint<T>(
  endpoint: string,
  body: unknown,
  fallbackError: string,
  accessToken?: string,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const payload = await parseApiEnvelope<T>(response, fallbackError);
  return payload.result;
}

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

  const { accessToken, refreshToken } = await postAuthEndpoint<AuthTokenPair>(
    "/auth/firebase",
    {
      id_token: idToken,
      fcm_token: "",
    },
    "Failed to authenticate with backend",
  );

  saveTokensToLocalStorage(accessToken, refreshToken);

  return { user, accessToken, refreshToken };
}

async function logout(): Promise<void> {
  const accessToken = getAccessToken();

  if (accessToken) {
    try {
      await postAuthEndpoint(
        "/auth/logout",
        {},
        "Failed to logout from backend",
        accessToken,
      );
    } catch {
      // Continue local logout even if backend call fails.
    }
  }

  if (auth && isFirebaseConfigured) {
    await signOut(auth);
  }

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

  const { accessToken, refreshToken: newRefreshToken } =
    await postAuthEndpoint<AuthTokenPair>(
      "/auth/refresh",
      {
        refresh_token: refreshToken,
      },
      "Failed to refresh token",
    );

  saveTokensToLocalStorage(accessToken, newRefreshToken);

  return accessToken;
}

function getUserInfoFromToken(): DecodedToken | null {
  const token = getAccessToken();
  if (!token) {
    return null;
  }
  return decodeToken(token);
}

function getUserRole(): string | null {
  return getUserRoleFromDecodedToken(getUserInfoFromToken());
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

export {
  AUTH_ACCESS_TOKEN_STORAGE_KEY,
  AUTH_REFRESH_TOKEN_STORAGE_KEY,
  AUTH_STATE_CHANGED_EVENT,
};
export type { DecodedToken };
