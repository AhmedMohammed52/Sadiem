import { Clock3, CheckCircle2, Truck, XCircle, Package } from "lucide-react";

export const ORDER_STATUSES = {
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
