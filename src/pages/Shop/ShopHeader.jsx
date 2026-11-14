export default function ShopHeader() {
  return (
    <header>
      {/* مسار التنقل (Breadcrumb) */}
      <nav aria-label="مسار الصفحة" className="text-sm text-muted-foreground">
        <a className="hover:text-foreground" href="/">
          الرئيسية
        </a>
        <span className="mx-2">/</span>
        <span className="text-foreground">المنتجات</span>
      </nav>

      {/* العنوان الرئيسي */}
      <h1 className="font-display mt-4 text-3xl font-bold md:text-5xl">
        اكتشفي منتجات سديم
      </h1>

      {/* الوصف الترويجي */}
      <p className="mt-3 text-muted-foreground md:text-lg">
        اختاري منتجاتك المفضلة من مجموعتنا للعناية والجمال.
      </p>
    </header>
  );
}
