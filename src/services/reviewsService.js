import { supabase } from "../lib/supabase";

// تحويل بيانات التقييم من قاعدة البيانات إلى شكل React
const mapReview = (review, privateDetails = {}) => ({
  id: review.id,
  customerName: review.customer_name,
  customerPhone: privateDetails.customer_phone || "",
  productName: review.product_name || "",
  productId: review.product_id || "",
  orderId: privateDetails.order_id || "",
  rating: review.rating,
  comment: review.content,
  title: review.title || "",
  source: review.source || "whatsapp",
  date: review.review_date,
  status: review.status,
  screenshotUrl: review.screenshot_url || "",
  createdAt: review.created_at,
  updatedAt: review.updated_at,
});

// تحويل بيانات React إلى أعمدة قاعدة البيانات
const mapReviewToDatabase = (data) => ({
  customer_name: data.customerName?.trim(),
  rating: Number(data.rating),
  title: data.title?.trim() || "",
  content: data.comment?.trim(),
  source: data.source || "whatsapp",
  product_id: data.productId || null,
  product_name: data.productName?.trim() || "",
  review_date: data.date || new Date().toISOString().slice(0, 10),
  screenshot_url: data.screenshotUrl || "",
  status: data.status || "pending",
});

// جلب جميع التقييمات للإدارة
export const getReviews = async () => {
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  if (!reviews?.length) return [];

  const reviewIds = reviews.map((review) => review.id);

  const { data: privateDetails, error: privateError } = await supabase
    .from("review_private_details")
    .select("review_id, customer_phone, order_id")
    .in("review_id", reviewIds);

  if (privateError) throw privateError;

  const privateMap = new Map(
    (privateDetails || []).map((item) => [item.review_id, item]),
  );

  return reviews.map((review) => mapReview(review, privateMap.get(review.id)));
};

// جلب التقييمات المنشورة للـ Storefront فقط
export const getStorefrontReviews = async () => {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      id,
      customer_name,
      rating,
      content,
      source,
      review_date,
      status
    `,
    )
    .eq("status", "approved")
    .order("review_date", { ascending: false });

  if (error) throw error;

  return (data || []).map((review) => ({
    id: review.id,
    name: review.customer_name || "عميلة سديم",
    initial: (review.customer_name || "س").trim().charAt(0),
    comment: review.content || "",
    rating: review.rating,
    date: review.review_date,
    badge: review.source === "whatsapp" ? "من واتساب" : "",
  }));
};

// إضافة تقييم جديد
export const createReview = async (data) => {
  const reviewData = mapReviewToDatabase({
    ...data,
    status: "pending",
  });

  const { data: review, error } = await supabase
    .from("reviews")
    .insert(reviewData)
    .select()
    .single();

  if (error) throw error;

  const privateData = {
    review_id: review.id,
    customer_phone: data.customerPhone?.trim() || null,
    order_id: data.orderId || null,
  };

  const { error: privateError } = await supabase
    .from("review_private_details")
    .insert(privateData);

  if (privateError) {
    // حذف التقييم إذا فشل حفظ بياناته الخاصة
    const { error: rollbackError } = await supabase
      .from("reviews")
      .delete()
      .eq("id", review.id);

    if (rollbackError) {
      console.error("Review rollback error:", rollbackError);
    }

    throw privateError;
  }

  return mapReview(review, privateData);
};

// تعديل تقييم موجود
export const updateReview = async (id, data) => {
  const reviewData = mapReviewToDatabase(data);

  const { data: review, error } = await supabase
    .from("reviews")
    .update(reviewData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  const privateData = {
    review_id: id,
    customer_phone: data.customerPhone?.trim() || null,
    order_id: data.orderId || null,
    updated_at: new Date().toISOString(),
  };

  const { error: privateError } = await supabase
    .from("review_private_details")
    .upsert(privateData, {
      onConflict: "review_id",
    });

  if (privateError) throw privateError;

  return mapReview(review, privateData);
};

// تغيير حالة التقييم: نشر أو رفض أو إرجاع للمراجعة
export const updateReviewStatus = async (id, status) => {
  const allowedStatuses = ["pending", "approved", "rejected"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("حالة التقييم غير صحيحة.");
  }

  const { data, error } = await supabase
    .from("reviews")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

// حذف تقييم
export const deleteReview = async (id) => {
  const { error } = await supabase.from("reviews").delete().eq("id", id);

  if (error) throw error;

  return true;
};
