export interface ProjectPortfolioService {
  id: string;
  title: string;
  description: string;
  iconName: string; // Using string instead of LucideIcon component
  category: string;
  portfolioType: string;
  projectPhase: string;
  deliveryModel: string;
  updateFrequency: string;
  complexity: "Low" | "Medium" | "High";
  realtime: boolean;
  keyMetrics: string[];
  reportingLevel: string;
}

export const projectPortfolio: ProjectPortfolioService[] = [
  {
    id: "portfolio-dashboard",
    title: "Executive Portfolio Dashboard",
    description: "Comprehensive real-time view of all transformation and IT projects with health indicators",
    iconName: "LayoutDashboard",
    category: "Portfolio Dashboard",
    portfolioType: "All Projects",
    projectPhase: "All Phases",
    deliveryModel: "Dashboard",
    updateFrequency: "Real-time",
    complexity: "Medium",
    realtime: true,
    keyMetrics: ["Portfolio Health", "On-time Delivery %", "Budget Variance", "Resource Utilization"],
    reportingLevel: "Executive"
  },
  {
    id: "project-health-tracking",
    title: "Project Health Tracking System",
    description: "Monitor project health across multiple dimensions with predictive alerts",
    iconName: "Activity",
    category: "Project Health Tracking",
    portfolioType: "All Projects",
    projectPhase: "Execution",
    deliveryModel: "Dashboard",
    updateFrequency: "Daily",
    complexity: "Medium",
    realtime: false,
    keyMetrics: ["Health Score", "Risk Level", "Schedule Status", "Quality Metrics"],
    reportingLevel: "Project Manager"
  },
  {
    id: "resource-capacity-planning",
    title: "Resource Capacity Planning Tool",
    description: "Optimize resource allocation across the project portfolio with demand forecasting",
    iconName: "Users",
    category: "Resource Management",
    portfolioType: "All Projects",
    projectPhase: "Planning",
    deliveryModel: "Tool",
    updateFrequency: "Weekly",
    complexity: "High",
    realtime: false,
    keyMetrics: ["Capacity Utilization", "Demand Forecast", "Skill Gaps", "Allocation Efficiency"],
    reportingLevel: "Portfolio Manager"
  },
  {
    id: "budget-variance-analysis",
    title: "Budget & Cost Variance Analysis",
    description: "Track budget performance and forecast cost variances across all projects",
    iconName: "DollarSign",
    category: "Budget & Finance",
    portfolioType: "All Projects",
    projectPhase: "All Phases",
    deliveryModel: "Report",
    updateFrequency: "Monthly",
    complexity: "Medium",
    realtime: false,
    keyMetrics: ["Budget Variance", "EAC", "Burn Rate", "Forecast Accuracy"],
    reportingLevel: "Executive"
  },
  {
    id: "portfolio-risk-register",
    title: "Portfolio Risk Register & Mitigation",
    description: "Centralized risk management across all projects with mitigation tracking",
    iconName: "ShieldAlert",
    category: "Risk Management",
    portfolioType: "All Projects",
    projectPhase: "All Phases",
    deliveryModel: "Dashboard",
    updateFrequency: "Weekly",
    complexity: "High",
    realtime: false,
    keyMetrics: ["Risk Count", "Exposure Value", "Mitigation Status", "Top Risks"],
    reportingLevel: "Portfolio Manager"
  }
];

export const projectPortfolioFilters = {
  serviceCategory: ["Portfolio Dashboard", "Project Health Tracking", "Resource Management", "Budget & Finance", "Risk Management", "Delivery Analytics"],
  portfolioType: ["Transformation Projects", "IT Projects", "Business Projects", "Innovation Projects", "All Projects"],
  projectPhase: ["Initiation", "Planning", "Execution", "Monitoring", "Closure", "All Phases"],
  deliveryModel: ["Dashboard", "Report", "Tool", "Consulting", "Assessment"],
  updateFrequency: ["Real-time", "Daily", "Weekly", "Monthly"],
  reportingLevel: ["Executive", "Portfolio Manager", "Project Manager", "Team"],
  complexity: ["Low", "Medium", "High"]
};