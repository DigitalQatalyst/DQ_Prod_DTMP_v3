export interface ApplicationPortfolioService {
  id: string;
  title: string;
  description: string;
  iconName: string; // Using string instead of LucideIcon component
  category: string;
  scope: string;
  analysisType: string;
  deliveryModel: string;
  updateFrequency: string;
  complexity: "Low" | "Medium" | "High";
  realtime: boolean;
  keyMetrics: string[];
  integrationLevel: string;
}

export const applicationPortfolio: ApplicationPortfolioService[] = [
  {
    id: "application-rationalization",
    title: "Application Rationalization Assessment",
    description: "Comprehensive analysis to identify redundant, outdated, or overlapping applications for consolidation or retirement",
    iconName: "GitCompare",
    category: "Application Rationalization",
    scope: "Enterprise",
    analysisType: "Strategic",
    deliveryModel: "Assessment",
    updateFrequency: "On-demand",
    complexity: "High",
    realtime: false,
    keyMetrics: ["Redundancy Score", "Business Value", "Technical Health", "TCO Impact"],
    integrationLevel: "CMDB Integrated"
  },
  {
    id: "portfolio-health-dashboard",
    title: "Application Portfolio Health Dashboard",
    description: "Real-time dashboard showing portfolio-wide health metrics, risks, and trends",
    iconName: "Activity",
    category: "Health Monitoring",
    scope: "Enterprise",
    analysisType: "Operational",
    deliveryModel: "Dashboard",
    updateFrequency: "Real-time",
    complexity: "Medium",
    realtime: true,
    keyMetrics: ["Health Score", "Risk Index", "Availability", "Performance"],
    integrationLevel: "APM Integrated"
  },
  {
    id: "tco-optimization",
    title: "Total Cost of Ownership (TCO) Optimization",
    description: "Detailed TCO analysis with cost optimization recommendations across the application portfolio",
    iconName: "DollarSign",
    category: "TCO Management",
    scope: "Enterprise",
    analysisType: "Financial",
    deliveryModel: "Report",
    updateFrequency: "Monthly",
    complexity: "High",
    realtime: false,
    keyMetrics: ["Total TCO", "Cost per User", "License Optimization", "Infrastructure Savings"],
    integrationLevel: "Full Integration"
  },
  {
    id: "application-lifecycle-tracking",
    title: "Application Lifecycle Management",
    description: "Track applications through their complete lifecycle from inception to retirement",
    iconName: "RefreshCw",
    category: "Lifecycle Management",
    scope: "Enterprise",
    analysisType: "Operational",
    deliveryModel: "Dashboard",
    updateFrequency: "Real-time",
    complexity: "Medium",
    realtime: true,
    keyMetrics: ["Lifecycle Stage", "Age", "End-of-Life Date", "Replacement Status"],
    integrationLevel: "CMDB Integrated"
  },
  {
    id: "technical-debt-assessment",
    title: "Technical Debt Assessment",
    description: "Quantify and prioritize technical debt across the application portfolio",
    iconName: "AlertTriangle",
    category: "Risk Assessment",
    scope: "Enterprise",
    analysisType: "Technical",
    deliveryModel: "Assessment",
    updateFrequency: "Quarterly",
    complexity: "High",
    realtime: false,
    keyMetrics: ["Debt Score", "Remediation Cost", "Business Impact", "Priority"],
    integrationLevel: "CMDB Integrated"
  }
];

export const applicationPortfolioFilters = {
  serviceCategory: ["Portfolio Analytics", "Application Rationalization", "TCO Management", "Lifecycle Management", "Health Monitoring", "Risk Assessment"],
  portfolioScope: ["Enterprise", "Business Unit", "Domain", "Application"],
  analysisType: ["Strategic", "Operational", "Financial", "Technical", "Risk"],
  deliveryModel: ["Dashboard", "Report", "Workshop", "Assessment", "Consulting"],
  updateFrequency: ["Real-time", "Daily", "Weekly", "Monthly", "On-demand"],
  integrationLevel: ["Standalone", "CMDB Integrated", "APM Integrated", "Full Integration"],
  complexity: ["Low", "Medium", "High"]
};