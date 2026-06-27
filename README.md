# SentinelFlow AI

SentinelFlow AI is a case-management and review workflow built for UiPath AgentHack 2026. The current live demo focuses on a working case lifecycle: create a case, persist it in MongoDB, route it to human review, resolve it, and inspect the resulting timeline, audit trail, dashboard metrics, and analytics.

Live demo: https://sentinel-flow-ai-xi.vercel.app/

Repository: https://github.com/ASASANTA360/SentinelFlow-AI

---

## What Works Today

- Case creation from the `/cases` page with a generated unique `caseId` stored on the case record.
- MongoDB persistence through Mongoose models for `Case`, `CaseEvent`, and `AuditLog`.
- Case list, search, and detail views backed by live API routes.
- Human review workflow using the `Send to Human Review` action on a case detail page.
- Case resolution using the `Resolve Case` action on a case detail page.
- CaseEvent timeline entries for case creation and case updates.
- AuditLog entries for case creation and case updates.
- Dashboard page with live case counts, recent cases, human review count, and resolved case count.
- Analytics page with total, active, high-risk, human-review, resolved, status distribution, risk distribution, and resolution-rate metrics.
- Timeline page showing persisted case events across cases.
- Audit page showing persisted audit entries across cases.

## Roadmap / Conceptual Work

The repository contains exploratory agent-oriented code and placeholder routes, but the submission demo should not present these as completed integrations.

Not claimed as live production functionality:

- Live Gemini analysis in the main case workflow.
- Working UiPath Maestro integration.
- UiPath Agent Builder implementation.
- UiPath Action Center implementation.
- Working notification delivery.
- Document upload processing beyond the placeholder upload endpoint.
- Role-based users, authentication, or multi-user assignment.

These are appropriate roadmap items for a future version.

---

## Current Workflow

1. Create Case
   - Open `/cases`.
   - Enter a title, description, optional priority, and risk level.
   - Submit the form.
   - The app creates a MongoDB `Case` document with a generated `CASE-...` identifier, a `CaseEvent`, and an `AuditLog`.

2. Human Review
   - Open the new case detail page from the case list.
   - Click `Send to Human Review`.
   - The app updates the case status to `human_review` and records event/audit entries.

3. Resolve
   - On the same case detail page, click `Resolve Case`.
   - The app updates the case status to `resolved` and records event/audit entries.

4. Timeline / Audit
   - Open `/timeline` to view case events across the system.
   - Open `/audit` to view audit records across the system.
   - Open an individual case detail page to see that case's own event and audit history.

5. Dashboard / Analytics
   - Open `/dashboard` to view live case totals and recent cases.
   - Open `/analytics` to view status, risk, human-review, and resolution metrics.

---

## Architecture

```text
Browser UI
  |
  |  Next.js App Router pages
  |  /dashboard, /cases, /cases/[id], /analytics, /timeline, /audit
  v
Next.js Route Handlers
  |
  |  /api/cases
  |  /api/cases/[id]
  |  /api/analytics
  |  /api/timeline
  |  /api/audit
  v
Mongoose data layer
  |
  |-- Case
  |-- CaseEvent
  |-- AuditLog
  v
MongoDB
```

The main workflow is implemented with Next.js pages calling Next.js route handlers. The route handlers connect to MongoDB through `src/lib/mongodb.ts` and read/write Mongoose models in `src/models`.

---

## API Routes

| Route | Method | Current behavior |
| --- | --- | --- |
| `/api/cases` | `GET` | Lists cases from MongoDB. Supports `q`, `status`, and `risk` filters. |
| `/api/cases` | `POST` | Creates a case with generated `caseId`, then writes a `CaseEvent` and `AuditLog`. |
| `/api/cases/[id]` | `GET` | Returns one case plus its related events and audit logs. |
| `/api/cases/[id]` | `PATCH` | Updates allowed case fields, including `status`, then writes a `CaseEvent` and `AuditLog`. |
| `/api/analytics` | `GET` | Returns aggregate case counts, status distribution, risk distribution, and resolution rate. |
| `/api/timeline` | `GET` | Returns all `CaseEvent` records with linked case details. |
| `/api/audit` | `GET` | Returns all `AuditLog` records with linked case details. |
| `/api/upload` | `POST` | Placeholder endpoint only. |

Experimental or non-demo routes should be treated carefully. The primary judged workflow uses the case, analytics, timeline, and audit APIs above.

---

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- MongoDB with Mongoose
- Lucide React icons
- Vercel deployment

---

## Setup

### Prerequisites

- Node.js 20 or later
- npm
- MongoDB connection string

### Install

```bash
npm install
```

### Environment Variables

Create `.env.local` locally. Do not commit secrets.

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=optional_for_experimental_agent_code_only
```

`MONGODB_URI` is required for the live case workflow. `GEMINI_API_KEY` is present for experimental agent code, but the current demonstrable case workflow does not depend on live Gemini analysis.

### Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Build

```bash
npm run build
```

---

## Proof to Capture

For submission and portfolio materials, capture these screenshots after creating and resolving a fresh case:

- Dashboard showing updated totals, recent case row, human reviews, and resolved cases.
- Cases page showing the created case in the table.
- Case detail page after `Send to Human Review`.
- Resolved case detail page after `Resolve Case`, including Events and Audit Logs sections.
- Timeline page showing the created and updated case events.
- Audit page showing `CASE_CREATED` and `CASE_UPDATED` entries.
- Analytics page showing status distribution, risk distribution, human-review count, and resolution rate.

---

## Demo Path

Use this route sequence for a reliable live walkthrough:

```text
/dashboard
/cases
/cases/[created-case-id]
/timeline
/audit
/analytics
```

Built for UiPath AgentHack 2026.
