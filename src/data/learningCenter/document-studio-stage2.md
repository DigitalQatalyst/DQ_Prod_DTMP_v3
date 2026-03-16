# DTMP Platform — Document Studio Marketplace Specification

## Stage 2: User Dashboard

### 3.1 Overview

Stage 2 is the user's personal dashboard for tracking their Document Studio requests. It follows the unified three-column LVE (Left-Vertical-Expanded) layout used across all Stage 2 service hubs in the platform.

The user never initiates a new request from Stage 2. All requests originate from Stage 1. Stage 2 is purely for tracking, receiving, and managing submitted requests.

### 3.2 Three-Column Layout

| Column | Description |
|--------|-------------|
| Column 1 (Left Sidebar) | Global platform navigation — lists all marketplace service hubs. Document Studio is highlighted as active. User profile shown at bottom. Width: 240px fixed. |
| Column 2 (Service Nav) | Document Studio service hub navigation. Lists the sub-sections available within Document Studio Stage 2. |
| Column 3 (Main Content) | The primary content area. Changes based on the selected sub-section in Column 2. |

### 3.3 Column 2 Navigation — Document Studio Service Hub

Column 2 shows the following navigation items for Document Studio:

| Nav Item | Description |
|----------|-------------|
| Header | Document Studio / Service Hub |
| Nav Item 1 | Overview — Dashboard summary with key metrics |
| Nav Item 2 | My Requests — All submitted requests with status and SLA tracking |
| Nav Item 3 | My Documents — Completed documents ready for preview and download |
| Nav Item 4 | Revisions — Revision requests raised by the user, linked to original requests |

### 3.4 Overview Page

The Overview page is the landing page when a user enters the Document Studio service hub. It shows a summary dashboard.

**Metric Cards (top row — 4 cards)**

| Metric | Description |
|--------|-------------|
| Metric 1 | Available Document Types — count of document types available to request (always 2 for Assessments and Application Profiles) |
| Metric 2 | Active Requests — count of requests currently in progress (submitted or in generation) |
| Metric 3 | Completed Documents — count of documents delivered this quarter |
| Metric 4 | Avg. Delivery Time — average days from assignment to completion, with trend indicator (improvement/decline vs previous period) |

**Below the metric cards:**

- My Active Requests — a short list (max 3) of the user's most recent active requests with status badges and a "View All" link to My Requests.
- Quick Actions — two buttons: "Browse Document Types" (links back to Stage 1 marketplace) and "View All Requests" (links to My Requests).

### 3.5 My Requests Page

The My Requests page shows all requests submitted by the user across all time, with filtering and sorting.

**Request Entry — fields displayed per request**

| Field | Description |
|-------|-------------|
| Request ID | Auto-generated reference number (e.g. REQ-2026-045) |
| Document Type | Name of the document requested (e.g. Digital Maturity Assessment) |
| Tab / Category | Which tab the request came from (Assessment or Application Profile) |
| Submitted Date | Date and time of submission |
| Status | One of: Submitted / Assigned / In Progress / Completed / Revision Requested |
| Assigned To | TO team member name (shown after assignment, hidden before) |
| SLA 1 — Time to Assign | Elapsed time from submission to assignment. Shows as a timer if still pending, or elapsed time if assigned. Colour-coded: green (within SLA), amber (approaching), red (breached). |
| SLA 2 — Time to Complete | Elapsed time from assignment to completion. Shows as a timer if in progress, or elapsed time if completed. Colour-coded same as above. |
| Action | "View Details" button to expand full request detail |

**Filters available on My Requests:**

- Status (All / Active / Completed / Revision)
- Document Type (All / Assessments / Application Profiles)
- Date Range

SLA thresholds vary by document type. The specific SLA values (e.g. 24 hours to assign, 5 days to complete for Assessments) are to be defined by the Transformation Office and passed as configuration. For prototyping purposes, use placeholder values of 24 hours (assign) and 5 business days (complete) for Assessments, and 12 hours (assign) and 3 business days (complete) for Application Profiles.

### 3.6 My Documents Page

The My Documents page shows all completed documents that have been delivered to the user.

| Field | Description |
|-------|-------------|
| Document Name | Name of the generated document |
| Document Type | Assessment or Application Profile |
| Request ID | Link back to the original request |
| Delivered Date | Date the document was marked complete and delivered |
| Format | Available formats (e.g. PDF, DOCX) |
| Actions | Preview (opens in-platform preview) and Download (downloads the file) |

### 3.7 Revisions Page

The Revisions page shows all revision requests the user has raised. A revision is raised from within a completed request (see My Requests).

**How a revision is raised**

1. User navigates to My Requests and opens a completed request.
2. User clicks "Request Revision" on the completed request detail.
3. A revision form appears with a mandatory text field: "Please describe what you would like revised." The original document and full context are automatically carried over.
4. User submits the revision. A new ticket is created in Stage 3 linked to the original request.
5. The revision appears in the Revisions page with its own status and SLA tracking.

**Revision Entry — fields displayed**

| Field | Description |
|-------|-------------|
| Revision ID | Auto-generated (e.g. REV-2026-012) |
| Linked Request ID | The original request this revision relates to |
| Document Type | The document being revised |
| Revision Note | The user's note explaining what needs changing |
| Submitted Date | Date revision was raised |
| Status | Submitted / Assigned / In Progress / Completed |
| SLA | Same dual-SLA structure as original requests |
