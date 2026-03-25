// Complete service details with all tabs populated

// API Gateway Support Detail - Complete
export const apiGatewaySupportDetail = {
  overview: "API Gateway Support provides specialized assistance with API gateway configuration, policies, and troubleshooting. Our API specialists have deep expertise in modern API management platforms and can help optimize your API gateway for performance, security, and developer experience.",
  whatsIncluded: [
    "API gateway configuration and optimization",
    "Security policy implementation (authentication, authorization, rate limiting)",
    "Traffic management and load balancing configuration",
    "API versioning and lifecycle management",
    "Developer portal setup and documentation",
    "Analytics and monitoring configuration",
    "Integration with backend services and microservices",
    "Performance optimization and caching strategies",
  ],
  idealFor: [
    "Organizations implementing API-first architectures",
    "Companies managing multiple APIs and microservices",
    "Teams needing to secure and manage external API access",
    "Organizations requiring API analytics and monitoring",
    "Companies implementing developer portals and API marketplaces",
  ],
  valueProposition: "Our API gateway expertise improves API performance by 50%, enhances security posture, and provides the foundation for scalable API ecosystems that support digital transformation initiatives.",

  // Coverage & SLA Tab
  coverageDetails: {
    availability: "Business hours with emergency support for critical API issues",
    holidays: "Limited coverage on public holidays",
    languageSupport: "English (primary), Arabic (business hours)",
    geographicCoverage: "Global support with API management expertise",
  },
  slaCommitments: [
    {
      severity: "High Priority",
      definition: "API gateway outages or security vulnerabilities affecting multiple APIs",
      responseTime: "2 hours",
      resolutionTarget: "8 hours",
      updateFrequency: "Every 2 hours",
      escalation: "Escalation to senior API architects if not resolved in 4 hours",
    },
    {
      severity: "Standard",
      definition: "Configuration issues, policy updates, performance optimization",
      responseTime: "4 hours",
      resolutionTarget: "2 business days",
      updateFrequency: "Daily",
      escalation: "Standard escalation path",
    },
  ],
  escalationProcedure: [
    {
      level: "Level 1 - API Support Engineer",
      description: "API gateway configuration, basic troubleshooting, policy implementation",
      availability: "Business hours",
    },
    {
      level: "Level 2 - Senior API Specialist",
      description: "Complex API gateway issues, performance optimization, security implementation",
      availability: "Business hours + on-call for critical issues",
    },
    {
      level: "Level 3 - API Architect",
      description: "API strategy, complex integrations, architectural decisions",
      availability: "Business hours",
    },
  ],
  performanceMetrics: {
    averageResponseTime: "3 hours",
    averageResolutionTime: "1.5 days for configuration issues",
    customerSatisfaction: "4.5/5.0",
    apiPerformanceImprovement: "Average 50% improvement in API response times",
    slaCompliance: "96.8%",
  },

  requestProcess: [
    {
      step: "API Gateway Assessment",
      description: "Analysis of current API gateway configuration, policies, and performance characteristics.",
      channels: ["API gateway support portal", "API management consultation", "Gateway optimization request"],
    },
    {
      step: "Configuration Review",
      description: "Detailed review of gateway policies, security settings, and integration configurations.",
    },
    {
      step: "Optimization Planning",
      description: "Development of optimization plan including security enhancements and performance improvements.",
    },
    {
      step: "Implementation Support",
      description: "Hands-on assistance with configuration changes, policy updates, and integration improvements.",
    },
    {
      step: "Validation & Monitoring",
      description: "Testing of changes and setup of ongoing monitoring to ensure optimal gateway performance.",
    },
  ],
  communicationChannels: [
    {
      channel: "API Gateway Portal",
      description: "Specialized portal for API gateway support requests and documentation",
      availability: "24/7",
      bestFor: "Configuration requests, policy updates, performance optimization",
    },
    {
      channel: "API Hotline",
      description: "Direct line for urgent API gateway issues",
      availability: "Business hours",
      bestFor: "Critical API outages or security issues",
    },
    {
      channel: "Developer Slack Channel",
      description: "Real-time support for API developers and integrators",
      availability: "Business hours",
      bestFor: "Quick questions, integration support, best practices",
    },
  ],

  // Team & Expertise Tab
  supportTeam: {
    size: "8 API gateway specialists",
    locations: ["Dubai (primary)", "London", "Singapore"],
    followTheSun: "Business hours coverage with API expertise in each region",
    teamStructure: [
      "3 API Support Engineers",
      "4 Senior API Specialists",
      "1 API Architect",
    ],
  },
  expertiseAreas: [
    "API gateway platforms (Kong, AWS API Gateway, Azure APIM, Google Cloud Endpoints)",
    "API security and authentication (OAuth, JWT, API keys, mTLS)",
    "Rate limiting and traffic management policies",
    "API versioning and lifecycle management",
    "Developer portal and API documentation",
    "API analytics and monitoring",
    "Microservices integration patterns",
    "API performance optimization and caching",
  ],
  certifications: [
    "Kong Certified API Management Professional",
    "AWS Certified Solutions Architect",
    "Azure API Management Specialist",
    "Google Cloud Professional Cloud Architect",
    "OAuth 2.0 and OpenID Connect Certified",
  ],
  teamProfiles: [
    {
      role: "Senior API Specialist",
      name: "David Kim",
      experience: "10+ years in API management and gateway technologies",
      expertise: "API security, Kong gateway, microservices integration",
      availability: "Business hours + on-call for critical issues",
    },
    {
      role: "API Architect",
      name: "Jennifer Walsh",
      experience: "12+ years in API strategy and architecture",
      expertise: "API strategy, developer experience, enterprise API governance",
      availability: "Business hours",
    },
  ],
  continuousImprovement: "Our API team stays current with latest API management trends through vendor partnerships, API conferences, and regular training on emerging API gateway technologies and security practices.",

  prerequisites: [
    "API gateway administrative access",
    "API documentation and specifications",
    "Security requirements and compliance needs",
    "Backend service information and access",
  ],
  onboardingProcess: [
    {
      phase: "API Gateway Assessment",
      duration: "1-2 days",
      activities: [
        "Review current API gateway configuration and policies",
        "Assess API security and performance requirements",
        "Document existing APIs and integration patterns",
        "Identify optimization opportunities and pain points",
      ],
    },
    {
      phase: "Configuration Review",
      duration: "2-3 days",
      activities: [
        "Detailed analysis of gateway policies and security settings",
        "Performance testing and bottleneck identification",
        "Security assessment and vulnerability analysis",
        "Integration testing with backend services",
      ],
    },
    {
      phase: "Optimization Implementation",
      duration: "3-5 days",
      activities: [
        "Implementation of recommended configuration changes",
        "Security policy updates and enhancements",
        "Performance optimization and caching configuration",
        "Monitoring and alerting setup",
      ],
    },
  ],
  bestPractices: [
    "Implement proper API versioning and lifecycle management",
    "Use appropriate authentication and authorization for each API",
    "Configure rate limiting to protect backend services",
    "Monitor API performance and usage patterns regularly",
    "Maintain comprehensive API documentation and developer guides",
    "Implement proper error handling and response codes",
  ],
  commonScenarios: [
    {
      scenario: "API gateway returning 5xx errors for specific endpoints",
      action: "Submit support request with error logs and affected API details",
      expectedResponse: "API specialist investigates within 2 hours, provides initial assessment",
    },
    {
      scenario: "Need to implement OAuth 2.0 authentication for new API",
      action: "Request API security configuration assistance with requirements",
      expectedResponse: "Security specialist provides implementation guidance within 4 hours",
    },
    {
      scenario: "API performance degradation affecting multiple consumers",
      action: "Submit high priority request with performance metrics and usage patterns",
      expectedResponse: "Performance analysis begins within 2 hours, optimization plan within 8 hours",
    },
  ],
  faqForNewCustomers: [
    {
      question: "Which API gateway platforms do you support?",
      answer: "We support all major API gateway platforms including Kong, AWS API Gateway, Azure API Management, Google Cloud Endpoints, and others. Our team has expertise across multiple platforms.",
    },
    {
      question: "Can you help migrate from one API gateway to another?",
      answer: "Yes, we provide migration assistance including configuration mapping, policy translation, and testing to ensure smooth transitions between API gateway platforms.",
    },
    {
      question: "Do you provide API security assessments?",
      answer: "Absolutely. We conduct comprehensive API security reviews including authentication, authorization, rate limiting, and vulnerability assessments with remediation recommendations.",
    },
    {
      question: "How do you help with API performance optimization?",
      answer: "We analyze API usage patterns, implement caching strategies, optimize routing policies, and configure load balancing to improve API response times and throughput.",
    },
  ],
};