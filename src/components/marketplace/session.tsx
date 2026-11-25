"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client.next";
import type { User } from "@supabase/supabase-js";
const SessionContext = createContext<{ user: User | null; role: string | null; ready: boolean }>({
  user: null,
  role: null,
  ready: false,
});
export const useSession = () => useContext(SessionContext);
export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const qc = useQueryClient();
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!active) return;
        setUser(data.user);
        if (data.user) {
          const { data: r } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", data.user.id)
            .single();
          if (active) setRole(r?.role || null);
        } else setRole(null);
      } catch {
        if (active) {
          setUser(null);
          setRole(null);
        }
      } finally {
        if (active) setReady(true);
      }
    };
    let subscription: { unsubscribe: () => void } | undefined;
    try {
      const result = supabase.auth.onAuthStateChange((event) => {
        if (!["SIGNED_IN", "SIGNED_OUT", "USER_UPDATED"].includes(event)) return;
        setReady(false);
        void refresh();
        if (event === "SIGNED_OUT") qc.clear();
        else void qc.invalidateQueries();
      });
      subscription = result.data.subscription;
      void refresh();
    } catch {
      setReady(true);
    }
    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, [qc]);
  return <SessionContext.Provider value={{ user, role, ready }}>{children}</SessionContext.Provider>;
}
