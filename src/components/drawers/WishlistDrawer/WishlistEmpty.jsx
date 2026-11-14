import { Heart } from "lucide-react";

export default function WishlistEmpty({ onShopClick }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="grid size-16 place-items-center rounded-full bg-blush-soft text-blush-deep">
        <Heart className="size-7" aria-hidden="true" />
      </div>
      <p className="text-lg font-semibold">قائمة المفضلة لسه فاضية</p>
      <a
        href="/shop"
        onClick={onShopClick}
        className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ink-foreground transition hover:opacity-90 cursor-pointer"
      >
        اكتشفي المنتجات
      </a>
    </div>
  );
}
