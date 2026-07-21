# Tomorrow Protocol

Public-facing Next.js site for Tomorrow Protocol, exported as a static site and
deployed to GitHub Pages at [tmrw.finance](https://tmrw.finance).

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- CSS Modules

## Local Development

1. Install dependencies:

```bash
npm ci
```

2. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` - start local dev server
- `npm run lint` - run ESLint
- `npm run build` - production build

## GitHub Pages deployment

The workflow at `.github/workflows/deploy-pages.yml` runs on pushes to `main`,
builds the static `out/` directory, and deploys it through GitHub Pages. In the
repository's **Settings → Pages**, set **Source** to **GitHub Actions**.

Set `tmrw.finance` as the custom domain in **Settings → Pages** (GitHub ignores
`CNAME` files for custom Actions workflows). Configure the apex DNS records for
GitHub Pages, then verify the domain and enable **Enforce HTTPS**. DNS and TLS
issuance can take time to propagate.

## Production notes

- `npm run build` creates `out/`, the exact artifact deployed by Pages.

## Repo Hygiene

- `.env*` files are gitignored
- Default create-next-app unused assets/components were removed to keep the public repo minimal
