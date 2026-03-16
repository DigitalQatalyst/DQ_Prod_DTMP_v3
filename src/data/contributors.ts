import { Building2, Crown, PenTool, Users, RefreshCw, Shield, LucideIcon } from "lucide-react";

export interface Contributor {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  role: string;
  description: string;
  contributions: string[];
  capabilities: string[];
  ctaLabel: string;
  ctaRoute: string;
}

export const contributors: Contributor[] = [
  {
    id: "to",
    name: "Transformation Office",
    icon: Building2,
    color: "text-orange",
    role: "Enterprise TO Director",
    description:
      "Drive strategic alignment and ensure DBP governance across all initiatives.",
    contributions: [
      "Enterprise Alignment",
      "DBP Tracking & Oversight",
      "Compliance Enforcement",
    ],
    capabilities: ["TO Operations", "Portfolio Oversight", "SLA Governance"],
    ctaLabel: "Go to TO Dashboard",
    ctaRoute: "/stage3/dashboard",
  },
  {
    id: "strategy",
    name: "Strategy & Executive Leadership",
    icon: Crown,
    color: "text-purple",
    role: "CDO, Strategy Leads, Analysts",
    description:
      "Strategy analysts use DTMP to access transformation insights, request assessments, and build evidence for strategic decisions.",
    contributions: [
      "Strategic Visibility",
      "Portfolio Oversight",
      "Investment Decisions",
    ],
    capabilities: ["Digital Intelligence", "Knowledge Center", "Document Studio Assessments"],
    ctaLabel: "Explore Insights",
    ctaRoute: "/marketplaces/digital-intelligence?tab=digital-maturity",
  },
  {
    id: "architects",
    name: "Business & Technology Architects",
    icon: PenTool,
    color: "text-blue-accent",
    role: "Enterprise & Solution Architects",
    description:
      "Design and govern platform blueprints and architecture standards.",
    contributions: [
      "Architecture Governance",
      "Blueprint Design",
      "Standards Contribution",
    ],
    capabilities: ["Solution Specs", "Knowledge Center", "Blueprints"],
    ctaLabel: "Explore Design Resources",
    ctaRoute: "/marketplaces/solution-specs",
  },
  {
    id: "project-teams",
    name: "Project & Product Teams",
    icon: Users,
    color: "text-green",
    role: "Program Managers, Product Owners",
    description: "Deliver measurable assets and capabilities into DBP.",
    contributions: ["Project Execution", "Asset Delivery", "Milestone Tracking"],
    capabilities: ["Portfolio Management", "Lifecycle Management", "Document Studio"],
    ctaLabel: "Manage My Projects",
    ctaRoute: "/marketplaces/portfolio-management?tab=project-portfolio",
  },
  {
    id: "lifecycle-ops",
    name: "Lifecycle Operations Teams",
    icon: RefreshCw,
    color: "text-pink",
    role: "Operations, Insights, ADM",
    description:
      "Contribute continuous improvements and operational feedback.",
    contributions: [
      "Operational Feedback",
      "Continuous Improvement",
      "Performance Insights",
    ],
    capabilities: ["Lifecycle Tracking", "Operational Analytics", "Compliance Checks"],
    ctaLabel: "Open Lifecycle Workspace",
    ctaRoute: "/marketplaces/lifecycle-management",
  },
  {
    id: "secdevops",
    name: "Security DevOps Enablement",
    icon: Shield,
    color: "text-indigo-600",
    role: "SecDevOps, Support Teams",
    description:
      "Ensure security, delivery automation, and user enablement.",
    contributions: ["Security Policies", "Delivery Automation", "User Enablement"],
    capabilities: ["Support Services", "Secure Delivery", "Operational Guardrails"],
    ctaLabel: "Access Secure Operations",
    ctaRoute: "/marketplaces/solution-build",
  },
];
