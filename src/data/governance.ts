import { Search, PenTool, Rocket, TrendingUp, LucideIcon } from "lucide-react";

export interface GovernancePhase {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
  route: string;
  ctaLabel: string;
}

export const governancePhases: GovernancePhase[] = [
  {
    id: "discern",
    name: "Discern",
    icon: Search,
    color: "text-blue-accent",
    bgColor: "bg-phase-discern-bg",
    description:
      "Request digital maturity assessments, access transformation insights, and build your knowledge base before designing your strategy.",
    route: "/marketplaces#discern-marketplaces",
    ctaLabel: "Explore Insights & Knowledge",
  },
  {
    id: "design",
    name: "Design",
    icon: PenTool,
    color: "text-purple",
    bgColor: "bg-phase-design-bg",
    description:
      "Define transformation strategies, reference architectures, and solution specifications aligned to your DBP.",
    route: "/marketplaces#design-marketplaces",
    ctaLabel: "Explore Design Tools",
  },
  {
    id: "deploy",
    name: "Deploy",
    icon: Rocket,
    color: "text-green",
    bgColor: "bg-phase-deploy-bg",
    description:
      "Execute transformation initiatives with structured governance and delivery support for build teams.",
    route: "/marketplaces#deploy-marketplaces",
    ctaLabel: "Launch Delivery Tools",
  },
  {
    id: "drive",
    name: "Drive",
    icon: TrendingUp,
    color: "text-orange",
    bgColor: "bg-phase-drive-bg",
    description:
      "Govern, track, and optimise transformation initiatives with stage-gate controls, portfolio health monitoring, and benefits realisation.",
    route: "/marketplaces#drive-marketplaces",
    ctaLabel: "Manage Initiatives",
  },
];
