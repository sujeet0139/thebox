"use client";

import { useState } from "react";

import { calculateVolume, formatMeasurement } from "@/lib/product-details";
import type { Category, Product } from "@/lib/types";

import { AdminProcessingNotice, AdminSubmitButton } from "./admin-submit-button";
import { ImageUploadField } from "./image-upload-field";

type ProductFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  categories: Category[];
  mode: "create" | "update";
  product?: Product;
};

const dimensionUnits = ["cm", "inch", "mm", "ft"];
const weightUnits = ["kg", "g", "lb"];

export function ProductForm({ action, categories, mode, product }: ProductFormProps) {
  const [length, setLength] = useState(product?.length?.toString() || "");
  const [breadth, setBreadth] = useState((product?.breadth ?? product?.width)?.toString() || "");
  const [height, setHeight] = useState(product?.height?.toString() || "");
  const [dimensionUnit, setDimensionUnit] = useState(product?.dimension_unit || "cm");
  const [isPreparingImages, setIsPreparingImages] = useState(false);

  const volume = calculateVolume(
    length ? Number(length) : null,
    breadth ? Number(breadth) : null,
    height ? Number(height) : null,
  );

  const defaultGallery = product?.gallery?.length
    ? product.gallery
    : product?.image_url
      ? [product.image_url]
      : [];

  return (
    <form action={action} className="space-y-4">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      {product ? <input type="hidden" name="current_image" value={product.image_url} /> : null}
      {product ? <input type="hidden" name="current_slug" value={product.slug} /> : null}
      {defaultGallery.map((image) => (
        <input key={image} type="hidden" name="current_gallery" value={image} />
      ))}

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="name"
          required
          defaultValue={product?.name || ""}
          placeholder="Product name *"
          className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3"
        />
        <input
          name="slug"
          defaultValue={product?.slug || ""}
          placeholder="Slug (auto-generated if empty)"
          className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3"
        />
      </div>

      <textarea
        name="description"
        required
        rows={4}
        defaultValue={product?.description || ""}
        placeholder="Short description *"
        className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <input
          name="price_label"
          defaultValue={product?.price_label || ""}
          placeholder="Price label"
          className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3"
        />
        <input
          name="stock"
          type="number"
          min="0"
          defaultValue={product?.stock ?? 0}
          placeholder="Stock"
          className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3"
        />
        <input
          name="sort_order"
          type="number"
          min="0"
          defaultValue={product?.sort_order ?? 0}
          placeholder="Sort order"
          className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3"
        />
        <label className="flex items-center gap-3 rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm font-medium text-forest">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={product?.is_active !== false}
            className="h-4 w-4 rounded border-forest/20"
          />
          Active product
        </label>
      </div>

      <select
        name="category"
        defaultValue={product?.category || ""}
        className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3"
      >
        <option value="">Select category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>{category.name}</option>
        ))}
      </select>

      <div className="rounded-[24px] border border-forest/10 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-forest">Dimensions & Weight</h3>
            <p className="mt-1 text-sm text-slate-500">Length x Breadth x Height is used to auto-calculate product volume.</p>
          </div>
          <div className="rounded-2xl bg-sand px-4 py-2 text-sm font-semibold text-forest">
            Volume: {typeof volume === "number" ? formatMeasurement(volume) : "-"} {dimensionUnit + "3"}
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <input
            name="length"
            type="number"
            min="0"
            step="0.01"
            value={length}
            onChange={(event) => setLength(event.target.value)}
            placeholder="Length"
            className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3"
          />
          <input
            name="breadth"
            type="number"
            min="0"
            step="0.01"
            value={breadth}
            onChange={(event) => setBreadth(event.target.value)}
            placeholder="Breadth"
            className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3"
          />
          <input
            name="height"
            type="number"
            min="0"
            step="0.01"
            value={height}
            onChange={(event) => setHeight(event.target.value)}
            placeholder="Height"
            className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3"
          />
          <select
            name="dimension_unit"
            value={dimensionUnit}
            onChange={(event) => setDimensionUnit(event.target.value)}
            className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3"
          >
            {dimensionUnits.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
          <input
            name="weight"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product?.weight ?? ""}
            placeholder="Weight (optional)"
            className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3"
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_220px]">
          <input
            value={typeof volume === "number" ? formatMeasurement(volume) : ""}
            readOnly
            placeholder="Volume auto-calculated"
            className="w-full rounded-2xl border border-forest/10 bg-sand/50 px-4 py-3 text-forest"
          />
          <select
            name="weight_unit"
            defaultValue={product?.weight_unit || "kg"}
            className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3"
          >
            {weightUnits.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
      </div>

      <textarea
        name="features"
        rows={4}
        defaultValue={(product?.features || []).join("\n")}
        placeholder="Features, one per line"
        className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3"
      />
      <textarea
        name="use_cases"
        rows={4}
        defaultValue={(product?.use_cases || []).join("\n")}
        placeholder="Use cases, one per line"
        className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3"
      />

      <ImageUploadField
        label={mode === "create" ? "Product Images *" : "Replace Product Images"}
        name="images"
        multiple
        required={mode === "create"}
        defaultImages={defaultGallery}
        onProcessingChange={setIsPreparingImages}
      />

      <AdminProcessingNotice processing={isPreparingImages} />
      <AdminSubmitButton
        processing={isPreparingImages}
        className="w-full bg-forest text-white hover:bg-forest/90"
      >
        {mode === "create" ? "Create Product" : "Save Changes"}
      </AdminSubmitButton>
    </form>
  );
}