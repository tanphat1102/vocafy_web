"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";
import { userService, type User as UserType } from "@/services";
import { usePathname } from "next/navigation";
import { UnifiedNavbar } from "@/components/layout/unified-navbar";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "admin" | "manager";
  navigation: NavigationItem[];
}

export default function DashboardLayout({
  children,
  role,
  navigation,
}: DashboardLayoutProps) {
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

  const NavbarComponent = UnifiedNavbar;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-card border-r border-border">
        {/* Logo */}
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
                    ? role === "admin"
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "bg-accent/20 text-accent-foreground shadow-sm"
                    : role === "admin"
                      ? "text-muted-foreground hover:bg-primary/50 hover:text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <NavbarComponent
          user={user}
          onLogout={() => {
            // Logout handled by the component
          }}
        />

        {/* Dashboard Content */}
        <main className="flex-1 p-6 bg-background">{children}</main>
      </div>
    </div>
  );
}
