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
    name: "DTMP Learning Center - Accelerate Your Transformation",
    description:
      "Develop transformation expertise through structured learning tracks and certifications tailored for your journey.",
    features: ["Courses & Curricula", "Learning Tracks", "Reviews"],
    serviceCount: 25,
    route: "/marketplaces/learning-center",
  },
  {
    id: "knowledge-center",
    phase: "Discern",
    icon: BookOpen,
    name: "DTMP Knowledge Center - Gain Insights",
    description:
      "Access transformation playbooks, best practices, and expert insights to guide your strategy.",
    features: ["Best Practices", "Testimonials", "Industry Playbooks", "Library"],
    serviceCount: 40,
    route: "/marketplaces/knowledge-center",
  },

  // DESIGN
  {
    id: "templates",
    phase: "Design",
    icon: FileText,
    name: "DTMP Templates - Streamline Documentation",
    description:
      "Generate governance-compliant documents quickly using AI-powered tools for policies, procedures, and application profiles.",
    features: [
      "Policy Reports",
      "Procedure Reports",
      "Application Profiles",
      "Strategy Docs",
      "Assessments",
      "Executive Summaries",
    ],
    serviceCount: 18,
    route: "/marketplaces/templates",
  },
  {
    id: "solution-specs",
    phase: "Design",
    icon: Layout,
    name: "DTMP Solution Specs - Design with Precision",
    description:
      "Access blueprint-led solution specifications to design robust solutions for your digital business platform.",
    features: ["Solution Specifications", "Architecture Diagrams", "Component Details"],
    serviceCount: 30,
    route: "/marketplaces/solution-specs",
  },

  // DEPLOY
  {
    id: "solution-build",
    phase: "Deploy",
    icon: Hammer,
    name: "DTMP Solution Build - Implement Faster",
    description:
      "Deploy ready-to-use solutions with proven integration patterns and production-ready implementations to accelerate your transformation.",
    features: ["Implementation Resources", "Code Samples", "Integration Patterns"],
    serviceCount: 14,
    route: "/marketplaces/solution-build",
  },

  // DRIVE
  {
    id: "lifecycle-management",
    phase: "Drive",
    icon: RefreshCw,
    name: "DTMP Lifecycle Management - Optimize Operations",
    description:
      "Track and optimize your application, project, and portfolio lifecycles to ensure continuous improvement and compliance.",
    features: ["Application Lifecycle", "Project Lifecycle", "Compliance Tracking"],
    serviceCount: 12,
    route: "/marketplaces/lifecycle-management",
  },
  {
    id: "portfolio-management",
    phase: "Drive",
    icon: Briefcase,
    name: "DTMP Portfolio Management - Centralize Oversight",
    description: "Gain centralized visibility and control over your application and project portfolios for better decision-making.",
    features: ["Application Portfolio", "Project Portfolio"],
    serviceCount: 11,
    route: "/marketplaces/portfolio-management",
  },
  {
    id: "digital-intelligence",
    phase: "Drive",
    icon: BarChart3,
    name: "DTMP Digital Intelligence - Make Smarter Decisions",
    description:
      "Leverage AI-powered insights and analytics to track maturity, optimize systems, and drive better transformation outcomes.",
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
    name: "DTMP Support Services - Get Expert Help",
    description: "Access technical support and expert consultancy to resolve challenges and accelerate your transformation success.",
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
