import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { ProductFilter } from "@/components/product-filter";
import { getProducts } from "@/lib/products";
import { breadcrumbList } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Products | Cartons, Mailers, and Shipping Boxes",
  description:
    "Browse corrugated boxes, shipping cartons, and custom mailers. Build a quote list and send your packaging requirements on WhatsApp.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <section className="container-shell py-12 sm:py-16">
      <JsonLd data={breadcrumbList([{ name: "Home", path: "/" }, { name: "Products", path: "/products" }])} />
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-bark">Products</p>
      <h1 className="mt-4 max-w-4xl text-4xl text-forest sm:text-6xl">Packaging products for a tailored quote</h1>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
        Compare packaging options, choose quantities, and add items to your quote list. Send your request on WhatsApp; pricing and delivery details are confirmed for your specifications.
      </p>
      <p className="mt-2 text-xs text-slate-500">Product visuals are illustrations; confirm final appearance, materials, and specifications with the team.</p>
      <div className="mt-8 sm:mt-12">
        <ProductFilter products={products} />
      </div>
    </section>
  );
}
