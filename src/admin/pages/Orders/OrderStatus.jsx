const STATUS_CONFIG = {
  new: {
    label: "طلب جديد",
    className: "bg-blue-50 text-blue-600",
    dot: "bg-blue-500",
  },
  processing: {
    label: "قيد التجهيز",
    className: "bg-orange-50 text-orange-600",
    dot: "bg-orange-500",
  },
  shipped: {
    label: "تم الشحن",
    className: "bg-violet-50 text-violet-600",
    dot: "bg-violet-500",
  },
  completed: {
    label: "مكتمل",
    className: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "ملغي",
    className: "bg-red-50 text-red-600",
    dot: "bg-red-500",
  },
};

export const ORDER_STATUSES = STATUS_CONFIG;

export default function OrderStatus({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.new;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
