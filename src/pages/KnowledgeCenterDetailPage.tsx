import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, useLocation, useSearchParams, Link } from "react-router-dom";
import {
  AlertTriangle,
  Bookmark,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Image,
  MessageSquare,
  Pencil,
  Star,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { DEWAOrgChart } from "@/components/diagrams/DEWAOrgChart";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { LoginModal } from "@/components/learningCenter/LoginModal";
import { bestPractices } from "@/data/knowledgeCenter/bestPractices";
import { testimonials } from "@/data/knowledgeCenter/testimonials";
import { playbooks } from "@/data/knowledgeCenter/playbooks";
import {
  architectureStandards,
  executiveSummaries,
  getDesignReports,
  governanceFrameworks,
  policiesProcedures,
  strategyDocs,
  type DewaDocumentItem,
} from "@/data/knowledgeCenter/dewaDocuments";
import {
  getKnowledgeItem,
  getRelatedKnowledgeItems,
  type KnowledgeTab,
} from "@/data/knowledgeCenter/knowledgeItems";
import {
  isSavedKnowledgeItem,
  toggleSavedKnowledgeItem,
} from "@/data/knowledgeCenter/userKnowledgeState";
import { recordKnowledgeView } from "@/data/knowledgeCenter/userKnowledgeState";
import {
  recordKnowledgeViewMetric,
  recordHelpfulVoteMetric,
  recordReadingDepthMetric,
  recordStaleFlagMetric,
  getUserHelpfulVote,
  persistUserHelpfulVote,
} from "@/data/knowledgeCenter/analyticsState";
import {
  addTORequest,
  type TORequestType,
} from "@/data/knowledgeCenter/requestState";
import {
  getArticleEdit,
  saveArticleEdit,
  clearArticleEdit,
} from "@/data/knowledgeCenter/articleEdits";
import {
  getUserArticle,
  type UserArticle,
} from "@/data/knowledgeCenter/userArticlesState";
import {
  addKnowledgeComment,
  getCollaboratorDirectory,
  getCommentsForKnowledgeItem,
  type KnowledgeComment,
} from "@/data/knowledgeCenter/collaborationState";

type DetailTab = "about" | "implementation" | "examples" | "resources" | "discussion";

const validTabs: KnowledgeTab[] = [
  "best-practices",
  "testimonials",
  "playbooks",
  "design-reports",
  "policies-procedures",
  "executive-summaries",
  "strategy-docs",
  "architecture-standards",
  "governance-frameworks",
];

const tabLabels: Record<KnowledgeTab, string> = {
  "best-practices": "Best Practices",
  testimonials: "Testimonials",
  playbooks: "Industry Playbooks",
  "design-reports": "Design Reports",
  "policies-procedures": "Policies & Procedures",
  "executive-summaries": "Executive Summaries",
  "strategy-docs": "Strategy Docs",
  "architecture-standards": "Architecture Standards",
  "governance-frameworks": "Governance Frameworks",
};

function highlightMentions(text: string): React.ReactNode {
  const parts = text.split(/(@\w[\w\s]*)/g);
  return parts.map((part, i) =>
    part.startsWith("@") ? (
      <span key={i} className="text-orange-600 font-medium">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

interface ArtefactSection {
  heading: string;
  body: string;
  node?: React.ReactNode;
}

function buildArtefactSections(
  tab: KnowledgeTab,
  item: { title?: string; description?: string; tags?: string[] } | undefined,
  knowledgeItem: { audience?: string; updatedAt?: string; author?: string } | undefined,
  document: DewaDocumentItem | null,
  cardId?: string
): ArtefactSection[] {
  const description =
    item && "description" in item && typeof (item as Record<string, unknown>).description === "string"
      ? (item as { description: string }).description
      : "";
  const tags: string[] =
    knowledgeItem && "tags" in knowledgeItem
      ? ((knowledgeItem as unknown as { tags: string[] }).tags ?? [])
      : item && "tags" in item
      ? ((item as unknown as { tags: string[] }).tags ?? [])
      : [];
  const audience = knowledgeItem?.audience;

  switch (tab) {
    case "best-practices":
      return [
        { heading: "Practice Overview", body: description },
        {
          heading: "Key Principles",
          body:
            "This best practice establishes the following foundational principles for DEWA's transformation programmes:\n\n• " +
            tags.join("\n• "),
        },
        {
          heading: "Implementation Guidance",
          body: "Applying this practice within DEWA's context requires alignment with the 4D Governance Model and the Digital Blueprint Programme. Teams should validate applicability against their division's current maturity level before adoption.",
        },
        {
          heading: "DEWA Application Context",
          body: `This resource is applicable across ${audience ?? "all"} stakeholders within DEWA. It has been assessed against DEWA's transformation architecture requirements and approved for reference use within active programme workstreams.`,
        },
      ];

    case "testimonials":
      return [
        { heading: "Organisation Background", body: description },
        {
          heading: "Challenge Statement",
          body: "The organisation faced significant challenges in aligning transformation initiatives with operational continuity requirements — a pattern consistent with DEWA's own digital transformation journey under the DTMP framework.",
        },
        {
          heading: "Outcomes Achieved",
          body:
            "Post-implementation signals indicated measurable improvement across the target domains. Key outcomes include:\n\n• " +
            tags.join("\n• "),
        },
        {
          heading: "DEWA Relevance Signal",
          body: `This testimonial has been reviewed and classified as a high-relevance reference for DEWA's ${audience ?? "programme teams"}. TO teams should consider this signal when developing similar transformation strategies.`,
        },
      ];

    case "playbooks":
      return [
        { heading: "Playbook Overview", body: description },
        {
          heading: "Step-by-Step Guidance",
          body: "This playbook follows a structured delivery sequence. Practitioners should adapt each step to the DEWA operating model, ensuring alignment with active programme governance requirements.\n\nStep 1 — Assess current state against the playbook's baseline criteria.\nStep 2 — Identify gaps and map them to DEWA's transformation priorities.\nStep 3 — Execute playbook activities with TO oversight.\nStep 4 — Validate outcomes against the defined success metrics.",
        },
        {
          heading: "Tools & Templates",
          body:
            "Supporting tools for this playbook are available through the DTMP platform. Key topics covered: " +
            tags.join(", "),
        },
        {
          heading: "Success Metrics",
          body: `Outcomes should be measured against DEWA's programme KPIs. Audience: ${knowledgeItem?.audience ?? "Programme teams"}. Last validated: ${knowledgeItem?.updatedAt ?? "2025"}`,
        },
      ];

    case "policies-procedures":
      return [
        { heading: "Policy Statement", body: description },
        {
          heading: "Scope & Applicability",
          body: `This policy applies to all ${knowledgeItem?.audience ?? "DEWA staff"} involved in transformation programme delivery. Exceptions must be approved by the Transformation Office.`,
        },
        {
          heading: "Responsibilities",
          body: "• Transformation Office: Policy ownership and governance\n• Division Leads: Implementation and compliance\n• Programme Teams: Adherence to procedure steps\n• Audit Function: Compliance verification",
        },
        {
          heading: "Procedure Steps",
          body: "1. Review this policy in the context of the relevant programme workstream.\n2. Confirm applicability with your Division Lead.\n3. Document compliance in the programme governance log.\n4. Escalate exceptions to the TO within 5 business days.\n5. Review annually or when triggered by a programme change event.",
        },
        {
          heading: "Compliance & Review",
          body: `Non-compliance with this policy must be reported to the Transformation Office. This document is reviewed annually. Version: ${document?.version ?? "v1.0"}. Status: ${document?.statusBadge ?? "Active"}`,
        },
      ];

    case "executive-summaries":
      return [
        { heading: "Executive Summary", body: description },
        {
          heading: "Context",
          body: `This summary has been prepared for ${knowledgeItem?.audience ?? "DEWA executive leadership"} and presents key findings relevant to the DTMP transformation programme.`,
        },
        {
          heading: "Key Findings",
          body:
            "The analysis covers the following domains: " +
            tags.join(", ") +
            ". Each domain was assessed against DEWA's strategic objectives and the 4D Governance Model benchmarks.",
        },
        {
          heading: "Recommendations",
          body: "The Transformation Office recommends the following actions:\n1. Prioritise alignment of the findings with active programme roadmaps.\n2. Engage division leads for domain-specific implementation planning.\n3. Schedule a review with the TO within 30 days of reading this summary.",
        },
      ];

    case "strategy-docs":
      if (cardId === "dewa-dtmp-organisation-roles") return [
        {
          heading: "DEWA Organisational Structure",
          body: "",
          node: <DEWAOrgChart />,
        },
        {
          heading: "How DEWA Is Organised",
          body: "DEWA operates across seven divisions, a corporate and strategy layer, and a group of subsidiaries — each with distinct technology portfolios, transformation programmes, and architecture governance requirements.\n\nThe seven operating divisions are:\n\n• Generation — Power and water generation assets including the Jebel Ali Complex, Mohammed Bin Rashid Al Maktoum Solar Park, and desalination facilities.\n• Transmission — High-voltage electricity transmission networks, substations, and the Smart Grid 2021–2035 programme.\n• Distribution — Electricity distribution networks, customer connections, and smart metering infrastructure across Dubai.\n• Water & Civil Division — Desalination operations, water network management, the Hatta Hydroelectric Plant, and civil infrastructure.\n• Billing Services Division — Customer billing, smart collections, Rammas AI operations, and the Services 360 customer experience programme.\n• Innovation & The Future Division — AI platforms, Virtual Engineer, cybersecurity, and future technology programmes.\n• Power & Water Planning — Long-term capacity planning, demand forecasting, and strategic infrastructure investment governance.\n\nAbove the divisions sits Corporate & Strategy — home to the CEO, CIO, CDO, CTO, Corporate Strategy Office, and the Corporate EA Office. Alongside the organisation, DEWA Group Subsidiaries — Moro Hub, Empower, Etihad ESCO, and Digital X — operate under the same enterprise architecture framework.",
        },
        {
          heading: "The Corporate EA Office",
          body: "The Corporate EA Office is the authoritative body for all enterprise architecture decisions across DEWA. It operates at the corporate level and governs every division and subsidiary.\n\nKey responsibilities:\n\n• Set and enforce enterprise-wide architecture standards, principles, and patterns.\n• Govern the Digital Transformation Master Plan (DTMP) platform — the single system through which all architecture work is governed, documented, and delivered.\n• Review and approve significant technology and solution architecture decisions raised through divisional and programme teams.\n• Track transformation KPIs enterprise-wide and report Net-Zero architecture alignment to leadership.\n• Manage the cross-division architecture repository — blueprints, standards, and governance references accessible to all.\n\nThe EA Office is supported by divisional EA Leads in each of the seven divisions — the connective tissue between corporate mandates and divisional delivery.",
        },
        {
          heading: "Divisional EA Structure",
          body: "Each of DEWA's seven divisions has its own EA context within DTMP — a tailored view of resources, active programmes, and architecture governance relevant to that division's work.\n\nDivisional EA Leads are embedded within or closely aligned to each division. Their role is to:\n\n• Apply corporate architecture standards at the divisional level.\n• Contribute to and consume the shared blueprint library.\n• Review divisional solution designs before escalation to the Corporate EA Office.\n• Represent the division in cross-divisional architecture forums.\n• Track divisional programme progress against architecture compliance requirements.\n\nNo division operates in architectural isolation. Cross-division dependencies — particularly between Generation, Transmission, Distribution, and Water & Civil — are actively governed through the Corporate EA Office's cross-division alignment function.\n\nSubsidiary entities (Moro Hub, Empower, Etihad ESCO, Digital X) are governed through the DEWA Group EA framework, which aligns subsidiary architecture decisions to the same enterprise standards.",
        },
        {
          heading: "DTMP Role Framework",
          body: "DTMP is designed for every level of DEWA's organisation. Six primary role types engage with the platform, each with a distinct purpose:\n\n1. Corporate EA Office — platform owners and governance authority. Set standards, govern compliance, track KPIs, and manage the enterprise architecture repository.\n\n2. Executive & Strategy Leadership (CEO, CDO, CIO, CTO, Strategy Office) — strategic oversight. Govern the enterprise portfolio, prioritise cross-division investment, and track Net-Zero milestone progress.\n\n3. Division EA & Architecture Leads — standards translators. Apply corporate mandates at divisional level, contribute blueprints, review divisional solutions, and escalate cross-division dependencies.\n\n4. Innovation & AI Teams (Virtual Engineer, Rammas, AI Platforms) — technology architects. Govern AI platform architecture, oversee Virtual Engineer deployment, manage cognitive service integration standards.\n\n5. Project & Delivery Teams — execution layer. Access resources, submit architecture requests, track initiative progress against standards, and manage delivery through stage gates.\n\n6. Operations & Security Teams (IT/OT, SecDevOps, Lifecycle Ops) — operational governance. Govern IT/OT convergence, automation fitness assessments, security architecture compliance, and operational technology lifecycle.",
        },
        {
          heading: "How Each Role Uses DTMP",
          body: "DTMP provides each role with a different entry point into the platform depending on their primary need:\n\nCorporate EA Office → Stage 3 Dashboard — the governance workspace where standards are managed, compliance is tracked, and architecture decisions are recorded.\n\nExecutive Leadership → Portfolio Management marketplace — enterprise-wide visibility of active programmes, investment status, and strategic alignment across all divisions.\n\nDivision EA Leads → Knowledge Centre (Strategy tab) — the reference library for architecture standards, governance frameworks, and strategy documents that inform divisional decisions.\n\nInnovation & AI Teams → Digital Intelligence marketplace — AI-powered maturity insights, system analytics, and project intelligence for the division's most complex technology programmes.\n\nProject & Delivery Teams → Lifecycle Management marketplace — stage-gate governance, compliance checkpoints, and architecture review tracking for active programme delivery.\n\nOperations & Security Teams → Support Services marketplace — technical support, EA consultancy, and SecDevOps governance resources.\n\nAll roles start in the Learning Centre — the structured entry point for DTMP literacy, regardless of experience level or division.",
        },
        {
          heading: "Finding Your Place in DTMP",
          body: "If you are new to DTMP, the recommended starting point is the Learning Centre — structured learning tracks are available for every role and division.\n\nIf you know your division, navigate to your division's DTMP page from the landing page. Each divisional page provides a tailored view of active programmes, relevant marketplaces, and the roles that operate within it.\n\nIf you have a specific task — submitting an architecture request, accessing a blueprint, reviewing a governance document — navigate directly to the relevant marketplace from the 4D Marketplace hub.\n\nFor questions about which role applies to you, or how to access the Corporate EA Office, contact the Transformation Office through the Support Services marketplace.\n\nDocument owner: Corporate EA Office, DEWA Transformation Office. Review cadence: Annually. Audience: All DEWA staff and DEWA Group Subsidiary teams.",
        },
      ];
      if (cardId === "dewa-enterprise-architecture-strategy") return [
        {
          heading: "Strategic Context",
          body: "DEWA operates as one of the world's most advanced utilities — serving 1.27 million customer accounts across Dubai with a customer minutes lost rate of 0.94 per year, a benchmark recognised globally as best-in-class. Sustaining and advancing this performance while simultaneously executing one of the region's most ambitious digital transformation programmes requires a single, unified architecture discipline.\n\nThe DEWA Enterprise Architecture Strategy defines that discipline. It establishes the Corporate EA Office as the authoritative body governing all architecture decisions across DEWA's six operating divisions — Water Services, Electricity Generation, Electricity Networks, Customer Affairs, Digital DEWA, and Corporate Services. The strategy operationalises DEWA's status as an EA 4.0 practitioner — the highest recognised level of enterprise architecture maturity — and sets the trajectory for sustaining that maturity through the Digital Transformation Master Plan (DTMP) horizon of 2025–2030.\n\nAt its core, this strategy governs four strategic programmes simultaneously: the Digital DEWA initiative spanning Solar Power, Energy Storage, AI, and Digital Services; the AED 7 billion Smart Grid 2021–2035 programme; DEWA's Net-Zero 2050 commitment anchored by the 36% clean energy target by 2030 and the Mohammed Bin Rashid Al Maktoum Solar Park (targeting 8,000 MW capacity); and the enterprise-wide transformation of customer service delivery through Rammas and Services 360.",
        },
        {
          heading: "EA Office Mandate & Governance Model",
          body: "The Corporate EA Office operates as the single authority for all enterprise architecture decisions across DEWA. Its mandate covers four core responsibilities:\n\n• Architecture Governance — reviewing and approving all significant technology and solution architecture decisions raised through divisional and programme teams.\n• Standards & Principles — maintaining DEWA's architecture principles library, technology standards register, and integration patterns catalogue.\n• EA Capability Development — building and sustaining EA capability across the six divisions through the DTMP knowledge and learning infrastructure.\n• Strategic Alignment — ensuring every major investment decision is evaluated against DEWA's 2025–2030 transformation objectives and Net-Zero 2050 targets.\n\nThe governance model is operationalised through the 4D Framework — Discern, Design, Deploy, Drive — which sequences architecture activity from insight generation through to value realisation. All divisional programmes are required to demonstrate 4D alignment as a condition of architecture approval.",
        },
        {
          heading: "Architecture Principles",
          body: "The following architecture principles govern all design decisions across DEWA:\n\n1. Digital-First Design — all new solutions must be designed for digital delivery from inception, with no legacy-first assumptions.\n2. API-First Integration — systems must expose capabilities through governed APIs before any point-to-point integration is permitted.\n3. Cloud-Preferred Infrastructure — cloud-hosted or cloud-native deployment is the default. On-premise exceptions require formal EA Office approval.\n4. Data as a Strategic Asset — all solutions must comply with DEWA's enterprise data governance model; data must be accessible, governed, and reusable.\n5. Security by Design — cybersecurity controls (OT and IT) must be embedded at architecture stage, not retrofitted post-delivery.\n6. Sustainability Alignment — every architecture decision must be assessed against its carbon and energy impact in the context of Net-Zero 2050.\n7. Interoperability Over Customisation — standard interfaces and open architectures are preferred; vendor lock-in must be assessed and mitigated at design stage.",
        },
        {
          heading: "Key Strategic Initiatives",
          body: "This strategy governs architecture delivery across the following priority programmes:\n\n• Digital DEWA Programme — four-pillar strategy covering Solar Power, Energy Storage, AI & Cognitive Services, and Digital Service Delivery. The EA Office governs architectural consistency across all four pillars.\n\n• Smart Grid 2021–2035 — AED 7 billion investment in grid intelligence, IT/OT convergence, advanced metering infrastructure, and predictive network management. Architecture standards ensure vendor interoperability and data sovereignty.\n\n• Mohammed Bin Rashid Al Maktoum Solar Park — targeting 8,000 MW by 2030, the world's largest single-site solar park. EA governs the technology architecture for renewable integration, grid connectivity, and performance monitoring.\n\n• Net-Zero 2050 Architecture — systematic alignment of all technology investment decisions with DEWA's clean energy commitments, including the 36% renewable target by 2030, hydrogen pilot programmes, and demand-side management platforms.\n\n• Rammas & Services 360 — AI-powered customer service platform with over 60 million interactions processed. EA governs the integration architecture, AI governance layer, and omnichannel service delivery model.\n\n• EA 4.0 Capability Programme — sustaining DEWA's EA 4.0 practitioner status through ongoing capability investment, divisional architect development, and DTMP knowledge governance.",
        },
        {
          heading: "EA Maturity & Roadmap",
          body: "DEWA achieved EA 4.0 maturity recognition — placing it among a small number of global organisations operating at the highest level of enterprise architecture practice. The 2025–2030 roadmap focuses on three maturity horizons:\n\nHorizon 1 (2025–2026): Consolidation — standardise architecture governance processes across all six divisions; complete the DTMP platform rollout; establish divisional EA forums and review cadences.\n\nHorizon 2 (2026–2028): Integration — embed architecture decision-making into programme delivery pipelines; deploy automated architecture compliance checking; build the enterprise capability model integrating EA, data, and security domains.\n\nHorizon 3 (2028–2030): Anticipation — move from reactive governance to predictive architecture guidance; deploy AI-assisted architecture advisory capabilities through DTMP; align architecture investment model to DEWA's capital expenditure planning cycle.\n\nAll three horizons are governed through quarterly Architecture Review Board sessions, chaired by the Chief Architect and attended by divisional EA leads.",
        },
        {
          heading: "KPIs & Governance",
          body: "Success metrics for the EA Strategy are reviewed quarterly by the Architecture Review Board and reported to DEWA Executive Leadership biannually:\n\n• Architecture Compliance Rate — target ≥95% of major solution designs reviewed and approved prior to development commencement.\n• EA 4.0 Maturity Score — maintained at Level 4 across all five capability domains; target Level 5 in two domains by 2027.\n• Technical Debt Reduction — 20% reduction in legacy system footprint by 2027 measured against the 2024 baseline technology inventory.\n• Standards Adoption — 100% of new integration patterns comply with DEWA API-First standard by end 2025.\n• Divisional EA Coverage — all six divisions to have a qualified divisional architect embedded in programme delivery by Q2 2026.\n• Transformation Alignment Score — ≥90% of capital investment decisions assessed against DTMP strategic alignment criteria before approval.\n\nGovernance of this strategy is held by the Corporate EA Office. Review cadence: Annually with quarterly progress reporting. Document owner: Chief Enterprise Architect, DEWA Transformation Office.",
        },
      ];
      return [
        { heading: "Strategic Context", body: description },
        {
          heading: "Objectives",
          body:
            "This strategy document sets out the following objectives for DEWA's transformation programme:\n• " +
            tags.slice(0, 3).join("\n• "),
        },
        {
          heading: "Key Initiatives",
          body: "The following initiatives are outlined within this strategy. Each should be tracked through DEWA's programme management framework with TO oversight.",
        },
        {
          heading: "Roadmap Alignment",
          body: "This document aligns with DEWA's multi-year Digital Transformation Master Plan. Implementation timelines should be coordinated with the DTMP programme calendar.",
        },
        {
          heading: "KPIs & Governance",
          body: `Success will be measured against approved KPIs. Audience: ${knowledgeItem?.audience ?? "Leadership"}. Review cadence: Quarterly.`,
        },
      ];

    case "architecture-standards":
      return [
        { heading: "Standard Overview", body: description },
        {
          heading: "Technical Requirements",
          body:
            "Compliance with this architecture standard requires adherence to the following:\n• " +
            tags.slice(0, 4).join("\n• ") +
            "\n\nAll exceptions require formal TO approval and must be documented in the programme architecture log.",
        },
        {
          heading: "Implementation Guidelines",
          body: "Implementation of this standard must be coordinated with the Enterprise Architecture function. Teams should validate technical designs against this standard prior to solution sign-off.",
        },
        {
          heading: "Governance & Compliance",
          body: `This standard is governed by the DEWA Transformation Office. Non-conformance must be escalated through the programme architecture review process. Last reviewed: ${knowledgeItem?.updatedAt ?? "2025"}`,
        },
      ];

    case "governance-frameworks":
      return [
        { heading: "Framework Purpose", body: description },
        {
          heading: "Governance Structure",
          body: "This framework establishes a clear governance hierarchy for the relevant domain:\n• Strategic level: TO Leadership\n• Programme level: Division Governance Boards\n• Operational level: Programme Managers\n• Assurance level: Audit & Compliance Function",
        },
        {
          heading: "Processes & Accountabilities",
          body:
            "Key processes governed by this framework: " +
            tags.join(", ") +
            ". Each process owner is accountable to the Transformation Office for delivery and compliance.",
        },
        {
          heading: "Implementation Pathway",
          body: `Adoption of this framework follows a phased approach aligned to DEWA's transformation maturity model. Audience: ${knowledgeItem?.audience ?? "Governance teams"}.`,
        },
      ];

    default:
      return [{ heading: "Overview", body: description }];
  }
}

export default function KnowledgeCenterDetailPage() {
  const { tab, cardId } = useParams<{ tab: string; cardId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isStage2 = location.pathname.startsWith("/stage2/");
  const isEditMode = searchParams.get("mode") === "edit";
  const [contentTab, setContentTab] = useState<DetailTab>("about");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const normalizedTab = validTabs.includes(tab as KnowledgeTab)
    ? (tab as KnowledgeTab)
    : null;

  // ── Reading progress ──────────────────────────────────────────────────────
  const [readingDepth, setReadingDepth] = useState(0);
  const lastReportedDepth = useRef(0);

  // ── Helpful voting — initialise from persisted user choice ───────────────
  const [helpfulVote, setHelpfulVote] = useState<"yes" | "no" | null>(() =>
    cardId ? getUserHelpfulVote(cardId) : null
  );

  // ── Stale flag — inline context form ─────────────────────────────────────
  const [flagged, setFlagged] = useState(false);
  const [showFlagForm, setShowFlagForm] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [flagAssumptions, setFlagAssumptions] = useState("");

  // ── Request clarification panel ───────────────────────────────────────────
  const [showRequestPanel, setShowRequestPanel] = useState(false);
  const [requestType, setRequestType] = useState<TORequestType>("clarification");
  const [requestDraft, setRequestDraft] = useState("");
  const [requestSectionRef, setRequestSectionRef] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // ── Discussion / comments ─────────────────────────────────────────────────
  const [comments, setComments] = useState<KnowledgeComment[]>(() =>
    getCommentsForKnowledgeItem(cardId ?? "")
  );
  const [commentDraft, setCommentDraft] = useState("");
  const collaborators = useMemo(() => getCollaboratorDirectory(), []);

  // ── Artefact viewer — auto-open when coming from saved item or in edit mode
  const [showArtefact, setShowArtefact] = useState(
    () => searchParams.get("view") === "artefact" || searchParams.get("mode") === "edit"
  );
  const [downloadToast, setDownloadToast] = useState(false);

  // ── Edit mode state ───────────────────────────────────────────────────────
  const [editedSections, setEditedSections] = useState<Record<string, string>>(() => {
    if (!cardId) return {};
    return getArticleEdit(cardId)?.sections ?? {};
  });
  const [editSaved, setEditSaved] = useState(false);
  const [editDirty, setEditDirty] = useState(false);

  // ── Artefact viewer — collaboration panel ─────────────────────────────────
  const [artefactCommentDraft, setArtefactCommentDraft] = useState("");
  const [artefactCommentSubmitted, setArtefactCommentSubmitted] = useState(false);
  const [artefactRequestType, setArtefactRequestType] = useState<TORequestType>("clarification");
  const [artefactRequestDraft, setArtefactRequestDraft] = useState("");
  const [artefactRequestSectionRef, setArtefactRequestSectionRef] = useState("");
  const [artefactRequestSubmitted, setArtefactRequestSubmitted] = useState(false);
  const [artefactActivePanel, setArtefactActivePanel] = useState<"comment" | "request">("comment");
  const [loginModalAction, setLoginModalAction] = useState<"comment" | "request">("comment");

  const handleSaveEdits = () => {
    if (!cardId) return;
    saveArticleEdit(cardId, {
      sections: editedSections,
      editedBy: "Sarah Miller",
      editedAt: new Date().toISOString(),
    });
    setEditSaved(true);
    setEditDirty(false);
    setTimeout(() => setEditSaved(false), 3000);
  };

  const handleDiscardEdits = () => {
    if (!cardId) return;
    clearArticleEdit(cardId);
    setEditedSections({});
    setEditDirty(false);
  };

  const designReports = useMemo(() => getDesignReports(), []);

  const item = useMemo(() => {
    if (!normalizedTab || !cardId) return undefined;
    switch (normalizedTab) {
      case "best-practices":
        return bestPractices.find((entry) => entry.id === cardId);
      case "testimonials":
        return testimonials.find((entry) => entry.id === cardId);
      case "playbooks":
        return playbooks.find((entry) => entry.id === cardId);
      case "design-reports":
        return designReports.find((entry) => entry.id === cardId);
      case "policies-procedures":
        return policiesProcedures.find((entry) => entry.id === cardId);
      case "executive-summaries":
        return executiveSummaries.find((entry) => entry.id === cardId);
      case "strategy-docs":
        return strategyDocs.find((entry) => entry.id === cardId);
      case "architecture-standards":
        return architectureStandards.find((entry) => entry.id === cardId);
      case "governance-frameworks":
        return governanceFrameworks.find((entry) => entry.id === cardId);
    }
  }, [normalizedTab, cardId, designReports]);

  const knowledgeItem =
    normalizedTab && cardId ? getKnowledgeItem(normalizedTab, cardId) : undefined;
  const relatedItems =
    normalizedTab && cardId ? getRelatedKnowledgeItems(normalizedTab, cardId, 3) : [];

  // ── User-created article fallback ─────────────────────────────────────────
  const userArticle: UserArticle | null = (!item && cardId) ? getUserArticle(cardId) : null;

  // ── Record view on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (knowledgeItem && normalizedTab && cardId) {
      recordKnowledgeViewMetric(knowledgeItem.id);
      recordKnowledgeView(normalizedTab, cardId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knowledgeItem?.id]);

  // ── Reading progress tracking ─────────────────────────────────────────────
  useEffect(() => {
    if (!knowledgeItem) return;
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const depthPercent = Math.round(Math.min(100, (scrollTop / docHeight) * 100));
      setReadingDepth(depthPercent);
      if (depthPercent - lastReportedDepth.current >= 5) {
        lastReportedDepth.current = depthPercent;
        recordReadingDepthMetric(knowledgeItem.id, depthPercent);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [knowledgeItem]);

  if ((!item && !userArticle) || !normalizedTab || !cardId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Item Not Found</h1>
          <Button onClick={() => navigate("/marketplaces/knowledge-center")}>
            Back to Knowledge Centre
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // ── User-created article detail page ────────────────────────────────────
  if (userArticle && !item) {
    const tabLabel = tabLabels[userArticle.sourceTab] ?? userArticle.sourceTab;
    const uaDisplaySections: ArtefactSection[] = [
      { heading: "Summary", body: editedSections["Summary"] ?? userArticle.description },
      { heading: "Content", body: editedSections["Content"] ?? userArticle.body },
    ];
    const uaSaved = getArticleEdit(cardId);

    return (
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-8 lg:py-10">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex items-center text-sm text-muted-foreground mb-4 flex-wrap gap-1">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4 mx-1" />
              <Link to="/marketplaces/knowledge-center" className="hover:text-foreground transition-colors">Knowledge Centre</Link>
              <ChevronRight className="w-4 h-4 mx-1" />
              <Link to={`/marketplaces/knowledge-center?tab=${userArticle.sourceTab}`} className="hover:text-foreground transition-colors">{tabLabel}</Link>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="font-medium text-foreground">{userArticle.title}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                TO Created
              </span>
              {userArticle.department && (
                <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">{userArticle.department}</span>
              )}
              {userArticle.audience && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">{userArticle.audience}</span>
              )}
              {uaSaved && (
                <span className="bg-orange-50 text-orange-600 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Pencil className="w-3 h-3" />
                  Edited by TO · {new Date(uaSaved.editedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-primary-navy mb-2">{userArticle.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
              {userArticle.author && <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />{userArticle.author}</span>}
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{userArticle.createdAt.slice(0, 10)}</span>
              {userArticle.type && <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" />{userArticle.type}</span>}
            </div>

            {userArticle.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {userArticle.tags.map((tag) => (
                  <span key={tag} className="bg-orange-50 text-orange-700 text-xs px-2.5 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {isEditMode && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-700">TO Edit Mode</span>
                {editSaved && <span className="text-xs text-green-600 font-medium">✓ Saved</span>}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-orange-200 text-orange-700 hover:bg-orange-50"
                  onClick={handleDiscardEdits}
                  disabled={!editDirty}
                >
                  Discard
                </Button>
                <Button
                  size="sm"
                  className="text-xs bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={handleSaveEdits}
                  disabled={!editDirty}
                >
                  Save Changes
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-gray-500"
                  onClick={() => window.close()}
                >
                  <X className="w-3 h-3 mr-1" /> Close
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {uaDisplaySections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-base font-semibold text-gray-800 mb-2 pb-1 border-b border-gray-100">
                  {section.heading}
                </h2>
                {isEditMode ? (
                  <Textarea
                    value={editedSections[section.heading] ?? section.body}
                    onChange={(e) => {
                      setEditedSections((prev) => ({ ...prev, [section.heading]: e.target.value }));
                      setEditDirty(true);
                    }}
                    rows={section.heading === "Content" ? 12 : 4}
                    className="text-sm text-gray-700 border-orange-200 focus:border-orange-400 focus:ring-orange-400 resize-none"
                  />
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{section.body}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => navigate(`/marketplaces/knowledge-center?tab=${userArticle.sourceTab}`)}
            >
              ← Back to {tabLabel}
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  const title = "title" in item ? item.title : "Knowledge Item";
  const description = "description" in item ? item.description : "";
  const isDocument =
    !("summary" in item) && !("quote" in item) && !("topics" in item && "coverGradient" in item);
  const isDesignReport = normalizedTab === "design-reports";
  const document = isDocument ? (item as DewaDocumentItem) : null;
  const isSaved = isSavedKnowledgeItem(normalizedTab, cardId);

  const metadataBadges = (() => {
    if ("divisionTags" in item) {
      return [...item.divisionTags, item.maturityLevel];
    }
    if ("sectorTag" in item) {
      return [item.sectorTag, item.phase];
    }
    if ("dewaRelevanceTag" in item) {
      return [item.departmentTag, item.dewaRelevanceTag];
    }
    if (document) {
      return [
        document.documentSubType,
        document.statusBadge,
        document.version,
        document.division,
        document.stream,
        document.docTypeLabel,
      ].filter(Boolean) as string[];
    }
    return [];
  })();

  const handleSave = () => {
    toggleSavedKnowledgeItem(normalizedTab, cardId);
    setShowLoginModal(true);
  };

  const handleViewResource = () => {
    if (isDesignReport && document?.liveUrl) {
      window.open(document.liveUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (isDesignReport && document?.comingSoon) return; // already disabled
    setShowArtefact(true);
  };

  const handleHelpfulVote = (vote: "yes" | "no") => {
    if (helpfulVote !== null || !knowledgeItem) return;
    setHelpfulVote(vote);
    persistUserHelpfulVote(knowledgeItem.id, vote);
    if (vote === "yes") recordHelpfulVoteMetric(knowledgeItem.id);
  };

  const handleFlagOutdatedSubmit = () => {
    if (!knowledgeItem || !flagReason.trim()) return;
    setFlagged(true);
    setShowFlagForm(false);
    recordStaleFlagMetric(knowledgeItem.id);
    const fullMessage = flagAssumptions.trim()
      ? `${flagReason.trim()}\n\nAssumptions: ${flagAssumptions.trim()}`
      : flagReason.trim();
    addTORequest({
      itemId: knowledgeItem.id,
      requesterName: "John Doe",
      requesterRole: "Transformation Analyst",
      type: "stale-flag",
      message: fullMessage,
    });
  };

  const handleRequestSubmit = () => {
    if (!knowledgeItem || !requestDraft.trim()) return;
    addTORequest({
      itemId: knowledgeItem.id,
      requesterName: "John Doe",
      requesterRole: "Transformation Analyst",
      type: requestType,
      message: requestDraft,
      sectionRef: requestSectionRef || undefined,
    });
    setRequestSubmitted(true);
  };

  const handleCommentSubmit = () => {
    if (!knowledgeItem || !commentDraft.trim()) return;
    addKnowledgeComment({
      itemId: knowledgeItem.id,
      authorName: "John Doe",
      authorRole: "Transformation Analyst",
      body: commentDraft,
    });
    setComments(getCommentsForKnowledgeItem(knowledgeItem.id));
    setCommentDraft("");
  };

  const appendCollaborator = (name: string) => {
    setCommentDraft((prev) => {
      const trimmed = prev.trimEnd();
      return trimmed ? `${trimmed} @${name} ` : `@${name} `;
    });
  };

  const getRelatedPath = (sourceTab: KnowledgeTab, sourceId: string) =>
    `/marketplaces/knowledge-center/${sourceTab}/${sourceId}`;

  const requestTypeOptions: { value: TORequestType; label: string }[] = [
    { value: "clarification", label: "Clarification" },
    { value: "outdated-section", label: "Report Outdated Section" },
  ];

  // ── Artefact viewer collaboration handlers ────────────────────────────────
  const handleArtefactCommentSubmit = () => {
    if (!knowledgeItem || !artefactCommentDraft.trim()) return;
    addKnowledgeComment({
      itemId: knowledgeItem.id,
      authorName: "John Doe",
      authorRole: "Transformation Analyst",
      body: artefactCommentDraft,
    });
    setArtefactCommentSubmitted(true);
    setArtefactCommentDraft("");
    if (!isStage2) {
      setLoginModalAction("comment");
      setShowLoginModal(true);
    }
  };

  const handleArtefactRequestSubmit = () => {
    if (!knowledgeItem || !artefactRequestDraft.trim()) return;
    addTORequest({
      itemId: knowledgeItem.id,
      requesterName: "John Doe",
      requesterRole: "Transformation Analyst",
      type: artefactRequestType,
      message: artefactRequestDraft,
      sectionRef: artefactRequestSectionRef || undefined,
    });
    setArtefactRequestSubmitted(true);
    setArtefactRequestDraft("");
    setArtefactRequestSectionRef("");
    if (!isStage2) {
      setLoginModalAction("request");
      setShowLoginModal(true);
    }
  };

  // Determine button icon for View Resource
  const showExternalIcon = isDesignReport && !!document?.liveUrl;

  // Build artefact sections
  const artefactSections = normalizedTab
    ? buildArtefactSections(normalizedTab, item as Record<string, unknown> & { title?: string; description?: string; tags?: string[] }, knowledgeItem, document, cardId)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Reading progress bar */}
      <div className="fixed top-[64px] left-0 right-0 z-40 h-1 bg-gray-100">
        <div
          className="h-full bg-orange-500 transition-all duration-150"
          style={{ width: `${readingDepth}%` }}
        />
      </div>

      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-muted-foreground flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces" className="hover:text-foreground transition-colors">
              Marketplaces
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link
              to="/marketplaces/knowledge-center"
              className="hover:text-foreground transition-colors"
            >
              Knowledge Centre
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link
              to={`/marketplaces/knowledge-center?tab=${normalizedTab}`}
              className="hover:text-foreground transition-colors"
            >
              {tabLabels[normalizedTab]}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground line-clamp-1">{title}</span>
          </nav>
        </div>
      </div>

      <section className="bg-white border-b border-gray-200 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-4">{title}</h1>
          <p className="text-base text-muted-foreground max-w-4xl mb-4">{description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {metadataBadges.map((badge) => (
              <Badge key={badge} className="bg-slate-100 text-slate-700 border-0">
                {badge}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleViewResource} disabled={!!document?.comingSoon}>
              {showExternalIcon ? (
                <ExternalLink className="w-4 h-4 mr-2" />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              {document?.comingSoon ? "Coming Soon" : "View Resource"}
            </Button>
            <Button variant="outline" onClick={handleSave}>
              <Bookmark className="w-4 h-4 mr-2" />
              {isSaved ? "Saved" : "Save to Workspace"}
            </Button>
            {isStage2 && <Button
              variant="outline"
              onClick={() => {
                setShowRequestPanel((v) => !v);
                setRequestSubmitted(false);
                setRequestDraft("");
                setRequestSectionRef("");
                setRequestType("clarification");
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Request Clarification
            </Button>}
          </div>

          {/* ── Request Clarification panel (Stage 2 only) ──────────────────── */}
          {isStage2 && showRequestPanel && (
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-5 max-w-2xl">
              {requestSubmitted ? (
                <div className="flex items-center gap-2 text-green-700">
                  <span className="text-sm font-medium">
                    Request submitted — TO team will respond within 2 business days.
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Submit a Request to the TO Team</h4>
                  <div className="flex flex-wrap gap-2">
                    {requestTypeOptions.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRequestType(value)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                          requestType === value
                            ? "bg-orange-600 text-white border-orange-600"
                            : "bg-white text-gray-700 border-gray-200 hover:border-orange-300"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <Textarea
                    placeholder="Describe your request..."
                    value={requestDraft}
                    onChange={(e) => setRequestDraft(e.target.value)}
                    rows={3}
                    className="text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Which section? (optional)"
                    value={requestSectionRef}
                    onChange={(e) => setRequestSectionRef(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleRequestSubmit}
                      disabled={!requestDraft.trim()}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Submit Request
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowRequestPanel(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Tabs
        value={contentTab}
        onValueChange={(value) => setContentTab(value as DetailTab)}
        className="w-full"
      >
        <div className="bg-white border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto">
            <TabsList className="h-auto bg-transparent p-0 gap-1 overflow-x-auto flex justify-start px-4 lg:px-8">
              {(["about", "implementation", "examples", "resources", ...(isStage2 ? ["discussion"] : [])] as DetailTab[]).map(
                (entry) => (
                  <TabsTrigger
                    key={entry}
                    value={entry}
                    className="px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy data-[state=active]:shadow-none bg-transparent capitalize"
                  >
                    {entry}
                  </TabsTrigger>
                )
              )}
            </TabsList>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <TabsContent value="about" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-3">Overview</h2>
                    <p className="text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Key Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {(knowledgeItem?.tags ?? []).map((tag) => (
                        <Badge key={tag} className="bg-orange-50 text-orange-700 border-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="implementation" className="mt-0">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">Implementation Guidance</h2>
                  <p className="text-muted-foreground">
                    Use this resource as a DEWA reference point for architecture decisions,
                    governance reviews, and programme execution. Apply the guidance in the context
                    of the relevant division, 4D phase, and connected platform or initiative.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="examples" className="mt-0">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">Examples</h2>
                  <p className="text-muted-foreground">
                    Related examples, case signals, and reference points should be interpreted
                    against DEWA's operational environment, architecture standards, and
                    transformation governance requirements.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="mt-0">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">Resources</h2>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-medium text-foreground">{title}</p>
                        <p className="text-sm text-muted-foreground">
                          {document?.format ?? "PDF"} resource
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ── Discussion tab ──────────────────────────────────────────── */}
              <TabsContent value="discussion" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">Discussion</h2>

                  {comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No comments yet. Be the first to start the discussion.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-semibold text-gray-900 text-sm">
                                {comment.authorName}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                {comment.authorRole}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {highlightMentions(comment.body)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment form */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                    <Textarea
                      placeholder="Add a comment... use @Name to mention a colleague"
                      value={commentDraft}
                      onChange={(e) => setCommentDraft(e.target.value)}
                      rows={3}
                      className="text-sm bg-white"
                    />
                    <div className="flex flex-wrap gap-2">
                      {collaborators.map((name) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => appendCollaborator(name)}
                          className="px-2 py-1 text-xs rounded-md bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors"
                        >
                          @{name}
                        </button>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      onClick={handleCommentSubmit}
                      disabled={!commentDraft.trim()}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Post Comment
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>

            {/* ── Sidebar ─────────────────────────────────────────────────── */}
            <aside className="lg:w-80 flex-shrink-0 space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-4">Resource Details</h3>
                <div className="space-y-3 text-sm">
                  <p>
                    <span className="text-muted-foreground">Type:</span>{" "}
                    {knowledgeItem?.type ?? tabLabels[normalizedTab]}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Audience:</span>{" "}
                    {knowledgeItem?.audience ?? "All Roles"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Updated:</span>{" "}
                    {knowledgeItem?.updatedAt ?? document?.year}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Author:</span>{" "}
                    {knowledgeItem?.author ?? document?.author}
                  </p>
                  {document?.pageCount && (
                    <p>
                      <span className="text-muted-foreground">Length:</span> {document.pageCount}
                    </p>
                  )}
                </div>
                {isDesignReport && document && (
                  <div className="mt-6 rounded-lg bg-orange-50 border border-orange-200 p-4 text-sm">
                    <p className="font-semibold text-orange-800 mb-2">Design Reports Demo</p>
                    <p className="text-orange-700">
                      This item is published from Document Studio. The live demo card opens the
                      generated report directly; placeholders remain visible but unavailable until
                      publication.
                    </p>
                  </div>
                )}
              </div>

              {/* ── Helpful voting ──────────────────────────────────────────── */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Was this helpful?</h4>
                {helpfulVote !== null ? (
                  <p className="text-sm text-green-700 font-medium">
                    Thanks for your feedback!
                  </p>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
                      onClick={() => handleHelpfulVote("yes")}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Helpful
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-gray-600 hover:bg-gray-50"
                      onClick={() => handleHelpfulVote("no")}
                    >
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      Not helpful
                    </Button>
                  </div>
                )}
              </div>

              {/* ── Flag as outdated ─────────────────────────────────────────── */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                {flagged ? (
                  <p className="text-sm text-amber-700 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Flagged — TO team notified
                  </p>
                ) : showFlagForm ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-amber-700 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      Flag as Outdated
                    </p>
                    <div>
                      <label className="text-xs text-gray-500 font-medium mb-1 block">
                        What has changed, or why do you think this is outdated? <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        placeholder="e.g. This references the 2022 regulatory framework — updated in Q1 2025"
                        value={flagReason}
                        onChange={(e) => setFlagReason(e.target.value)}
                        rows={3}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium mb-1 block">
                        What were you expecting to find? <span className="text-gray-400">(optional)</span>
                      </label>
                      <Textarea
                        placeholder="e.g. Expected the SAP-integrated workflow introduced post-upgrade"
                        value={flagAssumptions}
                        onChange={(e) => setFlagAssumptions(e.target.value)}
                        rows={2}
                        className="text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
                        onClick={handleFlagOutdatedSubmit}
                        disabled={!flagReason.trim()}
                      >
                        Submit Flag
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => { setShowFlagForm(false); setFlagReason(""); setFlagAssumptions(""); }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowFlagForm(true)}
                    className="text-sm text-amber-600 hover:text-amber-700 underline underline-offset-2 flex items-center gap-1"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Flag as outdated
                  </button>
                )}
              </div>
            </aside>
          </div>
        </div>
      </Tabs>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8">Related Content</h2>
          {relatedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedItems.map((related) => (
                <button
                  key={related.id}
                  type="button"
                  onClick={() => navigate(getRelatedPath(related.sourceTab, related.sourceId))}
                  className="bg-white border border-gray-200 rounded-xl hover:shadow-xl hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <Image className="w-12 h-12 text-white/40" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-2">Knowledge Centre</p>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {related.description}
                    </p>
                    <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">{related.type}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No related content found for this item yet.
            </p>
          )}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8">Connected Workflows</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Open Learning Centre",
                description: "Start linked learning pathways and role-based courses.",
              },
              {
                title: "Launch Portfolio Management",
                description: "Apply this guidance to active transformation initiatives.",
              },
              {
                title: "Open Lifecycle Management",
                description: "Use this content while preparing lifecycle artefacts.",
              },
            ].map((workflow) => (
              <div key={workflow.title} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <p className="text-lg font-semibold text-gray-900 mb-2">{workflow.title}</p>
                <p className="text-sm text-gray-600 mb-4">{workflow.description}</p>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 ${
                        index < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Artefact viewer overlay ───────────────────────────────────────── */}
      {showArtefact && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Sticky toolbar */}
          <div className={`sticky top-0 h-14 border-b shadow-sm px-6 flex items-center justify-between flex-shrink-0 ${isEditMode ? "bg-orange-600 border-orange-700" : "bg-white border-gray-200"}`}>
            <div className="flex items-center gap-3 min-w-0">
              {isEditMode
                ? <Pencil className="w-5 h-5 text-white flex-shrink-0" />
                : <FileText className="w-5 h-5 text-orange-600 flex-shrink-0" />
              }
              <span className={`font-semibold truncate ${isEditMode ? "text-white" : "text-gray-900"}`}>
                {title}
              </span>
              {isEditMode && (
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                  TO Edit Mode
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              {isEditMode ? (
                <>
                  {editSaved && (
                    <span className="flex items-center gap-1 text-xs text-white/90 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Saved
                    </span>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                    onClick={handleDiscardEdits}
                    disabled={!editDirty}
                  >
                    Discard
                  </Button>
                  <Button
                    size="sm"
                    className="bg-white text-orange-700 hover:bg-orange-50"
                    onClick={handleSaveEdits}
                    disabled={!editDirty}
                  >
                    Save Changes
                  </Button>
                  <button
                    type="button"
                    onClick={() => window.close()}
                    className="p-1.5 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                    aria-label="Close editor"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDownloadToast(true);
                      setTimeout(() => setDownloadToast(false), 2500);
                    }}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowArtefact(false)}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                    aria-label="Close viewer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Edit mode hint bar */}
          {isEditMode && (
            <div className="bg-orange-50 border-b border-orange-200 px-6 py-2 flex-shrink-0">
              <p className="text-xs text-orange-700">
                <strong>TO Edit Mode</strong> — Edit the sections below and click <strong>Save Changes</strong>. Updates will be visible to all users. This tab was opened from an incoming request.
              </p>
            </div>
          )}

          {/* Document body */}
          <div className="overflow-y-auto flex-1">
            <div className="max-w-3xl mx-auto py-12 px-8">
              {/* Document header block */}
              <div className="mb-8">
                <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  {tabLabels[normalizedTab]}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  {(knowledgeItem?.author ?? document?.author) && (
                    <span>{knowledgeItem?.author ?? document?.author}</span>
                  )}
                  {(knowledgeItem?.author ?? document?.author) &&
                    (knowledgeItem?.audience ?? "All Roles") && (
                      <span className="text-gray-300">|</span>
                    )}
                  <span>{knowledgeItem?.audience ?? "All Roles"}</span>
                  {(knowledgeItem?.updatedAt ?? document?.year) && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span>Updated: {knowledgeItem?.updatedAt ?? document?.year}</span>
                    </>
                  )}
                </div>
                <hr className="border-gray-200 my-8" />
              </div>

              {/* TO edit badge in read mode */}
              {!isEditMode && cardId && getArticleEdit(cardId) && (
                <div className="mb-6 flex items-center gap-2 text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                  <Pencil className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    <strong>Edited by TO office</strong> · {new Date(getArticleEdit(cardId)!.editedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {getArticleEdit(cardId)!.editedBy}
                  </span>
                </div>
              )}

              {/* Sections */}
              {artefactSections.map((section, index) => {
                const displayBody = editedSections[section.heading] ?? section.body;
                return (
                  <div key={section.heading}>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">{section.heading}</h2>
                    {section.node ? (
                      <div className="my-2">{section.node}</div>
                    ) : isEditMode ? (
                      <textarea
                        value={editedSections[section.heading] ?? section.body}
                        onChange={(e) => {
                          setEditedSections((prev) => ({ ...prev, [section.heading]: e.target.value }));
                          setEditDirty(true);
                          setEditSaved(false);
                        }}
                        rows={Math.max(6, displayBody.split("\n").length + 2)}
                        className="w-full text-gray-700 text-base leading-relaxed border border-orange-200 rounded-lg px-4 py-3 resize-y focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50/30"
                      />
                    ) : (
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{displayBody}</p>
                    )}
                    {index < artefactSections.length - 1 && (
                      <hr className="border-gray-100 my-6" />
                    )}
                  </div>
                );
              })}

              {/* ── Collaboration panel — hidden in edit mode ─────────────── */}
              {!isEditMode && <div className="mt-12 border-t-2 border-gray-100 pt-10">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Questions & Comments</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Leave a question or flag something to the Transformation Office.
                  {!isStage2 && " You'll be asked to log in when you submit."}
                </p>

                {/* Panel switcher */}
                <div className="flex gap-2 mb-6">
                  {[
                    { key: "comment" as const, label: "Leave a Comment" },
                    { key: "request" as const, label: "Request Clarification" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setArtefactActivePanel(key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        artefactActivePanel === key
                          ? "bg-orange-600 text-white border-orange-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Comment panel */}
                {artefactActivePanel === "comment" && (
                  <div className="space-y-3">
                    {artefactCommentSubmitted ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700 font-medium">
                        ✓ Comment submitted{!isStage2 ? " — log in to track it in your workspace." : "."}
                      </div>
                    ) : (
                      <>
                        <Textarea
                          placeholder="Add a comment... use @Name to mention a colleague"
                          value={artefactCommentDraft}
                          onChange={(e) => setArtefactCommentDraft(e.target.value)}
                          rows={4}
                          className="text-sm bg-white"
                        />
                        <div className="flex flex-wrap gap-2">
                          {collaborators.map((name) => (
                            <button
                              key={name}
                              type="button"
                              onClick={() =>
                                setArtefactCommentDraft((prev) => {
                                  const t = prev.trimEnd();
                                  return t ? `${t} @${name} ` : `@${name} `;
                                })
                              }
                              className="px-2 py-1 text-xs rounded-md bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors"
                            >
                              @{name}
                            </button>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          onClick={handleArtefactCommentSubmit}
                          disabled={!artefactCommentDraft.trim()}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          Post Comment
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {/* Request panel */}
                {artefactActivePanel === "request" && (
                  <div className="space-y-4">
                    {artefactRequestSubmitted ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700 font-medium">
                        ✓ Request submitted — TO team will respond within 2 business days.
                        {!isStage2 && " Log in to track progress in your workspace."}
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {requestTypeOptions.map(({ value, label }) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setArtefactRequestType(value)}
                              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                                artefactRequestType === value
                                  ? "bg-orange-600 text-white border-orange-600"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-orange-300"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                        <Textarea
                          placeholder="Describe your request or question..."
                          value={artefactRequestDraft}
                          onChange={(e) => setArtefactRequestDraft(e.target.value)}
                          rows={4}
                          className="text-sm bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Which section does this relate to? (optional)"
                          value={artefactRequestSectionRef}
                          onChange={(e) => setArtefactRequestSectionRef(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                        <Button
                          size="sm"
                          onClick={handleArtefactRequestSubmit}
                          disabled={!artefactRequestDraft.trim()}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          Submit Request
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>}
            </div>
          </div>
        </div>
      )}

      {/* ── Download toast ────────────────────────────────────────────────── */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-100 border border-amber-300 text-amber-800 rounded-lg px-4 py-2 text-sm shadow-lg">
          Download not available in demo — document is illustrative only.
        </div>
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        context={{
          marketplace: "knowledge-center",
          tab: normalizedTab,
          cardId,
          serviceName: title,
          action: "save-to-workspace",
        }}
      />

      <Footer />
    </div>
  );
}
