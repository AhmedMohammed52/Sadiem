import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSettings } from "../../../services/settingsService";

export default function Footer() {
  const [social, setSocial] = useState({
    facebook: "",
    instagram: "",
    tiktok: "",
    whatsapp: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      try {
        const settings = await getSettings();

        if (isMounted) {
          setSocial(settings.social);
        }
      } catch (error) {
        console.error("Footer settings error:", error);
      }
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const socialLinks = [
    { label: "واتساب", url: social.whatsapp },
    { label: "فيسبوك", url: social.facebook },
    { label: "إنستجرام", url: social.instagram },
    { label: "تيك توك", url: social.tiktok },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        {/* معلومات العلامة التجارية */}
        <div className="md:col-span-2">
          <Link to="/" className="inline-block">
            <p className="font-display text-3xl font-bold">سديم</p>
            <p className="font-latin text-xs tracking-[0.45em] text-muted-foreground">
              SADEEM
            </p>
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
            وجهتك لاكتشاف العطور ومنتجات العناية بالبشرة والجسم والشعر.
          </p>
        </div>

        {/* روابط التسوق */}
        <div className="flex flex-col gap-3">
          <p className="font-semibold">تسوقي</p>

          <Link
            to="/shop"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            كل المنتجات
          </Link>

          <Link
            to="/shop?category=perfumes"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            العطور
          </Link>

          <Link
            to="/shop?category=skincare"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            العناية بالبشرة
          </Link>

          <Link
            to="/shop?category=body"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            العناية بالجسم
          </Link>

          <Link
            to="/shop?category=hair"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            العناية بالشعر
          </Link>
        </div>

        {/* التواصل الاجتماعي */}
        <div className="flex flex-col items-start gap-3">
          <p className="font-semibold">تواصلي معنا</p>

          {socialLinks.map((item) =>
            item.url ? (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition hover:text-foreground"
              >
                {item.label}
              </a>
            ) : null,
          )}
        </div>
      </div>

      <div className="border-t py-5 text-center text-xs text-muted-foreground">
        © سديم 2026
      </div>
    </footer>
  );
}
