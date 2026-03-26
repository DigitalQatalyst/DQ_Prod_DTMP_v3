import {
  Building2,
  Crown,
  PenTool,
  Bot,
  Users,
  Shield,
  LucideIcon,
} from "lucide-react";

export interface Contributor {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  role: string;
  description: string;
  contributions: string[];
  ctaLabel: string;
  ctaRoute: string;
}

export const contributors: Contributor[] = [
  {
    id: "corporate-ea",
    name: "Corporate EA Office",
    icon: Building2,
    color: "text-phase-design",
    role: "Enterprise Governance Owner",
    description:
      "The authority behind DTMP — setting the standards, governing the platform, and ensuring every architecture decision across DEWA is traceable and compliant.",
    contributions: [
      "Set and enforce enterprise EA standards",
      "Manage cross-division architecture repository",
      "Track transformation KPIs enterprise-wide",
      "Report Net-Zero architecture alignment",
    ],
    ctaLabel: "Enter Corporate EA Dashboard",
    ctaRoute: "/stage3/dashboard",
  },
  {
    id: "executive",
    name: "Executive & Strategy Leadership",
    icon: Crown,
    color: "text-blue-accent",
    role: "CEO, CDO, CIO, CTO, Strategy Office",
    description:
      "Where architecture decisions become strategic investments — portfolio oversight, cross-division prioritisation, and Net-Zero 2050 milestone governance.",
    contributions: [
      "Enterprise portfolio governance",
      "Cross-division investment prioritisation",
      "Transformation programme oversight",
      "Net-Zero milestone tracking",
    ],
    ctaLabel: "View Portfolio",
    ctaRoute: "/marketplaces/portfolio-management",
  },
  {
    id: "division-architects",
    name: "Division EA & Architecture Leads",
    icon: PenTool,
    color: "text-green",
    role: "EA Leads and Solution Architects",
    description:
      "The connective tissue between corporate standards and divisional delivery — translating enterprise mandates into governed, reusable architecture at the division level.",
    contributions: [
      "Apply enterprise standards divisionally",
      "Contribute to shared blueprint library",
      "Review and approve divisional solutions",
      "Escalate cross-division dependencies",
    ],
    ctaLabel: "Browse Knowledge Centre",
    ctaRoute: "/marketplaces/knowledge-center",
  },
  {
    id: "innovation-ai",
    name: "Innovation & AI Teams",
    icon: Bot,
    color: "text-phase-drive",
    role: "Virtual Engineer, Rammas, AI Platforms",
    description:
      "Governing the architecture of DEWA's most forward-looking programmes — AI platforms, Virtual Engineer, and cognitive services — all aligned to enterprise standards.",
    contributions: [
      "AI platform architecture governance",
      "Virtual Engineer deployment oversight",
      "Cognitive service integration standards",
      "Data and analytics architecture alignment",
    ],
    ctaLabel: "View Digital Intelligence",
    ctaRoute: "/marketplaces/digital-intelligence",
  },
  {
    id: "project-delivery",
    name: "Project & Delivery Teams",
    icon: Users,
    color: "text-blue-accent",
    role: "Programme and Delivery Teams",
    description:
      "The teams that turn architecture decisions into delivered outcomes — governed through DTMP from request to build to lifecycle.",
    contributions: [
      "Request solution specs and blueprints",
      "Submit document generation requests",
      "Track initiative progress vs standards",
      "Access build and delivery resources",
    ],
    ctaLabel: "View Lifecycle Dashboard",
    ctaRoute: "/marketplaces/lifecycle-management",
  },
  {
    id: "ops-security",
    name: "Operations & Security Teams",
    icon: Shield,
    color: "text-phase-drive",
    role: "IT/OT, SecDevOps, Lifecycle Ops",
    description:
      "Keeping what's built secure and operational — governing IT/OT convergence, automation fitness, and security architecture across DEWA's operational technology estate.",
    contributions: [
      "IT/OT convergence governance",
      "Automation fitness assessments",
      "Security architecture compliance",
      "Operational technology lifecycle",
    ],
    ctaLabel: "Access Support Services",
    ctaRoute: "/marketplaces/support-services",
  },
];
