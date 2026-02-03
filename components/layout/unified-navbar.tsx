"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserProfileDropdown } from "@/components/layout/avtDropdownMenu";
import { Menu } from "lucide-react";
import { type User as UserType } from "@/services";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface UnifiedNavbarProps {
  user: UserType | null;
  onLogout: () => void;
}

export function UnifiedNavbar({ user, onLogout }: UnifiedNavbarProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  const panelTitle = isAdminRoute ? "Admin Panel" : "Manager Panel";
  const welcomeMessage = isAdminRoute
    ? "Welcome back, Admin"
    : "Welcome back, Manager";

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{panelTitle}</h1>
            <p className="text-sm text-muted-foreground">{welcomeMessage}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {user ? (
            <UserProfileDropdown
              user={user}
              onLogoutSuccess={onLogout}
              redirectAfterLogout="/"
              triggerClassName="relative h-10 w-10 rounded-full hover:bg-muted transition-colors flex items-center justify-center"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
}
