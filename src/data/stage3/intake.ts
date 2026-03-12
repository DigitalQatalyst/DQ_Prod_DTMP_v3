/**
 * Stage 3 Intake Pipeline
 *
 * Each function atomically:
 *   1. Creates the marketplace-side TO request (in localStorage)
 *   2. Creates the linked Stage 3 request (in the in-memory array)
 *   3. Writes the bi-directional link back to the marketplace record
 *
 * This is the standard pattern to replicate for every new marketplace.
 */

import { createStage3Request } from "./requests";
import type { Stage3Priority } from "./types";
import {
  addTORequest,
  linkTORequestToStage3,
  type TORequestType,
} from "@/data/knowledgeCenter/requestState";
import {
  addLearningTORequest,
  linkLearningTORequestToStage3,
} from "@/data/learningCenter/requestState";

// ─── Knowledge Center ──────────────────────────────────────────────────────────

const knowledgeTitleMap: Record<TORequestType, string> = {
  clarification: "Knowledge: Clarification Request",
  "outdated-section": "Knowledge: Outdated Section Report",
  collaboration: "Knowledge: Collaboration Request",
};

/**
 * Creates a Knowledge Center TO request and a linked Stage 3 request in one
 * atomic operation. Returns both records, or null if the message is empty.
 */
export const createKnowledgeStage3Intake = (input: {
  itemId: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: string;
  type: TORequestType;
  message: string;
  sectionRef?: string;
  priority?: Stage3Priority;
}): { request: ReturnType<typeof addTORequest>; stage3: ReturnType<typeof createStage3Request> } | null => {
  // 1. Create the marketplace request
  const request = addTORequest({
    itemId: input.itemId,
    requesterName: input.requesterName,
    requesterRole: input.requesterRole,
    type: input.type,
    message: input.message,
    sectionRef: input.sectionRef,
  });
  if (!request) return null;

  // 2. Create the Stage 3 request
  const stage3 = createStage3Request({
    type: "knowledge-center",
    title: knowledgeTitleMap[input.type] ?? "Knowledge Center Request",
    description: input.sectionRef
      ? `[Section: ${input.sectionRef}] ${input.message}`
      : input.message,
    requester: {
      name: input.requesterName,
      email: input.requesterEmail,
      department: input.requesterRole,
      organization: "DTMP",
    },
    priority: input.priority ?? "medium",
    estimatedHours: input.type === "collaboration" ? 8 : 4,
    tags: ["knowledge-center", input.type],
    relatedAssets: [`knowledge-request:${request.id}`],
    notes: [
      `Submitted from Knowledge Center by ${input.requesterName}.`,
      `Request type: ${input.type}.`,
      ...(input.sectionRef ? [`Section reference: ${input.sectionRef}.`] : []),
    ],
  });

  // 3. Write the back-link onto the marketplace record
  linkTORequestToStage3(request.id, stage3.id);

  return { request, stage3 };
};

// ─── Learning Center — Escalation ─────────────────────────────────────────────

/**
 * Creates a Learning Center admin-escalation TO request and a linked Stage 3
 * request. Used when a learner needs a manual enrollment override or similar
 * admin action that must be actioned by the Transformation Office.
 */
export const createLearningEscalationStage3Intake = (input: {
  courseId: string;
  courseName: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: string;
  message: string;
  priority?: Stage3Priority;
}): { request: ReturnType<typeof addLearningTORequest>; stage3: ReturnType<typeof createStage3Request> } | null => {
  // 1. Create the marketplace request
  const request = addLearningTORequest({
    courseId: input.courseId,
    courseName: input.courseName,
    requesterName: input.requesterName,
    requesterRole: input.requesterRole,
    message: input.message,
  });
  if (!request) return null;

  // 2. Create the Stage 3 request
  const stage3 = createStage3Request({
    type: "learning-center",
    title: `Learning: Admin Escalation — ${input.courseName}`,
    description: input.message,
    requester: {
      name: input.requesterName,
      email: input.requesterEmail,
      department: input.requesterRole,
      organization: "DTMP",
    },
    priority: input.priority ?? "medium",
    estimatedHours: 4,
    tags: ["learning-center", "admin-escalation", input.courseId],
    relatedAssets: [`learning-request:${request.id}`],
    notes: [
      `Escalation from Learning Center by ${input.requesterName}.`,
      `Course: ${input.courseName} (${input.courseId}).`,
    ],
  });

  // 3. Write the back-link onto the marketplace record
  linkLearningTORequestToStage3(request.id, stage3.id);

  return { request, stage3 };
};

// ─── Learning Center — Change Review ──────────────────────────────────────────

import {
  submitLearningDraftChangeSet,
  attachStage3RequestToLearningChange,
  getLearningChangeSetById,
} from "@/data/learningCenter/changeReviewState";

/**
 * Submits a Learning Center change set draft for TO review and creates a linked
 * Stage 3 request. Used when a course manager submits settings/deletion changes
 * that require Transformation Office sign-off before they take effect.
 *
 * Returns null if the changeSetId is not found or the set is not in draft/submitted state.
 */
export const createLearningChangeReviewStage3Intake = (input: {
  changeSetId: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: string;
  priority?: Stage3Priority;
}): { stage3: ReturnType<typeof createStage3Request> } | null => {
  // 1. Transition the change set to "submitted" → "in-review"
  const submitted = submitLearningDraftChangeSet(input.changeSetId);
  if (!submitted) return null;

  const changeSet = getLearningChangeSetById(input.changeSetId);
  if (!changeSet) return null;

  // Determine priority from change set content if not explicitly supplied
  const derivedPriority: Stage3Priority =
    input.priority ??
    (changeSet.deleteRequested
      ? "high"
      : changeSet.diffs.length === 0
        ? "low"
        : "medium");

  // 2. Create the Stage 3 request
  const stage3 = createStage3Request({
    type: "learning-center",
    title: `Learning: Change Review — ${changeSet.courseName}`,
    description: changeSet.deleteRequested
      ? `Course deletion requested for "${changeSet.courseName}". Requires TO approval.`
      : `${changeSet.diffs.length} setting change(s) submitted for "${changeSet.courseName}". Requires TO review.`,
    requester: {
      name: input.requesterName,
      email: input.requesterEmail,
      department: input.requesterRole,
      organization: "DTMP",
    },
    priority: derivedPriority,
    estimatedHours: changeSet.deleteRequested ? 6 : 3,
    tags: [
      "learning-center",
      "change-review",
      changeSet.courseId,
      ...(changeSet.deleteRequested ? ["deletion"] : []),
    ],
    relatedAssets: [`learning-change:${changeSet.id}`],
    notes: [
      `Change set submitted by ${input.requesterName} for course "${changeSet.courseName}".`,
      changeSet.deleteRequested
        ? "Deletion requested — irreversible action, requires explicit TO approval."
        : `Fields changed: ${changeSet.diffs.map((d) => d.label).join(", ") || "none"}.`,
    ],
  });

  // 3. Attach the stage3 request id back to the change set and mark it in-review
  attachStage3RequestToLearningChange(changeSet.id, stage3.id);

  return { stage3 };
};

// ─── Support Services ──────────────────────────────────────────────────────────

import {
  addSupportTORequest,
  linkSupportTORequestToStage3,
  type SupportRequestType,
  type SupportRequestPriority,
} from "@/data/supportServices/requestState";

const supportPriorityMap: Record<SupportRequestPriority, Stage3Priority> = {
  critical: "critical",
  high: "high",
  medium: "medium",
  low: "low",
};

/**
 * Creates a Support Services TO request and a linked Stage 3 request in one
 * atomic operation. Returns both records, or null if subject or description is empty.
 */
export const createSupportStage3Intake = (input: {
  serviceId: string;
  serviceName: string;
  supportTicketId?: string;
  supportServiceRequestId?: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: string;
  type: SupportRequestType;
  priority: SupportRequestPriority;
  subject: string;
  description: string;
  category: string;
}): { request: ReturnType<typeof addSupportTORequest>; stage3: ReturnType<typeof createStage3Request> } | null => {
  // 1. Create the marketplace request
  const request = addSupportTORequest({
    serviceId: input.serviceId,
    serviceName: input.serviceName,
    supportTicketId: input.supportTicketId,
    supportServiceRequestId: input.supportServiceRequestId,
    requesterName: input.requesterName,
    requesterRole: input.requesterRole,
    type: input.type,
    priority: input.priority,
    subject: input.subject,
    description: input.description,
    category: input.category,
  });
  if (!request) return null;

  // 2. Create the Stage 3 request
  const stage3 = createStage3Request({
    type: "support-services",
    title: `Support: ${input.subject}`,
    description: `[${input.type.toUpperCase()}] [${input.category}] ${input.description}`,
    requester: {
      name: input.requesterName,
      email: input.requesterEmail,
      department: input.requesterRole,
      organization: "DTMP",
    },
    priority: supportPriorityMap[input.priority],
    estimatedHours: input.priority === "critical" ? 2 : input.priority === "high" ? 4 : 8,
    tags: ["support-services", input.type, input.category.toLowerCase().replace(/\s+/g, "-")],
    relatedAssets: [`support-request:${request.id}`],
    notes: [
      `Support request submitted by ${input.requesterName}.`,
      `Service: ${input.serviceName}.`,
      `Type: ${input.type}; Priority: ${input.priority}; Category: ${input.category}.`,
    ],
  });

  // 3. Write the back-link onto the marketplace record
  linkSupportTORequestToStage3(request.id, stage3.id);

  return { request, stage3 };
};

// ─── Blueprints — Solution Specs ──────────────────────────────────────────────

import {
  addBlueprintTORequest,
  linkBlueprintTORequestToStage3,
} from "@/data/blueprints/requestState";

/**
 * Creates a Solution Spec TO request and a linked Stage 3 request in one
 * atomic operation. Returns both records, or null if message is empty.
 */
export const createSolutionSpecStage3Intake = (input: {
  specId: string;
  specTitle: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: string;
  message: string;
  priority?: Stage3Priority;
}): { request: ReturnType<typeof addBlueprintTORequest>; stage3: ReturnType<typeof createStage3Request> } | null => {
  // 1. Create the marketplace request
  const request = addBlueprintTORequest({
    itemId: input.specId,
    itemTitle: input.specTitle,
    marketplace: "solution-specs",
    requesterName: input.requesterName,
    requesterRole: input.requesterRole,
    message: input.message,
  });
  if (!request) return null;

  // 2. Create the Stage 3 request
  const stage3 = createStage3Request({
    type: "solution-specs",
    title: `Solution Spec Request — ${input.specTitle}`,
    description: input.message,
    requester: {
      name: input.requesterName,
      email: input.requesterEmail,
      department: input.requesterRole,
      organization: "DTMP",
    },
    priority: input.priority ?? "medium",
    estimatedHours: 6,
    tags: ["solution-specs", input.specId],
    relatedAssets: [`solution-spec-request:${request.id}`],
    notes: [
      `Solution Spec request submitted by ${input.requesterName}.`,
      `Spec: ${input.specTitle} (${input.specId}).`,
    ],
  });

  // 3. Write the back-link onto the marketplace record
  linkBlueprintTORequestToStage3(request.id, stage3.id);

  return { request, stage3 };
};

/**
 * Creates a Solution Build TO request and a linked Stage 3 request in one
 * atomic operation. Returns both records, or null if message is empty.
 */
export const createSolutionBuildStage3Intake = (input: {
  buildId: string;
  buildTitle: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: string;
  message: string;
  priority?: Stage3Priority;
}): { request: ReturnType<typeof addBlueprintTORequest>; stage3: ReturnType<typeof createStage3Request> } | null => {
  // 1. Create the marketplace request
  const request = addBlueprintTORequest({
    itemId: input.buildId,
    itemTitle: input.buildTitle,
    marketplace: "solution-build",
    requesterName: input.requesterName,
    requesterRole: input.requesterRole,
    message: input.message,
  });
  if (!request) return null;

  // 2. Create the Stage 3 request
  const stage3 = createStage3Request({
    type: "solution-build",
    title: input.buildTitle,
    description: input.message,
    requester: {
      name: input.requesterName,
      email: input.requesterEmail,
      department: input.requesterRole,
      organization: "DTMP",
    },
    priority: input.priority ?? "medium",
    estimatedHours: 8,
    tags: ["solution-build", input.buildId],
    relatedAssets: [`solution-build-request:${request.id}`],
    notes: [
      `Solution Build request submitted by ${input.requesterName}.`,
      `Build: ${input.buildTitle} (${input.buildId}).`,
    ],
  });

  // 3. Write the back-link onto the marketplace record
  linkBlueprintTORequestToStage3(request.id, stage3.id);

  return { request, stage3 };
};

// ─── Templates (Document Studio) ──────────────────────────────────────────────

import {
  addTemplateTORequest,
  linkTemplateTORequestToStage3,
  type TemplateTab,
} from "@/data/templates/requestState";

/**
 * Creates a Document Studio template TO request and a linked Stage 3 request in
 * one atomic operation. Returns both records, or null if message is empty.
 */
export const createTemplateStage3Intake = (input: {
  templateId: string;
  templateTitle: string;
  tab: TemplateTab;
  requesterName: string;
  requesterEmail: string;
  requesterRole: string;
  message: string;
  priority?: Stage3Priority;
}): { request: ReturnType<typeof addTemplateTORequest>; stage3: ReturnType<typeof createStage3Request> } | null => {
  // 1. Create the marketplace request
  const request = addTemplateTORequest({
    templateId: input.templateId,
    templateTitle: input.templateTitle,
    tab: input.tab,
    requesterName: input.requesterName,
    requesterRole: input.requesterRole,
    message: input.message,
  });
  if (!request) return null;

  const tabLabel = input.tab === "application-profiles" ? "Application Profile" : "Assessment";

  // 2. Create the Stage 3 request
  const stage3 = createStage3Request({
    type: "dtmp-templates",
    title: `Template Request — ${input.templateTitle}`,
    description: `[${tabLabel}] ${input.message}`,
    requester: {
      name: input.requesterName,
      email: input.requesterEmail,
      department: input.requesterRole,
      organization: "DTMP",
    },
    priority: input.priority ?? "low",
    estimatedHours: 3,
    tags: ["dtmp-templates", input.tab, input.templateId],
    relatedAssets: [`template-request:${request.id}`],
    notes: [
      `Template service request submitted by ${input.requesterName}.`,
      `Template: ${input.templateTitle} (${input.tab}).`,
    ],
  });

  // 3. Write the back-link onto the marketplace record
  linkTemplateTORequestToStage3(request.id, stage3.id);

  return { request, stage3 };
};

// ─── Digital Intelligence ──────────────────────────────────────────────────────

import {
  addDITORequest,
  linkDITORequestToStage3,
  type DIServiceTab,
} from "@/data/digitalIntelligence/requestState";

/**
 * Creates a Digital Intelligence TO request and a linked Stage 3 request in one
 * atomic operation. Returns both records, or null if message is empty.
 */
export const createDIStage3Intake = (input: {
  serviceId: string;
  serviceTitle: string;
  tab: DIServiceTab;
  requesterName: string;
  requesterEmail: string;
  requesterRole: string;
  message: string;
  priority?: Stage3Priority;
}): { request: ReturnType<typeof addDITORequest>; stage3: ReturnType<typeof createStage3Request> } | null => {
  // 1. Create the marketplace request
  const request = addDITORequest({
    serviceId: input.serviceId,
    serviceTitle: input.serviceTitle,
    tab: input.tab,
    requesterName: input.requesterName,
    requesterRole: input.requesterRole,
    message: input.message,
  });
  if (!request) return null;

  const tabLabel =
    input.tab === "systems-portfolio"
      ? "Systems Portfolio"
      : input.tab === "digital-maturity"
        ? "Digital Maturity"
        : "Projects Portfolio";

  // 2. Create the Stage 3 request
  const stage3 = createStage3Request({
    type: "digital-intelligence",
    title: `Digital Intelligence — ${input.serviceTitle}`,
    description: `[${tabLabel}] ${input.message}`,
    requester: {
      name: input.requesterName,
      email: input.requesterEmail,
      department: input.requesterRole,
      organization: "DTMP",
    },
    priority: input.priority ?? "medium",
    estimatedHours: 5,
    tags: ["digital-intelligence", input.tab, input.serviceId, `service-id:${input.serviceId}`],
    relatedAssets: [`di-request:${request.id}`, `di-dashboard:${input.serviceId}`],
    notes: [
      `Digital Intelligence access request submitted by ${input.requesterName}.`,
      `Service: ${input.serviceTitle} (${tabLabel}).`,
    ],
  });

  // 3. Write the back-link onto the marketplace record
  linkDITORequestToStage3(request.id, stage3.id);

  return { request, stage3 };
};

// ─── Portfolio Management ──────────────────────────────────────────────────────

import {
  addPortfolioRequest,
  linkPortfolioRequestToStage3,
  type PortfolioRequestType,
} from "@/data/portfolio/requestState";

const portfolioTitleMap: Record<PortfolioRequestType, string> = {
  assessment: "Portfolio Assessment Request",
  analysis: "Portfolio Analysis Request",
  optimization: "Portfolio Optimization Request",
  dashboard: "Portfolio Dashboard Request",
  consultation: "Portfolio Consultation Request",
};

/**
 * Creates a Portfolio Management TO request and a linked Stage 3 request in one
 * atomic operation. Returns both records, or null if the message is empty.
 */
export const createPortfolioStage3Intake = (input: {
  serviceId: string;
  serviceTitle: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: string;
  type: PortfolioRequestType;
  message: string;
  portfolioScope?: string;
  priority?: Stage3Priority;
  requestTitle?: string;
}): { request: ReturnType<typeof addPortfolioRequest>; stage3: ReturnType<typeof createStage3Request> } | null => {
  // 1. Create the marketplace request
  const request = addPortfolioRequest({
    serviceId: input.serviceId,
    requesterName: input.requesterName,
    requesterRole: input.requesterRole,
    type: input.type,
    message: input.message,
    portfolioScope: input.portfolioScope,
    requestTitle: input.requestTitle,
    priority: input.priority === "critical" ? "High" : input.priority === "high" ? "High" : input.priority === "low" ? "Low" : "Medium",
  });
  if (!request) return null;

  // 2. Create the Stage 3 request
  const stage3 = createStage3Request({
    type: "portfolio-management",
    title: `${portfolioTitleMap[input.type]} — ${input.serviceTitle}`,
    description: input.portfolioScope
      ? `[Scope: ${input.portfolioScope}] ${input.message}`
      : input.message,
    requester: {
      name: input.requesterName,
      email: input.requesterEmail,
      department: input.requesterRole,
      organization: "DTMP",
    },
    priority: input.priority ?? "medium",
    estimatedHours: input.type === "assessment" ? 16 : input.type === "dashboard" ? 8 : 12,
    tags: ["portfolio-management", input.type, input.serviceId],
    relatedAssets: [`portfolio-request:${request.id}`],
    notes: [
      `Portfolio Management request submitted by ${input.requesterName}.`,
      `Service: ${input.serviceTitle}.`,
      `Request type: ${input.type}.`,
      ...(input.portfolioScope ? [`Portfolio scope: ${input.portfolioScope}.`] : []),
      ...(input.requestTitle ? [`Request title: ${input.requestTitle}.`] : []),
    ],
  });

  // 3. Write the back-link onto the marketplace record
  linkPortfolioRequestToStage3(request.id, stage3.id);

  return { request, stage3 };
};