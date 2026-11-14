import { supabase } from "../lib/supabase";

// تحويل حالة الطلب للشكل المستخدم في الداشبورد
const mapOrderStatus = (status) => {
  const statuses = {
    pending_confirmation: "new",
    confirmed: "confirmed",
    preparing: "preparing",
    shipped: "shipping",
    delivered: "delivered",
    cancelled: "cancelled",
    rejected: "cancelled",
  };

  return statuses[status] || status || "new";
};

// تنسيق السعر
const formatPrice = (value) => {
  return `${new Intl.NumberFormat("en-US").format(Number(value || 0))} ج.م`;
};

// تنسيق التاريخ
const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// التحقق من المنتجات منخفضة المخزون
const isLowStock = (product) => {
  return (
    product.track_quantity === true &&
    Number(product.stock || 0) <= Number(product.low_stock_threshold ?? 10)
  );
};

// جلب إحصائيات الصفحة الرئيسية
export const getOverviewStats = async () => {
  const [
    { count: newOrders, error: newOrdersError },
    { count: totalOrders, error: totalOrdersError },
    { count: totalProducts, error: productsError },
    { data: stockProducts, error: stockError },
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending_confirmation"),

    supabase.from("orders").select("id", { count: "exact", head: true }),

    supabase.from("products").select("id", { count: "exact", head: true }),

    supabase
      .from("products")
      .select("stock, low_stock_threshold, track_quantity")
      .eq("track_quantity", true),
  ]);

  if (newOrdersError) throw newOrdersError;
  if (totalOrdersError) throw totalOrdersError;
  if (productsError) throw productsError;
  if (stockError) throw stockError;

  const lowStock = (stockProducts || []).filter(isLowStock).length;

  return {
    newOrders: newOrders || 0,
    totalOrders: totalOrders || 0,
    totalProducts: totalProducts || 0,
    lowStock,
  };
};

// جلب أحدث الطلبات
export const getRecentOrders = async (limit = 5) => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      customer_name,
      phone,
      total,
      status,
      created_at
      `,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).map((order) => ({
    id: `#SD-${order.order_number}`,
    orderId: order.id,
    customer: order.customer_name || "",
    phone: order.phone || "",
    date: formatDate(order.created_at),
    total: formatPrice(order.total),
    status: mapOrderStatus(order.status),
  }));
};

// جلب المنتجات منخفضة المخزون
export const getLowStockProducts = async (limit = 5) => {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      stock,
      low_stock_threshold,
      track_quantity,
      categories (
        name
      )
      `,
    )
    .eq("track_quantity", true);

  if (error) throw error;

  return (data || [])
    .filter(isLowStock)
    .sort((a, b) => Number(a.stock) - Number(b.stock))
    .slice(0, limit)
    .map((product) => ({
      id: product.id,
      name: product.name,
      category: product.categories?.name || "بدون تصنيف",
      stock: Number(product.stock || 0),
    }));
};
