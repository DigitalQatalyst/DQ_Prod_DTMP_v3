import { Building2, Crown, PenTool, Users, RefreshCw, Shield, LucideIcon } from "lucide-react";

export interface Contributor {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  role: string;
  description: string;
  contributions: string[];
}

export const contributors: Contributor[] = [
  {
    id: "to",
    name: "Transformation Office",
    icon: Building2,
    color: "text-orange",
    role: "Enterprise TO Director",
    description:
      "Central leadership that drives strategy and execution across the transformation journey",
    contributions: [
      "Enterprise Alignment",
      "DBP Tracking & Oversight",
      "Compliance Enforcement",
    ],
  },
  {
    id: "strategy",
    name: "Strategy & Executive Leadership",
    icon: Crown,
    color: "text-purple",
    role: "CEO & Executive Leadership",
    description:
      "Guiding long-term vision and ensuring strategic alignment with business goals",
    contributions: [
      "Strategic Visibility",
      "Portfolio Oversight",
      "Investment Decisions",
    ],
  },
  {
    id: "architects",
    name: "Business & Technology Architects",
    icon: PenTool,
    color: "text-blue-accent",
    role: "Enterprise & Solution Architects",
    description:
      "Designing the right architecture to support your business needs",
    contributions: [
      "Architecture Governance",
      "Blueprint Design",
      "Standards Contribution",
    ],
  },
  {
    id: "project-teams",
    name: "Project & Product Teams",
    icon: Users,
    color: "text-green",
    role: "Program Managers, Product Owners",
    description: "Bringing agile project management and product development to life",
    contributions: ["Project Execution", "Asset Delivery", "Milestone Tracking"],
  },
  {
    id: "lifecycle-ops",
    name: "Lifecycle Operations Teams",
    icon: RefreshCw,
    color: "text-pink",
    role: "Operations, Insights, ADM",
    description:
      "Ensuring that your systems are built to last and continually evolve",
    contributions: [
      "Operational Feedback",
      "Continuous Improvement",
      "Performance Insights",
    ],
  },
  {
    id: "secdevops",
    name: "Security DevOps Enablement",
    icon: Shield,
    color: "text-indigo-600",
    role: "SecDevOps, Support Teams",
    description:
      "Ensuring robust, secure development processes at every stage",
    contributions: ["Security Policies", "Delivery Automation", "User Enablement"],
  },
];
