// Lifecycle Management Services Data

// Export comprehensive lifecycle data
export * from './lifecycleData';

// Project Lifecycle Services
const projectLifecycleServices = [
  {
    id: "waterfall-project-lifecycle",
    title: "Waterfall Project Lifecycle Framework",
    description: "Traditional stage-gate project management with defined phases and approval gates",
    iconName: "FolderKanban",
    category: "Project Frameworks",
    methodology: "Waterfall",
    lifecycleType: "Project",
    governanceLevel: "High",
    updateFrequency: "On-demand",
    complexity: "Medium" as const,
    realtime: false,
    keyMetrics: ["Stage Progress", "Gate Approvals", "Timeline Adherence", "Deliverable Status"],
    integrationLevel: "Portfolio Integrated",
    tab: 'project-lifecycle' as const
  },
  {
    id: "agile-project-lifecycle",
    title: "Agile Project Lifecycle Framework",
    description: "Scrum-based project framework with sprint planning and retrospective templates",
    iconName: "FolderKanban",
    category: "Project Frameworks",
    methodology: "Agile",
    lifecycleType: "Project",
    governanceLevel: "Medium",
    updateFrequency: "Real-time",
    complexity: "Medium" as const,
    realtime: true,
    keyMetrics: ["Sprint Velocity", "Burndown", "Story Points", "Team Health"],
    integrationLevel: "Full Integration",
    tab: 'project-lifecycle' as const
  },
  {
    id: "hybrid-project-lifecycle",
    title: "Hybrid Project Lifecycle Framework",
    description: "Combines waterfall governance with agile execution for complex projects",
    iconName: "FolderKanban",
    category: "Project Frameworks",
    methodology: "Hybrid",
    lifecycleType: "Project",
    governanceLevel: "High",
    updateFrequency: "Weekly",
    complexity: "High" as const,
    realtime: false,
    keyMetrics: ["Phase Gates", "Sprint Progress", "Risk Score", "Budget Variance"],
    integrationLevel: "Portfolio Integrated",
    tab: 'project-lifecycle' as const
  },
  {
    id: "stage-gate-approval-workflow",
    title: "Stage-Gate Approval Workflows",
    description: "Multi-level approval routing with governance board templates and escalation procedures",
    iconName: "CheckSquare",
    category: "Approval Management",
    methodology: "All",
    lifecycleType: "Governance",
    governanceLevel: "High",
    updateFrequency: "Real-time",
    complexity: "Medium" as const,
    realtime: true,
    keyMetrics: ["Pending Approvals", "Avg Decision Time", "Approval Rate", "Escalations"],
    integrationLevel: "Full Integration",
    tab: 'project-lifecycle' as const
  }
];

// Product Lifecycle Services
const productLifecycleServices = [
  {
    id: "product-roadmap-management",
    title: "Product Roadmap Management",
    description: "Strategic product planning with roadmap templates and feature prioritization frameworks",
    iconName: "Package",
    category: "Product Planning",
    methodology: "Product-Led",
    lifecycleType: "Product",
    governanceLevel: "Medium",
    updateFrequency: "Monthly",
    complexity: "Medium" as const,
    realtime: false,
    keyMetrics: ["Features Planned", "Release Timeline", "Priority Score", "Market Fit"],
    integrationLevel: "Standalone",
    tab: 'product-lifecycle' as const
  },
  {
    id: "product-launch-stagegate",
    title: "Product Launch Stage-Gate Process",
    description: "Six-stage framework from concept through launch with decision criteria at each gate",
    iconName: "Package",
    category: "Product Launch",
    methodology: "Stage-Gate",
    lifecycleType: "Product",
    governanceLevel: "High",
    updateFrequency: "On-demand",
    complexity: "High" as const,
    realtime: false,
    keyMetrics: ["Launch Readiness", "Gate Status", "Market Validation", "Go-to-Market"],
    integrationLevel: "Portfolio Integrated",
    tab: 'product-lifecycle' as const
  },
  {
    id: "feature-prioritization",
    title: "Feature Prioritization Framework",
    description: "Data-driven feature prioritization using RICE, WSJF, and value vs effort matrices",
    iconName: "Package",
    category: "Product Planning",
    methodology: "Product-Led",
    lifecycleType: "Product",
    governanceLevel: "Low",
    updateFrequency: "Weekly",
    complexity: "Low" as const,
    realtime: false,
    keyMetrics: ["Priority Score", "Value Impact", "Effort Estimate", "ROI"],
    integrationLevel: "Standalone",
    tab: 'product-lifecycle' as const
  },
  {
    id: "product-sunset-workflow",
    title: "Product Sunset & Retirement Workflow",
    description: "Structured process for product end-of-life with customer migration and support plans",
    iconName: "Archive",
    category: "Product Retirement",
    methodology: "Stage-Gate",
    lifecycleType: "Product",
    governanceLevel: "High",
    updateFrequency: "On-demand",
    complexity: "Medium" as const,
    realtime: false,
    keyMetrics: ["Customer Migration", "Support Timeline", "Cost Savings", "Compliance"],
    integrationLevel: "Portfolio Integrated",
    tab: 'product-lifecycle' as const
  }
];

// Application Lifecycle Services
const applicationLifecycleServices = [
  {
    id: "application-retirement-lifecycle",
    title: "Application Retirement Lifecycle",
    description: "Complete framework for retiring legacy applications with compliance and data migration",
    iconName: "GitBranch",
    category: "Application Retirement",
    methodology: "Stage-Gate",
    lifecycleType: "Application",
    governanceLevel: "High",
    updateFrequency: "On-demand",
    complexity: "High" as const,
    realtime: false,
    keyMetrics: ["Retirement Progress", "Data Migration", "Cost Savings", "Compliance Status"],
    integrationLevel: "Portfolio Integrated",
    tab: 'application-lifecycle' as const
  },
  {
    id: "application-modernization-lifecycle",
    title: "Application Modernization Lifecycle",
    description: "Structured approach to modernize legacy applications with cloud migration and refactoring",
    iconName: "GitBranch",
    category: "Application Modernization",
    methodology: "Hybrid",
    lifecycleType: "Application",
    governanceLevel: "High",
    updateFrequency: "Weekly",
    complexity: "High" as const,
    realtime: false,
    keyMetrics: ["Modernization Progress", "Technical Debt", "Cloud Readiness", "Performance"],
    integrationLevel: "Full Integration",
    tab: 'application-lifecycle' as const
  },
  {
    id: "release-approval-process",
    title: "Release Approval & Change Management",
    description: "Governance workflows for application releases with change advisory board processes",
    iconName: "GitBranch",
    category: "Release Management",
    methodology: "ITIL",
    lifecycleType: "Application",
    governanceLevel: "High",
    updateFrequency: "Real-time",
    complexity: "Medium" as const,
    realtime: true,
    keyMetrics: ["Pending Releases", "Approval Status", "Change Success Rate", "Rollback Rate"],
    integrationLevel: "Full Integration",
    tab: 'application-lifecycle' as const
  },
  {
    id: "compliance-risk-management",
    title: "Compliance & Risk Management Framework",
    description: "Built-in compliance checkpoints and risk assessment frameworks with audit trails",
    iconName: "Shield",
    category: "Compliance & Risk",
    methodology: "All",
    lifecycleType: "Governance",
    governanceLevel: "High",
    updateFrequency: "Real-time",
    complexity: "High" as const,
    realtime: true,
    keyMetrics: ["Compliance Gates", "Risk Score", "Audit Findings", "Remediation Status"],
    integrationLevel: "Full Integration",
    tab: 'application-lifecycle' as const
  }
];

// Filters for each tab
export const lifecycleFilters = {
  "project-lifecycle": {
    serviceCategory: ["Project Frameworks", "Approval Management", "Governance"],
    methodology: ["Waterfall", "Agile", "Hybrid", "All"],
    lifecycleType: ["Project", "Governance"],
    governanceLevel: ["Low", "Medium", "High"],
    updateFrequency: ["Real-time", "Daily", "Weekly", "Monthly", "On-demand"],
    integrationLevel: ["Standalone", "Portfolio Integrated", "Full Integration"],
    complexity: ["Low", "Medium", "High"]
  },
  "product-lifecycle": {
    serviceCategory: ["Product Planning", "Product Launch", "Product Retirement"],
    methodology: ["Product-Led", "Stage-Gate", "All"],
    lifecycleType: ["Product", "Governance"],
    governanceLevel: ["Low", "Medium", "High"],
    updateFrequency: ["Weekly", "Monthly", "On-demand"],
    integrationLevel: ["Standalone", "Portfolio Integrated", "Full Integration"],
    complexity: ["Low", "Medium", "High"]
  },
  "application-lifecycle": {
    serviceCategory: ["Application Retirement", "Application Modernization", "Release Management", "Compliance & Risk"],
    methodology: ["Stage-Gate", "Hybrid", "ITIL", "All"],
    lifecycleType: ["Application", "Governance"],
    governanceLevel: ["Medium", "High"],
    updateFrequency: ["Real-time", "Weekly", "On-demand"],
    integrationLevel: ["Portfolio Integrated", "Full Integration"],
    complexity: ["Medium", "High"]
  }
};

// Combined services by tab
export const lifecycleServices = {
  "project-lifecycle": projectLifecycleServices,
  "product-lifecycle": productLifecycleServices,
  "application-lifecycle": applicationLifecycleServices
};

// All lifecycle services combined
export const allLifecycleServices = [
  ...projectLifecycleServices,
  ...productLifecycleServices,
  ...applicationLifecycleServices
];

// Lifecycle statistics
export const lifecycleStats = {
  totalServices: allLifecycleServices.length,
  projectServices: projectLifecycleServices.length,
  productServices: productLifecycleServices.length,
  applicationServices: applicationLifecycleServices.length,
  realtimeServices: allLifecycleServices.filter(service => service.realtime).length
};
