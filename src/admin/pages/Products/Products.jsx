import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react";

import ProductStats from "./ProductStats";
import ProductFilters from "./ProductFilters";
import ProductsTable from "./ProductsTable";

import ProductDrawer from "../../components/ui/drawer/ProductDrawer";
import PageHeader from "../../components/common/PageHeader";
import StatsSkeleton from "../../components/common/Skelton/StatsSkeleton";
import TableSkeleton from "../../components/common/Skelton/TableSkeleton";

import {
  getProducts,
  saveProduct,
  updateProductFields,
  deleteProduct,
} from "../../../services/productsService";

import { getAdminErrorMessage } from "../../utils/errorHandler";

import ConfirmationDialog from "../../components/ui/ConfirmationDialog";
import { useAdminToast } from "../../../context/AdminToastContext";

export default function Products() {
  const { showToast } = useAdminToast();

  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [updatingProducts, setUpdatingProducts] = useState({});

  const updatingProductsRef = useRef(new Set());

  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // LOAD PRODUCTS
  const loadProducts = useCallback(
    async ({ showLoading = true, notifyError = true } = {}) => {
      if (showLoading) {
        setIsLoading(true);
      }

      try {
        const data = await getProducts();

        setProducts(data || []);

        return true;
      } catch (err) {
        if (notifyError) {
          showToast({
            type: "error",
            title: "تعذر تحميل المنتجات",
            message: getAdminErrorMessage(
              err,
              "حدث خطأ أثناء تحميل المنتجات. حاول تحديث الصفحة مرة أخرى.",
            ),
          });
        }

        return false;
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    },
    [showToast],
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // FILTER PRODUCTS
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        (product.name || "").toLowerCase().includes(searchValue) ||
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

  // ADD PRODUCT
  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsDuplicating(false);
    setIsDrawerOpen(true);
  };

  // EDIT PRODUCT
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsDuplicating(false);
    setIsDrawerOpen(true);
  };

  // DUPLICATE PRODUCT
  const handleDuplicateProduct = (product) => {
    const duplicatedProduct = {
      ...product,
      id: null,
      name: `${product.name} - نسخة`,
      slug: "",
      sku: "",
      images: (product.images || []).map((image) => ({
        ...image,
        id: undefined,
        isExisting: true,
      })),
      isPublished: false,
      isFeatured: false,
      stock: 0,
    };

    setEditingProduct(duplicatedProduct);
    setIsDuplicating(true);
    setIsDrawerOpen(true);
  };

  // CLOSE DRAWER
  const handleCloseDrawer = () => {
    if (isSaving) return;

    setIsDrawerOpen(false);
    setEditingProduct(null);
    setIsDuplicating(false);
  };

  // SAVE PRODUCT
  const handleSaveProduct = async (productData) => {
    if (isSaving) return;

    setIsSaving(true);

    const isEditing = Boolean(editingProduct?.id);

    try {
      await saveProduct(
        {
          ...productData,
          copyImages: isDuplicating,
        },
        editingProduct?.id || null,
      );

      setIsDrawerOpen(false);
      setEditingProduct(null);
      setIsDuplicating(false);

      showToast({
        type: "success",
        title: isEditing ? "تم تحديث المنتج" : "تمت إضافة المنتج",
        message: isEditing
          ? "تم حفظ تعديلات المنتج بنجاح."
          : "تمت إضافة المنتج إلى المتجر بنجاح.",
      });

      // Refresh without showing the page skeleton
      const refreshed = await loadProducts({
        showLoading: false,
        notifyError: false,
      });

      if (!refreshed) {
        showToast({
          type: "warning",
          title: "تعذر تحديث القائمة",
          message:
            "تم حفظ المنتج بنجاح، لكن تعذر تحديث قائمة المنتجات. حاول إعادة تحميل الصفحة.",
        });
      }
    } catch (err) {
      showToast({
        type: "error",
        title: "تعذر حفظ المنتج",
        message: getAdminErrorMessage(
          err,
          "حدث خطأ أثناء حفظ المنتج. يرجى مراجعة البيانات والمحاولة مرة أخرى.",
        ),
      });
    } finally {
      setIsSaving(false);
    }
  };

  // OPTIMISTIC PRODUCT UPDATE
  const updateProduct = async (product, changes, field) => {
    const productId = product.id;
    const updateKey = `${productId}:${field}`;

    // Prevent duplicate requests for the same field
    if (updatingProductsRef.current.has(updateKey)) return;

    // Save previous values of changed fields
    const previousValues = Object.fromEntries(
      Object.keys(changes).map((key) => [key, product[key]]),
    );

    // Lock this operation
    updatingProductsRef.current.add(updateKey);

    setUpdatingProducts((current) => ({
      ...current,
      [updateKey]: true,
    }));

    // Update UI immediately
    setProducts((current) =>
      current.map((item) =>
        item.id === productId ? { ...item, ...changes } : item,
      ),
    );

    try {
      await updateProductFields(productId, changes);

      showToast({
        type: "success",
        title: "تم تحديث المنتج",
        message: "تم حفظ التغييرات بنجاح.",
        duration: 2500,
      });
    } catch (err) {
      // Rollback only the failed fields
      setProducts((current) =>
        current.map((item) =>
          item.id === productId ? { ...item, ...previousValues } : item,
        ),
      );

      showToast({
        type: "error",
        title: "تعذر تحديث المنتج",
        message: getAdminErrorMessage(
          err,
          `تعذر تحديث "${product.name}". تمت استعادة القيمة السابقة.`,
        ),
      });
    } finally {
      updatingProductsRef.current.delete(updateKey);

      setUpdatingProducts((current) => {
        const updated = { ...current };

        delete updated[updateKey];

        return updated;
      });
    }
  };

  // TOGGLE FEATURED
  const handleToggleFeatured = (product) => {
    updateProduct(
      product,
      {
        isFeatured: !product.isFeatured,
      },
      "featured",
    );
  };

  // TOGGLE STOCK
  const handleToggleStock = (product) => {
    updateProduct(
      product,
      {
        stock: product.stock > 0 ? 0 : 1,
      },
      "stock",
    );
  };

  // TOGGLE PUBLISHED
  const handleTogglePublished = (product) => {
    updateProduct(
      product,
      {
        isPublished: !product.isPublished,
      },
      "published",
    );
  };

  // DELETE PRODUCT
  const handleDelete = (product) => {
    setDeletingProduct(product);
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;

    setDeletingProduct(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct || isDeleting) return;

    setIsDeleting(true);

    try {
      const productId = deletingProduct.id;
      const productName = deletingProduct.name;

      await deleteProduct(productId);

      setProducts((current) => current.filter((item) => item.id !== productId));

      setDeletingProduct(null);

      showToast({
        type: "success",
        title: "تم حذف المنتج",
        message: `تم حذف "${productName}" بنجاح.`,
      });
    } catch (err) {
      showToast({
        type: "error",
        title: "تعذر حذف المنتج",
        message: getAdminErrorMessage(
          err,
          "تعذر حذف المنتج. يرجى المحاولة مرة أخرى.",
        ),
      });
    } finally {
      setIsDeleting(false);
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

      {/* PRODUCTS CONTENT */}

      {isLoading ? (
        <>
          <StatsSkeleton columns={4} />

          <ProductFilters
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            status={status}
            setStatus={setStatus}
          />

          <TableSkeleton
            columns={8}
            rows={5}
            tableClassName="w-full min-w-[1100px] text-right"
          />
        </>
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
            updatingProducts={updatingProducts}
            onToggleFeatured={handleToggleFeatured}
            onToggleStock={handleToggleStock}
            onTogglePublished={handleTogglePublished}
            onEdit={handleEditProduct}
            onDuplicate={handleDuplicateProduct}
            onDelete={handleDelete}
          />
        </>
      )}

      {/* PRODUCT DRAWER */}

      <ProductDrawer
        isOpen={isDrawerOpen}
        product={editingProduct}
        onClose={handleCloseDrawer}
        onSave={handleSaveProduct}
        isSaving={isSaving}
      />

      {/* DELETE CONFIRMATION */}

      <ConfirmationDialog
        isOpen={!!deletingProduct}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="حذف المنتج"
        description={
          deletingProduct
            ? `هل أنت متأكد من حذف "${deletingProduct.name}"؟ لا يمكن التراجع عن هذا الإجراء بعد الحذف.`
            : ""
        }
        confirmText="نعم، احذف المنتج"
        cancelText="إلغاء"
        isLoading={isDeleting}
      />
    </div>
  );
}
