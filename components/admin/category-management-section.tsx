import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import type { Category } from "@/lib/types";

type CategoryManagementSectionProps = {
  categories: Category[];
  createAction: (formData: FormData) => void | Promise<void>;
  updateAction: (formData: FormData) => void | Promise<void>;
  deleteAction: (formData: FormData) => void | Promise<void>;
};

export function CategoryManagementSection({
  categories,
  createAction,
  updateAction,
  deleteAction,
}: CategoryManagementSectionProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-forest/10 bg-white p-6 shadow-[0_18px_55px_rgba(23,59,42,0.08)]">
        <h3 className="text-2xl text-forest">Category Library</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">Keep categories centralized so the product module stays clean and reusable.</p>
        <form action={createAction} className="mt-5 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_180px_auto]">
            <input name="name" required placeholder="Category name *" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
            <input name="slug" placeholder="Slug (auto-generated if empty)" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
            <input name="sort_order" type="number" min="0" defaultValue="0" placeholder="Sort order" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
            <label className="flex items-center gap-3 rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm font-medium text-forest">
              <input type="checkbox" name="is_active" defaultChecked className="h-4 w-4 rounded border-forest/20" />
              Active
            </label>
          </div>
          <AdminSubmitButton className="bg-forest text-white hover:bg-forest/90">Add Category</AdminSubmitButton>
        </form>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="rounded-[28px] border border-forest/10 bg-white p-5 shadow-[0_18px_55px_rgba(23,59,42,0.08)]">
            <form action={updateAction} className="grid gap-3 lg:grid-cols-[1.1fr_1fr_140px_auto_auto] lg:items-center">
              <input type="hidden" name="id" value={category.id} />
              <input type="hidden" name="old_name" value={category.name} />
              <input name="name" defaultValue={category.name} className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm" />
              <input name="slug" defaultValue={category.slug} className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm" />
              <input name="sort_order" type="number" min="0" defaultValue={category.sort_order || 0} className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm" />
              <label className="flex items-center gap-2 rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm font-medium text-forest">
                <input type="checkbox" name="is_active" defaultChecked={category.is_active !== false} className="h-4 w-4 rounded border-forest/20" />
                Active
              </label>
              <AdminSubmitButton className="bg-forest text-white hover:bg-forest/90">Save</AdminSubmitButton>
            </form>
            <form action={deleteAction} className="mt-3">
              <input type="hidden" name="id" value={category.id} />
              <input type="hidden" name="name" value={category.name} />
              <AdminSubmitButton
                className="border border-red-300 bg-white text-red-600 hover:bg-red-50"
                pendingLabel="Deleting... Please wait"
              >
                Delete Category
              </AdminSubmitButton>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}