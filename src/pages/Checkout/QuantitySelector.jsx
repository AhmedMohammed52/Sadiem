import { Plus, Minus } from "lucide-react";

export default function QuantitySelector({ quantity, onIncrease, onDecrease }) {
  return (
    <div
      className="inline-flex h-12 items-center rounded-full border border-border"
      role="group"
      aria-label="الكمية"
    >
      <button
        type="button"
        onClick={onIncrease}
        aria-label="زيادة الكمية"
        className="grid size-11 shrink-0 place-items-center rounded-full p-0 transition hover:bg-muted cursor-pointer"
      >
        <Plus className="size-4" />
      </button>

      <span
        className="w-6 shrink-0 text-center text-sm font-bold tabular-nums"
        aria-live="polite"
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        aria-label="تقليل الكمية"
        className="grid size-11 shrink-0 place-items-center rounded-full p-0 transition hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <Minus className="size-4" />
      </button>
    </div>
  );
}
