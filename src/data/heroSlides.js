import catPerfumes from "../assets/3.jfif";
import catSkincare from "../assets/4.jfif";
import catBody from "../assets/1.jfif";
import catHair from "../assets/2.jfif";

export const SLIDES_DATA = [
  {
    id: "perfumes",
    subtitle: "عطور سديم",
    title: "عطرك.. توقيعك الخاص",
    description: "اكتشفي عطورًا تعبّر عن شخصيتك وتبقى في الذاكرة.",
    buttonText: "تسوقي الآن",
    link: "/shop?category=perfumes",
    image: catPerfumes,
    alt: "مجموعة عطور سديم",
    objectPosition: "lg:object-[20%_center]",
  },
  {
    id: "skincare",
    subtitle: "العناية بالبشرة",
    title: "بشرة مشرقة تفيض بالنضارة",
    description: "منتجات مخصصة لترطيب وتغذية بشرتك بأعلى جودة.",
    buttonText: "اكتشفي المجموعة",
    link: "/shop?category=skincare",
    image: catSkincare,
    alt: "مجموعة العناية بالبشرة",
    objectPosition: "lg:object-[18%_center]",
  },
  {
    id: "body",
    subtitle: "العناية بالجسم",
    title: "نعومة ودلال يستحقه جسمك",
    description: "روتين متكامل لعناية فائقة وترطيب يدوم طوال اليوم.",
    buttonText: "تسوقي المجموعة",
    link: "/shop?category=body",
    image: catBody,
    alt: "مجموعة العناية بالجسم",
    objectPosition: "lg:object-[22%_center]",
  },
  {
    id: "hair",
    subtitle: "العناية بالشعر",
    title: "شعر قوي، حيوي، ولامع",
    description: "زيوت ومستحضرات طبيعية تمنح شعرك الكثافة واللمعان.",
    buttonText: "تسوقي الآن",
    link: "/shop?category=hair",
    image: catHair,
    alt: "مجموعة العناية بالشعر",
    objectPosition: "lg:object-[16%_center]",
  },
];
