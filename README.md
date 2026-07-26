# SWASTASK Application Portal

A responsive recruitment portal for applicants who want to work on the SWASTASK platform.
Built with **Next.js 14 (App Router)**, **TypeScript** and **Tailwind CSS**, featuring an
11-step application wizard, dynamic country-based pricing, a live 4-day recruitment countdown,
and an admin dashboard.

Persistence is **100% client-side** (browser `localStorage` for structured data and
`IndexedDB` for uploaded files), so the app runs with zero backend setup and deploys to Vercel
as a static/SSR app with no database or API keys.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # run the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

---

## Features

### Applicant experience
- **Homepage** — hero banner, company intro, benefits, 5-step process timeline, country pricing
  table, FAQ accordion, and a live countdown to the application deadline.
- **11-step wizard** with autosave, a progress rail, smooth (framer-motion) transitions,
  inline validation, and loading skeletons:
  1. Create Account (with live country fee)
  2. Personal Information
  3. Skills & Experience
  4. Equipment & Internet
  5. Skills Assessment (logical reasoning, math, English, reading, attention to detail,
     software self-ratings, an interactive **typing test**, practical tasks, and a personality inventory)
  6. Document Upload (National ID, Passport, CV, certificates, portfolio, cover letter —
     PDF/DOC/DOCX/JPG/JPEG/PNG, max 20 MB each)
  7. Availability
  8. Emergency Contact (optional)
  9. References (optional)
  10. Review (edit any section before submitting)
  11. Submit & Pay
- **Submit** locks the application, generates a unique Application ID (e.g. `SWT-2026-8F3A2C`),
  and routes to a **mock secure payment page** showing the Application ID, applicant, country and
  amount due. On success it records the payment, marks the application *Paid*, and "sends" a
  confirmation email.
- **Check Status** — look up an application by its ID to view status, download documents, and see
  the full submission.

### Dynamic country pricing
The one-time application fee is derived from the selected country and can never be edited
manually. It updates live as the country changes.

| Country | Fee | Country | Fee |
| --- | ---: | --- | ---: |
| United States | $83 | Somalia | $2 |
| United Kingdom | $76 | Burundi | $19 |
| Australia | $92 | England | $29 |
| China | $170 | Nigeria | $87 |
| Kenya | $43 | Tanzania | $16 |
| Uganda | $32 | All others | $63 |

Source of truth: [`src/lib/pricing.ts`](src/lib/pricing.ts).

### 4-day application window
- Live countdown (days / hours / minutes / seconds) on the homepage and hero.
- New applications are automatically disabled when the countdown reaches zero — the wizard is
  replaced with an **"Applications Closed"** message.
- The window (open date + duration) is **configurable by the admin** in *Admin → Settings*,
  or via env vars at deploy time (see `.env.example`) — no code change required.

### Admin dashboard (`/admin`)
- Stat cards: Total, Pending Payment, Paid, Approved, Rejected.
- Search by name, email or Application ID; filter by status and country.
- **Export to CSV and Excel** (`.xlsx`).
- Application detail drawer: view every field, **download uploaded documents**,
  **approve / reject** with an internal note, and **send email notifications**.
- Settings tab to configure the recruitment window and admin password.

Default admin password: `swastask-admin` (change it in Settings or via env).

### Cross-cutting
- Responsive (desktop / tablet / mobile), 2017-style clean corporate UI, blue primary + dark-gray text.
- **Dark mode** with system preference detection and no flash on load.
- Accessibility: semantic markup, labelled controls, visible focus states, `aria-live` toasts.
- Client + schema (Zod) validation.

---

## Architecture

```
src/
  app/                 # routes: / , /apply , /status , /status/[id] , /admin
  components/
    home/              # homepage sections
    site/              # header, footer, logo, theme toggle
    ui/                # design-system primitives (Button, Card, Field, Toast, ...)
    wizard/            # wizard shell, context, steps, typing test, fee display
    status/            # payment + confirmation views
    admin/             # dashboard, table, drawer, stat cards, settings, login
  hooks/               # useApplicationWindow, useApplications
  lib/
    storage/           # localStorage (applications, settings) + IndexedDB (files)
    pricing.ts         # dynamic country pricing (single source of truth)
    validation.ts      # Zod schemas per step
    assessment.ts      # assessment question bank + scoring
    email.ts           # email stub (records to an outbox)
    config.ts          # window/countdown logic + defaults
    types.ts           # data model
```

### Swapping the storage/email/payment layers for production
The client-side layers are intentionally isolated behind small modules so they can be replaced
with a real backend without touching the UI:

- **Data** — replace `src/lib/storage/applications.ts` with API calls (e.g. Next.js route handlers
  backed by Postgres/Prisma). The admin dashboard reads through `useApplications`.
- **Files** — replace `src/lib/storage/idb.ts` with an upload endpoint + object storage
  (Vercel Blob, S3).
- **Email** — replace `src/lib/email.ts` with Resend / SendGrid / Nodemailer.
- **Payments** — `src/components/status/PaymentPanel.tsx` contains a mock gateway; wire in Stripe,
  Flutterwave, etc.

> **Note on the current localStorage build:** because data lives in the browser, the admin panel
> only sees applications submitted **from the same browser**. This is inherent to client-side
> storage and is the first thing to change when moving to a shared backend.

---

## Deploying to Vercel
1. Push this repo to GitHub.
2. Import it into Vercel (framework preset: **Next.js** — no configuration needed).
3. Optionally set `NEXT_PUBLIC_OPEN_DATE`, `NEXT_PUBLIC_WINDOW_DAYS`, `NEXT_PUBLIC_ADMIN_PASSWORD`.
4. Deploy.
