// Shared Stage 1 marketplace ID → Stage 2 workspace course ID mapping.
// Used by LoginModal (enrol flow) and bookmark enrol flow.

export const stage1ToStage2CourseMap: Record<string, string> = {
  // Marketplace IDs → Stage 2 course IDs
  "dt-fundamentals": "digital-transformation-fundamentals",
  "dbp-capability": "dbp-framework-essentials",
  "4d-model-mastery": "agile-transformation-leadership",
  "enterprise-arch": "enterprise-architecture-patterns",
  "change-leadership": "change-management-excellence",
  "data-driven-decisions": "data-driven-decision-making",
  "agile-transformation": "agile-transformation-leadership",
  "cloud-architecture": "cloud-migration-strategies",
  "transformation-roi": "data-driven-decision-making",
  "transformation-leadership": "agile-transformation-leadership",

  // DEWA-contextualised course IDs
  "enterprise-architecture-fundamentals-dewa": "enterprise-architecture-fundamentals-dewa",
  "introduction-4d-governance-model": "introduction-4d-governance-model",
  "dtmp-platform-orientation": "dtmp-platform-orientation",
  "ea-4-practice-dewa-approach": "ea-4-practice-dewa-approach",
  "smart-grid-architecture-design-principles": "smart-grid-architecture-design-principles",
  "ai-in-utility-operations-introduction": "ai-in-utility-operations-introduction",
  "solution-architecture-digital-platforms": "solution-architecture-digital-platforms",
  "data-governance-fundamentals-utilities": "data-governance-fundamentals-utilities",
  "net-zero-2050-architecture-role": "net-zero-2050-architecture-role",
  "digital-customer-experience-utilities": "digital-customer-experience-utilities",
  "cybersecurity-architecture-operational-technology": "cybersecurity-architecture-operational-technology",
  "enterprise-architecture-governance-leading-ea-office": "enterprise-architecture-governance-leading-ea-office",
};

export function mapToStage2CourseId(stage1Id: string, fallback?: string): string {
  return stage1ToStage2CourseMap[stage1Id] ?? fallback ?? stage1Id;
}
