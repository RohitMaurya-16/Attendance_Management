import { HiArrowTrendingUp, HiCalendarDateRange, HiCheckCircle, HiUserGroup, HiXCircle } from "react-icons/hi2";

const iconMap = {
  total: HiUserGroup,
  present: HiCheckCircle,
  absent: HiXCircle,
  late: HiCalendarDateRange
};

const colorMap = {
  total: "text-blue-700 bg-blue-50",
  present: "text-emerald-700 bg-emerald-50",
  absent: "text-rose-700 bg-rose-50",
  late: "text-amber-700 bg-amber-50"
};

function SummaryCard({ card }) {
  const Icon = iconMap[card.key] || HiArrowTrendingUp;
  const colorClass = colorMap[card.key] || "text-slate-700 bg-slate-100";

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{card.title}</p>
        <span className={`rounded-xl p-2 ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>

      <h3 className="text-3xl font-bold text-slate-900">{card.value}</h3>
      <p className="mt-2 text-xs text-slate-500">{card.change}</p>
    </article>
  );
}

export default SummaryCard;

