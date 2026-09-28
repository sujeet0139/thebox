import type { Product } from "./types";

const products: Product[] = [
  {
    id: "prod_1",
    name: "Standard Corrugated Box",
    slug: "standard-corrugated-box",
    description: "Versatile and durable, our standard corrugated boxes are perfect for shipping, moving, and storage. Available in various sizes and strengths.",
    image_url: "/images/products/standard-corrugated-box.svg",
    gallery: [
      "/images/products/standard-corrugated-box.svg",
    ],
    features: [
      "3-ply to 7-ply options",
      "Corrugated construction options",
      "Ideal for general purpose shipping",
      "Custom sizes available on request",
    ],
    category: "Shipping",
  },
  {
    id: "prod_2",
    name: "Custom Printed Mailer Box",
    slug: "custom-printed-mailer-box",
    description: "Elevate your brand with our custom printed mailer boxes. Perfect for e-commerce, subscription boxes, and promotional kits. Full-color printing available.",
    image_url: "/images/products/custom-printed-mailer-box.svg",
    gallery: ["/images/products/custom-printed-mailer-box.svg"],
    price_label: "Price on request",
    features: [
      "High-quality digital printing",
      "Durable material for safe transit",
      "Self-locking for easy assembly",
      "Matte or gloss finish options",
    ],
    category: "E-commerce",
  },
  {
    id: "prod_3",
    name: "Heavy-Duty Shipping Box",
    slug: "heavy-duty-shipping-box",
    description: "Engineered for strength, these double-wall or triple-wall corrugated boxes are designed to protect heavy or fragile items during transit.",
    image_url: "/images/products/heavy-duty-shipping-box.svg",
    features: [
      "5-ply and 7-ply available",
      "High burst strength for maximum protection",
      "Suitable for industrial goods and electronics",
      "Bulk orders welcome",
    ],
    category: "Industrial",
  },
  {
    id: "prod_4",
    name: "Luxury Curated Gift Box",
    slug: "luxury-curated-gift-box",
    description: "Present your products in style with our premium gift boxes. Featuring rigid construction, elegant finishes, and options for custom inserts.",
    image_url: "/images/products/luxury-gift-box.svg",
    features: ["Rigid board construction", "Magnetic closure or lid-and-base style", "Foil stamping and embossing available", "Perfect for corporate and personal gifting"],
    category: "Gifting",
  },
  {
    id: "prod_5",
    name: "Food & Takeaway Packaging Box",
    slug: "food-grade-packaging-box",
    description: "Packaging options for bakeries, cafes, and takeaway businesses. Tell us what the box will contain so our team can confirm suitable material and finishes.",
    image_url: "/images/products/food-takeaway-box.svg",
    features: ["Options for bakery and takeaway packaging", "Grease and moisture resistant options can be discussed", "Share intended food use for material confirmation", "Ventilation holes can be discussed"],
    category: "Food",
  },
  {
    id: "prod_6",
    name: "Custom Die-Cut Box",
    slug: "custom-die-cut-box",
    description: "Precisely engineered die-cut boxes that can be tailored to any shape or size to fit your product perfectly, reducing waste and improving presentation.",
    image_url: "/images/products/custom-die-cut-box.svg",
    features: ["Unique shapes and designs", "Reduces need for void fill", "Perfect for retail and display packaging", "Intricate cuts and folds"],
    category: "Custom",
  },
];

export async function getProducts(): Promise<Product[]> {
  // In a real app, this would fetch from a database or a CMS.
  // For now, we're returning the static array.
  return Promise.resolve(products);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return Promise.resolve(products.find((product) => product.slug === slug));
}
