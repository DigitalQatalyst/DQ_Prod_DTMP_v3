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
  {
    id: "learning-center",
    phase: "Discern",
    icon: GraduationCap,
    name: "DTMP Learning Center",
    description:
      "Develop transformation expertise through structured learning programs and practical capability tracks.",
    features: ["Courses & Curricula", "Learning Tracks", "Reviews"],
    serviceCount: 25,
    route: "/marketplaces/learning-center",
  },
  {
    id: "knowledge-center",
    phase: "Discern",
    icon: BookOpen,
    name: "DTMP Knowledge Center",
    description:
      "Explore best practices, architecture standards, and transformation playbooks to inform your strategy.",
    features: ["Best Practices", "Testimonials", "Industry Playbooks", "Library"],
    serviceCount: 40,
    route: "/marketplaces/knowledge-center",
  },
  {
    id: "document-studio",
    phase: "Design",
    icon: FileText,
    name: "DTMP Document Studio",
    description:
      "Request AI-generated assessments and application profiles tailored to your organisational context.",
    features: ["Application Profiles", "Assessments"],
    serviceCount: 26,
    route: "/marketplaces/document-studio",
  },
  {
    id: "solution-specs",
    phase: "Design",
    icon: Layout,
    name: "DTMP Solution Specs",
    description:
      "Browse and request solution blueprints, reference architectures, and implementation specifications.",
    features: ["Solution Specifications", "Architecture Diagrams", "Component Details"],
    serviceCount: 30,
    route: "/marketplaces/solution-specs",
  },
  {
    id: "solution-build",
    phase: "Deploy",
    icon: Hammer,
    name: "DTMP Solution Build",
    description:
      "Deploy pre-built solutions or request custom builds from expert delivery teams.",
    features: ["Pre-Built Solutions", "Custom Builds", "Delivery Teams", "Build Tracking"],
    serviceCount: 24,
    route: "/marketplaces/solution-build",
  },
  {
    id: "lifecycle-management",
    phase: "Drive",
    icon: RefreshCw,
    name: "DTMP Lifecycle Management",
    description:
      "Govern transformation initiatives with structured stage gates, progress tracking, and delivery oversight.",
    features: ["Application Lifecycle", "Project Lifecycle", "Compliance Tracking"],
    serviceCount: 12,
    route: "/marketplaces/lifecycle-management",
  },
  {
    id: "portfolio-management",
    phase: "Drive",
    icon: Briefcase,
    name: "DTMP Portfolio Management",
    description:
      "Manage your application and project portfolio with real-time health dashboards and delivery analytics.",
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
      "Access digital maturity dashboards, portfolio analytics, and transformation performance metrics.",
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
