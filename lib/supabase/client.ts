"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "@/lib/supabase/env";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  const env = getSupabaseEnv();

  if (!env) {
    throw new Error("Missing Supabase environment variables.");
  }

  browserClient = createBrowserClient(env.url, env.anonKey);
  return browserClient;
}

