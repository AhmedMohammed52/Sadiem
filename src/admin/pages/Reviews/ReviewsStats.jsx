import { MessageSquare, Star, Clock, CheckCircle2 } from "lucide-react";

import StatCard from "../../components/common/StatCard";
import StatsGrid from "../../components/common/StatsGrid";

const cards = [
  {
    key: "total",
    title: "إجمالي التقييمات",
    icon: MessageSquare,
    color: "bg-blue-50 text-blue-600",
  },
  {
    key: "average",
    title: "متوسط التقييم",
    icon: Star,
    color: "bg-amber-50 text-amber-500",
    suffix: "/ 5",
  },
  {
    key: "pending",
    title: "بانتظار المراجعة",
    icon: Clock,
    color: "bg-orange-50 text-orange-600",
  },
  {
    key: "approved",
    title: "التقييمات المنشورة",
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-600",
  },
];

export default function ReviewsStats({ stats }) {
  return (
    <StatsGrid columns={4}>
      {cards.map((card) => (
        <StatCard
          key={card.key}
          title={card.title}
          value={stats[card.key]}
          icon={card.icon}
          color={card.color}
          suffix={card.suffix}
        />
      ))}
    </StatsGrid>
  );
}
