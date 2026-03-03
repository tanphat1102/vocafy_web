"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { authService, AUTH_STATE_CHANGED_EVENT } from "@/services/authService";
import { userService, type User as AppUser } from "@/services";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserProfileDropdown } from "@/components/layout/avtDropdownMenu";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/introduction", label: "About" },
  { href: "/syllabus", label: "Syllabus" },
  { href: "/extension", label: "Extension" },
  { href: "/plans", label: "Plans" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const isFetchingRef = useRef(false);

  const fetchAppUser = useCallback(async () => {
    if (isFetchingRef.current) return; // Prevent multiple concurrent requests

    isFetchingRef.current = true;
    try {
      setIsProfileLoading(true);
      setProfileError(false);
      const response = await userService.getProfile();
      if (response.success) {
        setAppUser(response.result);
      } else {
        setProfileError(true);
      }
    } catch {
      // Mark profile fetch as failed, use Firebase data as fallback
      setProfileError(true);
    } finally {
      setIsProfileLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) return;
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        // Only fetch if backend is available (check env var or skip for now)
        const shouldFetchBackend =
          process.env.NEXT_PUBLIC_ENABLE_BACKEND !== "false";
        const hasAccessToken = !!authService.getAccessToken();
        if (shouldFetchBackend && hasAccessToken) {
          fetchAppUser();
        } else {
          // Use Firebase user data only
          setProfileError(true); // Mark as error to use fallback
        }
      } else {
        setAppUser(null);
        setProfileError(false);
      }
    });
    return unsubscribe;
  }, [fetchAppUser]);

  useEffect(() => {
    const syncAuthState = () => {
      const accessToken = authService.getAccessToken();
      if (accessToken) {
        fetchAppUser();
        if (auth?.currentUser) {
          setUser(auth.currentUser);
        }
        return;
      }

      setAppUser(null);
      setProfileError(false);
      if (!auth?.currentUser) {
        setUser(null);
      }
    };

    syncAuthState();
    window.addEventListener(AUTH_STATE_CHANGED_EVENT, syncAuthState);
    return () => {
      window.removeEventListener(AUTH_STATE_CHANGED_EVENT, syncAuthState);
    };
  }, [fetchAppUser]);

  const handleGoogleLogin = async () => {
    try {
      setIsAuthLoading(true);
      await authService.signInWithGoogleAndSync();
    } catch (err) {
      console.error("Google sign-in failed", err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const dropdownUser: AppUser | null =
    appUser ||
    (user && profileError
      ? {
          id: user.uid,
          email: user.email || "",
          role: "USER" as const,
          status: "ACTIVE" as const,
          last_login_at: null,
          last_active_at: null,
          sepay_code: null,
          fcm_token: null,
          profile: {
            user_id: user.uid,
            display_name:
              user.displayName || user.email?.split("@")[0] || "User",
            avatar_url: user.photoURL || null,
            locale: null,
            timezone: null,
          },
          created_at: "",
          updated_at: "",
        }
      : null);

  const handleLogoutSuccess = () => {
    // Protected routes that require authentication
    const protectedRoutes = ["/admin", "/manager", "/profile"];
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route),
    );

    // Only redirect to home if on a protected route
    if (isProtectedRoute) {
      router.push("/");
    }
    // Otherwise stay on current page (public routes)
  };

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <Image
            src="/images/logoFull.png"
            alt="Vocafy"
            width={100}
            height={32}
            priority
            className="group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-all duration-300 relative group",
                  isActive
                    ? "text-primary dark:text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                    isActive ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-70 sm:w-80">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "text-base font-medium py-2 px-4 rounded-lg transition-all duration-300",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Auth Section */}
              <div className="mt-8 pt-6 border-t border-border">
                {dropdownUser ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {dropdownUser.profile?.avatar_url ? (
                          <Image
                            src={dropdownUser.profile.avatar_url}
                            alt="User avatar"
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-primary">
                            {dropdownUser.profile?.display_name?.[0]?.toUpperCase() ||
                              dropdownUser.email?.[0]?.toUpperCase() ||
                              "U"}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {dropdownUser.profile?.display_name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {dropdownUser.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/profile");
                      }}
                    >
                      View Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={async () => {
                        setIsMobileMenuOpen(false);
                        await authService.logout();
                        handleLogoutSuccess();
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                ) : isProfileLoading ||
                  (!!authService.getAccessToken() && !appUser) ? (
                  <div className="h-10 rounded-full bg-muted animate-pulse" />
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleLogin}
                    disabled={isAuthLoading}
                    className="w-full"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
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
            </SheetContent>
          </Sheet>

          {/* Desktop Auth */}
          <div className="hidden md:block">
            {dropdownUser ? (
              <UserProfileDropdown
                user={dropdownUser}
                email={dropdownUser.email || undefined}
                onLogoutSuccess={handleLogoutSuccess}
              />
            ) : isProfileLoading ||
              (!!authService.getAccessToken() && !appUser) ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isAuthLoading}
                className="rounded-full"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
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
      </div>
    </header>
  );
}
