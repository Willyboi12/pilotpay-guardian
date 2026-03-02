# PilotPay Guardian (MVP)

Reserve Reassignment + Pay Protection Analyzer for Delta pilots.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS (mobile-first)
- zod + react-hook-form
- date-fns/date-fns-tz timezone-aware math
- Local storage history (last 10 analyses)
- Vitest unit tests for rule engine

## Run locally
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Test
```bash
npm run test
```

## How to update rules
All rule thresholds and labels are centralized in:
- `lib/configurable-rules.ts`

Update values like:
- `MIN_REST_HOURS`
- `MAX_DUTY_HOURS`
- `MAX_EARLY_SHIFT_HOURS`
- `MAX_LATE_SHIFT_HOURS`
- `CREDIT_DROP_THRESHOLD`

Any rule marked as `CONFIGURABLE RULE` is a placeholder intended to be mapped to exact CBA/contract language later.

## Obvious next features
1. OCR import from schedule/timecard screenshots.
2. Airline selector + per-airline contract profiles.
3. Contract text mapping UI with versioning and effective dates.
4. FAR 117 table-driven legality checks (acclimatization, FDP extensions, split duty).
5. PDF export for dispute packet.
6. In-app evidence attachments (call logs, ACARS snippets, trip sheet).
7. Rule audit trail and changelog.
