import {
  GraduationCap,
  BookOpen,
  FileText,
  Layout,
  Hammer,
  RefreshCw,
  Briefcase,
  BarChart3,
  HelpCircle,
  LucideIcon,
} from "lucide-react";

export type Phase = "Discern" | "Design" | "Deploy" | "Drive";

export interface Marketplace {
  id: string;
  phase: Phase;
  icon: LucideIcon;
  name: string;
  description: string;
  features: string[];
  serviceCount: number;
  route: string;
}

export const marketplaces: Marketplace[] = [
  // DISCERN
  {
    id: "learning-center",
    phase: "Discern",
    icon: GraduationCap,
    name: "DTMP Learning Centre",
    description:
      "Structured pathways for EA literacy, digital transformation fundamentals, and DEWA architecture standards across all divisions.",
    features: ["Courses & Curricula", "Learning Tracks", "Reviews"],
    serviceCount: 25,
    route: "/marketplaces/learning-center",
  },
  {
    id: "knowledge-center",
    phase: "Discern",
    icon: BookOpen,
    name: "DTMP Knowledge Centre",
    description:
      "DEWA-specific architecture knowledge, governance references, strategy documents, standards, and published design outputs accessible enterprise-wide.",
    features: ["Best Practices", "Design Reports", "Architecture Standards", "Governance Frameworks"],
    serviceCount: 89,
    route: "/marketplaces/knowledge-center",
  },

  // DESIGN
  {
    id: "document-studio",
    phase: "Design",
    icon: FileText,
    name: "DTMP Document Studio",
    description:
      "AI-powered document generation fulfilled by the Corporate EA Office with defined SLAs for all DEWA divisions.",
    features: [
      "Application Profiles",
      "Assessments",
    ],
    serviceCount: 8,
    route: "/marketplaces/document-studio",
  },
  {
    id: "solution-specs",
    phase: "Design",
    icon: Layout,
    name: "DTMP Solution Specs",
    description:
      "Standardised architecture blueprints and solution specifications applicable across all DEWA divisions.",
    features: ["Solution Specifications", "Architecture Diagrams", "Component Details"],
    serviceCount: 30,
    route: "/marketplaces/solution-specs",
  },

  // DEPLOY
  {
    id: "solution-build",
    phase: "Deploy",
    icon: Hammer,
    name: "DTMP Solution Build",
    description:
      "Build resources, delivery capacity, and implementation support for projects across all DEWA divisions.",
    features: ["Implementation Resources", "Code Samples", "Integration Patterns"],
    serviceCount: 14,
    route: "/marketplaces/solution-build",
  },

  // DRIVE
  {
    id: "lifecycle-management",
    phase: "Drive",
    icon: RefreshCw,
    name: "DTMP Lifecycle Management",
    description:
      "Govern initiatives through stage gates, compliance checkpoints, and architecture reviews across enterprise programmes.",
    features: ["Application Lifecycle", "Project Lifecycle", "Compliance Tracking"],
    serviceCount: 12,
    route: "/marketplaces/lifecycle-management",
  },
  {
    id: "portfolio-management",
    phase: "Drive",
    icon: Briefcase,
    name: "DTMP Portfolio Management",
    description: "Centralized oversight for application and project portfolios",
    features: ["Application Portfolio", "Project Portfolio"],
    serviceCount: 11,
    route: "/marketplaces/portfolio-management",
  },
  {
    id: "digital-intelligence",
    phase: "Drive",
    icon: BarChart3,
    name: "DTMP Digital Intelligence",
    description:
      "AI-powered maturity insights, system analytics, and project intelligence",
    features: [
      "Systems Portfolio & Lifecycle",
      "Digital Maturity",
      "Projects Portfolio & Lifecycle",
    ],
    serviceCount: 7,
    route: "/marketplaces/digital-intelligence",
  },
  {
    id: "support-services",
    phase: "Drive",
    icon: HelpCircle,
    name: "DTMP Support Services",
    description: "Technical support and expert consultancy services",
    features: ["Technical Support", "Expert Consultancy"],
    serviceCount: 14,
    route: "/marketplaces/support-services",
  },
];

export const getMarketplacesByPhase = (phase: Phase): Marketplace[] => {
  return marketplaces.filter((m) => m.phase === phase);
};

export const phases: Phase[] = ["Discern", "Design", "Deploy", "Drive"];

export const phaseColors: Record<Phase, { bg: string; text: string; badge: string }> = {
  Discern: {
    bg: "bg-phase-discern-bg",
    text: "text-phase-discern",
    badge: "badge-discern",
  },
  Design: {
    bg: "bg-phase-design-bg",
    text: "text-phase-design",
    badge: "badge-design",
  },
  Deploy: {
    bg: "bg-phase-deploy-bg",
    text: "text-phase-deploy",
    badge: "badge-deploy",
  },
  Drive: {
    bg: "bg-phase-drive-bg",
    text: "text-phase-drive",
    badge: "badge-drive",
  },
};
