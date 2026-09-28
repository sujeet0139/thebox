import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import type { SiteSettings } from "@/lib/types";

type SettingsManagementSectionProps = {
  settings: SiteSettings;
  updateAction: (formData: FormData) => void | Promise<void>;
};

export function SettingsManagementSection({ settings, updateAction }: SettingsManagementSectionProps) {
  const socialLinks = [
    { label: "Facebook", value: settings.facebookUrl },
    { label: "Instagram", value: settings.instagramUrl },
    { label: "LinkedIn", value: settings.linkedinUrl },
    { label: "YouTube", value: settings.youtubeUrl },
  ].filter((item) => item.value);

  return (
    <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_0.9fr]">
      <div className="rounded-[30px] border border-forest/10 bg-white p-8 shadow-[0_18px_55px_rgba(23,59,42,0.08)]">
        <h2 className="text-4xl text-forest">Settings</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">Manage contact and social links here. The footer, contact page, and WhatsApp actions will pick up these values automatically.</p>

        <form action={updateAction} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input name="phone" defaultValue={settings.phone} placeholder="Phone" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
            <input name="whatsapp" defaultValue={settings.whatsapp} placeholder="WhatsApp number" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
          </div>
          <input name="email" defaultValue={settings.email} placeholder="Email" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
          <textarea name="address" defaultValue={settings.address} rows={3} placeholder="Address" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
          <input name="map_url" defaultValue={settings.mapUrl || ""} placeholder="Google Maps link" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
          <div className="grid gap-4 md:grid-cols-2">
            <input name="facebook_url" defaultValue={settings.facebookUrl || ""} placeholder="Facebook URL" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
            <input name="instagram_url" defaultValue={settings.instagramUrl || ""} placeholder="Instagram URL" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
            <input name="linkedin_url" defaultValue={settings.linkedinUrl || ""} placeholder="LinkedIn URL" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
            <input name="youtube_url" defaultValue={settings.youtubeUrl || ""} placeholder="YouTube URL" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
          </div>
          <AdminSubmitButton className="bg-forest text-white hover:bg-forest/90">Save Settings</AdminSubmitButton>
        </form>
      </div>

      <div className="rounded-[30px] border border-forest/10 bg-white p-8 shadow-[0_18px_55px_rgba(23,59,42,0.08)]">
        <h3 className="text-3xl text-forest">Live Summary</h3>
        <div className="mt-6 space-y-4 text-sm text-slate-600">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-bark">Phone</p>
            <p className="mt-1">{settings.phone}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-bark">WhatsApp</p>
            <p className="mt-1">{settings.whatsapp}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-bark">Email</p>
            <p className="mt-1">{settings.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-bark">Address</p>
            <p className="mt-1">{settings.address}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-bark">Social Links</p>
            <ul className="mt-2 space-y-2">
              {socialLinks.length ? socialLinks.map((item) => <li key={item.label}>{item.label}: {item.value}</li>) : <li>No social links added yet.</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}