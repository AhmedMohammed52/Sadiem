import StatCard from "../../components/common/StatCard";
import StatsGrid from "../../components/common/StatsGrid";
import { ORDERS_STATS_CONFIG } from "../../data/order";

export default function OrdersStats({ orders }) {
  return (
    <StatsGrid columns={4}>
      {ORDERS_STATS_CONFIG.map((stat) => {
        const count =
          stat.key === "all"
            ? orders.length
            : orders.filter((order) => order.status === stat.key).length;

        return (
          <StatCard
            key={stat.key}
            title={stat.title}
            value={count}
            icon={stat.icon}
            color={stat.color}
          />
        );
      })}
    </StatsGrid>
  );
}
