import { supabase } from "../lib/supabase";

const PRODUCT_BUCKET = "product-images";
const SKU_PREFIX = "SDM-";

// ==========================================
// SLUG HELPERS
// ==========================================

// تحويل الحروف العربية إلى حروف لاتينية
const arabicToEnglish = (value = "") => {
  const map = {
    ا: "a",
    أ: "a",
    إ: "e",
    آ: "aa",
    ء: "",
    ؤ: "w",
    ئ: "y",
    ب: "b",
    ت: "t",
    ث: "th",
    ج: "g",
    ح: "h",
    خ: "kh",
    د: "d",
    ذ: "z",
    ر: "r",
    ز: "z",
    س: "s",
    ش: "sh",
    ص: "s",
    ض: "d",
    ط: "t",
    ظ: "z",
    ع: "a",
    غ: "gh",
    ف: "f",
    ق: "q",
    ك: "k",
    ل: "l",
    م: "m",
    ن: "n",
    ه: "h",
    ة: "a",
    و: "w",
    ى: "a",
    ي: "y",
    " ": "-",
  };

  return value.replace(/[\u0621-\u064A ]/g, (char) => {
    return map[char] ?? char;
  });
};

// إنشاء Slug إنجليزي
const normalizeSlug = (value = "") => {
  return arabicToEnglish(value)
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// التأكد من عدم تكرار Slug وإنشاء رقم تلقائي عند الحاجة
const generateUniqueSlug = async (name) => {
  const baseSlug = normalizeSlug(name) || "product";

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const { data, error } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;

    if (!data) return slug;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

// ==========================================
// SKU HELPERS
// ==========================================

// توليد كود منتج تسلسلي SDM-001
const generateNextSKU = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("sku")
    .like("sku", `${SKU_PREFIX}%`);

  if (error) throw error;

  const highestNumber = (data || []).reduce((max, item) => {
    const match = item.sku?.match(/^SDM-(\d+)$/);

    if (!match) return max;

    return Math.max(max, Number(match[1]));
  }, 0);

  const nextNumber = String(highestNumber + 1).padStart(3, "0");

  return `${SKU_PREFIX}${nextNumber}`;
};

// ==========================================
// PRODUCT IMAGES
// ==========================================

// تحويل مسار الصورة إلى رابط يمكن عرضه
export const getProductImageUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const { data } = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path);

  return data.publicUrl;
};

// ==========================================
// PRODUCT MAPPING
// ==========================================

const mapProduct = (row) => {
  const images = (row.product_images || [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({
      id: item.id,
      path: item.image_url,
      url: getProductImageUrl(item.image_url),
      isExisting: true,
    }));

  const price = Number(row.price || 0);
  const oldPrice = row.compare_price ? Number(row.compare_price) : null;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku || "",

    categoryId: row.categories?.id || null,
    category: row.categories?.slug || "",
    categoryName: row.categories?.name || "غير محدد",

    price,
    oldPrice,

    discount:
      oldPrice && oldPrice > price
        ? Math.round(((oldPrice - price) / oldPrice) * 100)
        : 0,

    stock: Number(row.stock || 0),
    isFeatured: row.is_featured,
    isPublished: row.status === "active",

    image: images[0]?.url || null,
    images,

    description: row.description || "",
    features: row.features || [],
    details: row.details || [],
    ingredients: row.ingredients || [],

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

// ==========================================
// GET PRODUCTS
// ==========================================

export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        sort_order
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(mapProduct);
};

// ==========================================
// FEATURED PRODUCTS
// ==========================================

export const getFeaturedProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        sort_order
      )
    `,
    )
    .eq("is_featured", true)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) throw error;

  return (data || []).map(mapProduct);
};

// ==========================================
// CATEGORIES
// ==========================================

export const getProductCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return data || [];
};

// ==========================================
// STOREFRONT PRODUCTS
// ==========================================

export const getStorefrontProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        sort_order
      )
    `,
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(mapProduct);
};

// ==========================================
// SEARCH PRODUCTS
// ==========================================

export const searchStorefrontProducts = async (query, limit = 8) => {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) return [];

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        sort_order
      )
    `,
    )
    .eq("status", "active")
    .ilike("name", `%${normalizedQuery}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).map(mapProduct);
};

// ==========================================
// SINGLE PRODUCT
// ==========================================

export const getStorefrontProductBySlug = async (slug) => {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        sort_order
      )
    `,
    )
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw error;

  return data ? mapProduct(data) : null;
};

// ==========================================
// RELATED PRODUCTS
// ==========================================

export const getRelatedProducts = async (
  categoryId,
  currentProductId,
  limit = 8,
) => {
  if (!categoryId) return [];

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        sort_order
      )
    `,
    )
    .eq("category_id", categoryId)
    .eq("status", "active")
    .neq("id", currentProductId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).map(mapProduct);
};

// ==========================================
// IMAGE UPLOAD
// ==========================================

const uploadImage = async (productId, file) => {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

  const filePath = `${productId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(PRODUCT_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) throw error;

  return filePath;
};

// ==========================================
// COPY PRODUCT IMAGE
// ==========================================

const copyStorageImage = async (sourcePath, newProductId) => {
  if (sourcePath.startsWith("http://") || sourcePath.startsWith("https://")) {
    return sourcePath;
  }

  const extension = sourcePath.split(".").pop()?.toLowerCase() || "jpg";

  const destinationPath = `${newProductId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(PRODUCT_BUCKET)
    .copy(sourcePath, destinationPath);

  if (error) throw error;

  return destinationPath;
};

// ==========================================
// IMAGE DELETE
// ==========================================

const removeStorageImages = async (paths) => {
  const validPaths = paths.filter(
    (path) =>
      path && !path.startsWith("http://") && !path.startsWith("https://"),
  );

  if (!validPaths.length) return;

  const { error } = await supabase.storage
    .from(PRODUCT_BUCKET)
    .remove(validPaths);

  if (error) throw error;
};

// ==========================================
// SAVE PRODUCT
// ==========================================

export const saveProduct = async (productData, productId = null) => {
  // ========================================
  // GENERATE SKU AND SLUG
  // ========================================

  let finalSKU;
  let finalSlug;

  if (productId) {
    // التعديل: الاحتفاظ بالبيانات الحالية
    const { data: existingProduct, error } = await supabase
      .from("products")
      .select("sku, slug")
      .eq("id", productId)
      .single();

    if (error) throw error;

    finalSKU = existingProduct.sku || (await generateNextSKU());

    // نحافظ على الرابط القديم حتى لا تتعطل الروابط المنشورة
    finalSlug =
      existingProduct.slug || (await generateUniqueSlug(productData.name));
  } else {
    // الإضافة أو النسخ: بيانات جديدة وفريدة
    finalSKU = await generateNextSKU();
    finalSlug = await generateUniqueSlug(productData.name);
  }

  // ========================================
  // GET CATEGORY
  // ========================================

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", productData.category)
    .single();

  if (categoryError) throw categoryError;

  // ========================================
  // PRODUCT PAYLOAD
  // ========================================

  const productPayload = {
    name: productData.name,
    slug: finalSlug,
    sku: finalSKU,
    category_id: category.id,
    description: productData.description || "",
    short_description: "",
    price: productData.price,
    compare_price: productData.oldPrice || null,
    stock: productData.stock,
    track_quantity: true,
    status: productData.isPublished ? "active" : "draft",
    is_featured: productData.isFeatured,
    features: productData.features || [],
    details: productData.details || [],
    ingredients: productData.ingredients || [],
    updated_at: new Date().toISOString(),
  };

  let savedProductId = productId;
  let oldImagePaths = [];
  let copiedImagePaths = [];
  let uploadedImagePaths = [];

  // ========================================
  // UPDATE OR INSERT PRODUCT
  // ========================================

  if (productId) {
    const { data: oldImages, error: oldImagesError } = await supabase
      .from("product_images")
      .select("image_url")
      .eq("product_id", productId);

    if (oldImagesError) throw oldImagesError;

    oldImagePaths = (oldImages || []).map((item) => item.image_url);

    const { error } = await supabase
      .from("products")
      .update(productPayload)
      .eq("id", productId);

    if (error) throw error;
  } else {
    const { data, error } = await supabase
      .from("products")
      .insert(productPayload)
      .select("id")
      .single();

    if (error) throw error;

    savedProductId = data.id;
  }

  // ========================================
  // SAVE IMAGES
  // ========================================

  try {
    const imagePaths = [];

    for (const image of productData.images || []) {
      if (image.file instanceof File) {
        // صورة جديدة
        const path = await uploadImage(savedProductId, image.file);

        imagePaths.push(path);
        uploadedImagePaths.push(path);
      } else if (image.path) {
        if (!productId && productData.copyImages) {
          // نسخ صورة المنتج الأصلي
          const copiedPath = await copyStorageImage(image.path, savedProductId);

          imagePaths.push(copiedPath);

          if (
            copiedPath !== image.path &&
            !copiedPath.startsWith("http://") &&
            !copiedPath.startsWith("https://")
          ) {
            copiedImagePaths.push(copiedPath);
          }
        } else {
          imagePaths.push(image.path);
        }
      }
    }

    // حذف سجلات الصور القديمة عند التعديل
    if (productId) {
      const { error: deleteRowsError } = await supabase
        .from("product_images")
        .delete()
        .eq("product_id", savedProductId);

      if (deleteRowsError) throw deleteRowsError;
    }

    // تسجيل الصور الجديدة
    if (imagePaths.length) {
      const imageRows = imagePaths.map((path, index) => ({
        product_id: savedProductId,
        image_url: path,
        sort_order: index,
      }));

      const { error: insertImagesError } = await supabase
        .from("product_images")
        .insert(imageRows);

      if (insertImagesError) throw insertImagesError;
    }

    // حذف الصور التي تمت إزالتها عند التعديل
    if (productId) {
      const retainedPaths = new Set(imagePaths);

      const removedPaths = oldImagePaths.filter(
        (path) => !retainedPaths.has(path),
      );

      await removeStorageImages(removedPaths);
    }
  } catch (error) {
    // تنظيف المنتج الجديد عند فشل الحفظ
    if (!productId) {
      await supabase
        .from("product_images")
        .delete()
        .eq("product_id", savedProductId);

      await supabase.from("products").delete().eq("id", savedProductId);

      await removeStorageImages([
        ...copiedImagePaths,
        ...uploadedImagePaths,
      ]).catch((cleanupError) => {
        console.error("Image cleanup error:", cleanupError);
      });
    }

    throw error;
  }

  return savedProductId;
};

// ==========================================
// DELETE PRODUCT
// ==========================================

export const deleteProduct = async (productId) => {
  const { data: images, error: imagesError } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("product_id", productId);

  if (imagesError) throw imagesError;

  const paths = (images || []).map((item) => item.image_url);

  const { error: deleteImagesError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", productId);

  if (deleteImagesError) throw deleteImagesError;

  const { error: deleteProductError } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (deleteProductError) throw deleteProductError;

  await removeStorageImages(paths);
};

export const updateProductFields = async (productId, changes) => {
  const payload = {};

  if (Object.prototype.hasOwnProperty.call(changes, "stock")) {
    payload.stock = changes.stock;
  }

  if (Object.prototype.hasOwnProperty.call(changes, "isPublished")) {
    payload.status = changes.isPublished ? "active" : "draft";
  }

  if (Object.prototype.hasOwnProperty.call(changes, "isFeatured")) {
    payload.is_featured = changes.isFeatured;
  }

  if (Object.keys(payload).length === 0) {
    throw new Error("لا توجد بيانات صالحة للتحديث.");
  }

  payload.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", productId)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    throw new Error("لم يتم العثور على المنتج أو لا تملك صلاحية تحديثه.");
  }

  return data;
};
