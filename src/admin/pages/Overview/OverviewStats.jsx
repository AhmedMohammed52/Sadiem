import { useEffect, useState } from "react";

import {
  ShoppingBag,
  ClipboardList,
  Package,
  AlertTriangle,
} from "lucide-react";

import { getOverviewStats } from "../../../services/overviewServices";

import StatCard from "../../components/common/StatCard";
import StatsSkeleton from "../../components/common/StatsSkeleton";

const STAT_CONFIG = [
  {
    key: "newOrders",
    title: "طلبات جديدة",
    icon: ShoppingBag,
    color: "bg-blue-50 text-blue-600",
  },
  {
    key: "totalOrders",
    title: "إجمالي الطلبات",
    icon: ClipboardList,
    color: "bg-violet-50 text-violet-600",
  },
  {
    key: "totalProducts",
    title: "إجمالي المنتجات",
    icon: Package,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "lowStock",
    title: "مخزون منخفض",
    icon: AlertTriangle,
    color: "bg-orange-50 text-orange-600",
  },
];

export default function OverviewStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(false);

        const data = await getOverviewStats();

        if (isMounted) {
          setStats(data);
        }
      } catch (err) {
        console.error("Overview stats error:", err);

        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [retryKey]);

  if (loading) {
    return <StatsSkeleton columns={4} />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-600">
          تعذر تحميل إحصائيات المتجر.
        </p>

        <button
          type="button"
          onClick={() => setRetryKey((prev) => prev + 1)}
          className="mt-2 text-xs font-semibold text-red-700 underline"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {STAT_CONFIG.map((stat) => (
          <StatCard
            key={stat.key}
            title={stat.title}
            value={stats?.[stat.key] ?? 0}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
    </div>
  );
}
