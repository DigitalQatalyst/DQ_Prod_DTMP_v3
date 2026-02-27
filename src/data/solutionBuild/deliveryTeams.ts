import type { DeliveryTeam } from './types';

export const deliveryTeams: DeliveryTeam[] = [
  {
    id: 'team-alpha',
    name: 'Alpha',
    specialty: 'Cloud Infrastructure & Platform Engineering',
    skills: ['Kubernetes', 'AWS', 'Azure', 'Terraform', 'CI/CD', 'Microservices'],
    capacity: 5,
    currentLoad: 3,
    utilization: 60,
    nextAvailable: '2026-02-15',
    queuedRequests: 4,
    completedBuilds: 47,
    averageDeliveryTime: 8.5
  },
  {
    id: 'team-beta',
    name: 'Beta',
    specialty: 'Data & Analytics Solutions',
    skills: ['Data Lakes', 'ETL', 'Databricks', 'Snowflake', 'Power BI', 'ML/AI'],
    capacity: 4,
    currentLoad: 4,
    utilization: 100,
    nextAvailable: '2026-03-01',
    queuedRequests: 6,
    completedBuilds: 38,
    averageDeliveryTime: 10.2
  },
  {
    id: 'team-gamma',
    name: 'Gamma',
    specialty: 'Digital Experience & Integration',
    skills: ['React', 'Node.js', 'API Gateway', 'Kafka', 'Mobile', 'UX/UI'],
    capacity: 6,
    currentLoad: 4,
    utilization: 67,
    nextAvailable: '2026-02-20',
    queuedRequests: 3,
    completedBuilds: 52,
    averageDeliveryTime: 7.8
  },
  {
    id: 'team-delta',
    name: 'Delta',
    specialty: 'Security & DevOps Automation',
    skills: ['Zero Trust', 'IAM', 'SIEM', 'Jenkins', 'GitOps', 'Monitoring'],
    capacity: 4,
    currentLoad: 2,
    utilization: 50,
    nextAvailable: '2026-02-10',
    queuedRequests: 2,
    completedBuilds: 41,
    averageDeliveryTime: 6.5
  }
];
