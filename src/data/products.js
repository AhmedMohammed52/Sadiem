import Perfume from "../assets/5.jfif";
import Body from "../assets/1.jfif";
import Hair from "../assets/2.jfif";
import Skin from "../assets/6.jfif";

export const PRODUCTS = [
  {
    id: "rose-eau-de-parfum",
    name: "عطر روز",
    slug: "rose-eau-de-parfum",
    category: "perfumes",
    image: Perfume,
    images: [Perfume],
    price: 1850,
    oldPrice: 2300,
    discount: 20,
    description:
      "عطر أنثوي بطابع زهري ناعم يجمع بين الانتعاش والرقة، ليمنحك حضورًا مميزًا في مختلف المناسبات.",
    features: [
      "رائحة زهرية أنيقة",
      "مناسب للاستخدام اليومي والمناسبات",
      "طابع ناعم وجذاب",
      "تصميم أنيق يناسب جميع الأوقات",
    ],
    details: [
      { label: "التصنيف", value: "عطور نسائية" },
      { label: "الحجم", value: "100 مل" },
      { label: "نوع العطر", value: "Eau de Parfum" },
      { label: "طابع الرائحة", value: "زهري ناعم" },
      { label: "الاستخدام", value: "يومي ومناسبات" },
    ],
    ingredients: ["نفحات زهرية", "نفحات فاكهية", "قاعدة عطرية دافئة"],
    isOutOfStock: false,
  },

  {
    id: "golden-body-oil",
    name: "زيت الجسم الذهبي",
    slug: "golden-body-oil",
    category: "body",
    image: Body,
    images: [Body],
    price: 825,
    oldPrice: 1000,
    discount: 18,
    description:
      "زيت عناية بالجسم بملمس ناعم يساعد على ترطيب البشرة ومنحها مظهرًا مشرقًا وملمسًا حريريًا.",
    features: [
      "يساعد على ترطيب البشرة",
      "يمنح البشرة ملمسًا ناعمًا",
      "مناسب لروتين العناية اليومي",
      "يساعد على تحسين مظهر البشرة",
    ],
    details: [
      { label: "التصنيف", value: "العناية بالجسم" },
      { label: "الحجم", value: "200 مل" },
      { label: "نوع المنتج", value: "زيت للجسم" },
      { label: "قوام المنتج", value: "زيتي خفيف" },
      { label: "الاستخدام", value: "للاستخدام الخارجي" },
    ],
    ingredients: ["زيوت نباتية", "مكونات مرطبة", "مستخلصات عطرية"],
    isOutOfStock: false,
  },

  {
    id: "hydrating-serum",
    name: "سيروم الترطيب",
    slug: "hydrating-serum",
    category: "skincare",
    image: Skin,
    images: [Skin],
    price: 975,
    oldPrice: 1200,
    discount: 19,
    description:
      "سيروم للعناية بالبشرة مصمم للمساعدة في تعزيز الترطيب ومنح البشرة مظهرًا أكثر نضارة ونعومة.",
    features: [
      "يساعد على ترطيب البشرة",
      "قوام خفيف وسهل الامتصاص",
      "مناسب لروتين العناية اليومي",
      "يساعد على تحسين مظهر البشرة",
    ],
    details: [
      { label: "التصنيف", value: "العناية بالبشرة" },
      { label: "الحجم", value: "30 مل" },
      { label: "نوع المنتج", value: "سيروم" },
      { label: "قوام المنتج", value: "سائل خفيف" },
      { label: "الاستخدام", value: "للعناية بالوجه" },
    ],
    ingredients: ["مكونات مرطبة", "مستخلصات نباتية", "مكونات للعناية بالبشرة"],
    isOutOfStock: false,
  },

  {
    id: "hair-oil-shampoo-duo",
    name: "ثنائي زيت وشامبو الشعر",
    slug: "hair-oil-shampoo-duo",
    category: "hair",
    image: Hair,
    images: [Hair],
    price: 1150,
    description:
      "مجموعة متكاملة للعناية بالشعر تجمع بين الشامبو وزيت الشعر، لتكون جزءًا من روتين تنظيف وترطيب الشعر.",
    features: [
      "مجموعة مكونة من منتجين",
      "الشامبو لتنظيف الشعر",
      "الزيت للعناية بالشعر",
      "مناسب لروتين العناية بالشعر",
    ],
    details: [
      { label: "التصنيف", value: "العناية بالشعر" },
      { label: "محتويات المجموعة", value: "شامبو + زيت شعر" },
      { label: "نوع المجموعة", value: "مجموعة عناية" },
      { label: "الاستخدام", value: "تنظيف وترطيب الشعر" },
    ],
    ingredients: ["مكونات منظفة للشعر", "زيوت للعناية بالشعر", "مكونات مرطبة"],
    isOutOfStock: false,
  },

  {
    id: "gentle-cleanser",
    name: "غسول الوجه اللطيف",
    slug: "gentle-cleanser",
    category: "skincare",
    image: Skin,
    images: [Skin],
    price: 650,
    oldPrice: 800,
    discount: 19,
    description:
      "غسول لطيف للوجه يساعد على إزالة الشوائب وتنظيف البشرة، مع ترك إحساس بالانتعاش والنظافة.",
    features: [
      "يساعد على تنظيف البشرة",
      "يزيل الشوائب اليومية",
      "قوام لطيف للاستخدام اليومي",
      "يترك البشرة بإحساس منعش",
    ],
    details: [
      { label: "التصنيف", value: "العناية بالبشرة" },
      { label: "الحجم", value: "150 مل" },
      { label: "نوع المنتج", value: "غسول وجه" },
      { label: "قوام المنتج", value: "جل منظف" },
      { label: "الاستخدام", value: "تنظيف الوجه" },
    ],
    ingredients: ["مكونات منظفة", "مكونات مرطبة", "مستخلصات نباتية"],
    isOutOfStock: true,
  },

  {
    id: "silk-hair-mist",
    name: "بخاخ الشعر الحريري",
    slug: "silk-hair-mist",
    category: "hair",
    image: Hair,
    images: [Hair],
    price: 700,
    description:
      "بخاخ خفيف للعناية بالشعر يساعد على منحه مظهرًا أكثر نعومة وانسيابية، مع رائحة لطيفة تدوم.",
    features: [
      "يساعد على تنعيم الشعر",
      "رذاذ خفيف وسهل الاستخدام",
      "يمنح الشعر رائحة لطيفة",
      "مناسب للاستخدام اليومي",
    ],
    details: [
      { label: "التصنيف", value: "العناية بالشعر" },
      { label: "الحجم", value: "100 مل" },
      { label: "نوع المنتج", value: "بخاخ شعر" },
      { label: "القوام", value: "رذاذ خفيف" },
      { label: "الاستخدام", value: "العناية بالشعر" },
    ],
    ingredients: ["مكونات مرطبة", "مكونات عطرية", "مستخلصات للعناية بالشعر"],
    isOutOfStock: false,
  },

  {
    id: "body-lotion-scrub-set",
    name: "مجموعة لوشن ومقشر الجسم",
    slug: "body-lotion-scrub-set",
    category: "body",
    image: Body,
    images: [Body],
    price: 1200,
    oldPrice: 1500,
    discount: 20,
    description:
      "مجموعة للعناية بالجسم تجمع بين تقشير البشرة وترطيبها، لتساعدك على الحصول على روتين عناية متكامل.",
    features: [
      "مجموعة مكونة من منتجين",
      "المقشر للعناية بملمس البشرة",
      "اللوشن للمساعدة على ترطيب الجسم",
      "مناسبة لروتين العناية الأسبوعي واليومي",
    ],
    details: [
      { label: "التصنيف", value: "العناية بالجسم" },
      { label: "محتويات المجموعة", value: "لوشن + مقشر" },
      { label: "نوع المجموعة", value: "مجموعة عناية بالجسم" },
      { label: "الاستخدام", value: "تقشير وترطيب الجسم" },
    ],
    ingredients: ["مكونات مقشرة", "مكونات مرطبة", "مستخلصات نباتية"],
    isOutOfStock: false,
  },

  {
    id: "noir-oud",
    name: "عطر نوار عود",
    slug: "noir-oud",
    category: "perfumes",
    image: Perfume,
    images: [Perfume],
    price: 2400,
    description:
      "عطر بطابع شرقي دافئ يجمع بين عمق العود واللمسات العطرية الغنية، ليمنحك حضورًا قويًا وأنيقًا.",
    features: [
      "طابع شرقي غني",
      "نفحات عود دافئة",
      "مناسب للمناسبات والأوقات الخاصة",
      "رائحة أنيقة ذات طابع مميز",
    ],
    details: [
      { label: "التصنيف", value: "عطور" },
      { label: "الحجم", value: "100 مل" },
      { label: "نوع العطر", value: "Eau de Parfum" },
      { label: "طابع الرائحة", value: "شرقي وخشبي" },
      { label: "الاستخدام", value: "يومي ومناسبات" },
    ],
    ingredients: ["نفحات العود", "نفحات خشبية", "قاعدة عطرية دافئة"],
    isOutOfStock: false,
  },
];
