import { Edit2, Trash2 } from "lucide-react";

export default function CategoryActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={onEdit}
        title="تعديل التصنيف"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#777D8A] transition hover:bg-blue-50 hover:text-[#4059E8]"
      >
        <Edit2 size={15} />
      </button>

      <button
        type="button"
        onClick={onDelete}
        title="حذف التصنيف"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#777D8A] transition hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
