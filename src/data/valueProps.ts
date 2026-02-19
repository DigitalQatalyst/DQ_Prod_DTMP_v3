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
    name: "Accelerate Transformation",
    icon: Zap,
    color: "text-orange",
    description:
      "Drive faster and more efficient change within your organization",
  },
  {
    id: "control",
    name: "Control Investment",
    icon: DollarSign,
    color: "text-green",
    description:
      "Ensure your investments are optimized and aligned with your business goals",
  },
  {
    id: "quality",
    name: "Ensure Quality Outcomes",
    icon: CheckCircle,
    color: "text-blue-accent",
    description:
      "Deliver measurable results that positively impact your business",
  },
  {
    id: "visibility",
    name: "Enterprise-Wide Visibility",
    icon: Eye,
    color: "text-purple",
    description:
      "Achieve clear visibility across all transformation initiatives",
  },
];

export interface Stat {
  value: string;
  label: string;
  note: string;
}

export const stats: Stat[] = [
  {
    value: "80%",
    label: "Requirements Ready",
    note: "Through self-serve templates",
  },
  {
    value: "4D",
    label: "Governance Model",
    note: "Discern → Design → Deploy → Drive",
  },
  {
    value: "4",
    label: "Execution Streams",
    note: "DXP, DWS, DIA, SDO",
  },
  {
    value: "1",
    label: "Digital Business Platform",
    note: "Unified target state",
  },
];
