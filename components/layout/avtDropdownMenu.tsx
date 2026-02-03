"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User as UserIcon, LogOut, Shield } from "lucide-react";
import { authService, type User } from "@/services";

interface UserProfileDropdownProps {
  user: User;
  email?: string;
  onLogoutSuccess?: () => void;
  redirectAfterLogout?: string;
  triggerClassName?: string;
}

export function UserProfileDropdown({
  user,
  email,
  onLogoutSuccess,
  redirectAfterLogout = "/",
  triggerClassName,
}: UserProfileDropdownProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setDropdownOpen(false);
      onLogoutSuccess?.();
      router.push(redirectAfterLogout);
    } catch (err) {
      console.error("Sign out failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setDropdownOpen(false);
  };

  const displayName = user?.profile?.display_name || "User";
  const displayEmail = email || user?.email;
  const avatarUrl = user?.profile?.avatar_url || "";
  const avatarSize = triggerClassName?.includes("h-10")
    ? "h-10 w-10"
    : "h-8 w-8";

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={
            triggerClassName ||
            "flex items-center gap-2 rounded-full p-1 hover:bg-muted transition-colors"
          }
        >
          <Avatar className={avatarSize}>
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-linear-to-br from-primary to-accent text-primary-foreground">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium text-foreground">{displayName}</p>
          <p className="text-xs text-muted-foreground">{displayEmail}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleNavigation("/profile")}
          className="cursor-pointer gap-2"
        >
          <UserIcon className="h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>

        {/* Role-based Menu Items */}
        {user?.role === "ADMIN" && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
              Admin Panel
            </div>
            <DropdownMenuItem
              onClick={() => handleNavigation("/admin")}
              className="cursor-pointer"
            >
              Users
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleNavigation("/admin/payments")}
              className="cursor-pointer"
            >
              Premium Packages
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleNavigation("/admin/subscription-transactions")
              }
              className="cursor-pointer"
            >
              Subscription Transactions
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleNavigation("/admin/payments")}
              className="cursor-pointer"
            >
              Payment Methods
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
              Switch Role
            </div>
            <DropdownMenuItem
              onClick={() => handleNavigation("/manager")}
              className="cursor-pointer"
            >
              <Shield className="h-4 w-4 mr-2" />
              Manager
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleNavigation("/")}
              className="cursor-pointer"
            >
              <UserIcon className="h-4 w-4 mr-2" />
              User
            </DropdownMenuItem>
          </>
        )}

        {user?.role === "MANAGER" && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
              Manager Panel
            </div>
            <DropdownMenuItem
              onClick={() => handleNavigation("/manager/syllabuses")}
              className="cursor-pointer"
            >
              Syllabuses
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleNavigation("/manager/vocabularies")}
              className="cursor-pointer"
            >
              Vocabularies
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleNavigation("/manager/courses")}
              className="cursor-pointer"
            >
              Courses
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleNavigation("/manager/topics")}
              className="cursor-pointer"
            >
              Topics
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
              Switch Role
            </div>
            <DropdownMenuItem
              onClick={() => handleNavigation("/")}
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
          disabled={isLoading}
          className="cursor-pointer gap-2 text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span>{isLoading ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
