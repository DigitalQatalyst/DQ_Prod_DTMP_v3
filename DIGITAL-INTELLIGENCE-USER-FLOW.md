# Digital Intelligence - Complete User Flow

## Overview

This document describes the complete user journey from discovering an intelligence service in the Stage 1 marketplace to accessing interactive dashboards in Stage 2.

---

## User Journey

### Step 1: Browse Marketplace (Stage 1)

**URL**: `/marketplaces/digital-intelligence`

**What the user sees**:
- Three tabs: Systems Portfolio (12), Digital Maturity (8), Projects Portfolio (10)
- 30 intelligence service cards organized by category
- Each card shows:
  - Service title and description
  - AI capabilities badges
  - Accuracy percentage
  - Update frequency
  - Complexity level

**User actions**:
- Browse services by category
- Search for specific services
- Filter by analytics type, data source, AI capability, etc.
- Click on a service card to view details

---

### Step 2: View Service Details (Stage 1)

**URL**: `/marketplaces/digital-intelligence/:tab/:cardId`

**Example**: `/marketplaces/digital-intelligence/projects-portfolio/delivery-velocity-analytics`

**What the user sees**:
- Service header with:
  - Service icon and title
  - Full description
  - Badges (AI-Powered, Complexity, Analytics Type)
  - Key metadata (Accuracy, Update Frequency)
  - **"Request Dashboard" button** (primary CTA)
- Five content tabs:
  1. **About**: Overview, AI capabilities, key insights, business value
  2. **AI Model**: Model architecture, accuracy metrics
  3. **Insights & Outputs**: Primary insights, dashboard views, export formats
  4. **Data & Integration**: Required data sources, integration methods
  5. **Getting Started**: Prerequisites, setup process, training resources

**User actions**:
- Read about the service
- Explore different tabs
- Click **"Request Dashboard"** button

---

### Step 3: Login Modal

**Triggered by**: Clicking "Request Dashboard" button

**What the user sees**:
- Modal overlay with login form
- Title: "Login Required"
- Description: "Please log in to access the [Service Name] dashboard"
- Email and password fields
- "Log In" button
- "Sign up" link

**User actions**:
- Enter email and password
- Click "Log In"

---

### Step 4: Redirect to Stage 2 Dashboard

**After successful login**, the user is automatically redirected to:

**URL**: `/stage2/intelligence/services/:serviceId`

**Example**: `/stage2/intelligence/services/delivery-velocity-analytics`

---

### Step 5: Interactive Dashboard (Stage 2)

**What the user sees**:

#### Header Section
- Back button to services list
- Service title and description
- Badges (transformation phase, accuracy, update frequency, AI-powered)
- Favorite star button

#### Dashboard Controls
- **Data Source Selector**: Switch between available data sources
  - Example: Azure DevOps, Jira, GitHub, GitLab
  - Shows availability status
- **Filters**: Dynamic filters based on service configuration
  - Projects, Teams, Sprints, Date Range, etc.
  - Some filters are RBAC-restricted
- **Refresh Button**: Reload dashboard data

#### Dashboard Widgets Grid
Multiple widget types displayed in a responsive grid:

1. **Metric Widgets**: KPI cards showing:
   - Current Sprint Velocity: 35 story points ↓ (10% below average)
   - Average Velocity: 40 story points
   - Predicted Next Sprint: 42 story points ↑

2. **Chart Widgets**: Interactive visualizations
   - Velocity Trend (Line chart)
   - Throughput Forecast (Bar chart)
   - Uses Recharts library

3. **Table Widgets**: Tabular data
   - Sprint Predictions table
   - Shows predicted values with confidence intervals

4. **Insight Widgets**: AI-generated insights
   - Alert: "15% Velocity Decline Detected" (87% confidence)
   - Prediction: "Velocity Recovery Expected" (78% confidence)
   - Recommendation: "Maintain Consistent Sprint Length" (92% confidence)
   - Each insight shows:
     - Type (alert/prediction/recommendation)
     - Severity (critical/high/medium/low)
     - Confidence percentage
     - Suggested action (if actionable)

#### Actions Menu
Grid of action buttons:
- **Schedule Email Report**: Set up automated reports
- **Export to Excel**: Download data as spreadsheet
- **Export to PDF**: Generate PDF report
- **Request Dashboard Update**: Suggest improvements
- **Request Data Source**: Add new integration

#### Additional Sections
- **Key Insights**: Bullet list of main insights
- **AI Capabilities**: Badges showing AI features

**User actions**:
- View real-time dashboard data
- Switch data sources
- Apply filters
- Favorite the dashboard
- Export reports
- Schedule automated reports
- Request dashboard updates

---

### Step 6: Additional Stage 2 Pages

Users can navigate to other Digital Intelligence pages:

#### Overview Dashboard
**URL**: `/stage2/intelligence/overview`

Shows:
- Key metrics (Available Services, Favorited Dashboards, Active Insights, Pending Requests)
- Favorited dashboards grid
- Recent activity feed
- Quick actions

#### Services List
**URL**: `/stage2/intelligence/services`

Shows:
- Search bar
- All available services grouped by category
- Service cards with metadata
- Click to open service dashboard

#### My Dashboards
**URL**: `/stage2/intelligence/my-dashboards`

Shows:
- Stats (Favorited, Accessed Today, Total Views)
- Favorited dashboards grid
- Recently accessed list
- Last accessed timestamps

#### My Requests
**URL**: `/stage2/intelligence/requests`

Shows:
- Request status counts (Submitted, Under Review, In Progress, Completed)
- All requests list with:
  - Request ID and status badges
  - Dashboard name
  - Description
  - Priority
  - Message count
  - Assigned staff
- Click to view request details

#### Request Detail
**URL**: `/stage2/intelligence/requests/:requestId`

Shows:
- Request header with status and priority
- Request details (type, description, data source info)
- Message thread between requester and TO staff
- Add message form
- Sidebar with:
  - Request information (dates)
  - Requester info
  - Assigned staff
  - Notification settings

---

## Navigation Structure

### Stage 2 Left Sidebar

```
Digital Intelligence
├── Overview
├── All Services
├── My Dashboards
└── My Requests
```

Clicking "Digital Intelligence" expands the sub-menu with these four options.

---

## Key Features

### 1. Role-Based Access Control (RBAC)

Services are filtered based on user role:
- **Staff**: See only their own systems/projects
- **Associate**: See team-level data
- **Manager**: See team and domain data
- **Lead**: See domain-level data
- **Director**: See cross-domain data
- **Executive**: See all organizational data

### 2. Data Source Management

- Multiple data sources per service
- Real-time switching between sources
- Availability indicators
- Request new integrations

### 3. Dashboard Customization

- Favorite dashboards for quick access
- Apply filters (with RBAC restrictions)
- Change date ranges
- Export in multiple formats
- Schedule automated reports

### 4. AI-Powered Insights

- Anomaly detection
- Trend analysis
- Predictive forecasting
- Recommendations with confidence scores
- Actionable suggestions

### 5. Collaboration

- Request dashboard updates
- Two-way messaging with TO staff
- Status tracking
- Email and in-app notifications

---

## Technical Implementation

### Routes

| Stage | Route | Component |
|-------|-------|-----------|
| 1 | `/marketplaces/digital-intelligence` | DigitalIntelligencePage |
| 1 | `/marketplaces/digital-intelligence/:tab/:cardId` | DigitalIntelligenceDetailPage |
| 2 | `/stage2/intelligence/overview` | IntelligenceOverviewPage |
| 2 | `/stage2/intelligence/services` | IntelligenceServicesPage |
| 2 | `/stage2/intelligence/services/:serviceId` | ServiceDashboardPage |
| 2 | `/stage2/intelligence/my-dashboards` | MyDashboardsPage |
| 2 | `/stage2/intelligence/requests` | MyRequestsPage |
| 2 | `/stage2/intelligence/requests/:requestId` | RequestDetailPage |

### Data Flow

1. **Stage 1**: Service data from `/src/data/digitalIntelligence/`
   - `systemsPortfolio.ts`
   - `projectsPortfolio.ts`
   - `digitalMaturity.ts`

2. **Stage 2**: Enhanced service data from `/src/data/digitalIntelligence/stage2/`
   - `intelligenceServices.ts` (30 services with full config)
   - `dashboardRequests.ts` (sample requests)
   - `sampleDashboardData.ts` (mock dashboard data)

3. **Login Flow**: `LoginModal` component
   - Detects `marketplace === "digital-intelligence"`
   - Redirects to `/stage2/intelligence/services/:serviceId`

---

## Example: Complete Flow for "Delivery Velocity Analytics"

1. User visits `/marketplaces/digital-intelligence`
2. Clicks on "Projects Portfolio & Lifecycle" tab
3. Clicks on "Delivery Velocity Analytics" card
4. Redirected to `/marketplaces/digital-intelligence/projects-portfolio/delivery-velocity-analytics`
5. Reads about the service in the detail page
6. Clicks "Request Dashboard" button
7. Login modal appears
8. User enters credentials and clicks "Log In"
9. Redirected to `/stage2/intelligence/services/delivery-velocity-analytics`
10. Sees interactive dashboard with:
    - Velocity trend chart
    - Current velocity: 35 story points (↓ 10% below average)
    - Sprint predictions table
    - AI insights about velocity decline
11. User can:
    - Switch from Azure DevOps to Jira
    - Filter by project or team
    - Export to Excel
    - Schedule weekly email reports
    - Request to add a burndown chart

---

## Summary

The Digital Intelligence service provides a seamless journey from discovery to actionable insights:

- **Stage 1**: Browse and learn about 30 AI-powered intelligence services
- **Login**: Simple authentication flow
- **Stage 2**: Access interactive dashboards with real-time data, AI insights, and collaboration features

The implementation follows the established DTMP platform patterns and provides a consistent, intuitive user experience.
