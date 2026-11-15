import {
  ShoppingBag,
  Clock3,
  PackageCheck,
  CheckCircle2,
  Truck,
  XCircle,
  Package,
} from "lucide-react";

// Statistics
export const ORDERS_STATS_CONFIG = [
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

// Filter Options
export const ORDER_STATUSES = [
  { value: "all", label: "كل الحالات" },
  { value: "new", label: "جديد" },
  { value: "processing", label: "قيد التجهيز" },
  { value: "shipped", label: "تم الشحن" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
];

export const PAYMENT_METHODS = [
  { value: "all", label: "كل طرق الدفع" },
  { value: "cod", label: "الدفع عند الاستلام" },
  { value: "vodafone", label: "فودافون كاش" },
  { value: "instapay", label: "إنستاباي" },
];

// Status Badge Configuration
export const ORDER_STATUS_CONFIG = {
  new: {
    label: "طلب جديد",
    className: "bg-blue-50 text-blue-600",
    dot: "bg-blue-500",
  },
  processing: {
    label: "قيد التجهيز",
    className: "bg-orange-50 text-orange-600",
    dot: "bg-orange-500",
  },
  shipped: {
    label: "تم الشحن",
    className: "bg-violet-50 text-violet-600",
    dot: "bg-violet-500",
  },
  completed: {
    label: "مكتمل",
    className: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "ملغي",
    className: "bg-red-50 text-red-600",
    dot: "bg-red-500",
  },
};

// Dashboard Overview Statuses
export const OVERVIEW_ORDER_STATUSES = {
  new: {
    label: "جديد",
    icon: Clock3,
    style: "bg-orange-50 text-orange-600",
  },
  confirmed: {
    label: "تم التأكيد",
    icon: CheckCircle2,
    style: "bg-blue-50 text-blue-600",
  },
  preparing: {
    label: "جاري التجهيز",
    icon: Package,
    style: "bg-amber-50 text-amber-600",
  },
  shipping: {
    label: "قيد الشحن",
    icon: Truck,
    style: "bg-violet-50 text-violet-600",
  },
  delivered: {
    label: "تم التسليم",
    icon: CheckCircle2,
    style: "bg-emerald-50 text-emerald-600",
  },
  cancelled: {
    label: "ملغي",
    icon: XCircle,
    style: "bg-red-50 text-red-600",
  },
};
