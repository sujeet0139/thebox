"use client";

import { useEffect } from "react";

export function ScrollToProducts() {
  useEffect(() => {
    const el = document.getElementById("products");
    if (el) {
      el.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }, []);

  return null;
}
