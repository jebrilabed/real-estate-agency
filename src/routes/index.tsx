"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Search,
  MapPin,
  Building2,
  Wallet,
  ShieldCheck,
  Handshake,
  Headphones,
  ArrowLeft,
  ArrowUpLeft,
  Plus,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/marketplace/property-card";
import { publicOptions } from "@/lib/queries";
import { cities, categories } from "@/lib/marketplace";
import villa from "@/assets/ramallah-villa.png";
import apartment from "@/assets/apartment.png";
import homes from "@/assets/palestine-homes.png";
export default function Home() {
  const { data, isError } = useQuery(publicOptions);
  const [purpose, setPurpose] = useState("sale");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [max, setMax] = useState("");
  const [tab, setTab] = useState("");
  const router = useRouter();
  if (!data)
    return (
      <div className="container loading">
        {isError
          ? "تعذر تحميل العقارات حالياً. تحقق من إعدادات Supabase ثم أعد المحاولة."
          : "جارٍ تحميل العقارات…"}
      </div>
    );
  const featured = data.properties
    .filter((p) => p.featured && (!tab || p.purpose === tab))
    .slice(0, 3);
  const latest = data.properties.slice(0, 3);
  return (
    <>
      <section className="hero">
        <img
          className="hero-photo"
          src={data.settings.cover || villa.src}
          alt="فيلا حجرية فلسطينية مع حديقة وأشجار زيتون"
        />
        <div className="hero-shade" />
        <div className="container hero-content">
          <div className="hero-eyebrow">
            <Sparkles size={14} /> هنا تبدأ حكاية بيتك الجديد
          </div>
          <h1>اعثر على عقارك المناسب بكل سهولة</h1>
          <p className="hero-subtitle">اكتشف أفضل العقارات للبيع والإيجار في فلسطين</p>
          <form
            className="search-panel"
            onSubmit={(e) => {
              e.preventDefault();
              const params = new URLSearchParams();
              if (purpose) params.set("purpose", purpose);
              if (city) params.set("city", city);
              if (category) params.set("category", category);
              if (Number(max)) params.set("max", max);
              router.push(`/properties?${params.toString()}`);
            }}
          >
            <div className="search-tabs">
              <Button
                type="button"
                variant="ghost"
                className={purpose === "sale" ? "active" : ""}
                onClick={() => setPurpose("sale")}
              >
                شراء عقار
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={purpose === "rent" ? "active" : ""}
                onClick={() => setPurpose("rent")}
              >
                استئجار عقار
              </Button>
            </div>
            <div className="search-fields">
              <div className="search-field">
                <label htmlFor="home-city">
                  <MapPin /> الموقع
                </label>
                <select id="home-city" value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">اختر المدينة أو المنطقة</option>
                  {cities.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="search-field">
                <label htmlFor="home-category">
                  <Building2 /> نوع العقار
                </label>
                <select
                  id="home-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">جميع أنواع العقارات</option>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="search-field">
                <label htmlFor="home-price">
                  <Wallet /> السعر الأقصى
                </label>
                <input
                  id="home-price"
                  type="number"
                  min="0"
                  placeholder="حدد ميزانيتك بالدولار"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                />
              </div>
              <Button className="search-submit" type="submit">
                <Search /> ابحث عن عقارك
              </Button>
            </div>
          </form>
          <div className="hero-tags">
            <span>مدن رائجة:</span>
            {cities.slice(0, 5).map((c) => (
              <Button
                variant="ghost"
                key={c}
                onClick={() => router.push(`/properties?city=${encodeURIComponent(c)}`)}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>
      </section>
      <section className="trust-strip">
        <div className="container trust-inner">
          {[
            [ShieldCheck, "عقارات موثوقة", "إعلانات مُراجعة بعناية"],
            [Handshake, "خطوات واضحة", "من البحث حتى استلام المفتاح"],
            [Headphones, "معك في كل خطوة", "فريق يعرف السوق الفلسطيني"],
          ].map(([Icon, title, sub]) => {
            const I = Icon as typeof ShieldCheck;
            return (
              <div className="trust-item" key={String(title)}>
                <I />
                <div>
                  <strong>{String(title)}</strong>
                  <small>{String(sub)}</small>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">عقارات تستحق اهتمامك</span>
            <h2>اختياراتنا المميزة</h2>
            <p>مساحات مختارة بعناية لتجد ما يناسب أسلوب حياتك</p>
          </div>
          <div className="filter-tabs">
            {[
              ["", "الكل"],
              ["sale", "للبيع"],
              ["rent", "للإيجار"],
            ].map(([v, t]) => (
              <Button
                key={v}
                variant="ghost"
                className={tab === v ? "active" : ""}
                onClick={() => setTab(v || "")}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
        {featured.length ? (
          <div className="properties-grid">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="empty-list">
            <Building2 />
            <h3>اختيارات جديدة في الطريق</h3>
            <p>تظهر هنا العقارات المميزة بعد اعتمادها من فريق المكتب.</p>
            <Button variant="outline" asChild>
              <Link href="/properties">
                استعرض جميع العقارات <ArrowLeft />
              </Link>
            </Button>
          </div>
        )}
      </section>
      <section className="section category-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">لكل حلم مساحة</span>
              <h2>أيّ عقار تبحث عنه؟</h2>
              <p>من شقتك الأولى إلى استثمارك القادم</p>
            </div>
            <Button variant="link" asChild>
              <Link href="/properties">
                كل العقارات <ArrowLeft />
              </Link>
            </Button>
          </div>
          <div className="category-grid">
            {categories.map((c, i) => (
              <Link href={`/properties?category=${encodeURIComponent(c)}`} className="category-item" key={c}>
                <img src={([apartment, villa, homes, homes, apartment][i] || apartment).src} alt={c} />
                <div className="category-item-content">
                  <strong>{c}</strong>
                  <small>{data.properties.filter((p) => p.category === c).length} عقار متاح</small>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">كن أول من يكتشفها</span>
            <h2>أحدث العقارات</h2>
            <p>فرص جديدة للبيع والإيجار في مدن فلسطين</p>
          </div>
          <Button variant="link" asChild>
            <Link href="/properties">
              عرض جميع العقارات <ArrowLeft />
            </Link>
          </Button>
        </div>
        {latest.length ? (
          <div className="properties-grid">
            {latest.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="empty-list">
            <KeyRound />
            <h3>ابدأ معنا أول إعلان</h3>
            <p>لديك عقار للبيع أو الإيجار؟ أرسله للمراجعة ليظهر هنا.</p>
            <Button asChild>
              <Link href="/publish">
                <Plus /> أضف عقارك
              </Link>
            </Button>
          </div>
        )}
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">رحلة أبسط، قرار أوضح</span>
            <h2>عقارك القادم في ثلاث خطوات</h2>
          </div>
        </div>
        <div className="how-grid">
          {[
            [Search, "ابحث عن مساحتك", "اكتشف العقارات وحدد المدينة والمواصفات التي تناسبك."],
            [Handshake, "تواصل ورتّب معاينة", "تواصل مع المكتب لرؤية العقار واتخاذ قرار بثقة."],
            [
              KeyRound,
              "ابدأ حكايتك الجديدة",
              "تابع إجراءات البيع أو الإيجار مع فريقنا خطوة بخطوة.",
            ],
          ].map(([Icon, title, text]) => {
            const I = Icon as typeof Search;
            return (
              <div key={String(title)}>
                <span className="how-icon">
                  <I />
                </span>
                <h3>{String(title)}</h3>
                <p>{String(text)}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section className="section agency-band">
        <div className="container agency-layout">
          <div>
            <span className="section-eyebrow">من فلسطين، ولأهلها</span>
            <h2>
              دار فلسطين
              <br />
              شريكك في كل بداية
            </h2>
            <p>
              {data.settings.about ||
                "نؤمن أن العقار ليس مجرد مساحة، بل بداية جديدة. نجمع أصحاب العقارات والباحثين عنها في مكان واحد، مع عناية بكل التفاصيل ووضوح في كل خطوة."}
            </p>
            <Button variant="outline" asChild>
              <Link href="/about">
                تعرّف علينا <ArrowUpLeft />
              </Link>
            </Button>
          </div>
          <img src={homes.src} alt="عمارة حجرية فلسطينية على تلال خضراء" />
        </div>
      </section>
      <section className="publish-band">
        <div className="container">
          <div>
            <h2>عقارك يستحق أن يراه الشخص المناسب</h2>
            <p>أضف عقارك اليوم، ودعنا نساعدك في الوصول إلى المهتمين.</p>
          </div>
          <Button variant="hero" size="lg" asChild>
            <Link href="/publish">
              <Plus /> أضف عقارك الآن
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
