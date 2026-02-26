import { IntelligenceService } from './types';
import { systemsPortfolio } from '../systemsPortfolio';
import { projectsPortfolio } from '../projectsPortfolio';
import { digitalMaturity } from '../digitalMaturity';

// Special dashboard configurations for featured services
const featuredDashboardConfigs: Record<string, any> = {

  // ═══════════════════════════════════════════════════════════════════════════
  // SYSTEMS PORTFOLIO & LIFECYCLE (15 services)
  // ═══════════════════════════════════════════════════════════════════════════

  // #1 — "Live Ops Command Center"
  // Hero: full-width area → donut + line → radar solo wide → insight + table
  'system-health-analytics': {
    widgets: [
      { id: 'overall-uptime', type: 'metric', title: 'Overall Uptime', description: 'System availability', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'critical-systems', type: 'metric', title: 'Critical Systems Healthy', description: 'Mission-critical status', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'anomalies-detected', type: 'metric', title: 'Anomalies Detected', description: 'Issues identified', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'uptime-trend', type: 'chart', chartType: 'area', title: 'System Uptime Landscape', description: 'Daily uptime percentage across all monitored systems', position: { row: 2, col: 1, width: 3, height: 1 } },
      { id: 'system-health', type: 'chart', chartType: 'donut', title: 'Health Distribution', description: 'Systems by health status', position: { row: 3, col: 1, width: 1, height: 1 } },
      { id: 'response-time', type: 'chart', chartType: 'line', title: 'Response Time Trend', description: 'Average latency across services', position: { row: 3, col: 2, width: 2, height: 1 } },
      { id: 'performance-metrics', type: 'chart', chartType: 'radar', title: 'Performance Dimensions', description: 'CPU, memory, disk, network, latency scoring', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'system-status', type: 'table', title: 'System Status', description: 'Detailed system breakdown', position: { row: 4, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'AI Insights', description: 'Health recommendations and anomaly alerts', position: { row: 5, col: 1, width: 3, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-7-days' },
      { id: 'system', label: 'System', type: 'dropdown', defaultValue: 'all', options: ['all', 'SAP ERP', 'Salesforce', 'API Gateway', 'Azure Cloud'] }
    ],
    defaultDateRange: 'last-7-days', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #2 — "Failure Prediction Engine"
  // Line hero for predictions + pie for components → bar + radar
  'predictive-maintenance': {
    widgets: [
      { id: 'failure-risk', type: 'metric', title: 'Systems at Risk', description: 'Predicted failures next 30 days', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'mtbf', type: 'metric', title: 'Mean Time Between Failures', description: 'Average reliability', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'cost-saved', type: 'metric', title: 'Cost Avoided', description: 'Preventive savings this quarter', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'failure-probability', type: 'chart', chartType: 'line', title: 'Failure Probability Forecast', description: 'Predicted failure likelihood over next 90 days', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'component-risk', type: 'chart', chartType: 'pie', title: 'Risk by Component Type', description: 'Failure distribution across hardware categories', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'maintenance-schedule', type: 'chart', chartType: 'bar', title: 'Optimal Maintenance Windows', description: 'Recommended maintenance by system priority', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'health-dimensions', type: 'chart', chartType: 'radar', title: 'System Health Dimensions', description: 'CPU, memory, disk, network, latency scoring', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'AI Predictions', description: 'Failure predictions and maintenance recommendations', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'at-risk-systems', type: 'table', title: 'At-Risk Systems', description: 'Systems ranked by failure probability', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Forecast Window', type: 'daterange', defaultValue: 'next-90-days' },
      { id: 'system', label: 'System', type: 'dropdown', defaultValue: 'all', options: ['all', 'SAP ERP', 'Database Cluster', 'API Gateway', 'Message Queue'] }
    ],
    defaultDateRange: 'next-90-days', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #3 — "Latency Deep-Dive" (only 3 charts, full-width line hero, table before insight)
  'performance-trending': {
    widgets: [
      { id: 'avg-response', type: 'metric', title: 'Avg Response Time', description: 'P50 latency across systems', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'throughput', type: 'metric', title: 'Throughput', description: 'Requests per second', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'degradation-alerts', type: 'metric', title: 'Degradation Alerts', description: 'Active performance warnings', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'latency-trend', type: 'chart', chartType: 'line', title: 'Latency Trend (P50 / P95 / P99)', description: 'Response time percentiles over the last 30 days', position: { row: 2, col: 1, width: 3, height: 1 } },
      { id: 'bottleneck-ranking', type: 'chart', chartType: 'bar', title: 'Bottleneck Ranking', description: 'Services ranked by average response time', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'perf-radar', type: 'chart', chartType: 'radar', title: 'Performance Profile', description: 'Latency, throughput, error rate, saturation, availability', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'perf-table', type: 'table', title: 'Service Performance', description: 'Response times and throughput by service', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'AI Insights', description: 'Performance trend analysis and forecasts', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-30-days' },
      { id: 'service', label: 'Service', type: 'dropdown', defaultValue: 'all', options: ['all', 'Web Frontend', 'API Layer', 'Database', 'Cache'] }
    ],
    defaultDateRange: 'last-30-days', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #4 — "TCO Strategic Planner" (bar hero full-width, 2 metrics, 3 compact charts)
  'lifecycle-optimization': {
    widgets: [
      { id: 'eol-systems', type: 'metric', title: 'Approaching EOL', description: 'Systems within 12 months of end-of-life', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'refresh-savings', type: 'metric', title: 'Optimized Savings', description: 'Cost saved via optimized refresh timing', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'avg-age', type: 'metric', title: 'Avg System Age', description: 'Weighted average across portfolio', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'tco-comparison', type: 'chart', chartType: 'bar', title: 'TCO by Lifecycle Stage', description: 'Total cost of ownership: maintain vs. replace vs. modernize', position: { row: 2, col: 1, width: 3, height: 1 } },
      { id: 'age-distribution', type: 'chart', chartType: 'pie', title: 'System Age Distribution', description: 'Portfolio breakdown by age bracket', position: { row: 3, col: 1, width: 1, height: 1 } },
      { id: 'lifecycle-timeline', type: 'chart', chartType: 'line', title: 'Lifecycle Progression', description: 'Systems entering each lifecycle phase over time', position: { row: 3, col: 2, width: 1, height: 1 } },
      { id: 'health-vs-cost', type: 'chart', chartType: 'radar', title: 'Health vs Cost Trade-off', description: 'Maintenance cost, performance, risk, compliance, scalability', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'AI Recommendations', description: 'Optimal refresh timing and modernization priorities', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'refresh-schedule', type: 'table', title: 'Refresh Schedule', description: 'Upcoming system refreshes and recommended actions', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Planning Horizon', type: 'daterange', defaultValue: 'next-2-years' },
      { id: 'domain', label: 'Domain', type: 'dropdown', defaultValue: 'all', options: ['all', 'Finance', 'HR', 'Operations', 'Customer'] }
    ],
    defaultDateRange: 'next-2-years', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #5 — "Financial Intelligence" (no radar — financials need trends, pie for budget, line for efficiency)
  'cost-analytics': {
    widgets: [
      { id: 'total-spend', type: 'metric', title: 'Total IT Spend', description: 'Monthly run cost across portfolio', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'cost-per-user', type: 'metric', title: 'Cost per User', description: 'Blended cost efficiency', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'waste-identified', type: 'metric', title: 'Waste Identified', description: 'Potential savings this month', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'spend-trend', type: 'chart', chartType: 'area', title: 'Monthly Spend Trend', description: 'Infrastructure, licensing, and support costs over 12 months', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'cost-breakdown', type: 'chart', chartType: 'pie', title: 'Cost Breakdown', description: 'Spend allocation by category', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'optimization-opp', type: 'chart', chartType: 'bar', title: 'Optimization Opportunities', description: 'Potential savings by system, ranked by impact', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'cost-efficiency', type: 'chart', chartType: 'line', title: 'Cost Efficiency Trend', description: 'Cost-per-transaction improvement over 12 months', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'AI Cost Insights', description: 'Waste detection and optimization recommendations', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'cost-table', type: 'table', title: 'System Cost Detail', description: 'Per-system cost breakdown with optimization flags', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-12-months' },
      { id: 'category', label: 'Cost Category', type: 'dropdown', defaultValue: 'all', options: ['all', 'Infrastructure', 'Licensing', 'Cloud', 'Support'] }
    ],
    defaultDateRange: 'last-12-months', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #6 — "Threat Intelligence" (bar LEADS — attack surface urgency, then area + radar)
  'security-intelligence': {
    widgets: [
      { id: 'critical-vulns', type: 'metric', title: 'Critical Vulnerabilities', description: 'Unpatched critical CVEs', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'threat-level', type: 'metric', title: 'Threat Level', description: 'Current risk posture', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'compliance-score', type: 'metric', title: 'Compliance Score', description: 'Security policy adherence', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'attack-surface', type: 'chart', chartType: 'bar', title: 'Attack Surface by System', description: 'Exposure score ranked by system — highest risk first', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'severity-dist', type: 'chart', chartType: 'donut', title: 'Severity Distribution', description: 'Vulnerabilities by critical / high / medium / low', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'vuln-trend', type: 'chart', chartType: 'area', title: 'Vulnerability Trend', description: 'Open vulnerabilities over time by severity', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'security-posture', type: 'chart', chartType: 'radar', title: 'Security Posture', description: 'Network, application, data, identity, endpoint scoring', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Threat Intelligence', description: 'AI-detected threats and remediation priorities', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'vuln-table', type: 'table', title: 'Vulnerability Register', description: 'Active vulnerabilities with severity and remediation status', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-30-days' },
      { id: 'severity', label: 'Severity', type: 'dropdown', defaultValue: 'all', options: ['all', 'Critical', 'High', 'Medium', 'Low'] }
    ],
    defaultDateRange: 'last-30-days', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #7 — "SLA Monitor" (no radar, line for MTTR, full-width table, full-width insight)
  'availability-tracking': {
    widgets: [
      { id: 'current-uptime', type: 'metric', title: 'Current Uptime', description: '30-day rolling availability', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'sla-compliance', type: 'metric', title: 'SLA Compliance', description: 'Systems meeting SLA targets', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'incidents-mtd', type: 'metric', title: 'Incidents MTD', description: 'Outages this month', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'uptime-trend', type: 'chart', chartType: 'area', title: 'Availability Over Time', description: 'Daily uptime percentage across all systems', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'sla-breakdown', type: 'chart', chartType: 'donut', title: 'SLA Status', description: 'Systems meeting / at-risk / breaching SLA', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'downtime-by-system', type: 'chart', chartType: 'bar', title: 'Downtime by System', description: 'Total downtime minutes ranked by impact', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'mttr-trend', type: 'chart', chartType: 'line', title: 'MTTR Trend', description: 'Mean time to resolution improving over weeks', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'sla-table', type: 'table', title: 'SLA Report', description: 'System-by-system SLA compliance detail', position: { row: 4, col: 1, width: 3, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Availability Insights', description: 'Downtime pattern analysis and SLA risk alerts', position: { row: 5, col: 1, width: 3, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-30-days' },
      { id: 'tier', label: 'SLA Tier', type: 'dropdown', defaultValue: 'all', options: ['all', 'Platinum (99.99%)', 'Gold (99.9%)', 'Silver (99.5%)'] }
    ],
    defaultDateRange: 'last-30-days', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #8 — "Dependency & Impact Map" (line not area, pie not donut, WIDE radar for coupling)
  'dependency-intelligence': {
    widgets: [
      { id: 'total-dependencies', type: 'metric', title: 'Total Dependencies', description: 'Mapped integration points', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'critical-chains', type: 'metric', title: 'Critical Chains', description: 'High-risk dependency chains', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'blast-radius', type: 'metric', title: 'Max Blast Radius', description: 'Largest cascade impact scope', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'dependency-growth', type: 'chart', chartType: 'line', title: 'Dependency Growth', description: 'New and deprecated dependencies over time', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'dep-type-dist', type: 'chart', chartType: 'pie', title: 'Dependency Types', description: 'API, database, file, message queue, shared service', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'coupling-radar', type: 'chart', chartType: 'radar', title: 'Coupling Analysis', description: 'Afferent, efferent, instability, abstractness, coupling', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'impact-ranking', type: 'chart', chartType: 'bar', title: 'Cascade Impact Ranking', description: 'Systems ranked by downstream impact if they fail', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'AI Insights', description: 'Cascade risk predictions and decoupling recommendations', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'dep-table', type: 'table', title: 'Dependency Map', description: 'Source, target, type, criticality, and last-validated date', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-90-days' },
      { id: 'system', label: 'System', type: 'dropdown', defaultValue: 'all', options: ['all', 'SAP ERP', 'CRM', 'Data Warehouse', 'Integration Hub'] }
    ],
    defaultDateRange: 'last-90-days', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #9 — "Demand Planning" (full-width area hero, only 3 charts)
  'capacity-forecasting': {
    widgets: [
      { id: 'headroom', type: 'metric', title: 'Current Headroom', description: 'Available capacity percentage', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'days-to-threshold', type: 'metric', title: 'Days to Threshold', description: 'Predicted time to 80% utilization', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'scaling-events', type: 'metric', title: 'Auto-Scale Events', description: 'Scaling triggers this month', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'capacity-forecast', type: 'chart', chartType: 'area', title: 'Capacity Forecast', description: 'Projected demand vs available capacity over 90 days', position: { row: 2, col: 1, width: 3, height: 1 } },
      { id: 'resource-split', type: 'chart', chartType: 'donut', title: 'Resource Utilization', description: 'CPU, memory, storage, and network allocation', position: { row: 3, col: 1, width: 1, height: 1 } },
      { id: 'growth-by-service', type: 'chart', chartType: 'bar', title: 'Growth by Service', description: 'Resource consumption growth rate by service', position: { row: 3, col: 2, width: 2, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Capacity Intelligence', description: 'Bottleneck predictions and scaling recommendations', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'capacity-table', type: 'table', title: 'Resource Planning', description: 'Per-system capacity status and forecast', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Forecast Horizon', type: 'daterange', defaultValue: 'next-90-days' },
      { id: 'resource', label: 'Resource Type', type: 'dropdown', defaultValue: 'all', options: ['all', 'CPU', 'Memory', 'Storage', 'Network'] }
    ],
    defaultDateRange: 'next-90-days', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #10 — "User Engagement Hub" (line leads, area in compact secondary, scatter for engagement clusters)
  'usage-analytics': {
    widgets: [
      { id: 'active-users', type: 'metric', title: 'Active Users', description: 'Unique users this month', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'adoption-rate', type: 'metric', title: 'Adoption Rate', description: 'Feature adoption percentage', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'avg-sessions', type: 'metric', title: 'Avg Sessions / User', description: 'Monthly engagement frequency', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'usage-trend', type: 'chart', chartType: 'line', title: 'Daily Active Users', description: 'Precise user count trend over the last 30 days', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'user-segments', type: 'chart', chartType: 'donut', title: 'User Segments', description: 'Power users, regular, occasional, dormant', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'feature-adoption', type: 'chart', chartType: 'bar', title: 'Feature Adoption', description: 'Usage frequency by feature, ranked by adoption', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'engagement-depth', type: 'chart', chartType: 'scatter', title: 'Engagement Clusters', description: 'Session depth distribution across user cohorts', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Usage Insights', description: 'Adoption trends and engagement recommendations', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'usage-table', type: 'table', title: 'System Usage Detail', description: 'Per-system active users, sessions, and feature adoption', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-30-days' },
      { id: 'system', label: 'System', type: 'dropdown', defaultValue: 'all', options: ['all', 'CRM', 'ERP', 'Collaboration', 'Analytics'] }
    ],
    defaultDateRange: 'last-30-days', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #11 — "Root Cause Analyzer" (full-width bar hero for root causes, line + pie, no radar)
  'incident-intelligence': {
    widgets: [
      { id: 'open-incidents', type: 'metric', title: 'Open Incidents', description: 'Unresolved incidents', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'mttr', type: 'metric', title: 'MTTR', description: 'Mean time to resolution', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'recurring-pct', type: 'metric', title: 'Recurring %', description: 'Repeat incident percentage', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'root-cause', type: 'chart', chartType: 'bar', title: 'Root Cause Analysis', description: 'Top root causes ranked by frequency — your action map', position: { row: 2, col: 1, width: 3, height: 1 } },
      { id: 'incident-trend', type: 'chart', chartType: 'line', title: 'Incident Volume Trend', description: 'Daily incident counts with rolling average', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'severity-dist', type: 'chart', chartType: 'pie', title: 'Severity Breakdown', description: 'P1, P2, P3, P4 incident distribution', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Pattern Intelligence', description: 'Recurring pattern detection and prevention strategies', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'incident-table', type: 'table', title: 'Recent Incidents', description: 'Latest incidents with root cause and resolution', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-30-days' },
      { id: 'priority', label: 'Priority', type: 'dropdown', defaultValue: 'all', options: ['all', 'P1 - Critical', 'P2 - High', 'P3 - Medium', 'P4 - Low'] }
    ],
    defaultDateRange: 'last-30-days', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #12 — "API Health Monitor" (line for precision, scatter for latency distribution)
  'integration-health': {
    widgets: [
      { id: 'healthy-integrations', type: 'metric', title: 'Healthy Integrations', description: 'Active and error-free', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'error-rate', type: 'metric', title: 'Error Rate', description: 'Failed transactions percentage', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'avg-latency', type: 'metric', title: 'Avg Latency', description: 'Mean integration response time', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'error-trend', type: 'chart', chartType: 'line', title: 'Error Rate Trend', description: 'Integration failure rates with precision tracking', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'health-dist', type: 'chart', chartType: 'donut', title: 'Integration Health', description: 'Healthy, degraded, failing, inactive', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'latency-scatter', type: 'chart', chartType: 'scatter', title: 'Latency Distribution', description: 'Response time scatter across integration endpoints', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'api-radar', type: 'chart', chartType: 'radar', title: 'API Quality Profile', description: 'Latency, availability, error rate, throughput, compliance', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Integration Intelligence', description: 'Anomaly detection and performance predictions', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'integration-table', type: 'table', title: 'Integration Status', description: 'All integrations with health, latency, and error details', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-7-days' },
      { id: 'type', label: 'Integration Type', type: 'dropdown', defaultValue: 'all', options: ['all', 'REST API', 'SOAP', 'Message Queue', 'File Transfer'] }
    ],
    defaultDateRange: 'last-7-days', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DIGITAL MATURITY (8 services)
  // ═══════════════════════════════════════════════════════════════════════════

  // #13 — "Maturity Spider" (radar hero wide, area compact)
  'dbp-maturity-assessment': {
    widgets: [
      { id: 'overall-maturity', type: 'metric', title: 'Overall Maturity Score', description: 'Organization-wide maturity', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'domains-assessed', type: 'metric', title: 'Domains Assessed', description: 'Total domains evaluated', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'improvement-areas', type: 'metric', title: 'Improvement Areas', description: 'Identified gaps', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'domain-scores', type: 'chart', chartType: 'radar', title: 'Domain Maturity Spider', description: 'Multi-dimensional maturity assessment across all domains', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'maturity-trend', type: 'chart', chartType: 'area', title: 'Maturity Progression', description: 'Quarterly maturity growth', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'domain-comparison', type: 'chart', chartType: 'bar', title: 'Domain Comparison', description: 'Scores by domain ranked highest to lowest', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'maturity-distribution', type: 'chart', chartType: 'donut', title: 'Maturity Distribution', description: 'Domains by maturity level', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'AI Insights', description: 'Improvement recommendations and gap analysis', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'domain-breakdown', type: 'table', title: 'Domain Breakdown', description: 'Detailed domain analysis with scores and targets', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-year' },
      { id: 'domain', label: 'Domain', type: 'dropdown', defaultValue: 'all', options: ['all', 'Customer Experience', 'Data & Analytics', 'Integration', 'Automation'] }
    ],
    defaultDateRange: 'last-year', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #14 — "Readiness Assessment" (radar hero, line for precision, pie for categories)
  'transformation-readiness-score': {
    widgets: [
      { id: 'readiness-score', type: 'metric', title: 'Readiness Score', description: 'Overall transformation readiness', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'blockers', type: 'metric', title: 'Active Blockers', description: 'Critical readiness gaps', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'enablers-met', type: 'metric', title: 'Enablers Met', description: 'Prerequisites satisfied', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'readiness-radar', type: 'chart', chartType: 'radar', title: 'Readiness Dimensions', description: 'People, process, technology, culture, governance', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'readiness-trend', type: 'chart', chartType: 'line', title: 'Readiness Score Trend', description: 'Monthly progression toward readiness threshold', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'gap-analysis', type: 'chart', chartType: 'bar', title: 'Gap Analysis', description: 'Current vs target state by dimension', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'risk-dist', type: 'chart', chartType: 'pie', title: 'Risk Categories', description: 'Readiness risks by type', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Readiness Intelligence', description: 'Risk identification and enabler recommendations', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'readiness-table', type: 'table', title: 'Readiness Checklist', description: 'Dimension-by-dimension readiness status', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Assessment Period', type: 'daterange', defaultValue: 'latest' },
      { id: 'unit', label: 'Business Unit', type: 'dropdown', defaultValue: 'all', options: ['all', 'Corporate', 'Operations', 'Technology', 'Customer'] }
    ],
    defaultDateRange: 'latest', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: false
  },

  // #15 — "Capability Tracker" (line leads for tracking, radar secondary, pie not donut)
  'capability-maturity-tracking': {
    widgets: [
      { id: 'avg-maturity', type: 'metric', title: 'Avg Capability Maturity', description: 'Weighted average across capabilities', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'capabilities-tracked', type: 'metric', title: 'Capabilities Tracked', description: 'Total business capabilities', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'improving', type: 'metric', title: 'Improving', description: 'Capabilities trending upward', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'maturity-over-time', type: 'chart', chartType: 'line', title: 'Maturity Over Time', description: 'Quarterly capability maturity scores', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'capability-radar', type: 'chart', chartType: 'radar', title: 'Capability Heatmap', description: 'Maturity levels across core capabilities', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'benchmark-comparison', type: 'chart', chartType: 'bar', title: 'Benchmark Comparison', description: 'Your scores vs peer average', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'level-dist', type: 'chart', chartType: 'pie', title: 'Maturity Levels', description: 'Capabilities by maturity level (1-5)', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Trend Insights', description: 'Regression alerts and improvement velocity analysis', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'capability-table', type: 'table', title: 'Capability Scorecard', description: 'Detailed scores, trends, and benchmarks per capability', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-year' },
      { id: 'domain', label: 'Capability Domain', type: 'dropdown', defaultValue: 'all', options: ['all', 'Customer', 'Operations', 'Technology', 'Data'] }
    ],
    defaultDateRange: 'last-year', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #16 — "Tech Stack Register" (full-width bar hero for EOL, 3 compact charts, full-width table)
  'technology-maturity-index': {
    widgets: [
      { id: 'tech-score', type: 'metric', title: 'Technology Index', description: 'Overall tech stack maturity', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'eol-count', type: 'metric', title: 'EOL Technologies', description: 'End-of-life components', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'tech-debt', type: 'metric', title: 'Tech Debt Score', description: 'Accumulated technical debt', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'currency-bar', type: 'chart', chartType: 'bar', title: 'Technology Currency', description: 'Versions behind latest by technology — upgrade urgency', position: { row: 2, col: 1, width: 3, height: 1 } },
      { id: 'eol-donut', type: 'chart', chartType: 'donut', title: 'Lifecycle Status', description: 'Current, aging, deprecated, EOL breakdown', position: { row: 3, col: 1, width: 1, height: 1 } },
      { id: 'maturity-trend', type: 'chart', chartType: 'area', title: 'Maturity Trend', description: 'Stack maturity over quarterly assessments', position: { row: 3, col: 2, width: 1, height: 1 } },
      { id: 'stack-radar', type: 'chart', chartType: 'radar', title: 'Stack Profile', description: 'Frontend, backend, data, infra, security, DevOps', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'tech-table', type: 'table', title: 'Technology Register', description: 'Components with version, status, and upgrade priority', position: { row: 4, col: 1, width: 3, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Upgrade Intelligence', description: 'Priority upgrade recommendations and risk assessments', position: { row: 5, col: 1, width: 3, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Assessment Period', type: 'daterange', defaultValue: 'latest' },
      { id: 'layer', label: 'Technology Layer', type: 'dropdown', defaultValue: 'all', options: ['all', 'Frontend', 'Backend', 'Data', 'Infrastructure'] }
    ],
    defaultDateRange: 'latest', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: false
  },

  // #17 — "CMMI Spider" (radar hero for CMMI, line not area for assessment cycles)
  'process-maturity-evaluation': {
    widgets: [
      { id: 'process-score', type: 'metric', title: 'Process Maturity Score', description: 'CMMI-aligned overall score', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'processes-evaluated', type: 'metric', title: 'Processes Evaluated', description: 'Total processes assessed', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'best-practice-gaps', type: 'metric', title: 'Best Practice Gaps', description: 'Processes below target', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'process-radar', type: 'chart', chartType: 'radar', title: 'CMMI Process Spider', description: 'Planning, execution, monitoring, optimization, innovation', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'cmmi-dist', type: 'chart', chartType: 'donut', title: 'CMMI Level Distribution', description: 'Processes by CMMI level (1-5)', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'process-ranking', type: 'chart', chartType: 'bar', title: 'Process Ranking', description: 'Processes ranked by maturity score', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'process-trend', type: 'chart', chartType: 'line', title: 'Assessment Cycle Trend', description: 'Maturity progression across assessment cycles', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Process Intelligence', description: 'Best practice matching and improvement priorities', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'process-table', type: 'table', title: 'Process Scorecard', description: 'Detailed process scores and improvement areas', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Assessment Period', type: 'daterange', defaultValue: 'latest' },
      { id: 'area', label: 'Process Area', type: 'dropdown', defaultValue: 'all', options: ['all', 'Delivery', 'Governance', 'Support', 'Strategy'] }
    ],
    defaultDateRange: 'latest', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: false
  },

  // #18 — "Competitive Benchmark" (radar hero, full-width bar for gaps, no donut — only 3 charts)
  'benchmark-intelligence': {
    widgets: [
      { id: 'percentile-rank', type: 'metric', title: 'Industry Percentile', description: 'Ranking vs peers', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'gaps-to-leader', type: 'metric', title: 'Gaps to Leader', description: 'Dimensions below top quartile', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'peer-count', type: 'metric', title: 'Peer Organizations', description: 'Benchmarking cohort size', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'peer-radar', type: 'chart', chartType: 'radar', title: 'Peer Comparison Spider', description: 'Your scores vs industry median across all dimensions', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'benchmark-trend', type: 'chart', chartType: 'line', title: 'Benchmark Position Trend', description: 'Your percentile rank over quarterly assessments', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'gap-bar', type: 'chart', chartType: 'bar', title: 'Gap to Best-in-Class', description: 'Distance to top quartile by dimension — close the red bars', position: { row: 3, col: 1, width: 3, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Competitive Insights', description: 'Peer analysis and differentiation opportunities', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'benchmark-table', type: 'table', title: 'Benchmark Detail', description: 'Domain scores vs industry median, top quartile, and leader', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Period', type: 'daterange', defaultValue: 'latest' },
      { id: 'industry', label: 'Industry', type: 'dropdown', defaultValue: 'all', options: ['all', 'Financial Services', 'Technology', 'Healthcare', 'Manufacturing'] }
    ],
    defaultDateRange: 'latest', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: false
  },

  // #19 — "Strategic Roadmap" (area for aspirational growth, radar for gap visualization)
  'maturity-roadmap-generator': {
    widgets: [
      { id: 'target-score', type: 'metric', title: 'Target Maturity', description: 'Desired end-state score', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'initiatives', type: 'metric', title: 'Planned Initiatives', description: 'Roadmap items generated', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'quick-wins', type: 'metric', title: 'Quick Wins', description: 'Low-effort / high-impact items', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'roadmap-timeline', type: 'chart', chartType: 'area', title: 'Projected Maturity Growth', description: 'Expected maturity progression if roadmap is executed', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'dimension-radar', type: 'chart', chartType: 'radar', title: 'Current vs Target State', description: 'Gap visualization across all maturity dimensions', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'initiative-priority', type: 'chart', chartType: 'bar', title: 'Initiative Priority', description: 'Roadmap items ranked by weighted priority score', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'effort-impact', type: 'chart', chartType: 'donut', title: 'Effort vs Impact', description: 'Quick-win, strategic, fill, and thankless initiatives', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Roadmap Intelligence', description: 'Sequencing recommendations and dependency analysis', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'roadmap-table', type: 'table', title: 'Roadmap Items', description: 'Initiatives with phase, effort, impact, and dependencies', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'horizon', label: 'Planning Horizon', type: 'dropdown', defaultValue: '2-years', options: ['1-year', '2-years', '3-years', '5-years'] },
      { id: 'domain', label: 'Domain Focus', type: 'dropdown', defaultValue: 'all', options: ['all', 'Customer Experience', 'Data & Analytics', 'Integration', 'Automation'] }
    ],
    defaultDateRange: 'next-2-years', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: false
  },

  // #20 — "Live Maturity Feed" (line for real-time, bar for movement, area for alert volume)
  'continuous-maturity-monitoring': {
    widgets: [
      { id: 'current-score', type: 'metric', title: 'Current Maturity', description: 'Real-time composite score', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'regressions', type: 'metric', title: 'Regressions', description: 'Domains trending downward', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'velocity', type: 'metric', title: 'Improvement Velocity', description: 'Monthly score change rate', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'monitoring-trend', type: 'chart', chartType: 'line', title: 'Continuous Maturity Feed', description: 'Live maturity score with anomaly markers', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'health-donut', type: 'chart', chartType: 'donut', title: 'Domain Health Status', description: 'Improving, stable, declining, critical', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'domain-movement', type: 'chart', chartType: 'bar', title: 'Domain Movement', description: 'Score changes by domain since last assessment', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'alert-trend', type: 'chart', chartType: 'area', title: 'Alert Frequency', description: 'Regression and improvement alerts over time', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Monitoring Intelligence', description: 'Regression root causes and improvement catalysts', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'alert-table', type: 'table', title: 'Alert History', description: 'Recent maturity alerts with domain, type, and resolution', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-90-days' },
      { id: 'alertType', label: 'Alert Type', type: 'dropdown', defaultValue: 'all', options: ['all', 'Regression', 'Improvement', 'Anomaly'] }
    ],
    defaultDateRange: 'last-90-days', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROJECTS PORTFOLIO & LIFECYCLE (10 services)
  // ═══════════════════════════════════════════════════════════════════════════

  // #21 — "AI Prediction Hub" (line for prediction, radar in LEFT position)
  'project-success-prediction': {
    widgets: [
      { id: 'success-probability', type: 'metric', title: 'Success Probability', description: 'AI-predicted success rate', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'risk-score', type: 'metric', title: 'Risk Score', description: 'Overall project risk', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'on-track-projects', type: 'metric', title: 'On-Track Projects', description: 'Projects meeting targets', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'success-trend', type: 'chart', chartType: 'line', title: 'Success Probability Trend', description: 'Weekly success rate changes across the portfolio', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'risk-distribution', type: 'chart', chartType: 'pie', title: 'Risk Distribution', description: 'Projects by risk level', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'project-health', type: 'chart', chartType: 'radar', title: 'Project Health Dimensions', description: 'Schedule, budget, scope, quality, stakeholder', position: { row: 3, col: 1, width: 1, height: 1 } },
      { id: 'risk-factors', type: 'chart', chartType: 'bar', title: 'Top Risk Factors', description: 'Most impactful risk factors across projects', position: { row: 3, col: 2, width: 2, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'AI Predictions', description: 'Success predictions and risk mitigation strategies', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'project-status', type: 'table', title: 'Project Status', description: 'Detailed project breakdown with AI confidence scores', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-90-days' },
      { id: 'portfolio', label: 'Portfolio', type: 'dropdown', defaultValue: 'all', options: ['all', 'Digital Transformation', 'Infrastructure', 'Innovation'] }
    ],
    defaultDateRange: 'last-90-days', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #22 — "Sprint Analytics" (classic agile: line + compact bar, then area + donut)
  'delivery-velocity-analytics': {
    widgets: [
      { id: 'current-velocity', type: 'metric', title: 'Current Sprint Velocity', description: 'Story points completed', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'avg-velocity', type: 'metric', title: 'Average Velocity', description: '5 sprint average', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'predicted-next', type: 'metric', title: 'Predicted Next Sprint', description: 'AI forecast', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'velocity-trend', type: 'chart', chartType: 'line', title: 'Velocity Trend', description: 'Sprint-over-sprint velocity tracking', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'team-comparison', type: 'chart', chartType: 'bar', title: 'Team Velocity', description: 'Velocity comparison across teams', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'throughput-area', type: 'chart', chartType: 'area', title: 'Throughput Trend', description: 'Items completed per week with rolling average', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'work-split', type: 'chart', chartType: 'donut', title: 'Work Type Split', description: 'Features, bugs, tech debt, support', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Velocity Intelligence', description: 'Sprint predictions and bottleneck analysis', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'forecast-table', type: 'table', title: 'Sprint Forecast', description: 'Upcoming sprint predictions with confidence intervals', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-90-days' },
      { id: 'team', label: 'Team', type: 'dropdown', defaultValue: 'all', options: ['all', 'Team Alpha', 'Team Beta', 'Team Gamma'] }
    ],
    defaultDateRange: 'last-90-days', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #23 — "Resource Optimizer" (scatter for utilization clusters, pie not donut)
  'resource-optimization-ai': {
    widgets: [
      { id: 'utilization', type: 'metric', title: 'Avg Utilization', description: 'Team resource utilization rate', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'overallocated', type: 'metric', title: 'Overallocated', description: 'Resources above 100% capacity', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'skill-gaps', type: 'metric', title: 'Skill Gaps', description: 'Unmatched skill requirements', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'utilization-trend', type: 'chart', chartType: 'area', title: 'Utilization Trend', description: 'Weekly resource utilization across the portfolio', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'allocation-pie', type: 'chart', chartType: 'pie', title: 'Allocation Status', description: 'Under, optimal, over-allocated breakdown', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'skill-match', type: 'chart', chartType: 'bar', title: 'Skill Match Analysis', description: 'Demand vs supply by skill category', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'utilization-scatter', type: 'chart', chartType: 'scatter', title: 'Utilization Distribution', description: 'Resource utilization clusters by team', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Optimization Insights', description: 'AI-driven reallocation and hiring recommendations', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'resource-table', type: 'table', title: 'Resource Allocation', description: 'Per-person allocation, utilization, and skill fit', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-30-days' },
      { id: 'skill', label: 'Skill Area', type: 'dropdown', defaultValue: 'all', options: ['all', 'Development', 'Architecture', 'Testing', 'Management'] }
    ],
    defaultDateRange: 'last-30-days', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #24 — "Risk Heat Map" (4 metrics, full-width bar hero for risk ranking, radar in bottom)
  'risk-prediction-engine': {
    widgets: [
      { id: 'high-risk', type: 'metric', title: 'High-Risk Projects', description: 'Projects above risk threshold', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'avg-risk', type: 'metric', title: 'Portfolio Risk Score', description: 'Weighted average risk', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'mitigations-due', type: 'metric', title: 'Mitigations Due', description: 'Outstanding risk actions', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'risk-trend', type: 'chart', chartType: 'area', title: 'Risk Score Trend', description: 'Portfolio risk evolution over time', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'risk-category', type: 'chart', chartType: 'donut', title: 'Risk Categories', description: 'Schedule, budget, scope, resource, technical', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'risk-heatmap-bar', type: 'chart', chartType: 'bar', title: 'Risk by Project', description: 'Projects ranked by composite risk score', position: { row: 3, col: 1, width: 3, height: 1 } },
      { id: 'risk-dimensions', type: 'chart', chartType: 'radar', title: 'Risk Dimensions', description: 'Schedule, cost, quality, scope, stakeholder', position: { row: 4, col: 1, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Risk Predictions', description: 'Emerging risks and proactive mitigation strategies', position: { row: 4, col: 2, width: 2, height: 1 } },
      { id: 'risk-table', type: 'table', title: 'Risk Register', description: 'All risks with probability, impact, and mitigation status', position: { row: 5, col: 1, width: 3, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-90-days' },
      { id: 'project', label: 'Project', type: 'dropdown', defaultValue: 'all', options: ['all', 'Platform Modernization', 'Cloud Migration', 'CRM Upgrade', 'Data Lake'] }
    ],
    defaultDateRange: 'last-90-days', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #25 — "Schedule Intelligence" (line for dates, no radar, area secondary)
  'timeline-forecasting': {
    widgets: [
      { id: 'on-time-pct', type: 'metric', title: 'On-Time Delivery', description: 'Projects on schedule percentage', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'avg-delay', type: 'metric', title: 'Avg Delay', description: 'Average days behind schedule', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'at-risk-deadlines', type: 'metric', title: 'At-Risk Deadlines', description: 'Milestones likely to slip', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'forecast-chart', type: 'chart', chartType: 'line', title: 'Completion Forecast', description: 'Predicted vs planned completion dates with confidence bands', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'delay-dist', type: 'chart', chartType: 'donut', title: 'Schedule Status', description: 'Ahead, on-time, minor delay, major delay', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'delay-drivers', type: 'chart', chartType: 'bar', title: 'Delay Drivers', description: 'Root causes of schedule slippage, ranked by impact', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'velocity-area', type: 'chart', chartType: 'area', title: 'Delivery Velocity', description: 'Work item completion rate fueling the forecast', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Forecast Intelligence', description: 'Delay predictions and acceleration opportunities', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'milestone-table', type: 'table', title: 'Milestone Forecast', description: 'Upcoming milestones with confidence levels', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Forecast Window', type: 'daterange', defaultValue: 'next-90-days' },
      { id: 'project', label: 'Project', type: 'dropdown', defaultValue: 'all', options: ['all', 'Platform Modernization', 'Cloud Migration', 'CRM Upgrade', 'Data Lake'] }
    ],
    defaultDateRange: 'next-90-days', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #26 — "Budget S-Curve" (full-width area hero for burn rate, pie not donut, no radar)
  'budget-variance-prediction': {
    widgets: [
      { id: 'total-budget', type: 'metric', title: 'Portfolio Budget', description: 'Total allocated budget', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'variance-pct', type: 'metric', title: 'Budget Variance', description: 'Actual vs planned spend', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'overrun-risk', type: 'metric', title: 'Overrun Risk', description: 'Projects likely to exceed budget', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'burn-rate', type: 'chart', chartType: 'area', title: 'Budget Burn Rate', description: 'Cumulative spend vs planned budget — the S-curve tells the story', position: { row: 2, col: 1, width: 3, height: 1 } },
      { id: 'spend-category', type: 'chart', chartType: 'pie', title: 'Spend by Category', description: 'People, technology, consulting, infrastructure', position: { row: 3, col: 1, width: 1, height: 1 } },
      { id: 'variance-by-project', type: 'chart', chartType: 'bar', title: 'Variance by Project', description: 'Budget variance ranked by project', position: { row: 3, col: 2, width: 2, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Budget Intelligence', description: 'Overrun predictions and cost-saving opportunities', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'budget-table', type: 'table', title: 'Budget Detail', description: 'Project budgets with actuals, forecast, and variance', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-6-months' },
      { id: 'project', label: 'Project', type: 'dropdown', defaultValue: 'all', options: ['all', 'Platform Modernization', 'Cloud Migration', 'CRM Upgrade', 'Data Lake'] }
    ],
    defaultDateRange: 'last-6-months', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #27 — "Quality Analytics" (line leads for defects, area secondary, scatter for defect distribution)
  'quality-prediction-model': {
    widgets: [
      { id: 'quality-score', type: 'metric', title: 'Quality Score', description: 'Composite quality index', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'defect-rate', type: 'metric', title: 'Defect Rate', description: 'Defects per release', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'test-coverage', type: 'metric', title: 'Test Coverage', description: 'Automated test coverage', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'defect-trend', type: 'chart', chartType: 'line', title: 'Defect Injection Rate', description: 'New defects introduced per sprint — are we improving?', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'defect-category', type: 'chart', chartType: 'pie', title: 'Defect Categories', description: 'Functional, performance, security, UX, integration', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'quality-trend', type: 'chart', chartType: 'area', title: 'Quality Score Progression', description: 'Quality index climbing across releases', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'quality-radar', type: 'chart', chartType: 'radar', title: 'Quality Dimensions', description: 'Reliability, performance, security, usability, maintainability', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Quality Predictions', description: 'Defect forecasts and testing adequacy analysis', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'quality-table', type: 'table', title: 'Release Quality', description: 'Quality metrics by release with pass/fail indicators', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-90-days' },
      { id: 'project', label: 'Project', type: 'dropdown', defaultValue: 'all', options: ['all', 'Customer Portal', 'API Gateway', 'Mobile App', 'Data Pipeline'] }
    ],
    defaultDateRange: 'last-90-days', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #28 — "Sentiment Wave" (full-width area hero for sentiment wave, pie for clear categories)
  'stakeholder-sentiment-analysis': {
    widgets: [
      { id: 'overall-sentiment', type: 'metric', title: 'Overall Sentiment', description: 'Aggregate stakeholder sentiment', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'engagement-score', type: 'metric', title: 'Engagement Score', description: 'Stakeholder participation level', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'concerns-raised', type: 'metric', title: 'Concerns Raised', description: 'Open stakeholder concerns', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'sentiment-trend', type: 'chart', chartType: 'area', title: 'Sentiment Wave', description: 'Stakeholder sentiment ebb and flow over time', position: { row: 2, col: 1, width: 3, height: 1 } },
      { id: 'sentiment-dist', type: 'chart', chartType: 'pie', title: 'Sentiment Distribution', description: 'Positive, neutral, concerned, negative', position: { row: 3, col: 1, width: 1, height: 1 } },
      { id: 'topic-analysis', type: 'chart', chartType: 'bar', title: 'Topic Analysis', description: 'Most discussed themes ranked by frequency', position: { row: 3, col: 2, width: 2, height: 1 } },
      { id: 'stakeholder-radar', type: 'chart', chartType: 'radar', title: 'Stakeholder Health', description: 'Satisfaction, engagement, alignment, confidence, advocacy', position: { row: 4, col: 1, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Sentiment Intelligence', description: 'Emerging concerns and engagement recommendations', position: { row: 4, col: 2, width: 2, height: 1 } },
      { id: 'stakeholder-table', type: 'table', title: 'Stakeholder Pulse', description: 'Key stakeholders with sentiment and recent feedback', position: { row: 5, col: 1, width: 3, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-30-days' },
      { id: 'group', label: 'Stakeholder Group', type: 'dropdown', defaultValue: 'all', options: ['all', 'Executive Sponsors', 'Business Users', 'Technical Team', 'External Partners'] }
    ],
    defaultDateRange: 'last-30-days', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #29 — "Dependency Network" (line for trend, scatter for dependency complexity)
  'dependency-impact-intelligence': {
    widgets: [
      { id: 'cross-deps', type: 'metric', title: 'Cross-Project Dependencies', description: 'Active inter-project links', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'blocked-items', type: 'metric', title: 'Blocked Items', description: 'Work items waiting on dependencies', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'cascade-risk', type: 'metric', title: 'Cascade Risk', description: 'Projects with high cascade exposure', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'dep-trend', type: 'chart', chartType: 'line', title: 'Dependency Trend', description: 'Active dependency count and resolution rate', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'dep-types', type: 'chart', chartType: 'donut', title: 'Dependency Types', description: 'Technical, resource, schedule, deliverable, external', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'impact-ranking', type: 'chart', chartType: 'bar', title: 'Impact Ranking', description: 'Projects ranked by downstream cascade impact', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'complexity-scatter', type: 'chart', chartType: 'scatter', title: 'Complexity Distribution', description: 'Dependency complexity scatter across projects', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Impact Intelligence', description: 'Cascade predictions and dependency decoupling strategies', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'dep-table', type: 'table', title: 'Dependency Map', description: 'Dependencies with source, target, type, status, and risk', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-90-days' },
      { id: 'project', label: 'Project', type: 'dropdown', defaultValue: 'all', options: ['all', 'Platform Modernization', 'Cloud Migration', 'CRM Upgrade', 'Data Lake'] }
    ],
    defaultDateRange: 'last-90-days', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: true
  },

  // #30 — "Knowledge Intelligence" (area for capture volume, pie for categories, full-width table)
  'lessons-learned-intelligence': {
    widgets: [
      { id: 'lessons-captured', type: 'metric', title: 'Lessons Captured', description: 'Total lessons in knowledge base', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'applied-pct', type: 'metric', title: 'Applied Rate', description: 'Lessons applied in new projects', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'pattern-matches', type: 'metric', title: 'Pattern Matches', description: 'AI-detected relevant patterns', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'lessons-trend', type: 'chart', chartType: 'area', title: 'Knowledge Growth', description: 'New lessons added per month — organizational learning curve', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'lesson-categories', type: 'chart', chartType: 'pie', title: 'Lesson Categories', description: 'Technical, process, people, vendor, governance', position: { row: 2, col: 3, width: 1, height: 1 } },
      { id: 'success-patterns', type: 'chart', chartType: 'bar', title: 'Top Success Patterns', description: 'Most frequently recurring success factors', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'knowledge-radar', type: 'chart', chartType: 'radar', title: 'Knowledge Coverage', description: 'Technical, delivery, risk, change management, vendor', position: { row: 3, col: 3, width: 1, height: 1 } },
      { id: 'lessons-table', type: 'table', title: 'Lesson Library', description: 'All lessons with source project, category, and applicability', position: { row: 4, col: 1, width: 3, height: 1 } },
      { id: 'ai-insights', type: 'insight', title: 'Pattern Intelligence', description: 'AI-extracted patterns and recommendations for current projects', position: { row: 5, col: 1, width: 3, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-year' },
      { id: 'category', label: 'Category', type: 'dropdown', defaultValue: 'all', options: ['all', 'Technical', 'Process', 'People', 'Vendor', 'Governance'] }
    ],
    defaultDateRange: 'last-year', defaultView: 'overview', exportFormats: ['excel', 'pdf', 'powerpoint'], supportsScheduling: false
  }
};

// Convert Stage 1 services to Stage 2 format with dashboard configurations
export const intelligenceServices: IntelligenceService[] = [
  // SYSTEMS PORTFOLIO & LIFECYCLE (12 services)
  ...systemsPortfolio.map(service => ({
    id: service.id,
    title: service.title,
    category: 'systems' as const,
    subcategory: service.analyticsType,
    description: service.description,
    aiCapabilities: service.aiCapabilities,
    outputType: 'dashboard' as const,
    keyInsights: service.keyInsights,
    dataSource: service.dataSource,
    updateFrequency: service.updateFrequency.toLowerCase() as 'real-time' | 'hourly' | 'daily' | 'weekly',
    accuracy: service.accuracy,
    complexity: service.complexity.toLowerCase() as 'low' | 'medium' | 'high',
    transformationPhase: 'drive' as const,
    visibleToRoles: ['staff', 'associate', 'manager', 'lead', 'director', 'executive'] as const,
    dataScope: 'own' as const,
    availableDataSources: [
      { id: 'datadog', name: 'Datadog', type: 'APM', available: true, requiresAuth: false },
      { id: 'new-relic', name: 'New Relic', type: 'APM', available: true, requiresAuth: false }
    ],
    defaultDataSource: 'datadog',
    dashboardConfig: featuredDashboardConfigs[service.id] || {
      widgets: [
        {
          id: 'main-chart',
          type: 'chart',
          chartType: 'line',
          title: `${service.title} Trend`,
          description: 'Historical trend analysis',
          position: { row: 1, col: 1, width: 2, height: 1 }
        },
        {
          id: 'main-metric',
          type: 'metric',
          title: 'Current Status',
          description: 'Current metric value',
          position: { row: 1, col: 3, width: 1, height: 1 }
        }
      ],
      filters: [
        {
          id: 'dateRange',
          label: 'Date Range',
          type: 'daterange',
          defaultValue: 'last-30-days'
        }
      ],
      defaultDateRange: 'last-30-days',
      defaultView: 'overview',
      exportFormats: ['excel', 'pdf', 'powerpoint'],
      supportsScheduling: true
    },
    views: Math.floor(Math.random() * 2000) + 500,
    favorites: Math.floor(Math.random() * 150) + 20,
    lastAccessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
  })),

  // PROJECTS PORTFOLIO & LIFECYCLE (10 services)
  ...projectsPortfolio.map(service => ({
    id: service.id,
    title: service.title,
    category: 'projects' as const,
    subcategory: service.analyticsType,
    description: service.description,
    aiCapabilities: service.aiCapabilities,
    outputType: 'dashboard' as const,
    keyInsights: service.keyInsights,
    dataSource: service.dataSource,
    updateFrequency: service.updateFrequency.toLowerCase() as 'real-time' | 'hourly' | 'daily' | 'weekly',
    accuracy: service.accuracy,
    complexity: service.complexity.toLowerCase() as 'low' | 'medium' | 'high',
    transformationPhase: 'deploy' as const,
    visibleToRoles: ['staff', 'associate', 'manager', 'lead', 'director', 'executive'] as const,
    dataScope: 'own' as const,
    availableDataSources: [
      { id: 'azure-devops', name: 'Azure DevOps', type: 'Project Management', available: true, requiresAuth: false },
      { id: 'jira', name: 'Jira', type: 'Project Management', available: true, requiresAuth: false },
      { id: 'github', name: 'GitHub Issues', type: 'Project Management', available: true, requiresAuth: false }
    ],
    defaultDataSource: 'azure-devops',
    dashboardConfig: featuredDashboardConfigs[service.id] || {
      widgets: [
        {
          id: 'main-chart',
          type: 'chart',
          chartType: 'line',
          title: `${service.title} Trend`,
          description: 'Historical trend analysis',
          position: { row: 1, col: 1, width: 2, height: 1 }
        },
        {
          id: 'main-metric',
          type: 'metric',
          title: 'Current Status',
          description: 'Current metric value',
          position: { row: 1, col: 3, width: 1, height: 1 }
        }
      ],
      filters: [
        {
          id: 'projects',
          label: 'Projects',
          type: 'multiselect',
          options: ['Customer Portal', 'API Gateway', 'Data Pipeline', 'Mobile App'],
          rbacRestricted: true
        },
        {
          id: 'dateRange',
          label: 'Date Range',
          type: 'daterange',
          defaultValue: 'last-30-days'
        }
      ],
      defaultDateRange: 'last-30-days',
      defaultView: 'overview',
      exportFormats: ['excel', 'pdf', 'powerpoint'],
      supportsScheduling: true
    },
    views: Math.floor(Math.random() * 2000) + 500,
    favorites: Math.floor(Math.random() * 150) + 20,
    lastAccessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
  })),

  // DIGITAL MATURITY (8 services)
  ...digitalMaturity.map(service => ({
    id: service.id,
    title: service.title,
    category: 'maturity' as const,
    subcategory: service.analyticsType,
    description: service.description,
    aiCapabilities: service.aiCapabilities,
    outputType: 'dashboard' as const,
    keyInsights: service.keyInsights,
    dataSource: 'Assessment Tools',
    updateFrequency: service.assessmentFrequency.toLowerCase().includes('continuous') ? 'real-time' : 
                     service.assessmentFrequency.toLowerCase().includes('daily') ? 'daily' :
                     service.assessmentFrequency.toLowerCase().includes('weekly') ? 'weekly' : 'weekly',
    accuracy: service.accuracy,
    complexity: service.complexity.toLowerCase() as 'low' | 'medium' | 'high',
    transformationPhase: 'discern' as const,
    visibleToRoles: ['manager', 'lead', 'director', 'executive'] as const,
    dataScope: 'domain' as const,
    availableDataSources: [
      { id: 'assessment-tool', name: 'Maturity Assessment Tool', type: 'Assessment', available: true, requiresAuth: false },
      { id: 'manual-input', name: 'Manual Input', type: 'Form', available: true, requiresAuth: false }
    ],
    defaultDataSource: 'assessment-tool',
    dashboardConfig: featuredDashboardConfigs[service.id] || {
      widgets: [
        {
          id: 'maturity-score',
          type: 'metric',
          title: 'Overall Maturity Score',
          description: 'Composite maturity score',
          position: { row: 1, col: 1, width: 1, height: 1 }
        },
        {
          id: 'domain-scores',
          type: 'chart',
          chartType: 'bar',
          title: 'Maturity by Domain',
          description: 'Scores across domains',
          position: { row: 1, col: 2, width: 2, height: 1 }
        }
      ],
      filters: [
        {
          id: 'domains',
          label: 'Domains',
          type: 'multiselect',
          options: ['Customer Experience', 'Data & Analytics', 'Integration', 'Automation'],
          rbacRestricted: false
        }
      ],
      defaultDateRange: 'latest',
      defaultView: 'overview',
      exportFormats: ['excel', 'pdf', 'powerpoint'],
      supportsScheduling: false
    },
    views: Math.floor(Math.random() * 1500) + 300,
    favorites: Math.floor(Math.random() * 100) + 15,
    lastAccessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
  }))
];
