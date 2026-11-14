import { ShoppingBag, Clock3, PackageCheck, CheckCircle2 } from "lucide-react";

import StatCard from "../../components/common/StatCard";
import StatsGrid from "../../components/common/StatsGrid";

const statsConfig = [
  {
    title: "إجمالي الطلبات",
    key: "all",
    icon: ShoppingBag,
    color: "bg-pink-50 text-pink-600",
  },
  {
    title: "طلبات جديدة",
    key: "new",
    icon: Clock3,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "قيد التجهيز",
    key: "processing",
    icon: PackageCheck,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "طلبات مكتملة",
    key: "completed",
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-600",
  },
];

export default function OrdersStats({ orders }) {
  return (
    <StatsGrid columns={4}>
      {statsConfig.map((stat) => {
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
