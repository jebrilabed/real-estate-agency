"use client";

import { createLovableAuth } from "@lovable.dev/cloud-auth-js";
import type { OAuthProvider } from "@lovable.dev/cloud-auth-js";
import { supabase } from "@/integrations/supabase/client.next";

const lovableAuth = createLovableAuth();

type SignInOptions = {
  redirect_uri?: string;
  extraParams?: Record<string, string>;
};

export const lovable = {
  auth: {
    signInWithOAuth: async (provider: OAuthProvider, options?: SignInOptions) => {
      const result = await lovableAuth.signInWithOAuth(provider, {
        ...options,
        extraParams: { ...options?.extraParams },
      });

      if (result.redirected || result.error) return result;

      try {
        await supabase.auth.setSession(result.tokens);
      } catch (error) {
        return { error: error instanceof Error ? error : new Error(String(error)) };
      }

      return result;
    },
  },
};
