import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);

const STORAGE_KEY = "sadeem_wishlist";

// قراءة المفضلة من LocalStorage
function getInitialWishlist() {
  try {
    const savedWishlist = localStorage.getItem(STORAGE_KEY);
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(getInitialWishlist);

  // حفظ أي تحديث في LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  // إضافة المنتج أو حذفه
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);

      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }

      return [...prev, product];
    });
  };

  // التأكد هل المنتج موجود في المفضلة
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // حذف منتج معين
  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  // تفريغ المفضلة بالكامل
  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// Custom Hook لاستخدام المفضلة
export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}
