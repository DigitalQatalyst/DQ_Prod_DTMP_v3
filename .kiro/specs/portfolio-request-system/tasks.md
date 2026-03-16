# Portfolio Management Request System - Implementation Tasks

## Phase 1: Data & Types Setup

- [ ] 1.1 Create request types and interfaces
  - [ ] 1.1.1 Create `src/types/requests.ts` with Request, RequestCard, RequestStatus types
  - [ ] 1.1.2 Define RequestFormData interface with all form fields
  - [ ] 1.1.3 Define RequestCardConfig interface for card data

- [ ] 1.2 Create request card data for each service
  - [ ] 1.2.1 Create `src/data/portfolio/requestCards.ts`
  - [ ] 1.2.2 Define request cards for Application Rationalization (4 cards)
  - [ ] 1.2.3 Define request cards for License Compliance (4 cards)
  - [ ] 1.2.4 Define request cards for TCO Optimization (4 cards)
  - [ ] 1.2.5 Define request cards for Technical Debt Assessment (4 cards)
  - [ ] 1.2.6 Define request cards for Application Health Dashboard (4 cards)
  - [ ] 1.2.7 Define request cards for Project Health Dashboard (4 cards)
  - [ ] 1.2.8 Define request cards for remaining services

- [ ] 1.3 Create mock request data store
  - [ ] 1.3.1 Create `src/data/requests/mockRequests.ts` for demo data
  - [ ] 1.3.2 Create utility functions for managing requests (add, update, get)

## Phase 2: Request Cards on Insights Page

- [ ] 2.1 Create RequestCard component
  - [ ] 2.1.1 Create `src/components/portfolio/RequestCard.tsx`
  - [ ] 2.1.2 Implement card UI with icon, title, description, timeline, button
  - [ ] 2.1.3 Add hover effects and responsive design
  - [ ] 2.1.4 Add click handler to open request form

- [ ] 2.2 Create RequestCardsSection component
  - [ ] 2.2.1 Create `src/components/portfolio/RequestCardsSection.tsx`
  - [ ] 2.2.2 Implement section header with title and subtitle
  - [ ] 2.2.3 Implement responsive grid layout for cards
  - [ ] 2.2.4 Filter cards based on current service

- [ ] 2.3 Add RequestCardsSection to insights pages
  - [ ] 2.3.1 Update `src/pages/PortfolioDetailPage.tsx` insights view
  - [ ] 2.3.2 Add RequestCardsSection at bottom after dashboard content
  - [ ] 2.3.3 Pass service ID to filter appropriate request cards
  - [ ] 2.3.4 Test on multiple services to verify correct cards show

## Phase 3: Request Form Modal

- [ ] 3.1 Create RequestFormModal component
  - [ ] 3.1.1 Create `src/components/portfolio/RequestFormModal.tsx`
  - [ ] 3.1.2 Implement modal structure with header, body, footer
  - [ ] 3.1.3 Add close/cancel functionality
  - [ ] 3.1.4 Implement form state management

- [ ] 3.2 Implement common form fields
  - [ ] 3.2.1 Add Service Name field (read-only, pre-filled)
  - [ ] 3.2.2 Add Request Type field (read-only, pre-filled)
  - [ ] 3.2.3 Add Priority dropdown (Low, Medium, High, Urgent)
  - [ ] 3.2.4 Add Business Justification textarea
  - [ ] 3.2.5 Add Desired Completion Date picker
  - [ ] 3.2.6 Add Primary Contact field (auto-filled)
  - [ ] 3.2.7 Add optional fields: Scope, Stakeholders, Budget Code, Additional Requirements

- [ ] 3.3 Implement request-type-specific fields
  - [ ] 3.3.1 Create field groups for Deep-Dive Analysis & Reports
  - [ ] 3.3.2 Create field groups for Workshops & Facilitation
  - [ ] 3.3.3 Create field groups for Consulting & Expert Guidance
  - [ ] 3.3.4 Create field groups for Custom Deliverables
  - [ ] 3.3.5 Conditionally render fields based on request type

- [ ] 3.4 Implement form validation
  - [ ] 3.4.1 Add validation rules for required fields
  - [ ] 3.4.2 Implement inline validation with error messages
  - [ ] 3.4.3 Disable submit button until form is valid
  - [ ] 3.4.4 Show validation errors on submit attempt

## Phase 4: Authentication & Submission

- [ ] 4.1 Implement authentication check
  - [ ] 4.1.1 Create authentication context/hook if not exists
  - [ ] 4.1.2 Check auth status on form submit
  - [ ] 4.1.3 Store form data in state when login required
  - [ ] 4.1.4 Show login modal if not authenticated

- [ ] 4.2 Implement auto-submit after login
  - [ ] 4.2.1 Listen for successful login event
  - [ ] 4.2.2 Retrieve stored form data
  - [ ] 4.2.3 Submit request automatically
  - [ ] 4.2.4 Clear stored form data after submission

- [ ] 4.3 Implement request submission
  - [ ] 4.3.1 Create request submission function
  - [ ] 4.3.2 Generate unique request ID
  - [ ] 4.3.3 Add timestamp and user info
  - [ ] 4.3.4 Save request to mock data store
  - [ ] 4.3.5 Show success confirmation message
  - [ ] 4.3.6 Redirect to request tracking dashboard

## Phase 5: Request Tracking Dashboard

- [ ] 5.1 Create RequestDashboardPage
  - [ ] 5.1.1 Create `src/pages/RequestDashboardPage.tsx`
  - [ ] 5.1.2 Set up route `/my-requests` or `/request-dashboard`
  - [ ] 5.1.3 Implement page layout with header and content area
  - [ ] 5.1.4 Add "My Requests" link to main navigation

- [ ] 5.2 Implement dashboard header
  - [ ] 5.2.1 Add page title "My Requests"
  - [ ] 5.2.2 Add status count badges (e.g., "3 In Progress, 2 Completed")
  - [ ] 5.2.3 Add filter dropdown for status
  - [ ] 5.2.4 Add search bar for service name/request ID

- [ ] 5.3 Create RequestTable component
  - [ ] 5.3.1 Create `src/components/requests/RequestTable.tsx`
  - [ ] 5.3.2 Implement table with columns: ID, Service, Type, Status, Date, Priority, Actions
  - [ ] 5.3.3 Add status badges with color coding
  - [ ] 5.3.4 Add sort functionality for columns
  - [ ] 5.3.5 Add click handler to open request details
  - [ ] 5.3.6 Implement responsive design (card view on mobile)

- [ ] 5.4 Implement filtering and search
  - [ ] 5.4.1 Filter requests by status
  - [ ] 5.4.2 Search requests by service name or ID
  - [ ] 5.4.3 Update table when filters change
  - [ ] 5.4.4 Show "No requests found" empty state

- [ ] 5.5 Add pagination
  - [ ] 5.5.1 Implement pagination if more than 20 requests
  - [ ] 5.5.2 Add page controls (prev, next, page numbers)
  - [ ] 5.5.3 Persist pagination state

## Phase 6: Request Detail View

- [ ] 6.1 Create RequestDetailModal component
  - [ ] 6.1.1 Create `src/components/requests/RequestDetailModal.tsx`
  - [ ] 6.1.2 Implement modal structure
  - [ ] 6.1.3 Add close functionality

- [ ] 6.2 Implement request information section
  - [ ] 6.2.1 Display all submitted request details
  - [ ] 6.2.2 Format dates and timestamps
  - [ ] 6.2.3 Show request ID prominently
  - [ ] 6.2.4 Display service name and request type

- [ ] 6.3 Implement status timeline
  - [ ] 6.3.1 Create visual timeline component
  - [ ] 6.3.2 Show all status changes with timestamps
  - [ ] 6.3.3 Highlight current status
  - [ ] 6.3.4 Add status descriptions

- [ ] 6.4 Implement comments/updates section
  - [ ] 6.4.1 Display comments from Portfolio Management team
  - [ ] 6.4.2 Show comment timestamps and author
  - [ ] 6.4.3 Format comments with proper styling

- [ ] 6.5 Implement deliverables section
  - [ ] 6.5.1 Show deliverables if request is completed
  - [ ] 6.5.2 Add download links for reports/documents
  - [ ] 6.5.3 Show file types and sizes
  - [ ] 6.5.4 Implement download functionality

- [ ] 6.6 Add action buttons
  - [ ] 6.6.1 Add "Close Request" button
  - [ ] 6.6.2 Add "Contact Team" button
  - [ ] 6.6.3 Add "Download All" button if multiple deliverables

## Phase 7: Status Management & Notifications

- [ ] 7.1 Implement status badge component
  - [ ] 7.1.1 Create `src/components/requests/StatusBadge.tsx`
  - [ ] 7.1.2 Implement color coding for each status
  - [ ] 7.1.3 Add icons for each status
  - [ ] 7.1.4 Make responsive and accessible

- [ ] 7.2 Add notification badge to navigation
  - [ ] 7.2.1 Update Header component to show request count
  - [ ] 7.2.2 Show badge with count of active requests
  - [ ] 7.2.3 Update count when new requests submitted
  - [ ] 7.2.4 Add visual indicator for status changes

- [ ] 7.3 Implement status update simulation
  - [ ] 7.3.1 Create utility to simulate status changes (for demo)
  - [ ] 7.3.2 Add timestamps to status changes
  - [ ] 7.3.3 Update request data store

## Phase 8: Polish & Testing

- [ ] 8.1 Implement loading states
  - [ ] 8.1.1 Add loading spinner during form submission
  - [ ] 8.1.2 Add loading state for dashboard data fetch
  - [ ] 8.1.3 Add skeleton loaders for request table

- [ ] 8.2 Implement error handling
  - [ ] 8.2.1 Handle form submission errors
  - [ ] 8.2.2 Handle data fetch errors
  - [ ] 8.2.3 Show user-friendly error messages
  - [ ] 8.2.4 Add retry functionality

- [ ] 8.3 Add empty states
  - [ ] 8.3.1 Create empty state for no requests
  - [ ] 8.3.2 Create empty state for no search results
  - [ ] 8.3.3 Add helpful messages and CTAs

- [ ] 8.4 Implement responsive design
  - [ ] 8.4.1 Test all components on mobile
  - [ ] 8.4.2 Test all components on tablet
  - [ ] 8.4.3 Adjust layouts for different screen sizes
  - [ ] 8.4.4 Test form usability on mobile

- [ ] 8.5 Add accessibility features
  - [ ] 8.5.1 Add ARIA labels to all interactive elements
  - [ ] 8.5.2 Ensure keyboard navigation works
  - [ ] 8.5.3 Test with screen reader
  - [ ] 8.5.4 Ensure color contrast meets WCAG standards

- [ ] 8.6 Test complete user flows
  - [ ] 8.6.1 Test: Browse → View Insights → Request Service → Track Request
  - [ ] 8.6.2 Test: Request without login → Login → Auto-submit
  - [ ] 8.6.3 Test: Filter and search requests
  - [ ] 8.6.4 Test: View request details and download deliverables
  - [ ] 8.6.5 Test: Multiple requests across different services

## Phase 9: Documentation & Cleanup                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         

- [ ] 9.1 Add code comments
  - [ ] 9.1.1 Document complex logic
  - [ ] 9.1.2 Add JSDoc comments to components
  - [ ] 9.1.3 Document data structures

- [ ] 9.2 Update README or documentation
  - [ ] 9.2.1 Document request system features
  - [ ] 9.2.2 Add screenshots or diagrams
  - [ ] 9.2.3 Document mock data structure

- [ ] 9.3 Code cleanup
  - [ ] 9.3.1 Remove console.logs and debug code
  - [ ] 9.3.2 Remove unused imports
  - [ ] 9.3.3 Format code consistently
  - [ ] 9.3.4 Run linter and fix issues
