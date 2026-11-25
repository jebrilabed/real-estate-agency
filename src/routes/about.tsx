"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { publicOptions } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/marketplace/property-card";
import homes from "@/assets/palestine-homes.png";
export default function About() {
  const { data, isError } = useQuery(publicOptions);
  if (!data)
    return (
      <div className="container loading">
        {isError ? "تعذر تحميل بيانات الصفحة حالياً." : "جارٍ تحميل الصفحة…"}
      </div>
    );
  const agency = data.properties.filter((p) => p.source === "agency");
  return (
    <>
      <div className="page-heading">
        <div className="container">
          <h1>دار فلسطين</h1>
          <p>شريكك في كل بداية</p>
        </div>
      </div>
      <section className="container section agency-layout">
        <div>
          <span className="section-eyebrow">من فلسطين، ولأهلها</span>
          <h2>المكان المناسب يبدأ بمعرفة حقيقية</h2>
          <p>
            {data.settings.about ||
              "نرافق أصحاب العقارات والباحثين عن منزل أو استثمار في السوق الفلسطيني. نراجع الإعلانات بعناية وننسّق المعاينات ونتابع التفاوض حتى تأكيد البيع أو الإيجار من المكتب."}
          </p>
          {data.settings.address && <p>{data.settings.address}</p>}
          <Button asChild>
            <Link href="/contact">تواصل مع الفريق</Link>
          </Button>
        </div>
        <img src={data.settings.cover || homes.src} alt="عمارة فلسطينية حجرية" />
      </section>
      <section className="container section">
        <div className="stats-grid">
          <div className="stat-card">
            <strong>{agency.length}</strong>
            <small>عقار يديره المكتب</small>
          </div>
          <div className="stat-card">
            <strong>{data.properties.filter((p) => p.purpose === "sale").length}</strong>
            <small>عقار متاح للبيع</small>
          </div>
          <div className="stat-card">
            <strong>{data.properties.filter((p) => p.purpose === "rent").length}</strong>
            <small>عقار متاح للإيجار</small>
          </div>
          <div className="stat-card">
            <strong>{new Set(data.properties.map((p) => p.city)).size}</strong>
            <small>مدن تضم عقارات متاحة</small>
          </div>
        </div>
        <div className="section-heading">
          <h2>عقارات يديرها المكتب</h2>
        </div>
        {agency.length ? (
          <div className="properties-grid">
            {agency.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="empty-list">
            <h3>لا توجد إعلانات مكتب متاحة حالياً</h3>
          </div>
        )}
      </section>
    </>
  );
}
