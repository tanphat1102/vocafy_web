"use client";

import UnifiedDashboardLayout from "@/components/layout/unified-dashboard-layout";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UnifiedDashboardLayout>{children}</UnifiedDashboardLayout>;
}
