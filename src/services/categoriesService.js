import { supabase } from "../lib/supabase";

const CATEGORY_BUCKET = "category-images";

// تحويل مسار الصورة إلى Public URL
export const getCategoryImageUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const { data } = supabase.storage.from(CATEGORY_BUCKET).getPublicUrl(path);

  return data.publicUrl;
};

// تحويل بيانات قاعدة البيانات لشكل الواجهة
const mapCategory = (row, productCounts = {}) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description || "",
  image: getCategoryImageUrl(row.image_url),
  imagePath: row.image_url || "",
  isActive: row.status === "active",
  sortOrder: row.sort_order ?? 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  productsCount: productCounts[row.id] || 0,
});

// جلب التصنيفات وأعداد المنتجات
export const getCategories = async () => {
  const [
    { data: categories, error: categoriesError },
    { data: products, error: productsError },
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),

    supabase.from("products").select("category_id"),
  ]);

  if (categoriesError) throw categoriesError;
  if (productsError) throw productsError;

  const productCounts = {};

  (products || []).forEach((product) => {
    if (!product.category_id) return;

    productCounts[product.category_id] =
      (productCounts[product.category_id] || 0) + 1;
  });

  return (categories || []).map((category) =>
    mapCategory(category, productCounts),
  );
};

// رفع صورة التصنيف
const uploadCategoryImage = async (categoryId, file) => {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

  const filePath = `${categoryId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(CATEGORY_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) throw error;

  return filePath;
};

// حذف صورة من Storage
const removeCategoryImage = async (path) => {
  if (!path || path.startsWith("http")) return;

  const { error } = await supabase.storage.from(CATEGORY_BUCKET).remove([path]);

  if (error) throw error;
};

// إضافة أو تعديل تصنيف
export const saveCategory = async (categoryData, categoryId = null) => {
  let uploadedImagePath = null;

  const payload = {
    name: categoryData.name.trim(),
    slug: categoryData.slug.trim(),
    description: categoryData.description?.trim() || "",
    status: categoryData.isActive ? "active" : "inactive",
    updated_at: new Date().toISOString(),
  };

  let savedCategoryId = categoryId;
  let oldImagePath = "";

  if (categoryId) {
    const { data: existingCategory, error: fetchError } = await supabase
      .from("categories")
      .select("image_url")
      .eq("id", categoryId)
      .single();

    if (fetchError) throw fetchError;

    oldImagePath = existingCategory.image_url || "";

    if (categoryData.imageFile instanceof File) {
      uploadedImagePath = await uploadCategoryImage(
        categoryId,
        categoryData.imageFile,
      );

      payload.image_url = uploadedImagePath;
    } else if (categoryData.removeImage) {
      payload.image_url = "";
    }

    const { error } = await supabase
      .from("categories")
      .update(payload)
      .eq("id", categoryId);

    if (error) {
      if (uploadedImagePath) {
        await removeCategoryImage(uploadedImagePath).catch(console.error);
      }

      throw error;
    }
  } else {
    // إنشاء التصنيف أولاً للحصول على UUID
    const { data, error } = await supabase
      .from("categories")
      .insert({
        ...payload,
        sort_order: categoryData.sortOrder ?? 0,
      })
      .select("id")
      .single();

    if (error) throw error;

    savedCategoryId = data.id;

    try {
      if (categoryData.imageFile instanceof File) {
        uploadedImagePath = await uploadCategoryImage(
          savedCategoryId,
          categoryData.imageFile,
        );

        const { error: imageUpdateError } = await supabase
          .from("categories")
          .update({ image_url: uploadedImagePath })
          .eq("id", savedCategoryId);

        if (imageUpdateError) throw imageUpdateError;
      }
    } catch (error) {
      if (uploadedImagePath) {
        await removeCategoryImage(uploadedImagePath).catch(console.error);
      }

      await supabase.from("categories").delete().eq("id", savedCategoryId);

      throw error;
    }
  }

  // حذف الصورة القديمة بعد نجاح حفظ الصورة الجديدة أو إزالتها
  const imageChanged = uploadedImagePath || categoryData.removeImage;

  if (categoryId && imageChanged && oldImagePath) {
    await removeCategoryImage(oldImagePath);
  }

  return savedCategoryId;
};

// تغيير حالة التصنيف
export const updateCategoryStatus = async (categoryId, isActive) => {
  const { error } = await supabase
    .from("categories")
    .update({
      status: isActive ? "active" : "inactive",
      updated_at: new Date().toISOString(),
    })
    .eq("id", categoryId);

  if (error) throw error;
};

// حذف التصنيف
export const deleteCategory = async (categoryId) => {
  const { data: category, error: fetchError } = await supabase
    .from("categories")
    .select("image_url")
    .eq("id", categoryId)
    .single();

  if (fetchError) throw fetchError;

  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", categoryId);

  if (countError) throw countError;

  if (count > 0) {
    throw new Error(`لا يمكن حذف هذا التصنيف لأنه مرتبط بـ ${count} منتج.`);
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) throw error;

  if (category.image_url) {
    await removeCategoryImage(category.image_url);
  }
};

// جلب التصنيفات النشطة للـ Storefront فقط
export const getStorefrontCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, image_url, sort_order")
    .eq("status", "active")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((category) => ({
    id: category.id,
    title: category.name,
    slug: category.slug,
    href: `/shop?category=${encodeURIComponent(category.slug)}`,
    image: getCategoryImageUrl(category.image_url),
  }));
};
