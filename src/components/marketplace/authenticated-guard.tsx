"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "./session";

export function AuthenticatedGuard({ children }: { children: ReactNode }) {
  const { user, ready } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/auth");
  }, [ready, user, router]);

  if (!ready || !user) return <div className="loading">جارٍ التحقق من الجلسة…</div>;
  return children;
}
