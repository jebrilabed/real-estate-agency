"use client";

import PublishPage from "@/routes/_authenticated/publish";
import { AuthenticatedGuard } from "@/components/marketplace/authenticated-guard";

export default function Publish() {
  return (
    <AuthenticatedGuard>
      <PublishPage />
    </AuthenticatedGuard>
  );
}
