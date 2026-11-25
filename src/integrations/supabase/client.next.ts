"use client";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { brokeredPreviewStorage } from "./previewAuthStorage";

function createSupabaseClient() {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const key = process.env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"];

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Copy .env.example to .env.local and add your Supabase URL and publishable key.",
    );
  }

  return createClient<Database>(url, key, {
    auth: {
      storage: brokeredPreviewStorage(),
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let client: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_target, property, receiver) {
    client ??= createSupabaseClient();
    return Reflect.get(client, property, receiver);
  },
});
