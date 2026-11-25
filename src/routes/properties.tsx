"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Grid2X2, Map, Search, ArrowLeft, ArrowRight, X, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PropertyCard } from "@/components/marketplace/property-card";
import { publicOptions } from "@/lib/queries";
import { cities, categories, money, type Property } from "@/lib/marketplace";
import { toast } from "sonner";
import { z } from "zod";
export default function Properties() {
  const { data, isError } = useQuery(publicOptions);
  const search = useSearchParams();
  const [city, setCity] = useState(search.get("city") || "");
  const [category, setCategory] = useState(search.get("category") || "");
  const [purpose, setPurpose] = useState(search.get("purpose") || "");
  const [max, setMax] = useState(search.get("max") || "");
  const [min, setMin] = useState("");
  const [area, setArea] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [sort, setSort] = useState("new");
  const [currency, setCurrency] = useState("USD");
  const [page, setPage] = useState(1);
  const [map, setMap] = useState(false);
  const [compare, setCompare] = useState<Property[]>([]);
  const [modal, setModal] = useState(false);
  if (!data)
    return (
      <div className="container loading">
        {isError ? "تعذر تحميل العقارات حالياً." : "جارٍ تحميل العقارات…"}
      </div>
    );
  const items = data.properties
    .filter(
      (p) =>
        (!city || p.city === city) &&
        (!category || p.category === category) &&
        (!purpose || p.purpose === purpose) &&
        (!neighborhood || p.neighborhood.includes(neighborhood)) &&
        (!max || (p.currency === currency && p.price <= Number(max))) &&
        (!min || (p.currency === currency && p.price >= Number(min))) &&
        (!area || p.area >= Number(area)) &&
        (!beds || p.bedrooms >= Number(beds)) &&
        (!baths || p.bathrooms >= Number(baths)),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.currency.localeCompare(b.currency) || a.price - b.price
        : sort === "high"
          ? a.currency.localeCompare(b.currency) || b.price - a.price
          : 0,
    );
  const toggle = (p: Property) => {
    if (compare.some((i) => i.id === p.id)) setCompare(compare.filter((i) => i.id !== p.id));
    else if (compare.length < 3) setCompare([...compare, p]);
    else toast.info("يمكن مقارنة ثلاثة عقارات");
  };
  const reset = () => {
    setCity("");
    setCategory("");
    setPurpose("");
    setMax("");
    setMin("");
    setArea("");
    setBeds("");
    setBaths("");
    setNeighborhood("");
    setPage(1);
  };
  return (
    <>
      <div className="page-heading">
        <div className="container">
          <span className="section-eyebrow">مساحتك القادمة تنتظرك</span>
          <h1>اكتشف العقارات</h1>
          <p>خيارات للبيع والإيجار في جميع أنحاء فلسطين</p>
        </div>
      </div>
      <div className="container page-body listing-layout">
        <aside className="filters">
          <h3>
            <Search size={17} className="inline" /> تصفية العقارات
          </h3>
          <label className="field">
            <span>المدينة</span>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
            >
              <option value="">جميع المدن</option>
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>الحي</span>
            <input
              value={neighborhood}
              onChange={(e) => {
                setNeighborhood(e.target.value);
                setPage(1);
              }}
              placeholder="اسم الحي"
            />
          </label>
          <label className="field">
            <span>نوع العقار</span>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">الكل</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>الغرض</span>
            <select
              value={purpose}
              onChange={(e) => {
                setPurpose(e.target.value);
                setPage(1);
              }}
            >
              <option value="">بيع وإيجار</option>
              <option value="sale">للبيع</option>
              <option value="rent">للإيجار</option>
            </select>
          </label>
          <label className="field">
            <span>العملة</span>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="USD">دولار</option>
              <option value="ILS">شيكل</option>
              <option value="JOD">دينار</option>
            </select>
          </label>
          {[
            ["السعر الأدنى", min, setMin],
            ["السعر الأقصى", max, setMax],
            ["المساحة الدنيا (م²)", area, setArea],
            ["غرف النوم (حد أدنى)", beds, setBeds],
            ["الحمامات (حد أدنى)", baths, setBaths],
          ].map(([t, v, set]) => (
            <label className="field" key={String(t)}>
              <span>{String(t)}</span>
              <input
                type="number"
                min="0"
                value={String(v)}
                onChange={(e) => {
                  (set as typeof setMin)(e.target.value);
                  setPage(1);
                }}
                placeholder="غير محدد"
              />
            </label>
          ))}
          <Button variant="outline" onClick={reset}>
            إعادة ضبط
          </Button>
        </aside>
        <section>
          <div className="listing-toolbar">
            <span>{items.length} عقار يطابق بحثك</span>
            <div>
              <select
                className="control"
                aria-label="ترتيب العقارات"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="new">الأحدث أولاً</option>
                <option value="low">السعر الأقل (حسب العملة)</option>
                <option value="high">السعر الأعلى (حسب العملة)</option>
              </select>
              <Button
                variant={!map ? "default" : "outline"}
                size="icon"
                aria-label="عرض البطاقات"
                onClick={() => setMap(false)}
              >
                <Grid2X2 />
              </Button>
              <Button
                variant={map ? "default" : "outline"}
                size="icon"
                aria-label="عرض الخريطة"
                onClick={() => setMap(true)}
              >
                <Map />
              </Button>
            </div>
          </div>
          {map ? (
            <>
              <iframe
                title="خريطة فلسطين"
                className="map-frame"
                src="https://www.openstreetmap.org/export/embed.html?bbox=34.9%2C31.5%2C35.5%2C32.3&layer=mapnik"
              />
              <div className="mt-5 properties-grid">
                {items
                  .filter((p) => p.latitude && p.longitude)
                  .map((p) => (
                    <div key={p.id}>
                      <PropertyCard property={p} />
                      <a
                        className="text-primary text-sm"
                        target="_blank"
                        rel="noreferrer"
                        href={`https://www.openstreetmap.org/?mlat=${p.latitude}&mlon=${p.longitude}#map=16/${p.latitude}/${p.longitude}`}
                      >
                        موقع العقار على الخريطة ↗
                      </a>
                    </div>
                  ))}
              </div>
            </>
          ) : items.length ? (
            <div className="properties-grid">
              {items.slice((page - 1) * 8, page * 8).map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  compare={compare.some((c) => c.id === p.id)}
                  onCompare={toggle}
                />
              ))}
            </div>
          ) : (
            <div className="empty-list">
              <Search />
              <h3>لا توجد عقارات مطابقة حالياً</h3>
              <p>جرّب تغيير المدينة أو توسيع نطاق البحث.</p>
              <Button variant="outline" onClick={reset}>
                عرض جميع العقارات
              </Button>
            </div>
          )}
          {items.length > 8 && (
            <div className="flex justify-center gap-3 mt-7">
              <Button
                size="icon"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                aria-label="السابق"
              >
                <ArrowRight />
              </Button>
              <span>
                {page} / {Math.ceil(items.length / 8)}
              </span>
              <Button
                size="icon"
                variant="outline"
                disabled={page >= Math.ceil(items.length / 8)}
                onClick={() => setPage(page + 1)}
                aria-label="التالي"
              >
                <ArrowLeft />
              </Button>
            </div>
          )}
        </section>
      </div>
      {compare.length > 0 && (
        <div className="comparison-bar">
          <Scale />
          <span>{compare.length} عقارات للمقارنة</span>
          <Button variant="hero" onClick={() => setModal(true)} disabled={compare.length < 2}>
            قارن الآن
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label="إلغاء المقارنة"
            onClick={() => setCompare([])}
          >
            <X />
          </Button>
        </div>
      )}
      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="max-w-3xl" dir="rtl">
          <DialogTitle>مقارنة العقارات</DialogTitle>
          <DialogDescription>قارن السعر والموقع والمواصفات</DialogDescription>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>المواصفات</th>
                  {compare.map((p) => (
                    <th key={p.id}>{p.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {["السعر", "المدينة", "النوع", "المساحة", "غرف النوم", "الحمامات"].map((t, i) => (
                  <tr key={t}>
                    <td>{t}</td>
                    {compare.map((p) => (
                      <td key={p.id}>
                        {
                          [
                            money(p.price, p.currency),
                            p.city,
                            p.category,
                            p.area + " م²",
                            p.bedrooms,
                            p.bathrooms,
                          ][i]
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
