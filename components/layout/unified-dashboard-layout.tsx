"use client";

import { usePathname } from "next/navigation";
import {
  Users,
  BookOpen,
  Home,
  Settings,
  Library,
  BookMarked,
  Languages,
  CreditCard,
} from "lucide-react";
import DashboardLayout, {
  NavigationItem,
} from "@/components/layout/dashboard-layout";

const adminNavigation: NavigationItem[] = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Syllabuses", href: "/admin/syllabuses", icon: Library },
  { name: "Topics", href: "/admin/topics", icon: BookMarked },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Vocabularies", href: "/admin/vocabularies", icon: Languages },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Users", href: "/admin/users", icon: Users },
];

const managerNavigation: NavigationItem[] = [
  { name: "Dashboard", href: "/manager", icon: Home },
  { name: "Syllabuses", href: "/manager/syllabuses", icon: Library },
  { name: "Topics", href: "/manager/topics", icon: BookMarked },
  { name: "Courses", href: "/manager/courses", icon: BookOpen },
  { name: "Vocabularies", href: "/manager/vocabularies", icon: Languages },
];

interface UnifiedDashboardLayoutProps {
  children: React.ReactNode;
}

export default function UnifiedDashboardLayout({
  children,
}: UnifiedDashboardLayoutProps) {
  const pathname = usePathname();

  // Determine role based on current path
  const isAdminRoute = pathname.startsWith("/admin");
  const role = isAdminRoute ? "admin" : "manager";
  const navigation = isAdminRoute ? adminNavigation : managerNavigation;

  return (
    <DashboardLayout role={role} navigation={navigation}>
      {children}
    </DashboardLayout>
  );
}
