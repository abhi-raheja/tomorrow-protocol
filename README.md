# Tomorrow Protocol (Frontend Prototype)

Public-facing Next.js prototype for Tomorrow Protocol marketing pages and dashboard mockups.

## What This Repo Contains

- Marketing landing page with waitlist modal
- LP / Borrower / Admin dashboard UI prototypes
- Mock data only for dashboard views (`lib/dummy-data.ts`)
- A waitlist API route that writes signups to Notion when configured

## What This Repo Does Not Contain

- Smart contracts
- Wallet integrations / signing logic
- Onchain transaction execution
- Real portfolio or protocol data sources

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS v4
- Radix UI primitives
- Recharts
- Sonner (toasts)

## Local Development

1. Install dependencies:

```bash
npm ci
```

2. Copy the example env file and fill in the values:

```bash
cp .env.example .env.local
```

3. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

The waitlist endpoint fails closed (returns an error) unless these are configured:

- `NOTION_API_KEY`: Notion integration secret
- `NOTION_WAITLIST_DB_ID`: Notion database ID for waitlist entries

Expected Notion database properties:

- `Email` (title)
- `X Handle` (rich_text)
- `Signed Up` (date)

## Scripts

- `npm run dev` - start local dev server
- `npm run lint` - run ESLint
- `npm run build` - production build
- `npm run start` - run production server

## Security Notes

- Waitlist API validates email and X handle input
- Request body size is capped
- Basic in-memory rate limiting is enabled (best effort; not distributed)
- Honeypot field is included to reduce bot spam
- Raw email/X handle values are not logged server-side
- Security headers are configured in `next.config.ts`

## Production Notes

- This project currently uses extensive inline styles on the landing page. A strict CSP is not configured yet because it would require a nonce/hash strategy (or refactoring inline styles into CSS/Tailwind).
- `npm audit` requires network access to the npm registry. Run it in CI or a connected environment as part of release checks.
- Dashboard pages use mock data and simulated actions only. Do not treat them as operational admin controls.

## Repo Hygiene

- `.env*` files are gitignored
- `.env.example` is committed as the canonical template
- Default create-next-app unused assets/components were removed to keep the public repo minimal
