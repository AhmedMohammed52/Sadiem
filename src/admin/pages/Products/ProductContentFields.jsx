import { useState } from "react";
import { Plus, Trash2, Sparkles, ClipboardPaste } from "lucide-react";
import { DETAIL_TEMPLATES } from "../../data/productDetailTemplates";

const FIELD_STYLES =
  "w-full rounded-lg border border-[#E9EBF0] bg-white px-3 text-sm outline-none transition focus:border-[#4059E8]";

function SectionHeading({ title, description, count }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-sm font-bold text-[#22252D]">{title}</h3>
        {description && (
          <p className="mt-1 text-xs text-[#999EAA]">{description}</p>
        )}
      </div>

      {count !== undefined && (
        <span className="rounded-full bg-[#F3F4F8] px-2.5 py-1 text-[10px] text-[#777D8A]">
          {count}
        </span>
      )}
    </div>
  );
}

function ListEditor({ title, description, items, onChange, placeholder }) {
  const [bulkValue, setBulkValue] = useState("");
  const [showBulkInput, setShowBulkInput] = useState(false);

  const updateItem = (index, value) => {
    onChange(items.map((item, i) => (i === index ? value : item)));
  };

  const addItem = () => {
    onChange([...items, ""]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleBulkAdd = () => {
    const newItems = bulkValue
      .split(/\n/)
      .map((item) => item.trim())
      .filter(Boolean);

    if (!newItems.length) return;

    onChange([...items, ...newItems]);
    setBulkValue("");
    setShowBulkInput(false);
  };

  return (
    <section className="space-y-3">
      <SectionHeading
        title={title}
        description={description}
        count={items.filter((item) => item.trim()).length}
      />

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
              className={`${FIELD_STYLES} h-10`}
            />

            <button
              type="button"
              onClick={() => removeItem(index)}
              aria-label="حذف العنصر"
              className="flex size-10 shrink-0 items-center justify-center rounded-lg text-[#A0A5B1] transition hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {showBulkInput && (
        <div className="space-y-2 rounded-xl border border-[#E9EBF0] bg-[#FAFAFC] p-3">
          <p className="text-xs font-semibold text-[#555B68]">
            الصق كل عنصر في سطر منفصل
          </p>

          <textarea
            value={bulkValue}
            onChange={(e) => setBulkValue(e.target.value)}
            rows={4}
            placeholder={
              "مثال:\nترطيب عميق\nرائحة منعشة\nمناسب للاستخدام اليومي"
            }
            className={`${FIELD_STYLES} resize-y py-3`}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowBulkInput(false);
                setBulkValue("");
              }}
              className="rounded-lg px-3 py-2 text-xs text-[#777D8A] hover:bg-white"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handleBulkAdd}
              className="rounded-lg bg-[#4059E8] px-3 py-2 text-xs font-semibold text-white hover:bg-[#3048D5]"
            >
              إضافة العناصر
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={addItem}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E9EBF0] px-3 text-xs font-semibold text-[#555B68] transition hover:border-[#4059E8] hover:text-[#4059E8]"
        >
          <Plus size={14} />
          إضافة عنصر
        </button>

        <button
          type="button"
          onClick={() => setShowBulkInput((prev) => !prev)}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E9EBF0] px-3 text-xs font-semibold text-[#555B68] transition hover:border-[#4059E8] hover:text-[#4059E8]"
        >
          <ClipboardPaste size={14} />
          إضافة عدة عناصر
        </button>
      </div>
    </section>
  );
}

function DetailsEditor({ category, details, onChange }) {
  const templates = DETAIL_TEMPLATES[category] || [];

  const addDetail = () => {
    onChange([...details, { label: "", value: "" }]);
  };

  const updateDetail = (index, field, value) => {
    onChange(
      details.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const removeDetail = (index) => {
    onChange(details.filter((_, i) => i !== index));
  };

  const addTemplate = () => {
    const existingLabels = new Set(
      details.map((item) => item.label.trim()).filter(Boolean),
    );

    const missingDetails = templates.filter(
      (item) => !existingLabels.has(item.label),
    );

    if (missingDetails.length) {
      onChange([...details, ...missingDetails]);
    }
  };

  return (
    <section className="space-y-3">
      <SectionHeading
        title="تفاصيل المنتج"
        description="مثل الحجم والتركيز ونوع البشرة وغيرها"
        count={
          details.filter((item) => item.label.trim() && item.value.trim())
            .length
        }
      />

      {templates.length > 0 && (
        <button
          type="button"
          onClick={addTemplate}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#AEB9F5] bg-[#F7F8FF] px-3 py-3 text-xs font-semibold text-[#4059E8] transition hover:bg-[#EEF0FF]"
        >
          <Sparkles size={15} />
          إضافة التفاصيل المقترحة لهذا التصنيف
        </button>
      )}

      <div className="space-y-3">
        {details.map((detail, index) => {
          const isUsageInstructions = detail.label.trim() === "طريقة الاستخدام";

          return (
            <div
              key={index}
              className="rounded-xl border border-[#E9EBF0] bg-[#FAFAFC] p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#999EAA]">
                  خاصية {index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => removeDetail(index)}
                  aria-label="حذف الخاصية"
                  className="text-[#A0A5B1] transition hover:text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {isUsageInstructions ? (
                <div className="space-y-2">
                  <input
                    value={detail.label}
                    onChange={(e) =>
                      updateDetail(index, "label", e.target.value)
                    }
                    placeholder="اسم الخاصية"
                    className={`${FIELD_STYLES} h-10 w-full`}
                  />

                  <textarea
                    value={detail.value}
                    onChange={(e) =>
                      updateDetail(index, "value", e.target.value)
                    }
                    placeholder="اكتب طريقة الاستخدام، وكل خطوة في سطر منفصل..."
                    rows={5}
                    dir="auto"
                    className={`${FIELD_STYLES} min-h-30 w-full resize-y py-3 leading-7`}
                  />

                  <p className="text-[11px] leading-5 text-[#999EAA]">
                    يمكنك كتابة كل خطوة في سطر منفصل، وسيتم الاحتفاظ بتنسيق
                    الأسطر عند حفظ المنتج.
                  </p>
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    value={detail.label}
                    onChange={(e) =>
                      updateDetail(index, "label", e.target.value)
                    }
                    placeholder="اسم الخاصية"
                    className={`${FIELD_STYLES} h-10`}
                  />

                  <input
                    value={detail.value}
                    onChange={(e) =>
                      updateDetail(index, "value", e.target.value)
                    }
                    placeholder="القيمة"
                    className={`${FIELD_STYLES} h-10`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addDetail}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E9EBF0] px-3 text-xs font-semibold text-[#555B68] transition hover:border-[#4059E8] hover:text-[#4059E8]"
      >
        <Plus size={14} />
        إضافة خاصية
      </button>
    </section>
  );
}

export default function ProductContentFields({ form, updateField }) {
  return (
    <div className="space-y-7">
      {/* Description */}
      <section className="space-y-3">
        <SectionHeading
          title="وصف المنتج"
          description="اكتب وصفًا واضحًا يساعد العميل على فهم المنتج"
        />

        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={5}
          placeholder="اكتب وصف المنتج هنا..."
          className={`${FIELD_STYLES} resize-y py-3 leading-7`}
        />
      </section>

      <div className="border-t border-[#F0F1F5]" />

      {/* Features */}
      <ListEditor
        title="مميزات المنتج"
        description="أبرز الفوائد والمميزات التي يحصل عليها العميل"
        items={form.features}
        onChange={(value) => updateField("features", value)}
        placeholder="مثال: يمنح البشرة ترطيبًا عميقًا"
      />

      <div className="border-t border-[#F0F1F5]" />

      {/* Ingredients */}
      <ListEditor
        title="المكونات"
        description="أضف المكونات، كل مكون في عنصر منفصل"
        items={form.ingredients}
        onChange={(value) => updateField("ingredients", value)}
        placeholder="مثال: زيت الأرغان"
      />

      <div className="border-t border-[#F0F1F5]" />

      {/* Details */}
      <DetailsEditor
        category={form.category}
        details={form.details}
        onChange={(value) => updateField("details", value)}
      />
    </div>
  );
}
