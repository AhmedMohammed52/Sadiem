import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Settings,
  MessageSquareText,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    title: "الرئيسية",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    title: "المنتجات",
    path: "/admin/products",
    icon: Package,
  },
  {
    title: "التصنيفات",
    path: "/admin/categories",
    icon: Tags,
  },
  {
    title: "الطلبات",
    path: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "التقييمات",
    path: "/admin/reviews",
    icon: MessageSquareText,
  },
  {
    title: "إعدادات المتجر",
    path: "/admin/settings",
    icon: Settings,
  },
];
