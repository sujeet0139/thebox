import { cache } from "react";

import { createClient } from "@supabase/supabase-js";

import { siteConfig } from "@/lib/site";
import { getSupabaseEnv } from "@/lib/supabase/env";
import type { Category, SiteSettings, Slider } from "@/lib/types";

function getPublicSupabaseClient() {
  const env = getSupabaseEnv();

  if (!env) {
    return null;
  }

  return createClient(env.url, env.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getDefaultSiteSettings(): SiteSettings {
  return {
    phone: siteConfig.phone,
    whatsapp: siteConfig.whatsapp,
    email: siteConfig.email,
    address: siteConfig.address,
    mapUrl: siteConfig.mapUrl,
    facebookUrl: "",
    instagramUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
  };
}

function mergeSiteSettings(partial?: Partial<SiteSettings> | null): SiteSettings {
  return {
    ...getDefaultSiteSettings(),
    ...(partial || {}),
  };
}

export const getSiteSettings = cache(async () => {
  const supabase = getPublicSupabaseClient();

  if (!supabase) {
    return getDefaultSiteSettings();
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("phone, whatsapp, email, address, map_url, facebook_url, instagram_url, linkedin_url, youtube_url")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    return getDefaultSiteSettings();
  }

  return mergeSiteSettings({
    phone: data.phone || undefined,
    whatsapp: data.whatsapp || undefined,
    email: data.email || undefined,
    address: data.address || undefined,
    mapUrl: data.map_url || undefined,
    facebookUrl: data.facebook_url || undefined,
    instagramUrl: data.instagram_url || undefined,
    linkedinUrl: data.linkedin_url || undefined,
    youtubeUrl: data.youtube_url || undefined,
  });
});

const fallbackCategories: Category[] = [
  { id: "fallback-corrugated-boxes", name: "Corrugated Boxes", slug: "corrugated-boxes", sort_order: 1, is_active: true },
  { id: "fallback-custom-boxes", name: "Custom Boxes", slug: "custom-boxes", sort_order: 2, is_active: true },
  { id: "fallback-export-cartons", name: "Export Cartons", slug: "export-cartons", sort_order: 3, is_active: true },
];

const getStoredCategories = cache(async () => {
  const supabase = getPublicSupabaseClient();

  if (!supabase) {
    return [] as Category[];
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, sort_order, is_active, created_at")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data?.length) {
    return [] as Category[];
  }

  return (data as Category[]).filter((category) => category.is_active !== false);
});

export async function getCategories(options?: { includeFallback?: boolean }) {
  const stored = await getStoredCategories();

  if (stored.length || options?.includeFallback === false) {
    return stored;
  }

  return fallbackCategories;
}

export const getSliderData = cache(async (): Promise<Slider[]> => {
  const supabase = getPublicSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("sliders")
    .select("id, title, link_url, image_url, order")
    .order("order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as Slider[];
});
