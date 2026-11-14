import { useEffect, useState } from "react";
import { Eye, ShoppingBag, PackageOpen } from "lucide-react";

import OrderStatus from "./OrderStatus";

import TableHead from "../../components/tables/TableHead";
import TableFooter from "../../components/tables/TableFooter";
import TableEmptyState from "../../components/tables/TableEmptyState";

const PAGE_SIZE = 10;

const formatPrice = (price) =>
  `${Number(price || 0).toLocaleString("en-US")} ج.م`;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function OrdersTable({ orders = [], onViewOrder }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [orders]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="overflow-hidden rounded-xl border border-[#E9EBF0] bg-white">
      {orders.length === 0 ? (
        <TableEmptyState
          icon={PackageOpen}
          title="لا توجد طلبات"
          description="لم يتم العثور على طلبات مطابقة لعملية البحث."
        />
      ) : (
        <>
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-225 text-right">
              <TableHead
                columns={[
                  { label: "رقم الطلب" },
                  { label: "العميل" },
                  { label: "التاريخ" },
                  { label: "المنتجات" },
                  { label: "الإجمالي" },
                  { label: "طريقة الدفع" },
                  { label: "الحالة" },
                  { label: "التفاصيل" },
                ]}
              />

              <tbody className="divide-y divide-[#F0F1F5]">
                {paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-[#FAFAFC]"
                  >
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-bold text-[#22252D]"
                        dir="ltr"
                      >
                        #{order.orderNumber || order.id}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-sm font-bold text-pink-600">
                          {order.customer?.name?.charAt(0) || "؟"}
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-[#22252D]">
                            {order.customer?.name || "غير متوفر"}
                          </p>

                          <p
                            className="mt-1 text-[11px] text-[#A0A5B1]"
                            dir="ltr"
                          >
                            {order.customer?.phone || ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-xs text-[#777D8A]">
                      {formatDate(order.date)}
                    </td>

                    <td className="px-5 py-4">
                      <span className="flex w-fit items-center gap-1.5 rounded-lg bg-[#F5F6FA] px-2.5 py-1.5 text-[11px] text-[#777D8A]">
                        <ShoppingBag size={13} />
                        {(order.items || []).reduce(
                          (total, item) => total + Number(item.quantity || 0),
                          0,
                        )}{" "}
                        قطعة
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs font-bold text-[#22252D]">
                      {formatPrice(order.total)}
                    </td>

                    <td className="px-5 py-4 text-[11px] text-[#777D8A]">
                      {{
                        cod: "الدفع عند الاستلام",
                        vodafone: "فودافون كاش",
                        instapay: "إنستاباي",
                      }[order.paymentMethod] || order.paymentMethod}
                    </td>

                    <td className="px-5 py-4">
                      <OrderStatus status={order.status} />
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => onViewOrder(order)}
                        className="flex items-center gap-1.5 rounded-lg border border-[#E9EBF0] px-3 py-2 text-[11px] font-semibold text-[#777D8A] transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
                      >
                        <Eye size={14} />
                        عرض
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <TableFooter
            totalItems={orders.length}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
