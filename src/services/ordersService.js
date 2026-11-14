import { supabase } from "../lib/supabase";

// تحويل حالة قاعدة البيانات للشكل المستخدم في الداشبورد
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

  return statuses[status] || "new";
};

// تحويل حالة الداشبورد للشكل المخزن في قاعدة البيانات
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

// تحويل بيانات الطلب للشكل المستخدم في React
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

// جلب جميع الطلبات
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

// إنشاء طلب جديد
export const createOrder = async (orderData, cartItems) => {
  if (!cartItems?.length) {
    throw new Error("لا يمكن إنشاء طلب بدون منتجات.");
  }

  const subtotal = Number(orderData.subtotal || 0);
  const discount = Number(orderData.discount || 0);
  const shipping = Number(orderData.shipping || 0);

  const orderPayload = {
    customer_name: orderData.customer_name,
    phone: orderData.phone,
    governorate: orderData.governorate,
    city: orderData.city,
    address: orderData.address,
    notes: orderData.notes || "",
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
    payment_method: orderData.payment_method || "cod",
  };

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(orderPayload)
    .select("id, order_number")
    .single();

  if (orderError) throw orderError;

  const itemsPayload = cartItems.map((item) => {
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.price);

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      !Number.isFinite(unitPrice) ||
      unitPrice < 0
    ) {
      throw new Error("بيانات أحد المنتجات غير صحيحة.");
    }

    const productId = item.productId || item.product_id || item.id;

    const validUUID =
      typeof productId === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        productId,
      );

    return {
      order_id: order.id,
      product_id: validUUID ? productId : null,
      product_name: item.name,
      product_image_url: item.image || "",
      unit_price: unitPrice,
      quantity,
      line_total: unitPrice * quantity,
    };
  });

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsPayload);

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    throw itemsError;
  }

  return order;
};

// تحديث حالة الطلب
export const updateOrderStatus = async (orderId, newStatus) => {
  const databaseStatus = toDatabaseStatus(newStatus);

  if (!databaseStatus) {
    throw new Error(`حالة الطلب غير معروفة: ${newStatus}`);
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      status: databaseStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select("id, status")
    .single();

  if (error) throw error;

  return {
    id: data.id,
    status: mapStatus(data.status),
  };
};
