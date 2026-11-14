import { Globe, Camera, Music2, MessageCircle } from "lucide-react";

import { SettingField, SettingsCard } from "./SettingsFields";

const SOCIALS = [
  {
    id: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/...",
    icon: Globe,
  },
  {
    id: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/...",
    icon: Camera,
  },
  {
    id: "tiktok",
    label: "TikTok",
    placeholder: "https://tiktok.com/@...",
    icon: Music2,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    placeholder: "201xxxxxxxxx أو رابط واتساب",
    icon: MessageCircle,
  },
];

export default function SocialSettings({ settings, update }) {
  return (
    <SettingsCard
      title="روابط التواصل الاجتماعي"
      description="أضف روابط صفحات المتجر ورقم واتساب للتواصل مع العملاء."
    >
      <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
        {SOCIALS.map(({ id, label, placeholder, icon: Icon }) => (
          <div key={id} className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <Icon size={16} className="text-[#4059E8]" />

              <span className="text-sm font-semibold text-[#22252D]">
                {label}
              </span>
            </div>

            <SettingField
              value={settings.social[id] || ""}
              onChange={(value) => update("social", id, value)}
              placeholder={placeholder}
              dir="ltr"
            />
          </div>
        ))}
      </div>
    </SettingsCard>
  );
}
