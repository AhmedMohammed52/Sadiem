import RecentOrders from "./RecentOrders";
import LowStock from "./LowStock";
import QuickActions from "./QuickActions";
import OverviewStats from "./OverviewStats";

import PageHeader from "../../components/common/PageHeader";

export default function Overview() {
  return (
    <div className="space-y-6">
      <PageHeader title="الرئيسية" description="ملخص سريع لحالة متجرك اليوم." />

      <OverviewStats />

      <RecentOrders />

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <LowStock />
        <QuickActions />
      </section>
    </div>
  );
}
