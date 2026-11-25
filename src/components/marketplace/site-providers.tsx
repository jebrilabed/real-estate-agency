"use client";

import { useState, type ReactNode } from "react";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { SessionProvider } from "./session";
import { Header, Footer } from "./shell";

export function SiteProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <Header />
        <main>
          <Suspense fallback={<div className="container loading">جارٍ تحميل الصفحة…</div>}>
            {children}
          </Suspense>
        </main>
        <Footer />
        <Toaster position="top-center" dir="rtl" richColors />
      </SessionProvider>
    </QueryClientProvider>
  );
}
