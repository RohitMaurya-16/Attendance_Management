import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import { getAttendanceHistory } from "../lib/api";
import { sampleProfileHistory } from "../data/mockData";

function UserProfilePage() {
  const { userId } = useParams();
  const [records, setRecords] = useState([]);
  const [userName, setUserName] = useState("Selected User");

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const response = await getAttendanceHistory(userId);
        if (!mounted) {
          return;
        }

        const fetched = response.records || [];
        if (fetched.length === 0) {
          setRecords(sampleProfileHistory);
        } else {
          setRecords(
            fetched.map((item) => ({
              date: item.date.slice(0, 10),
              status: item.status,
              checkIn: item.checkIn || "-",
              checkOut: item.checkOut || "-"
            }))
          );
        }
        setUserName(response.user?.name || `User ${userId}`);
      } catch (error) {
        setRecords(sampleProfileHistory);
        setUserName(`User ${userId}`);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const statusByDate = useMemo(() => {
    return records.reduce((acc, item) => {
      acc[item.date] = item.status;
      return acc;
    }, {});
  }, [records]);

  const monthlyPercentage = useMemo(() => {
    if (records.length === 0) {
      return 0;
    }
    const presentCount = records.filter((item) => item.status === "Present").length;
    return Math.round((presentCount / records.length) * 100);
  }, [records]);

  function exportPdf() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Attendance Report - ${userName}`, 14, 18);
    doc.setFontSize(11);
    doc.text(`User ID: ${userId}`, 14, 26);
    doc.text(`Monthly Attendance: ${monthlyPercentage}%`, 14, 32);

    autoTable(doc, {
      head: [["Date", "Status", "Check-in", "Check-out"]],
      body: records.map((item) => [item.date, item.status, item.checkIn, item.checkOut]),
      startY: 38
    });

    doc.save(`${userId}-attendance-report.pdf`);
    toast.success("PDF exported.");
  }

  function tileClassName({ date, view }) {
    if (view !== "month") {
      return "";
    }
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
    const status = statusByDate[key];
    if (status === "Present") {
      return "attendance-present";
    }
    if (status === "Absent") {
      return "attendance-absent";
    }
    return "";
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{userName}</h1>
          <p className="text-sm text-slate-500">
            User ID: {userId} | Monthly Attendance:{" "}
            <span className="font-semibold text-slate-800">{monthlyPercentage}%</span>
          </p>
        </div>
        <button
          onClick={exportPdf}
          className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Export to PDF
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Attendance Calendar</h2>
          <p className="mb-4 text-sm text-slate-500">Green: Present | Red: Absent</p>
          <Calendar tileClassName={tileClassName} />
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Daily Check-In/Out</h2>
          <div className="max-h-[420px] overflow-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Check-In</th>
                  <th className="px-3 py-2">Check-Out</th>
                </tr>
              </thead>
              <tbody>
                {records.map((row) => (
                  <tr key={row.date} className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-600">{row.date}</td>
                    <td className="px-3 py-2">
                      <span
                        className={[
                          "rounded-full px-2 py-1 text-xs font-semibold",
                          row.status === "Present"
                            ? "bg-emerald-100 text-emerald-700"
                            : row.status === "Absent"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-amber-100 text-amber-700"
                        ].join(" ")}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-600">{row.checkIn}</td>
                    <td className="px-3 py-2 text-slate-600">{row.checkOut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}

export default UserProfilePage;
