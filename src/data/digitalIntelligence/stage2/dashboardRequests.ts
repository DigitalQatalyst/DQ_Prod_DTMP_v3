import { DashboardUpdateRequest } from './types';

export const dashboardRequests: DashboardUpdateRequest[] = [
  {
    id: 'REQ-INT-2026-001',
    dashboardId: 'delivery-velocity-analytics',
    dashboardName: 'Delivery Velocity Analytics',
    requestType: 'add-visualization',
    priority: 'medium',
    description: 'Please add a burndown chart showing story points remaining per sprint. This will help us track sprint progress more effectively.',
    requestedBy: {
      id: 'user-042',
      name: 'Sarah Chen',
      email: 'sarah.chen@company.com',
      role: 'Project Manager'
    },
    status: 'in-progress',
    submittedDate: '2026-02-05T10:30:00Z',
    expectedCompletionDate: '2026-02-15T00:00:00Z',
    assignedTo: {
      id: 'staff-008',
      name: 'David Kim',
      role: 'Intelligence Platform Developer'
    },
    messages: [
      {
        id: 'msg-001',
        from: { name: 'David Kim', role: 'transformation-office' },
        to: 'Sarah Chen',
        message: "Thanks for the request! I'm working on adding the burndown chart. Should be ready by end of next week. Will it show story points or task count?",
        timestamp: '2026-02-06T14:20:00Z'
      },
      {
        id: 'msg-002',
        from: { name: 'Sarah Chen', role: 'requester' },
        to: 'David Kim',
        message: 'Story points would be perfect. Also, can it show the ideal burndown line for comparison? Thanks!',
        timestamp: '2026-02-06T15:45:00Z'
      },
      {
        id: 'msg-003',
        from: { name: 'David Kim', role: 'transformation-office' },
        to: 'Sarah Chen',
        message: "Absolutely! I'll include both actual and ideal burndown lines. Will send you a preview later this week.",
        timestamp: '2026-02-07T09:15:00Z'
      }
    ],
    notifyEmail: true,
    notifyInApp: true
  },
  {
    id: 'REQ-INT-2026-002',
    dashboardId: 'delivery-velocity-analytics',
    dashboardName: 'Delivery Velocity Analytics',
    requestType: 'new-data-source',
    priority: 'high',
    description: 'Request integration with GitLab so we can track velocity from GitLab issues alongside Azure DevOps.',
    requestedDataSource: {
      name: 'GitLab',
      instanceUrl: 'https://gitlab.company.com',
      justification: 'Our mobile team uses GitLab for project tracking. We need unified velocity metrics across both Azure DevOps and GitLab.',
      estimatedUsers: 'my-team'
    },
    requestedBy: {
      id: 'user-089',
      name: 'Michael Torres',
      email: 'michael.torres@company.com',
      role: 'Engineering Manager'
    },
    status: 'under-review',
    submittedDate: '2026-02-08T11:00:00Z',
    assignedTo: {
      id: 'staff-012',
      name: 'Jennifer Park',
      role: 'Integration Engineer'
    },
    messages: [
      {
        id: 'msg-101',
        from: { name: 'Jennifer Park', role: 'transformation-office' },
        to: 'Michael Torres',
        message: "Hi Michael, reviewing your GitLab integration request. I'll need OAuth credentials for your GitLab instance. Can you coordinate with your GitLab admin to create an application for our intelligence platform?",
        timestamp: '2026-02-09T10:30:00Z'
      }
    ],
    notifyEmail: true,
    notifyInApp: true
  },
  {
    id: 'REQ-INT-2026-003',
    dashboardId: 'system-health-analytics',
    dashboardName: 'System Health Analytics',
    requestType: 'modify-chart',
    priority: 'low',
    description: 'Can we change the health trend chart to show weekly averages instead of daily? Daily data is too noisy for our executive reports.',
    requestedBy: {
      id: 'user-156',
      name: 'Amanda Rodriguez',
      email: 'amanda.rodriguez@company.com',
      role: 'Director of IT Operations'
    },
    status: 'completed',
    submittedDate: '2026-01-28T14:20:00Z',
    expectedCompletionDate: '2026-02-05T00:00:00Z',
    actualCompletionDate: '2026-02-03T16:45:00Z',
    assignedTo: {
      id: 'staff-008',
      name: 'David Kim',
      role: 'Intelligence Platform Developer'
    },
    messages: [
      {
        id: 'msg-201',
        from: { name: 'David Kim', role: 'transformation-office' },
        to: 'Amanda Rodriguez',
        message: 'Great suggestion! I\'ve added a toggle to switch between daily and weekly views. You can now select your preferred aggregation level.',
        timestamp: '2026-02-03T16:45:00Z'
      }
    ],
    resolution: 'Added aggregation toggle to health trend chart. Users can now switch between daily, weekly, and monthly views.',
    notifyEmail: true,
    notifyInApp: true
  },
  {
    id: 'REQ-INT-2026-004',
    dashboardId: 'dbp-maturity-assessment',
    dashboardName: 'DBP Maturity Assessment',
    requestType: 'fix-data',
    priority: 'urgent',
    description: 'The maturity scores for the Integration domain seem incorrect. They\'re showing 2.5 but our recent assessment indicated 3.8.',
    requestedBy: {
      id: 'user-203',
      name: 'Robert Chang',
      email: 'robert.chang@company.com',
      role: 'Enterprise Architect'
    },
    status: 'in-progress',
    submittedDate: '2026-02-10T09:15:00Z',
    expectedCompletionDate: '2026-02-12T00:00:00Z',
    assignedTo: {
      id: 'staff-015',
      name: 'Lisa Thompson',
      role: 'Data Quality Analyst'
    },
    messages: [
      {
        id: 'msg-301',
        from: { name: 'Lisa Thompson', role: 'transformation-office' },
        to: 'Robert Chang',
        message: 'Thanks for reporting this! I\'m investigating the data pipeline. Can you share the assessment ID or date so I can trace the source?',
        timestamp: '2026-02-10T11:30:00Z'
      },
      {
        id: 'msg-302',
        from: { name: 'Robert Chang', role: 'requester' },
        to: 'Lisa Thompson',
        message: 'Sure! Assessment ID: MAT-2026-Q1-003, completed on February 1st, 2026.',
        timestamp: '2026-02-10T13:45:00Z'
      }
    ],
    notifyEmail: true,
    notifyInApp: true
  },
  {
    id: 'REQ-INT-2026-005',
    dashboardId: 'predictive-maintenance-intelligence',
    dashboardName: 'Predictive Maintenance Intelligence',
    requestType: 'change-layout',
    priority: 'low',
    description: 'Could we move the maintenance schedule table to the top? It\'s the most important information for our team.',
    requestedBy: {
      id: 'user-178',
      name: 'Kevin Martinez',
      email: 'kevin.martinez@company.com',
      role: 'Infrastructure Manager'
    },
    status: 'submitted',
    submittedDate: '2026-02-11T08:00:00Z',
    messages: [],
    notifyEmail: false,
    notifyInApp: true
  }
];
