"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";

interface ProductInquiryGridProps {
  products: Product[];
  whatsappNumber: string;
}

export function ProductInquiryGrid({ products, whatsappNumber }: ProductInquiryGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(100);
  const [dimensions, setDimensions] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");

  const handleWhatsApp = () => {
    if (!selectedProduct) return;
    
    // Fallback WhatsApp number if none provided in settings
    const phone = whatsappNumber || "918920894998";
    
    const message = `Hello! I would like a quote for:
- Product: ${selectedProduct.name}
- Quantity: ${Math.max(1, quantity)}
${dimensions.trim() ? `- Dimensions: ${dimensions.trim()}\n` : ""}${deliveryCity.trim() ? `- Delivery city: ${deliveryCity.trim()}\n` : ""}
Please confirm pricing, suitable construction, and delivery details for this requirement.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
  };

  return (
    <div>
      {/* 4 Items per row on mobile, reduced gaps, standard sizes */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:gap-4">
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            aria-pressed={selectedProduct?.id === product.id}
            onClick={() => setSelectedProduct(product)}
            className={`w-full cursor-pointer overflow-hidden rounded-xl border bg-white p-2 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
              selectedProduct?.id === product.id
                ? "border-gold ring-1 ring-gold"
                : "border-[#d8c2a3]/60"
            }`}
          >
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-[#f0ece4] mb-2">
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="line-clamp-2 text-[10px] font-semibold leading-tight text-forest sm:text-xs">
              {product.name}
            </h3>
          </button>
        ))}
      </div>

      {/* Inquiry Form for the Selected Product */}
      {selectedProduct && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-[28px] border border-[#d8c2a3]/60 bg-white p-6 shadow-soft sm:p-8">
          <h3 className="mb-2 text-xl font-semibold text-forest sm:text-2xl">
            Inquire About: <span className="text-gold">{selectedProduct.name}</span>
          </h3>
          <p className="mb-6 text-sm text-ink/70">
            Pricing depends on box dimensions, quantity, construction, printing, and delivery location.
          </p>
          
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="quick-quote-quantity" className="mb-2 block text-sm font-semibold text-forest">
                Quantity Required
              </label>
              <input
                id="quick-quote-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-sm text-ink outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <label htmlFor="quick-quote-dimensions" className="mb-2 block text-sm font-semibold text-forest">Dimensions (optional)</label>
              <input
                id="quick-quote-dimensions"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-sm text-ink outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                placeholder="L × W × H, with unit"
              />
            </div>
            <div>
              <label htmlFor="quick-quote-city" className="mb-2 block text-sm font-semibold text-forest">Delivery city (optional)</label>
              <input
                id="quick-quote-city"
                value={deliveryCity}
                onChange={(e) => setDeliveryCity(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-sm text-ink outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                placeholder="e.g. Gurugram"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={handleWhatsApp}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#20bd5a] sm:w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.656.84 5.166 2.308 7.234L.493 24l4.898-1.785a11.97 11.97 0 006.64 1.986c6.645 0 12.03-5.385 12.03-12.03C24.062 5.385 18.676 0 12.031 0zm0 22.062c-2.22 0-4.39-.588-6.3-1.706l-.453-.267-3.637 1.332 1.34-3.568-.293-.466A9.873 9.873 0 012.14 12.03c0-5.464 4.444-9.907 9.89-9.907 5.465 0 9.891 4.443 9.891 9.907 0 5.464-4.426 9.908-9.89 9.908zm5.426-7.406c-.297-.15-1.764-.872-2.037-.972-.274-.1-.47-.15-.67.15-.198.3-.77 .972-.942 1.171-.173.2-.345.225-.642.075-.297-.15-1.258-.462-2.395-1.304-.885-.655-1.482-1.464-1.655-1.764-.173-.3 0-.46.15-.61.134-.134.298-.344.448-.518.15-.174.2-.298.298-.498.1-.2.05-.373-.025-.522-.075-.15-.67-1.616-.918-2.213-.242-.58-.488-.5-.67-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.793.373-.273.3-1.04 1.02-1.04 2.49 0 1.47 1.064 2.89 1.212 3.09.15.2 2.106 3.213 5.103 4.5 2.05 0.88 2.834 0.945 3.86 0.793 1.138-.168 3.5-1.43 3.995-2.815.496-1.385.496-2.57.348-2.815-.15-.248-.545-.398-.842-.548z" />
              </svg>
              Send Inquiry via WhatsApp
            </button>
            <p className="text-xs text-ink/50 sm:text-sm">
              Add dimensions and delivery city in your message for a more useful quote.
            </p>
          </div>
          <Link href={`/products/${selectedProduct.slug}`} className="mt-4 inline-flex text-sm font-semibold text-forest underline underline-offset-4">
            View product details and features
          </Link>
        </div>
      )}
    </div>
  );
}
