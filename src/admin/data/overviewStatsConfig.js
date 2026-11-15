import {
  ShoppingBag,
  ClipboardList,
  Package,
  AlertTriangle,
} from "lucide-react";

export const STAT_CONFIG = [
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
