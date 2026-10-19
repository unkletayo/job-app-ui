# job-app-ui

A React single-page app for tracking job postings, matching them against your candidate profile, and discovering new roles. It is the web front end for the `job-app` backend API.

## Features

- Email/password registration and login with a bearer token kept in `localStorage`; all app routes are protected.
- Job dashboard with a high-match filter, plus a detail view per posting with its match score, reasons and gaps.
- Add jobs by fetching a URL or pasting the posting text manually; re-extract existing postings.
- Job clusters view that groups related postings.
- Discovery: manage watched companies and discovery sources, trigger runs, and review run history.
- Job preferences editor.
- Candidate profile editor: summary plus experience, education, projects, skills, certifications, achievements and links.
- Light/dark theme provider.

## Tech stack

- React 19, TypeScript, Vite
- React Router (routes are lazy-loaded)
- Tailwind CSS 4 with shadcn/ui components built on Base UI (`@base-ui/react`), lucide-react icons
- axios for HTTP, SWR for data fetching
- ESLint and Prettier

## Project structure

```
src/
  main.tsx, App.tsx     entry point and route table
  routes/               one page per route (login, register, job-list, job-detail,
                        clusters, discovery, preferences, profile)
  components/           feature components, one per file
  components/ui/        shadcn/ui primitives
  lib/                  API client (api.ts), auth, data hooks per domain, types
```

## Prerequisites

- Node.js and npm
- A running instance of the `job-app` backend (this repo contains only the UI)

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Environment variables:

| Variable            | Purpose                       | Example in `.env.example` |
| ------------------- | ----------------------------- | ------------------------- |
| `VITE_API_BASE_URL` | Base URL of the backend API   | `http://localhost:3000`   |

## Scripts

| Command             | What it does                      |
| ------------------- | --------------------------------- |
| `npm run dev`       | Start the Vite dev server         |
| `npm run build`     | Type-check (`tsc -b`) and build   |
| `npm run preview`   | Serve the production build        |
| `npm run typecheck` | `tsc --noEmit`                    |
| `npm run lint`      | ESLint                            |
| `npm run format`    | Prettier on `.ts`/`.tsx` files    |

There is no test runner configured.

## Backend API

The client in `src/lib/api.ts` expects every response wrapped in an envelope (`requestSuccessful`, `responseMessage`, `responseCode`, `responseBody`) and unwraps `responseBody`; `204` responses have no body. The token is sent as `Authorization: Bearer <token>`. Endpoint groups used: `/auth`, `/job-postings`, `/dashboard/jobs`, `/job-clusters`, `/job-preferences`, `/candidate-profile/*`, and `/discovery/*`.

## Deployment

`npm run build` outputs static files to `dist/`, which can be served by any static host. Set `VITE_API_BASE_URL` at build time, and use a host configured to fall back to `index.html` for client-side routes.
