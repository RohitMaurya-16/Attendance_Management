import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { reportUsers } from "../data/mockData";

function ReportsPage() {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return reportUsers;
    }
    return reportUsers.filter(
      (item) =>
        item.name.toLowerCase().includes(normalized) || item.userCode.toLowerCase().includes(normalized)
    );
  }, [query]);

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">Open a profile to review attendance history and monthly percentage.</p>

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or ID..."
          className="mt-4 w-full max-w-md rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-navy/30 focus:ring-2"
        />
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Monthly %</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-700">{row.name}</td>
                <td className="px-4 py-3 text-slate-500">{row.userCode}</td>
                <td className="px-4 py-3">
                  <span
                    className={[
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      row.attendancePct >= 90
                        ? "bg-emerald-100 text-emerald-700"
                        : row.attendancePct >= 80
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                    ].join(" ")}
                  >
                    {row.attendancePct}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link to={`/profile/${row.id}`} className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                    Open Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ReportsPage;

