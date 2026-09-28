import { siteConfig } from "@/lib/site";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function absoluteSiteUrl(path: string) {
  return new URL(path, `${siteConfig.url}/`).toString();
}

export function breadcrumbList(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteSiteUrl(item.path),
    })),
  };
}
