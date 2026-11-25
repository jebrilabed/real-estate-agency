import type { Database } from "@/integrations/supabase/types";
export type Property = Database["public"]["Tables"]["properties"]["Row"] & { imageUrls?: string[] };
export const cities = [
  "رام الله",
  "نابلس",
  "القدس",
  "الخليل",
  "بيت لحم",
  "جنين",
  "طولكرم",
  "أريحا",
  "غزة",
];
export const categories = ["شقق", "فلل", "منازل", "أراضٍ", "عقارات تجارية"];
export const labels: Record<string, string> = {
  pending: "قيد المراجعة",
  approved: "معتمد",
  rejected: "مرفوض",
  available: "متاح",
  reserved: "محجوز",
  sold: "مباع",
  rented: "مؤجر",
  new: "جديد",
  contacted: "تم التواصل",
  viewing: "موعد معاينة",
  negotiating: "تفاوض",
  successful: "ناجح",
  lost: "مغلق",
  due: "مستحقة",
  paid: "مدفوعة",
  cancelled: "ملغاة",
  requested: "مطلوب",
  confirmed: "مؤكد",
  completed: "مكتمل",
  owner: "مالك عقار",
  buyer: "باحث عن عقار",
  admin: "إدارة المكتب",
};
export function money(value: number, currency = "USD") {
  return (
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value) +
    " " +
    ({ USD: "دولار", ILS: "شيكل", JOD: "دينار" }[currency] || currency)
  );
}
export function commission(amount: number, kind: string, rate: number) {
  if (amount <= 0 || rate < 0 || (kind === "percentage" && rate > 100))
    throw new Error("Invalid commission");
  return kind === "percentage" ? Math.round(amount * rate) / 100 : rate;
}
export function isPublic(p: Pick<Property, "approval" | "status">) {
  return p.approval === "approved" && p.status === "available";
}
export function metadata(title: string, description: string) {
  return {
    meta: [
      { title: title + " | دار فلسطين" },
      { name: "description", content: description },
      { property: "og:title", content: title + " | دار فلسطين" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
