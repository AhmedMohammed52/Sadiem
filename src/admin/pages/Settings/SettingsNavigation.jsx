import { Store, Share2, SlidersHorizontal, UserRound } from "lucide-react";

export const SETTINGS_SECTIONS = [
  { id: "store", label: "بيانات المتجر", icon: Store },
  { id: "social", label: "التواصل الاجتماعي", icon: Share2 },
  { id: "general", label: "التحكم في المتجر", icon: SlidersHorizontal },
  { id: "account", label: "حساب المدير", icon: UserRound },
];

export default function SettingsNavigation({ activeSection, onChange }) {
  return (
    <div className="rounded-xl border border-[#E9EBF0] bg-white p-1.5">
      <nav
        aria-label="أقسام الإعدادات"
        className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide"
      >
        {SETTINGS_SECTIONS.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-3.5 text-xs font-semibold transition-all duration-200 sm:px-4 ${
                isActive
                  ? "bg-[#EEF0FF] text-[#4059E8]"
                  : "text-[#777D8A] hover:bg-[#F5F6FA] hover:text-[#22252D]"
              }`}
            >
              <Icon size={16} strokeWidth={1.9} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
