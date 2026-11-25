import { NextResponse } from "next/server";
import { createUserSupabaseClient } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token || token.split(".").length !== 3) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = createUserSupabaseClient(token);
    const { data: claims, error: claimsError } = await db.auth.getClaims(token);
    const userId = claims?.claims?.sub;
    if (claimsError || typeof userId !== "string") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: role, error: roleError } = await db
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();
    if (roleError || !role) throw new Error("تعذر تحميل حسابك");
    const admin = role.role === "admin";

    const [
      properties,
      profile,
      favorites,
      inquiries,
      appointments,
      notifications,
      agreements,
      transactions,
      payments,
      profiles,
      notes,
    ] = await Promise.all([
      db.from("properties").select("*").order("created_at", { ascending: false }),
      db.from("profiles").select("*").eq("id", userId).single(),
      db.from("favorites").select("*").eq("user_id", userId),
      db.from("inquiries").select("*").order("created_at", { ascending: false }),
      db.from("viewing_appointments").select("*").order("scheduled_at"),
      db.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      admin ? db.from("commission_agreements").select("*") : Promise.resolve({ data: [] }),
      admin ? db.from("transactions").select("*") : Promise.resolve({ data: [] }),
      admin ? db.from("commission_payments").select("*") : Promise.resolve({ data: [] }),
      admin ? db.from("profiles").select("*") : Promise.resolve({ data: [] }),
      admin ? db.from("lead_notes").select("*") : Promise.resolve({ data: [] }),
    ]);

    if (properties.error || inquiries.error || appointments.error) {
      throw new Error("تعذر تحميل البيانات");
    }

    return NextResponse.json(
      {
        role: role.role,
        userId,
        profile: profile.data,
        properties: properties.data || [],
        favorites: favorites.data || [],
        inquiries: inquiries.data || [],
        appointments: appointments.data || [],
        notifications: notifications.data || [],
        agreements: agreements.data || [],
        transactions: transactions.data || [],
        payments: payments.data || [],
        profiles: profiles.data || [],
        notes: notes.data || [],
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Dashboard data request failed:", error);
    return NextResponse.json({ error: "تعذر تحميل البيانات" }, { status: 500 });
  }
}
