import { Layers3, CheckCircle2, FolderOpen } from "lucide-react";

export const STAT_CONFIG = [
  {
    key: "total",
    title: "إجمالي التصنيفات",
    icon: Layers3,
    color: "bg-blue-50 text-blue-600",
  },
  {
    key: "active",
    title: "تصنيفات نشطة",
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "empty",
    title: "تصنيفات بدون منتجات",
    icon: FolderOpen,
    color: "bg-amber-50 text-amber-600",
  },
];
