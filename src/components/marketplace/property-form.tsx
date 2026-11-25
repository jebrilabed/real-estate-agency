"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client.next";
import { Button } from "@/components/ui/button";
import { cities, categories, type Property } from "@/lib/marketplace";
import { toast } from "sonner";
export function PropertyForm({
  property,
  admin = false,
  onDone,
}: {
  property?: Property;
  admin?: boolean;
  onDone?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const qc = useQueryClient();
  const router = useRouter();
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("سجل الدخول أولاً");
      const payload = {
        owner_id: property?.owner_id || u.user.id,
        publisher_id: property?.publisher_id || u.user.id,
        title: String(form.get("title")),
        description: String(form.get("description")),
        city: String(form.get("city")),
        neighborhood: String(form.get("neighborhood")),
        address: String(form.get("address")),
        category: String(form.get("category")),
        purpose: String(form.get("purpose")),
        price: Number(form.get("price")),
        currency: String(form.get("currency")),
        area: Number(form.get("area")),
        bedrooms: Number(form.get("bedrooms")),
        bathrooms: Number(form.get("bathrooms")),
        floor: Number(form.get("floor")),
        latitude: form.get("latitude") ? Number(form.get("latitude")) : null,
        longitude: form.get("longitude") ? Number(form.get("longitude")) : null,
        amenities: String(form.get("amenities"))
          .split("،")
          .map((s) => s.trim())
          .filter(Boolean),
        source: property?.source || (admin ? "agency" : "owner"),
        approval: admin ? property?.approval || "approved" : "pending",
      };
      const result = property
        ? await supabase
            .from("properties")
            .update(payload)
            .eq("id", property.id)
            .select("id")
            .single()
        : await supabase.from("properties").insert(payload).select("id").single();
      if (result.error || !result.data)
        throw new Error("تعذر حفظ العقار. تحقق من نوع حسابك وبيانات العقار.");
      let position = 0;
      for (const file of files) {
        const path = `${u.user.id}/${result.data.id}/${crypto.randomUUID()}.${file.name.split(".").pop()}`;
        const { error: upload } = await supabase.storage.from("property-images").upload(path, file);
        if (upload) throw new Error("حُفظ العقار لكن تعذر رفع إحدى الصور، حاول إضافتها مجدداً.");
        const { error: photo } = await supabase
          .from("property_images")
          .insert({ property_id: result.data.id, storage_path: path, position: position++ });
        if (photo) throw new Error("تعذر ربط الصورة بالعقار");
      }
      await qc.invalidateQueries();
      toast.success(admin ? "تم حفظ العقار" : "تم إرسال العقار للمراجعة");
      if (onDone) onDone();
      else router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حفظ العقار");
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="form-max">
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      <section className="form-section">
        <h2>معلومات العقار</h2>
        <div className="form-grid">
          <label className="field wide">
            <span>عنوان الإعلان</span>
            <input
              name="title"
              required
              minLength={5}
              defaultValue={property?.title}
              placeholder="شقة واسعة بإطلالة جميلة في رام الله"
            />
          </label>
          <label className="field">
            <span>نوع العقار</span>
            <select name="category" defaultValue={property?.category}>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>الغرض</span>
            <select name="purpose" defaultValue={property?.purpose}>
              <option value="sale">للبيع</option>
              <option value="rent">للإيجار</option>
            </select>
          </label>
          <label className="field">
            <span>السعر</span>
            <input name="price" type="number" min="0" required defaultValue={property?.price} />
          </label>
          <label className="field">
            <span>العملة</span>
            <select name="currency" defaultValue={property?.currency}>
              <option value="USD">دولار أمريكي</option>
              <option value="ILS">شيكل</option>
              <option value="JOD">دينار أردني</option>
            </select>
          </label>
          <label className="field wide">
            <span>وصف العقار</span>
            <textarea
              name="description"
              required
              minLength={20}
              defaultValue={property?.description}
            />
          </label>
        </div>
      </section>
      <section className="form-section">
        <h2>الموقع</h2>
        <div className="form-grid">
          <label className="field">
            <span>المدينة</span>
            <select name="city" defaultValue={property?.city}>
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>الحي</span>
            <input name="neighborhood" required defaultValue={property?.neighborhood} />
          </label>
          <label className="field wide">
            <span>العنوان التفصيلي</span>
            <input name="address" defaultValue={property?.address} />
          </label>
          <label className="field">
            <span>خط العرض (اختياري)</span>
            <input
              name="latitude"
              type="number"
              step="any"
              min="-90"
              max="90"
              defaultValue={property?.latitude || ""}
            />
          </label>
          <label className="field">
            <span>خط الطول (اختياري)</span>
            <input
              name="longitude"
              type="number"
              step="any"
              min="-180"
              max="180"
              defaultValue={property?.longitude || ""}
            />
          </label>
        </div>
      </section>
      <section className="form-section">
        <h2>المواصفات والصور</h2>
        <div className="form-grid">
          {[
            ["area", "المساحة (م²)", property?.area, 1],
            ["bedrooms", "غرف النوم", property?.bedrooms, 0],
            ["bathrooms", "الحمامات", property?.bathrooms, 0],
            ["floor", "الطابق", property?.floor, -5],
          ].map(([name, label, value, min]) => (
            <label className="field" key={String(name)}>
              <span>{label}</span>
              <input
                name={String(name)}
                type="number"
                required
                min={Number(min)}
                defaultValue={value === undefined ? undefined : Number(value)}
              />
            </label>
          ))}
          <label className="field wide">
            <span>المميزات (افصل بينها بفاصلة عربية)</span>
            <input
              name="amenities"
              defaultValue={property?.amenities.join("، ")}
              placeholder="مصعد، موقف سيارات، شرفة"
            />
          </label>
          <label className="field wide">
            <span>صور العقار</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => {
                const selected = Array.from(e.target.files || []);
                if (selected.some((f) => f.size > 10 * 1024 * 1024)) {
                  toast.error("الحد الأقصى للصورة 10 ميغابايت");
                  e.target.value = "";
                  return;
                }
                setFiles(selected);
              }}
            />
            {files.length > 0 && <small>{files.length} صور جاهزة للرفع</small>}
          </label>
        </div>
      </section>
      <div className="flex items-center justify-between gap-5 mt-6">
        <p className="text-muted-foreground text-xs">
          {admin ? "إعلان المكتب" : "كل إعلان جديد أو تعديل يخضع لمراجعة المكتب قبل الظهور للعامة."}
        </p>
        <Button type="submit" disabled={busy}>
          {busy ? "جارٍ الحفظ…" : admin ? "حفظ العقار" : "إرسال للمراجعة"}
        </Button>
      </div>
    </form>
  );
}
