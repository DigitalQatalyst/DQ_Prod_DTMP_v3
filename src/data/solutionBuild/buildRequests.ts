import type { BuildRequest } from './types';

export const buildRequests: BuildRequest[] = [
  // INTAKE Status - Just submitted, no assessment yet
  {
    id: 'BLD-2026-001',
    type: 'custom',
    status: 'intake',
    priority: 'high',
    name: 'Customer 360 Data Platform',
    businessNeed: 'Consolidate customer data from 15+ sources into unified platform for better insights and personalization',
    requestedBy: 'Current User',
    sponsor: 'Michael Chen',
    department: 'Marketing',
    submittedAt: '2026-01-28',
    targetDate: '2026-06-30',
    budget: { approved: 0, spent: 0 },
    requirements: [
      { id: 'req-001', description: 'Integrate CRM, ERP, and web analytics', status: 'pending', priority: 'high' },
      { id: 'req-002', description: 'Real-time data synchronization', status: 'pending', priority: 'high' },
      { id: 'req-003', description: 'Customer segmentation engine', status: 'pending', priority: 'medium' }
    ],
    progress: 0,
    phases: [
      { id: 'phase-1', name: 'Discovery', status: 'not-started', progress: 0, tasks: [] },
      { id: 'phase-2', name: 'Design', status: 'not-started', progress: 0, tasks: [] },
      { id: 'phase-3', name: 'Development', status: 'not-started', progress: 0, tasks: [] },
      { id: 'phase-4', name: 'Testing', status: 'not-started', progress: 0, tasks: [] },
      { id: 'phase-5', name: 'Deployment', status: 'not-started', progress: 0, tasks: [] }
    ],
    blockers: [],
    deliverables: [],
    documents: [],
    messages: [
      { id: 'msg-001', sender: 'System', content: 'Request submitted successfully. Our team will review within 2 business days.', timestamp: '2026-01-28T14:30:00Z', mentions: [] }
    ],
    linkedSpecId: 'spec-cdp-001'
  },
  {
    id: 'BLD-2026-002',
    type: 'pre-built',
    status: 'intake',
    priority: 'medium',
    name: 'CI/CD Pipeline for Mobile Apps',
    businessNeed: 'Automate mobile app build and deployment process to reduce release time from 2 weeks to 2 days',
    requestedBy: 'David Park',
    sponsor: 'Lisa Anderson',
    department: 'Engineering',
    submittedAt: '2026-01-27',
    budget: { approved: 0, spent: 0 },
    requirements: [
      { id: 'req-004', description: 'Support iOS and Android builds', status: 'pending', priority: 'high' },
      { id: 'req-005', description: 'Automated testing integration', status: 'pending', priority: 'high' }
    ],
    progress: 0,
    phases: [
      { id: 'phase-1', name: 'Discovery', status: 'not-started', progress: 0, tasks: [] },
      { id: 'phase-2', name: 'Design', status: 'not-started', progress: 0, tasks: [] },
      { id: 'phase-3', name: 'Development', status: 'not-started', progress: 0, tasks: [] },
      { id: 'phase-4', name: 'Testing', status: 'not-started', progress: 0, tasks: [] },
      { id: 'phase-5', name: 'Deployment', status: 'not-started', progress: 0, tasks: [] }
    ],
    blockers: [],
    deliverables: [],
    documents: [],
    messages: []
  },

  // TRIAGE Status - Under TO assessment
  {
    id: 'BLD-2026-003',
    type: 'custom',
    status: 'triage',
    priority: 'critical',
    name: 'Zero Trust Network Implementation',
    businessNeed: 'Implement zero trust security model to meet new compliance requirements by Q2',
    requestedBy: 'Current User',
    sponsor: 'Jennifer Lee',
    department: 'Security',
    submittedAt: '2026-01-25',
    targetDate: '2026-04-30',
    budget: { approved: 0, spent: 0 },
    requirements: [
      { id: 'req-006', description: 'Identity-centric access controls', status: 'pending', priority: 'critical' },
      { id: 'req-007', description: 'Micro-segmentation implementation', status: 'pending', priority: 'high' },
      { id: 'req-008', description: 'Continuous verification', status: 'pending', priority: 'high' }
    ],
    progress: 5,
    phases: [
      { id: 'phase-1', name: 'Discovery', status: 'in-progress', progress: 25, tasks: [
        { id: 'task-001', title: 'Security assessment', completed: true },
        { id: 'task-002', title: 'Requirements gathering', completed: false }
      ]},
      { id: 'phase-2', name: 'Design', status: 'not-started', progress: 0, tasks: [] },
      { id: 'phase-3', name: 'Development', status: 'not-started', progress: 0, tasks: [] },
      { id: 'phase-4', name: 'Testing', status: 'not-started', progress: 0, tasks: [] },
      { id: 'phase-5', name: 'Deployment', status: 'not-started', progress: 0, tasks: [] }
    ],
    blockers: [],
    deliverables: [],
    documents: [
      { id: 'doc-001', name: 'Security Requirements.pdf', type: 'pdf', uploadedAt: '2026-01-25', uploadedBy: 'Current User', url: '#', size: 2456789 }
    ],
    messages: [
      { id: 'msg-002', sender: 'TO Team', content: 'Under review for team assignment. Complexity assessment in progress.', timestamp: '2026-01-26T10:00:00Z', mentions: [] },
      { id: 'msg-003', sender: 'TO Team', content: 'Initial assessment: 12-week effort, recommending Team Delta for security expertise.', timestamp: '2026-01-27T15:30:00Z', mentions: ['Current User'] }
    ],
    toAssessment: {
      assessedBy: 'TO Team',
      assessedAt: '2026-01-26',
      estimatedEffort: 12,
      estimatedCost: 200000,
      recommendedTeam: 'team-delta',
      notes: 'Complex security implementation requiring Delta team expertise',
      approved: false
    }
  },

  // QUEUE Status - Approved, waiting for team
  {
    id: 'BLD-2026-004',
    type: 'enhancement',
    status: 'queue',
    priority: 'high',
    name: 'API Gateway Performance Optimization',
    businessNeed: 'Improve API response times by 50% to support growing user base',
    requestedBy: 'Current User',
    sponsor: 'Kevin Brown',
    department: 'Platform',
    submittedAt: '2026-01-20',
    targetDate: '2026-04-15',
    budget: { approved: 85000, spent: 0 },
    requirements: [
      { id: 'req-009', description: 'Implement caching layer', status: 'approved', priority: 'high' },
      { id: 'req-010', description: 'Optimize database queries', status: 'approved', priority: 'high' },
      { id: 'req-011', description: 'Add load balancing', status: 'approved', priority: 'medium' }
    ],
    assignedTeam: 'team-alpha',
    queuePosition: 2,
    estimatedDelivery: '2026-04-10',
    progress: 10,
    phases: [
      { id: 'phase-1', name: 'Discovery', status: 'completed', progress: 100, tasks: [
        { id: 'task-003', title: 'Performance analysis', completed: true },
        { id: 'task-004', title: 'Bottleneck identification', completed: true }
      ]},
      { id: 'phase-2', name: 'Design', status: 'in-progress', progress: 50, tasks: [
        { id: 'task-005', title: 'Architecture design', completed: true },
        { id: 'task-006', title: 'Caching strategy', completed: false }
      ]},
      { id: 'phase-3', name: 'Development', status: 'not-started', progress: 0, tasks: [] },
      { id: 'phase-4', name: 'Testing', status: 'not-started', progress: 0, tasks: [] },
      { id: 'phase-5', name: 'Deployment', status: 'not-started', progress: 0, tasks: [] }
    ],
    blockers: [],
    deliverables: [
      { id: 'del-001', type: 'solution', name: 'Optimized API Gateway', dueDate: '2026-04-05', completed: false },
      { id: 'del-002', type: 'documentation', name: 'Performance Report', dueDate: '2026-04-10', completed: false }
    ],
    documents: [
      { id: 'doc-002', name: 'Performance Analysis.pdf', type: 'pdf', uploadedAt: '2026-01-21', uploadedBy: 'Team Alpha', url: '#', size: 1234567 }
    ],
    messages: [
      { id: 'msg-004', sender: 'TO Team', content: 'Request approved! Budget: $85,000. Assigned to Team Alpha.', timestamp: '2026-01-21T09:00:00Z', mentions: ['Current User'] },
      { id: 'msg-005', sender: 'Team Alpha Lead', content: 'Queued for Sprint 5 starting Feb 3. Position #2 in queue.', timestamp: '2026-01-22T14:30:00Z', mentions: ['Current User'] }
    ],
    toAssessment: {
      assessedBy: 'TO Team',
      assessedAt: '2026-01-21',
      estimatedEffort: 6,
      estimatedCost: 85000,
      recommendedTeam: 'team-alpha',
      notes: 'Performance optimization within Alpha team capabilities',
      approved: true
    }
  },

  // IN-PROGRESS Status - Active development
  {
    id: 'BLD-2025-089',
    type: 'custom',
    status: 'in-progress',
    priority: 'high',
    name: 'Real-Time Analytics Dashboard',
    businessNeed: 'Executive dashboard with real-time KPIs for data-driven decision making',
    requestedBy: 'Current User',
    sponsor: 'Thomas Wilson',
    department: 'Executive',
    submittedAt: '2025-12-10',
    targetDate: '2026-03-15',
    budget: { approved: 145000, spent: 87000 },
    requirements: [
      { id: 'req-012', description: 'Real-time data ingestion', status: 'completed', priority: 'high' },
      { id: 'req-013', description: 'Interactive visualizations', status: 'in-progress', priority: 'high' },
      { id: 'req-014', description: 'Mobile responsive design', status: 'in-progress', priority: 'medium' },
      { id: 'req-015', description: 'Export capabilities', status: 'pending', priority: 'low' }
    ],
    assignedTeam: 'team-beta',
    estimatedDelivery: '2026-03-10',
    progress: 65,
    phases: [
      { id: 'phase-1', name: 'Discovery', status: 'completed', progress: 100, startDate: '2025-12-11', endDate: '2025-12-22', tasks: [
        { id: 'task-007', title: 'Requirements workshop', completed: true },
        { id: 'task-008', title: 'Data source analysis', completed: true }
      ]},
      { id: 'phase-2', name: 'Design', status: 'completed', progress: 100, startDate: '2025-12-23', endDate: '2026-01-12', tasks: [
        { id: 'task-009', title: 'Dashboard mockups', completed: true },
        { id: 'task-010', title: 'Data architecture', completed: true }
      ]},
      { id: 'phase-3', name: 'Development', status: 'in-progress', progress: 75, startDate: '2026-01-13', tasks: [
        { id: 'task-011', title: 'Backend APIs', completed: true },
        { id: 'task-012', title: 'Frontend components', completed: true },
        { id: 'task-013', title: 'Data pipeline', completed: false, assignedTo: 'John Smith', dueDate: '2026-02-05' }
      ]},
      { id: 'phase-4', name: 'Testing', status: 'not-started', progress: 0, tasks: [] },
      { id: 'phase-5', name: 'Deployment', status: 'not-started', progress: 0, tasks: [] }
    ],
    currentSprint: {
      id: 'sprint-12',
      name: 'Sprint 12',
      startDate: '2026-01-27',
      endDate: '2026-02-09',
      goals: ['Complete data pipeline', 'Implement export features', 'Performance optimization'],
      velocity: 32,
      completedStoryPoints: 18,
      totalStoryPoints: 32
    },
    blockers: [
      {
        id: 'blocker-001',
        title: 'Data source API rate limiting',
        description: 'Third-party API has rate limits affecting real-time updates',
        status: 'in-progress',
        impact: 'medium',
        createdAt: '2026-01-20',
        owner: 'Team Beta Lead',
        supportTicketId: 'SUP-2026-045'
      }
    ],
    deliverables: [
      { id: 'del-003', type: 'solution', name: 'Analytics Dashboard', dueDate: '2026-03-05', completed: false },
      { id: 'del-004', type: 'documentation', name: 'User Guide', dueDate: '2026-03-10', completed: false },
      { id: 'del-005', type: 'operations', name: 'Runbook', dueDate: '2026-03-10', completed: false }
    ],
    documents: [
      { id: 'doc-003', name: 'Dashboard Mockups.fig', type: 'figma', uploadedAt: '2026-01-05', uploadedBy: 'Design Team', url: '#', size: 5678901 },
      { id: 'doc-004', name: 'Data Architecture.pdf', type: 'pdf', uploadedAt: '2026-01-10', uploadedBy: 'Team Beta', url: '#', size: 3456789 }
    ],
    messages: [
      { id: 'msg-006', sender: 'Team Beta Lead', content: 'Sprint 12 started, focusing on data pipeline completion', timestamp: '2026-01-27T09:00:00Z', mentions: ['Current User'] },
      { id: 'msg-007', sender: 'Current User', content: 'Great progress! When can we see a demo?', timestamp: '2026-01-27T11:30:00Z', mentions: [] },
      { id: 'msg-008', sender: 'Team Beta Lead', content: '@Current User Demo scheduled for Feb 6', timestamp: '2026-01-27T14:00:00Z', mentions: ['Current User'] }
    ],
    toAssessment: {
      assessedBy: 'TO Team',
      assessedAt: '2025-12-11',
      estimatedEffort: 10,
      estimatedCost: 145000,
      recommendedTeam: 'team-beta',
      notes: 'Analytics expertise required, Beta team ideal fit',
      approved: true
    },
    linkedInitiativeId: 'init-exec-dashboard'
  },

  // TESTING Status - UAT phase
  {
    id: 'BLD-2025-067',
    type: 'pre-built',
    status: 'testing',
    priority: 'medium',
    name: 'Microservices Platform Deployment',
    businessNeed: 'Modernize monolithic application to microservices architecture for better scalability',
    requestedBy: 'Current User',
    sponsor: 'Maria Garcia',
    department: 'Engineering',
    submittedAt: '2025-10-15',
    targetDate: '2026-02-28',
    budget: { approved: 165000, spent: 152000 },
    requirements: [
      { id: 'req-016', description: 'Kubernetes cluster setup', status: 'completed', priority: 'high' },
      { id: 'req-017', description: 'Service mesh implementation', status: 'completed', priority: 'high' },
      { id: 'req-018', description: 'CI/CD pipeline', status: 'completed', priority: 'high' },
      { id: 'req-019', description: 'Monitoring and logging', status: 'completed', priority: 'medium' }
    ],
    assignedTeam: 'team-alpha',
    estimatedDelivery: '2026-02-25',
    progress: 90,
    phases: [
      { id: 'phase-1', name: 'Discovery', status: 'completed', progress: 100, startDate: '2025-10-16', endDate: '2025-10-27', tasks: [] },
      { id: 'phase-2', name: 'Design', status: 'completed', progress: 100, startDate: '2025-10-28', endDate: '2025-11-17', tasks: [] },
      { id: 'phase-3', name: 'Development', status: 'completed', progress: 100, startDate: '2025-11-18', endDate: '2026-01-24', tasks: [] },
      { id: 'phase-4', name: 'Testing', status: 'in-progress', progress: 80, startDate: '2026-01-25', tasks: [
        { id: 'task-014', title: 'Integration testing', completed: true },
        { id: 'task-015', title: 'Performance testing', completed: true },
        { id: 'task-016', title: 'Security testing', completed: false, assignedTo: 'Security Team', dueDate: '2026-02-10' },
        { id: 'task-017', title: 'UAT preparation', completed: false, dueDate: '2026-02-15' }
      ]},
      { id: 'phase-5', name: 'Deployment', status: 'not-started', progress: 0, tasks: [] }
    ],
    blockers: [],
    deliverables: [
      { id: 'del-006', type: 'solution', name: 'Microservices Platform', dueDate: '2026-02-20', completed: false },
      { id: 'del-007', type: 'documentation', name: 'Architecture Documentation', dueDate: '2026-02-25', completed: true },
      { id: 'del-008', type: 'operations', name: 'Operations Runbook', dueDate: '2026-02-25', completed: true },
      { id: 'del-009', type: 'training', name: 'Developer Training', dueDate: '2026-02-28', completed: false }
    ],
    documents: [
      { id: 'doc-005', name: 'Architecture Docs.pdf', type: 'pdf', uploadedAt: '2026-01-20', uploadedBy: 'Team Alpha', url: '#', size: 4567890 },
      { id: 'doc-006', name: 'Test Results.xlsx', type: 'excel', uploadedAt: '2026-01-28', uploadedBy: 'QA Team', url: '#', size: 987654 }
    ],
    messages: [
      { id: 'msg-009', sender: 'Team Alpha Lead', content: 'Testing phase progressing well, security scan scheduled for Feb 10', timestamp: '2026-01-28T10:00:00Z', mentions: ['Current User'] },
      { id: 'msg-010', sender: 'QA Team', content: 'Integration and performance tests passed. Ready for security review.', timestamp: '2026-01-28T16:00:00Z', mentions: [] }
    ],
    toAssessment: {
      assessedBy: 'TO Team',
      assessedAt: '2025-10-16',
      estimatedEffort: 14,
      estimatedCost: 165000,
      recommendedTeam: 'team-alpha',
      notes: 'Pre-built solution with customization, Alpha team experienced',
      approved: true
    }
  },

  // DEPLOYED Status - Recently deployed
  {
    id: 'BLD-2025-034',
    type: 'custom',
    status: 'deployed',
    priority: 'high',
    name: 'Customer Portal Platform',
    businessNeed: 'Self-service portal to reduce support tickets by 40% and improve customer satisfaction',
    requestedBy: 'Current User',
    sponsor: 'Christopher Lee',
    department: 'Customer Success',
    submittedAt: '2025-08-05',
    targetDate: '2026-01-15',
    budget: { approved: 175000, spent: 168000 },
    requirements: [
      { id: 'req-020', description: 'Account management', status: 'completed', priority: 'high' },
      { id: 'req-021', description: 'Knowledge base integration', status: 'completed', priority: 'high' },
      { id: 'req-022', description: 'Ticket submission', status: 'completed', priority: 'medium' },
      { id: 'req-023', description: 'Live chat integration', status: 'completed', priority: 'medium' }
    ],
    assignedTeam: 'team-gamma',
    estimatedDelivery: '2026-01-10',
    progress: 100,
    phases: [
      { id: 'phase-1', name: 'Discovery', status: 'completed', progress: 100, startDate: '2025-08-06', endDate: '2025-08-24', tasks: [] },
      { id: 'phase-2', name: 'Design', status: 'completed', progress: 100, startDate: '2025-08-25', endDate: '2025-09-21', tasks: [] },
      { id: 'phase-3', name: 'Development', status: 'completed', progress: 100, startDate: '2025-09-22', endDate: '2025-12-13', tasks: [] },
      { id: 'phase-4', name: 'Testing', status: 'completed', progress: 100, startDate: '2025-12-14', endDate: '2026-01-03', tasks: [] },
      { id: 'phase-5', name: 'Deployment', status: 'completed', progress: 100, startDate: '2026-01-04', endDate: '2026-01-15', tasks: [] }
    ],
    blockers: [],
    deliverables: [
      { id: 'del-010', type: 'solution', name: 'Customer Portal', dueDate: '2026-01-10', completed: true },
      { id: 'del-011', type: 'documentation', name: 'User Documentation', dueDate: '2026-01-12', completed: true },
      { id: 'del-012', type: 'operations', name: 'Support Runbook', dueDate: '2026-01-15', completed: true },
      { id: 'del-013', type: 'training', name: 'Customer Training Videos', dueDate: '2026-01-15', completed: true }
    ],
    documents: [
      { id: 'doc-007', name: 'User Guide.pdf', type: 'pdf', uploadedAt: '2026-01-12', uploadedBy: 'Team Gamma', url: '#', size: 3456789 },
      { id: 'doc-008', name: 'Deployment Report.pdf', type: 'pdf', uploadedAt: '2026-01-15', uploadedBy: 'Team Gamma', url: '#', size: 1234567 }
    ],
    messages: [
      { id: 'msg-011', sender: 'Team Gamma Lead', content: 'Portal deployed to production successfully!', timestamp: '2026-01-15T16:00:00Z', mentions: ['Current User', 'Christopher Lee'] },
      { id: 'msg-012', sender: 'Current User', content: 'Excellent work team! Already seeing positive feedback', timestamp: '2026-01-16T09:30:00Z', mentions: [] },
      { id: 'msg-013', sender: 'Support Team', content: 'Ticket volume down 35% in first week. Great success!', timestamp: '2026-01-22T14:00:00Z', mentions: ['Current User'] }
    ],
    toAssessment: {
      assessedBy: 'TO Team',
      assessedAt: '2025-08-06',
      estimatedEffort: 16,
      estimatedCost: 175000,
      recommendedTeam: 'team-gamma',
      notes: 'Digital experience project, Gamma team perfect fit',
      approved: true
    },
    uatApproval: {
      approver: 'Current User',
      approvedAt: '2026-01-08',
      feedback: 'Portal meets all requirements and exceeds expectations. Ready for production.',
      approved: true
    },
    createdAppId: 'app-customer-portal-001'
  }
];

// Helper function to get requests by status
export const getRequestsByStatus = (status: BuildRequest['status']) => {
  return buildRequests.filter(req => req.status === status);
};

// Helper function to get requests by team
export const getRequestsByTeam = (teamId: string) => {
  return buildRequests.filter(req => req.assignedTeam === teamId);
};

// Helper function to get requests by department
export const getRequestsByDepartment = (department: string) => {
  return buildRequests.filter(req => req.department === department);
};

// Helper function to get requests by requester
export const getRequestsByRequester = (requester: string) => {
  return buildRequests.filter(req => req.requestedBy === requester);
};
