import { MessageSquare, Star, Clock, CheckCircle2 } from "lucide-react";

export const REVIEWS_CARDS = [
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
