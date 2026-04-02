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
