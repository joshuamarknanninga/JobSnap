# JobSnap
Run your small service business from your phone in under 10 minutes a day.

## JobSnap MERN SaaS (solo cleaning businesses)

This repository now includes a full MERN scaffold with:

- **Backend:** Express + MongoDB + JWT authentication.
- **Data models:** Users, Businesses, Customers, Estimates, Jobs, Invoices.
- **Frontend:** React dashboard with protected routes and resource views.

## Project structure

- `backend/` – Node.js API, Mongoose models, JWT auth, CRUD routes.
- `frontend/` – React + Vite dashboard app with auth context and protected pages.

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create environment file:
   ```bash
   cp backend/.env.example backend/.env
   ```
3. Configure `backend/.env` with your MongoDB URI and JWT secret.
4. Run both apps:
   ```bash
   npm run dev
   ```

- API: `http://localhost:5001/api`
- Frontend: `http://localhost:5173`

## How-to manual (operator guide)

Use this section as your daily runbook for JobSnap.

### 1) First-time setup
1. Open `http://localhost:5173`.
2. Click **Get started** and create your account.
3. Use your business name so branding appears in the sidebar.

### 2) Add your first customer
1. Go to **Customers**.
2. Fill in customer name, contact details, and service address.
3. Click **Add Customer**.

### 3) Create and send an estimate
1. Go to **Estimates**.
2. Enter customer ID, title, optional tax, and line items.
3. Confirm subtotal/total preview, then click **Add Estimate**.
4. Change estimate status from `draft` to `sent` (and later `accepted` when approved).

### 4) Convert estimate to a scheduled job
1. On an **accepted** estimate, click **Create job**.
2. Enter scheduled date and service address.
3. Open **Jobs** to verify it appears as `scheduled`.

### 5) Run the job and invoice it
1. Update job status: `scheduled` -> `in_progress` -> `completed`.
2. On a completed job, click **Create invoice**.
3. Enter a due date and save.
4. Move invoice status through `draft` -> `sent` -> `paid` (or `overdue`).

### 6) Use reminders and reports daily
- **Dashboard** shows items needing attention (today's jobs, overdue invoices, draft estimates).
- **Reports** shows conversion rate, paid revenue, completed jobs, and monthly paid totals.

### 7) Customer communication shortcuts
- From estimates, jobs, and invoices, use copy buttons to quickly send:
  - estimate approval text,
  - "on my way" text,
  - invoice reminder text.

### 8) Recommended daily routine (5-10 minutes)
1. Check dashboard reminders.
2. Move any stalled statuses forward.
3. Send reminders for overdue invoices.
4. Review reports weekly for trends.

## API endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

### Protected resources (JWT required)
- `/api/businesses`
- `/api/customers`
- `/api/estimates`
- `/api/jobs`
- `/api/invoices`

Each resource supports:
- `GET /`
- `POST /`
- `GET /:id`
- `PUT /:id`
- `DELETE /:id`


### Workflow actions (JWT required)
- `POST /api/workflows/estimates/:estimateId/create-job` (estimate must be `accepted`)
- `POST /api/workflows/jobs/:jobId/create-invoice` (job must be `completed`)

Status transitions are guarded:
- Estimates: `draft -> sent -> accepted/rejected`
- Jobs: `scheduled -> in_progress -> completed` (or cancel before completion)
- Invoices: `draft -> sent -> paid/overdue`

Server-side financial rules:
- Estimate `subtotal` and `total` are auto-calculated from `lineItems` when provided.
- Job `total` auto-inherits from linked estimate when missing.
- Invoice `amount` auto-inherits from linked job when missing.

## Testing

Run backend tests:

```bash
npm run test --workspace backend
```

## Troubleshooting


If you do not set `MONGO_URI`, backend dev mode now falls back to:

```bash
mongodb://127.0.0.1:27017/jobsnap
```

If you see connection/auth warnings, create `backend/.env` (not just `.env.example`) and set:

```bash
MONGO_URI=mongodb://127.0.0.1:27017/jobsnap
JWT_SECRET=your-secret
```

`npm run dev` now auto-installs workspace dependencies before starting both apps.

If you prefer to install once manually, run:

```bash
npm install
```

Then use:

```bash
npm run dev:workspaces
```

If you still see a generic Vite starter page, stop all running Vite processes and restart from this repo root:

```bash
pkill -f vite
npm run dev
```

Then open exactly `http://127.0.0.1:5173/`.

