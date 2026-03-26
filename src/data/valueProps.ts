import { Zap, DollarSign, CheckCircle, Eye, LucideIcon } from "lucide-react";

export interface ValueProp {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

export const valueProps: ValueProp[] = [
  {
    id: "accelerate",
    name: "Accelerate",
    icon: Zap,
    color: "text-phase-design",
    description:
      "Reusable architecture assets and pre-approved frameworks remove rework — turning weeks of design into days without compromising governance.",
  },
  {
    id: "control",
    name: "Control",
    icon: DollarSign,
    color: "text-green",
    description:
      "Full visibility across active technology initiatives enables smarter prioritisation, eliminates duplication, and makes every architecture spend accountable.",
  },
  {
    id: "quality",
    name: "Quality",
    icon: CheckCircle,
    color: "text-blue-accent",
    description:
      "Every resource, blueprint, and document is validated by the EA Office before delivery — checked for compliance, coherence, and enterprise fit.",
  },
  {
    id: "visibility",
    name: "Visibility",
    icon: Eye,
    color: "text-phase-drive",
    description:
      "Real-time views across initiatives, artefacts, and lifecycle stages — so leadership always knows what to fund, accelerate, or pause.",
  },
];

export interface Stat {
  value: string;
  label: string;
  note: string;
}

export const stats: Stat[] = [
  {
    value: "4D",
    label: "Governance Model",
    note: "Discern, Design, Deploy, Drive",
  },
  {
    value: "4",
    label: "Execution Streams",
    note: "DXP, DWS, DIA, SDO",
  },
  {
    value: "6",
    label: "Integrated Marketplaces",
    note: "Governed service entry points",
  },
  {
    value: "7",
    label: "DEWA Divisions Served",
    note: "All major business domains",
  },
];
