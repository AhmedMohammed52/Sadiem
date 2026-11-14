import { Layers3, CheckCircle2, FolderOpen } from "lucide-react";

import StatCard from "../../components/common/StatCard";
import StatsGrid from "../../components/common/StatsGrid";

const STAT_CONFIG = [
  {
    key: "total",
    title: "إجمالي التصنيفات",
    icon: Layers3,
    color: "bg-blue-50 text-blue-600",
  },
  {
    key: "active",
    title: "تصنيفات نشطة",
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "empty",
    title: "تصنيفات بدون منتجات",
    icon: FolderOpen,
    color: "bg-amber-50 text-amber-600",
  },
];

export default function CategoryStats({ categories, getProductCount }) {
  const stats = {
    total: categories.length,
    active: categories.filter((category) => category.isActive).length,
    empty: categories.filter((category) => getProductCount(category.id) === 0)
      .length,
  };

  return (
    <StatsGrid columns={3}>
      {STAT_CONFIG.map((stat) => (
        <StatCard
          key={stat.key}
          title={stat.title}
          value={stats[stat.key]}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </StatsGrid>
  );
}
