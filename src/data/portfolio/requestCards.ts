import { RequestCardConfig } from "@/types/requests";

export const portfolioRequestCards: RequestCardConfig[] = [
  {
    serviceId: "application-rationalization",
    cards: [
      {
        id: "app-rat-deep-dive",
        serviceId: "application-rationalization",
        title: "Deep-Dive Rationalization Report",
        description: "Detailed analysis of all applications with retirement and consolidation recommendations, cost-benefit analysis, and implementation roadmap.",
        category: "deep-dive-analysis",
        estimatedTimeline: "3-4 weeks",
        icon: "FileText",
        requestType: "Deep-Dive Rationalization Report"
      },
      {
        id: "app-rat-workshop",
        serviceId: "application-rationalization",
        title: "Rationalization Workshop",
        description: "Facilitated scoring session with stakeholders to prioritize rationalization actions and build consensus.",
        category: "workshop",
        estimatedTimeline: "1-2 days",
        icon: "Users",
        requestType: "Rationalization Workshop"
      },
      {
        id: "app-rat-exec-summary",
        serviceId: "application-rationalization",
        title: "Executive Summary Report",
        description: "High-level findings and recommendations for leadership, focusing on strategic opportunities and cost savings.",
        category: "deep-dive-analysis",
        estimatedTimeline: "1-2 weeks",
        icon: "TrendingUp",
        requestType: "Executive Summary Report"
      },
      {
        id: "app-rat-roadmap",
        serviceId: "application-rationalization",
        title: "Implementation Roadmap",
        description: "Detailed plan for executing rationalization recommendations with timelines, resources, and risk mitigation.",
        category: "consulting",
        estimatedTimeline: "2-3 weeks",
        icon: "Map",
        requestType: "Implementation Roadmap"
      }
    ]
  },
  {
    serviceId: "license-compliance-tracking",
    cards: [
      {
        id: "lic-audit-report",
        serviceId: "license-compliance-tracking",
        title: "Compliance Audit Report",
        description: "Full audit of license compliance across all software vendors with risk assessment and remediation plan.",
        category: "deep-dive-analysis",
        estimatedTimeline: "2-3 weeks",
        icon: "Shield",
        requestType: "Compliance Audit Report"
      },
      {
        id: "lic-optimization",
        serviceId: "license-compliance-tracking",
        title: "Optimization Analysis",
        description: "Identify cost-saving opportunities through license optimization, right-sizing, and vendor consolidation.",
        category: "deep-dive-analysis",
        estimatedTimeline: "2-3 weeks",
        icon: "DollarSign",
        requestType: "Optimization Analysis"
      },
      {
        id: "lic-vendor-support",
        serviceId: "license-compliance-tracking",
        title: "Vendor Negotiation Support",
        description: "Expert support for upcoming license renewals, including market analysis and negotiation strategies.",
        category: "consulting",
        estimatedTimeline: "Varies",
        icon: "Handshake",
        requestType: "Vendor Negotiation Support"
      },
      {
        id: "lic-workshop",
        serviceId: "license-compliance-tracking",
        title: "Compliance Workshop",
        description: "Train your team on license management best practices and compliance requirements.",
        category: "workshop",
        estimatedTimeline: "Half-day",
        icon: "GraduationCap",
        requestType: "Compliance Workshop"
      }
    ]
  },
  {
    serviceId: "tco-optimization",
    cards: [
      {
        id: "tco-analysis",
        serviceId: "tco-optimization",
        title: "Detailed TCO Analysis Report",
        description: "Comprehensive cost analysis across all portfolio dimensions with optimization recommendations and ROI projections.",
        category: "deep-dive-analysis",
        estimatedTimeline: "3-4 weeks",
        icon: "Calculator",
        requestType: "Detailed TCO Analysis Report"
      },
      {
        id: "tco-roadmap",
        serviceId: "tco-optimization",
        title: "Cost Reduction Roadmap",
        description: "Prioritized plan for reducing total cost of ownership with quick wins and long-term initiatives.",
        category: "consulting",
        estimatedTimeline: "2-3 weeks",
        icon: "TrendingDown",
        requestType: "Cost Reduction Roadmap"
      },
      {
        id: "tco-presentation",
        serviceId: "tco-optimization",
        title: "Executive Cost Presentation",
        description: "Board-ready presentation of TCO findings with compelling visualizations and recommendations.",
        category: "custom-deliverable",
        estimatedTimeline: "1-2 weeks",
        icon: "Presentation",
        requestType: "Executive Cost Presentation"
      },
      {
        id: "tco-workshop",
        serviceId: "tco-optimization",
        title: "TCO Workshop",
        description: "Facilitate cost optimization strategy session with stakeholders to identify and prioritize initiatives.",
        category: "workshop",
        estimatedTimeline: "1 day",
        icon: "Users",
        requestType: "TCO Workshop"
      }
    ]
  },
  {
    serviceId: "technical-debt-assessment",
    cards: [
      {
        id: "tech-debt-report",
        serviceId: "technical-debt-assessment",
        title: "Technical Debt Report",
        description: "Quantified technical debt assessment with remediation priorities based on business risk and impact.",
        category: "deep-dive-analysis",
        estimatedTimeline: "3-4 weeks",
        icon: "AlertTriangle",
        requestType: "Technical Debt Report"
      },
      {
        id: "tech-debt-roadmap",
        serviceId: "technical-debt-assessment",
        title: "Remediation Roadmap",
        description: "Detailed plan for addressing technical debt with phased approach and resource requirements.",
        category: "consulting",
        estimatedTimeline: "2-3 weeks",
        icon: "Map",
        requestType: "Remediation Roadmap"
      },
      {
        id: "tech-debt-workshop",
        serviceId: "technical-debt-assessment",
        title: "Risk Assessment Workshop",
        description: "Prioritize technical debt based on business risk with cross-functional stakeholders.",
        category: "workshop",
        estimatedTimeline: "Half-day",
        icon: "Users",
        requestType: "Risk Assessment Workshop"
      },
      {
        id: "tech-debt-arch-review",
        serviceId: "technical-debt-assessment",
        title: "Architecture Review",
        description: "Expert review of application architecture with modernization recommendations.",
        category: "consulting",
        estimatedTimeline: "2-3 weeks",
        icon: "Layers",
        requestType: "Architecture Review"
      }
    ]
  },
  {
    serviceId: "application-health-dashboard",
    cards: [
      {
        id: "app-health-trend",
        serviceId: "application-health-dashboard",
        title: "Health Trend Analysis Report",
        description: "Analysis of health trends over time with predictive insights and early warning indicators.",
        category: "deep-dive-analysis",
        estimatedTimeline: "1-2 weeks",
        icon: "TrendingUp",
        requestType: "Health Trend Analysis Report"
      },
      {
        id: "app-health-action",
        serviceId: "application-health-dashboard",
        title: "Remediation Action Plan",
        description: "Detailed plan to address health issues with specific actions, owners, and timelines.",
        category: "consulting",
        estimatedTimeline: "2-3 weeks",
        icon: "CheckCircle",
        requestType: "Remediation Action Plan"
      },
      {
        id: "app-health-workshop",
        serviceId: "application-health-dashboard",
        title: "Health Review Workshop",
        description: "Review health metrics with stakeholders and develop improvement strategies.",
        category: "workshop",
        estimatedTimeline: "Half-day",
        icon: "Users",
        requestType: "Health Review Workshop"
      },
      {
        id: "app-health-custom",
        serviceId: "application-health-dashboard",
        title: "Custom Health Metrics",
        description: "Configure custom health indicators tailored to your portfolio and business priorities.",
        category: "consulting",
        estimatedTimeline: "2-3 weeks",
        icon: "Settings",
        requestType: "Custom Health Metrics"
      }
    ]
  },
  {
    serviceId: "project-health-dashboard",
    cards: [
      {
        id: "proj-health-report",
        serviceId: "project-health-dashboard",
        title: "Portfolio Health Report",
        description: "Executive summary of project portfolio health with key insights and recommendations.",
        category: "deep-dive-analysis",
        estimatedTimeline: "1-2 weeks",
        icon: "FileText",
        requestType: "Portfolio Health Report"
      },
      {
        id: "proj-risk-analysis",
        serviceId: "project-health-dashboard",
        title: "At-Risk Project Analysis",
        description: "Deep-dive into projects showing health concerns with root cause analysis and recovery plans.",
        category: "deep-dive-analysis",
        estimatedTimeline: "1-2 weeks",
        icon: "AlertCircle",
        requestType: "At-Risk Project Analysis"
      },
      {
        id: "proj-optimization-workshop",
        serviceId: "project-health-dashboard",
        title: "Portfolio Optimization Workshop",
        description: "Optimize project portfolio for better outcomes through prioritization and resource reallocation.",
        category: "workshop",
        estimatedTimeline: "1 day",
        icon: "Users",
        requestType: "Portfolio Optimization Workshop"
      },
      {
        id: "proj-pmo-review",
        serviceId: "project-health-dashboard",
        title: "PMO Best Practices Review",
        description: "Review and improve project management practices with industry best practices.",
        category: "consulting",
        estimatedTimeline: "2-3 weeks",
        icon: "Award",
        requestType: "PMO Best Practices Review"
      }
    ]
  },
  {
    serviceId: "application-risk-compliance",
    cards: [
      {
        id: "app-risk-assessment",
        serviceId: "application-risk-compliance",
        title: "Risk Assessment Report",
        description: "Comprehensive risk assessment across security, compliance, and operational dimensions.",
        category: "deep-dive-analysis",
        estimatedTimeline: "2-3 weeks",
        icon: "Shield",
        requestType: "Risk Assessment Report"
      },
      {
        id: "app-risk-mitigation",
        serviceId: "application-risk-compliance",
        title: "Risk Mitigation Plan",
        description: "Detailed plan to address identified risks with controls and monitoring strategies.",
        category: "consulting",
        estimatedTimeline: "2-3 weeks",
        icon: "ShieldCheck",
        requestType: "Risk Mitigation Plan"
      },
      {
        id: "app-compliance-workshop",
        serviceId: "application-risk-compliance",
        title: "Compliance Workshop",
        description: "Train team on compliance requirements and risk management best practices.",
        category: "workshop",
        estimatedTimeline: "Half-day",
        icon: "GraduationCap",
        requestType: "Compliance Workshop"
      }
    ]
  },
  {
    serviceId: "application-dependencies",
    cards: [
      {
        id: "app-dep-analysis",
        serviceId: "application-dependencies",
        title: "Dependency Analysis Report",
        description: "Detailed analysis of application dependencies with impact assessment and recommendations.",
        category: "deep-dive-analysis",
        estimatedTimeline: "2-3 weeks",
        icon: "GitBranch",
        requestType: "Dependency Analysis Report"
      },
      {
        id: "app-dep-impact",
        serviceId: "application-dependencies",
        title: "Impact Assessment",
        description: "Assess impact of changes or retirements on dependent systems and business processes.",
        category: "consulting",
        estimatedTimeline: "1-2 weeks",
        icon: "AlertTriangle",
        requestType: "Impact Assessment"
      },
      {
        id: "app-dep-workshop",
        serviceId: "application-dependencies",
        title: "Dependency Mapping Workshop",
        description: "Collaborative session to map and validate application dependencies with stakeholders.",
        category: "workshop",
        estimatedTimeline: "1 day",
        icon: "Users",
        requestType: "Dependency Mapping Workshop"
      }
    ]
  },
  {
    serviceId: "project-risk-compliance",
    cards: [
      {
        id: "proj-risk-report",
        serviceId: "project-risk-compliance",
        title: "Risk Register Report",
        description: "Comprehensive project risk register with mitigation strategies and monitoring plan.",
        category: "deep-dive-analysis",
        estimatedTimeline: "1-2 weeks",
        icon: "AlertTriangle",
        requestType: "Risk Register Report"
      },
      {
        id: "proj-risk-workshop",
        serviceId: "project-risk-compliance",
        title: "Risk Management Workshop",
        description: "Facilitate risk identification and mitigation planning with project teams.",
        category: "workshop",
        estimatedTimeline: "Half-day",
        icon: "Users",
        requestType: "Risk Management Workshop"
      },
      {
        id: "proj-compliance-review",
        serviceId: "project-risk-compliance",
        title: "Compliance Review",
        description: "Review project compliance with governance standards and regulatory requirements.",
        category: "consulting",
        estimatedTimeline: "1-2 weeks",
        icon: "ShieldCheck",
        requestType: "Compliance Review"
      }
    ]
  },
  {
    serviceId: "project-dependencies",
    cards: [
      {
        id: "proj-dep-analysis",
        serviceId: "project-dependencies",
        title: "Dependency Analysis",
        description: "Analyze cross-project dependencies and resource conflicts with resolution recommendations.",
        category: "deep-dive-analysis",
        estimatedTimeline: "1-2 weeks",
        icon: "GitBranch",
        requestType: "Dependency Analysis"
      },
      {
        id: "proj-resource-optimization",
        serviceId: "project-dependencies",
        title: "Resource Optimization Plan",
        description: "Optimize resource allocation across projects to resolve conflicts and improve utilization.",
        category: "consulting",
        estimatedTimeline: "2-3 weeks",
        icon: "Users",
        requestType: "Resource Optimization Plan"
      },
      {
        id: "proj-dep-workshop",
        serviceId: "project-dependencies",
        title: "Dependency Workshop",
        description: "Map project dependencies and develop coordination strategies with project managers.",
        category: "workshop",
        estimatedTimeline: "Half-day",
        icon: "Users",
        requestType: "Dependency Workshop"
      }
    ]
  }
];

export const getRequestCardsForService = (serviceId: string) => {
  const config = portfolioRequestCards.find(c => c.serviceId === serviceId);
  return config?.cards || [];
};
