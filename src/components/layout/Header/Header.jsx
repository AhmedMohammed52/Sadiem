import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, Heart, ShoppingBag } from "lucide-react";
import CartDrawer from "../../drawers/CartDrawer/CartDrawer";
import WishlistDrawer from "../../drawers/WishlistDrawer/WishlistDrawer";
import SearchDrawer from "../../drawers/SearchDrawer";
import MobileMenuDrawer from "../../drawers/MobileMenuDrawer";

import { useWishlist } from "../../../context/WishlistContext";
import { useCart } from "../../../context/CartContext";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 md:h-20 md:px-8">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="فتح القائمة"
              className="relative grid size-10 place-items-center rounded-full transition hover:bg-blush-soft lg:hidden cursor-pointer"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>

            <Link
              className="flex flex-col items-center leading-none"
              aria-label="سديم - الرئيسية"
              to="/"
            >
              <span className="font-display text-2xl font-bold md:text-3xl">
                سديم
              </span>
              <span className="font-latin mt-0.5 text-[10px] tracking-[0.45em] text-muted-foreground">
                SADIM
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-7 lg:flex">
            <Link
              className="text-sm font-medium text-foreground/80 transition hover:text-foreground"
              to="/"
            >
              الرئيسية
            </Link>
            <Link
              className="text-sm font-medium text-foreground/80 transition hover:text-foreground"
              to="/shop"
            >
              تسوقي
            </Link>
            <Link
              className="text-sm font-medium text-foreground/80 transition hover:text-foreground"
              to="/shop?category=perfumes"
            >
              العطور
            </Link>
            <Link
              className="text-sm font-medium text-foreground/80 transition hover:text-foreground"
              to="/shop?category=skincare"
            >
              العناية بالبشرة
            </Link>
            <Link
              className="text-sm font-medium text-foreground/80 transition hover:text-foreground"
              to="/shop?category=body"
            >
              العناية بالجسم
            </Link>
            <Link
              className="text-sm font-medium text-foreground/80 transition hover:text-foreground"
              to="/shop?category=hair"
            >
              العناية بالشعر
            </Link>
          </nav>

          <div className="flex items-center">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="البحث"
              className="relative grid size-10 place-items-center rounded-full transition hover:bg-blush-soft cursor-pointer"
            >
              <Search className="size-5" aria-hidden="true" />
            </button>

            <button
              onClick={() => setIsWishlistOpen(true)}
              aria-label={`المفضلة، ${wishlistCount} منتجات`}
              className="relative grid size-10 place-items-center rounded-full transition hover:bg-blush-soft cursor-pointer"
            >
              <Heart className="size-5" aria-hidden="true" />

              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid min-w-4.5 h-4.5 place-items-center rounded-full bg-pink-500 px-1 text-[10px] font-bold text-white">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`شنطة التسوق، ${cartCount} قطع`}
              className="relative grid size-10 place-items-center rounded-full transition hover:bg-blush-soft cursor-pointer"
            >
              <ShoppingBag className="size-5" aria-hidden="true" />

              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid min-w-4.5 h-4.5 place-items-center rounded-full bg-pink-500 px-1 text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <MobileMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </>
  );
}
