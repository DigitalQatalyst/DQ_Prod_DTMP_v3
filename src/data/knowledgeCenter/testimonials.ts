export interface Testimonial {
  id: string;
  organization: string;
  industry: string;
  title: string;
  quote: string;
  speaker: {
    name: string;
    role: string;
  };
  outcomes: string[];
  phase: string;
  verified: boolean;
  organizationType: string;
  outcomeType: string[];
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-001",
    organization: "GlobalBank Corporation",
    industry: "Financial Services",
    title: "40% Improvement in Digital Maturity in 12 Months",
    quote: "The DBP framework transformed how we approach digital initiatives. Moving from siloed projects to a unified platform mindset delivered measurable results across 8 capability domains.",
    speaker: {
      name: "Maria Chen",
      role: "Chief Digital Officer"
    },
    outcomes: [
      "40% maturity increase",
      "$12M cost savings",
      "95% user adoption"
    ],
    phase: "Drive",
    verified: true,
    organizationType: "Enterprise (10k+ employees)",
    outcomeType: ["Cost Reduction", "Efficiency Gain"],
    date: "January 2024"
  },
  {
    id: "testimonial-002",
    organization: "MediCare Health Systems",
    industry: "Healthcare",
    title: "Unified 15 Applications into Cohesive DBP",
    quote: "We consolidated 15 fragmented applications into a unified digital platform, reducing operational costs by 35% while improving patient and clinician experiences.",
    speaker: {
      name: "Dr. James Patterson",
      role: "VP of Digital Health"
    },
    outcomes: [
      "35% cost reduction",
      "15 apps consolidated",
      "Improved experiences"
    ],
    phase: "Deploy",
    verified: true,
    organizationType: "Enterprise (10k+ employees)",
    outcomeType: ["Cost Reduction", "Customer Experience"],
    date: "December 2023"
  },
  {
    id: "testimonial-003",
    organization: "ShopSmart Retail",
    industry: "Retail",
    title: "Seamless Omnichannel Experience Across 12 Channels",
    quote: "The 4D model guided us from fragmented touchpoints to a truly unified omnichannel experience. Customer satisfaction scores increased 28% within 6 months.",
    speaker: {
      name: "Lisa Wong",
      role: "Head of Digital Experience"
    },
    outcomes: [
      "28% CSAT increase",
      "12 channels unified",
      "Revenue growth"
    ],
    phase: "Deploy",
    verified: true,
    organizationType: "Mid-Market (1k-10k)",
    outcomeType: ["Customer Experience", "Revenue Growth"],
    date: "February 2024"
  },
  {
    id: "testimonial-004",
    organization: "IndustryCo Manufacturing",
    industry: "Manufacturing",
    title: "50% Efficiency Gain Through Digital Twin Implementation",
    quote: "Implementing end-to-end digital operations with the DBP framework delivered a 50% improvement in operational efficiency and dramatically reduced downtime.",
    speaker: {
      name: "Robert Kim",
      role: "COO"
    },
    outcomes: [
      "50% efficiency gain",
      "Digital twin deployed",
      "Reduced downtime"
    ],
    phase: "Drive",
    verified: true,
    organizationType: "Enterprise (10k+ employees)",
    outcomeType: ["Efficiency Gain"],
    date: "November 2023"
  },
  {
    id: "testimonial-005",
    organization: "Metro City Government",
    industry: "Public Sector",
    title: "Transformed Citizen Services with Integrated Platform",
    quote: "Our digital transformation improved citizen satisfaction by 42% and reduced service delivery times by 60% through platform integration.",
    speaker: {
      name: "Amanda Foster",
      role: "Chief Technology Officer"
    },
    outcomes: [
      "42% satisfaction increase",
      "60% faster delivery",
      "Platform integration"
    ],
    phase: "Deploy",
    verified: true,
    organizationType: "Public Sector",
    outcomeType: ["Customer Experience", "Efficiency Gain"],
    date: "January 2024"
  },
  {
    id: "testimonial-006",
    organization: "TechStart Solutions",
    industry: "Technology",
    title: "From Startup to Scalable Platform in 18 Months",
    quote: "The capability-based planning approach helped us build a scalable platform from day one. We grew 300% without technical debt.",
    speaker: {
      name: "David Park",
      role: "CTO & Co-Founder"
    },
    outcomes: [
      "300% growth",
      "Zero technical debt",
      "Scalable architecture"
    ],
    phase: "Design",
    verified: false,
    organizationType: "SMB (<1k employees)",
    outcomeType: ["Revenue Growth"],
    date: "October 2023"
  },
  {
    id: "testimonial-007",
    organization: "UniversityTech Education",
    industry: "Education",
    title: "Digital Learning Platform Serving 50,000 Students",
    quote: "We built a comprehensive digital learning platform that seamlessly supports 50,000 students across hybrid learning models.",
    speaker: {
      name: "Dr. Sarah Mitchell",
      role: "VP of Academic Technology"
    },
    outcomes: [
      "50k students served",
      "Hybrid learning enabled",
      "96% uptime"
    ],
    phase: "Drive",
    verified: true,
    organizationType: "Mid-Market (1k-10k)",
    outcomeType: ["Customer Experience"],
    date: "September 2023"
  },
  {
    id: "testimonial-008",
    organization: "EnergyFlow Utilities",
    industry: "Energy & Utilities",
    title: "Smart Grid Integration Reduced Outages by 45%",
    quote: "Digital platform integration enabled predictive maintenance and reduced power outages by 45%, significantly improving customer satisfaction.",
    speaker: {
      name: "Michael Torres",
      role: "Chief Operating Officer"
    },
    outcomes: [
      "45% fewer outages",
      "Predictive maintenance",
      "Customer satisfaction"
    ],
    phase: "Drive",
    verified: true,
    organizationType: "Enterprise (10k+ employees)",
    outcomeType: ["Customer Experience", "Efficiency Gain"],
    date: "December 2023"
  },
  {
    id: "testimonial-009",
    organization: "SecureBank Financial",
    industry: "Financial Services",
    title: "Zero-Trust Security Across Enterprise Platform",
    quote: "Implementing zero-trust architecture across our DBP reduced security incidents by 78% while enabling faster feature delivery.",
    speaker: {
      name: "Jennifer Lee",
      role: "CISO"
    },
    outcomes: [
      "78% fewer incidents",
      "Zero-trust implemented",
      "Faster delivery"
    ],
    phase: "Deploy",
    verified: true,
    organizationType: "Enterprise (10k+ employees)",
    outcomeType: ["Risk Mitigation"],
    date: "February 2024"
  },
  {
    id: "testimonial-010",
    organization: "HealthPlus Insurance",
    industry: "Healthcare",
    title: "API-First Platform Enabled Partner Ecosystem",
    quote: "Our API-first platform strategy enabled integration with 50+ healthcare partners, creating new revenue streams worth $25M annually.",
    speaker: {
      name: "Thomas Anderson",
      role: "Chief Innovation Officer"
    },
    outcomes: [
      "$25M new revenue",
      "50+ partners integrated",
      "API-first success"
    ],
    phase: "Deploy",
    verified: true,
    organizationType: "Mid-Market (1k-10k)",
    outcomeType: ["Revenue Growth"],
    date: "November 2023"
  },
  {
    id: "testimonial-011",
    organization: "LogiChain Corp",
    industry: "Manufacturing",
    title: "Real-Time Supply Chain Visibility Platform",
    quote: "End-to-end supply chain visibility reduced delays by 52% and improved inventory accuracy to 99.2%.",
    speaker: {
      name: "Patricia Garcia",
      role: "VP of Operations"
    },
    outcomes: [
      "52% fewer delays",
      "99.2% inventory accuracy",
      "Real-time visibility"
    ],
    phase: "Drive",
    verified: false,
    organizationType: "Mid-Market (1k-10k)",
    outcomeType: ["Efficiency Gain"],
    date: "January 2024"
  },
  {
    id: "testimonial-012",
    organization: "CitiServe Municipal",
    industry: "Public Sector",
    title: "Mobile-First Citizen Engagement Platform",
    quote: "Our mobile-first platform increased citizen engagement by 65% and reduced call center volume by 40%.",
    speaker: {
      name: "Kevin White",
      role: "Director of Digital Services"
    },
    outcomes: [
      "65% more engagement",
      "40% fewer calls",
      "Mobile-first success"
    ],
    phase: "Deploy",
    verified: true,
    organizationType: "Public Sector",
    outcomeType: ["Customer Experience", "Cost Reduction"],
    date: "October 2023"
  },
  {
    id: "testimonial-013",
    organization: "RetailMax Group",
    industry: "Retail",
    title: "Personalization Engine Boosted Conversion 33%",
    quote: "AI-powered personalization across our digital platform increased conversion rates by 33% and average order value by 24%.",
    speaker: {
      name: "Linda Martinez",
      role: "Chief Marketing Officer"
    },
    outcomes: [
      "33% conversion increase",
      "24% higher AOV",
      "AI personalization"
    ],
    phase: "Drive",
    verified: true,
    organizationType: "Enterprise (10k+ employees)",
    outcomeType: ["Revenue Growth"],
    date: "December 2023"
  },
  {
    id: "testimonial-014",
    organization: "FinTech Innovations",
    industry: "Financial Services",
    title: "Cloud-Native Platform Reduced Time-to-Market 70%",
    quote: "Migration to cloud-native architecture reduced feature delivery time by 70% while improving system reliability.",
    speaker: {
      name: "Christopher Lee",
      role: "Head of Engineering"
    },
    outcomes: [
      "70% faster delivery",
      "Cloud-native migration",
      "Improved reliability"
    ],
    phase: "Deploy",
    verified: false,
    organizationType: "SMB (<1k employees)",
    outcomeType: ["Efficiency Gain"],
    date: "November 2023"
  },
  {
    id: "testimonial-015",
    organization: "WellCare Hospitals",
    industry: "Healthcare",
    title: "Patient Portal Improved Satisfaction by 48%",
    quote: "Our integrated patient portal improved satisfaction scores by 48% and reduced administrative overhead by $3.5M annually.",
    speaker: {
      name: "Dr. Angela Rodriguez",
      role: "Chief Medical Information Officer"
    },
    outcomes: [
      "48% satisfaction boost",
      "$3.5M savings",
      "Portal integration"
    ],
    phase: "Drive",
    verified: true,
    organizationType: "Enterprise (10k+ employees)",
    outcomeType: ["Customer Experience", "Cost Reduction"],
    date: "January 2024"
  }
];

export const testimonialsFilters = {
  organizationType: ["Enterprise (10k+ employees)", "Mid-Market (1k-10k)", "SMB (<1k employees)", "Public Sector", "Non-Profit"],
  industry: ["Financial Services", "Healthcare", "Retail", "Manufacturing", "Technology", "Public Sector", "Education"],
  transformationPhase: ["Discern", "Design", "Deploy", "Drive", "All Phases"],
  outcomeType: ["Cost Reduction", "Revenue Growth", "Efficiency Gain", "Customer Experience", "Employee Experience", "Risk Mitigation"],
  verificationStatus: ["Verified", "All"],
  datePublished: ["Last month", "Last 3 months", "Last 6 months", "Last year", "All time"]
};
