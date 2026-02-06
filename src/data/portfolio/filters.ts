export const portfolioFilters = {
  // Application Portfolio Filters
  application: {
    serviceCategory: [
      "Portfolio Analytics",
      "Application Rationalization", 
      "TCO Management",
      "Lifecycle Management",
      "Health Monitoring",
      "Risk Assessment"
    ],
    portfolioScope: [
      "Enterprise",
      "Business Unit", 
      "Domain",
      "Application"
    ],
    analysisType: [
      "Strategic",
      "Operational",
      "Financial", 
      "Technical",
      "Risk"
    ],
    deliveryModel: [
      "Dashboard",
      "Report",
      "Workshop",
      "Assessment",
      "Consulting"
    ],
    updateFrequency: [
      "Real-time",
      "Daily",
      "Weekly",
      "Monthly",
      "On-demand"
    ],
    integrationLevel: [
      "Standalone",
      "CMDB Integrated",
      "APM Integrated", 
      "Full Integration"
    ],
    complexity: [
      "Low",
      "Medium", 
      "High"
    ]
  },

  // Project Portfolio Filters  
  project: {
    serviceCategory: [
      "Portfolio Dashboard",
      "Project Health Tracking",
      "Resource Management",
      "Budget & Finance",
      "Risk Management",
      "Delivery Analytics"
    ],
    portfolioType: [
      "Transformation Projects",
      "IT Projects",
      "Business Projects", 
      "Innovation Projects",
      "All Projects"
    ],
    projectPhase: [
      "Initiation",
      "Planning",
      "Execution",
      "Monitoring",
      "Closure",
      "All Phases"
    ],
    deliveryModel: [
      "Dashboard",
      "Report", 
      "Tool",
      "Consulting",
      "Assessment"
    ],
    updateFrequency: [
      "Real-time",
      "Daily",
      "Weekly", 
      "Monthly"
    ],
    reportingLevel: [
      "Executive",
      "Portfolio Manager",
      "Project Manager",
      "Team"
    ],
    complexity: [
      "Low",
      "Medium",
      "High"
    ]
  }
};

export type ApplicationFilters = typeof portfolioFilters.application;
export type ProjectFilters = typeof portfolioFilters.project;