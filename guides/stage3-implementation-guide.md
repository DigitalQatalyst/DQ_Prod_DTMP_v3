# Stage 3 Implementation Guide (Learning + Knowledge)

## Objective
Implement Stage 3 as a unified TO Operations workspace focused first on:
- Learning Center fulfillment operations
- Knowledge Center fulfillment operations

Stage model:
- Stage 1: Discovery marketplaces
- Stage 2A: End-user workspace
- Stage 2B: Marketplace admin workspace
- Stage 3: TO fulfillment operations

## Current Baseline
- `Stage3AppPage` scaffold exists with route-based views.
- Stage 3 mock data contracts exist under `src/data/stage3/*`.
- Initial Stage 3 routes exist:
  - `/stage3`
  - `/stage3/:view`

## Stage 3 Scope for First Release
Only Learning Center and Knowledge Center requests will be operationalized in Stage 3 for this phase.

### Included Request Types
- `learning-center`
  - enrollment override
  - certification exception
  - content correction/update request
  - coaching/assessment support request
- `knowledge-center`
  - clarification request
  - content correction/staleness flag follow-up
  - governance review request
  - access/support request

### Status Workflow
`new -> assigned -> in-progress -> pending-review -> completed`
Optional branches: `on-hold`, `cancelled`, `pending-user`

## Backlog

### S3-001 Normalize Data Model for LC/KC
- Status: Completed
- Files:
  - `src/data/stage3/types.ts`
  - `src/data/stage3/requests.ts`
  - `src/data/stage3/index.ts`
- Acceptance:
  - Stage 3 request model supports request type, status, priority, SLA, assignee, notes.
  - Seed data includes Learning + Knowledge examples.

### S3-002 Route Foundation and Stage 3 Shell
- Status: Completed
- Files:
  - `src/pages/Stage3AppPage.tsx`
  - `src/App.tsx`
- Acceptance:
  - `/stage3` redirects to a default Stage 3 view.
  - `/stage3/:view` is route-driven and refresh-safe.

### S3-003 Learning Queue Segmentation
- Status: Completed
- Files:
  - `src/pages/Stage3AppPage.tsx`
  - `src/data/stage3/requests.ts`
- Acceptance:
  - Stage 3 can filter views to Learning-only requests.
  - Counts/KPIs can be scoped by marketplace type.

### S3-004 Knowledge Queue Segmentation
- Status: Completed
- Files:
  - `src/pages/Stage3AppPage.tsx`
  - `src/data/stage3/requests.ts`
- Acceptance:
  - Stage 3 can filter views to Knowledge-only requests.
  - Counts/KPIs can be scoped by marketplace type.

### S3-005 Intake from Learning Stage 2B
- Status: Completed
- Files:
  - `src/pages/Stage2AppPage.tsx`
  - `src/data/stage3/requests.ts` (or service layer)
- Acceptance:
  - Learning admin can create/escalate a Stage 3 request.
  - New request appears in Stage 3 `new` queue.

### S3-006 Intake from Knowledge Stage 2
- Status: Completed
- Files:
  - `src/pages/Stage2AppPage.tsx`
  - `src/data/stage3/requests.ts` (or service layer)
- Acceptance:
  - Knowledge clarification/escalation actions generate Stage 3 requests.
  - New request appears in Stage 3 `new` queue.

### S3-007 Assignment Workflow (TO Ops)
- Status: Completed
- Files:
  - `src/pages/Stage3AppPage.tsx`
  - `src/data/stage3/*`
- Acceptance:
  - TO user can assign/unassign request owner/team.
  - Assignment updates reflected in list + detail panel.

### S3-008 Status Transition Actions
- Status: Completed
- Files:
  - `src/pages/Stage3AppPage.tsx`
  - `src/data/stage3/*`
- Acceptance:
  - Request status can move through workflow transitions.
  - Invalid transitions are prevented in UI.

### S3-009 SLA Risk and Aging Indicators
- Status: Completed
- Files:
  - `src/pages/Stage3AppPage.tsx`
  - `src/data/stage3/*`
- Acceptance:
  - Requests display SLA state (`on-track`, `at-risk`, `breached`).
  - Aging signal (days open / due countdown) visible in list/detail.

### S3-010 Activity Timeline + Notes
- Status: Completed
- Files:
  - `src/pages/Stage3AppPage.tsx`
  - `src/data/stage3/*`
- Acceptance:
  - Every assignment/status update creates an activity entry.
  - TO user can append operational notes.

### S3-011 Role Guard for Stage 3 Access
- Status: Completed
- Files:
  - `src/App.tsx`
  - auth/session role modules
- Acceptance:
  - Only TO roles can access `/stage3/*`.
  - Non-TO users are redirected gracefully.

### S3-012 Stage 3 KPI Accuracy (LC/KC)
- Status: Completed
- Files:
  - `src/pages/Stage3AppPage.tsx`
  - `src/data/stage3/*`
- Acceptance:
  - KPI cards use computed values from current queue state.
  - KPI values support global and scoped (Learning/Knowledge) modes.

## Execution Order
1. S3-003
2. S3-004
3. S3-005
4. S3-006
5. S3-007
6. S3-008
7. S3-009
8. S3-010
9. S3-011
10. S3-012

## Testing Checklist
- Stage 3 route loads directly (`/stage3/dashboard`) and via navigation.
- Learning intake creates Learning-type requests only.
- Knowledge intake creates Knowledge-type requests only.
- Assignment and status updates persist in session state.
- SLA and queue counts update after each action.
- Role guard correctly blocks unauthorized access.

## Established Stage 3 Flow (As Implemented)
### Entry and Access
- User clicks `Access Platform` in the header.
- If not authenticated, `LoginModal` opens.
- Session role is derived on login:
  - TO role (`to-ops` / `to-admin`) -> can access Stage 3.
  - Non-TO role (`business-user`) -> no Stage 3 access.
- If TO role is active, user is routed to `/stage3/dashboard`.
- Stage 3 routes are guarded:
  - Unauthenticated users are redirected away.
  - Authenticated non-TO users are redirected to Stage 2.

### Stage 2 to Stage 3 Intake
- Learning Center:
  - From Stage 2B admin context, escalation action creates a `learning-center` request in Stage 3 (`new` queue).
- Knowledge Center:
  - Clarification/comment escalation actions create `knowledge-center` requests in Stage 3 (`new` queue).

### Stage 3 Operations Flow
- TO user works from the unified Request Management workspace.
- `Marketplace Scope` filters queue/KPIs:
  - `All`
  - `Learning Center`
  - `Knowledge Center`
- TO can process each request with:
  - Assign / Unassign owner + team.
  - Controlled status transitions (`new`, `assigned`, `in-progress`, `pending-review`, optional branches).
  - Operational notes.
  - Activity timeline entries for assignment, status changes, and notes.

### Queue and KPI Behavior
- KPI cards are computed from current scoped queue state (not static values).
- Request table supports:
  - Search
  - Status/Priority/Assignee filters
- SLA and aging signals are visible in list and detail.

### Request Detail Interaction
- Clicking a request opens a right-side modal sheet with backdrop.
- Sheet can be closed via:
  - `X` button
  - outside click
  - `Esc` key
- Detail actions execute inside the modal and update queue/KPIs in place.
