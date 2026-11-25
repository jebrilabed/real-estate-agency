"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { dashboardOptions } from "@/lib/queries";
import { PropertyForm } from "@/components/marketplace/property-form";
import { Button } from "@/components/ui/button";
export default function Publish() {
  const { data, isError } = useQuery(dashboardOptions);
  if (!data) return <div className="container loading">{isError ? "تعذر تحميل حسابك. سجّل الدخول مجدداً." : "جارٍ تحميل حسابك…"}</div>;
  return (
    <>
      <div className="page-heading">
        <div className="container">
          <h1>أضف عقارك</h1>
          <p>دع عقارك يصل إلى الشخص المناسب</p>
        </div>
      </div>
      <div className="container page-body">
        {data.role === "buyer" ? (
          <div className="empty-list">
            <h2>نشر العقارات متاح لحسابات المالك والمكتب</h2>
            <p>يمكنك الاستمرار في البحث وحفظ عقاراتك المفضلة.</p>
            <Button asChild>
              <Link href="/dashboard">العودة لحسابي</Link>
            </Button>
          </div>
        ) : (
          <PropertyForm admin={data.role === "admin"} />
        )}
      </div>
    </>
  );
}
