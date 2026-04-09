import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { attendeeList } from "../data/mockData";
import { postAttendance } from "../lib/api";

const statusOptions = ["Present", "Absent", "Late"];

const classes = ["Class A", "Class B", "Class C", "Department HR", "Department Engineering"];

function MarkAttendancePage() {
  const [selectedGroup, setSelectedGroup] = useState("Class A");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);

  const [statusById, setStatusById] = useState(() =>
    attendeeList.reduce((acc, user) => ({ ...acc, [user.id]: "Absent" }), {})
  );

  const attendanceRows = useMemo(
    () =>
      attendeeList.map((user) => ({
        ...user,
        status: statusById[user.id] || "Absent"
      })),
    [statusById]
  );

  function markAllPresent() {
    setStatusById((previous) => {
      const next = { ...previous };
      attendeeList.forEach((user) => {
        next[user.id] = "Present";
      });
      return next;
    });
  }

  function updateStatus(userId, status) {
    setStatusById((previous) => ({
      ...previous,
      [userId]: status
    }));
  }

  async function handleSubmit() {
    try {
      setSubmitting(true);
      const payload = attendanceRows.map((row) => ({
        user_id: row.id,
        status: row.status,
        date: selectedDate
      }));

      await postAttendance(payload);
      toast.success("Attendance records stored successfully.");
    } catch (error) {
      toast.error(error.message || "Unable to submit attendance.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mark Attendance</h1>
          <p className="text-sm text-slate-500">Record daily status and submit in one action.</p>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:w-auto">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">Department / Class</span>
            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-navy/30 focus:ring-2"
              value={selectedGroup}
              onChange={(event) => setSelectedGroup(event.target.value)}
            >
              {classes.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">Date</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-navy/30 focus:ring-2"
            />
          </label>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Working set: <span className="font-semibold text-slate-900">{selectedGroup}</span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={markAllPresent}
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            Mark All Present
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="max-h-[520px] overflow-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-700">{row.name}</td>
                  <td className="px-4 py-3 text-slate-500">{row.userCode}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {statusOptions.map((statusOption) => {
                        const active = row.status === statusOption;
                        const activeClass =
                          statusOption === "Present"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : statusOption === "Absent"
                              ? "border-rose-500 bg-rose-50 text-rose-700"
                              : "border-amber-500 bg-amber-50 text-amber-700";

                        return (
                          <button
                            key={statusOption}
                            type="button"
                            onClick={() => updateStatus(row.id, statusOption)}
                            className={[
                              "rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                              active ? activeClass : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                            ].join(" ")}
                          >
                            {statusOption}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default MarkAttendancePage;
