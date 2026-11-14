import { useEffect, useState } from "react";

import CategoryCard from "../../components/ui/CategoryCard";
import { getStorefrontCategories } from "../../services/categoriesService";

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const data = await getStorefrontCategories();

        if (isMounted) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Fetch storefront categories error:", error);
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
  }, []);

  if (loading) {
    return (
      <section className="category-ambient ambient-section ambient-section-reverse mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            تسوقي حسب احتياجك
          </h2>

          <p className="mt-2 text-muted-foreground">
            اختاري القسم اللي يناسبك واكتشفي منتجات سديم
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="aspect-4/5 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!categories.length) return null;

  return (
    <section className="category-ambient ambient-section ambient-section-reverse mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          تسوقي حسب احتياجك
        </h2>

        <p className="mt-2 text-muted-foreground">
          اختاري القسم اللي يناسبك واكتشفي منتجات سديم
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            title={category.title}
            href={category.href}
            image={category.image}
          />
        ))}
      </div>
    </section>
  );
}
