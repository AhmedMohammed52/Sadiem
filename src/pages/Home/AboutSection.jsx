import { Leaf, ShoppingBag, MessageCircle } from "lucide-react";

export default function AboutSection() {
  return (
    <section
      className="border-t border-blush/50 bg-blush-soft/50 overflow-hidden"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl px-8 py-20 text-center">
        {/* العنوان الرئيسي مع حركة Rise */}
        <h2 className="font-display text-4xl font-bold text-foreground animate-rise">
          ليه تختاري سديم؟
        </h2>

        {/* شبكة المميزات */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-0">
          {/* الميزة الأولى */}
          <div className="animate-rise px-8" style={{ animationDelay: "0.1s" }}>
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-background text-blush-deep shadow-sm transition-transform duration-300 hover:scale-110">
              <Leaf className="size-6" aria-hidden="true" />
            </div>
            <h3 className="font-display mt-5 text-2xl font-semibold text-foreground">
              اختيارات بعناية
            </h3>
            <p className="mt-3 text-base leading-8 text-muted-foreground">
              منتجات مختارة بعناية لتناسب احتياجاتك.
            </p>
          </div>

          {/* الميزة الثانية (بتاخد تأخير أبسط عشان تطلع بعدها) */}
          <div
            className="animate-rise px-8 md:border-s md:border-border/60"
            style={{ animationDelay: "0.25s" }}
          >
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-background text-blush-deep shadow-sm transition-transform duration-300 hover:scale-110">
              <ShoppingBag className="size-6" aria-hidden="true" />
            </div>
            <h3 className="font-display mt-5 text-2xl font-semibold text-foreground">
              تجربة تسوق سهلة
            </h3>
            <p className="mt-3 text-base leading-8 text-muted-foreground">
              تصفحي المنتجات واطلبي بسهولة.
            </p>
          </div>

          {/* الميزة الثالثة */}
          <div
            className="animate-rise px-8 md:border-s md:border-border/60"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-background text-blush-deep shadow-sm transition-transform duration-300 hover:scale-110">
              <MessageCircle className="size-6" aria-hidden="true" />
            </div>
            <h3 className="font-display mt-5 text-2xl font-semibold text-foreground">
              دايمًا معاكِ
            </h3>
            <p className="mt-3 text-base leading-8 text-muted-foreground">
              تواصل مباشر معنا عبر واتساب لمساعدتك.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
