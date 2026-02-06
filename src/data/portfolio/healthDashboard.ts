// Mock data for Portfolio Health Dashboard

export interface Application {
  id: string;
  name: string;
  healthScore: number;
  businessCriticality: "Critical" | "High" | "Medium" | "Low";
  techStack: string;
  lastUpdated: string;
  owner: string;
  status: "Online" | "At Risk" | "Critical" | "Maintenance";
  performance: number;
  security: number;
  maintainability: number;
  businessValue: number;
  vulnerabilities: number;
  uptime: number;
  responseTime: number;
  environment: string;
  version: string;
  deploymentDate: string;
  dependencies: string[];
}

export const mockApplications: Application[] = [
  {
    id: "crm-system",
    name: "Customer Relationship Management",
    healthScore: 87,
    businessCriticality: "Critical",
    techStack: "Java Spring Boot",
    lastUpdated: "2 hours ago",
    owner: "Team Alpha",
    status: "Online",
    performance: 92,
    security: 85,
    maintainability: 82,
    businessValue: 89,
    vulnerabilities: 3,
    uptime: 99.2,
    responseTime: 1.2,
    environment: "Production",
    version: "2.4.1",
    deploymentDate: "2024-01-15",
    dependencies: ["PostgreSQL 14", "Redis 6.2", "Elasticsearch 8.1"]
  },
  {
    id: "erp-portal",
    name: "Enterprise Resource Planning",
    healthScore: 45,
    businessCriticality: "High",
    techStack: ".NET Core 6",
    lastUpdated: "1 day ago",
    owner: "Team Beta",
    status: "At Risk",
    performance: 65,
    security: 40,
    maintainability: 35,
    businessValue: 70,
    vulnerabilities: 12,
    uptime: 97.8,
    responseTime: 3.5,
    environment: "Production",
    version: "1.8.3",
    deploymentDate: "2023-11-20",
    dependencies: ["SQL Server 2019", "Azure Service Bus", "Azure Storage"]
  },
  {
    id: "analytics-platform",
    name: "Business Analytics Platform",
    healthScore: 92,
    businessCriticality: "Medium",
    techStack: "Python Django",
    lastUpdated: "30 minutes ago",
    owner: "Team Gamma",
    status: "Online",
    performance: 95,
    security: 88,
    maintainability: 94,
    businessValue: 91,
    vulnerabilities: 1,
    uptime: 99.8,
    responseTime: 0.8,
    environment: "Production",
    version: "3.2.0",
    deploymentDate: "2024-02-01",
    dependencies: ["MongoDB 6.0", "Apache Kafka", "Apache Spark"]
  },
  {
    id: "inventory-system",
    name: "Inventory Management System",
    healthScore: 73,
    businessCriticality: "High",
    techStack: "Node.js Express",
    lastUpdated: "4 hours ago",
    owner: "Team Delta",
    status: "Online",
    performance: 78,
    security: 75,
    maintainability: 68,
    businessValue: 72,
    vulnerabilities: 5,
    uptime: 98.5,
    responseTime: 2.1,
    environment: "Production",
    version: "4.1.2",
    deploymentDate: "2023-12-10",
    dependencies: ["MySQL 8.0", "RabbitMQ", "Docker"]
  },
  {
    id: "hr-portal",
    name: "Human Resources Portal",
    healthScore: 38,
    businessCriticality: "Medium",
    techStack: "PHP Laravel",
    lastUpdated: "2 days ago",
    owner: "Team Echo",
    status: "Critical",
    performance: 45,
    security: 25,
    maintainability: 40,
    businessValue: 42,
    vulnerabilities: 18,
    uptime: 95.2,
    responseTime: 4.8,
    environment: "Production",
    version: "8.2.1",
    deploymentDate: "2023-08-15",
    dependencies: ["MariaDB 10.6", "Apache HTTP Server", "Memcached"]
  },
  {
    id: "payment-gateway",
    name: "Payment Processing Gateway",
    healthScore: 95,
    businessCriticality: "Critical",
    techStack: "Go Microservices",
    lastUpdated: "15 minutes ago",
    owner: "Team Zeta",
    status: "Online",
    performance: 98,
    security: 96,
    maintainability: 92,
    businessValue: 94,
    vulnerabilities: 0,
    uptime: 99.9,
    responseTime: 0.3,
    environment: "Production",
    version: "1.5.0",
    deploymentDate: "2024-01-30",
    dependencies: ["PostgreSQL 15", "Redis Cluster", "Vault"]
  },
  {
    id: "mobile-app-backend",
    name: "Mobile Application Backend",
    healthScore: 81,
    businessCriticality: "High",
    techStack: "Kotlin Spring",
    lastUpdated: "1 hour ago",
    owner: "Team Theta",
    status: "Online",
    performance: 85,
    security: 79,
    maintainability: 78,
    businessValue: 82,
    vulnerabilities: 4,
    uptime: 99.1,
    responseTime: 1.5,
    environment: "Production",
    version: "2.1.0",
    deploymentDate: "2024-01-05",
    dependencies: ["MongoDB 5.0", "Firebase", "AWS S3"]
  },
  {
    id: "reporting-engine",
    name: "Business Reporting Engine",
    healthScore: 67,
    businessCriticality: "Medium",
    techStack: "Python Flask",
    lastUpdated: "6 hours ago",
    owner: "Team Iota",
    status: "Online",
    performance: 72,
    security: 68,
    maintainability: 61,
    businessValue: 67,
    vulnerabilities: 7,
    uptime: 98.0,
    responseTime: 2.8,
    environment: "Production",
    version: "1.9.4",
    deploymentDate: "2023-10-12",
    dependencies: ["PostgreSQL 13", "Apache Airflow", "Tableau Server"]
  },
  {
    id: "notification-service",
    name: "Notification Service",
    healthScore: 89,
    businessCriticality: "Medium",
    techStack: "Node.js Fastify",
    lastUpdated: "45 minutes ago",
    owner: "Team Kappa",
    status: "Online",
    performance: 91,
    security: 87,
    maintainability: 88,
    businessValue: 90,
    vulnerabilities: 2,
    uptime: 99.5,
    responseTime: 0.9,
    environment: "Production",
    version: "3.0.1",
    deploymentDate: "2024-01-20",
    dependencies: ["Redis 7.0", "AWS SES", "Twilio API"]
  },
  {
    id: "legacy-billing",
    name: "Legacy Billing System",
    healthScore: 29,
    businessCriticality: "Critical",
    techStack: "COBOL Mainframe",
    lastUpdated: "1 week ago",
    owner: "Team Legacy",
    status: "Critical",
    performance: 35,
    security: 15,
    maintainability: 20,
    businessValue: 45,
    vulnerabilities: 25,
    uptime: 94.5,
    responseTime: 8.2,
    environment: "Production",
    version: "Legacy-2019",
    deploymentDate: "2019-03-01",
    dependencies: ["DB2", "CICS", "MQ Series"]
  }
];

export const portfolioHealthMetrics = {
  totalApplications: mockApplications.length,
  averageHealthScore: Math.round(
    mockApplications.reduce((sum, app) => sum + app.healthScore, 0) / mockApplications.length
  ),
  healthyApplications: mockApplications.filter(app => app.healthScore >= 71).length,
  atRiskApplications: mockApplications.filter(app => app.healthScore >= 41 && app.healthScore <= 70).length,
  criticalApplications: mockApplications.filter(app => app.healthScore <= 40).length,
  averageUptime: Number(
    (mockApplications.reduce((sum, app) => sum + app.uptime, 0) / mockApplications.length).toFixed(1)
  ),
  totalVulnerabilities: mockApplications.reduce((sum, app) => sum + app.vulnerabilities, 0),
  averageResponseTime: Number(
    (mockApplications.reduce((sum, app) => sum + app.responseTime, 0) / mockApplications.length).toFixed(1)
  ),
  criticalBusinessApps: mockApplications.filter(app => app.businessCriticality === "Critical").length,
  onlineApplications: mockApplications.filter(app => app.status === "Online").length
};

export const healthTrends = {
  last30Days: [
    { date: "2024-01-01", score: 82 },
    { date: "2024-01-08", score: 84 },
    { date: "2024-01-15", score: 81 },
    { date: "2024-01-22", score: 85 },
    { date: "2024-01-29", score: 87 },
    { date: "2024-02-05", score: portfolioHealthMetrics.averageHealthScore }
  ]
};

export const filterOptions = {
  healthStatus: [
    { value: "all", label: "All Health Levels" },
    { value: "healthy", label: "Healthy (71-100%)" },
    { value: "at-risk", label: "At Risk (41-70%)" },
    { value: "critical", label: "Critical (0-40%)" }
  ],
  businessCriticality: [
    { value: "all", label: "All Criticality" },
    { value: "critical", label: "Critical" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
  ],
  status: [
    { value: "all", label: "All Status" },
    { value: "online", label: "Online" },
    { value: "at-risk", label: "At Risk" },
    { value: "critical", label: "Critical" },
    { value: "maintenance", label: "Maintenance" }
  ],
  techStack: [
    { value: "all", label: "All Technologies" },
    { value: "java", label: "Java" },
    { value: "dotnet", label: ".NET" },
    { value: "python", label: "Python" },
    { value: "nodejs", label: "Node.js" },
    { value: "php", label: "PHP" },
    { value: "go", label: "Go" },
    { value: "kotlin", label: "Kotlin" },
    { value: "cobol", label: "COBOL" }
  ],
  owner: [
    { value: "all", label: "All Teams" },
    ...Array.from(new Set(mockApplications.map(app => app.owner))).map(owner => ({
      value: owner.toLowerCase().replace(" ", "-"),
      label: owner
    }))
  ]
};