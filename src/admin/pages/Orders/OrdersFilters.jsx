import {
  FilterBar,
  FilterSearch,
  FilterSelect,
} from "../../components/common/FilterBar";

import { ORDER_STATUSES, PAYMENT_METHODS } from "../../data/order";

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
        options={ORDER_STATUSES}
        className="sm:w-40"
      />

      <FilterSelect
        value={paymentFilter}
        onChange={setPaymentFilter}
        options={PAYMENT_METHODS}
        className="sm:w-44"
      />
    </FilterBar>
  );
}
