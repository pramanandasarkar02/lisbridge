# Assessment Notes - What I Built & Why

## Approach & Design Decisions
- Used **Next.js App Router** with async route handlers
- Kept all business logic in `lib/devices.ts` 
- Chose **grid cards** over table for better mobile UX and visual appeal
- Used **modals** instead of sidebar panel → works perfectly on all screen sizes
- Prioritized **fast feedback** (optimistic status toggle, toast messages)

## Production Extensions 
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



## What I'd Add With More Time (in order)
1. Recharts line chart in device modal
2. Search bar for devices
3. Dark mode toggle
4. Export test results as CSV
5. Simple login page (hardcoded credentials)
6. Unit tests with Jest

