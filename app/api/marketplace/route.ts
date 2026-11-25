import { NextResponse } from "next/server";
import { createPublicSupabaseClient } from "@/lib/server/supabase";
import type { Property } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = createPublicSupabaseClient();
    const { data, error } = await client
      .from("properties")
      .select("*")
      .eq("approval", "approved")
      .eq("status", "available")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) throw error;

    const properties: Property[] = await Promise.all(
      (data || []).map(async (property) => {
        const { data: images } = await client
          .from("property_images")
          .select("storage_path")
          .eq("property_id", property.id)
          .order("position");
        const { data: signedUrls } = await client.storage
          .from("property-images")
          .createSignedUrls((images || []).map((image) => image.storage_path), 3600);
        return {
          ...property,
          imageUrls: (signedUrls || []).flatMap((image) =>
            image.signedUrl ? [image.signedUrl] : [],
          ),
        };
      }),
    );

    const { data: settings, error: settingsError } = await client
      .from("website_settings")
      .select("key,value");
    if (settingsError) throw settingsError;

    return NextResponse.json(
      {
        properties,
        settings: Object.fromEntries((settings || []).map((setting) => [setting.key, setting.value])),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Marketplace data request failed:", error);
    return NextResponse.json({ error: "الخدمة غير متاحة حالياً" }, { status: 503 });
  }
}
