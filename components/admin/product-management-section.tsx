"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Package2, PencilLine, Search, ShieldCheck } from "lucide-react";

import { formatDimensionLabel, formatVolumeLabel } from "@/lib/product-details";
import type { Category, Product } from "@/lib/types";

import { AdminSubmitButton } from "./admin-submit-button";
import { ProductForm } from "./product-form";

type ProductManagementSectionProps = {
  categories: Category[];
  createAction: (formData: FormData) => void | Promise<void>;
  deleteAction: (formData: FormData) => void | Promise<void>;
  products: Product[];
  updateAction: (formData: FormData) => void | Promise<void>;
};

const pageSize = 6;

export function ProductManagementSection({
  categories,
  createAction,
  deleteAction,
  products,
  updateAction,
}: ProductManagementSectionProps) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || "");

  const filteredProducts = products.filter((product) => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      !normalizedQuery ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.slug.toLowerCase().includes(normalizedQuery) ||
      (product.category || "").toLowerCase().includes(normalizedQuery);
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? product.is_active !== false : product.is_active === false);

    return matchesQuery && matchesCategory && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleProducts = filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize);
  const selectedProduct = products.find((product) => product.id === selectedProductId) || visibleProducts[0] || products[0] || null;
  const activeCount = products.filter((product) => product.is_active !== false).length;
  const inactiveCount = products.length - activeCount;
  const lowStockCount = products.filter((product) => (product.stock || 0) <= 10).length;

  useEffect(() => {
    setPage(1);
  }, [query, categoryFilter, statusFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (!selectedProductId && products[0]) {
      setSelectedProductId(products[0].id);
      return;
    }

    if (selectedProductId && !products.some((product) => product.id === selectedProductId) && products[0]) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  return (
    <div className="mt-8 space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Active Products", value: activeCount, icon: ShieldCheck },
          { label: "Inactive Products", value: inactiveCount, icon: Package2 },
          { label: "Low Stock", value: lowStockCount, icon: PencilLine },
        ].map((item) => (
          <div key={item.label} className="rounded-[26px] border border-forest/10 bg-white p-5 shadow-[0_18px_55px_rgba(23,59,42,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-bark">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-forest">{item.value}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sand text-forest">
                <item.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[30px] border border-forest/10 bg-white p-8 shadow-[0_18px_55px_rgba(23,59,42,0.08)]">
          <h2 className="text-4xl text-forest">Product Management</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Add products with multiple optimized images, live dimension calculations, and clear processing feedback for uploads.</p>
          <div className="mt-6">
            <ProductForm action={createAction} categories={categories} mode="create" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] border border-forest/10 bg-white p-6 shadow-[0_18px_55px_rgba(23,59,42,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl text-forest">Product List</h3>
                <p className="mt-1 text-sm text-slate-500">Search, filter, and jump straight into edits.</p>
              </div>
              <div className="rounded-full bg-sand px-4 py-2 text-sm font-semibold text-forest">{filteredProducts.length} product(s)</div>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1.2fr_220px_180px]">
              <label className="flex items-center gap-3 rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm text-slate-600">
                <Search className="h-4 w-4 text-forest" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by product name, slug, or category"
                  className="w-full bg-transparent outline-none"
                />
              </label>

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm text-slate-600"
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm text-slate-600"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="mt-5 overflow-hidden rounded-[26px] border border-forest/10">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-forest text-white">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Product Name</th>
                      <th className="px-4 py-3 font-semibold">Price</th>
                      <th className="px-4 py-3 font-semibold">Stock</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest/10 bg-white">
                    {visibleProducts.length ? visibleProducts.map((product) => (
                      <tr key={product.id} className="align-top">
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => setSelectedProductId(product.id)}
                            className="flex items-start gap-3 text-left"
                          >
                            <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-sand">
                              <Image src={product.gallery?.[0] || product.image_url} alt={product.name} fill className="object-cover" />
                            </div>
                            <div>
                              <p className="font-semibold text-forest">{product.name}</p>
                              <p className="mt-1 text-xs text-slate-500">/{product.slug}</p>
                              <p className="mt-1 text-xs text-slate-500">{formatDimensionLabel(product) || "Dimensions not added"}</p>
                            </div>
                          </button>
                        </td>
                        <td className="px-4 py-4 text-slate-600">{product.price_label || "Price on request"}</td>
                        <td className="px-4 py-4 text-slate-600">{product.stock ?? 0}</td>
                        <td className="px-4 py-4 text-slate-600">{product.category || "-"}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${product.is_active !== false ? "bg-[#e7f7ed] text-[#0f7a38]" : "bg-[#fdecec] text-[#b42318]"}`}>
                            {product.is_active !== false ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                              type="button"
                              onClick={() => setSelectedProductId(product.id)}
                              className="inline-flex items-center justify-center rounded-full border border-forest/15 px-4 py-2 text-xs font-semibold text-forest transition hover:bg-sand/50"
                            >
                              Edit
                            </button>
                            <form action={deleteAction}>
                              <input type="hidden" name="id" value={product.id} />
                              <input type="hidden" name="slug" value={product.slug} />
                              <AdminSubmitButton
                                className="border border-red-300 bg-white px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                                pendingLabel="Deleting... Please wait"
                              >
                                Delete
                              </AdminSubmitButton>
                            </form>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                          No products match the current search or filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
              <p>Page {safePage} of {totalPages}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={safePage === 1}
                  className="rounded-full border border-forest/15 px-4 py-2 font-semibold text-forest transition hover:bg-sand/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={safePage === totalPages}
                  className="rounded-full border border-forest/15 px-4 py-2 font-semibold text-forest transition hover:bg-sand/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-forest/10 bg-white p-8 shadow-[0_18px_55px_rgba(23,59,42,0.08)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-3xl text-forest">Edit Product</h3>
                <p className="mt-2 text-sm text-slate-500">Update gallery, stock, status, and specifications from one place.</p>
              </div>
              {selectedProduct ? (
                <div className="rounded-2xl bg-sand px-4 py-3 text-right text-sm text-forest">
                  <p className="font-semibold">{selectedProduct.name}</p>
                  <p className="mt-1 text-xs">Volume: {formatVolumeLabel(selectedProduct) || "-"}</p>
                </div>
              ) : null}
            </div>

            {selectedProduct ? (
              <div className="mt-6">
                <ProductForm action={updateAction} categories={categories} mode="update" product={selectedProduct} />
              </div>
            ) : (
              <div className="mt-6 rounded-2xl bg-cream px-5 py-6 text-sm text-slate-500">Select a product from the list to edit it.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}