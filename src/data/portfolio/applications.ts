import type { LucideIcon } from "lucide-react";
import { 
  GitCompare, 
  Activity, 
  DollarSign, 
  RefreshCw, 
  AlertTriangle, 
  Grid3x3, 
  ShieldAlert, 
  Cloud, 
  FileKey, 
  Network, 
  Star, 
  Shield, 
  Map, 
  Users, 
  Link, 
  HardDrive, 
  TrendingUp, 
  Trash2
} from "lucide-react";

export interface ApplicationPortfolioService {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
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
    icon: GitCompare,
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
    icon: Activity,
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
    icon: DollarSign,
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
    icon: RefreshCw,
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
    icon: AlertTriangle,
    category: "Risk Assessment",
    scope: "Enterprise",
    analysisType: "Technical",
    deliveryModel: "Assessment",
    updateFrequency: "Quarterly",
    complexity: "High",
    realtime: false,
    keyMetrics: ["Debt Score", "Remediation Cost", "Business Impact", "Priority"],
    integrationLevel: "CMDB Integrated"
  },
  {
    id: "capability-coverage-analysis",
    title: "Capability Coverage Analysis",
    description: "Map applications to business capabilities to identify gaps and overlaps",
    icon: Grid3x3,
    category: "Portfolio Analytics",
    scope: "Enterprise",
    analysisType: "Strategic",
    deliveryModel: "Workshop",
    updateFrequency: "On-demand",
    complexity: "High",
    realtime: false,
    keyMetrics: ["Coverage Score", "Capability Gaps", "Redundancy", "Investment Alignment"],
    integrationLevel: "Standalone"
  },
  {
    id: "vendor-risk-analysis",
    title: "Vendor & Technology Risk Analysis",
    description: "Assess risks related to application vendors, technologies, and dependencies",
    icon: ShieldAlert,
    category: "Risk Assessment",
    scope: "Enterprise",
    analysisType: "Risk",
    deliveryModel: "Report",
    updateFrequency: "Quarterly",
    complexity: "Medium",
    realtime: false,
    keyMetrics: ["Vendor Risk", "EOL Risk", "Concentration Risk", "Mitigation Status"],
    integrationLevel: "CMDB Integrated"
  },
  {
    id: "cloud-readiness-assessment",
    title: "Cloud Migration Readiness Assessment",
    description: "Evaluate application readiness for cloud migration with effort estimates",
    icon: Cloud,
    category: "Portfolio Analytics",
    scope: "Application",
    analysisType: "Technical",
    deliveryModel: "Assessment",
    updateFrequency: "On-demand",
    complexity: "High",
    realtime: false,
    keyMetrics: ["Readiness Score", "Migration Effort", "Cloud Fit", "Priority"],
    integrationLevel: "CMDB Integrated"
  },
  {
    id: "license-compliance-tracking",
    title: "License Compliance & Optimization",
    description: "Monitor software license usage, compliance, and optimization opportunities",
    icon: FileKey,
    category: "TCO Management",
    scope: "Enterprise",
    analysisType: "Financial",
    deliveryModel: "Dashboard",
    updateFrequency: "Real-time",
    complexity: "Medium",
    realtime: true,
    keyMetrics: ["Compliance Rate", "License Utilization", "Cost Savings", "Risk Exposure"],
    integrationLevel: "Full Integration"
  },
  {
    id: "application-dependency-mapping",
    title: "Application Dependency Mapping",
    description: "Visualize and analyze application dependencies and integration complexity",
    icon: Network,
    category: "Portfolio Analytics",
    scope: "Enterprise",
    analysisType: "Technical",
    deliveryModel: "Dashboard",
    updateFrequency: "Real-time",
    complexity: "High",
    realtime: true,
    keyMetrics: ["Dependency Count", "Integration Complexity", "Risk Score", "Critical Path"],
    integrationLevel: "Full Integration"
  },
  {
    id: "business-value-scoring",
    title: "Business Value Scoring Framework",
    description: "Quantitative framework to assess and score business value of each application",
    icon: Star,
    category: "Portfolio Analytics",
    scope: "Enterprise",
    analysisType: "Strategic",
    deliveryModel: "Workshop",
    updateFrequency: "Quarterly",
    complexity: "Medium",
    realtime: false,
    keyMetrics: ["Business Value Score", "Strategic Alignment", "User Satisfaction", "ROI"],
    integrationLevel: "Standalone"
  },
  {
    id: "security-posture-monitoring",
    title: "Application Security Posture Monitoring",
    description: "Continuous monitoring of security vulnerabilities and compliance across portfolio",
    icon: Shield,
    category: "Health Monitoring",
    scope: "Enterprise",
    analysisType: "Risk",
    deliveryModel: "Dashboard",
    updateFrequency: "Real-time",
    complexity: "High",
    realtime: true,
    keyMetrics: ["Security Score", "Vulnerabilities", "Compliance Rate", "Remediation SLA"],
    integrationLevel: "APM Integrated"
  },
  {
    id: "modernization-roadmap",
    title: "Application Modernization Roadmap",
    description: "Strategic roadmap for modernizing legacy applications with prioritization",
    icon: Map,
    category: "Application Rationalization",
    scope: "Enterprise",
    analysisType: "Strategic",
    deliveryModel: "Consulting",
    updateFrequency: "On-demand",
    complexity: "High",
    realtime: false,
    keyMetrics: ["Modernization Priority", "Effort Estimate", "Business Impact", "Timeline"],
    integrationLevel: "CMDB Integrated"
  },
  {
    id: "user-adoption-analytics",
    title: "Application User Adoption Analytics",
    description: "Track user adoption, usage patterns, and satisfaction across applications",
    icon: Users,
    category: "Health Monitoring",
    scope: "Enterprise",
    analysisType: "Operational",
    deliveryModel: "Dashboard",
    updateFrequency: "Daily",
    complexity: "Medium",
    realtime: false,
    keyMetrics: ["Adoption Rate", "Active Users", "Feature Usage", "Satisfaction Score"],
    integrationLevel: "Full Integration"
  },
  {
    id: "integration-health-monitoring",
    title: "Integration Health Monitoring",
    description: "Monitor health and performance of application integrations and APIs",
    icon: Link,
    category: "Health Monitoring",
    scope: "Enterprise",
    analysisType: "Operational",
    deliveryModel: "Dashboard",
    updateFrequency: "Real-time",
    complexity: "Medium",
    realtime: true,
    keyMetrics: ["Integration Uptime", "API Performance", "Error Rate", "SLA Compliance"],
    integrationLevel: "APM Integrated"
  },
  {
    id: "disaster-recovery-readiness",
    title: "Disaster Recovery Readiness Assessment",
    description: "Evaluate DR/BC readiness of critical applications with gap analysis",
    icon: HardDrive,
    category: "Risk Assessment",
    scope: "Enterprise",
    analysisType: "Risk",
    deliveryModel: "Assessment",
    updateFrequency: "Quarterly",
    complexity: "High",
    realtime: false,
    keyMetrics: ["DR Readiness", "RTO/RPO Gaps", "Testing Status", "Criticality"],
    integrationLevel: "CMDB Integrated"
  },
  {
    id: "portfolio-benchmarking",
    title: "Industry Portfolio Benchmarking",
    description: "Compare your application portfolio against industry peers and best practices",
    icon: TrendingUp,
    category: "Portfolio Analytics",
    scope: "Enterprise",
    analysisType: "Strategic",
    deliveryModel: "Report",
    updateFrequency: "Annually",
    complexity: "Medium",
    realtime: false,
    keyMetrics: ["Benchmark Score", "Industry Position", "Best Practice Gap", "Maturity Level"],
    integrationLevel: "Standalone"
  },
  {
    id: "decommission-planning",
    title: "Application Decommissioning Planning",
    description: "Structured approach to safely decommission applications with minimal disruption",
    icon: Trash2,
    category: "Lifecycle Management",
    scope: "Application",
    analysisType: "Operational",
    deliveryModel: "Consulting",
    updateFrequency: "On-demand",
    complexity: "High",
    realtime: false,
    keyMetrics: ["Decom Readiness", "Impact Analysis", "Cost Savings", "Risk Mitigation"],
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