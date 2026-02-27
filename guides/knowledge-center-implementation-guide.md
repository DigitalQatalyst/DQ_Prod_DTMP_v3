# Knowledge Center Implementation Guide

## Purpose
Execution guide to align the Knowledge Center marketplace with the reference model while honoring the agreed operating model:
- Content is created and curated by Transformation Office (TO).
- End users consume, collaborate, and request clarification.
- No general-user article authoring/submission in prototype scope.

## Scope
- Marketplace: Knowledge Center
- Stage 1: Discovery + library consumption
- Stage 2: Personal/team collaboration around curated content
- Integration: Learning Center, Portfolio Management, Lifecycle Management
- Cross-cutting: taxonomy, search quality, analytics, governance

## Product Direction (Agreed)
- Knowledge Center is a library/reference marketplace first.
- Stage 2 is viable for:
  - Saved articles
  - Reading history/continue reading
  - Comments and @mentions
  - Optional clarification/update requests to TO
- Stage 2 is not for general-user article creation.

## Target Outcome
A production-ready Knowledge Center flow:
1. Users discover relevant content quickly (search/facets/sort).
2. Users read in an in-app reader with attachments and related content.
3. Users save/share/comment/mention for team collaboration.
4. TO monitors quality/freshness/usage and handles clarification requests.

## Implementation Backlog

### KC-001 Functional Search + Faceted Filtering (Stage 1)
- Files: `src/pages/KnowledgeCenterPage.tsx`, `src/data/knowledgeCenter/*`
- Work:
  - Apply `searchQuery` and `selectedFilters` to rendered card lists.
  - Add active filter chips and clear-all behavior.
  - Ensure counts reflect filtered results.
- Acceptance Criteria:
  - Result list and counts update correctly for each tab.

### KC-002 Sorting + Pagination
- Files: `src/pages/KnowledgeCenterPage.tsx`
- Work:
  - Add sort options: `Most Relevant`, `Newest`, `Most Viewed`, `Highest Rated`.
  - Add pagination controls per tab.
- Acceptance Criteria:
  - Sorting and page transitions are stable and consistent with filters/search.

### KC-003 Unified Knowledge Item Taxonomy
- Files: `src/data/knowledgeCenter/*`, shared types
- Work:
  - Introduce canonical `KnowledgeItem` contract across tabs.
  - Normalize metadata: phase/domain/type/tags/audience/difficulty/updatedAt/author.
- Acceptance Criteria:
  - All Knowledge Center views can consume canonical metadata consistently.

### KC-004 Reader Experience (Detail Pages)
- Files: `src/pages/KnowledgeCenterDetailPage.tsx`
- Work:
  - Replace placeholder `alert` actions with in-app resource view/download logic.
  - Add sectionized reader behavior (TOC anchors, metadata panel, attachments).
- Acceptance Criteria:
  - Opening a resource provides real read/download behavior without placeholder alerts.

### KC-005 Related Content + Crosslinks
- Files: `src/pages/KnowledgeCenterDetailPage.tsx`, knowledge data helpers
- Work:
  - Add related-content engine based on tags/domain/phase/type.
  - Add explicit crosslinks into Learning Center/Portfolio/Lifecycle references.
- Acceptance Criteria:
  - Reader reliably surfaces relevant related resources and integration links.

### KC-006 Stage 2 Knowledge Workspace Foundation
- Files: `src/App.tsx`, `src/pages/Stage2KnowledgePage.tsx` (new), shared nav components
- Work:
  - Add Stage 2 knowledge route foundation:
    - `/stage2/knowledge/overview`
    - `/stage2/knowledge/saved`
    - `/stage2/knowledge/history`
    - `/stage2/knowledge/article/:id`
- Acceptance Criteria:
  - Stage 2 routes are directly accessible and refresh-safe.

### KC-007 Saved Articles + Reading History
- Files: stage2 knowledge page/state modules
- Work:
  - Add save/unsave actions from Stage 1 and Stage 2 reader.
  - Track reading history and continue-reading list.
- Acceptance Criteria:
  - Users can save and revisit content; history reflects viewed items.

### KC-008 Comments + @Mentions (Consumer Collaboration)
- Files: stage2 knowledge reader components, collaboration state modules
- Work:
  - Add article comments thread.
  - Add @mention flow for internal colleagues.
  - Add mention/reply notifications.
- Acceptance Criteria:
  - Users can collaborate on curated content without authoring new articles.

### KC-009 Clarification/Update Request to TO (Optional but Recommended)
- Files: stage2 knowledge reader components, request modules
- Work:
  - Add "Request clarification" / "Report outdated section" actions.
  - Create TO-facing request status model (`Open`, `In Review`, `Resolved`).
- Acceptance Criteria:
  - Users can submit feedback requests and track status.

### KC-010 TO Governance Signals (Read-side)
- Files: analytics hooks/modules, TO dashboards (as available)
- Work:
  - Track usage: views, saves, helpful votes, reading depth, stale-content flags.
  - Surface article freshness metadata and ownership.
- Acceptance Criteria:
  - TO has actionable usage/freshness indicators for curation priorities.

### KC-011 Content Scale-Up
- Files: `src/data/knowledgeCenter/*` or API-backed content layer
- Work:
  - Expand content inventory toward reference targets with complete metadata.
- Acceptance Criteria:
  - Agreed volume and metadata completeness reached.

### KC-012 Accessibility + Regression Coverage
- Files: `src/test/*`
- Work:
  - Add tests for search/filter/sort/pagination/reader/saved/history/comments.
  - Add key accessibility checks for list + reader + collaboration components.
- Acceptance Criteria:
  - Core flows covered and passing in CI.

### KC-013 Backend Integration (Auth + Persistence)
- Files: auth client, API services/hooks, route guards, knowledge state modules
- Work:
  - Persist saved/history/comments/mentions/feedback requests.
  - Enforce role distinctions:
    - Consumer roles: read/collaborate
    - TO roles: curate/publish/administer
- Acceptance Criteria:
  - Multi-session consistency and API-backed behavior in production paths.

## Suggested Delivery Sequence

### Phase 1: Discovery Quality
- `KC-001`
- `KC-002`
- `KC-003`
- `KC-004`
- `KC-005`

### Phase 2: Stage 2 Collaboration
- `KC-006`
- `KC-007`
- `KC-008`
- `KC-009`
- `KC-010`

### Phase 3: Hardening + Scale
- `KC-011`
- `KC-012`
- `KC-013`

## Delivery Checklist Template

| Ticket | Status | Owner | Start | Target | Notes |
|---|---|---|---|---|---|
| KC-001 | Completed | Codex | 2026-02-20 | 2026-02-20 | Implemented functional search + faceted filtering across all tabs, mapped filter-key/field mismatches, and updated rendered counts + no-result states to reflect filtered data |
| KC-002 | Completed | Codex | 2026-02-20 | 2026-02-20 | Added tab-aware sorting (`Most Relevant`, `Newest`, `Most Viewed`, `Highest Rated`), page-size pagination, page reset on tab/filter/search/sort changes, and wired paged card rendering for all tabs in `KnowledgeCenterPage` |
| KC-003 | Completed | Codex | 2026-02-20 | 2026-02-20 | Added canonical `KnowledgeItem` taxonomy and adapters in `src/data/knowledgeCenter/knowledgeItems.ts`; wired Knowledge Center list filtering/sorting and detail metadata display to consume normalized fields (`department`, `type`, `tags`, `audience`, `phase`, `updatedAt`, `author`) |
| KC-004 | Completed | Codex | 2026-02-20 | 2026-02-20 | Replaced placeholder detail-page actions with an in-app reader panel and prototype download behavior, added sectionized reader anchors (overview/insights/implementation/attachments/metadata), and surfaced normalized metadata in the reader flow |
| KC-005 | Completed | Codex | 2026-02-20 | 2026-02-20 | Added related-content engine in `knowledgeItems` (tag/department/type/phase scoring), surfaced related resources on detail pages, and added explicit crosslinks from Knowledge Center detail to Learning Center, Portfolio Management, and Lifecycle Management workflows |
| KC-006 | Completed | Codex | 2026-02-20 | 2026-02-20 | Added Stage 2 Knowledge Workspace foundation with new route page `src/pages/Stage2KnowledgePage.tsx`, wired routes `/stage2/knowledge/overview`, `/stage2/knowledge/saved`, `/stage2/knowledge/history`, plus default redirect from `/stage2/knowledge` |
| KC-007 | Completed | Codex | 2026-02-20 | 2026-02-20 | Added persistent saved/history state in `src/data/knowledgeCenter/userKnowledgeState.ts`, wired save/unsave actions in Stage 1 and Stage 2 reader (`KnowledgeCenterDetailPage`), and updated Stage 2 workspace (`Stage2KnowledgePage`) to show real Saved, History, and Continue Reading lists |
| KC-008 | Completed | Codex | 2026-02-20 | 2026-02-20 | Added collaboration state module `src/data/knowledgeCenter/collaborationState.ts` for comments and @mentions with mention notifications; wired reader comment thread + mention posting in `KnowledgeCenterDetailPage`, and surfaced mention notifications in Stage 2 overview (`Stage2KnowledgePage`) with read/route behavior |
| KC-009 | Completed | Codex | 2026-02-20 | 2026-02-20 | Added TO request state module `src/data/knowledgeCenter/requestState.ts` with status model (`Open`, `In Review`, `Resolved`), wired request submission from reader (`KnowledgeCenterDetailPage`), and surfaced request tracking + status progression demo controls in Stage 2 overview (`Stage2KnowledgePage`) |
| KC-010 | Completed | Codex | 2026-02-20 | 2026-02-20 | Added read-side governance analytics module `src/data/knowledgeCenter/analyticsState.ts` (views, save actions, helpful votes, reading depth, stale flags), wired signal capture + freshness/ownership display in `KnowledgeCenterDetailPage`, and surfaced TO governance signal cards in `Stage2KnowledgePage` overview |
| KC-011 | Completed | Codex | 2026-02-20 | 2026-02-20 | Scaled mock Knowledge Center inventory with additional fully-tagged entries across best practices, testimonials, playbooks, and library datasets; also switched Knowledge Center header stats to dynamic total-resource count based on dataset volume |
| KC-012 | Completed | Codex | 2026-02-20 | 2026-02-20 | Added Knowledge Center regression + accessibility-focused tests: module tests for saved/history/comments/mentions/requests/analytics (`src/test/knowledgeCenter/knowledge-state.test.ts`) and UI tests for search/filter/sort/pagination + reader collaboration/request controls (`src/test/knowledgeCenter/knowledge-pages.test.tsx`); added `scrollIntoView` test polyfill in `src/test/setup.ts` |
| KC-013 | Not Started |  |  |  |  |

## Definition of Done (Per Ticket)
- Functional acceptance criteria met.
- No console errors in affected flows.
- Responsive behavior verified (mobile + desktop).
- Accessibility checks applied to changed UI.
- Tests added/updated and passing.

## Risks to Manage
- Overengineering Stage 2 before Stage 1 discovery quality is functional.
- Building authoring workflows that conflict with TO-curated operating model.
- Content scale-up before taxonomy/search quality is stabilized.
- Mock metadata diverging from eventual backend contracts.
