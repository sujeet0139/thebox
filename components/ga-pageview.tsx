"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function GAPageView({ gaId }: { gaId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!gaId) return;
    if (typeof window === "undefined") return;
    if (typeof window.gtag !== "function") return;

    const pagePath = `${pathname}${window.location.search || ""}`;
    window.gtag("config", gaId, { page_path: pagePath });
  }, [gaId, pathname]);

  return null;
}
