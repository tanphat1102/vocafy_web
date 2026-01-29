"use client";

import UnifiedDashboardLayout from "@/components/layout/unified-dashboard-layout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UnifiedDashboardLayout>{children}</UnifiedDashboardLayout>;
}
