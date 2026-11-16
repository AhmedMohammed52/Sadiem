import { Check, X, LoaderCircle } from "lucide-react";

export default function CategoryStatus({
  isActive,
  onToggle,
  isLoading = false,
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isLoading}
      title="اضغط لتغيير حالة التصنيف"
      className={`inline-flex min-w-24 items-center justify-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${
        isActive
          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {isLoading ? (
        <LoaderCircle size={12} className="animate-spin" />
      ) : isActive ? (
        <Check size={12} />
      ) : (
        <X size={12} />
      )}

      {isActive ? "نشط" : "غير نشط"}
    </button>
  );
}
