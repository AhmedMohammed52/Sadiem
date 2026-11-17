import heroPerfumes from "../assets/hero-product.png";
import heroSkincare from "../assets/hero-skincare.png";
import heroBody from "../assets/hero-body.png";
import heroHair from "../assets/hero-hair.png";

export const SLIDES_DATA = [
  {
    id: "perfumes",
    subtitle: "عطور سديم",
    title: "لأن حضورك يبدأ من عطرك",
    description: "عطور مختارة بعناية، تترك انطباعًا لا يُنسى.",
    buttonText: "اكتشفي العطور",
    link: "/shop?category=perfumes",
    desktopImage: heroPerfumes,
    alt: "تشكيلة عطور سديم",
  },
  {
    id: "skincare",
    subtitle: "العناية بالبشرة",
    title: "امنحي بشرتك عناية تستحقها",
    description: "ترطيب وعناية لبشرة أكثر نضارة.",
    buttonText: "اكتشفي المجموعة",
    link: "/shop?category=skincare",
    desktopImage: heroSkincare,
    alt: "مجموعة منتجات العناية بالبشرة",
  },
  {
    id: "body",
    subtitle: "العناية بالجسم",
    title: "عناية تُلامس نعومتك",
    description: "روتين غني بالترطيب لنعومة تدوم.",
    buttonText: "اكتشفي المجموعة",
    link: "/shop?category=body",
    desktopImage: heroBody,
    alt: "مجموعة منتجات العناية بالجسم",
  },
  {
    id: "hair",
    subtitle: "العناية بالشعر",
    title: "لشعر يتحدث عن جمالك",
    description: "زيوت ومستحضرات تمنح شعرك حيوية ولمعانًا.",
    buttonText: "اكتشفي المجموعة",
    link: "/shop?category=hair",
    desktopImage: heroHair,
    alt: "مجموعة منتجات العناية بالشعر",
  },
];
