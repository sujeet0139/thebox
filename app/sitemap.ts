import type { MetadataRoute } from "next";

import { getProducts } from "@/lib/products";
import { siteConfig } from "@/lib/site";

const corePaths = ["", "/products", "/enquiry", "/about", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  return [
    ...corePaths.map((path) => ({
      url: `${siteConfig.url}${path}`,
      changeFrequency: path === "" || path === "/products" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.8,
    })),
    ...products.map((product) => ({
      url: `${siteConfig.url}/products/${product.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
