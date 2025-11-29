
# LISBridge - Device Status Dashboard


Live Demo: https://lisbridge-five.vercel.app/dashboard/devices 

## Features Implemented

### Part 1: Backend API 
All required endpoints with proper validation, TypeScript types, and in-memory storage:

- `POST /api/devices/register` → registers device + generates UUID
- `GET /api/devices` → supports `?status=online|offline` filter
- `PATCH /api/devices/:uuid/status` → toggle online/offline
- `GET /api/devices/:uuid/data` → returns 5–10 realistic mock lab results (Glucose, HbA1c, BP, etc.)

### Part 2: Frontend Dashboard 
dashboard at `/dashboard/devices`:

- Device grid with status badges (green/red)
- Filter by All / Online / Offline
- Add new device modal with **React Hook Form + Zod** validation
- Click device → full-screen modal with device info + recent test results table
- Loading states, success/error toasts
- Toggle device status directly from card
- Polished UI with Tailwind CSS + Lucide icons



## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Lucide React icons
- date-fns
- uuid

## How to Run Locally

```bash
git clone https://github.com/yourusername/lisbridge-dashboard.git
cd lisbridge-dashboard
npm install
npm run dev
```

Open http://localhost:3000 → click "Open Dashboard"

## Project Structure
```
app/
  dashboard/devices/page.tsx     → Main dashboard
  page.tsx                       → Landing page
  api/devices/...                → All API routes
lib/
  devices.ts                     → In-memory store + mock data generator
```

## Assumptions Made
- In-memory storage is acceptable (no persistence needed)
- Device status can be toggled by anyone (no auth)
- Mock data should feel medically realistic (not just random numbers)
- Focus on clean, maintainable, production-like code over extra features

---