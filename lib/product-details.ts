import type { Product } from "@/lib/types";

export function getProductBreadth(product: Pick<Product, "breadth" | "width">) {
  return product.breadth ?? product.width ?? null;
}

export function calculateVolume(length?: number | null, breadth?: number | null, height?: number | null) {
  if (typeof length !== "number" || typeof breadth !== "number" || typeof height !== "number") {
    return null;
  }

  return Number((length * breadth * height).toFixed(2));
}

export function formatMeasurement(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "";
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
}

export function formatDimensionLabel(product: Pick<Product, "length" | "breadth" | "width" | "height" | "dimension_unit">) {
  const breadth = getProductBreadth(product);

  if (
    typeof product.length !== "number" ||
    typeof breadth !== "number" ||
    typeof product.height !== "number"
  ) {
    return "";
  }

  const unit = product.dimension_unit ? ` ${product.dimension_unit}` : "";
  return `${formatMeasurement(product.length)} x ${formatMeasurement(breadth)} x ${formatMeasurement(product.height)}${unit}`;
}

export function formatVolumeLabel(product: Pick<Product, "volume" | "length" | "breadth" | "width" | "height" | "dimension_unit">) {
  const volume =
    typeof product.volume === "number"
      ? product.volume
      : calculateVolume(product.length, getProductBreadth(product), product.height);

  if (typeof volume !== "number") {
    return "";
  }

  const unit = product.dimension_unit ? ` ${product.dimension_unit}3` : "";
  return `${formatMeasurement(volume)}${unit}`.trim();
}

export function normalizeGallery(gallery: string[] | null | undefined, imageUrl: string) {
  const images = [imageUrl, ...(gallery || [])].filter(Boolean);
  return Array.from(new Set(images));
}