import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";

import CartDrawer from "../components/drawers/CartDrawer/CartDrawer";
import WishlistDrawer from "../components/drawers/WishlistDrawer/WishlistDrawer";

import FloatingWhatsApp from "../components/ui/FloatingWhatsApp";
import Preloader from "../components/layout/Preloader";

function StoreLayout() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const startTime = Date.now();

    let finished = false;
    let hideTimer;
    let removeTimer;
    let fallbackTimer;

    const finishLoading = () => {
      if (finished) return;

      finished = true;

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 900 - elapsed);

      hideTimer = setTimeout(() => {
        setIsHidden(true);

        removeTimer = setTimeout(() => {
          setShowPreloader(false);
        }, 550);
      }, remaining);
    };

    if (document.readyState === "complete") {
      finishLoading();
    } else {
      window.addEventListener("load", finishLoading);
    }

    fallbackTimer = setTimeout(finishLoading, 4000);

    return () => {
      window.removeEventListener("load", finishLoading);

      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-blush py-2 text-center text-xs font-medium md:text-sm">
        اكتشفي عالم سديم من العطور والعناية بجمالك
      </div>

      <Header />

      <main className="min-h-[60vh]">
        <Outlet />
      </main>

      <Footer />

      {/* Global Drawers */}
      <CartDrawer />
      <WishlistDrawer />

      {/* Whatsapp Icon */}
      <FloatingWhatsApp />

      {/* Store Preloader Only */}
      {showPreloader && <Preloader isHidden={isHidden} />}
    </div>
  );
}

export default StoreLayout;
