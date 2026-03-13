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
      { timestamp: '2026-02-26', value: 99.2, label: 'Feb 26' },
      { timestamp: '2026-02-27', value: 98.8, label: 'Feb 27' },
      { timestamp: '2026-02-28', value: 99.5, label: 'Feb 28' },
      { timestamp: '2026-03-01', value: 99.1, label: 'Mar 1' },
      { timestamp: '2026-03-02', value: 97.8, label: 'Mar 2' },
      { timestamp: '2026-03-03', value: 98.4, label: 'Mar 3' },
      { timestamp: '2026-03-04', value: 99.6, label: 'Mar 4' },
      { timestamp: '2026-03-05', value: 99.3, label: 'Mar 5' },
      { timestamp: '2026-03-06', value: 98.9, label: 'Mar 6' },
      { timestamp: '2026-03-07', value: 99.7, label: 'Mar 7' },
      { timestamp: '2026-03-08', value: 96.2, label: 'Mar 8' },
      { timestamp: '2026-03-09', value: 98.1, label: 'Mar 9' },
      { timestamp: '2026-03-10', value: 99.4, label: 'Mar 10' },
      { timestamp: '2026-03-11', value: 99.5, label: 'Mar 11' }
    ],
    widgetData: {
      'response-time': [
        { name: 'Feb 26', value: 210 },
        { name: 'Feb 27', value: 225 },
        { name: 'Feb 28', value: 198 },
        { name: 'Mar 1', value: 215 },
        { name: 'Mar 2', value: 280 },
        { name: 'Mar 3', value: 255 },
        { name: 'Mar 4', value: 195 },
        { name: 'Mar 5', value: 205 },
        { name: 'Mar 6', value: 230 },
        { name: 'Mar 7', value: 190 },
        { name: 'Mar 8', value: 342 },
        { name: 'Mar 9', value: 265 },
        { name: 'Mar 10', value: 215 },
        { name: 'Mar 11', value: 208 }
      ],
      'health-distribution': [
        { name: 'Healthy', value: 8 },
        { name: 'Warning', value: 2 },
        { name: 'Degraded', value: 1 },
        { name: 'Critical', value: 1 }
      ],
      'error-by-service': [
        { name: 'API Gateway', value: 2.4 },
        { name: 'Payment Service', value: 1.8 },
        { name: 'Auth Service', value: 1.2 },
        { name: 'Data Warehouse', value: 0.9 },
        { name: 'CDN', value: 0.5 },
        { name: 'Salesforce', value: 0.3 },
        { name: 'SAP ERP', value: 0.2 },
        { name: 'Azure Cloud', value: 0.1 }
      ],
      'performance-metrics': [
        { name: 'CPU', value: 72 },
        { name: 'Memory', value: 68 },
        { name: 'Disk I/O', value: 85 },
        { name: 'Network', value: 92 },
        { name: 'Latency', value: 78 }
      ],
      'resource-utilization': [
        { name: 'Feb 26', value: 65 },
        { name: 'Feb 27', value: 72 },
        { name: 'Feb 28', value: 58 },
        { name: 'Mar 1', value: 68 },
        { name: 'Mar 2', value: 82 },
        { name: 'Mar 3', value: 75 },
        { name: 'Mar 4', value: 62 },
        { name: 'Mar 5', value: 67 },
        { name: 'Mar 6', value: 71 },
        { name: 'Mar 7', value: 60 },
        { name: 'Mar 8', value: 88 },
        { name: 'Mar 9', value: 76 },
        { name: 'Mar 10', value: 64 },
        { name: 'Mar 11', value: 61 }
      ],
      'incident-severity': [
        { name: 'P1 - Critical', value: 2 },
        { name: 'P2 - High', value: 5 },
        { name: 'P3 - Medium', value: 12 },
        { name: 'P4 - Low', value: 8 }
      ]
    },
    metrics: [
      {
        id: 'overall-uptime',
        label: 'Overall Uptime',
        value: '99.4%',
        trend: 'up',
        trendValue: 1.0,
        trendLabel: '+1.0% vs last period',
        severity: 'success'
      },
      {
        id: 'critical-systems',
        label: 'Critical Systems Healthy',
        value: '11/12',
        trend: 'down',
        trendValue: -1,
        trendLabel: '1 system degraded',
        severity: 'warning'
      },
      {
        id: 'anomalies-detected',
        label: 'Anomalies Detected',
        value: 7,
        trend: 'up',
        trendValue: 3,
        trendLabel: '3 more than last week',
        severity: 'warning'
      },
      {
        id: 'avg-response-time',
        label: 'Avg Response Time',
        value: '218ms',
        trend: 'down',
        trendValue: -11,
        trendLabel: '11% faster than last week',
        severity: 'success'
      },
      {
        id: 'error-rate',
        label: 'Error Rate',
        value: '0.34%',
        trend: 'up',
        trendValue: 0.12,
        trendLabel: '+0.12% vs last week',
        severity: 'warning'
      },
      {
        id: 'mttr',
        label: 'Mean Time to Recovery',
        value: '42 min',
        trend: 'down',
        trendValue: -18,
        trendLabel: '18% faster resolution',
        severity: 'success'
      }
    ],
    insights: [
      {
        id: 'insight-101',
        type: 'alert',
        severity: 'high',
        title: 'API Gateway Degradation Detected',
        description: 'API Gateway error rate spiked to 2.4% on Mar 8, correlating with a 96.2% uptime dip. Root cause identified as connection pool exhaustion during peak traffic (14:00-16:00 UTC). Similar pattern detected on Mar 2.',
        confidence: 94,
        actionable: true,
        suggestedAction: 'Increase API Gateway connection pool size from 200 to 500 and enable auto-scaling triggers at 80% pool utilization.'
      },
      {
        id: 'insight-102',
        type: 'prediction',
        severity: 'medium',
        title: 'Payment Service Latency Risk',
        description: 'Payment Service response times have increased 22% over the last 7 days (from 180ms to 220ms). ML model predicts P95 latency will breach the 500ms SLA threshold within 5 days if the trend continues.',
        confidence: 87,
        actionable: true,
        suggestedAction: 'Schedule database index optimization for the payments table and review recent schema changes deployed on Mar 5.'
      },
      {
        id: 'insight-103',
        type: 'recommendation',
        severity: 'medium',
        title: 'Resource Over-Provisioning on Azure Cloud',
        description: 'Azure Cloud infrastructure utilization averages 61% with peaks at 76%. Current provisioning is 40% above actual demand. Right-sizing could save approximately $12,400/month without impacting SLAs.',
        confidence: 91,
        actionable: true,
        suggestedAction: 'Review Azure VM sizing recommendations and implement reserved instance purchasing for steady-state workloads.'
      },
      {
        id: 'insight-104',
        type: 'info',
        severity: 'low',
        title: 'MTTR Improvement Trend',
        description: 'Mean Time to Recovery has improved 18% over the past 30 days (from 51 min to 42 min). This improvement correlates with the deployment of automated runbooks for P1/P2 incidents on Feb 20.',
        confidence: 96,
        actionable: false
      },
      {
        id: 'insight-105',
        type: 'alert',
        severity: 'medium',
        title: 'Anomaly Cluster in Auth Service',
        description: 'Authentication service logged 3 anomalous behavior patterns in the last 48 hours: unusual token refresh rates (+340%), geographically dispersed login attempts, and session duration outliers. No breach confirmed but warrants investigation.',
        confidence: 82,
        actionable: true,
        suggestedAction: 'Escalate to Security Operations team for investigation. Enable enhanced audit logging and rate limiting on the auth endpoints.'
      }
    ],
    tableData: [
      { system: 'SAP ERP', status: 'Healthy', uptime: '99.9%', cpu: '45%', memory: '62%', errorRate: '0.02%', responseTime: '165ms', lastIncident: '12 days ago', sla: '99.5%' },
      { system: 'Salesforce', status: 'Healthy', uptime: '99.7%', cpu: '38%', memory: '55%', errorRate: '0.08%', responseTime: '195ms', lastIncident: '8 days ago', sla: '99.5%' },
      { system: 'API Gateway', status: 'Warning', uptime: '97.8%', cpu: '78%', memory: '82%', errorRate: '2.40%', responseTime: '340ms', lastIncident: '3 hours ago', sla: '99.9%' },
      { system: 'Azure Cloud', status: 'Healthy', uptime: '99.9%', cpu: '61%', memory: '58%', errorRate: '0.01%', responseTime: '120ms', lastIncident: '21 days ago', sla: '99.9%' },
      { system: 'Data Warehouse', status: 'Healthy', uptime: '99.4%', cpu: '52%', memory: '71%', errorRate: '0.15%', responseTime: '280ms', lastIncident: '5 days ago', sla: '99.0%' },
      { system: 'Payment Service', status: 'Warning', uptime: '98.6%', cpu: '72%', memory: '78%', errorRate: '1.80%', responseTime: '245ms', lastIncident: '1 day ago', sla: '99.9%' },
      { system: 'Auth Service', status: 'Degraded', uptime: '97.2%', cpu: '85%', memory: '88%', errorRate: '1.20%', responseTime: '310ms', lastIncident: '6 hours ago', sla: '99.5%' },
      { system: 'CDN', status: 'Healthy', uptime: '99.8%', cpu: '22%', memory: '35%', errorRate: '0.05%', responseTime: '45ms', lastIncident: '30 days ago', sla: '99.9%' }
    ],
    generatedAt: '2026-03-11T10:00:00Z',
    dataRange: { start: '2026-02-26', end: '2026-03-11' }
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
    widgetData: {
      'domain-scores': [
        { name: 'Customer Exp.', value: 4.2 },
        { name: 'Data & Analytics', value: 2.9 },
        { name: 'Integration', value: 4.1 },
        { name: 'Automation', value: 3.5 },
        { name: 'Security', value: 4.0 },
        { name: 'Cloud', value: 3.7 },
        { name: 'DevOps', value: 3.9 },
        { name: 'Architecture', value: 3.6 }
      ],
      'domain-comparison': [
        { name: 'Customer Exp.', value: 4.2 },
        { name: 'Integration', value: 4.1 },
        { name: 'Security', value: 4.0 },
        { name: 'DevOps', value: 3.9 },
        { name: 'Cloud', value: 3.7 },
        { name: 'Architecture', value: 3.6 },
        { name: 'Automation', value: 3.5 },
        { name: 'Data & Analytics', value: 2.9 }
      ],
      'maturity-distribution': [
        { name: 'Optimized (4.0-5.0)', value: 3 },
        { name: 'Established (3.5-3.9)', value: 3 },
        { name: 'Developing (3.0-3.4)', value: 1 },
        { name: 'Initial (< 3.0)', value: 1 }
      ],
      'sub-capability': [
        { name: 'Data Governance', value: 2.5 },
        { name: 'Data Quality Mgmt', value: 2.8 },
        { name: 'Analytics Platforms', value: 3.2 },
        { name: 'Data Literacy', value: 2.6 },
        { name: 'Self-Service BI', value: 3.0 },
        { name: 'Advanced Analytics', value: 2.4 },
        { name: 'Data Architecture', value: 3.3 },
        { name: 'ML/AI Readiness', value: 2.1 }
      ],
      'benchmark-trend': [
        { name: 'Q1 2025', value: 58 },
        { name: 'Q2 2025', value: 63 },
        { name: 'Q3 2025', value: 68 },
        { name: 'Q4 2025', value: 71 },
        { name: 'Q1 2026', value: 73 }
      ],
      'capability-profile': [
        { name: 'Strategy & Vision', value: 4.0 },
        { name: 'Governance', value: 3.5 },
        { name: 'People & Culture', value: 3.8 },
        { name: 'Process', value: 3.6 },
        { name: 'Technology', value: 3.9 },
        { name: 'Innovation', value: 3.2 }
      ]
    },
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
        severity: 'success'
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
      },
      {
        id: 'maturity-velocity',
        label: 'Maturity Velocity',
        value: '+0.2',
        unit: 'per quarter',
        trend: 'stable',
        trendLabel: 'Consistent growth rate',
        severity: 'success'
      },
      {
        id: 'industry-percentile',
        label: 'Industry Percentile',
        value: '73rd',
        trend: 'up',
        trendValue: 5,
        trendLabel: 'Up from 68th last quarter',
        severity: 'success'
      }
    ],
    insights: [
      {
        id: 'insight-301',
        type: 'alert',
        severity: 'high',
        title: 'Critical Gap: Data & Analytics Domain',
        description: 'Data & Analytics scored 2.9/5.0, the lowest across all domains and 0.9 points below the organizational average. Sub-capability analysis reveals ML/AI Readiness (2.1) and Advanced Analytics (2.4) as the primary laggards. This gap is widening relative to industry benchmarks where peers average 3.6 in this domain.',
        confidence: 96,
        actionable: true,
        suggestedAction: 'Launch a Data & Analytics acceleration program in Q2 2026: (1) hire 2 senior data engineers, (2) deploy a centralized data governance framework, (3) pilot self-service BI for 3 business units.'
      },
      {
        id: 'insight-302',
        type: 'recommendation',
        severity: 'medium',
        title: 'Quick Win: Automation Domain',
        description: 'Automation domain (3.5) is 0.3 points below target. Analysis shows that implementing RPA for 5 identified manual processes could close 80% of this gap within one quarter. Estimated cost: $45K. Estimated annual savings: $180K.',
        confidence: 89,
        actionable: true,
        suggestedAction: 'Prioritize RPA deployment for invoice processing, employee onboarding, report generation, ticket routing, and data reconciliation processes.'
      },
      {
        id: 'insight-303',
        type: 'info',
        severity: 'low',
        title: 'Integration Domain: Best-in-Class Performance',
        description: 'Integration domain improved from 3.2 to 4.1 (+28%) over the past year, now exceeding the industry 90th percentile (4.0). This success is attributed to the API-first strategy adopted in Q2 2025 and the deployment of the enterprise integration platform.',
        confidence: 98,
        actionable: false
      },
      {
        id: 'insight-304',
        type: 'prediction',
        severity: 'medium',
        title: 'Year-End Target At Risk Without Data & Analytics Investment',
        description: 'Current trajectory projects an overall maturity score of 4.0 by year-end, 0.2 points below the 4.2 target. The shortfall is entirely attributable to the Data & Analytics domain lag. With the recommended acceleration program, the model predicts achieving 4.15-4.25 by December 2026.',
        confidence: 84,
        actionable: true,
        suggestedAction: 'Approve the Data & Analytics acceleration program budget and begin hiring in Q2 to stay on track for the 4.2 EOY target.'
      },
      {
        id: 'insight-305',
        type: 'recommendation',
        severity: 'low',
        title: 'Architecture Modernization Opportunity',
        description: 'Architecture domain (3.6) has stagnated for 2 quarters. Peer organizations advancing to microservices architecture average 4.2 in this domain. Adopting a progressive decoupling strategy for 3 monolithic applications could yield a 0.4-0.6 point improvement over 6 months.',
        confidence: 81,
        actionable: true,
        suggestedAction: 'Commission an architecture modernization assessment focusing on the top 3 monolithic applications by usage volume.'
      }
    ],
    tableData: [
      { domain: 'Customer Experience', currentScore: 4.2, targetScore: 4.2, gap: '0.0', priority: 'Maintain', trend: '↑ +0.3', industryAvg: 3.8, percentile: '82nd', actions: 'Sustain current initiatives' },
      { domain: 'Integration', currentScore: 4.1, targetScore: 4.0, gap: '0.0', priority: 'Maintain', trend: '↑ +0.9', industryAvg: 3.5, percentile: '91st', actions: 'Share best practices across org' },
      { domain: 'Security', currentScore: 4.0, targetScore: 4.0, gap: '0.0', priority: 'Maintain', trend: '→ 0.0', industryAvg: 3.9, percentile: '68th', actions: 'Monitor compliance requirements' },
      { domain: 'DevOps', currentScore: 3.9, targetScore: 4.0, gap: '0.1', priority: 'Low', trend: '↑ +0.2', industryAvg: 3.7, percentile: '72nd', actions: 'Expand CI/CD to remaining teams' },
      { domain: 'Cloud', currentScore: 3.7, targetScore: 4.0, gap: '0.3', priority: 'Medium', trend: '↑ +0.1', industryAvg: 3.8, percentile: '55th', actions: 'Accelerate cloud migration roadmap' },
      { domain: 'Architecture', currentScore: 3.6, targetScore: 4.0, gap: '0.4', priority: 'Medium', trend: '→ 0.0', industryAvg: 3.7, percentile: '48th', actions: 'Initiate microservices pilot' },
      { domain: 'Automation', currentScore: 3.5, targetScore: 3.8, gap: '0.3', priority: 'Medium', trend: '↑ +0.2', industryAvg: 3.4, percentile: '62nd', actions: 'Deploy RPA for top 5 processes' },
      { domain: 'Data & Analytics', currentScore: 2.9, targetScore: 3.8, gap: '0.9', priority: 'High', trend: '→ 0.0', industryAvg: 3.6, percentile: '28th', actions: 'Launch acceleration program' }
    ],
    generatedAt: '2026-03-11T10:00:00Z',
    dataRange: { start: '2025-Q1', end: '2026-Q1' }
  },
  'project-success-prediction': {
    serviceId: 'project-success-prediction',
    dataSource: 'azure-devops',
    timeSeries: [
      { timestamp: 'Week 1', value: 71, label: 'Week 1' },
      { timestamp: 'Week 2', value: 73, label: 'Week 2' },
      { timestamp: 'Week 3', value: 70, label: 'Week 3' },
      { timestamp: 'Week 4', value: 68, label: 'Week 4' },
      { timestamp: 'Week 5', value: 72, label: 'Week 5' },
      { timestamp: 'Week 6', value: 74, label: 'Week 6' },
      { timestamp: 'Week 7', value: 73, label: 'Week 7' },
      { timestamp: 'Week 8', value: 75, label: 'Week 8' },
      { timestamp: 'Week 9', value: 76, label: 'Week 9' },
      { timestamp: 'Week 10', value: 74, label: 'Week 10' },
      { timestamp: 'Week 11', value: 77, label: 'Week 11' },
      { timestamp: 'Week 12', value: 78, label: 'Week 12' }
    ],
    widgetData: {
      'success-trend': [
        { name: 'Week 1', value: 71 }, { name: 'Week 2', value: 73 }, { name: 'Week 3', value: 70 },
        { name: 'Week 4', value: 68 }, { name: 'Week 5', value: 72 }, { name: 'Week 6', value: 74 },
        { name: 'Week 7', value: 73 }, { name: 'Week 8', value: 75 }, { name: 'Week 9', value: 76 },
        { name: 'Week 10', value: 74 }, { name: 'Week 11', value: 77 }, { name: 'Week 12', value: 78 }
      ],
      'risk-distribution': [
        { name: 'Critical', value: 2 },
        { name: 'High', value: 4 },
        { name: 'Medium', value: 6 },
        { name: 'Low', value: 8 },
        { name: 'Minimal', value: 5 }
      ],
      'success-by-portfolio': [
        { name: 'Digital Transformation', value: 82 },
        { name: 'Infrastructure', value: 76 },
        { name: 'Innovation', value: 71 },
        { name: 'Customer Experience', value: 88 },
        { name: 'Data & Analytics', value: 79 }
      ],
      'project-health': [
        { name: 'Schedule', value: 72 },
        { name: 'Budget', value: 81 },
        { name: 'Scope', value: 68 },
        { name: 'Quality', value: 85 },
        { name: 'Resources', value: 74 },
        { name: 'Stakeholder', value: 79 }
      ],
      'budget-schedule-scatter': [
        { name: 'Customer Portal', value: 68, index: 72 },
        { name: 'Mobile App', value: 71, index: 65 },
        { name: 'Data Pipeline', value: 85, index: 90 },
        { name: 'API Gateway', value: 95, index: 92 },
        { name: 'Cloud Migration', value: 78, index: 82 },
        { name: 'CRM Upgrade', value: 88, index: 86 },
        { name: 'Security Overhaul', value: 91, index: 88 },
        { name: 'Analytics Platform', value: 73, index: 70 },
        { name: 'DevOps Pipeline', value: 96, index: 94 },
        { name: 'Legacy Modernization', value: 62, index: 58 }
      ],
      'earned-value-trend': [
        { name: 'Week 1', value: 92 }, { name: 'Week 2', value: 95 }, { name: 'Week 3', value: 91 },
        { name: 'Week 4', value: 88 }, { name: 'Week 5', value: 90 }, { name: 'Week 6', value: 93 },
        { name: 'Week 7', value: 94 }, { name: 'Week 8', value: 96 }, { name: 'Week 9', value: 97 },
        { name: 'Week 10', value: 95 }, { name: 'Week 11', value: 98 }, { name: 'Week 12', value: 99 }
      ],
      'success-factors': [
        { name: 'Team Velocity', value: 28 },
        { name: 'Scope Stability', value: 22 },
        { name: 'Stakeholder Alignment', value: 18 },
        { name: 'Budget Adherence', value: 16 },
        { name: 'Risk Management', value: 16 }
      ],
      'risk-factors': [
        { name: 'Scope Creep', value: 87 },
        { name: 'Resource Constraints', value: 76 },
        { name: 'Technical Debt', value: 72 },
        { name: 'Dependency Delays', value: 68 },
        { name: 'Requirements Volatility', value: 64 },
        { name: 'Vendor Delays', value: 52 },
        { name: 'Knowledge Gaps', value: 48 },
        { name: 'Integration Complexity', value: 44 }
      ],
      'milestone-completion': [
        { name: 'Week 1', value: 82 }, { name: 'Week 2', value: 85 }, { name: 'Week 3', value: 78 },
        { name: 'Week 4', value: 76 }, { name: 'Week 5', value: 80 }, { name: 'Week 6', value: 83 },
        { name: 'Week 7', value: 84 }, { name: 'Week 8', value: 86 }, { name: 'Week 9', value: 88 },
        { name: 'Week 10', value: 85 }, { name: 'Week 11', value: 89 }, { name: 'Week 12', value: 91 }
      ],
      'team-performance': [
        { name: 'Velocity', value: 82 },
        { name: 'Quality', value: 88 },
        { name: 'Collaboration', value: 76 },
        { name: 'Predictability', value: 71 },
        { name: 'Innovation', value: 68 }
      ]
    },
    metrics: [
      {
        id: 'success-probability',
        label: 'Success Probability',
        value: '78%',
        trend: 'up',
        trendValue: 4,
        trendLabel: '+4% over last 4 weeks',
        severity: 'success'
      },
      {
        id: 'risk-score',
        label: 'Risk Score',
        value: '24',
        unit: '/ 100',
        trend: 'down',
        trendValue: -5,
        trendLabel: '-5 pts — improving',
        severity: 'success'
      },
      {
        id: 'on-track-projects',
        label: 'On-Track Projects',
        value: '19/25',
        trend: 'up',
        trendValue: 2,
        trendLabel: '+2 projects since last month',
        severity: 'success'
      },
      {
        id: 'budget-variance',
        label: 'Budget Variance',
        value: '-3.2%',
        trend: 'down',
        trendValue: -1.1,
        trendLabel: 'Under budget — healthy',
        severity: 'success'
      },
      {
        id: 'schedule-performance',
        label: 'Schedule Performance Index',
        value: '1.04',
        trend: 'up',
        trendValue: 0.03,
        trendLabel: 'Ahead of schedule',
        severity: 'success'
      },
      {
        id: 'model-confidence',
        label: 'AI Model Confidence',
        value: '91%',
        trend: 'up',
        trendValue: 2,
        trendLabel: '+2% after re-training',
        severity: 'info'
      }
    ],
    insights: [
      {
        id: 'insight-401',
        type: 'alert',
        severity: 'critical',
        title: 'Legacy Modernization at Critical Risk',
        description: 'Success probability plunged to 58% (was 74% four weeks ago). Root causes: scope increased by 35% without timeline extension, 2 senior architects departed, and 3 upstream dependencies are delayed by 4+ weeks.',
        confidence: 92,
        actionable: true,
        suggestedAction: 'Convene emergency steering committee. Options: (1) Reset scope to MVP with a revised timeline, (2) Inject 3 senior resources from the bench, (3) Escalate dependency delays to vendor management.'
      },
      {
        id: 'insight-402',
        type: 'alert',
        severity: 'high',
        title: 'Customer Portal Trending Downward',
        description: 'Success probability dropped from 82% to 68% over the past 3 weeks. The primary driver is scope creep (+15% in story points) combined with resource constraints as two developers were reassigned to the Cloud Migration project.',
        confidence: 88,
        actionable: true,
        suggestedAction: 'Immediate scope review meeting with the product owner. Freeze non-critical features and restore one senior developer from the bench pool.'
      },
      {
        id: 'insight-403',
        type: 'recommendation',
        severity: 'medium',
        title: 'Analytics Platform Needs Technical Debt Sprint',
        description: 'Success probability at 73% — below the 75% green threshold. Technical debt accumulation (142 unresolved code issues) is slowing velocity by an estimated 22%. Defect escape rate has increased 18% in the last 2 sprints.',
        confidence: 85,
        actionable: true,
        suggestedAction: 'Allocate a dedicated 2-week technical debt sprint with 3 senior developers. Focus on the 28 critical code issues first — projected to recover 15% velocity.'
      },
      {
        id: 'insight-404',
        type: 'prediction',
        severity: 'medium',
        title: 'Cloud Migration Budget Overrun Predicted',
        description: 'At the current burn rate, the Cloud Migration project will exceed its $2.4M budget by approximately $180K (7.5%) by project completion in Q3. The cost variance has widened steadily over the last 6 weeks.',
        confidence: 81,
        actionable: true,
        suggestedAction: 'Review vendor contract terms for optimization. Consider phasing the DR environment setup to Q4 to defer $120K in infrastructure costs.'
      },
      {
        id: 'insight-405',
        type: 'info',
        severity: 'low',
        title: 'API Gateway & DevOps Pipeline Exceeding Expectations',
        description: 'Both projects are at 94%+ success probability with strong team velocity (115% of target), zero scope changes, and 100% on-time milestone delivery. These teams can serve as models for best practice extraction.',
        confidence: 96,
        actionable: false
      },
      {
        id: 'insight-406',
        type: 'prediction',
        severity: 'low',
        title: 'Portfolio Health Improving Overall',
        description: 'AI model predicts portfolio-wide success probability will reach 82% within 4 weeks if current improvement trends continue. The number of at-risk projects is projected to drop from 6 to 3.',
        confidence: 79,
        actionable: false
      }
    ],
    tableData: [
      { project: 'Customer Portal', portfolio: 'Digital Transformation', successProb: '68%', riskLevel: 'High', budgetVar: '+5.2%', spi: '0.88', keyRisk: 'Scope Creep', status: 'At Risk' },
      { project: 'Mobile App', portfolio: 'Customer Experience', successProb: '71%', riskLevel: 'Medium', budgetVar: '+2.1%', spi: '0.92', keyRisk: 'Technical Debt', status: 'Monitor' },
      { project: 'Analytics Platform', portfolio: 'Data & Analytics', successProb: '73%', riskLevel: 'Medium', budgetVar: '-1.3%', spi: '0.95', keyRisk: 'Code Quality', status: 'Monitor' },
      { project: 'Cloud Migration', portfolio: 'Infrastructure', successProb: '78%', riskLevel: 'Medium', budgetVar: '+7.5%', spi: '1.02', keyRisk: 'Budget Overrun', status: 'Monitor' },
      { project: 'Data Pipeline', portfolio: 'Data & Analytics', successProb: '85%', riskLevel: 'Low', budgetVar: '-2.4%', spi: '1.05', keyRisk: 'Resource Availability', status: 'On Track' },
      { project: 'CRM Upgrade', portfolio: 'Customer Experience', successProb: '88%', riskLevel: 'Low', budgetVar: '-0.8%', spi: '1.08', keyRisk: 'None', status: 'On Track' },
      { project: 'Security Overhaul', portfolio: 'Infrastructure', successProb: '91%', riskLevel: 'Low', budgetVar: '-3.1%', spi: '1.06', keyRisk: 'None', status: 'On Track' },
      { project: 'API Gateway', portfolio: 'Digital Transformation', successProb: '94%', riskLevel: 'Very Low', budgetVar: '-4.2%', spi: '1.12', keyRisk: 'None', status: 'On Track' },
      { project: 'DevOps Pipeline', portfolio: 'Innovation', successProb: '96%', riskLevel: 'Very Low', budgetVar: '-5.0%', spi: '1.15', keyRisk: 'None', status: 'On Track' },
      { project: 'Legacy Modernization', portfolio: 'Infrastructure', successProb: '58%', riskLevel: 'Critical', budgetVar: '+12.3%', spi: '0.78', keyRisk: 'Scope + Resources', status: 'At Risk' }
    ],
    generatedAt: '2026-03-11T10:00:00Z',
    dataRange: { start: 'Week 1', end: 'Week 12' }
  },
  'performance-trending': {
    serviceId: 'performance-trending',
    dataSource: 'datadog',
    timeSeries: [
      { timestamp: '2026-01-25', value: 142, label: 'Jan 25' },
      { timestamp: '2026-01-30', value: 138, label: 'Jan 30' },
      { timestamp: '2026-02-04', value: 155, label: 'Feb 4' },
      { timestamp: '2026-02-09', value: 161, label: 'Feb 9' },
      { timestamp: '2026-02-14', value: 148, label: 'Feb 14' },
      { timestamp: '2026-02-19', value: 172, label: 'Feb 19' },
      { timestamp: '2026-02-23', value: 165, label: 'Feb 23' }
    ],
    metrics: [
      {
        id: 'avg-response',
        label: 'Avg Response Time',
        value: '165ms',
        trend: 'up',
        trendValue: 11.5,
        trendLabel: '+11.5% vs last period',
        severity: 'warning'
      },
      {
        id: 'throughput',
        label: 'Throughput',
        value: '2,847',
        unit: 'req/s',
        trend: 'up',
        trendValue: 8,
        trendLabel: '+8% week-over-week',
        severity: 'success'
      },
      {
        id: 'degradation-alerts',
        label: 'Degradation Alerts',
        value: 4,
        trend: 'up',
        trendValue: 2,
        trendLabel: '2 new alerts this week',
        severity: 'warning'
      }
    ],
    insights: [
      {
        id: 'perf-insight-001',
        type: 'alert',
        severity: 'medium',
        title: 'Latency Spike on Payment Service',
        description: 'Payment service P95 latency increased from 180ms to 290ms over the past 5 days. Correlates with increased transaction volume during month-end processing.',
        confidence: 91,
        actionable: true,
        suggestedAction: 'Scale payment service horizontally and review database connection pool settings. Consider enabling read replicas for reporting queries.'
      },
      {
        id: 'perf-insight-002',
        type: 'prediction',
        severity: 'medium',
        title: 'Throughput Ceiling Approaching',
        description: 'At current growth rate (+8% weekly), the API gateway will reach its 4,000 req/s throughput limit within 5 weeks.',
        confidence: 84,
        actionable: true,
        suggestedAction: 'Begin capacity planning for API gateway upgrade. Estimated lead time: 2 weeks for provisioning.'
      },
      {
        id: 'perf-insight-003',
        type: 'recommendation',
        severity: 'low',
        title: 'Enable Response Caching for Catalog API',
        description: 'Catalog API handles 35% of total requests with highly cacheable data. Adding a 60-second cache could reduce average latency by 40ms.',
        confidence: 88,
        actionable: true,
        suggestedAction: 'Implement Redis cache layer for /api/catalog endpoints with 60s TTL.'
      }
    ],
    tableData: [
      { service: 'Payment Service', latency: '290ms', throughput: '420 req/s', status: 'Degraded' },
      { service: 'Catalog API', latency: '95ms', throughput: '1,100 req/s', status: 'Healthy' },
      { service: 'User Auth', latency: '58ms', throughput: '780 req/s', status: 'Healthy' },
      { service: 'Order Processing', latency: '210ms', throughput: '340 req/s', status: 'Warning' },
      { service: 'Notification Hub', latency: '125ms', throughput: '207 req/s', status: 'Healthy' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2026-01-25', end: '2026-02-23' }
  },
  'lifecycle-optimization': {
    serviceId: 'lifecycle-optimization',
    dataSource: 'servicenow',
    timeSeries: [
      { timestamp: '2025-Q2', value: 8, label: 'Q2 2025' },
      { timestamp: '2025-Q3', value: 11, label: 'Q3 2025' },
      { timestamp: '2025-Q4', value: 14, label: 'Q4 2025' },
      { timestamp: '2026-Q1', value: 18, label: 'Q1 2026' },
      { timestamp: '2026-Q2', value: 22, label: 'Q2 2026 (proj)' },
      { timestamp: '2026-Q3', value: 16, label: 'Q3 2026 (proj)' }
    ],
    metrics: [
      {
        id: 'eol-systems',
        label: 'End-of-Life Systems',
        value: 7,
        trend: 'up',
        trendValue: 2,
        trendLabel: '2 new since last quarter',
        severity: 'warning'
      },
      {
        id: 'refresh-savings',
        label: 'Refresh Savings (YTD)',
        value: '$320K',
        trend: 'up',
        trendValue: 18,
        trendLabel: '+18% vs plan',
        severity: 'success'
      },
      {
        id: 'avg-age',
        label: 'Avg System Age',
        value: '4.2',
        unit: 'years',
        trend: 'up',
        trendValue: 0.3,
        trendLabel: 'Aging portfolio',
        severity: 'warning'
      }
    ],
    insights: [
      {
        id: 'lc-insight-001',
        type: 'alert',
        severity: 'high',
        title: '3 Systems Approaching End-of-Support',
        description: 'Legacy CRM, HR Portal, and Reporting Engine will lose vendor support by June 2026. Security patches will no longer be available.',
        confidence: 97,
        actionable: true,
        suggestedAction: 'Initiate migration planning for all 3 systems. Priority: Legacy CRM (highest business impact). Budget estimate: $180K.'
      },
      {
        id: 'lc-insight-002',
        type: 'recommendation',
        severity: 'medium',
        title: 'Consolidate Redundant ERP Modules',
        description: 'Finance and Procurement modules overlap 40% in functionality. Consolidation would reduce licensing by $85K/year and simplify maintenance.',
        confidence: 82,
        actionable: true,
        suggestedAction: 'Commission a 4-week functional overlap assessment and present business case to steering committee.'
      },
      {
        id: 'lc-insight-003',
        type: 'prediction',
        severity: 'low',
        title: 'Refresh Wave Q3 2026 Will Reduce Risk',
        description: 'Planned Q3 refresh of 6 systems will reduce average portfolio age from 4.2 to 3.4 years and eliminate all EOL systems.',
        confidence: 79,
        actionable: false
      }
    ],
    tableData: [
      { system: 'Legacy CRM', age: '7.2 yrs', action: 'Replace', timeline: 'Q2 2026', cost: '$95K' },
      { system: 'HR Portal', age: '6.8 yrs', action: 'Migrate to SaaS', timeline: 'Q2 2026', cost: '$52K' },
      { system: 'Reporting Engine', age: '5.5 yrs', action: 'Upgrade', timeline: 'Q3 2026', cost: '$33K' },
      { system: 'ERP Finance Module', age: '4.1 yrs', action: 'Consolidate', timeline: 'Q3 2026', cost: '$45K' },
      { system: 'Document Management', age: '3.9 yrs', action: 'Extend License', timeline: 'Q4 2026', cost: '$12K' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2025-Q2', end: '2026-Q3' }
  },
  'cost-analytics': {
    serviceId: 'cost-analytics',
    dataSource: 'finops',
    timeSeries: [
      { timestamp: '2025-03', value: 142, label: 'Mar 2025' },
      { timestamp: '2025-04', value: 148, label: 'Apr 2025' },
      { timestamp: '2025-05', value: 145, label: 'May 2025' },
      { timestamp: '2025-06', value: 151, label: 'Jun 2025' },
      { timestamp: '2025-07', value: 156, label: 'Jul 2025' },
      { timestamp: '2025-08', value: 153, label: 'Aug 2025' },
      { timestamp: '2025-09', value: 162, label: 'Sep 2025' },
      { timestamp: '2025-10', value: 158, label: 'Oct 2025' },
      { timestamp: '2025-11', value: 167, label: 'Nov 2025' },
      { timestamp: '2025-12', value: 171, label: 'Dec 2025' },
      { timestamp: '2026-01', value: 175, label: 'Jan 2026' },
      { timestamp: '2026-02', value: 169, label: 'Feb 2026' }
    ],
    metrics: [
      {
        id: 'total-spend',
        label: 'Total Monthly Spend',
        value: '$169K',
        trend: 'down',
        trendValue: -3.4,
        trendLabel: '-3.4% vs last month',
        severity: 'success'
      },
      {
        id: 'cost-per-user',
        label: 'Cost per User',
        value: '$42.25',
        trend: 'down',
        trendValue: -5.1,
        trendLabel: '-5.1% (user base grew)',
        severity: 'success'
      },
      {
        id: 'waste-identified',
        label: 'Waste Identified',
        value: '$23K',
        trend: 'up',
        trendValue: 8,
        trendLabel: 'New findings this month',
        severity: 'warning'
      }
    ],
    insights: [
      {
        id: 'cost-insight-001',
        type: 'alert',
        severity: 'medium',
        title: 'Unused Cloud Resources Detected',
        description: '14 idle VM instances and 8 unattached storage volumes identified across Azure and AWS. Combined monthly waste: $11.2K.',
        confidence: 94,
        actionable: true,
        suggestedAction: 'Review tagged idle resources in the FinOps dashboard. Auto-terminate policy recommended for instances idle >30 days.'
      },
      {
        id: 'cost-insight-002',
        type: 'recommendation',
        severity: 'medium',
        title: 'Reserved Instance Opportunity',
        description: 'Analysis of 12-month usage patterns shows 8 workloads suitable for 1-year reserved instances, saving an estimated $38K/year.',
        confidence: 89,
        actionable: true,
        suggestedAction: 'Convert identified on-demand workloads to 1-year reserved instances before the March billing cycle.'
      },
      {
        id: 'cost-insight-003',
        type: 'info',
        severity: 'low',
        title: 'Cost-per-User Improving',
        description: 'Cost per user decreased 5.1% as user base grew 8% while total spend grew only 2.4%. Economies of scale are being realized.',
        confidence: 96,
        actionable: false
      }
    ],
    tableData: [
      { system: 'Azure Cloud Services', monthlyCost: '$62.4K', optimization: 'Reserved Instances', savings: '$14.2K/yr' },
      { system: 'SAP ERP Licensing', monthlyCost: '$38.1K', optimization: 'License Rightsizing', savings: '$8.5K/yr' },
      { system: 'AWS Infrastructure', monthlyCost: '$31.7K', optimization: 'Idle Resource Cleanup', savings: '$11.2K/yr' },
      { system: 'Salesforce CRM', monthlyCost: '$22.5K', optimization: 'Unused Seat Removal', savings: '$4.8K/yr' },
      { system: 'Monitoring & Tooling', monthlyCost: '$14.3K', optimization: 'Consolidate Vendors', savings: '$6.1K/yr' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2025-03-01', end: '2026-02-28' }
  },
  'security-intelligence': {
    serviceId: 'security-intelligence',
    dataSource: 'qualys',
    timeSeries: [
      { timestamp: '2026-01-25', value: 34, label: 'Jan 25' },
      { timestamp: '2026-01-28', value: 31, label: 'Jan 28' },
      { timestamp: '2026-02-01', value: 28, label: 'Feb 1' },
      { timestamp: '2026-02-05', value: 42, label: 'Feb 5' },
      { timestamp: '2026-02-10', value: 38, label: 'Feb 10' },
      { timestamp: '2026-02-15', value: 33, label: 'Feb 15' },
      { timestamp: '2026-02-19', value: 29, label: 'Feb 19' },
      { timestamp: '2026-02-23', value: 26, label: 'Feb 23' }
    ],
    metrics: [
      {
        id: 'critical-vulns',
        label: 'Critical Vulnerabilities',
        value: 5,
        trend: 'down',
        trendValue: -3,
        trendLabel: '3 remediated this week',
        severity: 'error'
      },
      {
        id: 'threat-level',
        label: 'Threat Level',
        value: 'Elevated',
        trend: 'stable',
        trendLabel: 'Active threat campaign',
        severity: 'warning'
      },
      {
        id: 'compliance-score',
        label: 'Compliance Score',
        value: '87%',
        trend: 'up',
        trendValue: 4,
        trendLabel: '+4% this month',
        severity: 'warning'
      }
    ],
    insights: [
      {
        id: 'sec-insight-001',
        type: 'alert',
        severity: 'high',
        title: 'CVE-2026-1847 Affects 3 Production Systems',
        description: 'A critical RCE vulnerability (CVSS 9.8) in Apache Commons was disclosed Feb 5. Three production services are running affected versions.',
        confidence: 98,
        actionable: true,
        suggestedAction: 'Apply emergency patch to Order Service, Payment Gateway, and Notification Service. Estimated downtime: 15 min per service with rolling restart.'
      },
      {
        id: 'sec-insight-002',
        type: 'prediction',
        severity: 'medium',
        title: 'Compliance Gap Risk for SOC 2 Audit',
        description: 'At current remediation velocity, 3 medium-severity findings will remain open by the March 15 audit deadline.',
        confidence: 85,
        actionable: true,
        suggestedAction: 'Escalate remaining 3 findings to engineering leads. Prioritize: MFA enforcement, log retention policy, and access review completion.'
      },
      {
        id: 'sec-insight-003',
        type: 'info',
        severity: 'low',
        title: 'Vulnerability Remediation Rate Improving',
        description: 'Mean time to remediate critical vulnerabilities dropped from 12 days to 7 days over the past quarter. Remediation SLA compliance is at 91%.',
        confidence: 93,
        actionable: false
      }
    ],
    tableData: [
      { cve: 'CVE-2026-1847', system: 'Order Service', severity: 'Critical', status: 'In Progress', age: '18 days' },
      { cve: 'CVE-2026-1847', system: 'Payment Gateway', severity: 'Critical', status: 'Scheduled', age: '18 days' },
      { cve: 'CVE-2026-0923', system: 'API Gateway', severity: 'High', status: 'In Progress', age: '32 days' },
      { cve: 'CVE-2025-4412', system: 'Data Warehouse', severity: 'Medium', status: 'Open', age: '45 days' },
      { cve: 'CVE-2026-1102', system: 'Auth Service', severity: 'Medium', status: 'Verified Fixed', age: '12 days' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2026-01-25', end: '2026-02-23' }
  },
  'availability-tracking': {
    serviceId: 'availability-tracking',
    dataSource: 'datadog',
    timeSeries: [
      { timestamp: '2026-01-25', value: 99.95, label: 'Jan 25' },
      { timestamp: '2026-01-28', value: 99.91, label: 'Jan 28' },
      { timestamp: '2026-02-01', value: 99.88, label: 'Feb 1' },
      { timestamp: '2026-02-05', value: 98.72, label: 'Feb 5' },
      { timestamp: '2026-02-10', value: 99.94, label: 'Feb 10' },
      { timestamp: '2026-02-14', value: 99.97, label: 'Feb 14' },
      { timestamp: '2026-02-19', value: 99.93, label: 'Feb 19' },
      { timestamp: '2026-02-23', value: 99.96, label: 'Feb 23' }
    ],
    metrics: [
      {
        id: 'current-uptime',
        label: 'Current Uptime (MTD)',
        value: '99.82%',
        trend: 'up',
        trendValue: 0.15,
        trendLabel: '+0.15% vs last month',
        severity: 'success'
      },
      {
        id: 'sla-compliance',
        label: 'SLA Compliance',
        value: '96%',
        trend: 'stable',
        trendLabel: '24 of 25 SLAs met',
        severity: 'success'
      },
      {
        id: 'incidents-mtd',
        label: 'Incidents (MTD)',
        value: 7,
        trend: 'down',
        trendValue: -4,
        trendLabel: '4 fewer than last month',
        severity: 'success'
      }
    ],
    insights: [
      {
        id: 'avail-insight-001',
        type: 'alert',
        severity: 'medium',
        title: 'Payment Gateway SLA Breach',
        description: 'Payment Gateway uptime is 98.72% MTD, breaching the 99.5% SLA. A 73-minute outage on Feb 5 was the primary cause.',
        confidence: 99,
        actionable: true,
        suggestedAction: 'Complete post-incident review for Feb 5 outage. Implement recommended failover automation to prevent recurrence.'
      },
      {
        id: 'avail-insight-002',
        type: 'prediction',
        severity: 'low',
        title: 'Month-End SLA Targets Achievable',
        description: 'With 5 days remaining in February and current uptime trajectory, 24 of 25 systems will meet their SLA targets. Payment Gateway recovery would require 100% uptime for remainder.',
        confidence: 92,
        actionable: false
      },
      {
        id: 'avail-insight-003',
        type: 'recommendation',
        severity: 'medium',
        title: 'Implement Active-Active for Payment Gateway',
        description: 'Payment Gateway has had 3 SLA breaches in 6 months. Migrating to active-active architecture would provide automatic failover within 30 seconds.',
        confidence: 87,
        actionable: true,
        suggestedAction: 'Submit architecture proposal for active-active Payment Gateway. Estimated effort: 6 weeks, $45K infrastructure cost.'
      }
    ],
    tableData: [
      { system: 'SAP ERP', slaTarget: '99.5%', actual: '99.97%', status: 'Met', incidents: 0 },
      { system: 'Payment Gateway', slaTarget: '99.5%', actual: '98.72%', status: 'Breached', incidents: 3 },
      { system: 'Salesforce CRM', slaTarget: '99.9%', actual: '99.95%', status: 'Met', incidents: 1 },
      { system: 'API Gateway', slaTarget: '99.9%', actual: '99.91%', status: 'Met', incidents: 2 },
      { system: 'Data Warehouse', slaTarget: '99.0%', actual: '99.88%', status: 'Met', incidents: 1 }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2026-01-25', end: '2026-02-23' }
  },
  'dependency-intelligence': {
    serviceId: 'dependency-intelligence',
    dataSource: 'servicenow',
    timeSeries: [
      { timestamp: '2025-Q1', value: 124, label: 'Q1 2025' },
      { timestamp: '2025-Q2', value: 131, label: 'Q2 2025' },
      { timestamp: '2025-Q3', value: 142, label: 'Q3 2025' },
      { timestamp: '2025-Q4', value: 148, label: 'Q4 2025' },
      { timestamp: '2026-Q1', value: 156, label: 'Q1 2026' },
      { timestamp: '2026-Q2', value: 163, label: 'Q2 2026 (proj)' }
    ],
    metrics: [
      {
        id: 'total-dependencies',
        label: 'Total Dependencies',
        value: 156,
        trend: 'up',
        trendValue: 5.4,
        trendLabel: '+8 this quarter',
        severity: 'info'
      },
      {
        id: 'critical-chains',
        label: 'Critical Chains',
        value: 12,
        trend: 'up',
        trendValue: 2,
        trendLabel: '2 new chains identified',
        severity: 'warning'
      },
      {
        id: 'blast-radius',
        label: 'Max Blast Radius',
        value: '14 systems',
        trend: 'stable',
        trendLabel: 'SAP ERP hub',
        severity: 'error'
      }
    ],
    insights: [
      {
        id: 'dep-insight-001',
        type: 'alert',
        severity: 'high',
        title: 'SAP ERP Single Point of Failure',
        description: 'SAP ERP is a dependency for 14 downstream systems. A failure would impact 78% of business operations including payroll, procurement, and financial reporting.',
        confidence: 96,
        actionable: true,
        suggestedAction: 'Implement circuit breaker patterns and graceful degradation for the top 5 most critical dependent services. Priority: Payroll, Order Management.'
      },
      {
        id: 'dep-insight-002',
        type: 'recommendation',
        severity: 'medium',
        title: 'Circular Dependency Detected',
        description: 'A circular dependency exists between Order Service → Inventory Service → Pricing Engine → Order Service. This creates cascading failure risk and complicates deployments.',
        confidence: 91,
        actionable: true,
        suggestedAction: 'Introduce an event bus to decouple Pricing Engine from Order Service. Estimated refactoring effort: 3 weeks.'
      },
      {
        id: 'dep-insight-003',
        type: 'info',
        severity: 'low',
        title: 'Dependency Map 94% Validated',
        description: 'Automated discovery validated 147 of 156 dependencies. 9 dependencies require manual verification — primarily legacy batch interfaces.',
        confidence: 94,
        actionable: false
      }
    ],
    tableData: [
      { source: 'SAP ERP', target: 'Payroll System', type: 'Synchronous API', criticality: 'Critical', validated: 'Yes' },
      { source: 'Order Service', target: 'Inventory Service', type: 'Synchronous API', criticality: 'Critical', validated: 'Yes' },
      { source: 'Pricing Engine', target: 'Order Service', type: 'Event-Driven', criticality: 'High', validated: 'Yes' },
      { source: 'Data Warehouse', target: 'Reporting Engine', type: 'Batch ETL', criticality: 'Medium', validated: 'Pending' },
      { source: 'Auth Service', target: 'API Gateway', type: 'Synchronous API', criticality: 'Critical', validated: 'Yes' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2025-Q1', end: '2026-Q2' }
  },
  'capacity-forecasting': {
    serviceId: 'capacity-forecasting',
    dataSource: 'datadog',
    timeSeries: [
      { timestamp: '2026-02-01', value: 62, label: 'Feb 1' },
      { timestamp: '2026-02-15', value: 65, label: 'Feb 15' },
      { timestamp: '2026-03-01', value: 68, label: 'Mar 1 (proj)' },
      { timestamp: '2026-03-15', value: 72, label: 'Mar 15 (proj)' },
      { timestamp: '2026-04-01', value: 75, label: 'Apr 1 (proj)' },
      { timestamp: '2026-04-15', value: 79, label: 'Apr 15 (proj)' },
      { timestamp: '2026-05-01', value: 83, label: 'May 1 (proj)' }
    ],
    metrics: [
      {
        id: 'headroom',
        label: 'Current Headroom',
        value: '35%',
        trend: 'down',
        trendValue: -4,
        trendLabel: '-4% since last month',
        severity: 'warning'
      },
      {
        id: 'days-to-threshold',
        label: 'Days to 80% Threshold',
        value: 67,
        unit: 'days',
        trend: 'down',
        trendValue: -12,
        trendLabel: '12 days sooner than forecast',
        severity: 'warning'
      },
      {
        id: 'scaling-events',
        label: 'Auto-Scale Events (MTD)',
        value: 18,
        trend: 'up',
        trendValue: 6,
        trendLabel: '+6 vs last month',
        severity: 'info'
      }
    ],
    insights: [
      {
        id: 'cap-insight-001',
        type: 'alert',
        severity: 'high',
        title: 'Database Storage Reaches 80% in 42 Days',
        description: 'Primary database is consuming storage at 1.8 GB/day. At current rate, the 80% threshold will be breached by April 6, triggering performance degradation.',
        confidence: 90,
        actionable: true,
        suggestedAction: 'Initiate storage expansion request (estimated 500 GB needed). Implement data archival for records older than 3 years to buy additional 30 days.'
      },
      {
        id: 'cap-insight-002',
        type: 'prediction',
        severity: 'medium',
        title: 'Compute Capacity Sufficient Through Q2',
        description: 'CPU utilization across the application tier averages 58% with peak at 74%. Auto-scaling can absorb projected 15% traffic growth through June 2026.',
        confidence: 86,
        actionable: false
      },
      {
        id: 'cap-insight-003',
        type: 'recommendation',
        severity: 'medium',
        title: 'Right-Size Over-Provisioned Dev Environments',
        description: '6 development environments are provisioned at production scale but average only 12% utilization. Downsizing would save $8.4K/month.',
        confidence: 93,
        actionable: true,
        suggestedAction: 'Apply recommended instance size reductions to staging and dev environments. Use auto-scaling for load testing environments.'
      }
    ],
    tableData: [
      { resource: 'DB Primary Storage', current: '65%', projected: '83%', threshold: '80%', action: 'Expand Storage' },
      { resource: 'App Tier CPU', current: '58%', projected: '67%', threshold: '80%', action: 'Monitor' },
      { resource: 'Redis Memory', current: '71%', projected: '78%', threshold: '85%', action: 'Monitor' },
      { resource: 'Network Bandwidth', current: '42%', projected: '51%', threshold: '75%', action: 'No Action' },
      { resource: 'Kubernetes Pods', current: '74%', projected: '89%', threshold: '85%', action: 'Scale Node Pool' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2026-02-01', end: '2026-05-01' }
  },
  'usage-analytics': {
    serviceId: 'usage-analytics',
    dataSource: 'mixpanel',
    timeSeries: [
      { timestamp: '2026-01-25', value: 3240, label: 'Jan 25' },
      { timestamp: '2026-01-28', value: 3410, label: 'Jan 28' },
      { timestamp: '2026-02-01', value: 3180, label: 'Feb 1' },
      { timestamp: '2026-02-05', value: 3520, label: 'Feb 5' },
      { timestamp: '2026-02-10', value: 3675, label: 'Feb 10' },
      { timestamp: '2026-02-14', value: 3490, label: 'Feb 14' },
      { timestamp: '2026-02-19', value: 3710, label: 'Feb 19' },
      { timestamp: '2026-02-23', value: 3845, label: 'Feb 23' }
    ],
    metrics: [
      {
        id: 'active-users',
        label: 'Active Users (DAU)',
        value: '3,845',
        trend: 'up',
        trendValue: 12,
        trendLabel: '+12% month-over-month',
        severity: 'success'
      },
      {
        id: 'adoption-rate',
        label: 'Platform Adoption Rate',
        value: '76%',
        trend: 'up',
        trendValue: 4,
        trendLabel: '+4% this quarter',
        severity: 'success'
      },
      {
        id: 'avg-sessions',
        label: 'Avg Sessions per User',
        value: '4.2',
        unit: 'per day',
        trend: 'up',
        trendValue: 0.6,
        trendLabel: '+0.6 vs last month',
        severity: 'success'
      }
    ],
    insights: [
      {
        id: 'usage-insight-001',
        type: 'alert',
        severity: 'medium',
        title: 'Reporting Module Adoption Stalling',
        description: 'Reporting module adoption has plateaued at 34% for 3 consecutive months despite training campaigns. User feedback indicates complexity as the primary barrier.',
        confidence: 88,
        actionable: true,
        suggestedAction: 'Simplify the reporting UI with pre-built templates. Schedule 3 targeted workshops for power users who can champion adoption.'
      },
      {
        id: 'usage-insight-002',
        type: 'info',
        severity: 'low',
        title: 'Mobile App Usage Surging',
        description: 'Mobile app DAU increased 28% this month. Users on mobile complete approvals 3x faster than on desktop, driving the shift.',
        confidence: 94,
        actionable: false
      },
      {
        id: 'usage-insight-003',
        type: 'recommendation',
        severity: 'low',
        title: 'Decommission Underutilized Legacy Interface',
        description: 'Legacy web interface has only 47 active users (1.2% of total). All functionality is available in the modern portal. Decommissioning would save $6.2K/month in hosting.',
        confidence: 91,
        actionable: true,
        suggestedAction: 'Notify remaining 47 users with a 60-day migration timeline. Provide personalized onboarding to the modern portal.'
      }
    ],
    tableData: [
      { system: 'Modern Portal', users: '3,210', sessions: '14,520/day', adoption: '84%', trend: '↑ Growing' },
      { system: 'Mobile App', users: '1,845', sessions: '6,230/day', adoption: '48%', trend: '↑ Surging' },
      { system: 'Reporting Module', users: '1,310', sessions: '2,870/day', adoption: '34%', trend: '→ Stalled' },
      { system: 'Admin Console', users: '285', sessions: '820/day', adoption: '92%', trend: '→ Stable' },
      { system: 'Legacy Interface', users: '47', sessions: '95/day', adoption: '1.2%', trend: '↓ Declining' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2026-01-25', end: '2026-02-23' }
  },
  'incident-intelligence': {
    serviceId: 'incident-intelligence',
    dataSource: 'servicenow',
    timeSeries: [
      { timestamp: '2026-01-25', value: 8, label: 'Jan 25' },
      { timestamp: '2026-01-28', value: 5, label: 'Jan 28' },
      { timestamp: '2026-02-01', value: 12, label: 'Feb 1' },
      { timestamp: '2026-02-05', value: 9, label: 'Feb 5' },
      { timestamp: '2026-02-10', value: 6, label: 'Feb 10' },
      { timestamp: '2026-02-14', value: 4, label: 'Feb 14' },
      { timestamp: '2026-02-19', value: 7, label: 'Feb 19' },
      { timestamp: '2026-02-23', value: 5, label: 'Feb 23' }
    ],
    metrics: [
      {
        id: 'open-incidents',
        label: 'Open Incidents',
        value: 11,
        trend: 'down',
        trendValue: -5,
        trendLabel: '5 resolved this week',
        severity: 'warning'
      },
      {
        id: 'mttr',
        label: 'Mean Time to Resolve',
        value: '3.2',
        unit: 'hours',
        trend: 'down',
        trendValue: -18,
        trendLabel: '-18% vs last month',
        severity: 'success'
      },
      {
        id: 'recurring-pct',
        label: 'Recurring Incidents',
        value: '22%',
        trend: 'up',
        trendValue: 5,
        trendLabel: '+5% — repeat offenders',
        severity: 'warning'
      }
    ],
    insights: [
      {
        id: 'inc-insight-001',
        type: 'alert',
        severity: 'high',
        title: 'Memory Leak Causing Recurring Outages',
        description: 'Order Service has had 4 identical P2 incidents in 3 weeks, all caused by a memory leak under high concurrency. Each incident requires a manual restart averaging 45 minutes of downtime.',
        confidence: 93,
        actionable: true,
        suggestedAction: 'Deploy hotfix for Order Service memory management (PR #1247 ready for review). Implement automated heap dump collection on OOM events.'
      },
      {
        id: 'inc-insight-002',
        type: 'recommendation',
        severity: 'medium',
        title: 'Improve Runbook for Database Failover',
        description: 'Database failover incidents average 4.1 hours MTTR vs. the 2-hour target. Analysis of 6 incidents shows responders spend 40% of time locating documentation.',
        confidence: 87,
        actionable: true,
        suggestedAction: 'Consolidate failover runbooks into a single automated playbook. Add one-click failover script to reduce MTTR to under 30 minutes.'
      },
      {
        id: 'inc-insight-003',
        type: 'info',
        severity: 'low',
        title: 'MTTR Trending Down Across All Priorities',
        description: 'Mean time to resolve improved across all priority levels: P1 down 25%, P2 down 18%, P3 down 12%. On-call training program is showing measurable impact.',
        confidence: 95,
        actionable: false
      }
    ],
    tableData: [
      { incident: 'INC-2026-0412', priority: 'P1', system: 'Payment Gateway', rootCause: 'SSL Certificate Expiry', resolutionTime: '1.2 hrs' },
      { incident: 'INC-2026-0398', priority: 'P2', system: 'Order Service', rootCause: 'Memory Leak', resolutionTime: '0.8 hrs' },
      { incident: 'INC-2026-0385', priority: 'P2', system: 'Data Warehouse', rootCause: 'Disk Full', resolutionTime: '2.5 hrs' },
      { incident: 'INC-2026-0371', priority: 'P3', system: 'Reporting Engine', rootCause: 'Query Timeout', resolutionTime: '4.1 hrs' },
      { incident: 'INC-2026-0364', priority: 'P2', system: 'API Gateway', rootCause: 'Rate Limit Misconfiguration', resolutionTime: '1.5 hrs' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2026-01-25', end: '2026-02-23' }
  },
  'integration-health': {
    serviceId: 'integration-health',
    dataSource: 'datadog',
    timeSeries: [
      { timestamp: '2026-02-17', value: 1.8, label: 'Mon' },
      { timestamp: '2026-02-18', value: 2.1, label: 'Tue' },
      { timestamp: '2026-02-19', value: 1.5, label: 'Wed' },
      { timestamp: '2026-02-20', value: 3.4, label: 'Thu' },
      { timestamp: '2026-02-21', value: 4.7, label: 'Fri' },
      { timestamp: '2026-02-22', value: 2.9, label: 'Sat' },
      { timestamp: '2026-02-23', value: 2.2, label: 'Sun' }
    ],
    metrics: [
      {
        id: 'healthy-integrations',
        label: 'Healthy Integrations',
        value: '41/45',
        trend: 'down',
        trendValue: -2,
        trendLabel: '2 degraded since Friday',
        severity: 'warning'
      },
      {
        id: 'error-rate',
        label: 'Avg Error Rate',
        value: '2.2%',
        trend: 'down',
        trendValue: -0.7,
        trendLabel: '-0.7% since peak',
        severity: 'success'
      },
      {
        id: 'avg-latency',
        label: 'Avg Integration Latency',
        value: '340ms',
        trend: 'up',
        trendValue: 12,
        trendLabel: '+12% this week',
        severity: 'warning'
      }
    ],
    insights: [
      {
        id: 'int-insight-001',
        type: 'alert',
        severity: 'high',
        title: 'SAP–Salesforce Sync Failing Intermittently',
        description: 'The SAP-to-Salesforce customer data sync has a 12.3% error rate over the past 48 hours. Failed records are accumulating in the dead-letter queue (847 records).',
        confidence: 96,
        actionable: true,
        suggestedAction: 'Investigate Salesforce API rate limit changes effective Feb 20. Implement exponential backoff retry and process dead-letter queue to prevent data drift.'
      },
      {
        id: 'int-insight-002',
        type: 'recommendation',
        severity: 'medium',
        title: 'Migrate Legacy FTP Integrations to API',
        description: '4 integrations still use FTP-based file transfers with no retry logic, no encryption, and 8-hour batch windows. These account for 60% of integration-related incidents.',
        confidence: 85,
        actionable: true,
        suggestedAction: 'Prioritize migration of Payroll and Procurement FTP feeds to REST APIs. Estimated effort: 4 weeks per integration.'
      },
      {
        id: 'int-insight-003',
        type: 'info',
        severity: 'low',
        title: 'New Webhook Infrastructure Performing Well',
        description: 'The 8 integrations migrated to the webhook platform last month show 99.7% delivery rate with average latency of 120ms — a 65% improvement over the polling-based approach.',
        confidence: 97,
        actionable: false
      }
    ],
    tableData: [
      { integration: 'SAP → Salesforce Sync', health: 'Degraded', latency: '890ms', errorRate: '12.3%', lastCheck: '2 min ago' },
      { integration: 'Payment → Ledger', health: 'Healthy', latency: '210ms', errorRate: '0.1%', lastCheck: '1 min ago' },
      { integration: 'HR → Payroll (FTP)', health: 'Warning', latency: '1,200ms', errorRate: '3.8%', lastCheck: '8 hrs ago' },
      { integration: 'CRM → Marketing Hub', health: 'Healthy', latency: '180ms', errorRate: '0.3%', lastCheck: '1 min ago' },
      { integration: 'Inventory → Warehouse', health: 'Healthy', latency: '145ms', errorRate: '0.2%', lastCheck: '30 sec ago' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2026-02-17', end: '2026-02-23' }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DIGITAL MATURITY — 7 additional services
  // ═══════════════════════════════════════════════════════════════════════════

  'transformation-readiness-score': {
    serviceId: 'transformation-readiness-score',
    dataSource: 'assessment-tool',
    timeSeries: [
      { timestamp: '2025-09-01', value: 58, label: 'Sep 2025' },
      { timestamp: '2025-10-01', value: 62, label: 'Oct 2025' },
      { timestamp: '2025-11-01', value: 65, label: 'Nov 2025' },
      { timestamp: '2025-12-01', value: 68, label: 'Dec 2025' },
      { timestamp: '2026-01-01', value: 71, label: 'Jan 2026' },
      { timestamp: '2026-02-01', value: 74, label: 'Feb 2026' }
    ],
    metrics: [
      { id: 'readiness-score', label: 'Readiness Score', value: 74, unit: 'out of 100', trend: 'up', trendValue: 4.2, trendLabel: '+4.2% vs last month', severity: 'success' },
      { id: 'blockers', label: 'Active Blockers', value: 5, trend: 'down', trendValue: -2, trendLabel: '2 fewer than last month', severity: 'warning' },
      { id: 'enablers-met', label: 'Enablers Met', value: '18/24', trend: 'up', trendValue: 3, trendLabel: '3 new enablers met', severity: 'success' }
    ],
    insights: [
      { id: 'trs-insight-001', type: 'alert', severity: 'medium', title: 'Change Management Capacity at Risk', description: 'Change management readiness dimension scored 52/100, well below the 70-point threshold. Only 3 of 8 change agents are certified.', confidence: 89, actionable: true, suggestedAction: 'Fast-track change management certification for 5 additional agents. Target completion by end of Q1 2026.' },
      { id: 'trs-insight-002', type: 'prediction', severity: 'low', title: 'Readiness Target Achievable by Q2', description: 'At current improvement velocity of 3-4 points per month, the organization will reach the 80-point readiness threshold by April 2026.', confidence: 82, actionable: false },
      { id: 'trs-insight-003', type: 'recommendation', severity: 'medium', title: 'Strengthen Data Governance Foundation', description: 'Data governance readiness is the largest gap at 48/100. This will bottleneck AI and analytics transformation initiatives planned for H2 2026.', confidence: 91, actionable: true, suggestedAction: 'Appoint a dedicated Data Governance Lead and establish a cross-functional data stewardship council within 30 days.' }
    ],
    tableData: [
      { dimension: 'Leadership & Vision', score: 82, target: 85, gap: 3, status: 'On Track' },
      { dimension: 'Culture & Change Mgmt', score: 52, target: 70, gap: 18, status: 'At Risk' },
      { dimension: 'Technology Infrastructure', score: 78, target: 80, gap: 2, status: 'On Track' },
      { dimension: 'Data Governance', score: 48, target: 75, gap: 27, status: 'Critical' },
      { dimension: 'Talent & Skills', score: 71, target: 80, gap: 9, status: 'Needs Attention' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2025-09-01', end: '2026-02-23' }
  },
  'capability-maturity-tracking': {
    serviceId: 'capability-maturity-tracking',
    dataSource: 'assessment-tool',
    timeSeries: [
      { timestamp: '2025-Q1', value: 2.4, label: 'Q1 2025' },
      { timestamp: '2025-Q2', value: 2.6, label: 'Q2 2025' },
      { timestamp: '2025-Q3', value: 2.9, label: 'Q3 2025' },
      { timestamp: '2025-Q4', value: 3.1, label: 'Q4 2025' },
      { timestamp: '2026-Q1', value: 3.3, label: 'Q1 2026' }
    ],
    metrics: [
      { id: 'avg-maturity', label: 'Average Maturity Level', value: 3.3, unit: 'out of 5', trend: 'up', trendValue: 6.5, trendLabel: '+0.2 vs last quarter', severity: 'success' },
      { id: 'capabilities-tracked', label: 'Capabilities Tracked', value: 42, trend: 'stable', severity: 'info' },
      { id: 'improving', label: 'Capabilities Improving', value: '28/42', trend: 'up', trendValue: 5, trendLabel: '5 more than last quarter', severity: 'success' }
    ],
    insights: [
      { id: 'cmt-insight-001', type: 'info', severity: 'low', title: 'Steady Maturity Growth Across Portfolio', description: '67% of tracked capabilities showed improvement this quarter. Average improvement rate of 0.2 points per quarter indicates healthy organizational learning.', confidence: 94, actionable: false },
      { id: 'cmt-insight-002', type: 'alert', severity: 'high', title: 'Supply Chain Capabilities Stagnating', description: 'Supply chain management capabilities have remained at 1.8 for 3 consecutive quarters, significantly below the organizational target of 3.0.', confidence: 96, actionable: true, suggestedAction: 'Conduct a root cause analysis with supply chain leadership. Consider external consulting engagement for capability uplift.' },
      { id: 'cmt-insight-003', type: 'recommendation', severity: 'medium', title: 'Accelerate Cloud-Native Capabilities', description: 'Cloud-native capabilities at 2.5 are below the industry benchmark of 3.4. Competitors are advancing 40% faster in this domain.', confidence: 87, actionable: true, suggestedAction: 'Invest in cloud-native training program and establish a Cloud Center of Excellence by Q2 2026.' }
    ],
    tableData: [
      { capability: 'Digital Customer Engagement', score: 4.1, benchmark: 3.8, trend: '↑', priority: 'Maintain' },
      { capability: 'Data Analytics & BI', score: 3.5, benchmark: 3.6, trend: '↑', priority: 'Medium' },
      { capability: 'Cloud-Native Development', score: 2.5, benchmark: 3.4, trend: '→', priority: 'High' },
      { capability: 'Supply Chain Management', score: 1.8, benchmark: 3.0, trend: '→', priority: 'Critical' },
      { capability: 'Cybersecurity Operations', score: 3.9, benchmark: 3.7, trend: '↑', priority: 'Low' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2025-Q1', end: '2026-Q1' }
  },
  'technology-maturity-index': {
    serviceId: 'technology-maturity-index',
    dataSource: 'assessment-tool',
    timeSeries: [
      { timestamp: '2024-H1', value: 3.0, label: 'H1 2024' },
      { timestamp: '2024-H2', value: 3.1, label: 'H2 2024' },
      { timestamp: '2025-H1', value: 3.3, label: 'H1 2025' },
      { timestamp: '2025-H2', value: 3.4, label: 'H2 2025' },
      { timestamp: '2026-H1', value: 3.6, label: 'H1 2026' }
    ],
    metrics: [
      { id: 'tech-score', label: 'Technology Maturity Score', value: 3.6, unit: 'out of 5', trend: 'up', trendValue: 5.9, trendLabel: '+0.2 vs last period', severity: 'success' },
      { id: 'eol-count', label: 'End-of-Life Technologies', value: 7, trend: 'down', trendValue: -3, trendLabel: '3 decommissioned since H2 2025', severity: 'warning' },
      { id: 'tech-debt', label: 'Technical Debt Index', value: '34%', trend: 'down', trendValue: -6, trendLabel: '-6% vs last assessment', severity: 'success' }
    ],
    insights: [
      { id: 'tmi-insight-001', type: 'alert', severity: 'high', title: 'Critical: 3 Technologies Past EOL', description: 'Oracle Forms 12c, Windows Server 2016, and IBM MQ 9.1 have passed vendor end-of-life. Security patches are no longer available.', confidence: 99, actionable: true, suggestedAction: 'Escalate migration of these 3 technologies to the Architecture Review Board. Interim compensating controls required within 30 days.' },
      { id: 'tmi-insight-002', type: 'prediction', severity: 'medium', title: '4 Technologies Approaching EOL in 2026', description: 'Java 11, .NET Framework 4.8, RHEL 8, and SAP ECC 6.0 will reach end-of-support within the next 12 months. Combined migration effort estimated at 18,000 person-hours.', confidence: 93, actionable: true, suggestedAction: 'Begin migration planning now. Prioritize SAP ECC to S/4HANA as it has the longest lead time (9-12 months).' },
      { id: 'tmi-insight-003', type: 'recommendation', severity: 'low', title: 'Consolidate Overlapping Technologies', description: 'Analysis identified 12 technology overlaps across 5 domains. Consolidation could reduce licensing costs by $320K annually.', confidence: 84, actionable: true, suggestedAction: 'Conduct technology rationalization workshops with domain architects. Target 50% overlap reduction by H2 2026.' }
    ],
    tableData: [
      { technology: 'Oracle Forms 12c', version: '12.2.1', status: 'Past EOL', eolDate: '2025-07-31', priority: 'Critical' },
      { technology: 'SAP ECC 6.0', version: 'EHP8', status: 'Approaching EOL', eolDate: '2027-12-31', priority: 'High' },
      { technology: 'Kubernetes', version: '1.28', status: 'Current', eolDate: '2028-06-30', priority: 'Low' },
      { technology: 'Java 11 LTS', version: '11.0.22', status: 'Approaching EOL', eolDate: '2026-09-30', priority: 'High' },
      { technology: 'React', version: '18.2', status: 'Current', eolDate: 'N/A', priority: 'Low' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2024-H1', end: '2026-H1' }
  },
  'process-maturity-evaluation': {
    serviceId: 'process-maturity-evaluation',
    dataSource: 'assessment-tool',
    timeSeries: [
      { timestamp: '2022', value: 1.8, label: '2022' },
      { timestamp: '2023', value: 2.2, label: '2023' },
      { timestamp: '2024', value: 2.7, label: '2024' },
      { timestamp: '2025', value: 3.1, label: '2025' },
      { timestamp: '2026', value: 3.4, label: '2026 (Projected)' }
    ],
    metrics: [
      { id: 'process-score', label: 'Process Maturity Score', value: 3.1, unit: 'CMMI Level', trend: 'up', trendValue: 14.8, trendLabel: '+0.4 vs last year', severity: 'success' },
      { id: 'processes-evaluated', label: 'Processes Evaluated', value: 36, trend: 'up', trendValue: 8, trendLabel: '8 new processes added', severity: 'info' },
      { id: 'best-practice-gaps', label: 'Best Practice Gaps', value: 14, trend: 'down', trendValue: -6, trendLabel: '6 gaps closed this year', severity: 'success' }
    ],
    insights: [
      { id: 'pme-insight-001', type: 'info', severity: 'low', title: 'Organization Crossed CMMI Level 3 Threshold', description: 'Overall process maturity has reached 3.1, officially crossing the CMMI Defined level. Processes are now standardized and documented across the organization.', confidence: 97, actionable: false },
      { id: 'pme-insight-002', type: 'alert', severity: 'medium', title: 'Incident Management Process Below Target', description: 'Incident management scored 2.1 (Managed level), significantly below the organizational average of 3.1. Mean time to resolution is 4.2 hours vs the 2-hour industry benchmark.', confidence: 92, actionable: true, suggestedAction: 'Implement automated incident triage and escalation workflows. Adopt runbook automation for the top 10 recurring incident types.' },
      { id: 'pme-insight-003', type: 'recommendation', severity: 'medium', title: 'Standardize Release Management Across Teams', description: 'Release management maturity varies from 1.5 to 4.0 across teams. Standardizing to a common CI/CD pipeline framework could lift the floor to 3.0.', confidence: 88, actionable: true, suggestedAction: 'Establish a Release Management CoE and define golden path templates for CI/CD. Target Q3 2026 for full rollout.' }
    ],
    tableData: [
      { process: 'Requirements Management', cmmiLevel: 'Level 4', score: 4.0, gap: 0, improvementArea: 'Maintain' },
      { process: 'Change Management', cmmiLevel: 'Level 3', score: 3.2, gap: 0.8, improvementArea: 'Automation' },
      { process: 'Incident Management', cmmiLevel: 'Level 2', score: 2.1, gap: 1.9, improvementArea: 'Triage & Escalation' },
      { process: 'Release Management', cmmiLevel: 'Level 3', score: 2.8, gap: 1.2, improvementArea: 'CI/CD Standardization' },
      { process: 'Capacity Planning', cmmiLevel: 'Level 3', score: 3.4, gap: 0.6, improvementArea: 'Predictive Modeling' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2022-01-01', end: '2026-02-23' }
  },
  'benchmark-intelligence': {
    serviceId: 'benchmark-intelligence',
    dataSource: 'assessment-tool',
    timeSeries: [
      { timestamp: '2025-Q1', value: 52, label: 'Q1 2025' },
      { timestamp: '2025-Q2', value: 56, label: 'Q2 2025' },
      { timestamp: '2025-Q3', value: 61, label: 'Q3 2025' },
      { timestamp: '2025-Q4', value: 64, label: 'Q4 2025' },
      { timestamp: '2026-Q1', value: 68, label: 'Q1 2026' }
    ],
    metrics: [
      { id: 'percentile-rank', label: 'Industry Percentile Rank', value: 68, unit: 'th percentile', trend: 'up', trendValue: 6.3, trendLabel: '+4 percentiles vs last quarter', severity: 'success' },
      { id: 'gaps-to-leader', label: 'Gaps to Industry Leader', value: 8, trend: 'down', trendValue: -2, trendLabel: '2 gaps closed', severity: 'warning' },
      { id: 'peer-count', label: 'Peer Organizations Benchmarked', value: 127, trend: 'up', trendValue: 15, trendLabel: '15 new peers added', severity: 'info' }
    ],
    insights: [
      { id: 'bi-insight-001', type: 'info', severity: 'low', title: 'Moved from 2nd to 3rd Quartile', description: 'The organization has moved into the 3rd quartile (68th percentile), up from the 2nd quartile (52nd) one year ago. Significant competitive improvement.', confidence: 96, actionable: false },
      { id: 'bi-insight-002', type: 'alert', severity: 'medium', title: 'Customer Experience Lags Behind Peers', description: 'Customer experience domain ranks at the 41st percentile—22 points below the organizational average. Top-quartile peers invest 2.3x more in CX technology.', confidence: 88, actionable: true, suggestedAction: 'Increase CX technology investment by 40% in FY2027 budget. Prioritize personalization engine and omnichannel platform.' },
      { id: 'bi-insight-003', type: 'recommendation', severity: 'medium', title: 'Leverage Automation Strength', description: 'Automation domain ranks at the 84th percentile—highest across all domains. This competitive advantage can accelerate maturity in lagging domains.', confidence: 90, actionable: true, suggestedAction: 'Apply automation patterns from operational processes to customer-facing and data management workflows.' }
    ],
    tableData: [
      { domain: 'Automation', yourScore: 4.2, industryMedian: 3.1, topQuartile: 4.0, gap: '+0.2' },
      { domain: 'Cloud & Infrastructure', yourScore: 3.7, industryMedian: 3.3, topQuartile: 4.1, gap: '-0.4' },
      { domain: 'Data & Analytics', yourScore: 3.0, industryMedian: 3.2, topQuartile: 4.3, gap: '-1.3' },
      { domain: 'Customer Experience', yourScore: 2.6, industryMedian: 3.1, topQuartile: 4.2, gap: '-1.6' },
      { domain: 'Security & Compliance', yourScore: 3.9, industryMedian: 3.5, topQuartile: 4.4, gap: '-0.5' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2025-Q1', end: '2026-Q1' }
  },
  'maturity-roadmap-generator': {
    serviceId: 'maturity-roadmap-generator',
    dataSource: 'assessment-tool',
    timeSeries: [
      { timestamp: '2026-Q1', value: 3.3, label: 'Q1 2026 (Current)' },
      { timestamp: '2026-Q2', value: 3.5, label: 'Q2 2026' },
      { timestamp: '2026-Q3', value: 3.7, label: 'Q3 2026' },
      { timestamp: '2026-Q4', value: 3.9, label: 'Q4 2026' },
      { timestamp: '2027-Q1', value: 4.0, label: 'Q1 2027' },
      { timestamp: '2027-Q2', value: 4.1, label: 'Q2 2027' },
      { timestamp: '2027-Q3', value: 4.2, label: 'Q3 2027' },
      { timestamp: '2027-Q4', value: 4.3, label: 'Q4 2027 (Target)' }
    ],
    metrics: [
      { id: 'target-score', label: 'Target Maturity Score', value: 4.3, unit: 'out of 5', trend: 'up', trendLabel: 'By end of 2027', severity: 'info' },
      { id: 'initiatives', label: 'Planned Initiatives', value: 23, trend: 'stable', severity: 'info' },
      { id: 'quick-wins', label: 'Quick Wins Identified', value: 9, trend: 'up', trendValue: 4, trendLabel: '4 achievable this quarter', severity: 'success' }
    ],
    insights: [
      { id: 'mrg-insight-001', type: 'recommendation', severity: 'medium', title: 'Prioritize Quick Wins in Q1-Q2 2026', description: '9 quick-win initiatives can deliver a combined 0.4-point maturity uplift with under 200 person-hours of effort each.', confidence: 88, actionable: true, suggestedAction: 'Approve and fund the 9 quick-win initiatives immediately. Assign dedicated owners and target completion by end of Q2 2026.' },
      { id: 'mrg-insight-002', type: 'prediction', severity: 'low', title: 'Target Score Achievable with 85% Confidence', description: 'Monte Carlo simulation of 10,000 scenarios shows 85% probability of reaching 4.3 maturity by Q4 2027, assuming 80% initiative execution rate.', confidence: 85, actionable: false },
      { id: 'mrg-insight-003', type: 'alert', severity: 'high', title: 'Critical Dependency: Data Platform Migration', description: 'The data platform migration is a dependency for 7 downstream initiatives. Any delay will cascade and reduce the achievable target score to 3.9.', confidence: 92, actionable: true, suggestedAction: 'Elevate data platform migration to top organizational priority. Assign a dedicated program manager and establish weekly steering reviews.' }
    ],
    tableData: [
      { initiative: 'API Gateway Modernization', phase: 'Phase 1 (Q1-Q2 2026)', effort: 'Medium', impact: 'High', dependencies: 'None' },
      { initiative: 'Data Platform Migration', phase: 'Phase 2 (Q2-Q3 2026)', effort: 'High', impact: 'Critical', dependencies: 'Cloud foundation' },
      { initiative: 'ML Ops Framework Setup', phase: 'Phase 2 (Q3-Q4 2026)', effort: 'High', impact: 'High', dependencies: 'Data platform' },
      { initiative: 'Process Automation Wave 2', phase: 'Phase 3 (Q1-Q2 2027)', effort: 'Medium', impact: 'Medium', dependencies: 'ML Ops framework' },
      { initiative: 'CX Personalization Engine', phase: 'Phase 3 (Q2-Q3 2027)', effort: 'High', impact: 'High', dependencies: 'Data platform, ML Ops' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2026-Q1', end: '2027-Q4' }
  },
  'continuous-maturity-monitoring': {
    serviceId: 'continuous-maturity-monitoring',
    dataSource: 'assessment-tool',
    timeSeries: [
      { timestamp: '2025-11-25', value: 3.28, label: 'Nov 25' },
      { timestamp: '2025-12-09', value: 3.31, label: 'Dec 9' },
      { timestamp: '2025-12-23', value: 3.27, label: 'Dec 23' },
      { timestamp: '2026-01-06', value: 3.30, label: 'Jan 6' },
      { timestamp: '2026-01-20', value: 3.34, label: 'Jan 20' },
      { timestamp: '2026-02-03', value: 3.29, label: 'Feb 3' },
      { timestamp: '2026-02-17', value: 3.35, label: 'Feb 17' },
      { timestamp: '2026-02-23', value: 3.37, label: 'Feb 23' }
    ],
    metrics: [
      { id: 'current-score', label: 'Current Maturity Score', value: 3.37, unit: 'out of 5', trend: 'up', trendValue: 2.4, trendLabel: '+0.08 over 90 days', severity: 'success' },
      { id: 'regressions', label: 'Regressions Detected', value: 3, trend: 'down', trendValue: -1, trendLabel: '1 fewer than prior period', severity: 'warning' },
      { id: 'velocity', label: 'Improvement Velocity', value: '+0.03', unit: 'pts/month', trend: 'up', trendValue: 50, trendLabel: 'Accelerating', severity: 'success' }
    ],
    insights: [
      { id: 'cmm-insight-001', type: 'alert', severity: 'medium', title: 'Regression Detected in Data Governance', description: 'Data governance domain dropped from 3.1 to 2.8 on Feb 3 following a key data steward departure. Score has not yet recovered.', confidence: 94, actionable: true, suggestedAction: 'Backfill data steward role within 2 weeks. Reassign critical data quality tasks to interim owner immediately.' },
      { id: 'cmm-insight-002', type: 'info', severity: 'low', title: 'DevOps Domain Showing Consistent Growth', description: 'DevOps maturity has improved for 8 consecutive measurement periods, rising from 3.4 to 4.0. Deployment frequency and lead time metrics are driving the improvement.', confidence: 97, actionable: false },
      { id: 'cmm-insight-003', type: 'prediction', severity: 'low', title: 'Score Projected to Reach 3.5 by May 2026', description: 'Current improvement velocity of 0.03 points per month projects the overall score reaching 3.5 by May 2026, aligned with the H1 milestone target.', confidence: 79, actionable: false }
    ],
    tableData: [
      { date: '2026-02-17', domain: 'Cloud Infrastructure', alertType: 'Improvement', scoreChange: '+0.15', resolution: 'Auto-acknowledged' },
      { date: '2026-02-03', domain: 'Data Governance', alertType: 'Regression', scoreChange: '-0.30', resolution: 'Under investigation' },
      { date: '2026-01-22', domain: 'Security Operations', alertType: 'Regression', scoreChange: '-0.12', resolution: 'Resolved - patch applied' },
      { date: '2026-01-10', domain: 'DevOps Practices', alertType: 'Improvement', scoreChange: '+0.20', resolution: 'Auto-acknowledged' },
      { date: '2025-12-18', domain: 'Integration Layer', alertType: 'Regression', scoreChange: '-0.18', resolution: 'Resolved - API gateway fix' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2025-11-25', end: '2026-02-23' }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROJECTS PORTFOLIO — 8 additional services
  // ═══════════════════════════════════════════════════════════════════════════

  'resource-optimization-ai': {
    serviceId: 'resource-optimization-ai',
    dataSource: 'azure-devops',
    timeSeries: [
      { timestamp: '2025-12-30', value: 78, label: 'Week 1' },
      { timestamp: '2026-01-06', value: 76, label: 'Week 2' },
      { timestamp: '2026-01-13', value: 81, label: 'Week 3' },
      { timestamp: '2026-01-20', value: 83, label: 'Week 4' },
      { timestamp: '2026-01-27', value: 80, label: 'Week 5' },
      { timestamp: '2026-02-03', value: 85, label: 'Week 6' },
      { timestamp: '2026-02-10', value: 88, label: 'Week 7' },
      { timestamp: '2026-02-17', value: 87, label: 'Week 8' }
    ],
    metrics: [
      {
        id: 'utilization',
        label: 'Avg Utilization',
        value: '87%',
        trend: 'up',
        trendValue: 9,
        trendLabel: '+9% over 8 weeks',
        severity: 'success'
      },
      {
        id: 'overallocated',
        label: 'Overallocated Resources',
        value: 6,
        trend: 'up',
        trendValue: 2,
        trendLabel: '+2 since last week',
        severity: 'warning'
      },
      {
        id: 'skill-gaps',
        label: 'Skill Gaps Identified',
        value: 4,
        trend: 'stable',
        trendLabel: 'Cloud & AI roles',
        severity: 'warning'
      }
    ],
    insights: [
      {
        id: 'insight-ro-001',
        type: 'alert',
        severity: 'high',
        title: '6 Resources Exceeding 100% Allocation',
        description: 'Six team members are allocated above 100% capacity across multiple projects. Two senior architects are at 125% due to Platform Modernization and Cloud Migration overlap.',
        confidence: 93,
        actionable: true,
        suggestedAction: 'Redistribute Platform Modernization architecture reviews to the two available mid-level architects. Estimated reduction: 25% load on senior staff.'
      },
      {
        id: 'insight-ro-002',
        type: 'recommendation',
        severity: 'medium',
        title: 'Cloud Architecture Skill Gap Critical',
        description: 'Three active projects require cloud-native architecture skills but only 2 of 5 needed specialists are available. Demand will increase 40% in Q2 when the Data Lake project enters build phase.',
        confidence: 88,
        actionable: true,
        suggestedAction: 'Initiate cloud architecture upskilling for 2 senior developers and engage one contract specialist for Q2 coverage.'
      },
      {
        id: 'insight-ro-003',
        type: 'prediction',
        severity: 'low',
        title: 'Utilization Expected to Peak at 91% in March',
        description: 'Based on current project timelines and staffing levels, overall utilization will peak at 91% in mid-March before normalizing to 84% in April as CRM Upgrade completes.',
        confidence: 82,
        actionable: false
      }
    ],
    tableData: [
      { person: 'Sarah Chen', role: 'Senior Architect', allocation: '125%', utilization: '118%', skillFit: 'High', project: 'Platform Modernization + Cloud Migration' },
      { person: 'James Okoro', role: 'Lead Developer', allocation: '110%', utilization: '105%', skillFit: 'High', project: 'CRM Upgrade + Data Lake' },
      { person: 'Maria Santos', role: 'Cloud Engineer', allocation: '100%', utilization: '94%', skillFit: 'High', project: 'Cloud Migration' },
      { person: 'David Kim', role: 'QA Lead', allocation: '90%', utilization: '88%', skillFit: 'Medium', project: 'Platform Modernization' },
      { person: 'Priya Mehta', role: 'Business Analyst', allocation: '75%', utilization: '71%', skillFit: 'High', project: 'CRM Upgrade' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2025-12-30', end: '2026-02-17' }
  },

  'risk-prediction-engine': {
    serviceId: 'risk-prediction-engine',
    dataSource: 'azure-devops',
    timeSeries: [
      { timestamp: '2025-12-01', value: 35, label: 'Week 1' },
      { timestamp: '2025-12-08', value: 33, label: 'Week 2' },
      { timestamp: '2025-12-15', value: 31, label: 'Week 3' },
      { timestamp: '2025-12-22', value: 34, label: 'Week 4' },
      { timestamp: '2025-12-29', value: 37, label: 'Week 5' },
      { timestamp: '2026-01-05', value: 36, label: 'Week 6' },
      { timestamp: '2026-01-12', value: 39, label: 'Week 7' },
      { timestamp: '2026-01-19', value: 41, label: 'Week 8' },
      { timestamp: '2026-01-26', value: 38, label: 'Week 9' },
      { timestamp: '2026-02-02', value: 44, label: 'Week 10' },
      { timestamp: '2026-02-09', value: 48, label: 'Week 11' },
      { timestamp: '2026-02-16', value: 46, label: 'Week 12' }
    ],
    metrics: [
      {
        id: 'high-risk',
        label: 'High-Risk Projects',
        value: 4,
        trend: 'up',
        trendValue: 1,
        trendLabel: '+1 since last month',
        severity: 'error'
      },
      {
        id: 'avg-risk',
        label: 'Portfolio Risk Score',
        value: 46,
        unit: 'out of 100',
        trend: 'up',
        trendValue: 8,
        trendLabel: '+8 pts over 12 weeks',
        severity: 'warning'
      },
      {
        id: 'mitigations-due',
        label: 'Mitigations Due',
        value: 7,
        trend: 'up',
        trendValue: 3,
        trendLabel: '3 overdue',
        severity: 'error'
      }
    ],
    insights: [
      {
        id: 'insight-rp-001',
        type: 'alert',
        severity: 'high',
        title: 'Platform Modernization Risk Score Spiked to 72',
        description: 'Risk score jumped from 55 to 72 in two weeks. Contributing factors: vendor delivery delay (3 weeks), scope increase (+18%), and loss of key architect to competitor.',
        confidence: 91,
        actionable: true,
        suggestedAction: 'Escalate vendor delay to executive sponsor. Initiate scope re-baseline workshop. Engage contract architect within 2 weeks.'
      },
      {
        id: 'insight-rp-002',
        type: 'prediction',
        severity: 'medium',
        title: 'Cloud Migration Risk Rising — Budget Pressure',
        description: 'Cloud Migration risk score predicted to reach 65 within 4 weeks if current cloud infrastructure costs continue trending 22% above estimates.',
        confidence: 84,
        actionable: true,
        suggestedAction: 'Conduct cloud spend optimization review. Consider reserved instance commitments for predictable workloads to reduce costs by ~30%.'
      },
      {
        id: 'insight-rp-003',
        type: 'info',
        severity: 'low',
        title: 'CRM Upgrade Risk Successfully Mitigated',
        description: 'CRM Upgrade risk dropped from 58 to 28 after successful data migration test and stakeholder sign-off on revised timeline.',
        confidence: 95,
        actionable: false
      }
    ],
    tableData: [
      { risk: 'Vendor Delivery Delay', project: 'Platform Modernization', probability: '85%', impact: 'High', status: 'Open', mitigation: 'Escalation in progress' },
      { risk: 'Cloud Cost Overrun', project: 'Cloud Migration', probability: '68%', impact: 'High', status: 'Monitoring', mitigation: 'Spend review scheduled' },
      { risk: 'Data Quality Issues', project: 'Data Lake', probability: '55%', impact: 'Medium', status: 'In Progress', mitigation: 'Validation pipeline deployed' },
      { risk: 'Key Person Dependency', project: 'Platform Modernization', probability: '72%', impact: 'High', status: 'Open', mitigation: 'Knowledge transfer initiated' },
      { risk: 'Integration Complexity', project: 'CRM Upgrade', probability: '30%', impact: 'Medium', status: 'Mitigated', mitigation: 'API contracts finalized' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2025-12-01', end: '2026-02-16' }
  },

  'timeline-forecasting': {
    serviceId: 'timeline-forecasting',
    dataSource: 'azure-devops',
    timeSeries: [
      { timestamp: '2025-12-01', value: 82, label: 'Week 1' },
      { timestamp: '2025-12-08', value: 80, label: 'Week 2' },
      { timestamp: '2025-12-15', value: 81, label: 'Week 3' },
      { timestamp: '2025-12-22', value: 78, label: 'Week 4' },
      { timestamp: '2025-12-29', value: 76, label: 'Week 5' },
      { timestamp: '2026-01-05', value: 74, label: 'Week 6' },
      { timestamp: '2026-01-12', value: 75, label: 'Week 7' },
      { timestamp: '2026-01-19', value: 73, label: 'Week 8' },
      { timestamp: '2026-01-26', value: 71, label: 'Week 9' },
      { timestamp: '2026-02-02', value: 70, label: 'Week 10' },
      { timestamp: '2026-02-09', value: 68, label: 'Week 11' },
      { timestamp: '2026-02-16', value: 72, label: 'Week 12' }
    ],
    metrics: [
      {
        id: 'on-time-pct',
        label: 'On-Time Delivery',
        value: '72%',
        trend: 'down',
        trendValue: -10,
        trendLabel: '-10% over 12 weeks',
        severity: 'warning'
      },
      {
        id: 'avg-delay',
        label: 'Average Delay',
        value: '8.3',
        unit: 'days',
        trend: 'up',
        trendValue: 3.1,
        trendLabel: '+3.1 days vs baseline',
        severity: 'warning'
      },
      {
        id: 'at-risk-deadlines',
        label: 'At-Risk Deadlines',
        value: 5,
        trend: 'up',
        trendValue: 2,
        trendLabel: '+2 new this week',
        severity: 'error'
      }
    ],
    insights: [
      {
        id: 'insight-tf-001',
        type: 'alert',
        severity: 'high',
        title: 'Platform Modernization Phase 2 Likely to Miss March Deadline',
        description: 'AI model predicts 78% probability of a 3-week delay for the Phase 2 milestone (Mar 15). Primary drivers: vendor dependency delay and resource contention with Cloud Migration.',
        confidence: 88,
        actionable: true,
        suggestedAction: 'Decouple vendor-dependent work items to parallel track. Reallocate 2 developers from lower-priority tasks to reduce critical path by 1.5 weeks.'
      },
      {
        id: 'insight-tf-002',
        type: 'prediction',
        severity: 'medium',
        title: 'On-Time Rate Expected to Recover to 78% by April',
        description: 'Historical pattern analysis shows the current decline is correlated with Q1 resource contention. As CRM Upgrade completes in March, freed capacity should improve on-time delivery.',
        confidence: 76,
        actionable: false
      },
      {
        id: 'insight-tf-003',
        type: 'recommendation',
        severity: 'medium',
        title: 'Reduce Scope of Data Lake Sprint 8',
        description: 'Data Lake Sprint 8 is overcommitted by approximately 30 story points. Current velocity of 25 points/sprint cannot absorb the planned 55 points.',
        confidence: 91,
        actionable: true,
        suggestedAction: 'Move 30 story points of non-critical data connectors to Sprint 9. This preserves the core ETL pipeline deadline.'
      }
    ],
    tableData: [
      { milestone: 'Phase 2 Go-Live', project: 'Platform Modernization', plannedDate: '2026-03-15', forecastDate: '2026-04-05', confidence: '72%', status: 'At Risk' },
      { milestone: 'Data Migration Complete', project: 'CRM Upgrade', plannedDate: '2026-03-01', forecastDate: '2026-03-04', confidence: '89%', status: 'On Track' },
      { milestone: 'MVP Release', project: 'Data Lake', plannedDate: '2026-04-01', forecastDate: '2026-04-18', confidence: '65%', status: 'At Risk' },
      { milestone: 'Production Cutover', project: 'Cloud Migration', plannedDate: '2026-05-15', forecastDate: '2026-05-22', confidence: '78%', status: 'Monitor' },
      { milestone: 'UAT Sign-off', project: 'Mobile App', plannedDate: '2026-03-20', forecastDate: '2026-03-19', confidence: '92%', status: 'On Track' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2025-12-01', end: '2026-02-16' }
  },

  'budget-variance-prediction': {
    serviceId: 'budget-variance-prediction',
    dataSource: 'azure-devops',
    timeSeries: [
      { timestamp: '2025-09-01', value: 3.8, label: 'Sep 2025' },
      { timestamp: '2025-10-01', value: 7.9, label: 'Oct 2025' },
      { timestamp: '2025-11-01', value: 12.4, label: 'Nov 2025' },
      { timestamp: '2025-12-01', value: 16.1, label: 'Dec 2025' },
      { timestamp: '2026-01-01', value: 20.5, label: 'Jan 2026' },
      { timestamp: '2026-02-01', value: 24.8, label: 'Feb 2026' }
    ],
    metrics: [
      {
        id: 'total-budget',
        label: 'Portfolio Budget',
        value: '$24.5M',
        trend: 'stable',
        trendLabel: 'FY2026 allocation',
        severity: 'info'
      },
      {
        id: 'variance-pct',
        label: 'Budget Variance',
        value: '+6.2%',
        trend: 'up',
        trendValue: 2.1,
        trendLabel: '+2.1% vs last month',
        severity: 'warning'
      },
      {
        id: 'overrun-risk',
        label: 'Overrun Risk',
        value: 3,
        unit: 'projects',
        trend: 'up',
        trendValue: 1,
        trendLabel: '+1 new this month',
        severity: 'error'
      }
    ],
    insights: [
      {
        id: 'insight-bv-001',
        type: 'alert',
        severity: 'high',
        title: 'Cloud Migration 18% Over Budget — Forecast to Reach 24%',
        description: 'Cloud infrastructure costs are running $1.2M over the $6.5M budget. Unplanned egress charges and over-provisioned compute instances are the primary drivers. AI predicts total overrun of $1.56M at project completion.',
        confidence: 89,
        actionable: true,
        suggestedAction: 'Implement cloud cost governance: right-size compute instances (est. $380K savings), enable reserved pricing ($290K savings), and optimize data egress routing ($180K savings).'
      },
      {
        id: 'insight-bv-002',
        type: 'prediction',
        severity: 'medium',
        title: 'Portfolio Will Exceed Budget by $1.8M Without Intervention',
        description: 'At current burn rates, the portfolio will exceed the $24.5M annual budget by approximately $1.8M (7.3%). The primary variance drivers are Cloud Migration and Platform Modernization.',
        confidence: 85,
        actionable: true,
        suggestedAction: 'Request contingency release of $1.2M and implement cost reduction measures for remaining $600K gap.'
      },
      {
        id: 'insight-bv-003',
        type: 'info',
        severity: 'low',
        title: 'CRM Upgrade Tracking 4% Under Budget',
        description: 'CRM Upgrade has consistently tracked under budget due to efficient vendor negotiations and lower-than-expected customization effort. $180K in savings can be reallocated.',
        confidence: 94,
        actionable: false
      }
    ],
    tableData: [
      { project: 'Cloud Migration', budget: '$6.5M', actual: '$4.9M', forecast: '$8.06M', variancePct: '+24%', status: 'Over Budget' },
      { project: 'Platform Modernization', budget: '$8.2M', actual: '$5.8M', forecast: '$8.9M', variancePct: '+8.5%', status: 'At Risk' },
      { project: 'Data Lake', budget: '$4.8M', actual: '$2.6M', forecast: '$5.1M', variancePct: '+6.3%', status: 'Monitor' },
      { project: 'CRM Upgrade', budget: '$3.5M', actual: '$2.9M', forecast: '$3.36M', variancePct: '-4%', status: 'Under Budget' },
      { project: 'Mobile App', budget: '$1.5M', actual: '$0.8M', forecast: '$1.48M', variancePct: '-1.3%', status: 'On Track' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2025-09-01', end: '2026-02-01' }
  },

  'quality-prediction-model': {
    serviceId: 'quality-prediction-model',
    dataSource: 'azure-devops',
    timeSeries: [
      { timestamp: '2025-07-15', value: 72, label: 'v2.1' },
      { timestamp: '2025-08-28', value: 74, label: 'v2.2' },
      { timestamp: '2025-10-10', value: 71, label: 'v2.3' },
      { timestamp: '2025-11-20', value: 78, label: 'v2.4' },
      { timestamp: '2025-12-18', value: 80, label: 'v3.0' },
      { timestamp: '2026-01-15', value: 83, label: 'v3.1' },
      { timestamp: '2026-02-05', value: 81, label: 'v3.2' },
      { timestamp: '2026-02-19', value: 84, label: 'v3.3' }
    ],
    metrics: [
      {
        id: 'quality-score',
        label: 'Quality Score',
        value: 84,
        unit: 'out of 100',
        trend: 'up',
        trendValue: 12,
        trendLabel: '+12 pts over 8 releases',
        severity: 'success'
      },
      {
        id: 'defect-rate',
        label: 'Defect Rate',
        value: '3.2',
        unit: 'per release',
        trend: 'down',
        trendValue: -4.8,
        trendLabel: 'Down from 8.0',
        severity: 'success'
      },
      {
        id: 'test-coverage',
        label: 'Test Coverage',
        value: '78%',
        trend: 'up',
        trendValue: 6,
        trendLabel: '+6% this quarter',
        severity: 'success'
      }
    ],
    insights: [
      {
        id: 'insight-qp-001',
        type: 'alert',
        severity: 'medium',
        title: 'v3.2 Quality Dip Linked to Insufficient Integration Testing',
        description: 'Quality score dropped from 83 to 81 in v3.2. Root cause analysis shows 4 of 5 defects were integration-related, coinciding with a compressed testing cycle (3 days instead of 5).',
        confidence: 90,
        actionable: true,
        suggestedAction: 'Enforce minimum 5-day integration testing window for all releases. Add automated integration test suite for the 3 most failure-prone API endpoints.'
      },
      {
        id: 'insight-qp-002',
        type: 'prediction',
        severity: 'low',
        title: 'v3.4 Predicted Quality Score: 86',
        description: 'Based on current testing improvements and reduced defect injection rate, AI predicts v3.4 will achieve a quality score of 86 (±3), continuing the upward trend.',
        confidence: 81,
        actionable: false
      },
      {
        id: 'insight-qp-003',
        type: 'recommendation',
        severity: 'medium',
        title: 'Increase Test Coverage to 85% for Sustained Quality',
        description: 'Analysis of quality scores vs test coverage shows a strong correlation (r=0.89). Projects with >85% coverage average 15% fewer production defects.',
        confidence: 93,
        actionable: true,
        suggestedAction: 'Prioritize coverage for the payments module (currently 62%) and user authentication (currently 71%). Estimated effort: 2 developer-weeks.'
      }
    ],
    tableData: [
      { release: 'v3.3', qualityScore: 84, defects: 2, testCoverage: '78%', result: 'Pass' },
      { release: 'v3.2', qualityScore: 81, defects: 5, testCoverage: '76%', result: 'Pass (Conditional)' },
      { release: 'v3.1', qualityScore: 83, defects: 3, testCoverage: '75%', result: 'Pass' },
      { release: 'v3.0', qualityScore: 80, defects: 4, testCoverage: '73%', result: 'Pass' },
      { release: 'v2.4', qualityScore: 78, defects: 6, testCoverage: '72%', result: 'Pass (Conditional)' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2025-07-15', end: '2026-02-19' }
  },

  'stakeholder-sentiment-analysis': {
    serviceId: 'stakeholder-sentiment-analysis',
    dataSource: 'azure-devops',
    timeSeries: [
      { timestamp: '2025-12-30', value: 82, label: 'Week 1' },
      { timestamp: '2026-01-06', value: 79, label: 'Week 2' },
      { timestamp: '2026-01-13', value: 74, label: 'Week 3' },
      { timestamp: '2026-01-20', value: 68, label: 'Week 4' },
      { timestamp: '2026-01-27', value: 65, label: 'Week 5' },
      { timestamp: '2026-02-03', value: 67, label: 'Week 6' },
      { timestamp: '2026-02-10', value: 70, label: 'Week 7' },
      { timestamp: '2026-02-17', value: 72, label: 'Week 8' }
    ],
    metrics: [
      {
        id: 'overall-sentiment',
        label: 'Overall Sentiment',
        value: 72,
        unit: 'out of 100',
        trend: 'up',
        trendValue: 7,
        trendLabel: 'Recovering from 65 low',
        severity: 'warning'
      },
      {
        id: 'engagement-score',
        label: 'Engagement Score',
        value: '74%',
        trend: 'down',
        trendValue: -5,
        trendLabel: '-5% vs month ago',
        severity: 'warning'
      },
      {
        id: 'concerns-raised',
        label: 'Open Concerns',
        value: 12,
        trend: 'up',
        trendValue: 4,
        trendLabel: '+4 new this month',
        severity: 'error'
      }
    ],
    insights: [
      {
        id: 'insight-ss-001',
        type: 'alert',
        severity: 'high',
        title: 'Executive Sentiment Dropped 22% After Scope Changes',
        description: 'Executive sponsor sentiment fell from 85 to 63 following the Platform Modernization scope expansion announcement. Key concerns: budget impact, timeline extension, and resource reallocation from other priorities.',
        confidence: 92,
        actionable: true,
        suggestedAction: 'Schedule executive briefing within 1 week. Prepare ROI analysis showing long-term value of expanded scope and present mitigation plan for budget and timeline concerns.'
      },
      {
        id: 'insight-ss-002',
        type: 'recommendation',
        severity: 'medium',
        title: 'Business User Engagement Declining — Communication Gap',
        description: 'Business user engagement dropped from 81% to 69% over 4 weeks. NLP analysis of survey responses reveals frustration with infrequent status updates and unclear impact on daily workflows.',
        confidence: 87,
        actionable: true,
        suggestedAction: 'Implement bi-weekly stakeholder newsletters and monthly demo sessions. Assign dedicated change champion per business unit.'
      },
      {
        id: 'insight-ss-003',
        type: 'prediction',
        severity: 'low',
        title: 'Sentiment Recovery to 78 Expected by Mid-March',
        description: 'Historical patterns show sentiment typically recovers within 4-6 weeks after scope change announcements, assuming proactive communication. Current trajectory supports recovery to 78 by March 15.',
        confidence: 74,
        actionable: false
      }
    ],
    tableData: [
      { stakeholderGroup: 'Executive Sponsors', sentiment: 63, engagement: '72%', keyConcern: 'Budget impact of scope expansion', trend: 'Declining' },
      { stakeholderGroup: 'Business Users', sentiment: 69, engagement: '69%', keyConcern: 'Lack of regular updates', trend: 'Declining' },
      { stakeholderGroup: 'Technical Team', sentiment: 81, engagement: '88%', keyConcern: 'Resource constraints', trend: 'Stable' },
      { stakeholderGroup: 'External Partners', sentiment: 75, engagement: '65%', keyConcern: 'Integration timeline clarity', trend: 'Stable' },
      { stakeholderGroup: 'End Users (Pilot)', sentiment: 77, engagement: '71%', keyConcern: 'Training schedule', trend: 'Improving' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2025-12-30', end: '2026-02-17' }
  },

  'dependency-impact-intelligence': {
    serviceId: 'dependency-impact-intelligence',
    dataSource: 'azure-devops',
    timeSeries: [
      { timestamp: '2025-12-01', value: 28, label: 'Week 1' },
      { timestamp: '2025-12-08', value: 30, label: 'Week 2' },
      { timestamp: '2025-12-15', value: 29, label: 'Week 3' },
      { timestamp: '2025-12-22', value: 32, label: 'Week 4' },
      { timestamp: '2025-12-29', value: 34, label: 'Week 5' },
      { timestamp: '2026-01-05', value: 36, label: 'Week 6' },
      { timestamp: '2026-01-12', value: 38, label: 'Week 7' },
      { timestamp: '2026-01-19', value: 39, label: 'Week 8' },
      { timestamp: '2026-01-26', value: 42, label: 'Week 9' },
      { timestamp: '2026-02-02', value: 44, label: 'Week 10' },
      { timestamp: '2026-02-09', value: 45, label: 'Week 11' },
      { timestamp: '2026-02-16', value: 47, label: 'Week 12' }
    ],
    metrics: [
      {
        id: 'cross-deps',
        label: 'Cross-Project Dependencies',
        value: 47,
        trend: 'up',
        trendValue: 19,
        trendLabel: '+19 over 12 weeks',
        severity: 'warning'
      },
      {
        id: 'blocked-items',
        label: 'Blocked Items',
        value: 8,
        trend: 'up',
        trendValue: 3,
        trendLabel: '+3 since last week',
        severity: 'error'
      },
      {
        id: 'cascade-risk',
        label: 'High Cascade Risk',
        value: 3,
        unit: 'projects',
        trend: 'stable',
        trendLabel: 'Same as last week',
        severity: 'warning'
      }
    ],
    insights: [
      {
        id: 'insight-di-001',
        type: 'alert',
        severity: 'high',
        title: 'Platform Modernization Blocking 5 Downstream Deliverables',
        description: 'The delayed API gateway refactoring in Platform Modernization is blocking 5 work items across Cloud Migration (2), CRM Upgrade (2), and Data Lake (1). Estimated cascade delay: 2-3 weeks per dependent project.',
        confidence: 94,
        actionable: true,
        suggestedAction: 'Fast-track API gateway deliverable by assigning 2 additional developers. Alternatively, provide mock API contracts to unblock dependent teams immediately.'
      },
      {
        id: 'insight-di-002',
        type: 'prediction',
        severity: 'medium',
        title: 'Dependency Count Will Reach 55 by End of March',
        description: 'As projects enter integration phases, AI predicts dependency count will grow to ~55 active dependencies. This increases collision risk and requires more coordination overhead.',
        confidence: 82,
        actionable: true,
        suggestedAction: 'Establish cross-project dependency sync meeting (weekly, 30 min). Assign a dependency manager to track and resolve blockers proactively.'
      },
      {
        id: 'insight-di-003',
        type: 'recommendation',
        severity: 'medium',
        title: 'Decouple Shared Authentication Module',
        description: 'The shared authentication module is a dependency for 4 projects and any change creates a cascade risk to all. Current tight coupling increases blast radius significantly.',
        confidence: 88,
        actionable: true,
        suggestedAction: 'Extract authentication into an independently versioned microservice with backward-compatible API. Estimated effort: 3 weeks, but eliminates recurring cascade risk.'
      }
    ],
    tableData: [
      { dependency: 'API Gateway Contracts', sourceProject: 'Platform Modernization', targetProject: 'Cloud Migration', type: 'Technical', status: 'Blocked', risk: 'High' },
      { dependency: 'User Data Schema', sourceProject: 'Data Lake', targetProject: 'CRM Upgrade', type: 'Deliverable', status: 'In Progress', risk: 'Medium' },
      { dependency: 'Auth Service v2', sourceProject: 'Platform Modernization', targetProject: 'Mobile App', type: 'Technical', status: 'Blocked', risk: 'High' },
      { dependency: 'Cloud Environment Setup', sourceProject: 'Cloud Migration', targetProject: 'Data Lake', type: 'Resource', status: 'Resolved', risk: 'Low' },
      { dependency: 'Vendor API Access', sourceProject: 'CRM Upgrade', targetProject: 'Platform Modernization', type: 'External', status: 'At Risk', risk: 'Medium' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2025-12-01', end: '2026-02-16' }
  },

  'lessons-learned-intelligence': {
    serviceId: 'lessons-learned-intelligence',
    dataSource: 'azure-devops',
    timeSeries: [
      { timestamp: '2025-03-01', value: 12, label: 'Mar 2025' },
      { timestamp: '2025-04-01', value: 18, label: 'Apr 2025' },
      { timestamp: '2025-05-01', value: 15, label: 'May 2025' },
      { timestamp: '2025-06-01', value: 22, label: 'Jun 2025' },
      { timestamp: '2025-07-01', value: 19, label: 'Jul 2025' },
      { timestamp: '2025-08-01', value: 25, label: 'Aug 2025' },
      { timestamp: '2025-09-01', value: 21, label: 'Sep 2025' },
      { timestamp: '2025-10-01', value: 28, label: 'Oct 2025' },
      { timestamp: '2025-11-01', value: 24, label: 'Nov 2025' },
      { timestamp: '2025-12-01', value: 20, label: 'Dec 2025' },
      { timestamp: '2026-01-01', value: 26, label: 'Jan 2026' },
      { timestamp: '2026-02-01', value: 17, label: 'Feb 2026' }
    ],
    metrics: [
      {
        id: 'lessons-captured',
        label: 'Total Lessons Captured',
        value: 247,
        trend: 'up',
        trendValue: 43,
        trendLabel: '+43 in last 6 months',
        severity: 'success'
      },
      {
        id: 'applied-pct',
        label: 'Applied Rate',
        value: '62%',
        trend: 'up',
        trendValue: 8,
        trendLabel: '+8% this quarter',
        severity: 'success'
      },
      {
        id: 'pattern-matches',
        label: 'AI Pattern Matches',
        value: 18,
        trend: 'up',
        trendValue: 5,
        trendLabel: '5 new matches this month',
        severity: 'info'
      }
    ],
    insights: [
      {
        id: 'insight-ll-001',
        type: 'recommendation',
        severity: 'high',
        title: 'Apply Vendor Management Lessons to Cloud Migration',
        description: 'AI detected 7 lessons from the 2024 ERP Upgrade project that directly apply to the current Cloud Migration vendor challenges. Key pattern: vendor delays were mitigated 60% faster when contractual SLA penalties were enforced early.',
        confidence: 89,
        actionable: true,
        suggestedAction: 'Review and enforce SLA penalty clauses with cloud infrastructure vendor. Share ERP Upgrade vendor management playbook with Cloud Migration PM.'
      },
      {
        id: 'insight-ll-002',
        type: 'info',
        severity: 'low',
        title: 'Knowledge Base Growing — Quality Improving',
        description: 'Lesson capture rate increased 35% year-over-year. Applied rate rose from 54% to 62%, indicating lessons are becoming more actionable and relevant. Projects that apply lessons show 23% fewer repeated issues.',
        confidence: 96,
        actionable: false
      },
      {
        id: 'insight-ll-003',
        type: 'prediction',
        severity: 'medium',
        title: 'Data Lake Project May Repeat Data Governance Mistakes',
        description: 'Pattern matching found 5 lessons from previous analytics projects about data governance challenges that have not been applied to the Data Lake project. Projects that ignored these lessons had 40% higher rework rates.',
        confidence: 84,
        actionable: true,
        suggestedAction: 'Schedule a lessons review session with the Data Lake team. Focus on: data ownership model, metadata standards, and quality gate definitions from the 2025 Analytics Platform project.'
      }
    ],
    tableData: [
      { lesson: 'Enforce vendor SLA penalties early', sourceProject: 'ERP Upgrade 2024', category: 'Vendor', applicability: 'High', applied: 'Pending' },
      { lesson: 'Establish data ownership before ETL design', sourceProject: 'Analytics Platform 2025', category: 'Process', applicability: 'High', applied: 'Not Applied' },
      { lesson: 'Run integration tests in production-like env', sourceProject: 'CRM Phase 1', category: 'Technical', applicability: 'Medium', applied: 'Applied' },
      { lesson: 'Assign dedicated change champion per BU', sourceProject: 'Digital Workplace 2024', category: 'People', applicability: 'High', applied: 'Applied' },
      { lesson: 'Budget 20% contingency for cloud migrations', sourceProject: 'Infrastructure Refresh 2025', category: 'Governance', applicability: 'High', applied: 'Partial' }
    ],
    generatedAt: '2026-02-23T10:00:00Z',
    dataRange: { start: '2025-03-01', end: '2026-02-01' }
  }
};
