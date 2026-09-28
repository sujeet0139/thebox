"use client";

import { useState, useMemo } from "react";

import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";

const ALL = "All";

export function ProductFilter({ products }: { products: Product[] }) {
  const [active, setActive] = useState(ALL);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const p of products) {
      if (p.category) seen.add(p.category);
    }
    return [ALL, ...Array.from(seen)];
  }, [products]);

  const filtered = active === ALL ? products : products.filter((p) => p.category === active);

  return (
    <>
      {categories.length > 2 ? (
        <div className="mb-6 flex flex-wrap gap-2 sm:mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active === cat
                  ? "bg-forest text-white shadow-[0_14px_30px_rgba(23,59,42,0.16)]"
                  : "border border-[#d8c2a3]/70 bg-white/80 text-forest hover:border-forest hover:bg-forest hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
