import { Trash2, ShoppingBag } from "lucide-react";

export default function WishlistItem({
  image,
  name,
  price,
  onAddToCart,
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
            aria-label={`إزالة ${name} من المفضلة`}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>

        <p className="text-sm font-semibold">
          {price.toLocaleString("en-US")} ج.م
        </p>

        <button
          type="button"
          onClick={onAddToCart}
          className="flex w-fit items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-ink-foreground transition hover:opacity-90 cursor-pointer"
        >
          <ShoppingBag className="size-3.5" />
          أضيفي للشنطة
        </button>
      </div>
    </li>
  );
}
