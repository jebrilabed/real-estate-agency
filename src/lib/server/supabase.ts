import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function getSupabaseConfig() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Supabase server environment is not configured.");
  return { url, key };
}

function apiKeyFetch(key: string, token?: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) new Headers(init.headers).forEach((value, name) => headers.set(name, value));
    if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", key);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(input, { ...init, headers });
  };
}

export function createPublicSupabaseClient() {
  const { url, key } = getSupabaseConfig();
  return createClient<Database>(url, key, {
    global: { fetch: apiKeyFetch(key) },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function createUserSupabaseClient(accessToken: string) {
  const { url, key } = getSupabaseConfig();
  return createClient<Database>(url, key, {
    global: { fetch: apiKeyFetch(key, accessToken) },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
