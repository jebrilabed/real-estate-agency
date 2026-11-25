"use client";

import { Dashboard } from "@/components/marketplace/dashboard";
import { AuthenticatedGuard } from "@/components/marketplace/authenticated-guard";

export default function DashboardPage() {
  return (
    <AuthenticatedGuard>
      <Dashboard />
    </AuthenticatedGuard>
  );
}
