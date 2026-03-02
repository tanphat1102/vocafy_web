"use client";

import { useEffect } from "react";
import { ToastContainer, Flip, toast } from "react-toastify";
import { useTheme } from "@/components/theme-provider";
import { useHydrated } from "@/lib/use-hydrated";

declare global {
  interface Window {
    __vocafyOriginalAlert?: (message?: string) => void;
  }
}

export function ToastProvider() {
  const { resolvedTheme } = useTheme();
  const hydrated = useHydrated();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.__vocafyOriginalAlert) {
      window.__vocafyOriginalAlert = window.alert.bind(window);
    }

    window.alert = (message?: string) => {
      toast.info(message || "Notification");
    };

    return () => {
      if (window.__vocafyOriginalAlert) {
        window.alert = window.__vocafyOriginalAlert;
      }
    };
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <ToastContainer
      position="top-right"
      autoClose={2500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme={resolvedTheme}
      transition={Flip}
    />
  );
}
