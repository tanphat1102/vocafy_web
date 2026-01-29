"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { authService } from "@/services/authService";
import { userService, type User as AppUser } from "@/services";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { onAuthStateChanged, type User } from "firebase/auth";
import { User as UserIcon, LogOut, Shield } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/introduction", label: "About" },
  { href: "/syllabus", label: "Syllabus" },
  { href: "/extension", label: "Extension" },
  { href: "/ai-tutor", label: "AI Tutor" },
  { href: "/plans", label: "Plans" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) return;
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        fetchAppUser();
      } else {
        setAppUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const fetchAppUser = async () => {
    try {
      const response = await userService.getProfile();
      if (response.success) {
        setAppUser(response.result);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

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
      setDropdownOpen(false);
      router.push("/");
    } catch (err) {
      console.error("Sign out failed", err);
    } finally {
      setIsAuthLoading(false);
    }
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

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full p-1 hover:bg-muted transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={appUser?.profile?.avatar_url || ""}
                      alt={appUser?.profile?.display_name || user.email || ""}
                    />
                    <AvatarFallback className="bg-linear-to-br from-primary to-accent text-primary-foreground">
                      {(
                        appUser?.profile?.display_name ||
                        user.displayName ||
                        user.email ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-foreground">
                    {appUser?.profile?.display_name ||
                      user.displayName ||
                      "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    router.push("/profile");
                    setDropdownOpen(false);
                  }}
                  className="cursor-pointer gap-2"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>

                {/* Role-based Menu Items */}
                {appUser?.role === "ADMIN" && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                      Admin Panel
                    </div>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/admin");
                        setDropdownOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      Users
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/admin/payments");
                        setDropdownOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      Premium Packages
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/admin/payments");
                        setDropdownOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      Subscription Transactions
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/admin/payments");
                        setDropdownOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      Payment Methods
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                      Switch Role
                    </div>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/manager");
                        setDropdownOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Manager
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/");
                        setDropdownOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <UserIcon className="h-4 w-4 mr-2" />
                      User
                    </DropdownMenuItem>
                  </>
                )}

                {appUser?.role === "MANAGER" && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                      Manager Panel
                    </div>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/manager/syllabuses");
                        setDropdownOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      Syllabuses
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/manager/vocabularies");
                        setDropdownOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      Vocabularies
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/manager/courses");
                        setDropdownOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      Courses
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/manager/topics");
                        setDropdownOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      Topics
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                      Switch Role
                    </div>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/");
                        setDropdownOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <UserIcon className="h-4 w-4 mr-2" />
                      User
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isAuthLoading}
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                  variant="destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{isAuthLoading ? "Logging out..." : "Logout"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
    </header>
  );
}
