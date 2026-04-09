import { HiChartBar, HiClipboardDocumentCheck, HiCog6Tooth, HiHomeModern, HiUserCircle } from "react-icons/hi2";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: HiHomeModern },
  { label: "Mark Attendance", to: "/mark-attendance", icon: HiClipboardDocumentCheck },
  { label: "Reports", to: "/reports", icon: HiChartBar },
  { label: "Settings", to: "/settings", icon: HiCog6Tooth }
];

const todayText = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
});

function linkClass(isActive) {
  return [
    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
    isActive ? "bg-slate-700 text-white" : "text-slate-200 hover:bg-slate-700/70 hover:text-white"
  ].join(" ");
}

function MainLayout() {
  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col bg-navy p-6 md:flex">
        <div className="mb-10">
          <h1 className="text-xl font-bold text-white">Attendance Hub</h1>
          <p className="mt-1 text-sm text-slate-300">Management System</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => linkClass(isActive)}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="pb-24 md:pb-0 md:pl-72">
        <header className="fixed left-0 right-0 top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur md:left-72">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Today</p>
              <h2 className="text-base font-semibold text-slate-800">{todayText}</h2>
            </div>

            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
              <HiUserCircle className="h-8 w-8 text-slate-600" />
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">Admin User</p>
                <p className="text-xs text-slate-500">System Manager</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 pb-6 pt-24 sm:px-6">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white p-2 md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "flex flex-1 flex-col items-center gap-1 rounded-lg py-2 text-xs font-medium",
                isActive ? "bg-slate-100 text-slate-900" : "text-slate-500"
              ].join(" ")
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label.split(" ")[0]}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default MainLayout;

