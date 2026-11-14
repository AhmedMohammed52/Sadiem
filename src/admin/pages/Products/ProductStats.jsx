import { Package, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

import StatCard from "../../components/common/StatCard";
import StatsGrid from "../../components/common/StatsGrid";

export default function ProductStats({ products }) {
  const stats = [
    {
      title: "إجمالي المنتجات",
      value: products.length,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "منتجات منشورة",
      value: products.filter((p) => p.isPublished).length,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "غير متوفرة",
      value: products.filter((p) => p.stock === 0).length,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
    {
      title: "مخزون منخفض",
      value: products.filter((p) => p.stock > 0 && p.stock <= 5).length,
      icon: AlertTriangle,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <StatsGrid columns={4}>
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </StatsGrid>
  );
}
