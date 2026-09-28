"use client";

import type { ChangeEvent } from "react";
import { ImagePlus, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/utils/cn";

type PreviewItem = {
  id: string;
  label: string;
  url: string;
  revokeOnCleanup?: boolean;
};

type ImageUploadFieldProps = {
  defaultImages?: string[];
  label: string;
  name: string;
  required?: boolean;
  multiple?: boolean;
  onProcessingChange?: (processing: boolean) => void;
};

function createDefaultPreviews(images: string[]) {
  return images.map((url, index) => ({
    id: `${url}-${index}`,
    label: `Current image ${index + 1}`,
    url,
  }));
}

async function loadImageDimensions(file: File) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error(`Failed to load ${file.name}`));
      element.src = objectUrl;
    });

    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function compressImage(file: File) {
  if (!file.type.startsWith("image/") || file.type.includes("svg") || file.type.includes("gif")) {
    return file;
  }

  const image = await loadImageDimensions(file);
  const maxDimension = 1600;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return file;
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", 0.82);
  });

  if (!blob) {
    return file;
  }

  const baseName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName}.webp`, {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

export function ImageUploadField({
  defaultImages = [],
  label,
  name,
  required = false,
  multiple = false,
  onProcessingChange,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [previewItems, setPreviewItems] = useState<PreviewItem[]>(() => createDefaultPreviews(defaultImages));
  const [hasLocalSelection, setHasLocalSelection] = useState(false);

  useEffect(() => {
    onProcessingChange?.(isPreparing);
  }, [isPreparing, onProcessingChange]);

  useEffect(() => {
    if (!hasLocalSelection) {
      setPreviewItems(createDefaultPreviews(defaultImages));
    }
  }, [defaultImages, hasLocalSelection]);

  useEffect(() => {
    return () => {
      previewItems.forEach((item) => {
        if (item.revokeOnCleanup) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, [previewItems]);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) {
      setHasLocalSelection(false);
      setPreviewItems(createDefaultPreviews(defaultImages));
      return;
    }

    setIsPreparing(true);

    try {
      const optimizedFiles = await Promise.all(selectedFiles.map((file) => compressImage(file)));
      const dataTransfer = new DataTransfer();
      const nextPreviews = optimizedFiles.map((file, index) => {
        dataTransfer.items.add(file);
        return {
          id: `${file.name}-${index}`,
          label: file.name,
          url: URL.createObjectURL(file),
          revokeOnCleanup: true,
        } satisfies PreviewItem;
      });

      if (inputRef.current) {
        inputRef.current.files = dataTransfer.files;
      }

      setHasLocalSelection(true);
      setPreviewItems(nextPreviews);
    } finally {
      setIsPreparing(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="block text-xs font-semibold uppercase tracking-[0.28em] text-bark">{label}</label>
        <span className="text-xs text-slate-500">{multiple ? "Multiple images supported" : "Single image"}</span>
      </div>

      <label
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-forest/20 bg-cream px-5 py-7 text-center transition hover:border-forest/35 hover:bg-sand/40",
          isPreparing && "pointer-events-none opacity-70",
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-forest shadow-sm">
          {isPreparing ? <UploadCloud className="h-5 w-5 animate-bounce" /> : <ImagePlus className="h-5 w-5" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-forest">
            {isPreparing ? "Optimizing selected images..." : "Click to choose product images"}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Previews are shown before upload. Images are compressed to WebP when possible.
          </p>
        </div>
        <input
          ref={inputRef}
          name={name}
          type="file"
          accept="image/*"
          required={required}
          multiple={multiple}
          className="sr-only"
          onChange={handleChange}
        />
      </label>

      {previewItems.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {previewItems.map((item, index) => (
            <div key={item.id} className="overflow-hidden rounded-[20px] border border-forest/10 bg-white">
              <div
                className="h-32 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${item.url})` }}
                aria-label={`${label} preview ${index + 1}`}
              />
              <div className="px-3 py-2.5 text-xs font-medium text-slate-600">{item.label}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}