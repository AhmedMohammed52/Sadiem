export const createEmptyProduct = () => ({
  name: "",
  slug: "",
  sku: "",
  category: "",
  images: [],
  price: "",
  oldPrice: "",
  description: "",
  features: [],
  details: [],
  ingredients: [],
  stock: "1",
  isFeatured: false,
  isPublished: true,
});

export const createProductPayload = (form) => {
  const price = Number(form.price) || 0;
  const oldPrice = Number(form.oldPrice) || null;
  const stock = Number(form.stock) || 0;

  const hasDiscount = oldPrice && oldPrice > price;

  return {
    name: form.name.trim(),
    slug: form.slug.trim(),
    sku: form.sku.trim(),
    category: form.category,

    images: form.images || [],

    price,
    oldPrice: hasDiscount ? oldPrice : null,

    discount: hasDiscount
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0,

    image: form.images?.[0]?.url || form.images?.[0]?.preview || null,

    description: form.description.trim(),

    features: form.features.map((item) => item.trim()).filter(Boolean),

    details: form.details
      .filter((item) => item.label.trim() && item.value.trim())
      .map((item) => ({
        label: item.label.trim(),
        value: item.value.trim(),
      })),

    ingredients: form.ingredients.map((item) => item.trim()).filter(Boolean),

    stock,
    isOutOfStock: stock === 0,
    isFeatured: form.isFeatured,
    isPublished: form.isPublished,
  };
};
