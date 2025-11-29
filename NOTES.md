# Assessment Notes - LISBridge Technical Task

## Approach & Design Decisions
- Built with **Next.js 14+ App Router** using fully async route handlers (`await params`) – the current best practice.
- All business logic and mock data generation centralized in `lib/devices.ts` → makes it trivial to swap in-memory store for a real database later.
- Chose **responsive grid cards** instead of a traditional table for the device list → much better mobile experience and more visually engaging.
- Used **full-screen modals** for both Add Device and Device Details → works perfectly on all screen sizes without layout shift issues.
- Implemented **optimistic status updates** when toggling online/offline for instant UI feedback.
- Added success/error toast-style messages and proper loading states throughout.
- Integrated **Recharts** to display a clean line chart of test values over time inside the device modal (bonus completed).
- Landing page (`/`) with a polished hero section and “Open Dashboard” button for a professional first impression.

## Production Extensions (How I’d Scale This)
1. Replace in-memory array with **PostgreSQL + Prisma ORM**
2. Add **JWT-based authentication + role system** (admin / technician / viewer)
3. Real-time device status & test results using **WebSocket** or **Server-Sent Events**
4. Device authentication via **mutual TLS (mTLS)** or **signed JWTs** (private key in firmware)
5. Full audit trail of status changes and test result ingestion
6. Rate limiting, request validation, and input sanitization middleware
7. Monitoring & alerting (e.g., Sentry, Prometheus)

## Security: Device-to-Server Communication
Lab instruments must never communicate over plain HTTP.

Production-grade recommendations:
- Enforce **HTTPS with HSTS**
- **Mutual TLS**: each device presents a client certificate; server validates it against a trusted CA
- Alternative: device signs JWT with an embedded private key (ECDSA) → server verifies signature
- API keys per device with automatic rotation + IP allow-listing
- Rate limiting per device ID to prevent abuse or DoS

## Challenges Faced

- Balancing completeness vs polish within the 3–4 hour limit – prioritized clean code, UX, and the chart bonus over authentication.
- Mock data contains mixed test types; chart currently shows the most recent series (acceptable for demo; in production would group by `testType`).

## What I’d Add With More Time (in priority order)
1. Search & filter bar for devices (by name/ID/type) 
2. Dark mode toggle 
3. Export test results as CSV 
4. Simple login page with hardcoded credentials or NextAuth.js 
5. Unit & integration tests with Jest + React Testing Library 
6. Pagination or infinite scroll for hundreds of devices 
7. Device heartbeat endpoint with auto-offline after timeout
