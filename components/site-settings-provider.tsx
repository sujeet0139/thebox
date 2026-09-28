"use client";

import { createContext, useContext } from "react";

import { siteConfig } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

type SiteSettingsContextValue = SiteSettings;

const fallbackSettings: SiteSettingsContextValue = {
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

const SiteSettingsContext = createContext<SiteSettingsContextValue>(fallbackSettings);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}