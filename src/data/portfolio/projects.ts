import type { LucideIcon } from "lucide-react";
import { 
  LayoutDashboard, 
  Activity, 
  Users, 
  DollarSign, 
  ShieldAlert, 
  GitBranch, 
  TrendingUp, 
  Gauge, 
  Target, 
  Inbox, 
  GitCompare, 
  CheckCircle, 
  BookOpen
} from "lucide-react";

export interface ProjectPortfolioService {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
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
    icon: LayoutDashboard,
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
    icon: Activity,
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
    icon: Users,
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
    icon: DollarSign,
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
    icon: ShieldAlert,
    category: "Risk Management",
    portfolioType: "All Projects",
    projectPhase: "All Phases",
    deliveryModel: "Dashboard",
    updateFrequency: "Weekly",
    complexity: "High",
    realtime: false,
    keyMetrics: ["Risk Count", "Exposure Value", "Mitigation Status", "Top Risks"],
    reportingLevel: "Portfolio Manager"
  },
  {
    id: "dependency-management",
    title: "Cross-Project Dependency Management",
    description: "Identify and manage dependencies between projects to reduce conflicts",
    icon: GitBranch,
    category: "Delivery Analytics",
    portfolioType: "Transformation Projects",
    projectPhase: "Planning",
    deliveryModel: "Tool",
    updateFrequency: "Real-time",
    complexity: "High",
    realtime: true,
    keyMetrics: ["Dependency Count", "Critical Path", "Bottlenecks", "Conflict Risk"],
    reportingLevel: "Portfolio Manager"
  },
  {
    id: "benefits-realization-tracking",
    title: "Benefits Realization Tracking",
    description: "Track and measure actual benefits realized against projected benefits",
    icon: TrendingUp,
    category: "Delivery Analytics",
    portfolioType: "Transformation Projects",
    projectPhase: "Closure",
    deliveryModel: "Report",
    updateFrequency: "Quarterly",
    complexity: "Medium",
    realtime: false,
    keyMetrics: ["Benefits Achieved", "ROI Realized", "Value Gap", "Time to Value"],
    reportingLevel: "Executive"
  },
  {
    id: "agile-portfolio-metrics",
    title: "Agile Portfolio Metrics Dashboard",
    description: "Track agile metrics across multiple teams and projects",
    icon: Gauge,
    category: "Delivery Analytics",
    portfolioType: "IT Projects",
    projectPhase: "Execution",
    deliveryModel: "Dashboard",
    updateFrequency: "Real-time",
    complexity: "Medium",
    realtime: true,
    keyMetrics: ["Velocity", "Sprint Health", "Cycle Time", "Throughput"],
    reportingLevel: "Team"
  },
  {
    id: "portfolio-prioritization",
    title: "Portfolio Prioritization Framework",
    description: "Data-driven framework for prioritizing projects based on value, risk, and strategic alignment",
    icon: Target,
    category: "Portfolio Dashboard",
    portfolioType: "All Projects",
    projectPhase: "Initiation",
    deliveryModel: "Assessment",
    updateFrequency: "Quarterly",
    complexity: "High",
    realtime: false,
    keyMetrics: ["Strategic Alignment", "Value Score", "Risk Score", "Priority Rank"],
    reportingLevel: "Executive"
  },
  {
    id: "project-intake-pipeline",
    title: "Project Intake & Approval Pipeline",
    description: "Streamline project requests with automated intake, scoring, and approval workflows",
    icon: Inbox,
    category: "Portfolio Dashboard",
    portfolioType: "All Projects",
    projectPhase: "Initiation",
    deliveryModel: "Tool",
    updateFrequency: "Real-time",
    complexity: "Medium",
    realtime: true,
    keyMetrics: ["Pending Requests", "Approval Rate", "Time to Decision", "Queue Length"],
    reportingLevel: "Portfolio Manager"
  },
  {
    id: "stakeholder-engagement-tracking",
    title: "Stakeholder Engagement Tracking",
    description: "Monitor stakeholder engagement levels and satisfaction across projects",
    icon: Users,
    category: "Delivery Analytics",
    portfolioType: "Transformation Projects",
    projectPhase: "All Phases",
    deliveryModel: "Dashboard",
    updateFrequency: "Weekly",
    complexity: "Low",
    realtime: false,
    keyMetrics: ["Engagement Score", "Satisfaction", "Communication Frequency", "Issue Resolution"],
    reportingLevel: "Project Manager"
  },
  {
    id: "portfolio-scenario-planning",
    title: "Portfolio Scenario Planning Tool",
    description: "Model different portfolio scenarios to optimize resource allocation and outcomes",
    icon: GitCompare,
    category: "Portfolio Dashboard",
    portfolioType: "All Projects",
    projectPhase: "Planning",
    deliveryModel: "Tool",
    updateFrequency: "On-demand",
    complexity: "High",
    realtime: false,
    keyMetrics: ["Scenario Count", "Optimization Score", "Resource Impact", "Value Projection"],
    reportingLevel: "Executive"
  },
  {
    id: "milestone-delivery-tracking",
    title: "Milestone & Deliverable Tracking",
    description: "Track key milestones and deliverables across the entire project portfolio",
    icon: CheckCircle,
    category: "Project Health Tracking",
    portfolioType: "All Projects",
    projectPhase: "Execution",
    deliveryModel: "Dashboard",
    updateFrequency: "Real-time",
    complexity: "Low",
    realtime: true,
    keyMetrics: ["Milestones Completed", "On-time Delivery", "Deliverable Quality", "Dependencies"],
    reportingLevel: "Project Manager"
  },
  {
    id: "lessons-learned-repository",
    title: "Lessons Learned Repository",
    description: "Capture and share lessons learned across projects to improve future delivery",
    icon: BookOpen,
    category: "Delivery Analytics",
    portfolioType: "All Projects",
    projectPhase: "Closure",
    deliveryModel: "Tool",
    updateFrequency: "On-demand",
    complexity: "Low",
    realtime: false,
    keyMetrics: ["Lessons Captured", "Reuse Rate", "Improvement Impact", "Knowledge Sharing"],
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