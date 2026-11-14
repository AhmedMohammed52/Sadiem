import { useEffect, useMemo, useState } from "react";
import { Store, Upload, X, Image as ImageIcon } from "lucide-react";

import { SettingField, SettingTextarea, SettingsCard } from "./SettingsFields";

const MAX_IMAGE_SIZE = 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

function useAssetPreview(value) {
  const preview = useMemo(() => {
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }

    return value || "";
  }, [value]);

  useEffect(() => {
    if (value instanceof File && preview) {
      return () => URL.revokeObjectURL(preview);
    }
  }, [value, preview]);

  return preview;
}

function AssetUpload({
  label,
  value,
  onChange,
  description,
  icon: Icon,
  previewClassName = "h-7 w-7",
}) {
  const [error, setError] = useState("");
  const preview = useAssetPreview(value);
  const inputId = label.replace(/\s/g, "-");

  const handleUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("الصيغ المدعومة PNG و JPG و WEBP فقط.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("حجم الصورة يجب ألا يتجاوز 1MB.");
      event.target.value = "";
      return;
    }

    onChange(file);
    event.target.value = "";
  };

  return (
    <div className="min-w-0 space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold text-[#22252D]"
      >
        {label}
      </label>

      <div className="flex h-10 min-w-0 items-center gap-2 rounded-lg border border-[#E9EBF0] bg-white px-2.5 transition-colors">
        <div
          className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#EEF0FF] text-[#4059E8] ${previewClassName}`}
        >
          {preview ? (
            <img
              src={preview}
              alt={label}
              className="h-full w-full object-contain p-0.5"
            />
          ) : (
            <Icon size={15} />
          )}
        </div>

        <span className="min-w-0 flex-1 truncate text-xs text-[#777D8A]">
          {preview
            ? value instanceof File
              ? value.name
              : "تم رفع الصورة"
            : "لم يتم اختيار صورة"}
        </span>

        <input
          id={inputId}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
          onChange={handleUpload}
          className="hidden"
        />

        <label
          htmlFor={inputId}
          className="inline-flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-md bg-[#EEF0FF] px-2 text-[11px] font-semibold text-[#4059E8] transition-colors hover:bg-[#E1E5FF]"
        >
          <Upload size={12} />
          {preview ? "تغيير" : "رفع"}
        </label>

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setError("");
            }}
            title={`حذف ${label}`}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#A0A5B1] transition-colors hover:bg-[#FDECEC] hover:text-[#E05252]"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <p className="text-[10px] leading-4 text-[#A0A5B1]">
        {description || "PNG, JPG, WEBP — بحد أقصى 1MB"}
      </p>

      {error && <p className="text-xs text-[#E05252]">{error}</p>}
    </div>
  );
}

export default function StoreSettings({ settings, update }) {
  const store = settings.store;

  const logoPreview = useAssetPreview(store.logo);
  const faviconPreview = useAssetPreview(store.favicon);

  return (
    <div className="space-y-4">
      <SettingsCard
        title="المعلومات الأساسية"
        description="البيانات التي تظهر للعملاء داخل المتجر."
      >
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          <SettingField
            label="اسم المتجر"
            value={store.name}
            onChange={(v) => update("store", "name", v)}
            placeholder="اسم المتجر"
          />

          <SettingField
            label="الجملة التعريفية"
            value={store.tagline}
            onChange={(v) => update("store", "tagline", v)}
            placeholder="جمالك يبدأ من هنا"
          />

          <SettingField
            label="رقم الهاتف"
            value={store.phone}
            onChange={(v) => update("store", "phone", v)}
            placeholder="01xxxxxxxxx"
            dir="ltr"
          />

          <SettingField
            label="البريد الإلكتروني"
            value={store.email}
            onChange={(v) => update("store", "email", v)}
            placeholder="email@example.com"
            dir="ltr"
          />

          <AssetUpload
            label="شعار المتجر الرئيسي"
            value={store.logo}
            onChange={(value) => update("store", "logo", value)}
            icon={Store}
            description="الشعار الذي يظهر في رأس الموقع والفوتر — PNG, JPG, WEBP — بحد أقصى 1MB"
          />

          <AssetUpload
            label="أيقونة الموقع (Favicon)"
            value={store.favicon}
            onChange={(value) => update("store", "favicon", value)}
            icon={ImageIcon}
            description="الأيقونة التي تظهر بجانب اسم الموقع في تبويب المتصفح — PNG, JPG, WEBP — بحد أقصى 1MB"
          />

          <div className="sm:col-span-2">
            <SettingTextarea
              label="وصف المتجر"
              value={store.description}
              onChange={(v) => update("store", "description", v)}
              placeholder="اكتبي نبذة مختصرة عن المتجر..."
              rows={3}
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="معاينة هوية المتجر"
        description="معاينة بسيطة لاسم المتجر وشعاره وأيقونته."
      >
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#E9EBF0] bg-[#FAFAFC] p-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E9EBF0] bg-white">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="شعار المتجر"
                className="h-full w-full object-contain p-1"
              />
            ) : (
              <Store size={21} className="text-[#4059E8]" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[#22252D]">
              {store.name || "اسم المتجر"}
            </p>

            <p className="mt-1 truncate text-[11px] text-[#777D8A]">
              {store.tagline || store.description || "وصف المتجر"}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[#E9EBF0] bg-white px-3 py-2">
            <span className="text-[10px] text-[#777D8A]">Favicon</span>
            <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded bg-[#F5F6FA]">
              {faviconPreview ? (
                <img
                  src={faviconPreview}
                  alt="أيقونة الموقع"
                  className="h-full w-full object-contain"
                />
              ) : (
                <ImageIcon size={13} className="text-[#A0A5B1]" />
              )}
            </div>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
