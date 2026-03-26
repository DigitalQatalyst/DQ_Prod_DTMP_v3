import { Search, PenTool, Rocket, TrendingUp, LucideIcon } from "lucide-react";

export interface GovernancePhase {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  ctaLabel: string;
  route: string;
}

export const governancePhases: GovernancePhase[] = [
  {
    id: "discern",
    name: "Discern",
    icon: Search,
    color: "text-blue-accent",
    bgColor: "bg-phase-discern-bg",
    subtitle: "Understand & Assess",
    description:
      "Build intelligence on current capabilities, technology landscape, maturity, and transformation gaps across all divisions.",
    deliverables: [
      "EA maturity assessments per division",
      "Technology portfolio reviews",
      "Capability gap analysis",
      "Digital DEWA programme intelligence",
    ],
    ctaLabel: "View Discern Marketplaces",
    route: "/marketplaces#discern",
  },
  {
    id: "design",
    name: "Design",
    icon: PenTool,
    color: "text-phase-design",
    bgColor: "bg-phase-design-bg",
    subtitle: "Define & Architect",
    description:
      "Define target-state capabilities, cross-division standards, and architecture blueprints aligned to 2030 and Net-Zero 2050.",
    deliverables: [
      "Enterprise Business Capabilities Canvas",
      "Cross-division architecture standards",
      "Digital DEWA solution blueprints",
      "Operating model design",
    ],
    ctaLabel: "View Design Marketplaces",
    route: "/marketplaces#design",
  },
  {
    id: "deploy",
    name: "Deploy",
    icon: Rocket,
    color: "text-green",
    bgColor: "bg-phase-deploy-bg",
    subtitle: "Build & Activate",
    description:
      "Operationalise architecture by deploying solutions and capabilities division by division with governed delivery.",
    deliverables: [
      "Platform deployments per division",
      "Initiative delivery governance",
      "Smart Grid activation tracking",
      "AI and automation readiness",
    ],
    ctaLabel: "View Deploy Marketplaces",
    route: "/marketplaces#deploy",
  },
  {
    id: "drive",
    name: "Drive",
    icon: TrendingUp,
    color: "text-phase-drive",
    bgColor: "bg-phase-drive-bg",
    subtitle: "Govern & Optimise",
    description:
      "Drive adoption across divisions, enforce standards, and measure investment outcomes against strategic targets.",
    deliverables: [
      "Enterprise EA compliance monitoring",
      "Cross-division governance",
      "Net-Zero 2050 progress tracking",
      "Investment performance measurement",
    ],
    ctaLabel: "View Drive Marketplaces",
    route: "/marketplaces#drive",
  },
];
