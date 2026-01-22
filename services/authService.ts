import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";

import { auth, isFirebaseConfigured } from "@/lib/firebase";

export const AUTH_ID_TOKEN_STORAGE_KEY = "vocafy:idToken";

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function saveIdTokenToLocalStorage(idToken: string) {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(AUTH_ID_TOKEN_STORAGE_KEY, idToken);
}

function removeIdTokenFromLocalStorage() {
  if (!canUseLocalStorage()) return;
  window.localStorage.removeItem(AUTH_ID_TOKEN_STORAGE_KEY);
}

async function signInWithGoogleAndSync(): Promise<{ user: User; idToken: string }> {
  if (!auth || !isFirebaseConfigured) {
    throw new Error("Firebase is not configured. Please set up environment variables.");
  }
  
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const idToken = await user.getIdToken();

  saveIdTokenToLocalStorage(idToken);

  // TODO: If you have an API to sync user info to your backend,
  // call it here using `idToken` for authentication.

  return { user, idToken };
}

async function logout(): Promise<void> {
  if (!auth || !isFirebaseConfigured) {
    removeIdTokenFromLocalStorage();
    return;
  }
  await signOut(auth);
  removeIdTokenFromLocalStorage();
}

export const authService = {
  signInWithGoogleAndSync,
  logout,
  saveIdTokenToLocalStorage,
  removeIdTokenFromLocalStorage,
};
