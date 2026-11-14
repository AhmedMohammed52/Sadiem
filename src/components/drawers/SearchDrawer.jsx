import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Search, LoaderCircle } from "lucide-react";

import { searchStorefrontProducts } from "../../services/productsService";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";

export default function SearchDrawer({ isOpen, onClose }) {
  useBodyScrollLock(isOpen);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (!isOpen || !normalizedQuery) {
      setProducts([]);
      setIsLoading(false);
      setError("");
      return;
    }

    let isMounted = true;

    // تأخير بسيط لتقليل عدد طلبات البحث أثناء الكتابة
    const timeoutId = setTimeout(async () => {
      try {
        setIsLoading(true);
        setError("");

        const results = await searchStorefrontProducts(normalizedQuery, 8);

        if (isMounted) {
          setProducts(results);
        }
      } catch (err) {
        console.error("Search error:", err);

        if (isMounted) {
          setProducts([]);
          setError("حصلت مشكلة أثناء البحث، حاولي مرة تانية");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [query, isOpen]);

  const handleClose = () => {
    setQuery("");
    setProducts([]);
    onClose();
  };

  const formatPrice = (price) =>
    `${Number(price || 0).toLocaleString("en-US")} ج.م`;

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen
          ? "pointer-events-auto bg-black/40 backdrop-blur-xs opacity-100"
          : "pointer-events-none bg-black/0 opacity-0"
      }`}
      onClick={handleClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="البحث"
        onClick={(e) => e.stopPropagation()}
        className={`absolute inset-y-0 right-0 flex w-full max-w-105 flex-col bg-background shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="font-display text-xl">البحث</h2>

          <button
            type="button"
            onClick={handleClose}
            aria-label="إغلاق"
            className="grid size-10 place-items-center rounded-full transition-colors hover:bg-muted cursor-pointer"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        {/* Search Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5">
            <label className="flex items-center gap-2 rounded-full border bg-muted px-4 py-3 transition-colors focus-within:border-ink">
              <Search
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />

              <input
                type="text"
                placeholder="ابحثي عن منتج..."
                aria-label="ابحثي عن منتج"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
                autoFocus={isOpen}
              />
            </label>

            {/* Search Results */}
            <ul className="mt-4 divide-y">
              {/* Loading */}
              {isLoading && (
                <li className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                  <LoaderCircle className="size-4 animate-spin" />
                  جاري البحث عن المنتجات...
                </li>
              )}

              {/* Error */}
              {!isLoading && error && (
                <li className="py-8 text-center text-sm text-red-500">
                  {error}
                </li>
              )}

              {/* Products */}
              {!isLoading &&
                !error &&
                products.map((product) => (
                  <li key={product.id}>
                    <Link
                      to={`/products/${product.slug}`}
                      onClick={handleClose}
                      className="flex items-center gap-4 rounded-lg px-1 py-3 transition hover:bg-muted/50"
                    >
                      <div className="size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="grid size-full place-items-center text-xs text-muted-foreground">
                            سديم
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{product.name}</p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}

              {/* Empty Search */}
              {!query.trim() && (
                <li className="py-8 text-center text-sm text-muted-foreground">
                  اكتبي اسم المنتج للبحث في منتجات سديم
                </li>
              )}

              {/* No Results */}
              {!isLoading &&
                !error &&
                query.trim() &&
                products.length === 0 && (
                  <li className="py-8 text-center text-sm text-muted-foreground">
                    لا توجد نتائج مطابقة لبحثك
                  </li>
                )}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
