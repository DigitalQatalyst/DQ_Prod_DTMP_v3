# Learning Center Implementation Guide

## Purpose
This document is the execution guide for closing the gap between the current Learning Center implementation and the target model in `guides/learning centre guide.txt`.

## Scope
- Marketplace: Learning Center
- Stage 1: Discovery experience
- Stage 2: Service Hub (Learner + Admin)
- Integration: Knowledge Center, Portfolio Management, Lifecycle Management
- Cross-cutting: RBAC, accessibility, testing, scalability

## Current Baseline (as of February 18, 2026)
- Stage 1 routes/pages exist for courses, tracks, and reviews.
- Detail pages and enroll CTA are implemented.
- Login modal hands off into Stage 2.
- Stage 2 user/admin components and data scaffolding exist but are not fully wired through dedicated routes.
- Search/filter in Stage 1 is mostly UI scaffolding and needs functional data application.

## Target Outcome
A production-ready Learning Center flow:
1. Discover offerings in Stage 1.
2. Enroll and enter Stage 2 learner workspace.
3. Complete modules/quizzes/projects with tracked progress.
4. Earn certificates based on rules.
5. Enable role-based manager/admin oversight.

## Implementation Backlog

### LC-001 Stage 2 Route Foundation
- Files: `src/App.tsx`, `src/pages/Stage2AppPage.tsx`
- Work:
  - Add explicit routes for:
    - `/stage2/learning-center/course/:courseId/user`
    - `/stage2/learning-center/course/:courseId/admin`
  - Keep `/stage2` as fallback.
- Acceptance Criteria:
  - Direct URL opens correct view without location-state dependency.

### LC-002 Wire Stage 2 User/Admin Components
- Files: `src/pages/Stage2AppPage.tsx`, `src/components/learningCenter/stage2/*`, `src/data/learningCenter/stage2/*`
- Work:
  - Mount user tabs: Overview, Modules, Progress, Resources, Certificate.
  - Mount admin tabs: Overview, Enrollments, Performance, Content, Settings.
- Acceptance Criteria:
  - User/admin tab navigation works end-to-end with stage2 data.

### LC-003 Fix Enroll Handoff to New Stage 2 Routes
- Files: `src/components/learningCenter/LoginModal.tsx`, `src/pages/LearningCenterDetailPage.tsx`
- Work:
  - On login submit, navigate by route params (courseId + view) instead of transient state only.
- Acceptance Criteria:
  - Refreshing Stage 2 page retains context and loads correctly.

### LC-004 Implement Functional Search + Filter (Stage 1)
- Files: `src/pages/LearningCenterPage.tsx`, `src/data/learningCenter/courses.ts`, `src/data/learningCenter/learningTracks.ts`, `src/data/learningCenter/reviews.ts`
- Work:
  - Apply `searchQuery` and `selectedFilters` to rendered results.
  - Update counts to filtered data.
- Acceptance Criteria:
  - Search and filters change visible cards and counts correctly.

### LC-005 Add Sort + Pagination/Virtualization
- Files: `src/pages/LearningCenterPage.tsx`, `src/components/learningCenter/*`
- Work:
  - Add sort controls and scalable list strategy (pagination first, virtualization optional next).
- Acceptance Criteria:
  - Page remains responsive at 100+ items.

### LC-006 Normalize Learning Data Model
- Files: `src/data/learningCenter/index.ts`, `src/data/learningCenter/types.ts` (expand), `src/data/learningCenter/*`
- Work:
  - Define canonical types for course/module/lesson/quiz/project/certificate.
  - Ensure Stage 1 and Stage 2 use aligned data contracts.
- Acceptance Criteria:
  - No duplicated conflicting models across stages.

### LC-007 Course Progression Engine (Frontend)
- Files: `src/components/learningCenter/stage2/user/UserModulesTab.tsx`, `src/components/learningCenter/stage2/user/UserProgressTab.tsx`
- Work:
  - Implement lesson completion, unlock logic, and progress recalculation.
  - Implement enrollment entry behavior:
    - First-time enrollment opens at Module 1 / first lesson (or first unlocked unit).
    - Returning learner opens at last in-progress lesson (resume point).
- Acceptance Criteria:
  - Progress updates deterministically as learner advances.
  - New enrollments initialize at 0% and enter Module 1 without manual navigation.
  - Returning learners resume where they left off.

### LC-008 Quiz Runtime MVP
- Files: `src/components/learningCenter/stage2/user/*` (new `QuizPlayer`), `src/data/learningCenter/stage2/types.ts`
- Work:
  - Add question flow, scoring, attempts, pass thresholds.
- Acceptance Criteria:
  - Quiz outcomes affect module/course completion.

### LC-009 Certificate Eligibility + Issuance State
- Files: `src/components/learningCenter/stage2/user/UserCertificateTab.tsx`, `src/data/learningCenter/stage2/types.ts`
- Work:
  - Evaluate requirements and issue earned-certificate state (id/date/download).
- Acceptance Criteria:
  - Certificate unlocks only when rules are satisfied.

### LC-010 RBAC Enforcement (UI Gate First)
- Files: `src/pages/Stage2AppPage.tsx`, `src/components/learningCenter/stage2/ViewToggle.tsx`, auth/role context files
- Work:
  - Enforce role-based visibility for learner/manager/admin.
  - Remove unrestricted admin view toggling.
  - Enforce role-scoped Course List behavior in Stage 2 Column 2:
    - Learner view shows only user-scoped courses (`My Courses`).
    - Admin view shows full course catalog (or admin scope).
- Acceptance Criteria:
  - Unauthorized users cannot access admin routes/components.
  - Learner and Admin see different course scopes in Column 2 as defined above.

### LC-011 Manager/TO Analytics Wiring
- Files: `src/components/learningCenter/stage2/admin/*`, `src/pages/Stage2AppPage.tsx`
- Work:
  - Wire admin analytics tabs with role checks and loading/error states.
- Acceptance Criteria:
  - Complete manager/admin workflow is functional and protected.

### LC-012 Marketplace Integration Deep Links
- Files: `src/pages/LearningCenterDetailPage.tsx`, stage2 lesson components, `src/App.tsx`
- Work:
  - Add links/workflows into Knowledge Center, Portfolio Management, Lifecycle training mode.
- Acceptance Criteria:
  - Learning content can launch linked experiences consistently.

### LC-013 Content Scale-Up
- Files: `src/data/learningCenter/*` or API-backed content layer
- Work:
  - Expand dataset toward target distribution in the reference guide.
- Acceptance Criteria:
  - Agreed content volume and metadata completeness reached.

### LC-014 Accessibility + Regression Coverage
- Files: `src/test/accessibility/*`, `src/test/integration/*`, Learning Center tests
- Work:
  - Add tests for Stage 1 filtering, Stage 2 routes, progression, quiz, certificate, RBAC.
- Acceptance Criteria:
  - Core flows covered and passing in CI.

### LC-015 Backend Integration (Auth + Persistence)
- Files: auth client, API hooks/services, route guards, learning state modules
- Work:
  - Replace static/mock-only flow with API-backed users, enrollments, progress, certificates.
- Acceptance Criteria:
  - User data persists across sessions/devices and aligns with RBAC.

### LC-016 Learning Track Runtime Model
- Files: `src/data/learningCenter/types.ts`, `src/data/learningCenter/learningTracks.ts`, `src/pages/LearningCenterDetailPage.tsx`, Stage 2 learning state modules
- Work:
  - Define track as a first-class runtime object (not just a card wrapper).
  - Add required vs elective course definitions and ordering within tracks.
  - Add track enrollment model separate from course enrollment.
- Acceptance Criteria:
  - Track has explicit runtime schema with required/elective semantics.
  - Track enrollment and course enrollment are distinct but linked.

### LC-017 Track Progress + Continue Flow
- Files: `src/pages/Stage2AppPage.tsx`, `src/components/learningCenter/stage2/user/*`, track state helpers
- Work:
  - Compute track progress from constituent required courses.
  - Implement `Continue Track` behavior to route learner to next incomplete required course.
  - Show track-level status: `% complete`, `x/y courses complete`, next recommended course.
- Acceptance Criteria:
  - Track progress updates as course progress changes.
  - Continue action always routes to the correct next course.

### LC-018 Learning Path Certificates
- Files: `src/components/learningCenter/stage2/user/UserCertificateTab.tsx`, certificate types/models, issuance logic
- Work:
  - Add separate track/path certificate model in addition to course certificate.
  - Define path completion rules (all required courses + optional capstone/final assessment).
  - Generate/issue path certificate when rules are met.
- Acceptance Criteria:
  - Course certificate and path certificate are independently tracked.
  - Path certificate issues only when path completion rules are satisfied.

### LC-019 Track Analytics for Manager/Admin
- Files: `src/components/learningCenter/stage2/admin/*`, analytics data models
- Work:
  - Add track-level analytics: enrollments, completion rate, avg completion time, bottleneck course, drop-off by course position.
  - Add manager/team views for track completion and gaps.
- Acceptance Criteria:
  - Admin and manager views expose track-level metrics, not only course metrics.
  - Bottlenecks and gaps are visible and actionable.

### LC-020 Track Notifications + Versioning Policy
- Files: notification hooks/services, certificate policy config, track metadata
- Work:
  - Add learner notifications for path milestones (enroll, course complete, next step, path complete).
  - Define track versioning and recertification policy for changed course composition/content.
  - Attach `pathVersion` to issued path certificates.
- Acceptance Criteria:
  - Milestone notifications fire at key points in path journey.
  - Path certificates include version and follow defined renewal/validity policy.

## Suggested Delivery Sequence

### Phase 1: Foundation + Discovery
- `LC-001`
- `LC-002`
- `LC-003`
- `LC-004`
- `LC-005`

### Phase 2: Learning Runtime
- `LC-006`
- `LC-007`
- `LC-008`
- `LC-009`

### Phase 3: Governance + Scale
- `LC-010`
- `LC-011`
- `LC-012`
- `LC-013`
- `LC-014`
- `LC-015`

### Phase 4: Learning Path Maturity
- `LC-016`
- `LC-017`
- `LC-018`
- `LC-019`
- `LC-020`

## Delivery Checklist Template

Use this section as live tracking.

| Ticket | Status | Owner | Start | Target | Notes |
|---|---|---|---|---|---|
| LC-001 | Completed | Codex | 2026-02-19 | 2026-02-19 | Added direct Stage 2 course/user-admin route handling with route-param context |
| LC-002 | Completed | Codex | 2026-02-19 | 2026-02-19 | Wired learner/admin workspace tabs and data-driven tab rendering in Stage 2 |
| LC-003 | Completed | Codex | 2026-02-19 | 2026-02-19 | Updated enroll/login handoff to route-param based Stage 2 navigation |
| LC-004 | Completed | Codex | 2026-02-19 | 2026-02-19 | Implemented functional search/filter application and filtered result counts in Stage 1 |
| LC-005 | Completed | Codex | 2026-02-19 | 2026-02-19 | Added sort controls and pagination for courses, tracks, and reviews in Stage 1 |
| LC-006 | Completed | Codex | 2026-02-19 | 2026-02-19 | Added shared canonical learning model types (course/module/lesson/quiz/project/certificate) and aligned legacy + stage2 contracts to reduce duplicate conflicting definitions |
| LC-007 | Completed | Codex | 2026-02-19 | 2026-02-19 | Implemented learner progression engine with lesson completion, module unlock flow, deterministic recalculation, and first-time vs returning resume behavior in Stage 2 |
| LC-008 | Completed | Codex | 2026-02-19 | 2026-02-19 | Added QuizPlayer runtime with question flow, scoring, attempts, pass thresholds, and progression-engine integration so quiz outcomes affect module/course completion |
| LC-009 | Completed | Codex | 2026-02-19 | 2026-02-19 | Added runtime course-certificate eligibility + issuance state (id/date/validity/download readiness) and wired certificate tab to issued state |
| LC-010 | Completed | Codex | 2026-02-19 | 2026-02-19 | Added UI-route RBAC guard for admin access, removed unrestricted admin switching for learner role, and enforced role-scoped Stage 2 course list behavior |
| LC-011 | Completed (Prototype Simplified) | Codex | 2026-02-19 | 2026-02-19 | Kept role-protected admin analytics wiring and no-course/track fallbacks; removed async loading/error gate to avoid prototype blocking behavior |
| LC-012 | Completed | Codex | 2026-02-19 | 2026-02-19 | Added Learning Center deep-link workflows into Knowledge Center, Portfolio Management, and Lifecycle Management from Stage 1 detail + Stage 2 modules, with Stage 2 alias routes for consistent navigation |
| LC-013 | Not Started |  |  |  |  |
| LC-014 | Not Started |  |  |  |  |
| LC-015 | Not Started |  |  |  |  |
| LC-016 | Completed | Codex | 2026-02-19 | 2026-02-19 | Added track runtime schema, required/elective semantics, and separate track enrollment model linked to courses |
| LC-017 | Completed | Codex | 2026-02-19 | 2026-02-19 | Added track progress runtime summary and Continue Track routing to next incomplete required course |
| LC-018 | Completed | Codex | 2026-02-19 | 2026-02-19 | Added independent path certificate model, rule evaluation, and learner certificate tab rendering with versioned path certificate state |
| LC-019 | Completed | Codex | 2026-02-19 | 2026-02-19 | Added track-level admin analytics (enrollments, completion rate, avg completion time, bottleneck, drop-off by course position) in Stage 2 admin overview |
| LC-020 | Completed | Codex | 2026-02-19 | 2026-02-19 | Added path milestone notifications plus track versioning/recertification policy with versioned certificate validity metadata |

## Definition of Done (Per Ticket)
- Code merged with review.
- Functional acceptance criteria met.
- No console errors in affected flows.
- Responsive behavior verified (mobile + desktop).
- Accessibility checks applied to changed UI.
- Tests added/updated and passing.

## Risks to Manage
- Overbuilding before route/data foundations are stabilized.
- RBAC deferral causing rework in Stage 2 UI.
- Content scale-up before filter/sort/pagination are implemented.
- Static mocks diverging from eventual backend contracts.

## Learning Center Marketplace Baseline (Prototype Snapshot)

### What Is Configured
- Stage 1 discovery experience is functional for `Courses`, `Learning Tracks`, and `Reviews`.
- Stage 1 supports functional search, filters, sorting, and pagination.
- Stage 1 detail pages support enroll handoff via login into Stage 2 with route params.
- Stage 2 has dedicated learner/admin route handling:
  - `/stage2/learning-center/course/:courseId/user`
  - `/stage2/learning-center/course/:courseId/admin`
- Stage 2 learner workspace tabs are wired: `Overview`, `Modules`, `Progress`, `Resources`, `Certificate`.
- Stage 2 admin workspace tabs are wired: `Overview`, `Enrollments`, `Performance`, `Content`, `Settings`.
- Learner progression runtime is implemented (lesson completion, module unlock, resume behavior).
- Quiz runtime is integrated with attempts, score, pass threshold, and progression updates.
- Course certificate runtime state is implemented (eligibility, issuance metadata, unlock behavior).
- Track runtime is implemented (required/elective semantics, track progress, continue flow).
- Path certificate runtime is implemented and tracked independently from course certificate.
- Track milestone notifications and track analytics are wired.
- Deep links from Learning Center into other marketplaces are implemented (Knowledge Center, Portfolio Management, Lifecycle Management training mode).

### Flow Established
1. User browses Stage 1 Learning Center offerings.
2. User opens detail page and selects enroll.
3. Login modal resolves prototype role and routes user to Stage 2 course workspace.
4. Learner completes lessons/modules/quizzes and sees progress + certificate state update.
5. Learner can continue track across required courses and view path-level milestone/certificate status.
6. Admin persona can view course and track analytics workspaces for monitoring and management.
7. Learning activities can deep-link into connected marketplaces for practice and reference, then return to Learning Center.

### Patterns Established
- Route-param driven state over transient location-only state.
- Role-aware UI gating at route and workspace levels (prototype RBAC).
- Role-scoped course visibility in Stage 2 column 2 (`My Courses` vs `All Courses`).
- Runtime state calculators for progression/certification rather than static display-only cards.
- Deterministic mock-data transforms for per-course learner/admin views.
- Separation of concerns:
  - Stage 1 discovery/search/filter/sort/pagination
  - Stage 2 execution/progression/analytics
  - Track and certificate logic as dedicated state helpers
- Integration-link pattern for cross-marketplace workflows.

### Prototype Simplifications (Intentional)
- Auth/RBAC is UI-first and mock-resolved (not backend-enforced).
- Persistence is in-memory/runtime for session behavior; no durable user state.
- Admin workspace uses direct rendering (no blocking async load gate) for prototype stability.
- Integration targets can use placeholder/training routes where full product surfaces are not yet complete.

### Build-Phase Work To Bring It To Production
- Implement backend auth, role claims, and server-side route authorization.
- Persist enrollments, progress, quiz attempts, and certificates via API.
- Replace mock role switching and mock user resolution with real identity/session handling.
- Expand content volume and metadata coverage to target scale.
- Add full accessibility pass and regression automation across Stage 1/Stage 2.
- Add robust loading/error telemetry and recoverability around analytics/content APIs.
- Finalize integration contracts and context handoff with Knowledge, Portfolio, and Lifecycle services.

## Decision Log
Record key architecture decisions here.

| Date | Decision | Rationale | Owner |
|---|---|---|---|
| 2026-02-18 | Backlog baseline created | Align implementation with reference guide | Team |
