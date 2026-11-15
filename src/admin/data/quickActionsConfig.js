import { ShoppingBag, Package, Plus } from "lucide-react";

export const ACTIONS = [
  {
    title: "إضافة منتج جديد",
    description: "أضف منتجًا إلى المتجر",
    icon: Plus,
    to: "/admin/products",
  },
  {
    title: "متابعة الطلبات",
    description: "راجع الطلبات وحالاتها",
    icon: ShoppingBag,
    to: "/admin/orders",
  },
  {
    title: "إدارة التصنيفات",
    description: "نظم أقسام ومنتجات المتجر",
    icon: Package,
    to: "/admin/categories",
  },
];
