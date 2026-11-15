import { useEffect, useState } from "react";

import { STAT_CONFIG } from "../../data/overviewStatsConfig";

import { getOverviewStats } from "../../../services/overviewServices";

import StatCard from "../../components/common/StatCard";
import StatsSkeleton from "../../components/common/Skelton/StatsSkeleton";

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
