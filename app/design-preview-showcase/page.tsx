import type { Metadata } from "next";

import { DesignPreviewShowcase } from "@/components/design-preview-showcase";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Full Showcase Preview | TheBoxMakers",
  description:
    "Full professional carton website preview with banner sliding, product sliding, and richer product descriptions for client approval.",
};

export default async function DesignPreviewShowcasePage() {
  const products = await getProducts();

  return <DesignPreviewShowcase products={products} />;
}