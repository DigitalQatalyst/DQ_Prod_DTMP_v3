import { Monitor, Laptop, Brain, Shield, LucideIcon } from "lucide-react";

export interface ExecutionStream {
  id: string;
  name: string;
  acronym: string;
  icon: LucideIcon;
  color: string;
  description: string;
  features: string[];
  outcomes: string[];
}

export const executionStreams: ExecutionStream[] = [
  {
    id: "dxp",
    name: "Digital Experience Platform",
    acronym: "DXP",
    icon: Monitor,
    color: "text-blue-accent",
    description: "Orchestrate delivery across all digital touchpoints",
    features: [
      "Unified customer journeys",
      "Experience management and personalization",
    ],
    outcomes: ["Secure Foundations", "Customer Engagement", "Omnichannel Delivery"],
  },
  {
    id: "dws",
    name: "Digital Workspace Solutions",
    acronym: "DWS",
    icon: Laptop,
    color: "text-purple",
    description: "Measurable productivity across the organization",
    features: [
      "Employee experience and collaboration",
      "Knowledge management systems",
    ],
    outcomes: ["Productivity Gains", "Employee Satisfaction", "Collaboration Efficiency"],
  },
  {
    id: "dia",
    name: "Data, AI & Analytics",
    acronym: "DIA",
    icon: Brain,
    color: "text-pink",
    description: "Data pipelines, ML models, and analytics services",
    features: ["AI-driven insights and automation", "Unified data governance"],
    outcomes: ["AI/ML Capabilities", "Data Maturity", "Predictive Insights"],
  },
  {
    id: "sdo",
    name: "Secure DevOps Operations",
    acronym: "SDO",
    icon: Shield,
    color: "text-green",
    description: "Safe, fast delivery through the enterprise",
    features: [
      "Security controls and compliance",
      "Infrastructure patterns and automation",
    ],
    outcomes: ["CI/CD Maturity", "Security Posture", "Deployment Velocity"],
  },
];
