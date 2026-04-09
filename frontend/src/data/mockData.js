export const summaryCards = [
  { title: "Total People", value: 240, change: "+12 this month", key: "total" },
  { title: "Present Today", value: 198, change: "82.5% rate", key: "present" },
  { title: "Absent Today", value: 29, change: "12.1% rate", key: "absent" },
  { title: "Late Arrivals", value: 13, change: "5.4% rate", key: "late" }
];

export const weeklyAttendance = [
  { day: "Mon", present: 188 },
  { day: "Tue", present: 194 },
  { day: "Wed", present: 201 },
  { day: "Thu", present: 197 },
  { day: "Fri", present: 205 },
  { day: "Sat", present: 190 },
  { day: "Sun", present: 198 }
];

export const recentActivity = [
  { id: "EMP-201", name: "Anika Sharma", timestamp: "08:42 AM" },
  { id: "EMP-184", name: "David Miller", timestamp: "08:45 AM" },
  { id: "EMP-156", name: "Riya Verma", timestamp: "08:47 AM" },
  { id: "EMP-219", name: "Ahmed Khan", timestamp: "08:49 AM" },
  { id: "EMP-141", name: "Sophia Lewis", timestamp: "08:52 AM" }
];

const objectIdPrefix = "65f001a1a1a1a1a1a1a1";

function toObjectId(index) {
  return `${objectIdPrefix}${index.toString(16).padStart(2, "0")}`;
}

export const attendeeList = Array.from({ length: 30 }, (_, index) => ({
  id: toObjectId(index + 1),
  userCode: `USR-${String(index + 1).padStart(3, "0")}`,
  name: `Person ${index + 1}`
}));

const percentages = [93, 88, 97, 79, 90];

export const reportUsers = attendeeList.slice(0, 5).map((user, index) => ({
  id: user.id,
  userCode: user.userCode,
  name: user.name,
  attendancePct: percentages[index]
}));

export const sampleProfileHistory = [
  { date: "2026-03-01", status: "Present", checkIn: "08:42", checkOut: "17:35" },
  { date: "2026-03-02", status: "Present", checkIn: "08:46", checkOut: "17:41" },
  { date: "2026-03-03", status: "Late", checkIn: "09:11", checkOut: "17:30" },
  { date: "2026-03-04", status: "Absent", checkIn: "-", checkOut: "-" },
  { date: "2026-03-05", status: "Present", checkIn: "08:40", checkOut: "17:38" },
  { date: "2026-03-06", status: "Present", checkIn: "08:39", checkOut: "17:33" }
];
