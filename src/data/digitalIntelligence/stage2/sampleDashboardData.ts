import { DashboardData } from './types';

export const sampleDashboardData: Record<string, DashboardData> = {
  'delivery-velocity-analytics': {
    serviceId: 'delivery-velocity-analytics',
    dataSource: 'azure-devops',
    timeSeries: [
      { timestamp: '2026-01-01', value: 38, label: 'Sprint 1' },
      { timestamp: '2026-01-15', value: 42, label: 'Sprint 2' },
      { timestamp: '2026-01-29', value: 45, label: 'Sprint 3' },
      { timestamp: '2026-02-12', value: 39, label: 'Sprint 4' },
      { timestamp: '2026-02-26', value: 35, label: 'Sprint 5' }
    ],
    metrics: [
      {
        id: 'current-velocity',
        label: 'Current Sprint Velocity',
        value: 35,
        unit: 'story points',
        trend: 'down',
        trendValue: -10,
        trendLabel: '10% below average',
        severity: 'warning'
      },
      {
        id: 'avg-velocity',
        label: 'Average Velocity (5 sprints)',
        value: 40,
        unit: 'story points',
        trend: 'stable',
        severity: 'info'
      },
      {
        id: 'predicted-next',
        label: 'Predicted Next Sprint',
        value: 42,
        unit: 'story points',
        trend: 'up',
        trendValue: 7,
        trendLabel: '±5 points',
        severity: 'success'
      },
      {
        id: 'team-capacity',
        label: 'Team Capacity',
        value: '85%',
        trend: 'down',
        trendValue: -15,
        trendLabel: '2 members on leave',
        severity: 'warning'
      }
    ],
    insights: [
      {
        id: 'insight-001',
        type: 'alert',
        severity: 'medium',
        title: '15% Velocity Decline Detected',
        description: 'Current sprint velocity is 15% below the 5-sprint average. Analysis indicates team capacity reduction due to planned vacations.',
        confidence: 87,
        actionable: true,
        suggestedAction: 'Consider adjusting sprint commitment to match reduced capacity. Projected velocity: 35-38 story points.'
      },
      {
        id: 'insight-002',
        type: 'prediction',
        severity: 'low',
        title: 'Velocity Recovery Expected',
        description: 'Historical patterns indicate velocity will return to 40-45 range after Sprint 6 when team is at full capacity.',
        confidence: 78,
        actionable: false
      },
      {
        id: 'insight-003',
        type: 'recommendation',
        severity: 'low',
        title: 'Maintain Consistent Sprint Length',
        description: 'Analysis shows 12% higher accuracy in predictions when sprint length remains constant at 2 weeks.',
        confidence: 92,
        actionable: true,
        suggestedAction: 'Continue with 2-week sprint cadence for optimal predictability.'
      }
    ],
    tableData: [
      { sprint: 'Next Sprint (Sprint 6)', predicted: 42, confidenceInterval: '±5', probability: '78%', status: 'Forecasted' },
      { sprint: 'Sprint 7', predicted: 45, confidenceInterval: '±7', probability: '72%', status: 'Forecasted' },
      { sprint: 'Sprint 8', predicted: 43, confidenceInterval: '±8', probability: '68%', status: 'Forecasted' }
    ],
    generatedAt: '2026-02-11T10:00:00Z',
    dataRange: { start: '2026-01-01', end: '2026-02-26' }
  },
  'system-health-analytics': {
    serviceId: 'system-health-analytics',
    dataSource: 'datadog',
    timeSeries: [
      { timestamp: '2026-02-04', value: 98.5, label: 'Feb 4' },
      { timestamp: '2026-02-05', value: 97.2, label: 'Feb 5' },
      { timestamp: '2026-02-06', value: 99.1, label: 'Feb 6' },
      { timestamp: '2026-02-07', value: 98.8, label: 'Feb 7' },
      { timestamp: '2026-02-08', value: 96.5, label: 'Feb 8' },
      { timestamp: '2026-02-09', value: 99.3, label: 'Feb 9' },
      { timestamp: '2026-02-10', value: 98.9, label: 'Feb 10' },
      { timestamp: '2026-02-11', value: 99.2, label: 'Feb 11' }
    ],
    metrics: [
      {
        id: 'overall-uptime',
        label: 'Overall Uptime',
        value: '98.4%',
        trend: 'up',
        trendValue: 0.3,
        trendLabel: '+0.3% vs last week',
        severity: 'success'
      },
      {
        id: 'critical-systems',
        label: 'Critical Systems Healthy',
        value: '12/12',
        trend: 'stable',
        severity: 'success'
      },
      {
        id: 'anomalies-detected',
        label: 'Anomalies Detected',
        value: 3,
        trend: 'down',
        trendValue: -2,
        trendLabel: '2 fewer than last week',
        severity: 'info'
      },
      {
        id: 'avg-response-time',
        label: 'Avg Response Time',
        value: '245ms',
        trend: 'up',
        trendValue: 15,
        trendLabel: '+15% slower',
        severity: 'warning'
      }
    ],
    insights: [
      {
        id: 'insight-101',
        type: 'info',
        severity: 'low',
        title: 'System Health Improving',
        description: 'Overall system health has improved by 0.3% compared to last week. All critical systems are operating within normal parameters.',
        confidence: 95,
        actionable: false
      },
      {
        id: 'insight-102',
        type: 'alert',
        severity: 'medium',
        title: 'Increased Latency on API Gateway',
        description: 'API Gateway response times have increased by 15% over the past 48 hours. This may impact user experience.',
        confidence: 89,
        actionable: true,
        suggestedAction: 'Review API Gateway logs and consider scaling up resources during peak hours.'
      },
      {
        id: 'insight-103',
        type: 'recommendation',
        severity: 'low',
        title: 'Optimize Database Queries',
        description: 'Database query performance has degraded by 8%. Analysis shows 3 slow queries consuming 60% of database time.',
        confidence: 91,
        actionable: true,
        suggestedAction: 'Review and optimize the top 3 slow queries identified in the performance report.'
      }
    ],
    tableData: [
      { system: 'SAP ERP', status: 'Healthy', uptime: '99.8%', lastIncident: '2 days ago', responseTime: '180ms' },
      { system: 'Salesforce', status: 'Healthy', uptime: '99.5%', lastIncident: '5 days ago', responseTime: '220ms' },
      { system: 'API Gateway', status: 'Warning', uptime: '97.2%', lastIncident: '2 hours ago', responseTime: '380ms' },
      { system: 'Azure Cloud', status: 'Healthy', uptime: '99.9%', lastIncident: '7 days ago', responseTime: '150ms' },
      { system: 'Data Warehouse', status: 'Healthy', uptime: '99.2%', lastIncident: '3 days ago', responseTime: '290ms' }
    ],
    generatedAt: '2026-02-11T10:00:00Z',
    dataRange: { start: '2026-02-04', end: '2026-02-11' }
  },
  'predictive-maintenance': {
    serviceId: 'predictive-maintenance',
    dataSource: 'datadog',
    timeSeries: [
      { timestamp: '2026-02-12', value: 15, label: 'Today' },
      { timestamp: '2026-02-13', value: 18, label: 'Tomorrow' },
      { timestamp: '2026-02-14', value: 22, label: 'Day 3' },
      { timestamp: '2026-02-15', value: 28, label: 'Day 4' },
      { timestamp: '2026-02-16', value: 35, label: 'Day 5' },
      { timestamp: '2026-02-17', value: 42, label: 'Day 6' },
      { timestamp: '2026-02-18', value: 51, label: 'Day 7' }
    ],
    metrics: [
      {
        id: 'high-risk-systems',
        label: 'High Risk Systems',
        value: 3,
        trend: 'up',
        trendValue: 1,
        trendLabel: '+1 since yesterday',
        severity: 'error'
      },
      {
        id: 'predicted-failures',
        label: 'Predicted Failures (7 days)',
        value: 5,
        trend: 'stable',
        severity: 'warning'
      },
      {
        id: 'maintenance-windows',
        label: 'Optimal Maintenance Windows',
        value: 12,
        trend: 'up',
        trendLabel: 'Next 30 days',
        severity: 'info'
      },
      {
        id: 'cost-savings',
        label: 'Potential Cost Savings',
        value: '$45K',
        trend: 'up',
        trendLabel: 'By preventing failures',
        severity: 'success'
      }
    ],
    insights: [
      {
        id: 'insight-201',
        type: 'alert',
        severity: 'high',
        title: 'Critical: Database Server Failure Risk',
        description: 'Primary database server shows 72% probability of failure within 5 days. CPU temperature trending 15% above normal.',
        confidence: 88,
        actionable: true,
        suggestedAction: 'Schedule immediate maintenance window. Recommended: Feb 14, 2:00 AM - 4:00 AM (lowest traffic period).'
      },
      {
        id: 'insight-202',
        type: 'prediction',
        severity: 'medium',
        title: 'Storage Capacity Warning',
        description: 'Storage array will reach 85% capacity in 12 days based on current growth rate. Performance degradation expected at 90%.',
        confidence: 91,
        actionable: true,
        suggestedAction: 'Initiate storage expansion or data archival process within 7 days.'
      },
      {
        id: 'insight-203',
        type: 'recommendation',
        severity: 'low',
        title: 'Optimize Maintenance Schedule',
        description: 'Consolidating 3 separate maintenance windows into a single 4-hour window could save $12K in operational costs.',
        confidence: 85,
        actionable: true,
        suggestedAction: 'Review consolidated maintenance schedule proposal for Feb 18-19 weekend.'
      }
    ],
    tableData: [
      { system: 'DB-Primary-01', failureRisk: '72%', daysToFailure: 5, maintenanceWindow: 'Feb 14, 2:00 AM', estimatedCost: '$15K' },
      { system: 'Storage-Array-02', failureRisk: '45%', daysToFailure: 12, maintenanceWindow: 'Feb 18, 3:00 AM', estimatedCost: '$8K' },
      { system: 'App-Server-05', failureRisk: '38%', daysToFailure: 18, maintenanceWindow: 'Feb 25, 1:00 AM', estimatedCost: '$5K' }
    ],
    generatedAt: '2026-02-11T10:00:00Z',
    dataRange: { start: '2026-02-12', end: '2026-02-18' }
  },
  'dbp-maturity-assessment': {
    serviceId: 'dbp-maturity-assessment',
    dataSource: 'assessment-tool',
    timeSeries: [
      { timestamp: '2025-Q1', value: 2.8, label: 'Q1 2025' },
      { timestamp: '2025-Q2', value: 3.1, label: 'Q2 2025' },
      { timestamp: '2025-Q3', value: 3.4, label: 'Q3 2025' },
      { timestamp: '2025-Q4', value: 3.6, label: 'Q4 2025' },
      { timestamp: '2026-Q1', value: 3.8, label: 'Q1 2026' }
    ],
    metrics: [
      {
        id: 'overall-maturity',
        label: 'Overall Maturity Score',
        value: '3.8',
        unit: 'out of 5',
        trend: 'up',
        trendValue: 5.6,
        trendLabel: '+5.6% vs last quarter',
        severity: 'success'
      },
      {
        id: 'domains-assessed',
        label: 'Domains Assessed',
        value: '8/8',
        trend: 'stable',
        severity: 'info'
      },
      {
        id: 'improvement-areas',
        label: 'Improvement Areas',
        value: 12,
        trend: 'down',
        trendValue: -3,
        trendLabel: '3 fewer than last quarter',
        severity: 'success'
      },
      {
        id: 'target-score',
        label: 'Target Score (EOY)',
        value: '4.2',
        unit: 'out of 5',
        trend: 'up',
        trendLabel: 'On track',
        severity: 'success'
      }
    ],
    insights: [
      {
        id: 'insight-301',
        type: 'recommendation',
        severity: 'medium',
        title: 'Focus on Data & Analytics Domain',
        description: 'Data & Analytics domain scored 2.9, significantly below the organizational average of 3.8. This represents the largest gap.',
        confidence: 94,
        actionable: true,
        suggestedAction: 'Prioritize data governance initiatives and analytics capability building in Q2 2026.'
      },
      {
        id: 'insight-302',
        type: 'info',
        severity: 'low',
        title: 'Strong Progress in Integration',
        description: 'Integration domain improved from 3.2 to 4.1 this quarter, exceeding organizational average.',
        confidence: 98,
        actionable: false
      },
      {
        id: 'insight-303',
        type: 'prediction',
        severity: 'low',
        title: 'On Track for Year-End Target',
        description: 'Current improvement velocity of 5.6% per quarter puts organization on track to achieve 4.2 target score by end of year.',
        confidence: 86,
        actionable: false
      }
    ],
    tableData: [
      { domain: 'Customer Experience', score: 4.2, gap: 0, priority: 'Maintain', trend: '↑', change: '+0.3' },
      { domain: 'Data & Analytics', score: 2.9, gap: 0.9, priority: 'High', trend: '→', change: '0.0' },
      { domain: 'Integration', score: 4.1, gap: 0, priority: 'Maintain', trend: '↑', change: '+0.9' },
      { domain: 'Automation', score: 3.5, gap: 0.3, priority: 'Medium', trend: '↑', change: '+0.2' },
      { domain: 'Security', score: 4.0, gap: 0, priority: 'Maintain', trend: '→', change: '0.0' },
      { domain: 'Cloud', score: 3.7, gap: 0.1, priority: 'Low', trend: '↑', change: '+0.1' },
      { domain: 'DevOps', score: 3.9, gap: 0, priority: 'Maintain', trend: '↑', change: '+0.2' },
      { domain: 'Architecture', score: 3.6, gap: 0.2, priority: 'Medium', trend: '→', change: '0.0' }
    ],
    generatedAt: '2026-02-11T10:00:00Z',
    dataRange: { start: '2025-Q1', end: '2026-Q1' }
  },
  'project-success-prediction': {
    serviceId: 'project-success-prediction',
    dataSource: 'azure-devops',
    timeSeries: [
      { timestamp: 'Week 1', value: 75, label: 'Week 1' },
      { timestamp: 'Week 2', value: 78, label: 'Week 2' },
      { timestamp: 'Week 3', value: 72, label: 'Week 3' },
      { timestamp: 'Week 4', value: 68, label: 'Week 4' },
      { timestamp: 'Week 5', value: 71, label: 'Week 5' },
      { timestamp: 'Week 6', value: 74, label: 'Week 6' }
    ],
    metrics: [
      {
        id: 'success-probability',
        label: 'Success Probability',
        value: '74%',
        trend: 'up',
        trendValue: 3,
        trendLabel: '+3% this week',
        severity: 'warning'
      },
      {
        id: 'risk-score',
        label: 'Risk Score',
        value: '26',
        unit: 'out of 100',
        trend: 'down',
        trendValue: -3,
        trendLabel: 'Improving',
        severity: 'success'
      },
      {
        id: 'on-track-projects',
        label: 'On-Track Projects',
        value: '15/18',
        trend: 'stable',
        severity: 'success'
      },
      {
        id: 'at-risk-projects',
        label: 'At-Risk Projects',
        value: 3,
        trend: 'stable',
        trendLabel: 'Requires attention',
        severity: 'warning'
      }
    ],
    insights: [
      {
        id: 'insight-401',
        type: 'alert',
        severity: 'high',
        title: 'Customer Portal Project At Risk',
        description: 'Success probability dropped from 82% to 68% in past 2 weeks. Key risk factors: scope creep (+15%), resource constraints, delayed dependencies.',
        confidence: 86,
        actionable: true,
        suggestedAction: 'Immediate intervention required: Scope review meeting, resource reallocation, dependency escalation.'
      },
      {
        id: 'insight-402',
        type: 'recommendation',
        severity: 'medium',
        title: 'Mobile App Project Needs Support',
        description: 'Success probability at 71% (below 75% threshold). Primary issue: technical debt accumulation affecting velocity.',
        confidence: 82,
        actionable: true,
        suggestedAction: 'Allocate 2 senior developers for technical debt sprint. Estimated 2-week effort to stabilize.'
      },
      {
        id: 'insight-403',
        type: 'info',
        severity: 'low',
        title: 'API Gateway Project Exceeding Expectations',
        description: 'Success probability at 94%, up from 88% last month. Strong team performance and clear requirements driving success.',
        confidence: 95,
        actionable: false
      }
    ],
    tableData: [
      { project: 'Customer Portal', successProb: '68%', riskLevel: 'High', keyRisk: 'Scope Creep', action: 'Immediate Review' },
      { project: 'Mobile App', successProb: '71%', riskLevel: 'Medium', keyRisk: 'Technical Debt', action: 'Support Needed' },
      { project: 'Data Pipeline', successProb: '79%', riskLevel: 'Low', keyRisk: 'Resource Availability', action: 'Monitor' },
      { project: 'API Gateway', successProb: '94%', riskLevel: 'Very Low', keyRisk: 'None', action: 'On Track' }
    ],
    generatedAt: '2026-02-11T10:00:00Z',
    dataRange: { start: 'Week 1', end: 'Week 6' }
  }
};
