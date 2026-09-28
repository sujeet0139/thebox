"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { calculateVolume, normalizeGallery } from "@/lib/product-details";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/utils/slugify";

async function getAnonymousClient() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    redirect("/admin/login?error=env");
  }

  return supabase;
}

function parseTextList(value: FormDataEntryValue | null) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseOptionalNumber(value: FormDataEntryValue | null) {
  const raw = String(value || "").trim();

  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseOptionalInteger(value: FormDataEntryValue | null) {
  const parsed = parseOptionalNumber(value);

  if (typeof parsed !== "number") {
    return null;
  }

  return Math.max(0, Math.round(parsed));
}

function parseCheckbox(value: FormDataEntryValue | null) {
  return String(value || "") === "on";
}

function getProductMeasurements(formData: FormData) {
  const length = parseOptionalNumber(formData.get("length"));
  const breadth = parseOptionalNumber(formData.get("breadth")) ?? parseOptionalNumber(formData.get("width"));
  const height = parseOptionalNumber(formData.get("height"));

  return {
    length,
    breadth,
    height,
    volume: calculateVolume(length, breadth, height),
  };
}

function getIncomingImages(formData: FormData) {
  const files = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length) {
    return files;
  }

  const singleImage = formData.get("image");
  return singleImage instanceof File && singleImage.size > 0 ? [singleImage] : [];
}

function getCurrentGallery(formData: FormData, currentImage?: string) {
  const gallery = formData
    .getAll("current_gallery")
    .map((entry) => String(entry || "").trim())
    .filter(Boolean);

  return normalizeGallery(gallery, currentImage || gallery[0] || "").filter(Boolean);
}

function revalidateStorefront(productSlug?: string) {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/contact");
  if (productSlug) {
    revalidatePath(`/products/${productSlug}`);
  }
}

async function uploadImagesIfNeeded(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  formData: FormData,
  slug: string,
  currentGallery: string[] = [],
) {
  const files = getIncomingImages(formData);

  if (!files.length) {
    return currentGallery;
  }

  const uploads = await Promise.all(
    files.map(async (file, index) => {
      const extension = file.type.includes("webp") ? "webp" : file.name.split(".").pop() || "jpg";
      const filePath = `products/${slug}-${Date.now()}-${index}.${extension}`;
      const arrayBuffer = await file.arrayBuffer();

      const { error } = await supabase.storage.from("product-images").upload(filePath, arrayBuffer, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

      if (error) {
        throw error;
      }

      const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
      return data.publicUrl;
    }),
  );

  return uploads;
}

async function deleteStorageFiles(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"], fileUrls: string[]) {
  if (fileUrls.length === 0) {
    return;
  }

  const filePaths = fileUrls.map(url => {
    const urlParts = url.split('/');
    // Assumes the path is the last part of the URL after the bucket name
    return urlParts.slice(urlParts.indexOf('product-images') + 1).join('/');
  });

  await supabase.storage.from("product-images").remove(filePaths);
}

export async function loginAdminAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const supabase = await getAnonymousClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/admin/login?error=credentials");
  }

  redirect("/admin");
}

export async function logoutAdminAction() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createProductAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const slug = slugify(String(formData.get("slug") || name));
  const priceLabel = String(formData.get("price_label") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const sortOrder = parseOptionalInteger(formData.get("sort_order")) ?? 0;
  const stock = parseOptionalInteger(formData.get("stock")) ?? 0;
  const dimensionUnit = String(formData.get("dimension_unit") || "").trim();
  const weight = parseOptionalNumber(formData.get("weight"));
  const weightUnit = String(formData.get("weight_unit") || "").trim();
  const isActive = parseCheckbox(formData.get("is_active"));
  const { length, breadth, height, volume } = getProductMeasurements(formData);

  if (!name || !description || !slug) {
    redirect("/admin?status=missing&tab=products");
  }

  const gallery = await uploadImagesIfNeeded(supabase, formData, slug);
  const imageUrl = gallery[0] || "";

  if (!imageUrl) {
    redirect("/admin?status=missing&tab=products");
  }

  const features = parseTextList(formData.get("features"));
  const useCases = parseTextList(formData.get("use_cases"));

  const { error } = await supabase.from("products").insert({
    name,
    slug,
    description,
    image_url: imageUrl,
    gallery,
    features,
    use_cases: useCases,
    price_label: priceLabel || null,
    category: category || null,
    sort_order: sortOrder,
    stock,
    length,
    breadth,
    width: breadth,
    height,
    dimension_unit: dimensionUnit || null,
    weight,
    weight_unit: weightUnit || null,
    volume,
    is_active: isActive,
  });

  if (error) {
    // Cleanup uploaded files if database insert fails
    await deleteStorageFiles(supabase, gallery);
    redirect("/admin?status=error&tab=products");
  }

  revalidateStorefront(slug);
  revalidatePath("/admin");
  redirect("/admin?status=created&tab=products");
}

export async function updateProductAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const slug = slugify(String(formData.get("slug") || name));
  const currentImage = String(formData.get("current_image") || "").trim();
  const currentSlug = String(formData.get("current_slug") || "").trim();
  const priceLabel = String(formData.get("price_label") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const sortOrder = parseOptionalInteger(formData.get("sort_order")) ?? 0;
  const stock = parseOptionalInteger(formData.get("stock")) ?? 0;
  const dimensionUnit = String(formData.get("dimension_unit") || "").trim();
  const weight = parseOptionalNumber(formData.get("weight"));
  const weightUnit = String(formData.get("weight_unit") || "").trim();
  const isActive = parseCheckbox(formData.get("is_active"));
  const { length, breadth, height, volume } = getProductMeasurements(formData);

  if (!id || !name || !description || !slug) {
    redirect("/admin?status=missing&tab=products");
  }

  const currentGallery = getCurrentGallery(formData, currentImage);
  const gallery = await uploadImagesIfNeeded(supabase, formData, slug, currentGallery);
  const imageUrl = gallery[0] || currentImage;
  const features = parseTextList(formData.get("features"));
  const useCases = parseTextList(formData.get("use_cases"));

  const { error } = await supabase
    .from("products")
    .update({
      name,
      slug,
      description,
      image_url: imageUrl,
      gallery,
      features,
      use_cases: useCases,
      price_label: priceLabel || null,
      category: category || null,
      sort_order: sortOrder,
      stock,
      length,
      breadth,
      width: breadth,
      height,
      dimension_unit: dimensionUnit || null,
      weight,
      weight_unit: weightUnit || null,
      volume,
      is_active: isActive,
    })
    .eq("id", id);

  if (error) {
    // Cleanup newly uploaded files if database update fails
    await deleteStorageFiles(supabase, gallery.filter(url => !currentGallery.includes(url)));
    redirect("/admin?status=error&tab=products");
  }

  revalidateStorefront(currentSlug || slug);
  if (currentSlug && currentSlug !== slug) {
    revalidatePath(`/products/${currentSlug}`);
  }
  revalidatePath("/admin");
  redirect("/admin?status=updated&tab=products");
}

export async function deleteProductAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const slug = String(formData.get("slug") || "").trim();

  if (!id) {
    redirect("/admin?status=missing&tab=products");
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    redirect("/admin?status=error&tab=products");
  }

  revalidateStorefront(slug);
  revalidatePath("/admin");
  redirect("/admin?status=deleted&tab=products");
}

export async function createCategoryAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const slug = slugify(String(formData.get("slug") || name));
  const sortOrder = parseOptionalNumber(formData.get("sort_order")) ?? 0;
  const isActive = String(formData.get("is_active") || "on") === "on";

  if (!name || !slug) {
    redirect("/admin?status=category-missing&tab=products");
  }

  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    sort_order: sortOrder,
    is_active: isActive,
  });

  if (error) {
    redirect("/admin?status=category-error&tab=products");
  }

  revalidateStorefront();
  revalidatePath("/admin");
  redirect("/admin?status=category-created&tab=products");
}

export async function updateCategoryAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const oldName = String(formData.get("old_name") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const slug = slugify(String(formData.get("slug") || name));
  const sortOrder = parseOptionalNumber(formData.get("sort_order")) ?? 0;
  const isActive = String(formData.get("is_active") || "") === "on";

  if (!id || !name || !slug) {
    redirect("/admin?status=category-missing&tab=products");
  }

  const { error } = await supabase
    .from("categories")
    .update({
      name,
      slug,
      sort_order: sortOrder,
      is_active: isActive,
    })
    .eq("id", id);

  if (error) {
    redirect("/admin?status=category-error&tab=products");
  }

  if (oldName && oldName !== name) {
    await supabase.from("products").update({ category: name }).eq("category", oldName);
  }

  revalidateStorefront();
  revalidatePath("/admin");
  redirect("/admin?status=category-updated&tab=products");
}

export async function deleteCategoryAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();

  if (!id) {
    redirect("/admin?status=category-missing&tab=products");
  }

  if (name) {
    await supabase.from("products").update({ category: null }).eq("category", name);
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    redirect("/admin?status=category-error&tab=products");
  }

  revalidateStorefront();
  revalidatePath("/admin");
  redirect("/admin?status=category-deleted&tab=products");
}

export async function updateSiteSettingsAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const payload = {
    id: 1,
    phone: String(formData.get("phone") || "").trim() || null,
    whatsapp: String(formData.get("whatsapp") || "").trim() || null,
    email: String(formData.get("email") || "").trim() || null,
    address: String(formData.get("address") || "").trim() || null,
    map_url: String(formData.get("map_url") || "").trim() || null,
    facebook_url: String(formData.get("facebook_url") || "").trim() || null,
    instagram_url: String(formData.get("instagram_url") || "").trim() || null,
    linkedin_url: String(formData.get("linkedin_url") || "").trim() || null,
    youtube_url: String(formData.get("youtube_url") || "").trim() || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("site_settings").upsert(payload, { onConflict: "id" });

  if (error) {
    redirect("/admin?status=settings-error&tab=settings");
  }

  revalidateStorefront();
  revalidatePath("/admin");
  redirect("/admin?status=settings-saved&tab=settings");
}

export async function createSliderAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  const link_url = String(formData.get("link_url") || "").trim();
  const order = parseOptionalInteger(formData.get("order")) ?? 0;
  const imageFile = formData.get("image") as File;

  if (!title || !link_url || !imageFile || imageFile.size === 0) {
    return redirect("/admin?tab=slider&status=missing-fields");
  }

  const slug = slugify(title);
  let imageUrl = "";

  try {
    const uploadedUrls = await uploadImagesIfNeeded(supabase, formData, `slider-${slug}`);
    imageUrl = uploadedUrls[0] || "";

    if (!imageUrl) {
      throw new Error("Image upload failed.");
    }

    const { error: insertError } = await supabase.from("sliders").insert({ title, link_url, order, image_url: imageUrl });

    if (insertError) {
      throw insertError;
    }

    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin?tab=slider&status=slider-created");
  } catch (error) {
    console.error("Error creating slider:", error);
    // If an image was uploaded, clean it up
    if (imageUrl) {
      await deleteStorageFiles(supabase, [imageUrl]);
    }
    redirect("/admin?tab=slider&status=error");
  }
}

export async function updateSliderAction(formData: FormData) {
  // This is a placeholder. The implementation would be similar to
  // updateProductAction, including the cleanup logic for new images on failure.
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  // ... get other form data
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?tab=slider&status=slider-updated");
}

export async function deleteSliderAction(formData: FormData) {
  // This is a placeholder. The implementation would delete the database
  // record and then the associated image from storage.
  redirect("/admin?tab=slider&status=slider-deleted");
}