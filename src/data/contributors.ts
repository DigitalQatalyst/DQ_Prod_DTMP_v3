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
      "Own and govern the enterprise platform, standards, and KPI tracking across all DEWA divisions.",
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
      "Drive DEWA 2030 and Net-Zero 2050 through informed architecture investment and transformation oversight.",
    contributions: [
      "Enterprise portfolio governance",
      "Cross-division investment prioritisation",
      "Digital DEWA programme oversight",
      "Net-Zero milestone tracking",
    ],
    ctaLabel: "View Executive Intelligence",
    ctaRoute: "/stage2/intelligence/overview",
  },
  {
    id: "division-architects",
    name: "Division EA & Architecture Leads",
    icon: PenTool,
    color: "text-green",
    role: "EA Leads and Solution Architects",
    description:
      "Apply corporate standards locally, contribute blueprints, and align divisional initiatives to enterprise architecture.",
    contributions: [
      "Apply enterprise standards divisionally",
      "Contribute to shared blueprint library",
      "Review divisional solutions",
      "Escalate cross-division dependencies",
    ],
    ctaLabel: "Access Architecture Workspace",
    ctaRoute: "/stage2/specs/overview",
  },
  {
    id: "digital-ai",
    name: "Digital DEWA & AI Teams",
    icon: Bot,
    color: "text-phase-drive",
    role: "Moro Hub, Rammas, Virtual Engineer",
    description:
      "Govern AI architecture and cognitive services while aligning data and automation models to enterprise standards.",
    contributions: [
      "AI architecture governance",
      "Virtual Engineer deployment oversight",
      "Cognitive service integration standards",
      "Data and analytics architecture alignment",
    ],
    ctaLabel: "Access AI & Digital Architecture",
    ctaRoute: "/marketplaces/digital-intelligence",
  },
  {
    id: "project-delivery",
    name: "Project & Delivery Teams",
    icon: Users,
    color: "text-blue-accent",
    role: "Programme and Delivery Teams",
    description:
      "Access resources, submit architecture requests, and deliver initiatives aligned to enterprise EA requirements.",
    contributions: [
      "Request solution specs and blueprints",
      "Submit document generation requests",
      "Track initiative progress vs standards",
      "Access build and delivery resources",
    ],
    ctaLabel: "Access Project Workspace",
    ctaRoute: "/stage2/document-studio/overview",
  },
  {
    id: "ops-security",
    name: "Operations & Security Teams",
    icon: Shield,
    color: "text-phase-drive",
    role: "IT/OT, SecDevOps, Lifecycle Ops",
    description:
      "Govern secure delivery, automation fitness, and IT/OT convergence architecture across operational technology.",
    contributions: [
      "IT/OT convergence governance",
      "Automation fitness assessments",
      "Security architecture compliance",
      "Operational technology lifecycle",
    ],
    ctaLabel: "Access Operations Console",
    ctaRoute: "/marketplaces/support-services",
  },
];
