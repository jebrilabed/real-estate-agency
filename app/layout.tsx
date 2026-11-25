import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteProviders } from "@/components/marketplace/site-providers";
import "@/styles.css";

export const metadata: Metadata = {
  title: "دار فلسطين | عقارات للبيع والإيجار",
  description: "اكتشف عقارك المناسب للبيع والإيجار في فلسطين.",
  authors: [{ name: "دار فلسطين" }],
  openGraph: {
    title: "دار فلسطين | عقارات للبيع والإيجار",
    description: "اكتشف عقارك المناسب للبيع والإيجار في فلسطين.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <SiteProviders>{children}</SiteProviders>
      </body>
    </html>
  );
}
