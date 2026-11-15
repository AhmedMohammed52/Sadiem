import StatCard from "../../components/common/StatCard";
import StatsGrid from "../../components/common/StatsGrid";

import { REVIEWS_CARDS } from "../../data/reviews";

export default function ReviewsStats({ stats }) {
  return (
    <StatsGrid columns={4}>
      {REVIEWS_CARDS.map((card) => (
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
