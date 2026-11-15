import { useEffect, useMemo, useState } from "react";

import {
  getOrders,
  updateOrderStatus as saveOrderStatus,
} from "../../../services/ordersService";

import OrdersStats from "./OrdersStats";
import OrdersFilters from "./OrdersFilters";
import OrdersTable from "./OrdersTable";
import OrderDetailsDrawer from "../../components/ui/drawer/OrderDetailsDrawer";
import PageHeader from "../../components/common/PageHeader";
import StatsSkeleton from "../../components/common/Skelton/StatsSkeleton";
import TableSkeleton from "../../components/common/Skelton/TableSkeleton";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // جلب الطلبات
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(err.message || "حدث خطأ أثناء تحميل الطلبات.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // البحث والفلاتر
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        String(order.orderNumber || order.id)
          .toLowerCase()
          .includes(searchValue) ||
        order.customer?.name?.toLowerCase().includes(searchValue) ||
        order.customer?.phone?.includes(searchValue);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const matchesPayment =
        paymentFilter === "all" || order.paymentMethod === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  // فتح تفاصيل الطلب
  const openOrderDrawer = (order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  // إغلاق التفاصيل
  const closeOrderDrawer = () => {
    if (isSaving) return;
    setIsDrawerOpen(false);
  };

  // حفظ التعديلات في قاعدة البيانات
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setIsSaving(true);

      const updatedOrder = await saveOrderStatus(orderId, newStatus);

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: updatedOrder.status }
            : order,
        ),
      );

      setSelectedOrder((prev) =>
        prev?.id === orderId ? { ...prev, status: updatedOrder.status } : prev,
      );

      setIsDrawerOpen(false);

      return true;
    } catch (err) {
      console.error("Update order status error:", err);

      alert(err.message || "حدث خطأ أثناء تحديث حالة الطلب.");

      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="الطلبات"
        description="إدارة ومتابعة طلبات العملاء وحالات الشحن."
      />

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={fetchOrders}
            className="shrink-0 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {isLoading ? (
        <>
          <StatsSkeleton columns={4} />

          <OrdersFilters
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            paymentFilter={paymentFilter}
            setPaymentFilter={setPaymentFilter}
            resultsCount={0}
          />

          <TableSkeleton
            columns={8}
            rows={5}
            tableClassName="w-full min-w-[1100px] text-right"
          />
        </>
      ) : (
        <>
          <OrdersStats orders={orders} />

          <OrdersFilters
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            paymentFilter={paymentFilter}
            setPaymentFilter={setPaymentFilter}
            resultsCount={filteredOrders.length}
          />

          <OrdersTable orders={filteredOrders} onViewOrder={openOrderDrawer} />
        </>
      )}

      <OrderDetailsDrawer
        isOpen={isDrawerOpen}
        order={selectedOrder}
        onClose={closeOrderDrawer}
        onStatusChange={handleStatusChange}
        isSaving={isSaving}
      />
    </div>
  );
}
