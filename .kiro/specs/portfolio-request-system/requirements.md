# Portfolio Management Request System - Requirements

## Overview
Implement a service request and tracking system for Portfolio Management services. Users can view live dashboards with their organization's data on the insights page, then request expert services (deep-dive analysis, reports, workshops, consulting) from the Portfolio Management team. The system allows users to submit service requests and track their status and fulfillment.

## Context
- The DTMP platform is owned and operated by the organization
- Insights pages show **live data** from the organization's actual systems (CMDB, ServiceNow, etc.)
- Users request **expert services and deliverables** from the Portfolio Management team, not data access
- Requests are for: detailed analysis, custom reports, workshops, consulting, action plans

## User Stories

### US-1: View Request Cards on Insights Page
**As a** portfolio manager  
**I want to** see available service request options after viewing live dashboards  
**So that** I can request expert services from the Portfolio Management team

**Acceptance Criteria:**
- 1.1: Request cards section appears at bottom of insights page after dashboard content
- 1.2: Section has clear heading: "Request Expert Services" or similar
- 1.3: Number of request cards varies by service (3-5 cards depending on service type)
- 1.4: Each request card displays:
  - Request type title (e.g., "Deep-Dive Analysis Report")
  - Brief description of what user will receive
  - Estimated timeline (e.g., "2-3 weeks")
  - "Request This" button
- 1.5: Cards are visually distinct and easy to scan
- 1.6: Cards are contextual to the service being viewed

### US-2: Open Request Form from Card
**As a** user  
**I want to** click "Request This" on a specific request card  
**So that** I can fill out a form for that specific service request

**Acceptance Criteria:**
- 2.1: Clicking "Request This" opens a modal with request form
- 2.2: Request type is pre-filled and locked (cannot be changed)
- 2.3: Form title shows the request type selected
- 2.4: Form includes service-specific fields based on the request type
- 2.5: User must go back to insights page to select different request type
- 2.6: Modal has clear "Cancel" and "Submit Request" buttons

### US-3: Submit Service Request (Authenticated)
**As a** logged-in user  
**I want to** submit a service request with all necessary details  
**So that** the Portfolio Management team can process my request

**Acceptance Criteria:**
- 3.1: User can fill out request form with required fields
- 3.2: Form validates all required fields before submission
- 3.3: User receives confirmation message upon successful submission
- 3.4: User is redirected to request tracking dashboard after submission
- 3.5: Request is assigned a unique tracking ID
- 3.6: Request includes timestamp and user information

### US-4: Authentication Check on Submission
**As a** non-authenticated user  
**I want to** be prompted to login when I try to submit a request  
**So that** my request is associated with my account

**Acceptance Criteria:**
- 4.1: User can fill out the request form without being logged in
- 4.2: When user clicks "Submit Request", system checks authentication status
- 4.3: If not authenticated, login modal appears
- 4.4: Form data is preserved while login modal is shown
- 4.5: After successful login, request is submitted automatically
- 4.6: User is redirected to request tracking dashboard after auto-submission

### US-5: View Request Tracking Dashboard
**As a** logged-in user  
**I want to** view all my submitted requests in one place  
**So that** I can track their status and progress

**Acceptance Criteria:**
- 5.1: Dashboard is accessible from main navigation/header (e.g., "My Requests")
- 5.2: Dashboard route is `/my-requests` or `/request-dashboard`
- 5.3: Dashboard displays all user's requests across all services in unified view
- 5.4: Each request shows: Request ID, Service Name, Request Type, Status, Submitted Date, Priority
- 5.5: Requests can be filtered by status (All, Submitted, In Progress, Completed, etc.)
- 5.6: Requests can be sorted by date, priority, or status
- 5.7: User can search requests by service name or request ID
- 5.8: Dashboard shows count of requests by status (e.g., "3 In Progress, 2 Completed")

### US-6: View Request Details
**As a** logged-in user  
**I want to** view detailed information about a specific request  
**So that** I can see its full history and any deliverables

**Acceptance Criteria:**
- 6.1: Clicking on a request opens detailed view (modal or separate page)
- 6.2: Detail view shows all request information submitted
- 6.3: Detail view shows status history with timestamps
- 6.4: Detail view shows any comments or updates from Portfolio Management team
- 6.5: If completed, detail view shows deliverables (reports, links, documents)
- 6.6: User can download deliverables if available
- 6.7: Detail view shows estimated completion date if provided

### US-7: Request Status Updates
**As a** user  
**I want to** see real-time status updates on my requests  
**So that** I know when action is needed or when deliverables are ready

**Acceptance Criteria:**
- 7.1: Request status is displayed with clear visual indicators (badges, colors)
- 7.2: Status options include: Submitted, Under Review, Approved, In Progress, Pending Information, Completed, Delivered, Closed
- 7.3: Status changes are timestamped
- 7.4: User receives visual notification when status changes (badge count in navigation)
- 7.5: Status colors are consistent: 
  - Submitted/Under Review: Blue
  - Approved/In Progress: Orange
  - Pending Information: Yellow
  - Completed/Delivered: Green
  - Closed: Gray

## Request Types for Portfolio Management

### What Users Are Requesting
Since users can already view live dashboards with their organization's data, they request **expert services and deliverables** from the Portfolio Management team:

### Deep-Dive Analysis & Reports
- **Detailed Assessment Report** - In-depth analysis with recommendations and action plans
- **Executive Summary Report** - High-level findings for leadership presentations
- **Custom Analysis** - Targeted analysis for specific portfolio challenges
- **Comparative Analysis** - Benchmarking against industry standards

### Workshops & Facilitation
- **Strategy Workshop** - Facilitated session to develop portfolio strategy
- **Prioritization Workshop** - Score and prioritize applications/projects with stakeholders
- **Decision-Making Workshop** - Facilitate key portfolio decisions
- **Training Workshop** - Train team on portfolio management practices

### Consulting & Expert Guidance
- **Expert Consultation** - One-on-one guidance from portfolio experts
- **Implementation Support** - Help executing recommendations
- **Roadmap Development** - Create detailed implementation roadmap
- **Best Practice Review** - Review current practices and recommend improvements

### Custom Deliverables
- **Board Presentation** - Executive presentation based on dashboard data
- **Business Case Development** - Build business case for portfolio initiatives
- **Policy/Procedure Documentation** - Document portfolio management processes
- **Tool Configuration** - Help configure or customize portfolio tools

## Service-Specific Request Cards

### Application Rationalization Assessment
1. **Deep-Dive Rationalization Report** (3-4 weeks)
   - Detailed analysis of all applications with retirement/consolidation recommendations
2. **Rationalization Workshop** (1-2 days)
   - Facilitated scoring session with stakeholders to prioritize actions
3. **Executive Summary Report** (1-2 weeks)
   - High-level findings and recommendations for leadership
4. **Implementation Roadmap** (2-3 weeks)
   - Detailed plan for executing rationalization recommendations

### License Compliance & Optimization
1. **Compliance Audit Report** (2-3 weeks)
   - Full audit of license compliance with risk assessment
2. **Optimization Analysis** (2-3 weeks)
   - Identify cost-saving opportunities and optimization recommendations
3. **Vendor Negotiation Support** (Varies)
   - Expert support for upcoming license renewals
4. **Compliance Workshop** (Half-day)
   - Train team on license management best practices

### TCO Optimization
1. **Detailed TCO Analysis Report** (3-4 weeks)
   - Comprehensive cost analysis with optimization recommendations
2. **Cost Reduction Roadmap** (2-3 weeks)
   - Prioritized plan for reducing total cost of ownership
3. **Executive Cost Presentation** (1-2 weeks)
   - Board-ready presentation of TCO findings
4. **TCO Workshop** (1 day)
   - Facilitate cost optimization strategy session

### Technical Debt Assessment
1. **Technical Debt Report** (3-4 weeks)
   - Quantified technical debt with remediation priorities
2. **Remediation Roadmap** (2-3 weeks)
   - Detailed plan for addressing technical debt
3. **Risk Assessment Workshop** (Half-day)
   - Prioritize technical debt based on business risk
4. **Architecture Review** (2-3 weeks)
   - Expert review of application architecture

### Application Portfolio Health Dashboard
1. **Health Trend Analysis Report** (1-2 weeks)
   - Analysis of health trends with predictive insights
2. **Remediation Action Plan** (2-3 weeks)
   - Detailed plan to address health issues
3. **Health Review Workshop** (Half-day)
   - Review health metrics with stakeholders
4. **Custom Health Metrics** (2-3 weeks)
   - Configure custom health indicators for your portfolio

### Project Portfolio Health Dashboard
1. **Portfolio Health Report** (1-2 weeks)
   - Executive summary of project portfolio health
2. **At-Risk Project Analysis** (1-2 weeks)
   - Deep-dive into projects showing health concerns
3. **Portfolio Optimization Workshop** (1 day)
   - Optimize project portfolio for better outcomes
4. **PMO Best Practices Review** (2-3 weeks)
   - Review and improve project management practices

## Request Status Workflow

1. **Submitted** - Request received, awaiting review
2. **Under Review** - Service team evaluating request
3. **Approved** - Request approved, work scheduled
4. **In Progress** - Work being performed
5. **Pending Information** - Waiting for user input/clarification
6. **Completed** - Deliverable ready for review
7. **Delivered** - User has received deliverable
8. **Closed** - Request fulfilled and closed

## Common Request Form Fields

### Required Fields (All Requests)
- **Service Name** (auto-populated, read-only)
- **Request Type** (auto-populated from card clicked, read-only)
- **Priority** (dropdown: Low, Medium, High, Urgent)
- **Business Justification** (text area, 500 char max)
- **Desired Completion Date** (date picker)
- **Primary Contact** (auto-filled with user info, editable)

### Optional Fields (All Requests)
- **Scope** (dropdown: Enterprise-wide, Business Unit, Department, Specific Applications)
- **Stakeholders** (multi-line text or tags)
- **Budget Code** (text input for tracking/billing)
- **Additional Requirements** (text area)

### Request Type-Specific Fields

#### Deep-Dive Analysis & Reports
- **Report Format** (dropdown: PDF, PowerPoint, Excel, Word)
- **Presentation Required** (checkbox)
- **Number of Applications/Projects** (number input)
- **Specific Focus Areas** (multi-select or text)

#### Workshops & Facilitation
- **Number of Participants** (number input)
- **Preferred Dates** (date range picker, multiple options)
- **Duration** (dropdown: Half-day, Full-day, 2-day)
- **Location** (dropdown: Virtual, On-site, Hybrid)
- **Workshop Objectives** (text area)

#### Consulting & Expert Guidance
- **Consultation Type** (dropdown: One-time, Ongoing, Project-based)
- **Estimated Hours Needed** (number input)
- **Specific Expertise Required** (text area)
- **Preferred Consultant** (optional dropdown)

#### Custom Deliverables
- **Deliverable Type** (text input)
- **Target Audience** (dropdown: Executive, Management, Technical, All)
- **Format Requirements** (text area)
- **Branding Requirements** (checkbox: Use company template)

## Non-Functional Requirements

### Performance
- Request form should load in < 1 second
- Request submission should complete in < 2 seconds
- Request dashboard should load in < 2 seconds

### Usability
- Form should be mobile-responsive
- Clear error messages for validation failures
- Progress indicators during submission
- Intuitive navigation between request list and details

### Security
- All requests must be associated with authenticated users
- Users can only view their own requests
- Request data should be validated on both client and server side

## Out of Scope (Future Enhancements)
- Email notifications for status changes
- Request cancellation/modification
- File attachments to requests
- Admin interface for managing requests
- Request approval workflow
- SLA tracking and escalation
- Integration with actual backend services


## User Flow

### Complete User Journey
1. **Browse Marketplace** - User navigates to Portfolio Management marketplace
2. **Select Service** - User clicks on service card (e.g., "Application Rationalization Assessment")
3. **View Details** - User reads service details on detail page
4. **Explore Insights** - User clicks "Explore Insights" button
5. **View Live Dashboard** - User sees live dashboard with their organization's actual data
6. **Review Request Cards** - User scrolls to bottom and sees 3-5 request cards
7. **Select Request** - User clicks "Request This" on desired request card
8. **Fill Form** - Request form modal opens with pre-filled request type
9. **Submit Request** - User fills required fields and clicks "Submit Request"
10. **Authentication Check** - If not logged in, login modal appears
11. **Auto-Submit** - After login, request submits automatically
12. **View Confirmation** - User sees success message with request ID
13. **Redirect to Dashboard** - User is taken to request tracking dashboard
14. **Track Request** - User can view and track all requests in unified dashboard

### Request Tracking Flow
1. **Access Dashboard** - User clicks "My Requests" in navigation
2. **View All Requests** - See table/list of all submitted requests
3. **Filter/Search** - Filter by status or search by service/ID
4. **View Details** - Click on request to see full details
5. **Check Status** - See current status and history
6. **Download Deliverables** - If completed, download reports/documents
7. **Close Request** - Mark request as closed when satisfied

## UI/UX Guidelines

### Request Cards Section
- **Location**: Bottom of insights page, after all dashboard content
- **Heading**: "Request Expert Services" with subtitle explaining what users can request
- **Layout**: Grid of 3-5 cards (responsive: 1 column mobile, 2-3 columns tablet, 3-4 columns desktop)
- **Card Design**:
  - Icon representing request type
  - Bold title
  - 2-3 line description
  - Estimated timeline badge
  - Prominent "Request This" button
  - Hover effect to indicate interactivity

### Request Form Modal
- **Size**: Medium modal (600-700px wide)
- **Header**: Service name + Request type
- **Body**: Form fields with clear labels and help text
- **Footer**: "Cancel" (secondary) and "Submit Request" (primary) buttons
- **Validation**: Inline validation with clear error messages
- **Loading State**: Show spinner during submission

### Request Tracking Dashboard
- **Layout**: Full-page dashboard with sidebar navigation
- **Header**: "My Requests" with count badges by status
- **Filters**: Status filter dropdown + search bar
- **Table Columns**: Request ID, Service, Type, Status, Date, Priority, Actions
- **Status Badges**: Color-coded badges for visual scanning
- **Empty State**: Friendly message when no requests exist
- **Pagination**: If more than 20 requests

### Request Detail View
- **Layout**: Modal or slide-out panel
- **Sections**:
  - Request Information (what was submitted)
  - Status Timeline (visual timeline of status changes)
  - Comments/Updates (from Portfolio Management team)
  - Deliverables (download links if completed)
- **Actions**: Download, Close Request, Contact Team
