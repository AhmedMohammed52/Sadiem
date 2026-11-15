import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ACTIONS } from "../../data/quickActionsConfig";

export default function QuickActions() {
  return (
    <section className="rounded-xl border border-[#E9EBF0] bg-white p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-[#22252D] sm:text-base">
          اختصارات سريعة
        </h2>
      </div>

      <div className="space-y-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              to={action.to}
              className="flex items-center gap-3 rounded-lg border border-[#F0F1F5] p-3 transition hover:border-[#4059E8] hover:bg-[#F8F9FF]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FF] text-[#4059E8]">
                <Icon size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-semibold text-[#22252D]">
                  {action.title}
                </h3>

                <p className="mt-1 text-[10px] text-[#777D8A]">
                  {action.description}
                </p>
              </div>

              <ArrowLeft size={16} className="text-[#A0A5B1]" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
