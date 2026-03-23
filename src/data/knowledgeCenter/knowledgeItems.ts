import { bestPractices, type BestPractice } from "./bestPractices";
import { testimonials, type Testimonial } from "./testimonials";
import { playbooks, type Playbook } from "./playbooks";
import {
  designReports,
  policiesProcedures,
  executiveSummaries,
  strategyDocs,
  architectureStandards,
  governanceFrameworks,
  type DewaDocumentItem,
} from "./dewaDocuments";

export type KnowledgeTab =
  | "best-practices"
  | "testimonials"
  | "playbooks"
  | "design-reports"
  | "policies-procedures"
  | "executive-summaries"
  | "strategy-docs"
  | "architecture-standards"
  | "governance-frameworks";

export interface KnowledgeItem {
  id: string;
  sourceId: string;
  sourceTab: KnowledgeTab;
  title: string;
  description: string;
  type: string;
  department: string;
  tags: string[];
  audience: string;
  difficulty: string;
  phase: string;
  updatedAt: string;
  author: string;
}

const mapBestPractice = (item: BestPractice): KnowledgeItem => ({
  id: `best-practices:${item.id}`,
  sourceId: item.id,
  sourceTab: "best-practices",
  title: item.title,
  description: item.summary,
  type: item.contentType,
  department: item.divisionTags.join(", "),
  tags: [item.domain, item.category, ...item.impactAreas],
  audience: "Practitioner",
  difficulty: `${item.maturityBand} (${item.complexity})`,
  phase: item.maturityLevel,
  updatedAt: item.dateAdded,
  author: "Transformation Office",
});

const mapTestimonial = (item: Testimonial): KnowledgeItem => ({
  id: `testimonials:${item.id}`,
  sourceId: item.id,
  sourceTab: "testimonials",
  title: item.title,
  description: item.quote,
  type: "Case Study",
  department: item.department,
  tags: [item.sectorTag, ...item.outcomes],
  audience: "All Roles",
  difficulty: "Applied",
  phase: item.phase,
  updatedAt: item.date,
  author: item.speaker.name,
});

const mapPlaybook = (item: Playbook): KnowledgeItem => ({
  id: `playbooks:${item.id}`,
  sourceId: item.id,
  sourceTab: "playbooks",
  title: item.title,
  description: item.description,
  type: item.type,
  department: item.departmentTag,
  tags: [...item.topics, item.dewaRelevanceTag],
  audience: item.scope,
  difficulty: item.format,
  phase: "Design",
  updatedAt: "2026-03-01",
  author: item.contributor,
});

const mapDocument = (tab: KnowledgeTab, item: DewaDocumentItem): KnowledgeItem => ({
  id: `${tab}:${item.id}`,
  sourceId: item.id,
  sourceTab: tab,
  title: item.title,
  description: item.description,
  type: item.docTypeLabel ?? item.documentSubType ?? item.domainLabel,
  department: item.division ?? item.domainLabel,
  tags: item.topicPills,
  audience: item.audienceTag,
  difficulty: item.pageCount,
  phase: "Discern",
  updatedAt: item.publishedDate ?? item.year,
  author: item.author,
});

export const knowledgeItems: KnowledgeItem[] = [
  ...bestPractices.map(mapBestPractice),
  ...testimonials.map(mapTestimonial),
  ...playbooks.map(mapPlaybook),
  ...designReports.map((item) => mapDocument("design-reports", item)),
  ...policiesProcedures.map((item) => mapDocument("policies-procedures", item)),
  ...executiveSummaries.map((item) => mapDocument("executive-summaries", item)),
  ...strategyDocs.map((item) => mapDocument("strategy-docs", item)),
  ...architectureStandards.map((item) => mapDocument("architecture-standards", item)),
  ...governanceFrameworks.map((item) => mapDocument("governance-frameworks", item)),
];

const knowledgeItemsByCompositeId = new Map(knowledgeItems.map((item) => [item.id, item]));

export const getKnowledgeItem = (tab: KnowledgeTab, sourceId: string): KnowledgeItem | undefined =>
  knowledgeItemsByCompositeId.get(`${tab}:${sourceId}`);

export const getKnowledgeItemsByTab = (tab: KnowledgeTab): KnowledgeItem[] =>
  knowledgeItems.filter((item) => item.sourceTab === tab);

const scoreRelatedness = (base: KnowledgeItem, candidate: KnowledgeItem): number => {
  let score = 0;
  if (base.sourceTab === candidate.sourceTab) score += 8;
  if (base.department === candidate.department) score += 4;
  if (base.type === candidate.type) score += 2;
  if (base.phase === candidate.phase) score += 1;
  const tagOverlap = candidate.tags.filter((tag) => base.tags.includes(tag)).length;
  score += tagOverlap * 2;
  return score;
};

export const getRelatedKnowledgeItems = (
  tab: KnowledgeTab,
  sourceId: string,
  limit = 4
): KnowledgeItem[] => {
  const base = getKnowledgeItem(tab, sourceId);
  if (!base) return [];

  return knowledgeItems
    .filter((item) => item.id !== base.id)
    .map((item) => ({ item, score: scoreRelatedness(base, item) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item)
    .slice(0, limit);
};
