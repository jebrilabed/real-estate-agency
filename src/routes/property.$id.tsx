"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MapPin, MessageCircle, CalendarDays, Phone, ImageIcon } from "lucide-react";
import { publicOptions } from "@/lib/queries";
import { money } from "@/lib/marketplace";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InquiryForm } from "@/components/marketplace/inquiry-form";
import { PropertyCard } from "@/components/marketplace/property-card";
export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const { data, isError } = useQuery(publicOptions);
  const [open, setOpen] = useState<"inquiry" | "viewing" | null>(null);
  const [gallery, setGallery] = useState(false);
  const [image, setImage] = useState(0);
  if (!data)
    return (
      <div className="container loading">
        {isError ? "تعذر تحميل العقار حالياً." : "جارٍ تحميل العقار…"}
      </div>
    );
  const p = data.properties.find((p) => p.id === id);
  if (!p)
    return (
      <div className="container page-body empty-list">
        <h1>هذا العقار غير متاح حالياً</h1>
        <Button asChild>
          <Link href="/properties">العودة للعقارات</Link>
        </Button>
      </div>
    );
  const imgs = p.imageUrls || [];
  return (
    <section className="container page-body">
      <div className="text-sm text-muted-foreground mb-5">
        <Link href="/properties">العقارات</Link> / {p.city} / {p.title}
      </div>
      {imgs.length ? (
        <div className="detail-gallery">
          <img
            src={imgs[0]}
            alt={p.title}
            onClick={() => {
              setImage(0);
              setGallery(true);
            }}
          />
          <div className="detail-gallery-side">
            {imgs.slice(1, 3).map((s, i) => (
              <img
                key={s}
                src={s}
                alt={"صورة " + (i + 2)}
                onClick={() => {
                  setImage(i + 1);
                  setGallery(true);
                }}
              />
            ))}
            <Button variant="outline" onClick={() => setGallery(true)}>
              عرض كل الصور ({imgs.length})
            </Button>
          </div>
        </div>
      ) : (
        <div className="empty-list mb-8">
          <ImageIcon />
          <p>صور العقار قيد الإضافة</p>
        </div>
      )}
      <div className="detail-layout">
        <div>
          <span className="status status-available">
            {p.purpose === "sale" ? "للبيع" : "للإيجار"}
          </span>
          <h1 className="mt-4">{p.title}</h1>
          <p className="property-location">
            <MapPin />
            {p.city}، {p.neighborhood} {p.address}
          </p>
          <div className="stats-grid mt-6">
            {[
              [p.area + " م²", "المساحة"],
              [p.bedrooms, "غرف النوم"],
              [p.bathrooms, "الحمامات"],
              [p.floor, "الطابق"],
            ].map(([v, t]) => (
              <div className="stat-card" key={t}>
                <strong>{v}</strong>
                <small>{t}</small>
              </div>
            ))}
          </div>
          <h2>عن العقار</h2>
          <p className="detail-description">{p.description}</p>
          <h2>المميزات والتجهيزات</h2>
          <div className="amenities">
            {p.amenities.length ? (
              p.amenities.map((a) => <span key={a}>{a}</span>)
            ) : (
              <p className="text-muted-foreground text-sm">لم تُضف تجهيزات إضافية.</p>
            )}
          </div>
          <h2>موقع العقار</h2>
          {p.latitude && p.longitude ? (
            <iframe
              className="map-frame"
              title="موقع العقار"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${p.longitude - 0.01}%2C${p.latitude - 0.01}%2C${p.longitude + 0.01}%2C${p.latitude + 0.01}&layer=mapnik&marker=${p.latitude}%2C${p.longitude}`}
            />
          ) : (
            <p className="text-muted-foreground text-sm">
              {p.city} — {p.neighborhood}. اطلب الموقع التفصيلي من المكتب.
            </p>
          )}
        </div>
        <aside className="detail-contact">
          <div className="property-price">
            {money(p.price, p.currency)}
            {p.purpose === "rent" && <small> / شهرياً</small>}
          </div>
          <h3>{p.source === "agency" ? "دار فلسطين" : "مالك العقار"}</h3>
          <p>{p.source === "agency" ? "عقار يديره المكتب" : "إعلان مالك معتمد من المكتب"}</p>
          <Button onClick={() => setOpen("inquiry")}>
            <MessageCircle /> تواصل بشأن العقار
          </Button>
          <Button variant="outline" onClick={() => setOpen("viewing")}>
            <CalendarDays /> طلب معاينة
          </Button>
          {data.settings.phone && (
            <Button variant="outline" asChild>
              <a href={"tel:" + data.settings.phone}>
                <Phone /> اتصال بالمكتب
              </a>
            </Button>
          )}
          {data.settings.whatsapp && (
            <Button variant="outline" asChild>
              <a
                target="_blank"
                rel="noreferrer"
                href={
                  "https://wa.me/" +
                  data.settings.whatsapp.replace(/\D/g, "") +
                  "?text=" +
                  encodeURIComponent("أرغب بالاستفسار عن " + p.title)
                }
              >
                <MessageCircle /> واتساب
              </a>
            </Button>
          )}
        </aside>
      </div>
      <section className="section">
        <div className="section-heading">
          <h2>عقارات مشابهة</h2>
        </div>
        <div className="properties-grid">
          {data.properties
            .filter((i) => i.id !== id && i.category === p.category)
            .slice(0, 3)
            .map((i) => (
              <PropertyCard key={i.id} property={i} />
            ))}
        </div>
      </section>
      <Dialog open={!!open} onOpenChange={() => setOpen(null)}>
        <DialogContent dir="rtl">
          <DialogTitle>
            {open === "viewing" ? "طلب معاينة العقار" : "استفسار عن العقار"}
          </DialogTitle>
          <DialogDescription>{p.title}</DialogDescription>
          <InquiryForm propertyId={id} viewing={open === "viewing"} />
        </DialogContent>
      </Dialog>
      <Dialog open={gallery} onOpenChange={setGallery}>
        <DialogContent className="max-w-4xl" dir="rtl">
          <DialogTitle>صور العقار</DialogTitle>
          <DialogDescription>
            {image + 1} من {imgs.length}
          </DialogDescription>
          <img className="w-full max-h-[65vh] object-contain" src={imgs[image]} alt={p.title} />
          <div className="flex gap-2">
            {imgs.map((_, i) => (
              <Button
                variant={i === image ? "default" : "outline"}
                key={i}
                onClick={() => setImage(i)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
