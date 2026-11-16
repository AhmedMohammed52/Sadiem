import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getOrders,
  updateOrderStatus as saveOrderStatus,
} from "../../../services/ordersService";

import { getAdminErrorMessage } from "../../utils/errorHandler";
import { useAdminToast } from "../../../context/AdminToastContext";

import { VALID_ORDER_STATUSES } from "../../data/order";

import OrdersStats from "./OrdersStats";
import OrdersFilters from "./OrdersFilters";
import OrdersTable from "./OrdersTable";
import OrderDetailsDrawer from "../../components/ui/drawer/OrderDetailsDrawer";
import PageHeader from "../../components/common/PageHeader";
import StatsSkeleton from "../../components/common/Skelton/StatsSkeleton";
import TableSkeleton from "../../components/common/Skelton/TableSkeleton";

export default function Orders() {
  const { showToast } = useAdminToast();

  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // تحميل الطلبات
  const loadOrders = useCallback(
    async ({ showLoading = true, notifyError = true } = {}) => {
      if (showLoading) {
        setIsLoading(true);
      }

      try {
        const data = await getOrders();

        setOrders(data || []);

        return true;
      } catch (err) {
        if (notifyError) {
          showToast({
            type: "error",
            title: "تعذر تحميل الطلبات",
            message: getAdminErrorMessage(
              err,
              "حدث خطأ أثناء تحميل الطلبات. حاول مرة أخرى.",
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
    loadOrders();
  }, [loadOrders]);

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
    setSelectedOrder(null);
  };

  // حفظ حالة الطلب
  const handleStatusChange = async (orderId, newStatus) => {
    if (isSaving) return false;

    if (!VALID_ORDER_STATUSES.includes(newStatus)) {
      showToast({
        type: "error",
        title: "حالة غير صالحة",
        message: "قيمة الحالة المستلمة غير مدعومة.",
      });

      return false;
    }

    setIsSaving(true);

    try {
      const updatedOrder = await saveOrderStatus(orderId, newStatus);

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? { ...order, status: updatedOrder.status }
            : order,
        ),
      );

      setIsDrawerOpen(false);
      setSelectedOrder(null);

      showToast({
        type: "success",
        title: "تم تحديث حالة الطلب",
        message: "تم حفظ حالة الطلب الجديدة بنجاح.",
        duration: 2500,
      });

      return true;
    } catch (error) {
      showToast({
        type: "error",
        title: "تعذر تحديث حالة الطلب",
        message: getAdminErrorMessage(error, "حدث خطأ أثناء تحديث حالة الطلب."),
      });

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
