
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
Beautiful, responsive dashboard at `/dashboard/devices`:

- Device grid with status badges (green/red)
- Filter by All / Online / Offline
- Add new device modal with **React Hook Form + Zod** validation
- Click device → full-screen modal with device info + recent test results table
- Loading states, success/error toasts
- Toggle device status directly from card
- Polished UI with Tailwind CSS + Lucide icons


### Bonus Points NOT Implemented (Due to Time)
| Feature                              | Status   | Reason |
|--------------------------------------|--------|-------|
| Chart showing test results over time | Not done    | Would use Recharts / Chart.js (~45 mins) |
| Basic authentication                 | Not done    | Simple middleware possible (~20 mins) |
| Secure device-to-server explanation  | Not done    | Included in NOTES.md instead |
| Live deployment                      | Done if you deploy | Just needs `vercel --prod` |

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
```

### `NOTES.md`

```markdown
# Assessment Notes - What I Built & Why

## Approach & Design Decisions
- Used **Next.js App Router** (modern standard) with async route handlers
- Kept all business logic in `lib/devices.ts` → easy to swap for DB later
- Chose **grid cards** over table for better mobile UX and visual appeal
- Used **modals** instead of sidebar panel → works perfectly on all screen sizes
- Prioritized **fast feedback** (optimistic status toggle, toast messages)

## Production Extensions (Next Steps)
1. Replace in-memory array with **PostgreSQL + Prisma**
2. Add **JWT auth + role-based access** (admin vs technician)
3. Real-time updates via **WebSocket / Server-Sent Events**
4. Device authentication using **API keys or mutual TLS**
5. Audit logging for status changes
6. Rate limiting + input sanitization

## Security: Device-to-Server Communication
In production, lab devices should **never use plain HTTP**.

Recommended approach:
- Mutual TLS (mTLS): Device presents client certificate, server verifies it
- Or: Device sends JWT signed with private key (embedded in firmware)
- All traffic over HTTPS with HSTS
- API keys rotated regularly + IP whitelisting
- Rate limiting per device to prevent DoS

## Challenges Faced
- Next.js 14+ made `params` a Promise → had to `await params` in dynamic routes (fixed!)
- Balancing feature completeness vs polish in limited time

## What I'd Add With More Time (in order)
1. Recharts line chart in device modal
2. Search bar for devices
3. Dark mode toggle
4. Export test results as CSV
5. Simple login page (hardcoded credentials)
6. Unit tests with Jest

