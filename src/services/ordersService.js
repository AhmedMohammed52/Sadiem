import { supabase } from "../lib/supabase";

// Database status -> Dashboard status
const mapStatus = (status) => {
  const statuses = {
    pending_confirmation: "new",
    confirmed: "processing",
    preparing: "processing",
    shipped: "shipped",
    delivered: "completed",
    cancelled: "cancelled",
    rejected: "cancelled",
  };

  return statuses[status] || status;
};

// Dashboard status -> Database status
const toDatabaseStatus = (status) => {
  const statuses = {
    new: "pending_confirmation",
    processing: "preparing",
    shipped: "shipped",
    completed: "delivered",
    cancelled: "cancelled",
  };

  return statuses[status] || null;
};

// Map database order to dashboard order
const mapOrder = (row) => ({
  id: row.id,
  orderNumber: row.order_number,

  customer: {
    name: row.customer_name || "",
    phone: row.phone || "",
  },

  address: {
    governorate: row.governorate || "",
    city: row.city || "",
    street: row.address || "",
    details: "",
  },

  notes: row.notes || "",

  subtotal: Number(row.subtotal || 0),
  discount: Number(row.discount || 0),
  shipping: Number(row.shipping || 0),
  total: Number(row.total || 0),

  paymentMethod: row.payment_method || "cod",
  status: mapStatus(row.status),

  date: row.created_at,
  updatedAt: row.updated_at,

  items: (row.order_items || []).map((item) => ({
    id: item.id,
    productId: item.product_id,
    name: item.product_name,
    image: item.product_image_url || "",
    price: Number(item.unit_price || 0),
    quantity: Number(item.quantity || 0),
    lineTotal: Number(item.line_total || 0),
  })),
});

// GET ORDERS
export const getOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        id,
        order_id,
        product_id,
        product_name,
        product_image_url,
        unit_price,
        quantity,
        line_total
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(mapOrder);
};

// CREATE ORDER
export const createOrder = async (orderData, cartItems) => {
  if (!cartItems?.length) {
    throw new Error("لا يمكن إنشاء طلب بدون منتجات.");
  }

  const itemsPayload = cartItems.map((item) => ({
    product_id: item.productId || item.product_id || item.id,
    quantity: Number(item.quantity),
  }));

  const { data, error } = await supabase.rpc("create_public_order", {
    p_customer_name: orderData.customer_name,
    p_phone: orderData.phone,
    p_governorate: orderData.governorate,
    p_city: orderData.city,
    p_address: orderData.address,
    p_notes: orderData.notes || "",
    p_items: itemsPayload,
  });

  if (error) throw error;

  const order = Array.isArray(data) ? data[0] : data;

  if (!order?.id || !order?.order_number) {
    throw new Error("لم يتم استلام بيانات الطلب من قاعدة البيانات.");
  }

  return order;
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (orderId, newStatus) => {
  if (!orderId) {
    throw new Error("رقم الطلب غير صالح.");
  }

  const databaseStatus = toDatabaseStatus(newStatus);

  if (!databaseStatus) {
    throw new Error("حالة الطلب المحددة غير صحيحة.");
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      status: databaseStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select("id, status")
    .maybeSingle();

  if (error) {
    throw error;
  }

  // No matching row was updated
  if (!data) {
    throw new Error(
      "لم يتم تحديث الطلب. قد يكون الطلب غير موجود أو لا تملك صلاحية تعديله.",
    );
  }

  return {
    id: data.id,
    status: mapStatus(data.status),
  };
};
