import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { getRecentOrders } from "../../../services/overviewServices";
import { OVERVIEW_ORDER_STATUSES } from "../../data/order";

import RecentOrdersSkeleton from "./RecentOrdersSkeleton";

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(false);

        const data = await getRecentOrders(5);

        if (isMounted) {
          setOrders(data);
        }
      } catch (err) {
        console.error("Recent orders error:", err);

        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [retryKey]);

  return (
    <section className="overflow-hidden rounded-xl border border-[#E9EBF0] bg-white">
      <div className="flex items-center justify-between gap-3 p-5">
        <h2 className="text-sm font-bold text-[#22252D] sm:text-base">
          أحدث الطلبات
        </h2>

        <Link
          to="/admin/orders"
          className="flex shrink-0 items-center gap-1 text-xs font-medium text-[#4059E8] transition hover:text-[#3048D5]"
        >
          عرض كل الطلبات
          <ArrowLeft size={15} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-162.5 text-right">
          <thead>
            <tr className="border-y border-[#F0F1F5] bg-[#FAFAFC] text-xs text-[#777D8A]">
              <th className="px-5 py-4 font-medium">رقم الطلب</th>
              <th className="px-5 py-4 font-medium">العميل</th>
              <th className="px-5 py-4 font-medium">التاريخ</th>
              <th className="px-5 py-4 font-medium">الإجمالي</th>
              <th className="px-5 py-4 font-medium">الحالة</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <RecentOrdersSkeleton />
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center">
                  <p className="text-xs text-red-500">تعذر تحميل الطلبات.</p>

                  <button
                    type="button"
                    onClick={() => setRetryKey((prev) => prev + 1)}
                    className="mt-2 text-xs font-semibold text-[#4059E8] hover:underline"
                  >
                    إعادة المحاولة
                  </button>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-xs text-[#A0A5B1]"
                >
                  لا توجد طلبات حتى الآن.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const status = OVERVIEW_ORDER_STATUSES[order.status];

                return (
                  <tr
                    key={order.orderId}
                    className="border-b border-[#F0F1F5] last:border-0 hover:bg-[#FAFAFC]"
                  >
                    <td className="px-5 py-4 text-xs font-semibold text-[#4059E8]">
                      {order.id}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-xs font-semibold text-[#22252D]">
                        {order.customer}
                      </p>

                      <p className="mt-1 text-[10px] text-[#A0A5B1]">
                        {order.phone}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-xs text-[#777D8A]">
                      {order.date}
                    </td>

                    <td className="px-5 py-4 text-xs font-semibold text-[#22252D]">
                      {order.total}
                    </td>

                    <td className="px-5 py-4">
                      {status ? (
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${status.style}`}
                        >
                          <status.icon size={13} />
                          {status.label}
                        </span>
                      ) : (
                        <span className="text-xs text-[#777D8A]">غير محدد</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
