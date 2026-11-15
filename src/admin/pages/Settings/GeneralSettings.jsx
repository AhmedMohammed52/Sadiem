import { SettingsCard } from "./SettingsFields";
import { General_SORT_OPTIONS } from "../../data/setting";

const PAGE_SIZES = [8, 12, 16];

export default function GeneralSettings({ settings, update }) {
  const general = settings.general;

  return (
    <SettingsCard
      title="إعدادات عرض المنتجات"
      description="تحكم في طريقة ظهور المنتجات وترتيبها داخل المتجر."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#22252D]">
            عدد المنتجات في الصفحة
          </label>

          <select
            value={general.productsPerPage}
            onChange={(event) =>
              update("general", "productsPerPage", Number(event.target.value))
            }
            className="h-10 w-full rounded-lg border border-[#E9EBF0] bg-white px-3 text-sm text-[#22252D] outline-none transition focus:border-[#4059E8]"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size} منتجات
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#22252D]">
            الترتيب الافتراضي
          </label>

          <select
            value={general.defaultSort}
            onChange={(event) =>
              update("general", "defaultSort", event.target.value)
            }
            className="h-10 w-full rounded-lg border border-[#E9EBF0] bg-white px-3 text-sm text-[#22252D] outline-none transition focus:border-[#4059E8]"
          >
            {General_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </SettingsCard>
  );
}
