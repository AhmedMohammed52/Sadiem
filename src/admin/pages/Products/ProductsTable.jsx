import { useEffect, useState } from "react";

import { Star, Pencil, Trash2, Package, Copy } from "lucide-react";

import { ProductStatus, StockStatus } from "./ProductStatus";

import TableHead from "../../components/tables/TableHead";
import TableFooter from "../../components/tables/TableFooter";
import TableEmptyState from "../../components/tables/TableEmptyState";

const PAGE_SIZE = 10;

// =========================
// PRODUCT IMAGE
// =========================

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

// =========================
// PRODUCTS TABLE
// =========================

export default function ProductsTable({
  products = [],
  updatingProducts = {},
  onToggleFeatured,
  onToggleStock,
  onTogglePublished,
  onEdit,
  onDuplicate,
  onDelete,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / PAGE_SIZE);

  // Keep current page when product data changes.
  // Only correct it when the current page no longer exists.
  useEffect(() => {
    if (currentPage > Math.max(totalPages, 1)) {
      setCurrentPage(Math.max(totalPages, 1));
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
                {paginatedProducts.map((product) => {
                  // Independent loading state for each operation
                  const isStockUpdating = Boolean(
                    updatingProducts[`${product.id}:stock`],
                  );

                  const isPublishedUpdating = Boolean(
                    updatingProducts[`${product.id}:published`],
                  );

                  const isFeaturedUpdating = Boolean(
                    updatingProducts[`${product.id}:featured`],
                  );

                  return (
                    <tr
                      key={product.id}
                      className="transition-colors hover:bg-[#FAFAFC]"
                    >
                      {/* PRODUCT */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <ProductImage
                            src={product.image}
                            name={product.name}
                          />

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

                      {/* CATEGORY */}

                      <td className="px-4 py-4 text-xs text-[#777D8A]">
                        {product.categoryName || "غير محدد"}
                      </td>

                      {/* PRICE */}

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

                      {/* STOCK */}

                      <td className="px-4 py-4 text-xs font-semibold text-[#22252D]">
                        {product.stock}
                      </td>

                      {/* AVAILABILITY */}

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          disabled={isStockUpdating}
                          onClick={() => onToggleStock(product)}
                          className={`
                            inline-flex items-center rounded-md
                            transition-all duration-200
                            ${
                              isStockUpdating
                                ? "cursor-wait opacity-50"
                                : "hover:opacity-80"
                            }
                          `}
                          title="تغيير حالة التوفر"
                          aria-label={`تغيير توفر ${product.name}`}
                          aria-busy={isStockUpdating}
                        >
                          <StockStatus stock={product.stock} />
                        </button>
                      </td>

                      {/* PUBLISH STATUS */}

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          disabled={isPublishedUpdating}
                          onClick={() => onTogglePublished(product)}
                          className={`
                            inline-flex items-center rounded-md
                            transition-all duration-200
                            ${
                              isPublishedUpdating
                                ? "cursor-wait opacity-50"
                                : "hover:opacity-80"
                            }
                          `}
                          title="تغيير حالة النشر"
                          aria-label={`تغيير حالة نشر ${product.name}`}
                          aria-busy={isPublishedUpdating}
                        >
                          <ProductStatus isPublished={product.isPublished} />
                        </button>
                      </td>

                      {/* FEATURED */}

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          disabled={isFeaturedUpdating}
                          onClick={() => onToggleFeatured(product)}
                          className={`
                            flex h-9 w-9 items-center justify-center
                            rounded-lg transition-all duration-200
                            disabled:cursor-wait
                            ${
                              product.isFeatured
                                ? "bg-amber-50 text-amber-500"
                                : "bg-gray-50 text-gray-300 hover:bg-amber-50 hover:text-amber-500"
                            }
                            ${isFeaturedUpdating ? "scale-95 opacity-50" : ""}
                          `}
                          title="تغيير حالة المنتج المميز"
                          aria-label={`تغيير تمييز ${product.name}`}
                          aria-busy={isFeaturedUpdating}
                        >
                          <Star
                            size={17}
                            fill={product.isFeatured ? "currentColor" : "none"}
                          />
                        </button>
                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() => onEdit(product)}
                            title="تعديل المنتج"
                            aria-label={`تعديل ${product.name}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-500 transition hover:bg-blue-100"
                          >
                            <Pencil size={15} />
                          </button>

                          {/* DUPLICATE */}

                          <button
                            type="button"
                            onClick={() => onDuplicate(product)}
                            title="نسخ المنتج"
                            aria-label={`نسخ ${product.name}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-500 transition hover:bg-violet-100"
                          >
                            <Copy size={15} />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() => onDelete(product)}
                            title="حذف المنتج"
                            aria-label={`حذف ${product.name}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}

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
