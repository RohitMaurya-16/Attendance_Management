import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  function onSubmit(event) {
    event.preventDefault();
    navigate("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-card">
        <h1 className="text-2xl font-bold text-slate-800">Attendance Manager</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to continue</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-navy/30 transition focus:ring-2"
              value={formData.username}
              onChange={(event) => setFormData((prev) => ({ ...prev, username: event.target.value }))}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-navy/30 transition focus:ring-2"
              value={formData.password}
              onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
              required
            />
          </div>

          <button className="w-full rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

