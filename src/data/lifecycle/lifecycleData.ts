// Comprehensive Lifecycle Management Data Structures

// ============================================================================
// LIFECYCLE TEMPLATES
// ============================================================================

export interface LifecycleStage {
  id: string;
  name: string;
  description: string;
  order: number;
  durationEstimate: string;
  deliverables: string[];
  activities: string[];
}

export interface LifecycleTemplate {
  id: string;
  title: string;
  templateType: 'project' | 'product' | 'application' | 'retirement';
  category: string;
  description: string;
  methodology: 'waterfall' | 'agile' | 'hybrid' | 'stage-gate';
  totalDuration: string;
  stages: LifecycleStage[];
  governanceFramework: string;
  complianceRequirements: string[];
  riskLevel: 'low' | 'medium' | 'high';
  usageCount: number;
  avgCompletionTime: string;
  successRate: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  complexity: 'simple' | 'moderate' | 'complex';
}

export const lifecycleTemplates: LifecycleTemplate[] = [
  {
    id: 'LCT-001',
    title: 'Application Retirement Lifecycle',
    templateType: 'retirement',
    category: 'Application Management',
    description: 'Complete framework for retiring legacy applications with compliance and data migration',
    methodology: 'stage-gate',
    totalDuration: '12-16 weeks',
    stages: [
      {
        id: 'stage-retirement-001',
        name: 'Assessment & Planning',
        description: 'Evaluate application for retirement readiness and create detailed plan',
        order: 1,
        durationEstimate: '2-3 weeks',
        deliverables: [
          'Retirement business case',
          'Impact assessment',
          'Stakeholder communication plan',
          'Detailed retirement timeline'
        ],
        activities: [
          'Conduct retirement readiness assessment',
          'Develop business case',
          'Create stakeholder communication plan'
        ]
      },
      {
        id: 'stage-retirement-002',
        name: 'Migration & Testing',
        description: 'Execute data migration and validate replacement system',
        order: 2,
        durationEstimate: '4-6 weeks',
        deliverables: [
          'Data migration plan',
          'Data migration execution report',
          'User acceptance testing results',
          'Training materials'
        ],
        activities: [
          'Execute data migration',
          'Conduct user acceptance testing',
          'Train users'
        ]
      },
      {
        id: 'stage-retirement-003',
        name: 'Cutover & Decommission',
        description: 'Transition to replacement system and decommission legacy application',
        order: 3,
        durationEstimate: '2-3 weeks',
        deliverables: [
          'Cutover execution report',
          'Infrastructure decommission report',
          'License cancellation confirmations',
          'Data archival records'
        ],
        activities: [
          'Execute cutover',
          'Decommission infrastructure',
          'Archive data'
        ]
      },
      {
        id: 'stage-retirement-004',
        name: 'Post-Implementation Review',
        description: 'Review retirement process and validate outcomes',
        order: 4,
        durationEstimate: '1-2 weeks',
        deliverables: [
          'Post-implementation review report',
          'Lessons learned document',
          'Updated retirement knowledge base'
        ],
        activities: [
          'Conduct post-implementation review',
          'Document lessons learned'
        ]
      }
    ],
    governanceFramework: 'Stage-Gate with multi-level approvals',
    complianceRequirements: [
      'Data retention policy compliance',
      'Security decommissioning standards',
      'Financial control validation',
      'Audit trail maintenance'
    ],
    riskLevel: 'medium',
    usageCount: 23,
    avgCompletionTime: '14 weeks',
    successRate: 91,
    rating: 4.8,
    reviewCount: 67,
    tags: ['retirement', 'decommission', 'legacy', 'cost-savings', 'governance'],
    complexity: 'moderate'
  },
  {
    id: 'LCT-002',
    title: 'Agile Project Lifecycle',
    templateType: 'project',
    category: 'Project Management',
    description: 'Scrum-based project framework with sprint planning and retrospective templates',
    methodology: 'agile',
    totalDuration: '3-6 months',
    stages: [
      {
        id: 'stage-agile-001',
        name: 'Project Initiation',
        description: 'Define project vision, scope, and initial backlog',
        order: 1,
        durationEstimate: '1-2 weeks',
        deliverables: [
          'Project charter',
          'Product backlog',
          'Team formation',
          'Sprint 0 plan'
        ],
        activities: [
          'Define project vision',
          'Create initial backlog',
          'Form scrum team'
        ]
      },
      {
        id: 'stage-agile-002',
        name: 'Sprint Execution',
        description: 'Execute sprints with planning, daily standups, and reviews',
        order: 2,
        durationEstimate: '8-20 weeks',
        deliverables: [
          'Sprint deliverables',
          'Sprint retrospectives',
          'Updated backlog',
          'Velocity metrics'
        ],
        activities: [
          'Sprint planning',
          'Daily standups',
          'Sprint reviews',
          'Sprint retrospectives'
        ]
      },
      {
        id: 'stage-agile-003',
        name: 'Project Closure',
        description: 'Final sprint, handover, and lessons learned',
        order: 3,
        durationEstimate: '1-2 weeks',
        deliverables: [
          'Final product increment',
          'Project closure report',
          'Lessons learned',
          'Team retrospective'
        ],
        activities: [
          'Final sprint execution',
          'Product handover',
          'Document lessons learned'
        ]
      }
    ],
    governanceFramework: 'Agile governance with sprint reviews',
    complianceRequirements: [
      'Sprint documentation',
      'Velocity tracking',
      'Stakeholder engagement'
    ],
    riskLevel: 'low',
    usageCount: 34,
    avgCompletionTime: '4.5 months',
    successRate: 87,
    rating: 4.6,
    reviewCount: 89,
    tags: ['agile', 'scrum', 'iterative', 'project'],
    complexity: 'moderate'
  },
  {
    id: 'LCT-003',
    title: 'Product Launch Stage-Gate Process',
    templateType: 'product',
    category: 'Product Management',
    description: 'Six-stage framework from concept through launch with decision criteria at each gate',
    methodology: 'stage-gate',
    totalDuration: '8-12 months',
    stages: [
      {
        id: 'stage-product-001',
        name: 'Discovery & Ideation',
        description: 'Generate and evaluate product ideas',
        order: 1,
        durationEstimate: '2-4 weeks',
        deliverables: [
          'Product concept',
          'Market research',
          'Competitive analysis',
          'Initial business case'
        ],
        activities: [
          'Market research',
          'Competitive analysis',
          'Concept validation'
        ]
      },
      {
        id: 'stage-product-002',
        name: 'Business Case Development',
        description: 'Develop detailed business case and roadmap',
        order: 2,
        durationEstimate: '3-4 weeks',
        deliverables: [
          'Detailed business case',
          'Product roadmap',
          'Resource plan',
          'Financial projections'
        ],
        activities: [
          'Financial modeling',
          'Resource planning',
          'Roadmap creation'
        ]
      },
      {
        id: 'stage-product-003',
        name: 'Development',
        description: 'Build product with iterative testing',
        order: 3,
        durationEstimate: '12-24 weeks',
        deliverables: [
          'Product MVP',
          'Test results',
          'User feedback',
          'Technical documentation'
        ],
        activities: [
          'Product development',
          'User testing',
          'Iteration based on feedback'
        ]
      },
      {
        id: 'stage-product-004',
        name: 'Launch Preparation',
        description: 'Prepare for market launch',
        order: 4,
        durationEstimate: '4-6 weeks',
        deliverables: [
          'Launch plan',
          'Marketing materials',
          'Sales enablement',
          'Support documentation'
        ],
        activities: [
          'Marketing campaign development',
          'Sales training',
          'Support preparation'
        ]
      },
      {
        id: 'stage-product-005',
        name: 'Launch & Monitor',
        description: 'Execute launch and monitor performance',
        order: 5,
        durationEstimate: '2-4 weeks',
        deliverables: [
          'Launch execution report',
          'Performance metrics',
          'Customer feedback',
          'Issue log'
        ],
        activities: [
          'Product launch',
          'Performance monitoring',
          'Issue resolution'
        ]
      }
    ],
    governanceFramework: 'Stage-Gate with executive review',
    complianceRequirements: [
      'Market validation',
      'Financial approval',
      'Legal review',
      'Regulatory compliance'
    ],
    riskLevel: 'high',
    usageCount: 18,
    avgCompletionTime: '10 months',
    successRate: 78,
    rating: 4.7,
    reviewCount: 45,
    tags: ['product', 'launch', 'stage-gate', 'innovation'],
    complexity: 'complex'
  }
];

// ============================================================================
// LIFECYCLE INSTANCES (Active Projects/Products/Apps in Lifecycle)
// ============================================================================

export interface LifecycleInstance {
  id: string;
  name: string;
  type: 'project' | 'product' | 'application-retirement' | 'application-modernization';
  basedOnTemplate: string;
  portfolioLink?: {
    type: 'application' | 'project';
    id: string;
    syncStatus: 'synced' | 'out-of-sync' | 'manual';
    lastSynced: string;
  };
  owner: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  sponsor: {
    name: string;
    role: string;
  };
  status: 'not-started' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  currentStage: string;
  overallHealth: 'on-track' | 'at-risk' | 'critical';
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  forecastEndDate: string;
  actualEndDate?: string;
  overallProgress: number;
  gatesCompleted: number;
  totalGates: number;
  budget?: {
    total: number;
    spent: number;
    forecast: number;
  };
  expectedBenefits: Array<{
    type: 'cost-savings' | 'efficiency' | 'revenue' | 'risk-reduction' | 'quality';
    description: string;
    quantifiedValue?: number;
    realizationDate: string;
    status: 'planned' | 'in-progress' | 'realized' | 'not-realized';
  }>;
  tags: string[];
}

export const lifecycleInstances: LifecycleInstance[] = [
  {
    id: 'LCI-2026-001',
    name: 'Legacy Inventory System Retirement',
    type: 'application-retirement',
    basedOnTemplate: 'LCT-001',
    portfolioLink: {
      type: 'application',
      id: 'APP-089',
      syncStatus: 'synced',
      lastSynced: '2026-02-10T08:00:00Z'
    },
    owner: {
      id: 'user-042',
      name: 'Sarah Chen',
      email: 'sarah.chen@company.com',
      role: 'IT Operations Manager'
    },
    sponsor: {
      name: 'VP IT Operations',
      role: 'Executive Sponsor'
    },
    status: 'in-progress',
    currentStage: 'stage-retirement-002',
    overallHealth: 'on-track',
    plannedStartDate: '2026-01-08T00:00:00Z',
    plannedEndDate: '2026-04-30T00:00:00Z',
    actualStartDate: '2026-01-08T00:00:00Z',
    forecastEndDate: '2026-04-28T00:00:00Z',
    overallProgress: 41,
    gatesCompleted: 1,
    totalGates: 4,
    budget: {
      total: 85000,
      spent: 42000,
      forecast: 83000
    },
    expectedBenefits: [
      {
        type: 'cost-savings',
        description: 'Annual infrastructure cost savings',
        quantifiedValue: 120000,
        realizationDate: '2026-05-01T00:00:00Z',
        status: 'planned'
      },
      {
        type: 'cost-savings',
        description: 'Software license savings',
        quantifiedValue: 60000,
        realizationDate: '2026-05-01T00:00:00Z',
        status: 'planned'
      }
    ],
    tags: ['retirement', 'inventory-system', 'cost-savings', 'high-priority']
  },
  {
    id: 'LCI-2026-002',
    name: 'Customer Portal Modernization',
    type: 'application-modernization',
    basedOnTemplate: 'LCT-002',
    portfolioLink: {
      type: 'application',
      id: 'APP-045',
      syncStatus: 'synced',
      lastSynced: '2026-02-11T09:00:00Z'
    },
    owner: {
      id: 'user-043',
      name: 'Michael Torres',
      email: 'michael.torres@company.com',
      role: 'Enterprise Architect'
    },
    sponsor: {
      name: 'Chief Digital Officer',
      role: 'Executive Sponsor'
    },
    status: 'in-progress',
    currentStage: 'stage-agile-002',
    overallHealth: 'on-track',
    plannedStartDate: '2026-01-15T00:00:00Z',
    plannedEndDate: '2026-06-30T00:00:00Z',
    actualStartDate: '2026-01-15T00:00:00Z',
    forecastEndDate: '2026-06-25T00:00:00Z',
    overallProgress: 35,
    gatesCompleted: 1,
    totalGates: 3,
    budget: {
      total: 450000,
      spent: 180000,
      forecast: 440000
    },
    expectedBenefits: [
      {
        type: 'efficiency',
        description: 'Improved customer experience',
        realizationDate: '2026-07-01T00:00:00Z',
        status: 'in-progress'
      },
      {
        type: 'revenue',
        description: 'Increased online transactions',
        quantifiedValue: 250000,
        realizationDate: '2026-09-01T00:00:00Z',
        status: 'planned'
      }
    ],
    tags: ['modernization', 'customer-portal', 'digital-transformation']
  },
  {
    id: 'LCI-2026-003',
    name: 'Mobile App v2.0 Launch',
    type: 'product',
    basedOnTemplate: 'LCT-003',
    owner: {
      id: 'user-044',
      name: 'Jennifer Park',
      email: 'jennifer.park@company.com',
      role: 'Product Manager'
    },
    sponsor: {
      name: 'VP Product',
      role: 'Executive Sponsor'
    },
    status: 'in-progress',
    currentStage: 'stage-product-003',
    overallHealth: 'at-risk',
    plannedStartDate: '2025-10-01T00:00:00Z',
    plannedEndDate: '2026-05-31T00:00:00Z',
    actualStartDate: '2025-10-01T00:00:00Z',
    forecastEndDate: '2026-06-15T00:00:00Z',
    overallProgress: 58,
    gatesCompleted: 2,
    totalGates: 5,
    budget: {
      total: 320000,
      spent: 210000,
      forecast: 340000
    },
    expectedBenefits: [
      {
        type: 'revenue',
        description: 'New revenue stream from mobile',
        quantifiedValue: 500000,
        realizationDate: '2026-08-01T00:00:00Z',
        status: 'planned'
      }
    ],
    tags: ['product-launch', 'mobile', 'innovation']
  },
  {
    id: 'LCI-2026-004',
    name: 'ERP System Retirement',
    type: 'application-retirement',
    basedOnTemplate: 'LCT-001',
    portfolioLink: {
      type: 'application',
      id: 'APP-012',
      syncStatus: 'synced',
      lastSynced: '2026-02-11T07:30:00Z'
    },
    owner: {
      id: 'user-045',
      name: 'David Kim',
      email: 'david.kim@company.com',
      role: 'Business Analyst'
    },
    sponsor: {
      name: 'CFO',
      role: 'Executive Sponsor'
    },
    status: 'in-progress',
    currentStage: 'stage-retirement-001',
    overallHealth: 'on-track',
    plannedStartDate: '2026-02-01T00:00:00Z',
    plannedEndDate: '2026-07-31T00:00:00Z',
    actualStartDate: '2026-02-01T00:00:00Z',
    forecastEndDate: '2026-07-31T00:00:00Z',
    overallProgress: 15,
    gatesCompleted: 0,
    totalGates: 4,
    budget: {
      total: 250000,
      spent: 35000,
      forecast: 245000
    },
    expectedBenefits: [
      {
        type: 'cost-savings',
        description: 'Annual maintenance cost savings',
        quantifiedValue: 180000,
        realizationDate: '2026-08-01T00:00:00Z',
        status: 'planned'
      }
    ],
    tags: ['retirement', 'erp', 'legacy-system']
  },
  {
    id: 'LCI-2026-005',
    name: 'Data Analytics Platform Project',
    type: 'project',
    basedOnTemplate: 'LCT-002',
    owner: {
      id: 'user-046',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@company.com',
      role: 'Project Manager'
    },
    sponsor: {
      name: 'Chief Data Officer',
      role: 'Executive Sponsor'
    },
    status: 'in-progress',
    currentStage: 'stage-agile-002',
    overallHealth: 'on-track',
    plannedStartDate: '2025-12-01T00:00:00Z',
    plannedEndDate: '2026-05-31T00:00:00Z',
    actualStartDate: '2025-12-01T00:00:00Z',
    forecastEndDate: '2026-05-28T00:00:00Z',
    overallProgress: 62,
    gatesCompleted: 1,
    totalGates: 3,
    budget: {
      total: 380000,
      spent: 240000,
      forecast: 375000
    },
    expectedBenefits: [
      {
        type: 'efficiency',
        description: 'Faster data-driven decision making',
        realizationDate: '2026-06-01T00:00:00Z',
        status: 'in-progress'
      }
    ],
    tags: ['project', 'analytics', 'data-platform']
  }
];

// ============================================================================
// APPROVAL WORKFLOWS
// ============================================================================

export interface ApprovalWorkflow {
  id: string;
  lifecycleInstanceId: string;
  lifecycleInstanceName: string;
  gate: {
    id: string;
    name: string;
    stage: string;
  };
  submittedBy: string;
  submittedDate: string;
  submissionNotes: string;
  status: 'pending' | 'approved' | 'rejected' | 'conditional' | 'withdrawn';
  approvals: Array<{
    approverName: string;
    approverRole: string;
    decision: 'pending' | 'approved' | 'rejected' | 'conditional';
    decisionDate?: string;
    comments?: string;
  }>;
  requiredApprovals: number;
  receivedApprovals: number;
  expectedDecisionDate: string;
  actualDecisionDate?: string;
  escalated: boolean;
}

export const approvalWorkflows: ApprovalWorkflow[] = [
  {
    id: 'APR-2026-001',
    lifecycleInstanceId: 'LCI-2026-001',
    lifecycleInstanceName: 'Legacy Inventory System Retirement',
    gate: {
      id: 'gate-retirement-002',
      name: 'Gate 2: Approval to Cutover',
      stage: 'Migration & Testing'
    },
    submittedBy: 'Sarah Chen',
    submittedDate: '2026-02-08T14:20:00Z',
    submissionNotes: 'Data migration completed successfully with 100% validation. UAT passed with no critical issues. All users trained. Ready for cutover approval.',
    status: 'pending',
    approvals: [
      {
        approverName: 'John Smith',
        approverRole: 'Application Business Owner',
        decision: 'approved',
        decisionDate: '2026-02-09T10:30:00Z',
        comments: 'UAT results look excellent. Business users are well-prepared. Approved to proceed with cutover.'
      },
      {
        approverName: 'Maria Garcia',
        approverRole: 'IT Operations Manager',
        decision: 'pending',
        comments: undefined
      }
    ],
    requiredApprovals: 2,
    receivedApprovals: 1,
    expectedDecisionDate: '2026-02-13T00:00:00Z',
    escalated: false
  },
  {
    id: 'APR-2026-002',
    lifecycleInstanceId: 'LCI-2026-003',
    lifecycleInstanceName: 'Mobile App v2.0 Launch',
    gate: {
      id: 'gate-product-003',
      name: 'Gate 3: Development Complete',
      stage: 'Development'
    },
    submittedBy: 'Jennifer Park',
    submittedDate: '2026-02-10T09:15:00Z',
    submissionNotes: 'MVP development complete. User testing shows 85% satisfaction. Technical debt within acceptable limits. Ready for launch preparation phase.',
    status: 'pending',
    approvals: [
      {
        approverName: 'VP Product',
        approverRole: 'Executive Sponsor',
        decision: 'pending',
        comments: undefined
      },
      {
        approverName: 'Chief Technology Officer',
        approverRole: 'Technical Approval',
        decision: 'pending',
        comments: undefined
      }
    ],
    requiredApprovals: 2,
    receivedApprovals: 0,
    expectedDecisionDate: '2026-02-15T00:00:00Z',
    escalated: false
  },
  {
    id: 'APR-2026-003',
    lifecycleInstanceId: 'LCI-2026-004',
    lifecycleInstanceName: 'ERP System Retirement',
    gate: {
      id: 'gate-retirement-001',
      name: 'Gate 1: Approval to Proceed',
      stage: 'Assessment & Planning'
    },
    submittedBy: 'David Kim',
    submittedDate: '2026-02-11T11:00:00Z',
    submissionNotes: 'Business case demonstrates $180K annual savings. All stakeholders aligned. Impact assessment shows no critical blockers. Replacement system validated.',
    status: 'pending',
    approvals: [
      {
        approverName: 'CFO',
        approverRole: 'Financial Approval',
        decision: 'pending',
        comments: undefined
      },
      {
        approverName: 'Chief Architect',
        approverRole: 'Technical Approval',
        decision: 'pending',
        comments: undefined
      },
      {
        approverName: 'Business Owner',
        approverRole: 'Business Approval',
        decision: 'pending',
        comments: undefined
      }
    ],
    requiredApprovals: 3,
    receivedApprovals: 0,
    expectedDecisionDate: '2026-02-16T00:00:00Z',
    escalated: false
  }
];

// ============================================================================
// STATISTICS
// ============================================================================

export const lifecycleStatistics = {
  totalTemplates: lifecycleTemplates.length,
  totalInstances: lifecycleInstances.length,
  activeInstances: lifecycleInstances.filter(i => i.status === 'in-progress').length,
  completedInstances: lifecycleInstances.filter(i => i.status === 'completed').length,
  pendingApprovals: approvalWorkflows.filter(a => a.status === 'pending').length,
  totalBudget: lifecycleInstances.reduce((sum, i) => sum + (i.budget?.total || 0), 0),
  totalSpent: lifecycleInstances.reduce((sum, i) => sum + (i.budget?.spent || 0), 0),
  projectedSavings: lifecycleInstances.reduce((sum, i) => {
    return sum + i.expectedBenefits
      .filter(b => b.type === 'cost-savings')
      .reduce((benefitSum, b) => benefitSum + (b.quantifiedValue || 0), 0);
  }, 0)
};

// Additional templates for completeness
export const additionalTemplates: LifecycleTemplate[] = [
  {
    id: 'LCT-004',
    title: 'Waterfall Project Lifecycle',
    templateType: 'project',
    category: 'Project Management',
    description: 'Traditional stage-gate project management with defined phases',
    methodology: 'waterfall',
    totalDuration: '6-9 months',
    stages: [
      { id: 'wf-1', name: 'Initiation', description: 'Define scope', order: 1, durationEstimate: '2 weeks', deliverables: ['Charter'], activities: ['Define scope'] },
      { id: 'wf-2', name: 'Planning', description: 'Plan project', order: 2, durationEstimate: '4 weeks', deliverables: ['Plan'], activities: ['Create plan'] },
      { id: 'wf-3', name: 'Execution', description: 'Execute', order: 3, durationEstimate: '16 weeks', deliverables: ['Deliverables'], activities: ['Execute'] },
      { id: 'wf-4', name: 'Closure', description: 'Close', order: 4, durationEstimate: '2 weeks', deliverables: ['Report'], activities: ['Close'] }
    ],
    governanceFramework: 'Traditional',
    complianceRequirements: ['Documentation'],
    riskLevel: 'medium',
    usageCount: 45,
    avgCompletionTime: '7.5 months',
    successRate: 85,
    rating: 4.5,
    reviewCount: 112,
    tags: ['waterfall', 'traditional'],
    complexity: 'moderate'
  },
  {
    id: 'LCT-005',
    title: 'Application Modernization',
    templateType: 'application',
    category: 'Modernization',
    description: 'Cloud migration and refactoring framework',
    methodology: 'hybrid',
    totalDuration: '20 weeks',
    stages: [
      { id: 'mod-1', name: 'Assessment', description: 'Assess', order: 1, durationEstimate: '3 weeks', deliverables: ['Assessment'], activities: ['Assess'] },
      { id: 'mod-2', name: 'Design', description: 'Design', order: 2, durationEstimate: '5 weeks', deliverables: ['Design'], activities: ['Design'] },
      { id: 'mod-3', name: 'Implementation', description: 'Implement', order: 3, durationEstimate: '10 weeks', deliverables: ['App'], activities: ['Implement'] },
      { id: 'mod-4', name: 'Validation', description: 'Validate', order: 4, durationEstimate: '2 weeks', deliverables: ['Tests'], activities: ['Test'] }
    ],
    governanceFramework: 'Hybrid',
    complianceRequirements: ['Security'],
    riskLevel: 'high',
    usageCount: 28,
    avgCompletionTime: '20 weeks',
    successRate: 82,
    rating: 4.7,
    reviewCount: 54,
    tags: ['modernization', 'cloud'],
    complexity: 'complex'
  }
];
