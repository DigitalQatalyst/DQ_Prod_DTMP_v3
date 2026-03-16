import type { KnowledgeArticle } from "@/data/supportData";

export interface KnowledgeDetailContent {
  stepByStepActions: string[];
  keyTakeaways: string[];
  fullGuidance: string;
  whyThisMatters: string;
  signalsToWatch: string;
  ifIssuesPersist: string;
}

export interface NewSupportRequestForm {
  requestType: "incident" | "service-request" | "question" | "problem" | "change-request";
  category: string;
  priority: "critical" | "high" | "medium" | "low";
  subject: string;
  description: string;
  urgency: "blocking" | "important" | "not-urgent";
}

const supportSubServiceTabMap: Record<string, string> = {
  overview: "support-overview",
  tickets: "support-tickets",
  requests: "support-requests",
  "new-request": "support-tickets",
  history: "support-history",
  team: "support-team",
  analytics: "support-analytics",
};

export const normalizeSupportSubService = (value?: string | null): string | null => {
  if (!value) return null;
  if (value === "support-new-request") return "support-tickets";
  if (value === "knowledge" || value === "support-knowledge" || value === "support-knowledge-detail") {
    return "support-overview";
  }
  if (value.startsWith("support-")) return value;
  return supportSubServiceTabMap[value] || null;
};

export const supportCategoryOptions = [
  "Portfolio Management",
  "Learning Center",
  "Knowledge Center",
  "Digital Intelligence",
  "Solutions Specifications",
  "Solutions Build",
  "Lifecycle Management",
  "Platform/Account",
  "Other",
];

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const withPeriod = (value: string) => (/[.!?]$/.test(value) ? value : `${value}.`);

const knowledgeDetailOverrides: Record<string, Partial<KnowledgeDetailContent>> = {
  "KB-00120": {
    stepByStepActions: ["SPF, DKIM, DMARC checks and queue monitoring steps."],
    keyTakeaways: ["Checklist to troubleshoot outbound email delays and failures."],
    fullGuidance: "SPF, DKIM, DMARC checks and queue monitoring steps.",
    whyThisMatters: "Checklist to troubleshoot outbound email delays and failures.",
    signalsToWatch:
      "Look for recurring themes like email, delivery, queue in user reports or monitoring alerts; they often indicate the same root causes described here.",
    ifIssuesPersist:
      "Capture logs/screenshots and submit a Support Services request from this page so the team can triage with the context above.",
  },
};

export const buildKnowledgeDetailContent = (article: KnowledgeArticle): KnowledgeDetailContent => {
  const plainContent = stripHtml(article.content);
  const summary = withPeriod(article.summary.trim());
  const guidance = withPeriod((plainContent || article.summary).trim());
  const area = (article.subcategory || article.category).toLowerCase();
  const tagsLabel = article.tags.join(", ");

  const defaults: KnowledgeDetailContent = {
    stepByStepActions: [guidance],
    keyTakeaways: [summary],
    fullGuidance: guidance,
    whyThisMatters: `Resolving ${area} issues quickly reduces repeat incidents and business disruption.`,
    signalsToWatch: tagsLabel
      ? `Look for recurring themes like ${tagsLabel} in user reports or monitoring alerts; they often indicate the same root causes described here.`
      : "Look for recurring user reports and monitoring alerts that indicate repeat failure patterns.",
    ifIssuesPersist:
      "Capture logs/screenshots and submit a Support Services request from this page so the team can triage with the same context above.",
  };

  const override = knowledgeDetailOverrides[article.id];
  if (!override) {
    return defaults;
  }

  return {
    ...defaults,
    ...override,
    stepByStepActions: override.stepByStepActions ?? defaults.stepByStepActions,
    keyTakeaways: override.keyTakeaways ?? defaults.keyTakeaways,
  };
};

export const supportSubServices = [
  { id: "support-overview", name: "Overview", description: "Dashboards & SLAs" },
  { id: "support-tickets", name: "My Tickets", description: "Track incidents" },
  { id: "support-requests", name: "Service Requests", description: "Access & changes" },
  { id: "support-history", name: "Request History", description: "Past and closed requests" },
  { id: "support-team", name: "Team Dashboard", description: "Manager operations view" },
  { id: "support-analytics", name: "Support Analytics", description: "TO metrics and trends" },
];

