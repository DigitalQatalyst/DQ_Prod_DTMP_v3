/** URL of the generated document content — used for Preview / Open Delivered Document / View Resource */
export const DS_DOCUMENT_URL = "https://dewatpdesignsummaryreport.lovable.app/";

export type DocumentStudioTab =
  | "assessments"
  | "application-profiles"
  | "design-reports";

export type AssessmentScope =
  | "Organisation-wide"
  | "Domain-specific"
  | "Project-level"
  | "Application-level";

export type DocumentStudioRequestStatus =
  | "submitted"
  | "assigned"
  | "in-progress"
  | "awaiting-approval"
  | "approved"
  | "completed"
  | "revision-requested"
  | "published-to-kc";

export type DesignReportDocumentType =
  | "Design Report"
  | "Design Infographic"
  | "RSR"
  | "HLAD";

export type DivisionName =
  | "Generation"
  | "Transmission"
  | "Distribution"
  | "Water Services"
  | "Customer Services"
  | "Digital DEWA & Moro Hub";

export type DbpStream = "DXP" | "DWS" | "DIA" | "SDO";

export interface DocumentStudioCard {
  id: string;
  tab: DocumentStudioTab;
  title: string;
  description: string;
  icon: string;
  aiBadge: "Full AI Generation" | "AI-Assisted";
  categoryBadge: string;
  pageRange: string;
  outputFormats: string[];
  specialFeature?: string;
  usageCount: number;
  detailSummary: string;
  detailSections: Array<{ title: string; body: string }>;
  filters: Record<string, string>;
  designReportMeta?: {
    documentType: DesignReportDocumentType;
    streams: DbpStream[];
    divisionOptions: DivisionName[];
  };
}

export interface DocumentStudioGeneratedDocument {
  id: string;
  fileName: string;
  format: "PDF" | "DOCX";
  fileUrl: string;
  version: string;
  generatedDate: string;
}

export interface DocumentStudioRevision {
  id: string;
  requestId: string;
  note: string;
  submittedDate: string;
  status: Exclude<DocumentStudioRequestStatus, "published-to-kc" | "approved">;
}

export interface DocumentStudioRequestFormData {
  selectedDocumentType: string;
  organisationBusinessUnit?: string;
  assessmentScope?: AssessmentScope;
  focusArea?: string;
  frameworkPreference?: string;
  targetAudience?: string;
  desiredOutputFormats?: string[];
  additionalNotes?: string;
  applicationName?: string;
  applicationType?: string;
  dbpDomain?: string;
  deploymentModel?: string;
  primaryUsers?: string;
  includeIntegrationMap?: boolean;
  includeTcd?: boolean;
  divisionBusinessUnit?: DivisionName;
  dbpStreams?: DbpStream[];
  programmeInitiativeName?: string;
  organisationContext?: string;
  strategicObjectives?: string;
  currentTechnologyLandscape?: string;
  keyRequirements?: string;
  architectureConstraints?: string;
  referenceDocuments?: string[];
  preferredOutputFormat?: "PDF" | "DOCX" | "Both";
}

export interface DocumentStudioRequest {
  id: string;
  tab: DocumentStudioTab;
  cardId: string;
  documentTypeName: string;
  title: string;
  submittedDate: string;
  assignedDate?: string;
  completedDate?: string;
  status: DocumentStudioRequestStatus;
  assignedTo?: string;
  requester: {
    name: string;
    email: string;
    department: string;
  };
  formData: DocumentStudioRequestFormData;
  generatedDocument?: DocumentStudioGeneratedDocument;
  revisionIds: string[];
  isPublishedToKnowledgeCenter?: boolean;
  knowledgeCenterDocumentId?: string;
}

export interface PublishedDesignReport {
  id: string;
  sourceRequestId: string;
  cardId: string;
  title: string;
  description: string;
  docTypeLabel: DesignReportDocumentType;
  format: "PDF" | "DOCX";
  division: DivisionName;
  stream: DbpStream;
  producedBy: string;
  publishedDate: string;
  author: string;
  pageCount: string;
  year: string;
  audienceTag: string;
  liveUrl: string;
  publicationNote?: string;
  visibility: "Enterprise-wide" | "Division-scoped";
}

export type DocumentStudioSlaPhase = "assign" | "complete";
export type DocumentStudioSlaHealth = "healthy" | "warning" | "breached";

const REQUESTS_KEY = "dtmp.documentStudio.requests";
const REVISIONS_KEY = "dtmp.documentStudio.revisions";
const PUBLISHED_KEY = "dtmp.documentStudio.publishedReports";

const isBrowser = typeof window !== "undefined";

const assessmentCards: DocumentStudioCard[] = [
  {
    id: "digital-maturity-assessment",
    tab: "assessments",
    title: "Digital Maturity Assessment",
    description:
      "Request a structured maturity assessment for a division, domain, or programme using your organisational context and target-state ambitions.",
    icon: "ClipboardCheck",
    aiBadge: "Full AI Generation",
    categoryBadge: "Maturity",
    pageRange: "25-35 pages",
    outputFormats: ["PDF", "DOCX"],
    specialFeature: "Benchmark data and recommendations",
    usageCount: 345,
    detailSummary:
      "A comprehensive maturity review covering current-state diagnostics, capability scoring, findings, and next-step recommendations.",
    detailSections: [
      {
        title: "What it covers",
        body: "Capability scoring, strengths and gaps, maturity heatmaps, and an action-led roadmap."
      },
      {
        title: "Best for",
        body: "Transformation offices, divisional leaders, and architecture teams preparing a target-state plan."
      },
    ],
    filters: {
      assessmentType: "Maturity",
      framework: "Custom",
      scope: "Organisation-wide",
    },
  },
  {
    id: "cloud-readiness-assessment",
    tab: "assessments",
    title: "Cloud Readiness Assessment",
    description:
      "Assess platform, security, governance, and operational readiness for cloud or hybrid cloud adoption.",
    icon: "Cloud",
    aiBadge: "AI-Assisted",
    categoryBadge: "Readiness",
    pageRange: "20-30 pages",
    outputFormats: ["PDF", "DOCX"],
    specialFeature: "Migration sequencing",
    usageCount: 212,
    detailSummary:
      "Evaluates organisational, technical, and control readiness for cloud migration or expansion.",
    detailSections: [
      {
        title: "What it covers",
        body: "Current-state hosting landscape, controls readiness, dependencies, and migration risks."
      },
      {
        title: "Best for",
        body: "Programmes assessing cloud adoption, Moro Hub alignment, and hybrid architecture planning."
      },
    ],
    filters: {
      assessmentType: "Readiness",
      framework: "Custom",
      scope: "Domain-specific",
    },
  },
];

const applicationProfileCards: DocumentStudioCard[] = [
  {
    id: "crm-application-profile",
    tab: "application-profiles",
    title: "CRM Application Profile",
    description:
      "Generate a structured application profile for a CRM platform using system context, deployment model, and user landscape.",
    icon: "LayoutGrid",
    aiBadge: "Full AI Generation",
    categoryBadge: "CRM",
    pageRange: "15-25 pages",
    outputFormats: ["PDF", "DOCX"],
    specialFeature: "Integration map",
    usageCount: 286,
    detailSummary:
      "Provides a complete view of application purpose, users, architecture, integrations, and deployment considerations.",
    detailSections: [
      {
        title: "What it covers",
        body: "Platform scope, business ownership, deployment model, interfaces, and operational posture."
      },
      {
        title: "Best for",
        body: "Portfolio teams, solution architects, and divisional stakeholders documenting enterprise applications."
      },
    ],
    filters: {
      applicationType: "CRM",
      deploymentModel: "SaaS",
      keyOutput: "Integration Map",
    },
  },
  {
    id: "analytics-platform-profile",
    tab: "application-profiles",
    title: "Analytics Platform Profile",
    description:
      "Generate a comprehensive application profile for analytics and data platforms with architecture, deployment, and operating context.",
    icon: "BarChart3",
    aiBadge: "Full AI Generation",
    categoryBadge: "Analytics",
    pageRange: "18-24 pages",
    outputFormats: ["PDF", "DOCX"],
    specialFeature: "TCD summary",
    usageCount: 198,
    detailSummary:
      "Captures platform role, consumers, interfaces, deployment posture, and cost or integration considerations.",
    detailSections: [
      {
        title: "What it covers",
        body: "Application overview, core functions, integrations, deployment model, and user/audience context."
      },
      {
        title: "Best for",
        body: "Data and analytics teams documenting critical platforms for governance and planning."
      },
    ],
    filters: {
      applicationType: "Analytics",
      deploymentModel: "Hybrid",
      keyOutput: "TCD Summary",
    },
  },
];

const designReportCards: DocumentStudioCard[] = [
  {
    id: "design-report",
    tab: "design-reports",
    title: "Design Report",
    description:
      "The primary design artefact for your chosen DBP stream, documenting architecture vision, platform components, integration design, and implementation roadmap.",
    icon: "Layers",
    aiBadge: "Full AI Generation",
    categoryBadge: "Design Report",
    pageRange: "25-40 pages",
    outputFormats: ["PDF"],
    specialFeature: "Architecture vision and roadmap",
    usageCount: 91,
    detailSummary:
      "Strategic specification output for programme architecture, platform composition, and implementation direction.",
    detailSections: [
      {
        title: "What it covers",
        body: "Architecture vision, capability model, component landscape, integrations, and implementation roadmap."
      },
      {
        title: "Best for",
        body: "Transformation programmes requiring a primary prescriptive design artefact."
      },
    ],
    filters: {
      documentType: "Design Report",
      dbpStream: "All Streams",
      division: "Transmission",
      outputFormat: "PDF",
      aiGeneration: "Full AI Generation",
    },
    designReportMeta: {
      documentType: "Design Report",
      streams: ["DXP", "DWS", "DIA", "SDO"],
      divisionOptions: [
        "Generation",
        "Transmission",
        "Distribution",
        "Water Services",
        "Customer Services",
        "Digital DEWA & Moro Hub",
      ],
    },
  },
  {
    id: "design-infographic",
    tab: "design-reports",
    title: "Design Infographic",
    description:
      "A one-page visual summary of the Design Report for leadership audiences, highlighting architecture decisions and transformation priorities.",
    icon: "FileText",
    aiBadge: "Full AI Generation",
    categoryBadge: "Design Infographic",
    pageRange: "1 page",
    outputFormats: ["PDF"],
    specialFeature: "Executive one-pager",
    usageCount: 74,
    detailSummary:
      "A concise one-page visual output showing platform direction, architecture highlights, and roadmap signals.",
    detailSections: [
      {
        title: "What it covers",
        body: "Executive summary of the architecture direction, transformation roadmap, and core platform components."
      },
      {
        title: "Best for",
        body: "Leadership updates, steering committees, and quick decision briefings."
      },
    ],
    filters: {
      documentType: "Design Infographic",
      dbpStream: "All Streams",
      division: "Transmission",
      outputFormat: "PDF",
      aiGeneration: "Full AI Generation",
    },
    designReportMeta: {
      documentType: "Design Infographic",
      streams: ["DXP", "DWS", "DIA", "SDO"],
      divisionOptions: [
        "Generation",
        "Transmission",
        "Distribution",
        "Water Services",
        "Customer Services",
        "Digital DEWA & Moro Hub",
      ],
    },
  },
  {
    id: "design-specifications-rsr",
    tab: "design-reports",
    title: "Design Specifications - RSR",
    description:
      "Detailed functional and non-functional requirements for the designed platform, used by delivery teams as the reference specification.",
    icon: "FileText",
    aiBadge: "Full AI Generation",
    categoryBadge: "RSR",
    pageRange: "20-35 pages",
    outputFormats: ["DOCX"],
    specialFeature: "Detailed requirements specification",
    usageCount: 58,
    detailSummary:
      "Requirement specification report covering functional, non-functional, integration, and compliance requirements.",
    detailSections: [
      {
        title: "What it covers",
        body: "Business, platform, integration, compliance, performance, and control requirements."
      },
      {
        title: "Best for",
        body: "Deployment teams requiring a structured technical requirement baseline."
      },
    ],
    filters: {
      documentType: "RSR",
      dbpStream: "All Streams",
      division: "Transmission",
      outputFormat: "DOCX",
      aiGeneration: "Full AI Generation",
    },
    designReportMeta: {
      documentType: "RSR",
      streams: ["DXP", "DWS", "DIA", "SDO"],
      divisionOptions: [
        "Generation",
        "Transmission",
        "Distribution",
        "Water Services",
        "Customer Services",
        "Digital DEWA & Moro Hub",
      ],
    },
  },
  {
    id: "design-specifications-hlad",
    tab: "design-reports",
    title: "Design Specifications - HLAD",
    description:
      "High-level architecture document for the designed platform, covering components, integrations, technology decisions, and architectural trade-offs.",
    icon: "FileText",
    aiBadge: "Full AI Generation",
    categoryBadge: "HLAD",
    pageRange: "20-30 pages",
    outputFormats: ["DOCX"],
    specialFeature: "Architecture blueprint",
    usageCount: 64,
    detailSummary:
      "Architecture overview and component blueprint for delivery and governance teams.",
    detailSections: [
      {
        title: "What it covers",
        body: "High-level architecture, component boundaries, integration patterns, and technology stack choices."
      },
      {
        title: "Best for",
        body: "Architecture governance, delivery alignment, and implementation planning."
      },
    ],
    filters: {
      documentType: "HLAD",
      dbpStream: "All Streams",
      division: "Transmission",
      outputFormat: "DOCX",
      aiGeneration: "Full AI Generation",
    },
    designReportMeta: {
      documentType: "HLAD",
      streams: ["DXP", "DWS", "DIA", "SDO"],
      divisionOptions: [
        "Generation",
        "Transmission",
        "Distribution",
        "Water Services",
        "Customer Services",
        "Digital DEWA & Moro Hub",
      ],
    },
  },
];

export const documentStudioCards: Record<DocumentStudioTab, DocumentStudioCard[]> = {
  assessments: assessmentCards,
  "application-profiles": applicationProfileCards,
  "design-reports": designReportCards,
};

export const documentStudioFilters: Record<DocumentStudioTab, Record<string, string[]>> = {
  assessments: {
    assessmentType: ["Maturity", "Readiness", "Gap Analysis"],
    scope: ["Organisation-wide", "Domain-specific", "Project-level"],
    framework: ["Custom", "COBIT", "NIST", "ISO 27001"],
  },
  "application-profiles": {
    applicationType: ["CRM", "ERP", "Analytics", "Integration Platform"],
    deploymentModel: ["Cloud", "Hybrid", "On-Premise", "SaaS"],
    keyOutput: ["Integration Map", "TCD Summary", "Full Profile"],
  },
  "design-reports": {
    documentType: ["Design Report", "Design Infographic", "RSR", "HLAD"],
    dbpStream: ["All Streams", "DXP", "DWS", "DIA", "SDO"],
    division: [
      "Generation",
      "Transmission",
      "Distribution",
      "Water Services",
      "Customer Services",
      "Digital DEWA & Moro Hub",
    ],
    outputFormat: ["PDF", "DOCX"],
    aiGeneration: ["Full AI Generation", "AI-Assisted"],
  },
};

export const documentStudioTabMeta: Record<
  DocumentStudioTab,
  { label: string; description: string; phaseBadge: string; icon: string }
> = {
  assessments: {
    label: "Assessments",
    description:
      "Request a structured assessment of your organisation, systems, or projects using AI DocWriter and your submitted context.",
    phaseBadge: "DESIGN",
    icon: "ClipboardCheck",
  },
  "application-profiles": {
    label: "Application Profiles",
    description:
      "Request a comprehensive profile document for a specific application in your portfolio using your application data and context.",
    phaseBadge: "DESIGN",
    icon: "LayoutGrid",
  },
  "design-reports": {
    label: "Design Reports",
    description:
      "Request AI-generated design documents for your DBP stream including Design Reports, Infographics, RSRs, and HLADs.",
    phaseBadge: "DESIGN",
    icon: "Layers",
  },
};

const sampleRequester = {
  name: "John Doe",
  email: "john.doe@dewa.local",
  department: "Transformation Office",
};

const seedPublishedReport: PublishedDesignReport = {
  id: "published-design-report-dewa-transmission-dws",
  sourceRequestId: "req-design-report-seeded",
  cardId: "design-report",
  title: "Design Report - DEWA Transmission - DWS",
  description:
    "Published design report generated from the DEWA Transmission Power Division DWS request flow and approved for enterprise visibility.",
  docTypeLabel: "Design Report",
  format: "PDF",
  division: "Transmission",
  stream: "DWS",
  producedBy: "Transformation Office - DigitalQatalyst",
  publishedDate: "March 2026",
  author: "Transformation Office - DigitalQatalyst",
  pageCount: "Published Output",
  year: "2026",
  audienceTag: "Architect",
  liveUrl: DS_DOCUMENT_URL,
  publicationNote: "Approved showcase design artefact for the Document Studio demo flow.",
  visibility: "Enterprise-wide",
};

const seedRequests: DocumentStudioRequest[] = [
  {
    id: "req-design-report-seeded",
    tab: "design-reports",
    cardId: "design-report",
    documentTypeName: "Design Report",
    title: "Design Report - DEWA Transmission - DWS",
    submittedDate: "2026-03-10T08:15:00.000Z",
    assignedDate: "2026-03-10T12:00:00.000Z",
    completedDate: "2026-03-11T14:30:00.000Z",
    status: "published-to-kc",
    assignedTo: "Michael Chen",
    requester: sampleRequester,
    formData: {
      selectedDocumentType: "Design Report",
      divisionBusinessUnit: "Transmission",
      dbpStreams: ["DWS"],
      programmeInitiativeName: "Transmission Workplace Modernisation",
      organisationContext:
        "Transmission division requires a modern digital workplace architecture to support field, planning, and grid operations teams.",
      strategicObjectives:
        "Improve workforce productivity, strengthen architecture consistency, and align platform delivery with transformation roadmap objectives.",
      currentTechnologyLandscape:
        "Fragmented collaboration tooling, overlapping platforms, and limited integration with operational support workflows.",
      keyRequirements:
        "Unified collaboration services, secure integration points, governance controls, and a phased implementation roadmap.",
      architectureConstraints:
        "Existing security standards, integration constraints, and current vendor commitments must be respected.",
      preferredOutputFormat: "PDF",
      additionalNotes: "Seeded approved and published request for the demo.",
    },
    generatedDocument: {
      id: "doc-design-report-seeded",
      fileName: "Design_Report_DEWA_Transmission_DWS.pdf",
      format: "PDF",
      fileUrl: seedPublishedReport.liveUrl,
      version: "1.0",
      generatedDate: "2026-03-11T13:45:00.000Z",
    },
    revisionIds: [],
    isPublishedToKnowledgeCenter: true,
    knowledgeCenterDocumentId: seedPublishedReport.id,
  },
  {
    id: "req-assessment-seeded",
    tab: "assessments",
    cardId: "digital-maturity-assessment",
    documentTypeName: "Digital Maturity Assessment",
    title: "Digital Maturity Assessment - Corporate Services",
    submittedDate: "2026-03-11T09:00:00.000Z",
    assignedDate: "2026-03-11T11:00:00.000Z",
    status: "in-progress",
    assignedTo: "Sarah Miller",
    requester: sampleRequester,
    formData: {
      selectedDocumentType: "Digital Maturity Assessment",
      organisationBusinessUnit: "Corporate Services",
      assessmentScope: "Organisation-wide",
      focusArea: "Enterprise-wide digital capability maturity",
      frameworkPreference: "Custom",
      targetAudience: "Executive",
      desiredOutputFormats: ["PDF", "DOCX"],
      additionalNotes: "Seeded active assessment request.",
    },
    generatedDocument: {
      id: "doc-assessment-preview",
      fileName: "Digital_Maturity_Assessment_Draft.pdf",
      format: "PDF",
      fileUrl: DS_DOCUMENT_URL,
      version: "0.8",
      generatedDate: "2026-03-11T14:15:00.000Z",
    },
    revisionIds: [],
  },
];

const seedRevisions: DocumentStudioRevision[] = [];

const readLocal = <T,>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeLocal = <T,>(key: string, value: T) => {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const ensureSeeded = () => {
  if (!isBrowser) return;
  if (!window.localStorage.getItem(REQUESTS_KEY)) {
    writeLocal(REQUESTS_KEY, seedRequests);
  }
  if (!window.localStorage.getItem(REVISIONS_KEY)) {
    writeLocal(REVISIONS_KEY, seedRevisions);
  }
  if (!window.localStorage.getItem(PUBLISHED_KEY)) {
    writeLocal(PUBLISHED_KEY, [seedPublishedReport]);
  }
};

const nowIso = () => new Date().toISOString();

const nextId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

ensureSeeded();

export const listDocumentStudioCards = (tab: DocumentStudioTab) =>
  documentStudioCards[tab];

export const getDocumentStudioCard = (tab: DocumentStudioTab, cardId: string) =>
  documentStudioCards[tab].find((card) => card.id === cardId);

export const listDocumentStudioRequests = (): DocumentStudioRequest[] =>
  readLocal<DocumentStudioRequest[]>(REQUESTS_KEY, seedRequests);

export const listDocumentStudioRevisions = (): DocumentStudioRevision[] =>
  readLocal<DocumentStudioRevision[]>(REVISIONS_KEY, seedRevisions);

export const listPublishedDesignReports = (): PublishedDesignReport[] =>
  readLocal<PublishedDesignReport[]>(PUBLISHED_KEY, [seedPublishedReport]);

const persistRequests = (requests: DocumentStudioRequest[]) =>
  writeLocal(REQUESTS_KEY, requests);

const persistRevisions = (revisions: DocumentStudioRevision[]) =>
  writeLocal(REVISIONS_KEY, revisions);

const persistPublishedReports = (reports: PublishedDesignReport[]) =>
  writeLocal(PUBLISHED_KEY, reports);

export const createDocumentStudioRequest = (input: {
  tab: DocumentStudioTab;
  cardId: string;
  documentTypeName: string;
  title: string;
  requester?: DocumentStudioRequest["requester"];
  formData: DocumentStudioRequestFormData;
}): DocumentStudioRequest => {
  const request: DocumentStudioRequest = {
    id: nextId("req"),
    tab: input.tab,
    cardId: input.cardId,
    documentTypeName: input.documentTypeName,
    title: input.title,
    submittedDate: nowIso(),
    status: "submitted",
    requester: input.requester ?? sampleRequester,
    formData: input.formData,
    revisionIds: [],
  };
  const requests = [request, ...listDocumentStudioRequests()];
  persistRequests(requests);
  return request;
};

export const getDocumentStudioRequest = (requestId: string) =>
  listDocumentStudioRequests().find((request) => request.id === requestId);

export const updateDocumentStudioRequestStatus = (
  requestId: string,
  status: DocumentStudioRequestStatus,
  options?: Partial<Pick<DocumentStudioRequest, "assignedTo" | "generatedDocument" | "knowledgeCenterDocumentId" | "isPublishedToKnowledgeCenter">>
): DocumentStudioRequest | null => {
  const requests = listDocumentStudioRequests();
  const updatedRequests = requests.map((request) => {
    if (request.id !== requestId) return request;
    const next: DocumentStudioRequest = {
      ...request,
      ...options,
      status,
    };
    if (status === "assigned" && !next.assignedDate) {
      next.assignedDate = nowIso();
    }
    if (status === "completed" || status === "published-to-kc") {
      next.completedDate = nowIso();
    }
    return next;
  });
  persistRequests(updatedRequests);
  return updatedRequests.find((request) => request.id === requestId) ?? null;
};

export const approveDesignReportRequest = (requestId: string) =>
  updateDocumentStudioRequestStatus(requestId, "approved");

export const requestDocumentStudioRevision = (
  requestId: string,
  note: string
): DocumentStudioRevision | null => {
  const request = getDocumentStudioRequest(requestId);
  if (!request || !note.trim()) return null;
  const revision: DocumentStudioRevision = {
    id: nextId("rev"),
    requestId,
    note: note.trim(),
    submittedDate: nowIso(),
    status: "submitted",
  };
  const revisions = [revision, ...listDocumentStudioRevisions()];
  persistRevisions(revisions);

  const requests = listDocumentStudioRequests().map((entry) =>
    entry.id === requestId
      ? {
          ...entry,
          status: "revision-requested" as const,
          revisionIds: [revision.id, ...entry.revisionIds],
        }
      : entry
  );
  persistRequests(requests);
  return revision;
};

export const publishDesignReportToKnowledgeCenter = (
  requestId: string,
  publicationNote: string,
  visibility: "Enterprise-wide" | "Division-scoped"
): PublishedDesignReport | null => {
  const request = getDocumentStudioRequest(requestId);
  if (!request || request.tab !== "design-reports" || !request.generatedDocument) {
    return null;
  }

  const stream = request.formData.dbpStreams?.[0] ?? "DWS";
  const division = request.formData.divisionBusinessUnit ?? "Transmission";
  const publishedReport: PublishedDesignReport = {
    id: nextId("published-kc"),
    sourceRequestId: request.id,
    cardId: request.cardId,
    title: `${request.documentTypeName} - DEWA ${division} - ${stream}`,
    description:
      publicationNote.trim() ||
      `${request.formData.programmeInitiativeName ?? request.title}. ${request.formData.organisationContext ?? request.formData.additionalNotes ?? ""}`.trim(),
    docTypeLabel: (request.documentTypeName as DesignReportDocumentType) ?? "Design Report",
    format: request.generatedDocument.format,
    division,
    stream,
    producedBy: "Transformation Office - DigitalQatalyst",
    publishedDate: new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    author: "Transformation Office - DigitalQatalyst",
    pageCount:
      request.documentTypeName === "Design Infographic"
        ? "1 page"
        : request.documentTypeName === "Design Report"
          ? "Published Output"
          : "Generated Output",
    year: String(new Date().getFullYear()),
    audienceTag: "Architect",
    liveUrl: request.generatedDocument.fileUrl,
    publicationNote: publicationNote.trim() || undefined,
    visibility,
  };

  const reports = [publishedReport, ...listPublishedDesignReports()];
  persistPublishedReports(reports);
  updateDocumentStudioRequestStatus(requestId, "published-to-kc", {
    isPublishedToKnowledgeCenter: true,
    knowledgeCenterDocumentId: publishedReport.id,
  });
  return publishedReport;
};

export const ensureRequestHasGeneratedDocument = (
  requestId: string,
  assignedTo: string
): DocumentStudioRequest | null => {
  const request = getDocumentStudioRequest(requestId);
  if (!request) return null;

  const defaultFormat =
    request.tab === "design-reports"
      ? request.formData.preferredOutputFormat === "DOCX" ||
        request.documentTypeName === "RSR" ||
        request.documentTypeName === "HLAD"
        ? "DOCX"
        : "PDF"
      : (request.formData.desiredOutputFormats?.[0] as "PDF" | "DOCX" | undefined) ?? "PDF";

  return updateDocumentStudioRequestStatus(requestId, "awaiting-approval", {
    assignedTo,
    generatedDocument: {
      id: nextId("doc"),
      fileName: `${request.title.replace(/[^A-Za-z0-9]+/g, "_")}.${defaultFormat.toLowerCase()}`,
      format: defaultFormat,
      fileUrl: DS_DOCUMENT_URL,
      version: "1.0",
      generatedDate: nowIso(),
    },
  });
};

const hoursBetween = (start: string, end: string) =>
  Math.max(0, (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60));

export const getDocumentStudioAssignSlaHours = (request: DocumentStudioRequest) => {
  if (request.tab === "application-profiles") return 12;
  return 24;
};

export const getDocumentStudioCompleteSlaHours = (request: DocumentStudioRequest) => {
  if (request.tab === "application-profiles") return 3 * 24;
  if (request.tab === "design-reports") return 7 * 24;
  return 5 * 24;
};

export const getDocumentStudioSla = (
  request: DocumentStudioRequest,
  phase: DocumentStudioSlaPhase
) => {
  const now = nowIso();
  const start = phase === "assign" ? request.submittedDate : request.assignedDate ?? request.submittedDate;
  const end =
    phase === "assign"
      ? request.assignedDate ?? now
      : request.completedDate ??
        (request.status === "awaiting-approval" ||
        request.status === "approved" ||
        request.status === "published-to-kc"
          ? request.generatedDocument?.generatedDate ?? now
          : now);

  const elapsedHours = hoursBetween(start, end);
  const targetHours =
    phase === "assign"
      ? getDocumentStudioAssignSlaHours(request)
      : getDocumentStudioCompleteSlaHours(request);
  const ratio = targetHours === 0 ? 0 : elapsedHours / targetHours;
  const health: DocumentStudioSlaHealth =
    ratio >= 1 ? "breached" : ratio >= 0.7 ? "warning" : "healthy";

  return {
    elapsedHours,
    targetHours,
    health,
    label: `${Math.round(elapsedHours)}h / ${targetHours}h`,
  };
};
