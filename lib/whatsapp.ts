import type { CartItem, Product, UserDetails } from "@/lib/types";

export function buildProductInquiryUrl(whatsapp: string, product: Product, quantity = 1) {
  const safeQuantity = Math.max(1, quantity);
  const message = [
    "Hello, I would like a quote for:",
    `Product Name: ${product.name}`,
    `Quantity: ${safeQuantity}`,
    "",
    "Please confirm pricing, suitability, and delivery details for this requirement.",
  ].join("\n");

  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}

export function buildCartWhatsAppUrl(
  whatsapp: string,
  items: CartItem[],
  user?: UserDetails,
) {
  const lines = items.flatMap((item, index) => [
    `${index + 1}. Product Name: ${item.product.name}`,
    `   Quantity: ${item.quantity}`,
  ]);

  const userSection = user
    ? [
        "",
        "Customer Details:",
        `Name: ${user.name}`,
        `Phone: ${user.phone}`,
        user.address ? `Address: ${user.address}` : "",
      ].filter(Boolean)
    : [];

  const message = [
    "Hello, I would like a quote for these products:",
    ...lines,
    ...userSection,
    "",
    "Please confirm pricing and delivery details for these requirements.",
  ].join("\n");

  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}
