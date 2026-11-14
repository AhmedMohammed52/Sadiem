import { Check, X } from "lucide-react";

export default function CategoryStatus({ isActive, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title="اضغط لتغيير حالة التصنيف"
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
        isActive
          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {isActive ? <Check size={12} /> : <X size={12} />}

      {isActive ? "نشط" : "غير نشط"}
    </button>
  );
}
