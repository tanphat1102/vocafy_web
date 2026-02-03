"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Bell, LogOut, Shield, User } from "lucide-react";
import { authService, type User as UserType } from "@/services";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface ManagerNavbarProps {
  user: UserType | null;
  onLogout: () => void;
}

export function ManagerNavbar({ user, onLogout }: ManagerNavbarProps) {
  const handleLogout = async () => {
    try {
      await authService.logout();
      // Manager route is protected, so redirect to home
      window.location.href = "/";
      onLogout();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          {user?.role === "ADMIN" && (
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Admin Panel
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, Admin
              </p>
            </div>
          )}
          {user?.role === "MANAGER" && (
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Admin Panel
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, Admin
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user?.profile?.avatar_url || ""}
                    alt={user?.profile?.display_name || user?.email || "Admin"}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {(user?.profile?.display_name || user?.email || "A")
                      .charAt(0)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-foreground">
                  {user?.profile?.display_name || user?.email}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                Admin Features
              </div>
              <DropdownMenuItem asChild>
                <Link href="/admin">Users</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/payments">Premium Packages</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/payments">Subscription Transactions</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/payments">Payment Methods</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user?.role === "ADMIN" && (
                <>
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                    Switch Role
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Admin
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/manager" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Manager
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      User
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {user?.role === "MANAGER" && (
                <>
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                    Switch Role
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      User
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
