import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Ruler } from "lucide-react";

import { ProductPurchaseActions } from "@/components/product-purchase-actions";
import { JsonLd } from "@/components/json-ld";
import { getProductBySlug, getProducts } from "@/lib/products";
import { siteConfig } from "@/lib/site";
import { breadcrumbList } from "@/lib/structured-data";
import type { Product } from "@/lib/types";

function formatDimensions(product: Product) {
  const values = [product.length, product.width, product.height].filter((value) => typeof value === "number");

  if (!values.length) {
    return "";
  }

  return `${values.join(" x ")} ${product.dimension_unit || ""}`.trim();
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | TheBoxMakers",
    };
  }

  return {
    title: `${product.name} | TheBoxMakers`,
    description: product.description,
    openGraph: {
      title: `${product.name} | TheBoxMakers`,
      description: product.description,
      images: [product.image_url],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const gallery: string[] = product.gallery?.length ? product.gallery : [product.image_url];
  const features = product.features?.length
    ? product.features
    : ["Custom sizing", "Eco friendly board options", "High-strength packaging performance"];
  const useCases = product.use_cases?.length ? product.use_cases : ["E-commerce", "Fragile items", "Retail dispatch"];
  const dimensions = formatDimensions(product);
  const productUrl = `${siteConfig.url}/products/${product.slug}`;
  const productImages = Array.from(new Set([product.image_url, ...(product.gallery || [])])).filter(
    (image) => !image.includes("placehold.co"),
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: product.name,
        description: product.description,
        ...(productImages.length ? { image: productImages } : {}),
        sku: product.id,
        category: product.category,
        brand: { "@type": "Brand", name: siteConfig.name },
        manufacturer: { "@id": `${siteConfig.url}/#organization` },
      },
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: product.name, path: `/products/${product.slug}` },
      ]),
    ],
  };

  return (
    <section className="container-shell pb-36 pt-16 sm:pt-20 md:pb-20">
      <JsonLd data={structuredData} />
      <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-5">
          {gallery.map((image: string, index: number) => (
            <div key={`${image}-${index}`} className="card-surface relative h-[260px] overflow-hidden sm:h-[340px]">
              <Image src={image} alt={`${product.name} image ${index + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-bark">Product Detail</p>
          <h1 className="mt-4 text-4xl text-forest sm:text-6xl">{product.name}</h1>
          <p className="mt-6 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">{product.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {product.category ? (
              <span className="rounded-full bg-sand px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-bark">
                {product.category}
              </span>
            ) : null}
            {product.price_label ? (
              <span className="rounded-full bg-forest/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
                {product.price_label}
              </span>
            ) : null}
            {dimensions ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-forest/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
                <Ruler className="h-3.5 w-3.5" />
                {dimensions}
              </span>
            ) : null}
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="card-surface p-6">
              <h2 className="text-3xl text-forest">Features</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                {features.map((feature: string) => (
                  <li key={feature} className="flex gap-3">
                    <span className="text-forest">-</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-surface p-6">
              <h2 className="text-3xl text-forest">Use Cases</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                {useCases.map((item: string) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-forest">-</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card-surface mt-8 p-8">
          <h2 className="text-3xl text-forest">Request a quote or ask a question</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Add this product to your quote list or send a WhatsApp request. Include your size, quantity, print needs, and delivery city so the team can confirm the specifications and price.
            </p>
            <div className="mt-6">
              <ProductPurchaseActions product={product} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
