const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || "API request failed";
    throw new Error(message);
  }

  return response.json();
}

export function postAttendance(records) {
  return request("/attendance", {
    method: "POST",
    body: JSON.stringify({ records })
  });
}

export function getAttendanceHistory(userId) {
  return request(`/attendance/${userId}`);
}

