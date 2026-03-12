# Portfolio Data Alignment Between Stage 2 and Stage 3

## Overview

This implementation ensures data consistency and alignment between Stage 2 (Portfolio Management user view) and Stage 3 (TO Operations view) based on user roles and permissions.

## Key Components

### 1. Enhanced Portfolio Request State (`src/data/portfolio/requestState.ts`)

**New Fields Added:**
- `requestTitle`: Display title matching user interface
- `priority`: "Low" | "Medium" | "High" priority levels
- `targetDate`: Expected completion date
- `progress`: Completion percentage (0-100)

**Sample Data:**
- Dependency Impact Analysis Request (David Chen)
- Deep-Dive Rationalization Report (Maria Rodriguez) 
- Remediation Action Plan (Sarah Johnson)
- Health Review Workshop (Michael Thompson)

### 2. Data Alignment Utilities (`src/data/portfolio/dataAlignment.ts`)

**Core Functions:**
- `getAlignedPortfolioData()`: Returns aligned data based on user role
- `getVisiblePortfolioRequests()`: Filters requests by user permissions
- `findLinkedRequests()`: Links Stage 2 and Stage 3 requests
- `syncRequestStatus()`: Synchronizes status between views
- `getPortfolioRequestStats()`: Dashboard statistics

**Role-Based Access:**
- **Business Users**: See only their own requests
- **TO Operations/Admin**: See all requests across the organization

### 3. Status Mapping

**Portfolio → Stage 3:**
- "Open" → "new"
- "In Review" → "in-progress" 
- "Resolved" → "completed"

**Stage 3 → Portfolio:**
- "new", "assigned" → "Open"
- "in-progress", "pending-review", "pending-user" → "In Review"
- "completed" → "Resolved"
- "on-hold", "cancelled" → "Open" (for potential re-work)

### 4. Request Linking

**Bidirectional Links:**
- Portfolio requests contain `stage3RequestId`
- Stage 3 requests contain `relatedAssets` with `portfolio-request:` prefix
- Automatic linking during intake process

## User Experience Alignment

### Stage 2 (User View)
- Shows "My Assessment Requests" with user-friendly titles
- Displays progress bars and status indicators
- Filtered by current user's requests (for business users)

### Stage 3 (Operations View)  
- Shows operational request management interface
- Includes assignment, SLA tracking, and workflow management
- Full visibility across all portfolio requests (for TO staff)

## Data Flow

1. **Request Creation**: User submits request in Stage 2 Portfolio Management
2. **Intake Processing**: `createPortfolioStage3Intake()` creates both records atomically
3. **Status Sync**: Changes in either view automatically sync to the other
4. **Role-Based Display**: Data filtered and presented based on user role

## Key Benefits

✅ **Consistent Data**: Same requests appear in both views with proper linking
✅ **Role-Based Security**: Users see only appropriate data for their role  
✅ **Real-Time Sync**: Status changes sync between Stage 2 and Stage 3
✅ **Operational Efficiency**: TO staff can manage all requests centrally
✅ **User Experience**: Business users see simplified, relevant view

## Implementation Details

### Sample Request Alignment

**Stage 2 Display:**
```
Dependency Impact Analysis Request
Application Dependency Mapping
Priority: Medium | Submitted: 3/5/2026 | Target: 3/11/2026
Status: Submitted | Progress: 0%
```

**Stage 3 Display:**
```
Application Portfolio Health Assessment  
REQ-2026-007 | David Chen (Enterprise Architecture)
Status: assigned | Priority: high | Assigned: Lisa Wang
SLA: on-track | Due: 3/16/2026
```

### Data Consistency Checks

- Request IDs are properly linked via `relatedAssets`
- Status changes trigger bidirectional updates
- User permissions respected in all data access
- Sample data matches the interface mockups provided

This implementation ensures seamless data alignment between user and operational views while maintaining proper security and role-based access controls.