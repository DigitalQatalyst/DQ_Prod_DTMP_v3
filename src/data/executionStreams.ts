import { Sun, BatteryCharging, Bot, Building2, LucideIcon } from "lucide-react";

export interface ExecutionStream {
  id: string;
  name: string;
  acronym: string;
  icon: LucideIcon;
  color: string;
  description: string;
  outcomes: string[];
  ctaLabel: string;
  route: string;
}

export const executionStreams: ExecutionStream[] = [
  {
    id: "solar",
    name: "Solar Power & Clean Energy",
    acronym: "PILLAR 01",
    icon: Sun,
    color: "text-blue-accent",
    description:
      "Govern architecture enabling clean-energy infrastructure, smart metering, grid integration, and monitoring aligned to DEWA's 2030 clean energy targets.",
    outcomes: [
      "Energy asset lifecycle governance",
      "IT/OT integration for solar assets",
      "Clean energy analytics architecture",
      "Net-Zero 2050 measurement frameworks",
    ],
    ctaLabel: "View Solar & Energy Architecture",
    route: "/marketplaces/digital-intelligence",
  },
  {
    id: "storage",
    name: "Energy Storage & Grid Resilience",
    acronym: "PILLAR 02",
    icon: BatteryCharging,
    color: "text-phase-design",
    description:
      "Govern architecture for energy storage systems, Smart Grid infrastructure, and resilience operations across Dubai.",
    outcomes: [
      "Smart Grid architecture governance",
      "Storage integration blueprints",
      "Grid automation standards",
      "Transmission-distribution alignment",
    ],
    ctaLabel: "View Grid & Storage Architecture",
    route: "/marketplaces/lifecycle-management",
  },
  {
    id: "ai",
    name: "AI, Automation & Cognitive Services",
    acronym: "PILLAR 03",
    icon: Bot,
    color: "text-green",
    description:
      "Govern AI architecture behind Rammas, Virtual Engineer, and next-generation automation for cognitive utility operations.",
    outcomes: [
      "AI platform architecture governance",
      "Virtual Engineer deployment architecture",
      "Conversational AI blueprints",
      "Cognitive integration standards",
    ],
    ctaLabel: "View AI Architecture Governance",
    route: "/marketplaces/digital-intelligence",
  },
  {
    id: "moro",
    name: "Digital Services & Moro Hub",
    acronym: "PILLAR 04",
    icon: Building2,
    color: "text-phase-drive",
    description:
      "Govern digital-services architecture enabling Services 360, smart-city integration, and Moro Hub data-centre alignment.",
    outcomes: [
      "Digital services platform architecture",
      "Services 360 integration governance",
      "Moro Hub architecture alignment",
      "Smart city interface standards",
    ],
    ctaLabel: "View Digital Services Architecture",
    route: "/marketplaces/support-services",
  },
];
