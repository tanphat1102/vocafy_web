"use client";

import { useSyncExternalStore } from "react";

let hydrated = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (typeof window !== "undefined" && !hydrated) {
    queueMicrotask(() => {
      hydrated = true;
      listeners.forEach((callback) => callback());
    });
  }

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return hydrated;
}

function getServerSnapshot() {
  return false;
}

export function useHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

