// Sample detail data for 24/7 Platform Support
export const platform24x7SupportDetail = {
  id: "24x7-platform-support",
  title: "24/7 Platform Support",
  type: "Platform Support",
  slaLevel: "Critical",
  responseTime: "15 min response",
  deliveryModel: "Remote",

  // About Tab
  overview:
    "24/7 Platform Support provides round-the-clock technical assistance for all DBP platform components. Our dedicated support team is available every hour of every day to ensure your critical digital platforms remain operational and performant. Whether it's troubleshooting production issues, answering technical questions, or providing guidance on platform features, our experts are ready to assist.",
  whatsIncluded: [
    "24/7/365 availability with guaranteed 15-minute response time",
    "Multi-channel support (phone, email, chat, ticketing system)",
    "Dedicated support team familiar with your environment",
    "Remote troubleshooting and issue resolution",
    "Escalation to engineering teams for critical issues",
    "Proactive monitoring alerts and notifications",
    "Monthly support reports and trend analysis",
    "Access to knowledge base and self-service portal",
  ],
  idealFor: [
    "Production DBP platform environments",
    "Mission-critical digital services requiring high availability",
    "Organizations with global operations across time zones",
    "Platforms supporting customer-facing applications",
    "Teams requiring immediate technical assistance",
  ],
  valueProposition:
    "With 24/7 Platform Support, you eliminate the risk of extended downtime and ensure business continuity. Our average issue resolution time is under 2 hours for critical issues, and our first-call resolution rate exceeds 75%. Organizations using our 24/7 support experience 40% less downtime compared to standard business-hours support.",
  supportedPlatforms: [
    "DBP (Digital Business Platform)",
    "DXP (Digital Experience Platform)",
    "DWS (Digital Workplace Solutions)",
    "DIA (Digital Integration Architecture)",
    "SDO (Service Delivery Operations)",
  ],

  // Coverage & SLA Tab
  coverageDetails: {
    availability: "24 hours a day, 7 days a week, 365 days a year",
    holidays: "Full coverage including public holidays",
    languageSupport: "English (primary), Arabic (limited hours)",
    geographicCoverage: "Global support with follow-the-sun model",
  },
  slaCommitments: [
    {
      severity: "Critical (P1)",
      definition:
        "Production system down, complete loss of service, critical security breach",
      responseTime: "15 minutes",
      resolutionTarget: "4 hours",
      updateFrequency: "Every 30 minutes",
      escalation: "Immediate escalation to senior engineers and management",
    },
    {
      severity: "High (P2)",
      definition: "Major functionality impaired, significant performance degradation",
      responseTime: "30 minutes",
      resolutionTarget: "8 hours",
      updateFrequency: "Every 2 hours",
      escalation: "Escalation to senior engineers if not resolved in 4 hours",
    },
    {
      severity: "Medium (P3)",
      definition: "Minor functionality issue, workaround available",
      responseTime: "2 hours",
      resolutionTarget: "24 hours",
      updateFrequency: "Daily",
      escalation: "Standard escalation path",
    },
    {
      severity: "Low (P4)",
      definition:
        "General questions, documentation requests, enhancement requests",
      responseTime: "4 hours",
      resolutionTarget: "5 business days",
      updateFrequency: "As needed",
      escalation: "Not applicable",
    },
  ],
  escalationProcedure: [
    {
      level: "Level 1 - Frontline Support",
      description: "Initial contact point, handles routine issues and questions",
      availability: "24/7",
    },
    {
      level: "Level 2 - Senior Engineers",
      description: "Complex technical issues, platform expertise required",
      availability: "24/7 for P1/P2, business hours for P3/P4",
    },
    {
      level: "Level 3 - Product Engineering",
      description: "Product defects, architectural issues, custom development",
      availability: "Business hours, on-call for P1",
    },
    {
      level: "Level 4 - Management Escalation",
      description: "Service-level breaches, complex stakeholder issues",
      availability: "On-demand for critical situations",
    },
  ],
  performanceMetrics: {
    averageResponseTime: "8 minutes (well below 15-minute SLA)",
    firstCallResolution: "76%",
    customerSatisfaction: "4.7/5.0",
    averageResolutionTime: "1.8 hours for P1 incidents",
    slaCompliance: "99.2%",
  },

  // How It Works Tab
  requestProcess: [
    {
      step: "Submit Request",
      description: "Create a support ticket through portal, email, phone, or chat",
      channels: [
        "Support Portal: support.dtmp.com (recommended)",
        "Email: support@dtmp.com",
        "Phone: +971-4-SUPPORT (24/7 hotline)",
        "Chat: Available in support portal",
      ],
    },
    {
      step: "Automatic Triage",
      description: "System automatically assigns severity and routes to appropriate team",
      timing: "Immediate (AI-powered classification)",
    },
    {
      step: "Initial Response",
      description: "Support engineer acknowledges ticket and begins investigation",
      timing: "Within SLA timeframe (15 min for P1, 30 min for P2, etc.)",
    },
    {
      step: "Diagnosis & Resolution",
      description: "Engineer works to identify root cause and implement solution",
      updates: "Regular updates per severity level commitments",
    },
    {
      step: "Resolution & Verification",
      description: "Solution implemented and verified with customer",
      validation: "Customer confirmation required for ticket closure",
    },
    {
      step: "Post-Incident Review",
      description: "For P1 incidents, detailed post-incident report provided",
      deliverable: "Root cause analysis and prevention recommendations",
    },
  ],
  communicationChannels: [
    {
      channel: "Support Portal",
      description:
        "Primary channel for ticket submission, tracking, and knowledge base access",
      availability: "24/7",
      bestFor: "All severity levels, historical tracking",
    },
    {
      channel: "Phone Hotline",
      description: "Direct voice communication with support engineers",
      availability: "24/7",
      bestFor: "P1/P2 incidents requiring immediate assistance",
    },
    {
      channel: "Email",
      description: "support@dtmp.com for ticket creation and updates",
      availability: "24/7 (monitored continuously)",
      bestFor: "Detailed descriptions, attachments, non-urgent issues",
    },
    {
      channel: "Live Chat",
      description: "Real-time chat with support engineers through portal",
      availability: "24/7",
      bestFor: "Quick questions, real-time troubleshooting",
    },
    {
      channel: "Slack Integration",
      description: "Dedicated Slack channel for large enterprise customers",
      availability: "24/7 (for premium customers)",
      bestFor: "Ongoing collaboration, quick questions",
    },
  ],
  ticketLifecycle: {
    statuses: [
      "New - Ticket created, awaiting assignment",
      "Assigned - Engineer allocated to ticket",
      "In Progress - Active investigation/resolution",
      "Waiting on Customer - Additional information needed",
      "Waiting on Engineering - Escalated to product team",
      "Resolved - Solution implemented, awaiting verification",
      "Closed - Issue resolved and verified",
    ],
    customerActions: [
      "Provide additional information when requested",
      "Verify proposed solutions in test environment",
      "Confirm issue resolution before closure",
      "Provide feedback on support experience",
    ],
  },

  // Team & Expertise Tab
  supportTeam: {
    size: "45 engineers across global locations",
    locations: [
      "Dubai (primary)",
      "London (EMEA)",
      "Singapore (APAC)",
      "New York (Americas)",
    ],
    followTheSun: "Seamless handoffs ensure 24/7 coverage without gaps",
    teamStructure: [
      "15 Level 1 Support Engineers",
      "20 Level 2 Senior Engineers",
      "8 Level 3 Platform Specialists",
      "2 Support Managers",
    ],
  },
  expertiseAreas: [
    "DBP platform architecture and components",
    "Cloud infrastructure (AWS, Azure, GCP)",
    "Container orchestration (Kubernetes, Docker)",
    "API gateway and integration middleware",
    "Database systems (PostgreSQL, MongoDB, Oracle)",
    "Observability and monitoring tools",
    "Security and compliance frameworks",
    "DevOps tools and CI/CD pipelines",
  ],
  certifications: [
    "AWS Certified Solutions Architect",
    "Azure Solutions Architect Expert",
    "Certified Kubernetes Administrator (CKA)",
    "ITIL 4 Foundation",
    "Certified Information Security Manager (CISM)",
  ],
  teamProfiles: [
    {
      role: "Support Manager",
      name: "Ahmed Al-Mansouri",
      experience: "15+ years in enterprise IT support",
      expertise: "Support operations, team management, customer success",
      availability: "Business hours + on-call for escalations",
    },
    {
      role: "Senior Platform Engineer",
      name: "Priya Sharma",
      experience: "10+ years in platform engineering and support",
      expertise: "DBP architecture, Kubernetes, cloud infrastructure",
      availability: "24/7 rotation",
    },
    {
      role: "Integration Specialist",
      name: "Carlos Mendez",
      experience: "8+ years in API and integration technologies",
      expertise: "API gateways, microservices, event-driven architecture",
      availability: "24/7 rotation",
    },
  ],
  continuousImprovement:
    "Our support team undergoes monthly training on new platform features, emerging technologies, and customer service excellence. We conduct quarterly knowledge-sharing sessions where engineers present solutions to complex problems, building our collective expertise.",

  // Getting Started Tab
  prerequisites: [
    "Active DBP platform subscription",
    "Designated technical contacts registered in support portal",
    "Basic environment information documented (URLs, versions, configurations)",
    "Access credentials for support engineers (read-only preferred)",
    "Network connectivity for remote troubleshooting (VPN, bastion host, etc.)",
  ],
  onboardingProcess: [
    {
      phase: "Account Setup",
      duration: "1 day",
      activities: [
        "Create support portal accounts for technical contacts",
        "Configure notification preferences (email, SMS, Slack)",
        "Set up authorized contacts and escalation paths",
        "Review and acknowledge SLA terms",
      ],
    },
    {
      phase: "Environment Documentation",
      duration: "3-5 days",
      activities: [
        "Document platform architecture and components",
        "Provide access credentials for support engineers",
        "Configure monitoring integrations (if not already done)",
        "Create environment diagram and contact list",
      ],
    },
    {
      phase: "Orientation Session",
      duration: "2 hours",
      activities: [
        "Walkthrough of support portal and ticket submission",
        "Explanation of severity levels and SLA commitments",
        "Introduction to support team and escalation paths",
        "Q&A session with support manager",
      ],
    },
    {
      phase: "Trial Period",
      duration: "30 days",
      activities: [
        "Submit test tickets to familiarize with process",
        "Participate in scheduled check-ins with support manager",
        "Review initial support metrics and feedback",
        "Adjust processes based on early experience",
      ],
    },
  ],
  bestPractices: [
    "Submit tickets through portal when possible for better tracking",
    "Provide detailed descriptions including error messages and logs",
    "Assign appropriate severity levels (don't over-escalate)",
    "Respond promptly to requests for additional information",
    "Keep tickets focused (one issue per ticket)",
    "Provide feedback after ticket closure to help us improve",
  ],
  commonScenarios: [
    {
      scenario: "Production outage - application not responding",
      action: "Call phone hotline immediately, create P1 ticket with details",
      expectedResponse: "Engineer on call within 15 minutes, war room established",
    },
    {
      scenario: "Performance degradation noticed in monitoring",
      action: "Create P2 ticket with monitoring graphs and affected components",
      expectedResponse: "Engineer response within 30 minutes with initial assessment",
    },
    {
      scenario: "Question about platform configuration",
      action: "Submit P4 ticket or use chat for quick questions",
      expectedResponse: "Response within 4 hours, knowledge base articles shared",
    },
  ],
  faqForNewCustomers: [
    {
      question: "Can I escalate a ticket if not satisfied with progress?",
      answer:
        "Yes, you can request escalation at any time through the portal or by calling the hotline. Your support manager will be notified immediately.",
    },
    {
      question: "What information should I include in a support ticket?",
      answer:
        "Include: detailed description, steps to reproduce, error messages, affected components, business impact, and any troubleshooting already attempted.",
    },
    {
      question: "How do I know if an issue is P1 vs P2?",
      answer:
        "P1 = production down or critical security issue. P2 = major functionality impaired but system operational. When in doubt, our team will help classify correctly.",
    },
    {
      question: "Can support engineers make changes to my production environment?",
      answer:
        "Only with explicit customer approval. We follow change management protocols and obtain written confirmation before making any production changes.",
    },
  ],
};


// Sample detail data for Architecture Advisory
export const architectureAdvisoryDetail = {
  id: "architecture-advisory",
  title: "Enterprise Architecture Advisory",
  type: "Advisory",
  experienceLevel: "Chief Architect",
  deliveryModel: "Hybrid",

  // About Tab
  overview:
    "Enterprise Architecture Advisory provides strategic guidance from seasoned enterprise architects with 15+ years of experience across industries. Whether you're designing a new digital platform, modernizing legacy systems, or establishing architectural governance, our chief architects bring deep expertise and proven frameworks to ensure your architecture decisions align with business objectives and industry best practices.",
  serviceScope: [
    "Architecture strategy development and roadmap planning",
    "Architecture assessments and gap analysis",
    "Technology selection and vendor evaluation",
    "Architecture governance framework design",
    "Reference architecture development",
    "Architecture review boards and decision support",
    "Technical due diligence for M&A",
    "Architecture capability building and mentoring",
  ],
  whatYouGet: [
    "Direct access to a Chief Architect dedicated to your engagement",
    "Regular advisory sessions (weekly, bi-weekly, or monthly)",
    "Architecture reviews and recommendations",
    "Strategic documentation and deliverables",
    "On-demand consultation for critical decisions",
    "Industry benchmark insights and best practices",
    "Executive-level communication and presentations",
    "Long-term relationship beyond initial engagement",
  ],
  idealFor: [
    "Organizations embarking on digital transformation",
    "Companies modernizing legacy architecture",
    "Enterprises establishing architecture practice",
    "Teams facing complex architectural decisions",
    "Leadership needing external architectural perspective",
    "Organizations preparing for M&A activity",
  ],
  businessValue: [
    "Avoid costly architectural mistakes and technical debt",
    "Accelerate decision-making with expert guidance",
    "Access enterprise-scale architectural patterns and frameworks",
    "Build internal architecture capability through mentorship",
    "Ensure technology investments align with business strategy",
    "Reduce risk through proven approaches and peer review",
  ],

  // Team & Expertise Tab
  leadArchitect: {
    name: "Dr. Sarah Mitchell",
    title: "Chief Enterprise Architect",
    credentials: [
      "Ph.D. in Computer Science, MIT",
      "TOGAF 9 Certified",
      "AWS Solutions Architect Professional",
      "Zachman Framework Certified",
    ],
    experience:
      "20+ years in enterprise architecture across financial services, healthcare, and technology sectors",
    specializations: [
      "Cloud-native architecture",
      "Microservices and event-driven design",
      "Enterprise integration patterns",
      "Digital platform architecture",
      "Architecture governance and standards",
    ],
    notableProjects: [
      "Led architecture for $500M digital banking transformation",
      "Designed reference architecture for Fortune 100 healthcare provider",
      "Established architecture practice for global retailer",
      "Technical advisor for 3 successful fintech acquisitions",
    ],
    publications: [
      "Author: 'Modern Enterprise Architecture Patterns' (O'Reilly, 2022)",
      "Regular speaker at industry conferences (AWS re:Invent, Gartner)",
      "Contributor to TOGAF and Open Group standards",
    ],
  },
  supportingTeam: [
    {
      role: "Solution Architect",
      name: "Assigned based on domain",
      expertise: "Deep technical expertise in specific domains (cloud, data, integration)",
      involvement: "Supports detailed design and implementation guidance",
    },
    {
      role: "Architecture Analyst",
      name: "Assigned to engagement",
      expertise: "Research, documentation, analysis",
      involvement: "Prepares materials, conducts research, documents decisions",
    },
  ],
  expertiseByDomain: [
    {
      domain: "Cloud Architecture",
      depth: "Expert",
      coverage:
        "Multi-cloud strategy, cloud-native design, migration patterns, cost optimization",
    },
    {
      domain: "Integration Architecture",
      depth: "Expert",
      coverage:
        "API strategy, ESB vs API gateway, event-driven architecture, data integration",
    },
    {
      domain: "Data Architecture",
      depth: "Advanced",
      coverage: "Data strategy, data lakes, data governance, analytics platforms",
    },
    {
      domain: "Security Architecture",
      depth: "Advanced",
      coverage: "Zero trust, identity management, security by design, compliance",
    },
    {
      domain: "Application Architecture",
      depth: "Expert",
      coverage: "Microservices, domain-driven design, modernization patterns",
    },
  ],

  // How It Works Tab
  engagementModels: [
    {
      model: "Strategic Advisory Retainer",
      duration: "6-12 months",
      commitment: "4-8 hours per week",
      structure: [
        "Weekly or bi-weekly advisory sessions (1-2 hours)",
        "Architecture reviews as needed",
        "On-demand consultation (email, chat)",
        "Quarterly strategic planning sessions",
        "Monthly executive briefings",
      ],
      deliverables: [
        "Architecture roadmap and strategy",
        "Monthly advisory reports",
        "Architecture decision records (ADRs)",
        "Reference architectures and patterns",
      ],
      pricing: "Monthly retainer based on time commitment",
    },
    {
      model: "Project-Based Advisory",
      duration: "1-3 months",
      commitment: "Flexible, project-dependent",
      structure: [
        "Kickoff workshop to define scope and objectives",
        "Regular working sessions (weekly)",
        "Document reviews and feedback",
        "Final presentation and handoff",
      ],
      deliverables: [
        "Specific to project (e.g., architecture assessment report, reference architecture, vendor evaluation)",
      ],
      pricing: "Fixed fee or daily rate based on scope",
    },
    {
      model: "Ad-Hoc Consultation",
      duration: "On-demand",
      commitment: "Hourly as needed",
      structure: [
        "Schedule sessions as needed",
        "Quick consultations (30-60 min)",
        "Document reviews",
        "Decision support",
      ],
      deliverables: ["Meeting notes and recommendations", "Email guidance and feedback"],
      pricing: "Hourly rate",
    },
  ],
  typicalEngagementFlow: [
    {
      phase: "Discovery & Planning",
      duration: "1-2 weeks",
      activities: [
        "Understand current state and challenges",
        "Define objectives and success criteria",
        "Establish engagement rhythm and communication",
        "Identify key stakeholders",
        "Create engagement plan",
      ],
    },
    {
      phase: "Assessment & Analysis",
      duration: "2-4 weeks",
      activities: [
        "Review existing architecture documentation",
        "Conduct stakeholder interviews",
        "Assess against industry best practices",
        "Identify gaps and opportunities",
        "Benchmark against peers",
      ],
    },
    {
      phase: "Strategy & Recommendations",
      duration: "2-4 weeks",
      activities: [
        "Develop architecture strategy and principles",
        "Create reference architectures",
        "Define technology standards",
        "Prioritize initiatives",
        "Build roadmap",
      ],
    },
    {
      phase: "Ongoing Advisory",
      duration: "Ongoing",
      activities: [
        "Regular advisory sessions",
        "Review and approve architecture decisions",
        "Guide implementation teams",
        "Monitor progress against roadmap",
        "Adjust strategy as needed",
      ],
    },
  ],
  communicationModel: {
    regularMeetings: "Scheduled weekly/bi-weekly sessions via video conference",
    adHocSupport: "Email and Slack for quick questions (response within 4 business hours)",
    documentation: "Shared workspace (Confluence, SharePoint) for all deliverables",
    executiveBriefings: "Monthly or quarterly presentations to leadership",
    decisionLog: "Maintained architecture decision record (ADR) repository",
  },

  // Coverage & SLA Tab
  availabilityCommitment: {
    scheduledSessions: "Committed days/times based on engagement model",
    responseTime: "Email/Slack responses within 4 business hours",
    emergencySupport:
      "Available for critical architectural decisions (24-hour notice preferred)",
    timeZones: "Flexible scheduling across global time zones",
  },
  deliverablesQuality: [
    "All deliverables reviewed by peer architects before delivery",
    "Industry-standard frameworks and notations (TOGAF, ArchiMate, C4)",
    "Executive-ready presentations and documentation",
    "Revision cycles included based on feedback",
    "Final deliverables ownership transferred to client",
  ],
  confidentialityAndIP: {
    nda: "Standard NDA covers all engagement work",
    ipOwnership: "All deliverables and IP created become client property",
    dataHandling: "Strict confidentiality protocols, no data retention post-engagement",
    conflictOfInterest: "Dedicated engagement, no competing clients during engagement period",
  },

  // Getting Started Tab
  prerequisitesForEngagement: [
    "Clear objectives and desired outcomes defined",
    "Executive sponsorship secured",
    "Key stakeholders identified and available",
    "Existing architecture documentation (if available)",
    "Budget approval for engagement duration",
  ],
  engagementSetup: [
    {
      step: "Initial Consultation",
      duration: "1 hour (complimentary)",
      description: "Discuss your needs, explore fit, outline potential engagement",
      outcome: "Mutual understanding of objectives and engagement approach",
    },
    {
      step: "Proposal Development",
      duration: "3-5 days",
      description:
        "We develop detailed proposal with scope, approach, timeline, and pricing",
      outcome: "Written proposal for your review and approval",
    },
    {
      step: "Contract Execution",
      duration: "1 week",
      description: "Review and sign engagement agreement, process purchase order",
      outcome: "Executed contract and engagement formally initiated",
    },
    {
      step: "Kickoff & Discovery",
      duration: "1-2 weeks",
      description: "Formal kickoff meeting, discovery sessions, stakeholder interviews",
      outcome: "Engagement plan, stakeholder map, initial assessment",
    },
    {
      step: "Regular Cadence Established",
      duration: "Ongoing",
      description: "Weekly/bi-weekly sessions commence, deliverables flow begins",
      outcome: "Productive ongoing advisory relationship",
    },
  ],
  whatToPrepareBefore: [
    "Document current challenges and pain points",
    "Gather existing architecture diagrams and documentation",
    "Identify strategic business objectives",
    "List technology initiatives and projects underway",
    "Prepare access to relevant systems for review (if applicable)",
    "Clarify decision-making authority and approval processes",
  ],
  successFactors: [
    "Executive sponsorship and engagement",
    "Transparent communication about constraints and challenges",
    "Dedicated internal stakeholders available for collaboration",
    "Willingness to challenge assumptions and consider new approaches",
    "Action on recommendations (advisory is only valuable if acted upon)",
    "Regular feedback to ensure engagement stays aligned with needs",
  ],
  pricingGuidance: {
    hourlyRate: "$400-600/hour depending on seniority",
    dailyRate: "$3,200-4,800/day for intensive engagements",
    monthlyRetainer: "$15,000-40,000/month based on time commitment",
    projectBased: "Custom pricing based on defined scope and deliverables",
    discounts: "Volume discounts available for long-term engagements (6+ months)",
  },
};


// Critical Incident Response Detail
export const incidentResponseDetail = {
  id: "incident-response",
  title: "Critical Incident Response",
  type: "Incident Response",
  slaLevel: "Critical",
  responseTime: "Immediate (<15 min)",
  deliveryModel: "Remote",

  overview:
    "Critical Incident Response provides immediate emergency support for production incidents that require urgent attention. Our specialized incident response team is trained to handle high-pressure situations, coordinate war rooms, and restore services quickly while maintaining clear communication with all stakeholders.",
  whatsIncluded: [
    "Immediate response within 15 minutes for P1 incidents",
    "Dedicated war room coordination and management",
    "Real-time incident tracking and status updates",
    "Root cause analysis and post-incident reports",
    "Prevention planning and recommendations",
    "Executive communication and stakeholder management",
    "24/7 on-call incident response team",
    "Integration with monitoring and alerting systems",
  ],
  idealFor: [
    "Production systems with zero-tolerance for downtime",
    "Customer-facing applications requiring immediate response",
    "Financial services and healthcare systems",
    "E-commerce platforms during peak periods",
    "Organizations with strict SLA commitments to customers",
  ],
  valueProposition:
    "Our Critical Incident Response team has handled over 10,000 production incidents with an average resolution time of 45 minutes for P1 issues. We maintain a 99.8% SLA compliance rate and have helped organizations avoid an estimated $50M in revenue loss through rapid incident resolution.",
  supportedPlatforms: [
    "All DBP platform components",
    "Cloud infrastructure (AWS, Azure, GCP)",
    "Microservices and containerized applications",
    "Database systems and data platforms",
    "API gateways and integration layers",
  ],

  coverageDetails: {
    availability: "24/7/365 with dedicated on-call rotation",
    holidays: "Full coverage including all holidays",
    languageSupport: "English (primary), Arabic, Spanish",
    geographicCoverage: "Global coverage with regional teams",
  },
  slaCommitments: [
    {
      severity: "Critical (P1)",
      definition: "Complete service outage, data loss, security breach",
      responseTime: "Immediate (<15 min)",
      resolutionTarget: "2 hours",
      updateFrequency: "Every 15 minutes",
      escalation: "Immediate escalation to VP Engineering and CTO",
    },
    {
      severity: "High (P2)",
      definition: "Severe degradation affecting multiple users",
      responseTime: "15 minutes",
      resolutionTarget: "4 hours",
      updateFrequency: "Every 30 minutes",
      escalation: "Escalation to senior engineers within 1 hour",
    },
  ],
  escalationProcedure: [
    {
      level: "Level 1 - Incident Commander",
      description: "Coordinates response, manages war room, communicates status",
      availability: "24/7 on-call rotation",
    },
    {
      level: "Level 2 - Technical Specialists",
      description: "Platform experts for deep technical troubleshooting",
      availability: "24/7 on-call for P1, rapid response for P2",
    },
    {
      level: "Level 3 - Engineering Leadership",
      description: "VP Engineering, CTO for critical decisions and escalations",
      availability: "On-demand for P1 incidents",
    },
  ],
  performanceMetrics: {
    averageResponseTime: "8 minutes",
    averageResolutionTime: "45 minutes for P1",
    incidentsHandled: "10,000+ incidents",
    slaCompliance: "99.8%",
    customerSatisfaction: "4.9/5.0",
  },

  requestProcess: [
    {
      step: "Declare Incident",
      description: "Call emergency hotline or trigger incident via monitoring system",
      channels: [
        "Emergency Hotline: +971-4-INCIDENT (24/7)",
        "Automated alerts from monitoring systems",
        "Support portal emergency button",
        "Slack emergency channel",
      ],
    },
    {
      step: "War Room Activation",
      description: "Incident Commander activates war room and assembles response team",
      timing: "Within 5 minutes of incident declaration",
    },
    {
      step: "Initial Assessment",
      description: "Rapid assessment of impact, scope, and initial containment",
      timing: "Within 15 minutes",
    },
    {
      step: "Active Response",
      description: "Technical team works on resolution with regular status updates",
      updates: "Every 15 minutes to stakeholders",
    },
    {
      step: "Resolution & Verification",
      description: "Service restored and verified across all affected systems",
      validation: "Customer confirmation and monitoring validation",
    },
    {
      step: "Post-Incident Review",
      description: "Detailed RCA report with timeline, root cause, and prevention plan",
      deliverable: "Delivered within 48 hours of incident closure",
    },
  ],
  communicationChannels: [
    {
      channel: "Emergency Hotline",
      description: "Direct line to incident commander",
      availability: "24/7",
      bestFor: "P1 incidents requiring immediate response",
    },
    {
      channel: "War Room Bridge",
      description: "Conference bridge for real-time collaboration",
      availability: "Activated during incidents",
      bestFor: "Coordinating response across teams",
    },
    {
      channel: "Status Page",
      description: "Real-time incident status and updates",
      availability: "Updated every 15 minutes during incidents",
      bestFor: "Stakeholder communication",
    },
    {
      channel: "Slack Incident Channel",
      description: "Dedicated channel for incident coordination",
      availability: "Created per incident",
      bestFor: "Technical team coordination",
    },
  ],
  ticketLifecycle: {
    statuses: [
      "Declared - Incident reported and war room activated",
      "Investigating - Team actively diagnosing issue",
      "Mitigating - Implementing temporary fix or workaround",
      "Resolving - Implementing permanent solution",
      "Monitoring - Solution deployed, monitoring for stability",
      "Resolved - Service fully restored and stable",
      "Closed - Post-incident review completed",
    ],
    customerActions: [
      "Provide detailed incident description and business impact",
      "Designate incident liaison for communication",
      "Approve proposed solutions and changes",
      "Participate in post-incident review",
    ],
  },

  supportTeam: {
    size: "25 incident response specialists",
    locations: ["Dubai (primary)", "London", "Singapore", "New York"],
    followTheSun: "24/7 on-call rotation with regional handoffs",
    teamStructure: [
      "5 Incident Commanders (on-call rotation)",
      "15 Technical Specialists (platform experts)",
      "3 Communication Coordinators",
      "2 Incident Response Managers",
    ],
  },
  expertiseAreas: [
    "Incident command and war room management",
    "Crisis communication and stakeholder management",
    "Rapid troubleshooting under pressure",
    "Root cause analysis methodologies",
    "Disaster recovery and business continuity",
    "Post-incident review and prevention planning",
  ],
  certifications: [
    "ITIL Incident Management",
    "Certified Incident Handler (GCIH)",
    "AWS Solutions Architect",
    "Site Reliability Engineering (SRE) certified",
  ],
  teamProfiles: [
    {
      role: "Lead Incident Commander",
      name: "Sarah Johnson",
      experience: "12+ years in incident management and crisis response",
      expertise: "War room coordination, executive communication, rapid decision-making",
      availability: "24/7 on-call rotation",
    },
    {
      role: "Senior Technical Specialist",
      name: "Michael Chen",
      experience: "15+ years in platform engineering and troubleshooting",
      expertise: "Distributed systems, database recovery, performance optimization",
      availability: "24/7 on-call for P1 incidents",
    },
  ],
  continuousImprovement:
    "Our incident response team conducts monthly tabletop exercises and quarterly disaster recovery drills. We maintain a knowledge base of incident patterns and solutions, and every incident contributes to our prevention playbooks.",

  prerequisites: [
    "Active platform subscription with incident response coverage",
    "Designated incident liaisons with contact information",
    "Access credentials for emergency troubleshooting",
    "Documented escalation paths and approval authorities",
    "Integration with monitoring and alerting systems",
  ],
  onboardingProcess: [
    {
      phase: "Emergency Contacts Setup",
      duration: "1 day",
      activities: [
        "Register emergency contacts and phone numbers",
        "Set up emergency hotline access",
        "Configure Slack emergency channels",
        "Test emergency communication paths",
      ],
    },
    {
      phase: "Incident Response Planning",
      duration: "1 week",
      activities: [
        "Document critical systems and dependencies",
        "Define incident severity criteria",
        "Establish escalation procedures",
        "Create incident response runbooks",
      ],
    },
    {
      phase: "Tabletop Exercise",
      duration: "Half day",
      activities: [
        "Simulate incident scenario",
        "Practice war room procedures",
        "Test communication channels",
        "Refine response procedures",
      ],
    },
    {
      phase: "Go-Live Readiness",
      duration: "Ongoing",
      activities: [
        "Final verification of all contacts and procedures",
        "24/7 coverage activation",
        "Regular drill schedule established",
      ],
    },
  ],
  bestPractices: [
    "Declare incidents early - better safe than sorry",
    "Designate a single point of contact for communication",
    "Document all actions taken during incident response",
    "Focus on restoration first, investigation second",
    "Participate actively in post-incident reviews",
    "Implement prevention recommendations promptly",
  ],
  commonScenarios: [
    {
      scenario: "Database corruption causing application failures",
      action: "Call emergency hotline immediately, provide database details",
      expectedResponse: "War room activated within 5 minutes, database specialists engaged",
    },
    {
      scenario: "DDoS attack overwhelming infrastructure",
      action: "Trigger incident via monitoring alert, join war room bridge",
      expectedResponse: "Security team engaged, mitigation strategies deployed within 15 minutes",
    },
    {
      scenario: "Critical bug in production causing data inconsistency",
      action: "Declare P1 incident, provide reproduction steps and impact assessment",
      expectedResponse: "Engineering team mobilized, rollback or hotfix deployed within 2 hours",
    },
  ],
  faqForNewCustomers: [
    {
      question: "What qualifies as a P1 incident?",
      answer:
        "P1 incidents include complete service outages, data loss, security breaches, or any issue causing significant business impact. When in doubt, declare it - we'll help assess severity.",
    },
    {
      question: "How quickly will someone respond to my incident?",
      answer:
        "For P1 incidents, an Incident Commander will respond within 15 minutes and a war room will be activated within 5 minutes of declaration.",
    },
    {
      question: "What happens during a war room?",
      answer:
        "The Incident Commander coordinates the response, technical specialists troubleshoot, and communication coordinators keep stakeholders informed. You'll have a dedicated liaison for updates.",
    },
    {
      question: "Will I receive a post-incident report?",
      answer:
        "Yes, all P1 incidents receive a detailed RCA report within 48 hours, including timeline, root cause, and prevention recommendations.",
    },
  ],
};


import { generateTechnicalSupportDetail, generateExpertConsultancyDetail } from "./detailsGenerator";
import {
  // Technical Support Details
  performanceOptimizationDetail,
  securityIncidentSupportDetail,
  integrationTroubleshootingDetail,
  databaseSupportDetail,
  cloudMigrationSupportDetail,
  applicationTroubleshootingDetail,
  disasterRecoverySupportDetail,
  configurationAssistanceDetail,
  upgradeAssistanceDetail,
  monitoringSetupDetail,
  capacityPlanningSupportDetail,
  backupRestoreSupportDetail,
  apiGatewaySupportDetail,
  containerOrchestrationSupportDetail,
  networkConnectivitySupportDetail,
  devopsPipelineSupportDetail,
  
  // Expert Consultancy Details
  transformationCoachingDetail,
  portfolioOptimizationConsultingDetail,
  dataStrategyConsultingDetail,
  changeManagementConsultingDetail,
  cloudArchitectureAdvisoryDetail,
  securityArchitectureReviewDetail,
  agileTransformationCoachingDetail,
  apiStrategyConsultingDetail,
  devopsTransformationConsultingDetail,
  integrationArchitectureWorkshopDetail,
  technologySelectionAdvisoryDetail,
  microservicesArchitectureConsultingDetail,
  platformModernizationConsultingDetail,
  processAutomationConsultingDetail,
  executiveTransformationBriefingsDetail,
} from "./allServiceDetails";

// Helper function to get detail by ID
export const getSupportServiceDetail = (id: string) => {
  // All service details mapped by ID
  const allDetails: Record<string, any> = {
    // Existing manually created details
    "24x7-platform-support": platform24x7SupportDetail,
    "architecture-advisory": architectureAdvisoryDetail,
    "incident-response": incidentResponseDetail,
    
    // Technical Support Services
    "performance-optimization": performanceOptimizationDetail,
    "security-incident-support": securityIncidentSupportDetail,
    "integration-troubleshooting": integrationTroubleshootingDetail,
    "database-support": databaseSupportDetail,
    "cloud-migration-support": cloudMigrationSupportDetail,
    "application-troubleshooting": applicationTroubleshootingDetail,
    "disaster-recovery-support": disasterRecoverySupportDetail,
    "configuration-assistance": configurationAssistanceDetail,
    "upgrade-assistance": upgradeAssistanceDetail,
    "monitoring-setup": monitoringSetupDetail,
    "capacity-planning-support": capacityPlanningSupportDetail,
    "backup-restore-support": backupRestoreSupportDetail,
    "api-gateway-support": apiGatewaySupportDetail,
    "container-orchestration-support": containerOrchestrationSupportDetail,
    "network-connectivity-support": networkConnectivitySupportDetail,
    "devops-pipeline-support": devopsPipelineSupportDetail,
    
    // Expert Consultancy Services
    "transformation-coaching": transformationCoachingDetail,
    "portfolio-optimization-consulting": portfolioOptimizationConsultingDetail,
    "data-strategy-consulting": dataStrategyConsultingDetail,
    "change-management-consulting": changeManagementConsultingDetail,
    "cloud-architecture-advisory": cloudArchitectureAdvisoryDetail,
    "security-architecture-review": securityArchitectureReviewDetail,
    "agile-transformation-coaching": agileTransformationCoachingDetail,
    "api-strategy-consulting": apiStrategyConsultingDetail,
    "devops-transformation-consulting": devopsTransformationConsultingDetail,
    "integration-architecture-workshop": integrationArchitectureWorkshopDetail,
    "technology-selection-advisory": technologySelectionAdvisoryDetail,
    "microservices-architecture-consulting": microservicesArchitectureConsultingDetail,
    "platform-modernization-consulting": platformModernizationConsultingDetail,
    "process-automation-consulting": processAutomationConsultingDetail,
    "executive-transformation-briefings": executiveTransformationBriefingsDetail,
  };
  
  return allDetails[id] || null;
};
