import { Store, Share2, SlidersHorizontal, UserRound,Globe, Camera, Music2, MessageCircle } from "lucide-react";

export const defaultSettings = {
  id: "",
  store: {
    name: "سديم",
    tagline: "",
    description: "",
    phone: "",
    email: "",
    logo: "",
    favicon: "",
  },
  social: {
    facebook: "",
    instagram: "",
    tiktok: "",
    whatsapp: "",
  },
  general: {
    productsPerPage: 12,
    defaultSort: "default",
  },
  account: {
    name: "",
    email: "",
  },
};

export const General_SORT_OPTIONS = [
  { value: "default", label: "الترتيب الافتراضي" },
  { value: "priceAsc", label: "السعر: من الأقل للأعلى" },
  { value: "priceDesc", label: "السعر: من الأعلى للأقل" },
  { value: "nameAsc", label: "الاسم: أبجديًا" },
];

export const SETTINGS_SECTIONS = [
  { id: "store", label: "بيانات المتجر", icon: Store },
  { id: "social", label: "التواصل الاجتماعي", icon: Share2 },
  { id: "general", label: "التحكم في المتجر", icon: SlidersHorizontal },
  { id: "account", label: "حساب المدير", icon: UserRound },
];

export const SOCIALS = [
  {
    id: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/...",
    icon: Globe,
  },
  {
    id: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/...",
    icon: Camera,
  },
  {
    id: "tiktok",
    label: "TikTok",
    placeholder: "https://tiktok.com/@...",
    icon: Music2,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    placeholder: "201xxxxxxxxx أو رابط واتساب",
    icon: MessageCircle,
  },
];