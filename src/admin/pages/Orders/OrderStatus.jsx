import { ORDER_STATUS_CONFIG } from "../../data/order";

export default function OrderStatus({ status }) {
  const config = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.new;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
