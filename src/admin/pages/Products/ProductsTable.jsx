import { useEffect, useState } from "react";
import { Star, Pencil, Trash2, Package, Copy } from "lucide-react";

import { ProductStatus, StockStatus } from "./ProductStatus";

import TableHead from "../../components/tables/TableHead";
import TableFooter from "../../components/tables/TableFooter";
import TableEmptyState from "../../components/tables/TableEmptyState";

const PAGE_SIZE = 10;

function ProductImage({ src, name }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F5F6FA]">
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <Package size={21} className="text-[#A0A5B1]" />
      )}
    </div>
  );
}

export default function ProductsTable({
  products = [],
  onToggleFeatured,
  onToggleStock,
  onTogglePublished,
  onEdit,
  onDuplicate,
  onDelete,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedProducts = products.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="overflow-hidden rounded-xl border border-[#E9EBF0] bg-white">
      {products.length === 0 ? (
        <TableEmptyState
          icon={Package}
          title="مفيش منتجات مطابقة"
          description="جرب تغير كلمة البحث أو الفلاتر."
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-237.5 text-right">
              <TableHead
                columns={[
                  { label: "المنتج" },
                  { label: "التصنيف" },
                  { label: "السعر" },
                  { label: "المخزون" },
                  { label: "التوفر" },
                  { label: "النشر" },
                  { label: "منتج مميز" },
                  { label: "إجراءات", align: "center" },
                ]}
              />

              <tbody className="divide-y divide-[#F0F1F5]">
                {paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-[#FAFAFC]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <ProductImage src={product.image} name={product.name} />

                        <div className="min-w-0">
                          <p className="max-w-52 truncate text-xs font-semibold text-[#22252D]">
                            {product.name}
                          </p>

                          <p className="mt-1 text-[10px] text-[#A0A5B1]">
                            {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-xs text-[#777D8A]">
                      {product.categoryName || "غير محدد"}
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-xs font-semibold text-[#22252D]">
                        {product.price.toLocaleString("en-US")} ج.م
                      </p>

                      {product.oldPrice && (
                        <p className="mt-1 text-[10px] text-[#A0A5B1] line-through">
                          {product.oldPrice.toLocaleString("en-US")} ج.م
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-4 text-xs font-semibold text-[#22252D]">
                      {product.stock}
                    </td>

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => onToggleStock(product)}
                        className="cursor-pointer"
                        title="تغيير حالة التوفر"
                        aria-label={`تغيير توفر ${product.name}`}
                      >
                        <StockStatus stock={product.stock} />
                      </button>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => onTogglePublished(product)}
                        className="cursor-pointer"
                        title="تغيير حالة النشر"
                        aria-label={`تغيير حالة نشر ${product.name}`}
                      >
                        <ProductStatus isPublished={product.isPublished} />
                      </button>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => onToggleFeatured(product)}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                          product.isFeatured
                            ? "bg-amber-50 text-amber-500"
                            : "bg-gray-50 text-gray-300 hover:bg-amber-50 hover:text-amber-500"
                        }`}
                        title="تغيير حالة المنتج المميز"
                        aria-label={`تغيير تمييز ${product.name}`}
                      >
                        <Star
                          size={17}
                          fill={product.isFeatured ? "currentColor" : "none"}
                        />
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* تعديل */}
                        <button
                          type="button"
                          onClick={() => onEdit(product)}
                          title="تعديل المنتج"
                          aria-label={`تعديل ${product.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-500 transition hover:bg-blue-100"
                        >
                          <Pencil size={15} />
                        </button>

                        {/* نسخ */}
                        <button
                          type="button"
                          onClick={() => onDuplicate(product)}
                          title="نسخ المنتج"
                          aria-label={`نسخ ${product.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-500 transition hover:bg-violet-100"
                        >
                          <Copy size={15} />
                        </button>

                        {/* حذف */}
                        <button
                          type="button"
                          onClick={() => onDelete(product)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100"
                          title="حذف المنتج"
                          aria-label={`حذف ${product.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <TableFooter
            totalItems={products.length}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
