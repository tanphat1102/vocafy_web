"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { authService } from "@/services/authService";
import {
  onAuthStateChanged,
  type User,
} from "firebase/auth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/introduction", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/topic", label: "Topic" },
  { href: "/ai-tutor", label: "AI Tutor" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
    });
    return unsubscribe;
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsAuthLoading(true);
      await authService.signInWithGoogleAndSync();
    } catch (err) {
      console.error("Google sign-in failed", err);
      window.alert("Google sign-in failed. Please try again.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsAuthLoading(true);
      await authService.logout();
    } catch (err) {
      console.error("Sign out failed", err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logoFull.png"
            alt="Vocafy"
            width={100}
            height={32}
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-indigo-600 border-b-2 border-indigo-600 pb-1"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-gray-700">
                {user.displayName ?? user.email ?? "Signed in"}
              </span>
              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
                disabled={isAuthLoading}
                className="rounded-full"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isAuthLoading}
              className="rounded-full border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isAuthLoading ? "Signing in..." : "Sign in with Google"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
