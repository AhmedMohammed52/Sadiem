import { useEffect, useState } from "react";
import { Folder, Package, FolderOpen } from "lucide-react";

import CategoryStatus from "./CategoryStatus";
import CategoryActions from "./CategoryActions";

import TableHead from "../../components/tables/TableHead";
import TableFooter from "../../components/tables/TableFooter";
import TableEmptyState from "../../components/tables/TableEmptyState";

const PAGE_SIZE = 10;

export default function CategoriesTable({
  categories = [],
  getProductCount = () => 0,
  onEdit = () => {},
  onDelete = () => {},
  onToggleStatus = () => {},
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(categories.length / PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [categories]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedCategories = categories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="overflow-hidden rounded-xl border border-[#E9EBF0] bg-white">
      {categories.length === 0 ? (
        <TableEmptyState
          icon={FolderOpen}
          title="لا توجد تصنيفات"
          description="لم يتم العثور على تصنيفات مطابقة لبحثك أو الفلاتر المحددة."
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-212.5 text-right">
              <TableHead
                columns={[
                  { label: "التصنيف" },
                  { label: "الرابط" },
                  { label: "المنتجات" },
                  { label: "الحالة" },
                  { label: "تاريخ الإضافة" },
                  { label: "الإجراءات", align: "center" },
                ]}
              />

              <tbody className="divide-y divide-[#F0F1F5]">
                {paginatedCategories.map((category) => {
                  const productsCount = getProductCount(category.id);

                  return (
                    <tr
                      key={category.id}
                      className="transition-colors hover:bg-[#FAFAFC]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#F0F1F5] bg-[#F5F6FA]">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Folder size={22} className="text-pink-500" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-[#22252D]">
                              {category.name}
                            </p>

                            <p className="mt-1 max-w-62.5 truncate text-xs text-[#A0A5B1]">
                              {category.description || "لا يوجد وصف"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-md bg-[#F5F6FA] px-2.5 py-1.5 text-xs text-[#777D8A]">
                          {category.slug}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-[#A0A5B1]" />

                          <span className="text-sm font-semibold text-[#22252D]">
                            {productsCount}
                          </span>

                          <span className="text-xs text-[#A0A5B1]">منتج</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <CategoryStatus
                          isActive={category.isActive}
                          onClick={() => onToggleStatus(category.id)}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs text-[#777D8A]">
                          {category.createdAt
                            ? new Date(category.createdAt).toLocaleDateString(
                                "ar-EG",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center">
                          <CategoryActions
                            onEdit={() => onEdit(category)}
                            onDelete={() => onDelete(category)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <TableFooter
            totalItems={categories.length}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
