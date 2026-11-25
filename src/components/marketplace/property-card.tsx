"use client";

import Link from "next/link";
import { BedDouble, Bath, Scan, MapPin, Heart, Scale, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Property } from "@/lib/marketplace";
import { money } from "@/lib/marketplace";
import { useSession } from "./session";
import { supabase } from "@/integrations/supabase/client.next";
import { toast } from "sonner";
import { useQueryClient, useQuery } from "@tanstack/react-query";
export function PropertyCard({
  property: p,
  compare,
  onCompare,
}: {
  property: Property;
  compare?: boolean;
  onCompare?: (p: Property) => void;
}) {
  const { user } = useSession();
  const qc = useQueryClient();
  const { data: saved } = useQuery({
    queryKey: ["favorites", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("favorites")
        .select("property_id")
        .eq("user_id", user.id);
      return data || [];
    },
  });
  const favorite = saved?.some((f) => f.property_id === p.id);
  const toggle = async () => {
    if (!user) {
      toast.info("سجل الدخول لحفظ العقارات");
      return;
    }
    const { error } = favorite
      ? await supabase.from("favorites").delete().eq("user_id", user.id).eq("property_id", p.id)
      : await supabase.from("favorites").insert({ user_id: user.id, property_id: p.id });
    if (error) toast.error("تعذر تحديث المفضلة");
    else {
      void qc.invalidateQueries({ queryKey: ["favorites"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
    }
  };
  return (
    <article className="property-card">
      <div className="property-photo">
        <Link href={`/property/${p.id}`}>
          {p.imageUrls?.[0] ? (
            <img src={p.imageUrls[0]} alt={p.title} />
          ) : (
            <div className="photo-empty">
              <ImageIcon />
              <span>صور العقار قيد الإضافة</span>
            </div>
          )}
        </Link>
        <span className="listing-badge">{p.purpose === "sale" ? "للبيع" : "للإيجار"}</span>
        <Button
          size="icon"
          variant="photo"
          className={favorite ? "favorite selected" : "favorite"}
          aria-label="حفظ العقار"
          onClick={toggle}
        >
          <Heart fill={favorite ? "currentColor" : "none"} />
        </Button>
        {onCompare && (
          <Button
            size="icon"
            variant="photo"
            className="compare-button"
            aria-label="مقارنة العقار"
            onClick={() => onCompare(p)}
          >
            <Scale className={compare ? "text-primary" : ""} />
          </Button>
        )}
      </div>
      <div className="property-body">
        <div className="property-price">
          {money(p.price, p.currency)}
          {p.purpose === "rent" && <small> / شهرياً</small>}
        </div>
        <Link className="property-title" href={`/property/${p.id}`}>
          {p.title}
        </Link>
        <p className="property-location">
          <MapPin size={14} />
          {p.city}
          {p.neighborhood && "، " + p.neighborhood}
        </p>
        <div className="property-specs">
          <span>
            <BedDouble /> {p.bedrooms} غرف
          </span>
          <span>
            <Bath /> {p.bathrooms} حمام
          </span>
          <span>
            <Scan /> {p.area} م²
          </span>
        </div>
        <div className="property-seller">
          <BuildingLabel agency={p.source === "agency"} />
          <span>{p.category}</span>
        </div>
      </div>
    </article>
  );
}
function BuildingLabel({ agency }: { agency: boolean }) {
  return (
    <span className="seller-label">
      {agency ? "دار فلسطين" : "إعلان المالك"} <span className="verified-dot">✓</span>
    </span>
  );
}
