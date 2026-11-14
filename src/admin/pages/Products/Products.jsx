import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, LoaderCircle, AlertCircle } from "lucide-react";

import ProductStats from "./ProductStats";
import ProductFilters from "./ProductFilters";
import ProductsTable from "./ProductsTable";

import ProductDrawer from "../../components/ui/drawer/ProductDrawer";
import PageHeader from "../../components/common/PageHeader";

import {
  getProducts,
  saveProduct,
  deleteProduct,
} from "../../../services/productsService";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Products loading error:", err);
      setError(err.message || "تعذر تحميل المنتجات");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(searchValue) ||
        (product.sku || "").toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "all" || product.category === category;

      const matchesStatus = (() => {
        switch (status) {
          case "published":
            return product.isPublished;
          case "draft":
            return !product.isPublished;
          case "available":
            return product.stock > 0;
          case "unavailable":
            return product.stock === 0;
          case "low":
            return product.stock > 0 && product.stock <= 5;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, category, status]);

  const handleAddProduct = () => {
    setError("");
    setEditingProduct(null);
    setIsDuplicating(false);
    setIsDrawerOpen(true);
  };

  const handleEditProduct = (product) => {
    setError("");
    setEditingProduct(product);
    setIsDuplicating(false);
    setIsDrawerOpen(true);
  };

  // نسخ المنتج
  const handleDuplicateProduct = (product) => {
    setError("");

    const duplicatedProduct = {
      ...product,

      // منتج جديد وليس تعديلًا للمنتج الأصلي
      id: null,

      // بيانات جديدة للمنتج
      name: `${product.name} - نسخة`,
      slug: "",
      sku: "",

      // الاحتفاظ بنفس تفاصيل الصور مع نسخ ملفاتها لاحقًا
      images: (product.images || []).map((image) => ({
        ...image,
        id: undefined,
        isExisting: true,
      })),

      // المنتج الجديد يبدأ كمسودة
      isPublished: false,
      isFeatured: false,
      stock: 0,
    };

    setEditingProduct(duplicatedProduct);
    setIsDuplicating(true);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    if (isSaving) return;

    setIsDrawerOpen(false);
    setEditingProduct(null);
    setIsDuplicating(false);
  };

  const handleSaveProduct = async (productData) => {
    if (isSaving) return;

    setIsSaving(true);
    setError("");

    try {
      await saveProduct(
        {
          ...productData,
          copyImages: isDuplicating,
        },
        editingProduct?.id || null,
      );

      await loadProducts();

      setIsDrawerOpen(false);
      setEditingProduct(null);
      setIsDuplicating(false);
    } catch (err) {
      console.error("Product saving error:", err);
      setError(err.message || "حدث خطأ أثناء حفظ المنتج");
    } finally {
      setIsSaving(false);
    }
  };

  const updateProduct = async (product, changes) => {
    try {
      setError("");

      await saveProduct(
        {
          ...product,
          ...changes,
        },
        product.id,
      );

      await loadProducts();
    } catch (err) {
      console.error("Product update error:", err);
      setError(err.message || "تعذر تحديث المنتج");
    }
  };

  const handleToggleFeatured = (product) => {
    updateProduct(product, {
      isFeatured: !product.isFeatured,
    });
  };

  const handleToggleStock = (product) => {
    updateProduct(product, {
      stock: product.stock > 0 ? 0 : 1,
    });
  };

  const handleTogglePublished = (product) => {
    updateProduct(product, {
      isPublished: !product.isPublished,
    });
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف المنتج "${product.name}"؟`,
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteProduct(product.id);

      setProducts((current) =>
        current.filter((item) => item.id !== product.id),
      );
    } catch (err) {
      console.error("Product deletion error:", err);
      setError(err.message || "تعذر حذف المنتج");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="المنتجات"
        description="إدارة منتجات المتجر والأسعار والمخزون."
        action={
          <button
            type="button"
            onClick={handleAddProduct}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#4059E8] px-4 text-xs font-semibold text-white transition hover:bg-[#3048D5]"
          >
            <Plus size={17} />
            إضافة منتج
          </button>
        }
      />

      {error && (
        <div
          className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
          dir="rtl"
        >
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <p className="wrap-break-word">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-[#E9EBF0] bg-white">
          <LoaderCircle size={28} className="animate-spin text-[#4059E8]" />
          <p className="text-sm text-[#777D8A]">جاري تحميل المنتجات...</p>
        </div>
      ) : (
        <>
          <ProductStats products={products} />

          <ProductFilters
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            status={status}
            setStatus={setStatus}
          />

          <ProductsTable
            products={filteredProducts}
            onToggleFeatured={handleToggleFeatured}
            onToggleStock={handleToggleStock}
            onTogglePublished={handleTogglePublished}
            onEdit={handleEditProduct}
            onDuplicate={handleDuplicateProduct}
            onDelete={handleDelete}
          />
        </>
      )}

      <ProductDrawer
        isOpen={isDrawerOpen}
        product={editingProduct}
        onClose={handleCloseDrawer}
        onSave={handleSaveProduct}
        isSaving={isSaving}
      />
    </div>
  );
}
