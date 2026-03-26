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
    id: "smart-grid",
    name: "Smart Grid 2021–2035",
    acronym: "PROGRAMME 01",
    icon: BatteryCharging,
    color: "text-blue-accent",
    description:
      "AED 7 billion investment in grid intelligence, IT/OT convergence, advanced metering infrastructure, and predictive network management. DTMP governs the architecture ensuring vendor interoperability, data sovereignty, and alignment across Transmission and Distribution.",
    outcomes: [
      "IT/OT convergence architecture standards",
      "Advanced metering infrastructure governance",
      "Grid automation & resilience blueprints",
      "Transmission-distribution alignment",
    ],
    ctaLabel: "View in Portfolio",
    route: "/marketplaces/portfolio-management",
  },
  {
    id: "solar-park",
    name: "Mohammed Bin Rashid Solar Park",
    acronym: "PROGRAMME 02",
    icon: Sun,
    color: "text-phase-design",
    description:
      "The world's largest single-site solar park — targeting 8,000 MW by 2030. DTMP governs the technology architecture for renewable integration, grid connectivity, performance monitoring, and alignment to DEWA's 36% clean energy target.",
    outcomes: [
      "Renewable integration architecture",
      "Clean energy analytics platform",
      "Grid connectivity standards",
      "Net-Zero 2050 measurement frameworks",
    ],
    ctaLabel: "View in Portfolio",
    route: "/marketplaces/portfolio-management",
  },
  {
    id: "ai-cognitive",
    name: "AI & Cognitive Operations",
    acronym: "PROGRAMME 03",
    icon: Bot,
    color: "text-green",
    description:
      "Rammas has processed over 60 million customer interactions. Virtual Engineer automates field operations. DTMP governs the AI governance layer, integration architecture, and cognitive platform standards that make enterprise-scale AI deployable and auditable.",
    outcomes: [
      "AI platform architecture governance",
      "Virtual Engineer deployment standards",
      "Conversational AI integration blueprints",
      "Responsible AI compliance frameworks",
    ],
    ctaLabel: "View in Portfolio",
    route: "/marketplaces/portfolio-management",
  },
  {
    id: "digital-customer",
    name: "Digital Customer & Services 360",
    acronym: "PROGRAMME 04",
    icon: Building2,
    color: "text-phase-drive",
    description:
      "1.27 million customer accounts served through fully digital channels. Services 360 and Moro Hub underpin DEWA's smart-city commitments. DTMP governs the omnichannel integration architecture, customer data standards, and platform interoperability across all service touchpoints.",
    outcomes: [
      "Services 360 integration architecture",
      "Omnichannel platform governance",
      "Customer data standards & sovereignty",
      "Smart city interface alignment",
    ],
    ctaLabel: "View in Portfolio",
    route: "/marketplaces/portfolio-management",
  },
];
