# DTMP Platform — Document Studio Marketplace Specification

## Stage 1: Marketplace

### 2.1 Overview

Stage 1 is the browsing and request-initiation experience. It follows the established DTMP Stage 1 layout pattern used across all marketplaces: a full-width page with a marketplace header, a tab bar, a left filter panel, and a card grid.

Document Studio has two tabs, each representing a distinct document type. Each tab has its own set of filters and its own set of service cards.

### 2.2 Page Layout

| Element | Specification |
|---------|---------------|
| Layout Pattern | Full-width page with left filter panel + card grid |
| Breadcrumb | Home / Marketplaces / Document Studio |
| Phase Badge | DESIGN |
| Title | Document Studio |
| Subtitle Badge | Powered by AI DocWriter 4.0 |
| Tab Bar | Two tabs: Assessments / Application Profiles |
| Left Panel | Filters (changes per tab) |
| Main Area | Card grid (3 columns desktop, 2 tablet, 1 mobile) |

### 2.3 Tabs

#### Tab 1 — Assessments

| Attribute | Value |
|-----------|-------|
| Tab Label | Assessments |
| Tab Icon | ClipboardCheck (Lucide) |
| Card Count (sample) | 8 |
| Tab Description | Request a structured assessment of your organisation, systems, or projects. AI DocWriter generates a tailored assessment report using your context and organisational data. |

**Filters for Assessments tab:**

- Assessment Type (Maturity, Risk, Health Check, Gap Analysis, Readiness, Capability)
- Framework (COBIT, ISO 27001, NIST, Custom)
- Assessment Scope (Organisation-wide, Domain-specific, Project-level, Application-level)
- Output Format (PDF, DOCX, PDF + DOCX)
- Includes Scorecard (Yes / No)
- Includes Recommendations (Yes / No)
- AI Generation (Full AI Generation / AI-Assisted)

**Sample cards for Assessments tab:**

- Digital Maturity Assessment
- Capability Assessment
- Cloud Readiness Assessment
- Security Risk Assessment
- Application Health Check
- Transformation Gap Analysis
- Data Governance Maturity Assessment
- Project Health Assessment

#### Tab 2 — Application Profiles

| Attribute | Value |
|-----------|-------|
| Tab Label | Application Profiles |
| Tab Icon | LayoutGrid (Lucide) |
| Card Count (sample) | 18 |
| Tab Description | Request a comprehensive profile document for a specific application in your portfolio. AI DocWriter generates a structured profile using your application data and context. |

**Filters for Application Profiles tab:**

- Application Type (CRM, ERP, Analytics, HR System, Security, Integration Platform)
- DBP Domain (Customer Experience, Operations, Data & Analytics, Digital Workplace)
- Deployment Model (Cloud, On-Premise, Hybrid, SaaS)
- Output Format (PDF, DOCX, PDF + DOCX)
- Includes TCD — Total Cost of Deployment (Yes / No)
- Includes Integration Map (Yes / No)
- AI Generation (Full AI Generation / AI-Assisted)

**Sample cards for Application Profiles tab:**

- CRM Application Profile
- ERP System Profile
- Analytics Platform Profile
- HR System Profile
- Financial System Profile
- Security Platform Profile
- Integration Platform Profile
- Data Warehouse Profile
- AI/ML Platform Profile
- Service Desk Platform Profile

### 2.4 Card Structure

Each card in both tabs follows the same structure. Cards are white, rounded, bordered, with a hover state that shows a blue border and soft shadow. Cards must match the established card convention used across all DTMP marketplaces.

| Element | Description |
|---------|-------------|
| Card Icon | Relevant Lucide icon representing the document type |
| AI Badge (top right) | Full AI Generation OR AI-Assisted (small badge, top-right corner of card) |
| Category Badge | Coloured pill badge indicating domain/category (Maturity, Risk, Operations) |
| Title | Document type name, bold, 16px |
| Description | 1–2 sentence description, 14px, gray-600 |
| Meta Row 1 | Page range (e.g. 25–35 pages) with document icon |
| Meta Row 2 | Output formats (PDF, DOCX, PPTX) with download icon |
| Meta Row 3 | Special feature (Benchmark data, Gap analysis) with star icon |
| Footer | Usage count (e.g. 345 uses) with users icon |

### 2.5 Card Detail & Request Flow

When a user clicks a card, a detail panel or modal opens (follow the established pattern used in other marketplaces in the codebase). The detail view shows full information about the document type and includes a primary CTA button labelled "Request Document".

The request flow is as follows:

1. User clicks "Request Document" on the card detail view.
2. If not logged in: login modal appears (use existing login modal component from codebase). Form context is preserved — after successful login the user is returned to the same state.
3. If logged in: context form appears (see Section 2.6).
4. User fills in the context form and clicks "Submit Request".
5. User is automatically navigated to Stage 2 → My Requests, where they see their newly submitted request as a new entry.

Stage 1 ends at form submission. The user does not stay on the marketplace page after submitting. Navigation to Stage 2 is automatic.

### 2.6 Context Forms

There is one context form per tab. The form is not per-card — all cards within the same tab use the same form. The selected card name is passed as context so the TO team knows which specific document was requested.

#### Assessments Context Form

| Field | Type |
|-------|------|
| Selected Document Type | pre-filled from card selection, read-only |
| Organisation / Business Unit | text input |
| Assessment Scope | dropdown: Organisation-wide / Domain-specific / Project-level / Application-level |
| Specific Focus Area | text input (e.g. "Cloud infrastructure security") |
| Framework Preference | dropdown: COBIT / ISO 27001 / NIST / No Preference / Other |
| Target Audience | dropdown: Executive / Senior Management / Technical Team / Compliance / Cross-functional |
| Desired Output Format | checkbox: PDF / DOCX / PPTX |
| Additional Context / Notes | textarea, optional |

**Submit Button:** Submit Request (orange, primary)

#### Application Profiles Context Form

| Field | Type |
|-------|------|
| Selected Document Type | pre-filled from card selection, read-only |
| Application Name | text input |
| Application Type | dropdown: CRM / ERP / Analytics / HR System / Financial / Security / Integration / Other |
| DBP Domain | dropdown: Customer Experience / Operations / Data & Analytics / Digital Workplace / Other |
| Deployment Model | dropdown: Cloud / On-Premise / Hybrid / SaaS |
| Primary Users / Audience | text input (e.g. "Sales team, 250 users") |
| Include Integration Map | toggle: Yes / No |
| Include TCD (Total Cost of Deployment) | toggle: Yes / No |
| Desired Output Format | checkbox: PDF / DOCX |
| Additional Context / Notes | textarea, optional |

**Submit Button:** Submit Request (orange, primary)
