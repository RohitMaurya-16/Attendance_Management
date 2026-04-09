# Attendance Management System

This workspace contains a full-stack Attendance Management System:

- `frontend/`: React + Tailwind UI
- `backend/`: Node.js + Express + MongoDB API

## Frontend Features

- Fixed desktop sidebar with:
  - Dashboard
  - Mark Attendance
  - Reports
  - Settings
- Top navbar with current date and user profile
- Dashboard:
  - Hoverable summary cards
  - 7-day attendance trend bar chart (Recharts)
  - Recent check-in table (last 5)
- Mark Attendance:
  - Class/Department dropdown
  - Date picker
  - Status toggles (Present/Absent/Late)
  - Mark all present
  - Submit to backend API with toast notification
- Profile Details:
  - Calendar with status coloring (Present=green, Absent=red)
  - Check-in/check-out history table
  - Export to PDF button

## Backend Features

- MongoDB models:
  - `User`
  - `Attendance` linked with `userId`
- Routes:
  - `POST /api/attendance`
  - `GET /api/attendance/:userId`
- Duplicate prevention:
  - Unique index on `{ userId, date }`
  - Duplicate-date check before insert

## API Payload (POST /api/attendance)

```json
{
  "records": [
    { "user_id": "65f001a1a1a1a1a1a1a101", "status": "Present", "date": "2026-03-23" },
    { "user_id": "65f001a1a1a1a1a1a1a102", "status": "Late", "date": "2026-03-23" }
  ]
}
```

## Run Locally

1. Backend
   - `cd backend`
   - `npm install`
   - Copy `.env.example` to `.env`
   - Set `MONGODB_URI`
   - `npm run dev`

2. Frontend
   - `cd frontend`
   - `npm install`
   - Copy `.env.example` to `.env`
   - `npm run dev`

