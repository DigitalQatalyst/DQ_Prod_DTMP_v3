import { bestPractices, type BestPractice } from "./bestPractices";
import { testimonials, type Testimonial } from "./testimonials";
import { playbooks, type Playbook } from "./playbooks";
import { libraryItems, type LibraryItem } from "./library";
import {
  mapBestPracticeToDepartment,
  mapIndustryToDepartment,
} from "./departmentMapping";

export type KnowledgeTab = "best-practices" | "testimonials" | "playbooks" | "library";

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

const toIsoDate = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toISOString().slice(0, 10);
};

const toMockIsoDateFromId = (value: string): string => {
  const hash = value
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const month = (hash % 12) + 1;
  const day = (hash % 27) + 1;
  return `2024-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const mapBestPractice = (item: BestPractice): KnowledgeItem => ({
  id: `best-practices:${item.id}`,
  sourceId: item.id,
  sourceTab: "best-practices",
  title: item.title,
  description: item.summary,
  type: item.contentType,
  department: mapBestPracticeToDepartment(item),
  tags: [item.domain, item.category, ...item.impactAreas],
  audience: "Practitioner",
  difficulty: `${item.maturityLevel} (${item.complexity})`,
  phase: "Discern",
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
  department: mapIndustryToDepartment(item.industry),
  tags: [item.organizationType, ...item.outcomeType, ...item.outcomes],
  audience: "All Roles",
  difficulty: "Applied",
  phase: item.phase,
  updatedAt: toIsoDate(item.date),
  author: item.speaker.name,
});

const mapPlaybook = (item: Playbook): KnowledgeItem => ({
  id: `playbooks:${item.id}`,
  sourceId: item.id,
  sourceTab: "playbooks",
  title: item.title,
  description: item.description,
  type: item.type,
  department: mapIndustryToDepartment(item.industry),
  tags: item.topics,
  audience: item.scope,
  difficulty: "Intermediate",
  phase: "Design",
  updatedAt: toMockIsoDateFromId(item.id),
  author: item.contributor,
});

const mapLibraryItem = (item: LibraryItem): KnowledgeItem => ({
  id: `library:${item.id}`,
  sourceId: item.id,
  sourceTab: "library",
  title: item.title,
  description: item.description,
  type: item.contentType,
  department: "Cross-Department",
  tags: item.topics,
  audience: item.audience,
  difficulty: item.length,
  phase: "Discern",
  updatedAt: toIsoDate(item.datePublished),
  author: item.author,
});

export const knowledgeItems: KnowledgeItem[] = [
  ...bestPractices.map(mapBestPractice),
  ...testimonials.map(mapTestimonial),
  ...playbooks.map(mapPlaybook),
  ...libraryItems.map(mapLibraryItem),
];

const knowledgeItemsByCompositeId = new Map(
  knowledgeItems.map((item) => [item.id, item])
);

export const getKnowledgeItem = (
  tab: KnowledgeTab,
  sourceId: string
): KnowledgeItem | undefined => knowledgeItemsByCompositeId.get(`${tab}:${sourceId}`);

export const getKnowledgeItemsByTab = (tab: KnowledgeTab): KnowledgeItem[] =>
  knowledgeItems.filter((item) => item.sourceTab === tab);

const scoreRelatedness = (base: KnowledgeItem, candidate: KnowledgeItem): number => {
  let score = 0;
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
    .slice(0, limit)
    .map((entry) => entry.item);
};
