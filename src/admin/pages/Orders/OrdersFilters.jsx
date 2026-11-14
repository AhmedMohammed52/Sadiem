import {
  FilterBar,
  FilterSearch,
  FilterSelect,
} from "../../components/common/FilterBar";

const statuses = [
  { value: "all", label: "كل الحالات" },
  { value: "new", label: "جديد" },
  { value: "processing", label: "قيد التجهيز" },
  { value: "shipped", label: "تم الشحن" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
];

const payments = [
  { value: "all", label: "كل طرق الدفع" },
  { value: "cod", label: "الدفع عند الاستلام" },
  { value: "vodafone", label: "فودافون كاش" },
  { value: "instapay", label: "إنستاباي" },
];

export default function OrdersFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  paymentFilter,
  setPaymentFilter,
}) {
  const hasFilters =
    search.trim() !== "" || statusFilter !== "all" || paymentFilter !== "all";

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentFilter("all");
  };

  return (
    <FilterBar hasFilters={hasFilters} onReset={resetFilters}>
      <FilterSearch
        value={search}
        onChange={setSearch}
        placeholder="ابحث برقم الطلب أو اسم العميل أو الهاتف..."
      />

      <FilterSelect
        value={statusFilter}
        onChange={setStatusFilter}
        options={statuses}
        className="sm:w-40"
      />

      <FilterSelect
        value={paymentFilter}
        onChange={setPaymentFilter}
        options={payments}
        className="sm:w-44"
      />
    </FilterBar>
  );
}
