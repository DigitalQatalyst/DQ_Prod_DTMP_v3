import { IntelligenceService } from './types';
import { systemsPortfolio } from '../systemsPortfolio';
import { projectsPortfolio } from '../projectsPortfolio';
import { digitalMaturity } from '../digitalMaturity';

// Special dashboard configurations for featured services
const featuredDashboardConfigs: Record<string, any> = {
  'delivery-velocity-analytics': {
    widgets: [
      // Row 1: Key Metrics (4 cards across)
      { id: 'current-velocity', type: 'metric', title: 'Current Sprint Velocity', description: 'Story points completed', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'avg-velocity', type: 'metric', title: 'Average Velocity', description: '5 sprint average', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'predicted-next', type: 'metric', title: 'Predicted Next Sprint', description: 'AI forecast', position: { row: 1, col: 3, width: 1, height: 1 } },
      { id: 'team-capacity', type: 'metric', title: 'Team Capacity', description: 'Current availability', position: { row: 1, col: 4, width: 1, height: 1 } },
      
      // Row 2: Main trend chart
      { id: 'velocity-trend', type: 'chart', chartType: 'line', title: 'Velocity Trend', description: 'Sprint velocity over time', position: { row: 2, col: 1, width: 3, height: 1 } },
      
      // Row 3: Insights + Forecast table
      { id: 'ai-insights', type: 'insight', title: 'AI Insights', description: 'Intelligent recommendations', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'forecast-table', type: 'table', title: 'Sprint Forecast', description: 'Upcoming sprint predictions', position: { row: 3, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-90-days', options: ['last-30-days', 'last-90-days', 'last-6-months', 'last-year'] },
      { id: 'team', label: 'Team', type: 'dropdown', defaultValue: 'all', options: ['all', 'Team Alpha', 'Team Beta', 'Team Gamma'] }
    ],
    defaultDateRange: 'last-90-days',
    defaultView: 'overview',
    exportFormats: ['excel', 'pdf', 'powerpoint'],
    supportsScheduling: true
  },
  'project-success-prediction': {
    widgets: [
      // Row 1: Key Metrics
      { id: 'success-probability', type: 'metric', title: 'Success Probability', description: 'AI-predicted success rate', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'risk-score', type: 'metric', title: 'Risk Score', description: 'Overall project risk', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'on-track-projects', type: 'metric', title: 'On-Track Projects', description: 'Projects meeting targets', position: { row: 1, col: 3, width: 1, height: 1 } },
      
      // Row 2: Success trend line + Risk distribution donut
      { id: 'success-trend', type: 'chart', chartType: 'line', title: 'Success Probability Trend', description: 'Weekly success rate changes', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'risk-distribution', type: 'chart', chartType: 'donut', title: 'Risk Distribution', description: 'Projects by risk level', position: { row: 2, col: 3, width: 1, height: 1 } },
      
      // Row 3: Project health radar + Risk factors bar
      { id: 'project-health', type: 'chart', chartType: 'radar', title: 'Project Health Dimensions', description: 'Multi-factor health analysis', position: { row: 3, col: 1, width: 1, height: 1 } },
      { id: 'risk-factors', type: 'chart', chartType: 'bar', title: 'Top Risk Factors', description: 'Most impactful risks', position: { row: 3, col: 2, width: 2, height: 1 } },
      
      // Row 4: AI Insights + Project status table
      { id: 'ai-insights', type: 'insight', title: 'AI Insights', description: 'Intelligent recommendations', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'project-status', type: 'table', title: 'Project Status', description: 'Detailed project breakdown', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-90-days' },
      { id: 'portfolio', label: 'Portfolio', type: 'dropdown', defaultValue: 'all', options: ['all', 'Digital Transformation', 'Infrastructure', 'Innovation'] }
    ],
    defaultDateRange: 'last-90-days',
    defaultView: 'overview',
    exportFormats: ['excel', 'pdf', 'powerpoint'],
    supportsScheduling: true
  },
  'dbp-maturity-assessment': {
    widgets: [
      // Row 1: Key Metrics
      { id: 'overall-maturity', type: 'metric', title: 'Overall Maturity Score', description: 'Organization-wide maturity', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'domains-assessed', type: 'metric', title: 'Domains Assessed', description: 'Total domains evaluated', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'improvement-areas', type: 'metric', title: 'Improvement Areas', description: 'Identified gaps', position: { row: 1, col: 3, width: 1, height: 1 } },
      
      // Row 2: Maturity trend + Domain scores radar
      { id: 'maturity-trend', type: 'chart', chartType: 'area', title: 'Maturity Progression', description: 'Quarterly maturity growth', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'domain-scores', type: 'chart', chartType: 'radar', title: 'Domain Maturity Scores', description: 'Multi-dimensional assessment', position: { row: 2, col: 3, width: 1, height: 1 } },
      
      // Row 3: Domain comparison bar + Maturity distribution donut
      { id: 'domain-comparison', type: 'chart', chartType: 'bar', title: 'Domain Comparison', description: 'Scores by domain', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'maturity-distribution', type: 'chart', chartType: 'donut', title: 'Maturity Distribution', description: 'Domains by level', position: { row: 3, col: 3, width: 1, height: 1 } },
      
      // Row 4: AI Insights + Domain breakdown table
      { id: 'ai-insights', type: 'insight', title: 'AI Insights', description: 'Improvement recommendations', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'domain-breakdown', type: 'table', title: 'Domain Breakdown', description: 'Detailed domain analysis', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-year' },
      { id: 'domain', label: 'Domain', type: 'dropdown', defaultValue: 'all', options: ['all', 'Customer Experience', 'Data & Analytics', 'Integration', 'Automation'] }
    ],
    defaultDateRange: 'last-year',
    defaultView: 'overview',
    exportFormats: ['excel', 'pdf', 'powerpoint'],
    supportsScheduling: true
  },
  'system-health-analytics': {
    widgets: [
      // Row 1: Key Metrics
      { id: 'overall-uptime', type: 'metric', title: 'Overall Uptime', description: 'System availability', position: { row: 1, col: 1, width: 1, height: 1 } },
      { id: 'critical-systems', type: 'metric', title: 'Critical Systems Healthy', description: 'Mission-critical status', position: { row: 1, col: 2, width: 1, height: 1 } },
      { id: 'anomalies-detected', type: 'metric', title: 'Anomalies Detected', description: 'Issues identified', position: { row: 1, col: 3, width: 1, height: 1 } },
      
      // Row 2: Uptime trend + System health donut
      { id: 'uptime-trend', type: 'chart', chartType: 'area', title: 'Uptime Trend', description: 'Daily uptime percentage', position: { row: 2, col: 1, width: 2, height: 1 } },
      { id: 'system-health', type: 'chart', chartType: 'donut', title: 'System Health Distribution', description: 'Systems by status', position: { row: 2, col: 3, width: 1, height: 1 } },
      
      // Row 3: Response time line + Performance radar
      { id: 'response-time', type: 'chart', chartType: 'line', title: 'Response Time', description: 'Average response time', position: { row: 3, col: 1, width: 2, height: 1 } },
      { id: 'performance-metrics', type: 'chart', chartType: 'radar', title: 'Performance Metrics', description: 'Multi-dimensional performance', position: { row: 3, col: 3, width: 1, height: 1 } },
      
      // Row 4: AI Insights + System status table
      { id: 'ai-insights', type: 'insight', title: 'AI Insights', description: 'Health recommendations', position: { row: 4, col: 1, width: 2, height: 1 } },
      { id: 'system-status', type: 'table', title: 'System Status', description: 'Detailed system breakdown', position: { row: 4, col: 3, width: 1, height: 1 } }
    ],
    filters: [
      { id: 'dateRange', label: 'Date Range', type: 'daterange', defaultValue: 'last-7-days' },
      { id: 'system', label: 'System', type: 'dropdown', defaultValue: 'all', options: ['all', 'SAP ERP', 'Salesforce', 'API Gateway', 'Azure Cloud'] }
    ],
    defaultDateRange: 'last-7-days',
    defaultView: 'overview',
    exportFormats: ['excel', 'pdf', 'powerpoint'],
    supportsScheduling: true
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
