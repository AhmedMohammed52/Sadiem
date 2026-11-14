import { RotateCcw, Save } from "lucide-react";

export default function SettingsActions({ isDirty, saving, onSave, onReset }) {
  return (
    <div className="sticky bottom-3 z-20 flex items-center justify-between gap-3 rounded-xl border border-[#E9EBF0] bg-white/95 p-3 shadow-sm backdrop-blur">
      <button
        type="button"
        onClick={onReset}
        disabled={!isDirty || saving}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E9EBF0] px-3 text-xs font-semibold text-[#777D8A] transition hover:bg-[#F8F9FB] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <RotateCcw size={14} />
        تراجع
      </button>

      <button
        type="button"
        onClick={onSave}
        disabled={!isDirty || saving}
        className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#4059E8] px-4 text-xs font-semibold text-white transition hover:bg-[#334BD0] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Save size={14} />
        {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
      </button>
    </div>
  );
}
