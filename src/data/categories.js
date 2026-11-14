import bodyImage from "../assets/1.jfif";
import hairImage from "../assets/2.jfif";
import perfumesImage from "../assets/3.jfif";
import skincareImage from "../assets/4.jfif";

export const CATEGORIES_DATA = [
  {
    id: "perfumes",
    title: "العطور",
    href: "/shop?category=perfumes",
    image: perfumesImage,
  },
  {
    id: "skincare",
    title: "العناية بالبشرة",
    href: "/shop?category=skincare",
    image: skincareImage,
  },
  {
    id: "body",
    title: "العناية بالجسم",
    href: "/shop?category=body",
    image: bodyImage,
  },
  {
    id: "hair",
    title: "العناية بالشعر",
    href: "/shop?category=hair",
    image: hairImage,
  },
];
