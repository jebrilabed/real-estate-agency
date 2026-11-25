import { supabase } from "@/integrations/supabase/client.next";
import type { Database } from "@/integrations/supabase/types";
import type { Property } from "./marketplace";

type Tables = Database["public"]["Tables"];
export type DashboardData = {
  role: Database["public"]["Enums"]["app_role"];
  userId: string;
  profile: Tables["profiles"]["Row"] | null;
  properties: Property[];
  favorites: Tables["favorites"]["Row"][];
  inquiries: Tables["inquiries"]["Row"][];
  appointments: Tables["viewing_appointments"]["Row"][];
  notifications: Tables["notifications"]["Row"][];
  agreements: Tables["commission_agreements"]["Row"][];
  transactions: Tables["transactions"]["Row"][];
  payments: Tables["commission_payments"]["Row"][];
  profiles: Tables["profiles"]["Row"][];
  notes: Tables["lead_notes"]["Row"][];
};

export type PublicMarketplaceData = {
  properties: Property[];
  settings: Partial<
    Record<"email" | "phone" | "whatsapp" | "about" | "address" | "cover", string>
  >;
};

export async function getPublicProperties(): Promise<PublicMarketplaceData> {
  const response = await fetch("/api/marketplace", { cache: "no-store" });
  const result = (await response.json()) as PublicMarketplaceData | { error?: string };
  if (!response.ok) {
    throw new Error("error" in result ? result.error || "تعذر تحميل العقارات" : "تعذر تحميل العقارات");
  }
  return result as PublicMarketplaceData;
}

export async function getDashboard(): Promise<DashboardData> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("سجل الدخول لعرض حسابك");

  const response = await fetch("/api/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result?.error || "تعذر تحميل حسابك");
  return result as DashboardData;
}
