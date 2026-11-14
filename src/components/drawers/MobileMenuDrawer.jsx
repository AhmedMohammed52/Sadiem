import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

import { getStorefrontCategories } from "../../services/categoriesService";

export default function MobileMenuDrawer({ isOpen, onClose }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);

        const data = await getStorefrontCategories();

        if (isMounted) {
          setCategories(data || []);
        }
      } catch (error) {
        console.error("Error fetching menu categories:", error);

        if (isMounted) {
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  return (
    <div
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen
          ? "pointer-events-auto bg-black/40 backdrop-blur-xs opacity-100"
          : "pointer-events-none bg-black/0 opacity-0"
      }`}
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="القائمة"
        onClick={(e) => e.stopPropagation()}
        className={`absolute inset-y-0 right-0 flex w-full max-w-105 flex-col bg-background shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* هيدر القائمة */}
        <header className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="font-display text-xl">القائمة</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="grid size-10 place-items-center rounded-full hover:bg-muted cursor-pointer transition-colors"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        {/* روابط وأقسام القائمة */}
        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col p-5 text-lg">
            <Link
              to="/"
              onClick={onClose}
              className="border-b py-4 transition-colors hover:text-blush-deep"
            >
              الرئيسية
            </Link>

            <Link
              to="/shop"
              onClick={onClose}
              className="border-b py-4 transition-colors hover:text-blush-deep"
            >
              تسوقي
            </Link>

            <p className="mt-6 mb-2 text-sm text-muted-foreground">الأقسام</p>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col gap-4 py-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 animate-pulse"
                  >
                    <div className="size-10 rounded-full bg-muted" />
                    <div className="h-4 w-24 rounded bg-muted" />
                  </div>
                ))}
              </div>
            )}

            {/* Categories */}
            {!loading &&
              categories.map((category) => (
                <Link
                  key={category.id}
                  to={category.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/50"
                >
                  {category.image ? (
                    <img
                      src={category.image}
                      alt=""
                      className="size-10 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="size-10 rounded-full bg-muted" />
                  )}

                  <span>{category.title}</span>
                </Link>
              ))}

            {/* Empty State */}
            {!loading && categories.length === 0 && (
              <p className="py-4 text-sm text-muted-foreground">
                لا توجد أقسام متاحة حاليًا.
              </p>
            )}
          </nav>
        </div>
      </aside>
    </div>
  );
}
