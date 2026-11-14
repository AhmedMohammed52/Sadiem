import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "./Breadcrumbs";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import RelatedProducts from "./RelatedProducts";
import NotFound from "../NotFound/NotFound";

import { getStorefrontProductBySlug } from "../../services/productsService";

import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";

export default function ProductDetails() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getStorefrontProductBySlug(slug);

        if (isMounted) {
          setProduct(data);
        }
      } catch (err) {
        console.error("Error fetching product details:", err);

        if (isMounted) {
          setError("حصلت مشكلة أثناء تحميل المنتج");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (slug) {
      fetchProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleAddToCart = (selectedProduct, quantity) => {
    addToCart(selectedProduct, quantity);

    showToast("تمت الإضافة للشنطة", selectedProduct.name, "cart");
  };

  const handleToggleWishlist = (selectedProduct) => {
    const wasFavorite = isInWishlist(selectedProduct.id);

    toggleWishlist(selectedProduct);

    showToast(
      wasFavorite ? "تمت الإزالة من المفضلة" : "تمت الإضافة للمفضلة",
      selectedProduct.name,
      wasFavorite ? "remove" : "favorite",
    );
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10" dir="rtl">
        <div className="grid animate-pulse items-start gap-8 md:grid-cols-2 md:gap-12">
          <div className="aspect-square rounded-2xl bg-muted" />

          <div className="flex flex-col gap-5">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-8 w-3/4 rounded bg-muted" />
            <div className="h-7 w-1/2 rounded bg-muted" />
            <div className="h-20 rounded bg-muted" />
            <div className="h-12 rounded-full bg-muted" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-center" dir="rtl">
        <p className="text-muted-foreground">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
        >
          إعادة المحاولة
        </button>
      </main>
    );
  }

  if (!product) {
    return <NotFound />;
  }

  const isFavorite = isInWishlist(product.id);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10" dir="rtl">
      <Breadcrumbs
        categoryName={product.categoryName}
        categorySlug={product.category}
        productName={product.name}
      />

      <section className="mt-6 grid items-start gap-8 md:mt-10 md:grid-cols-2 md:gap-12">
        <ProductGallery product={product} />

        <ProductInfo
          product={product}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          isFavorite={isFavorite}
        />
      </section>

      <RelatedProducts currentProduct={product} />
    </main>
  );
}
