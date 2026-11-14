export function ProductStatus({ isPublished }) {
  return (
    <span
      className={`inline-flex min-w-22.5 justify-center rounded-lg px-2.5 py-1.5 text-xs font-medium ${
        isPublished
          ? "bg-emerald-50 text-emerald-600"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      {isPublished ? "منشور" : "مسودة"}
    </span>
  );
}

export function StockStatus({ stock }) {
  const available = stock > 0;

  return (
    <span
      className={`inline-flex min-w-22.5 justify-center rounded-lg px-2.5 py-1.5 text-xs font-medium ${
        available ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
      }`}
    >
      {available ? "متوفر" : "غير متوفر"}
    </span>
  );
}
