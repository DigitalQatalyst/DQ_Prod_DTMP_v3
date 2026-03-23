import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  AlertTriangle,
  Bookmark,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Image,
  MessageSquare,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
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
} from "@/data/knowledgeCenter/analyticsState";
import {
  addTORequest,
  type TORequestType,
} from "@/data/knowledgeCenter/requestState";
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

export default function KnowledgeCenterDetailPage() {
  const { tab, cardId } = useParams<{ tab: string; cardId: string }>();
  const navigate = useNavigate();
  const [contentTab, setContentTab] = useState<DetailTab>("about");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const normalizedTab = validTabs.includes(tab as KnowledgeTab)
    ? (tab as KnowledgeTab)
    : null;

  // ── Reading progress ──────────────────────────────────────────────────────
  const [readingDepth, setReadingDepth] = useState(0);
  const lastReportedDepth = useRef(0);

  // ── Helpful voting ────────────────────────────────────────────────────────
  const [helpfulVote, setHelpfulVote] = useState<"yes" | "no" | null>(null);

  // ── Stale flag ────────────────────────────────────────────────────────────
  const [flagged, setFlagged] = useState(false);

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

  if (!item || !normalizedTab || !cardId) {
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
    if (document?.liveUrl) {
      window.open(document.liveUrl, "_blank", "noopener,noreferrer");
      return;
    }
    navigate(`/marketplaces/knowledge-center?tab=${normalizedTab}`);
  };

  const handleHelpfulVote = (vote: "yes" | "no") => {
    if (helpfulVote !== null) return;
    setHelpfulVote(vote);
    if (vote === "yes" && knowledgeItem) {
      recordHelpfulVoteMetric(knowledgeItem.id);
    }
  };

  const handleFlagOutdated = () => {
    if (flagged || !knowledgeItem) return;
    setFlagged(true);
    recordStaleFlagMetric(knowledgeItem.id);
    addTORequest({
      itemId: knowledgeItem.id,
      requesterName: "John Doe",
      requesterRole: "Transformation Analyst",
      type: "outdated-section",
      message: "User flagged this content as potentially outdated.",
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
    { value: "collaboration", label: "Request Collaboration" },
  ];

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
              {document?.liveUrl ? (
                <ExternalLink className="w-4 h-4 mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {document?.comingSoon ? "Coming Soon" : "View Resource"}
            </Button>
            <Button variant="outline" onClick={handleSave}>
              <Bookmark className="w-4 h-4 mr-2" />
              {isSaved ? "Saved" : "Save to Workspace"}
            </Button>
            <Button
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
            </Button>
          </div>

          {/* ── Request Clarification panel ────────────────────────────────── */}
          {showRequestPanel && (
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
              {(["about", "implementation", "examples", "resources", "discussion"] as DetailTab[]).map(
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
                ) : (
                  <button
                    type="button"
                    onClick={handleFlagOutdated}
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
