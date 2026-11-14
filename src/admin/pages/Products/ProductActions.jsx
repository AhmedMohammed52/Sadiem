import { Pencil, Trash2, Copy } from "lucide-react";

export default function ProductActions({
  product,
  onEdit,
  onDuplicate,
  onDelete,
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onEdit?.(product)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E9EBF0] text-[#4059E8] transition hover:border-[#4059E8] hover:bg-[#EEF0FF]"
        title="تعديل المنتج"
        aria-label={`تعديل ${product.name}`}
      >
        <Pencil size={16} />
      </button>

      <button
        type="button"
        onClick={() => onDuplicate?.(product)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-100 text-violet-500 transition hover:border-violet-300 hover:bg-violet-50"
        title="نسخ المنتج"
        aria-label={`نسخ ${product.name}`}
      >
        <Copy size={16} />
      </button>

      <button
        type="button"
        onClick={() => onDelete(product)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#F5DADA] text-red-500 transition hover:border-red-200 hover:bg-red-50"
        title="حذف المنتج"
        aria-label={`حذف ${product.name}`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
