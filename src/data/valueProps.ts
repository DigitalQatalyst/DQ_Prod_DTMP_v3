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
      "60% of requested resources delivered through pre-approved frameworks and reusable architecture assets.",
  },
  {
    id: "control",
    name: "Control",
    icon: DollarSign,
    color: "text-green",
    description:
      "Visibility across active technology initiatives enables smarter prioritisation, reduced duplication, and accountable spend.",
  },
  {
    id: "quality",
    name: "Quality",
    icon: CheckCircle,
    color: "text-blue-accent",
    description:
      "Resources, blueprints, and documents are validated by the EA Office before delivery for compliance and quality assurance.",
  },
  {
    id: "visibility",
    name: "Visibility",
    icon: Eye,
    color: "text-phase-drive",
    description:
      "Real-time portfolio views across initiatives, artefacts, lifecycle stages, and team progress support confident decision-making.",
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
  {
    value: "1",
    label: "Enterprise Architecture Platform",
    note: "One architecture direction",
  },
];
