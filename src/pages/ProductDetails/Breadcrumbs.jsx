import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Breadcrumbs({
  categoryName,
  categorySlug,
  productName,
}) {
  return (
    <nav
      aria-label="مسار التنقل"
      className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground md:text-sm"
      dir="rtl"
    >
      <Link to="/" className="transition hover:text-ink">
        الرئيسية
      </Link>

      <ChevronLeft className="size-3.5" aria-hidden="true" />

      <Link to="/shop" className="transition hover:text-ink">
        المنتجات
      </Link>

      <ChevronLeft className="size-3.5" aria-hidden="true" />

      <Link
        to={`/shop?category=${categorySlug}`}
        className="transition hover:text-ink"
      >
        {categoryName}
      </Link>

      <ChevronLeft className="size-3.5" aria-hidden="true" />

      <span className="font-semibold text-ink">{productName}</span>
    </nav>
  );
}
