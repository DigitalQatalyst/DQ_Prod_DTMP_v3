# Digital Intelligence Stage 2 - Implementation Guide

## Overview

This document describes the complete implementation of the Digital Intelligence service in the Stage 2 Service Hub. The implementation follows the established LVE (Left-Vertical-Expanded) layout pattern used throughout the DTMP platform.

## Architecture

### Stage 1 (Marketplace)
- **Location**: `/marketplaces/digital-intelligence`
- **Purpose**: Browse and discover 30 AI-powered intelligence services
- **Categories**: 
  - Systems Portfolio & Lifecycle (12 services)
  - Projects Portfolio & Lifecycle (10 services)
  - Digital Maturity (8 services)

### Stage 2 (Service Hub)
- **Base Route**: `/stage2/intelligence`
- **Purpose**: Interactive dashboards and analytics for each intelligence service
- **Layout**: Three-column LVE layout (Left sidebar, Middle context, Right workspace)

## File Structure

```
src/
├── data/digitalIntelligence/stage2/
│   ├── types.ts                      # TypeScript interfaces
│   ├── intelligenceServices.ts       # Service definitions (30 services)
│   ├── dashboardRequests.ts          # Dashboard update requests
│   ├── sampleDashboardData.ts        # Mock dashboard data
│   └── index.ts                      # Barrel export
│
├── components/digitalIntelligence/stage2/
│   ├── MetricCard.tsx                # KPI metric display
│   ├── InsightCard.tsx               # AI insight display
│   ├── DashboardWidget.tsx           # Dashboard widget renderer
│   └── index.ts                      # Barrel export
│
└── pages/stage2/intelligence/
    ├── IntelligenceOverviewPage.tsx  # Dashboard overview
    ├── IntelligenceServicesPage.tsx  # Services list (Column 2)
    ├── ServiceDashboardPage.tsx      # Service dashboard (Column 3)
    ├── MyDashboardsPage.tsx          # User's favorited dashboards
    ├── MyRequestsPage.tsx            # Dashboard update requests
    ├── RequestDetailPage.tsx         # Individual request detail
    └── index.ts                      # Barrel export
```

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/stage2/intelligence/overview` | IntelligenceOverviewPage | Overview dashboard with favorites and activity |
| `/stage2/intelligence/services` | IntelligenceServicesPage | Browse all available services (Column 2 view) |
| `/stage2/intelligence/services/:serviceId` | ServiceDashboardPage | Interactive service dashboard (Column 3 workspace) |
| `/stage2/intelligence/my-dashboards` | MyDashboardsPage | User's favorited dashboards |
| `/stage2/intelligence/requests` | MyRequestsPage | Dashboard update requests list |
| `/stage2/intelligence/requests/:requestId` | RequestDetailPage | Individual request detail with messages |

## Navigation Flow

### From Stage 1 to Stage 2

1. User browses Digital Intelligence marketplace (`/marketplaces/digital-intelligence`)
2. User clicks on a service card
3. User views service detail page with tabs (About, AI Model, Insights, etc.)
4. User clicks "Access Intelligence Service" button
5. Login modal appears
6. After login, user is redirected to `/stage2/intelligence/services/:serviceId`
7. User sees the interactive dashboard for that specific service

### Within Stage 2

```
Overview
  ├── Browse All Services → Services List
  ├── My Dashboards → Favorited Dashboards
  └── My Requests → Request Tracking

Services List (Column 2)
  └── Click Service → Service Dashboard (Column 3)

Service Dashboard (Column 3)
  ├── View Dashboard Widgets
  ├── Change Data Source
  ├── Apply Filters
  ├── Export Reports
  ├── Schedule Email Reports
  └── Request Dashboard Update → Request Form
```

## Key Features

### 1. Intelligence Services (30 Services)

Each service includes:
- **Metadata**: Title, description, category, subcategory
- **AI Capabilities**: List of AI-powered features
- **Data Sources**: Available data source integrations
- **Dashboard Configuration**: Widget layout, filters, export options
- **RBAC**: Role-based access control and data scoping
- **Metrics**: Views, favorites, last accessed

### 2. Interactive Dashboards

Dashboard widgets support:
- **Chart Widgets**: Line, bar, area, pie charts using Recharts
- **Metric Widgets**: KPI cards with trends and severity indicators
- **Table Widgets**: Tabular data display
- **Insight Widgets**: AI-generated insights with confidence scores
- **Heatmap Widgets**: Visual heatmap representations

### 3. Data Source Management

- Multiple data source options per service
- Real-time data source switching
- Availability status indicators
- Authentication requirements
- Request new data source integration

### 4. Dashboard Customization

Users can:
- Favorite dashboards for quick access
- Apply filters (with RBAC restrictions)
- Change date ranges
- Switch between data sources
- Export to Excel, PDF, PowerPoint
- Schedule automated email reports

### 5. Dashboard Update Requests

Request types:
- **Add Visualization**: Request new charts or widgets
- **Modify Chart**: Change existing visualizations
- **Fix Data**: Report data quality issues
- **New Data Source**: Request new integration
- **Change Layout**: Modify dashboard layout

Request workflow:
1. User submits request with description and priority
2. Request assigned to Transformation Office staff
3. Two-way messaging between requester and TO staff
4. Status tracking (Submitted → Under Review → In Progress → Completed/Declined)
5. Email and in-app notifications

## Data Structures

### IntelligenceService

```typescript
interface IntelligenceService {
  id: string;
  title: string;
  category: 'systems' | 'projects' | 'maturity';
  subcategory: string;
  description: string;
  aiCapabilities: string[];
  outputType: 'dashboard' | 'excel' | 'powerpoint' | 'chart' | 'heatmap' | 'alert';
  keyInsights: string[];
  dataSource: string;
  updateFrequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
  accuracy: string;
  complexity: 'low' | 'medium' | 'high';
  transformationPhase: 'discern' | 'design' | 'deploy' | 'drive';
  visibleToRoles: string[];
  dataScope: 'own' | 'team' | 'domain' | 'all';
  availableDataSources: DataSourceOption[];
  defaultDataSource: string;
  dashboardConfig: DashboardConfig;
  views: number;
  favorites: number;
  lastAccessed?: string;
}
```

### DashboardData

```typescript
interface DashboardData {
  serviceId: string;
  dataSource: string;
  timeSeries: TimeSeriesDataPoint[];
  metrics: DashboardMetric[];
  insights: AIInsight[];
  tableData?: any[];
  generatedAt: string;
  dataRange: { start: string; end: string };
}
```

### DashboardUpdateRequest

```typescript
interface DashboardUpdateRequest {
  id: string;
  dashboardId: string;
  dashboardName: string;
  requestType: 'add-visualization' | 'modify-chart' | 'fix-data' | 'new-data-source' | 'change-layout';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  requestedBy: { id: string; name: string; email: string; role: string };
  status: 'submitted' | 'under-review' | 'in-progress' | 'completed' | 'declined';
  submittedDate: string;
  assignedTo?: { id: string; name: string; role: string };
  messages: RequestMessage[];
  notifyEmail: boolean;
  notifyInApp: boolean;
}
```

## Sample Services

### Systems Portfolio & Lifecycle

1. **System Health Analytics** - Real-time health monitoring with anomaly detection
2. **Predictive Maintenance Intelligence** - AI-powered failure predictions

### Projects Portfolio & Lifecycle

1. **Delivery Velocity Analytics** - Track and predict project delivery velocity
2. **Project Success Prediction Model** - AI model predicting project success probability

### Digital Maturity

1. **DBP Maturity Assessment** - Comprehensive maturity assessment with gap analysis

## RBAC Implementation

### Role-Based Visibility

Services are filtered based on user roles:
- **Staff**: See only their own systems/projects
- **Associate**: See team-level data
- **Manager**: See team and domain data
- **Lead**: See domain-level data
- **Director**: See cross-domain data
- **Executive**: See all organizational data

### Data Scoping

- **own**: User sees only their own data
- **team**: User sees their team's data
- **domain**: User sees their domain's data
- **all**: User sees all organizational data

## UI Components

### MetricCard

Displays KPI metrics with:
- Icon with customizable color
- Label and value
- Trend indicator (up/down/stable)
- Optional click handler

### InsightCard

Displays AI-generated insights with:
- Type icon (alert, prediction, recommendation, info)
- Severity badge (critical, high, medium, low)
- Confidence percentage
- Suggested action (if actionable)

### DashboardWidget

Renders different widget types:
- **Chart**: Line, bar, area charts using Recharts
- **Metric**: KPI display with trends
- **Table**: Tabular data
- **Insight**: AI insights list
- **Heatmap**: Visual heatmap

## Integration Points

### Stage 1 Integration

- Service cards in marketplace link to detail pages
- Detail pages have "Access Intelligence Service" button
- Login modal redirects to Stage 2 service dashboard

### Stage 2 Integration

- Left sidebar includes "Digital Intelligence" with sub-items
- Sub-items: Overview, All Services, My Dashboards, My Requests
- Clicking Digital Intelligence expands sub-menu

## Future Enhancements

1. **Real Data Integration**: Connect to actual data sources (Datadog, Azure DevOps, Jira, etc.)
2. **Advanced Filtering**: More sophisticated filter options with saved filter sets
3. **Custom Dashboards**: Allow users to create custom dashboard layouts
4. **Collaboration**: Share dashboards with team members
5. **Alerts**: Configure custom alerts based on thresholds
6. **API Access**: Programmatic access to dashboard data
7. **Mobile App**: Native mobile app for dashboard access
8. **Advanced Analytics**: More sophisticated AI models and predictions

## Testing

### Manual Testing Checklist

- [ ] Navigate from Stage 1 marketplace to Stage 2 dashboard
- [ ] Browse all services in services list
- [ ] View individual service dashboards
- [ ] Switch data sources
- [ ] Apply filters
- [ ] View AI insights
- [ ] Favorite/unfavorite dashboards
- [ ] Access My Dashboards page
- [ ] Create dashboard update request
- [ ] View request details
- [ ] Send messages on requests
- [ ] Export dashboard data
- [ ] Verify RBAC filtering
- [ ] Test responsive design on mobile

### Automated Testing

Add tests for:
- Component rendering
- Data filtering logic
- RBAC implementation
- Navigation flows
- Form submissions

## Deployment

### Build

```bash
npm run build
```

### Environment Variables

No additional environment variables required for Stage 2 Digital Intelligence.

### Dependencies

All required dependencies are already included in `package.json`:
- `react-router-dom` for routing
- `recharts` for charts
- `lucide-react` for icons
- `@radix-ui/*` for UI components

## Support

For questions or issues:
1. Check this documentation
2. Review the code comments
3. Contact the development team

## Changelog

### Version 1.0.0 (February 11, 2026)

- Initial implementation of Digital Intelligence Stage 2
- 30 intelligence services across 3 categories
- Interactive dashboards with multiple widget types
- Dashboard update request system
- RBAC implementation
- Data source management
- Export and scheduling capabilities
