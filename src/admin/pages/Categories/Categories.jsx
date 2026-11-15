import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, AlertCircle } from "lucide-react";

import CategoryStats from "./CategoryStats";
import CategoryFilters from "./CategoryFilters";
import CategoriesTable from "./CategoriesTable";

import CategoryDrawer from "../../components/ui/drawer/CategoryDrawer";
import PageHeader from "../../components/common/PageHeader";
import StatsSkeleton from "../../components/common/Skelton/StatsSkeleton";
import TableSkeleton from "../../components/common/Skelton/TableSkeleton";

import {
  getCategories,
  saveCategory,
  updateCategoryStatus,
  deleteCategory,
} from "../../../services/categoriesService";

import ConfirmationDialog from "../../components/ui/ConfirmationDialog";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("default");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [deletingCategory, setDeletingCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteBlocked, setDeleteBlocked] = useState(false);

  // تحميل التصنيفات وأعداد المنتجات
  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Categories loading error:", err);
      setError(err.message || "تعذر تحميل التصنيفات");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // عدد المنتجات داخل كل تصنيف
  const getProductCount = useCallback(
    (categoryId) => {
      return (
        categories.find((category) => category.id === categoryId)
          ?.productsCount || 0
      );
    },
    [categories],
  );

  // البحث والفلترة والترتيب
  const filteredCategories = useMemo(() => {
    let result = [...categories];

    if (search.trim()) {
      const searchValue = search.trim().toLowerCase();

      result = result.filter(
        (category) =>
          category.name.toLowerCase().includes(searchValue) ||
          category.slug.toLowerCase().includes(searchValue),
      );
    }

    if (status === "active") {
      result = result.filter((category) => category.isActive);
    } else if (status === "inactive") {
      result = result.filter((category) => !category.isActive);
    }

    switch (sort) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name, "ar"));
        break;

      case "products":
        result.sort((a, b) => getProductCount(b.id) - getProductCount(a.id));
        break;

      case "products-asc":
        result.sort((a, b) => getProductCount(a.id) - getProductCount(b.id));
        break;

      case "newest":
        result.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
        break;

      default:
        result.sort((a, b) => a.sortOrder - b.sortOrder);
        break;
    }

    return result;
  }, [categories, search, status, sort, getProductCount]);

  // فتح دراور الإضافة
  const handleAddCategory = () => {
    setError("");
    setEditingCategory(null);
    setIsDrawerOpen(true);
  };

  // فتح دراور التعديل
  const handleEditCategory = (category) => {
    setError("");
    setEditingCategory(category);
    setIsDrawerOpen(true);
  };

  // إغلاق الدراور
  const handleCloseDrawer = () => {
    if (isSaving) return;

    setIsDrawerOpen(false);
    setEditingCategory(null);
  };

  // إضافة أو تعديل تصنيف
  const handleSaveCategory = async (categoryData) => {
    if (isSaving) return;

    setIsSaving(true);
    setError("");

    try {
      await saveCategory(categoryData, editingCategory?.id || null);

      await loadCategories();

      setIsDrawerOpen(false);
      setEditingCategory(null);
    } catch (err) {
      console.error("Category saving error:", err);

      const message =
        err.code === "23505"
          ? "اسم التصنيف أو الرابط مستخدم بالفعل."
          : err.message || "حدث خطأ أثناء حفظ التصنيف";

      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  // تغيير حالة التصنيف
  const handleToggleStatus = async (categoryId) => {
    const category = categories.find((item) => item.id === categoryId);

    if (!category) return;

    try {
      setError("");

      await updateCategoryStatus(categoryId, !category.isActive);

      setCategories((prev) =>
        prev.map((item) =>
          item.id === categoryId ? { ...item, isActive: !item.isActive } : item,
        ),
      );
    } catch (err) {
      console.error("Category status error:", err);
      setError(err.message || "تعذر تغيير حالة التصنيف");
    }
  };

  // حذف تصنيف
  const handleDeleteCategory = (category) => {
    const productsCount = getProductCount(category.id);

    setDeletingCategory(category);
    setDeleteBlocked(productsCount > 0);
  };

  // إغلاق نافذة التأكيد
  const handleCancelDelete = () => {
    if (isDeleting) return;

    setDeletingCategory(null);
    setDeleteBlocked(false);
  };

  // تأكيد الحذف
  const handleConfirmDelete = async () => {
    if (!deletingCategory || isDeleting) return;

    if (deleteBlocked) {
      handleCancelDelete();
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await deleteCategory(deletingCategory.id);

      setCategories((prev) =>
        prev.filter((item) => item.id !== deletingCategory.id),
      );

      setDeletingCategory(null);
      setDeleteBlocked(false);
    } catch (err) {
      console.error("Category deletion error:", err);
      setError(err.message || "تعذر حذف التصنيف");
    } finally {
      setIsDeleting(false);
    }
  };

  // إعادة ضبط الفلاتر
  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setSort("default");
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="التصنيفات"
        description="إدارة وتنظيم تصنيفات منتجات متجر سديم"
        action={
          <button
            type="button"
            onClick={handleAddCategory}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-(--admin-primary) px-4 text-xs font-semibold text-white transition-colors hover:bg-(--admin-primary-hover) sm:w-auto"
          >
            <Plus size={17} />
            إضافة تصنيف جديد
          </button>
        }
      />

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <p className="wrap-break-word">{error}</p>
        </div>
      )}

      {isLoading ? (
        <>
          <StatsSkeleton columns={3} />

          <CategoryFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            sort={sort}
            setSort={setSort}
            onReset={handleResetFilters}
          />

          <TableSkeleton
            columns={6}
            rows={5}
            tableClassName="w-full min-w-[850px] text-right"
          />
        </>
      ) : (
        <>
          <CategoryStats
            categories={categories}
            getProductCount={getProductCount}
          />

          <CategoryFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            sort={sort}
            setSort={setSort}
            onReset={handleResetFilters}
          />

          <CategoriesTable
            categories={filteredCategories}
            getProductCount={getProductCount}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            onToggleStatus={handleToggleStatus}
          />
        </>
      )}

      <CategoryDrawer
        isOpen={isDrawerOpen}
        category={editingCategory}
        categories={categories}
        onClose={handleCloseDrawer}
        onSave={handleSaveCategory}
        isSaving={isSaving}
      />

      <ConfirmationDialog
        isOpen={!!deletingCategory}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={deleteBlocked ? "لا يمكن حذف التصنيف" : "حذف التصنيف"}
        description={
          deleteBlocked
            ? `لا يمكن حذف "${deletingCategory?.name}" لأنه مرتبط بـ ${getProductCount(deletingCategory?.id)} منتج. احذف المنتجات أو انقلها إلى تصنيف آخر أولاً.`
            : `هل أنت متأكد من حذف التصنيف "${deletingCategory?.name}"؟ لا يمكن التراجع عن هذا الإجراء بعد الحذف.`
        }
        confirmText={deleteBlocked ? "فهمت" : "نعم، احذف التصنيف"}
        cancelText="إلغاء"
        showCancel={!deleteBlocked}
        isLoading={isDeleting}
      />
    </div>
  );
}
