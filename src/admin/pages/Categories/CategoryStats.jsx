import StatCard from "../../components/common/StatCard";
import StatsGrid from "../../components/common/StatsGrid";
import { STAT_CONFIG } from "../../data/categoryStatsConfig";

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
