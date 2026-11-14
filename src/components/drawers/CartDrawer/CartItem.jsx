import { Trash2, Plus, Minus } from "lucide-react";

export default function CartItem({
  image,
  name,
  price,
  quantity,
  onIncrease,
  onDecrease,
  onDelete,
}) {
  return (
    <li className="flex gap-4 p-5">
      <img
        alt={name}
        className="size-20 rounded-md bg-muted object-cover"
        src={image}
      />

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold leading-snug">{name}</p>

          <button
            type="button"
            onClick={onDelete}
            aria-label={`إزالة ${name}`}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          {price.toLocaleString("en-US")} ج.م للقطعة
        </p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex w-fit items-center rounded-full border">
            <button
              type="button"
              onClick={onIncrease}
              aria-label="زيادة الكمية"
              className="grid size-9 place-items-center cursor-pointer"
            >
              <Plus className="size-4" aria-hidden="true" />
            </button>

            <span className="w-8 text-center text-sm font-semibold">
              {quantity}
            </span>

            <button
              type="button"
              onClick={onDecrease}
              disabled={quantity <= 1}
              aria-label="تقليل الكمية"
              className="grid size-9 place-items-center disabled:opacity-30 cursor-pointer"
            >
              <Minus className="size-4" aria-hidden="true" />
            </button>
          </div>

          <span className="text-sm font-bold">
            {(price * quantity).toLocaleString("en-US")} ج.م
          </span>
        </div>
      </div>
    </li>
  );
}
