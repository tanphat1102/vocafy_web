"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  BookOpen,
  Menu,
  Bell,
  Home,
  Settings,
  LogOut,
  Library,
  BookMarked,
  Languages,
  CreditCard,
} from "lucide-react";
import { authService, userService, type User as UserType } from "@/services";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Syllabuses", href: "/admin/syllabuses", icon: Library },
  { name: "Topics", href: "/admin/topics", icon: BookMarked },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Vocabularies", href: "/admin/vocabularies", icon: Languages },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userService.getProfile();
        if (response.success) {
          setUser(response.result);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-card border-r border-border">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logoFull.png"
              alt="Vocafy"
              width={100}
              height={32}
              priority
            />
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Admin Panel
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, Admin
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
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
                        alt={
                          user?.profile?.display_name || user?.email || "Admin"
                        }
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
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 bg-background">{children}</main>
      </div>
    </div>
  );
}
