import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronRight, Clock, User, Download,
  CheckCircle, BookOpen, ExternalLink, Image, Star,
  Tag, TrendingUp, Calendar, BadgeCheck, FileText, Bookmark
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoginModal } from "@/components/learningCenter/LoginModal";
import { bestPractices } from "@/data/knowledgeCenter/bestPractices";
import { testimonials } from "@/data/knowledgeCenter/testimonials";
import { playbooks } from "@/data/knowledgeCenter/playbooks";
import { libraryItems } from "@/data/knowledgeCenter/library";
import { policyReports } from "@/data/knowledgeCenter/policyReports";
import { procedureReports } from "@/data/knowledgeCenter/procedureReports";
import { executiveSummaries } from "@/data/knowledgeCenter/executiveSummaries";
import { strategyDocs } from "@/data/knowledgeCenter/strategyDocs";
import {
  getKnowledgeItem,
  getRelatedKnowledgeItems,
  type KnowledgeTab,
} from "@/data/knowledgeCenter/knowledgeItems";
import {
  isSavedKnowledgeItem,
  recordKnowledgeView,
  toggleSavedKnowledgeItem,
} from "@/data/knowledgeCenter/userKnowledgeState";
import {
  getCollaboratorDirectory,
  getCommentsForKnowledgeItem,
  getMentionNotifications,
  markMentionNotificationRead,
  type KnowledgeComment,
  type MentionNotification,
} from "@/data/knowledgeCenter/collaborationState";
import {
  getTORequests,
  type TORequest,
  type TORequestType,
} from "@/data/knowledgeCenter/requestState";
import {
  recordHelpfulVoteMetric,
  recordKnowledgeSaveMetric,
  recordKnowledgeViewMetric,
  recordReadingDepthMetric,
  recordStaleFlagMetric,
  type KnowledgeUsageMetric,
} from "@/data/knowledgeCenter/analyticsState";
import { isUserAuthenticated } from "@/data/sessionAuth";
import {
  mapBestPracticeToDepartment,
  mapIndustryToDepartment,
} from "@/data/knowledgeCenter/departmentMapping";

export default function KnowledgeCenterDetailPage() {
  const { tab, cardId } = useParams();
  const navigate = useNavigate();
  const [contentTab, setContentTab] = useState("about");
  const [readerOpen, setReaderOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const [comments, setComments] = useState<KnowledgeComment[]>([]);
  const [mentionNotifications, setMentionNotifications] = useState<MentionNotification[]>([]);
  const [requestType, setRequestType] = useState<TORequestType>("clarification");
  const [requestSectionRef, setRequestSectionRef] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [resourceRequests, setResourceRequests] = useState<TORequest[]>([]);
  const [usageMetric, setUsageMetric] = useState<KnowledgeUsageMetric | undefined>();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState("open-overview");
  const [pendingCommentText, setPendingCommentText] = useState("");
  const [pendingRequestMessage, setPendingRequestMessage] = useState("");
  const [pendingRequestSectionRef, setPendingRequestSectionRef] = useState("");
  const [pendingRequestType, setPendingRequestType] = useState<TORequestType>("clarification");
  const currentUserName = "John Doe";
  const currentUserRole = "Portfolio Manager";
  const normalizedTab =
    tab === "best-practices" ||
    tab === "testimonials" ||
    tab === "playbooks" ||
    tab === "library" ||
    tab === "policy-reports" ||
    tab === "procedure-reports" ||
    tab === "executive-summaries" ||
    tab === "strategy-docs"
      ? tab
      : null;
  const knowledgeItem =
    normalizedTab && cardId ? getKnowledgeItem(normalizedTab as KnowledgeTab, cardId) : undefined;
  const relatedItems =
    normalizedTab && cardId
      ? getRelatedKnowledgeItems(normalizedTab as KnowledgeTab, cardId, 3)
      : [];

  useEffect(() => {
    if (!normalizedTab || !cardId) return;
    setIsSaved(isSavedKnowledgeItem(normalizedTab as KnowledgeTab, cardId));
    recordKnowledgeView(normalizedTab as KnowledgeTab, cardId);
    if (knowledgeItem?.id) {
      setUsageMetric(recordKnowledgeViewMetric(knowledgeItem.id));
      setComments(getCommentsForKnowledgeItem(knowledgeItem.id));
      setResourceRequests(
        getTORequests(currentUserName).filter(
          (request) => request.itemId === knowledgeItem.id
        )
      );
    }
    setMentionNotifications(getMentionNotifications(currentUserName).slice(0, 5));
  }, [normalizedTab, cardId]);

  // Find the item based on tab type
  const getItem = () => {
    switch (tab) {
      case "best-practices":
        return bestPractices.find((p) => p.id === cardId);
      case "testimonials":
        return testimonials.find((t) => t.id === cardId);
      case "playbooks":
        return playbooks.find((p) => p.id === cardId);
      case "library":
        return libraryItems.find((i) => i.id === cardId);
      case "policy-reports": {
        const doc = policyReports.find((entry) => entry.id === cardId);
        if (!doc) return null;
        return {
          id: doc.id,
          title: doc.title,
          description: doc.description,
          contentType: doc.category,
          format: doc.outputFormats[0] ?? "PDF",
          typeIcon: "FileText",
          author: "Transformation Office",
          length: doc.pageLength,
          datePublished: "2024",
          topics: [doc.category, doc.aiGeneration, doc.specialFeature],
          audience: "All Roles",
        };
      }
      case "procedure-reports": {
        const doc = procedureReports.find((entry) => entry.id === cardId);
        if (!doc) return null;
        return {
          id: doc.id,
          title: doc.title,
          description: doc.description,
          contentType: doc.category,
          format: doc.outputFormats[0] ?? "PDF",
          typeIcon: "FileText",
          author: "Transformation Office",
          length: doc.pageLength,
          datePublished: "2024",
          topics: [doc.category, doc.aiGeneration, doc.specialFeature],
          audience: "All Roles",
        };
      }
      case "executive-summaries": {
        const doc = executiveSummaries.find((entry) => entry.id === cardId);
        if (!doc) return null;
        return {
          id: doc.id,
          title: doc.title,
          description: doc.description,
          contentType: doc.category,
          format: doc.outputFormats[0] ?? "PDF",
          typeIcon: "FileText",
          author: "Transformation Office",
          length: doc.pageLength,
          datePublished: "2024",
          topics: [doc.category, doc.aiGeneration, doc.specialFeature],
          audience: doc.audience,
        };
      }
      case "strategy-docs": {
        const doc = strategyDocs.find((entry) => entry.id === cardId);
        if (!doc) return null;
        return {
          id: doc.id,
          title: doc.title,
          description: doc.description,
          contentType: doc.category,
          format: doc.outputFormats[0] ?? "PDF",
          typeIcon: "FileText",
          author: "Transformation Office",
          length: doc.pageLength,
          datePublished: "2024",
          topics: [doc.category, doc.aiGeneration, doc.specialFeature],
          audience: doc.scopeLevel,
        };
      }
      default:
        return null;
    }
  };

  const item = getItem();

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Item Not Found</h1>
          <Button onClick={() => navigate("/marketplaces/knowledge-center")}>
            Back to Knowledge Center
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const getTitle = () => {
    if (knowledgeItem?.title) return knowledgeItem.title;
    if ("title" in item) return item.title;
    return "";
  };

  const getTabLabel = () => {
    switch (tab) {
      case "best-practices": return "Best Practices";
      case "testimonials": return "Testimonials";
      case "playbooks": return "Playbooks";
      case "library": return "Library";
      case "policy-reports": return "Policy Reports";
      case "procedure-reports": return "Procedure Reports";
      case "executive-summaries": return "Executive Summaries";
      case "strategy-docs": return "Strategy Docs";
      default: return "";
    }
  };

  const handleViewResource = () => {
    setReaderOpen(true);
    window.setTimeout(() => {
      const section = document.getElementById("resource-reader");
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const getAttachmentList = () => {
    if (tab === "best-practices") {
      return [
        { id: "implementation-guide", label: "Implementation Guide.pdf", kind: "PDF", size: "1.4 MB" },
        { id: "templates", label: "Templates and Checklists.zip", kind: "ZIP", size: "2.1 MB" },
      ];
    }
    if (tab === "testimonials") {
      return [
        { id: "full-case-study", label: "Full Case Study.pdf", kind: "PDF", size: "1.2 MB" },
        { id: "outcomes-summary", label: "Outcomes Summary.docx", kind: "DOCX", size: "320 KB" },
      ];
    }
    if (tab === "playbooks") {
      return [
        { id: "playbook-content", label: "Playbook Content.pdf", kind: "PDF", size: "3.2 MB" },
        { id: "facilitation-kit", label: "Workshop Facilitation Kit.pptx", kind: "PPTX", size: "5.0 MB" },
      ];
    }
    return [
      { id: "resource-file", label: `${getTitle()}.pdf`, kind: "PDF", size: "1.8 MB" },
      { id: "references", label: "References and Sources.docx", kind: "DOCX", size: "440 KB" },
    ];
  };

  const handleDownload = (fileName: string) => {
    const safeName = fileName.replace(/[^\w.\- ]+/g, "_");
    const payload = `Knowledge Center Resource\nTitle: ${getTitle()}\nFile: ${safeName}\nGenerated: ${new Date().toISOString()}\n`;
    const blob = new Blob([payload], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = safeName.endsWith(".txt") ? safeName : `${safeName}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const runProtectedAction = (actionName: string, callback: () => void) => {
    if (!isUserAuthenticated()) {
      setPendingAction(actionName);
      setShowLoginModal(true);
      return;
    }
    callback();
  };

  const handleToggleSave = () => {
    if (!normalizedTab || !cardId) return;
    runProtectedAction("save-to-workspace", () => {
      const result = toggleSavedKnowledgeItem(normalizedTab as KnowledgeTab, cardId);
      setIsSaved(result.saved);
      if (knowledgeItem?.id) {
        setUsageMetric(recordKnowledgeSaveMetric(knowledgeItem.id, result.saved));
      }
      if (result.saved) {
        navigate("/stage2/knowledge/saved", {
          state: {
            marketplace: "knowledge-center",
            tab: tab || "library",
            cardId: cardId || "",
            serviceName: getTitle(),
            action: "save-to-workspace",
          },
        });
      }
    });
  };

  const handleAddComment = () => {
    if (!knowledgeItem) return;
    const commentText = commentDraft.trim();
    setPendingCommentText(commentText);
    runProtectedAction("post-comment", () => {
      navigate("/stage2/knowledge/overview", {
        state: {
          marketplace: "knowledge-center",
          tab: tab || "library",
          cardId: cardId || "",
          serviceName: getTitle(),
          action: "post-comment",
          commentText,
        },
      });
    });
  };

  const handleNotificationClick = (notification: MentionNotification) => {
    markMentionNotificationRead(notification.id);
    const [sourceTab, sourceId] = notification.itemId.split(":");
    if (
      sourceTab === "best-practices" ||
      sourceTab === "testimonials" ||
      sourceTab === "playbooks" ||
      sourceTab === "library" ||
      sourceTab === "policy-reports" ||
      sourceTab === "procedure-reports" ||
      sourceTab === "executive-summaries" ||
      sourceTab === "strategy-docs"
    ) {
      navigate(buildKnowledgeDetailPath(sourceTab, sourceId));
    }
    setMentionNotifications(getMentionNotifications(currentUserName).slice(0, 5));
  };

  const handleSubmitTORequest = () => {
    if (!knowledgeItem) return;
    const message = requestMessage.trim();
    const sectionRef = requestSectionRef.trim();
    setPendingRequestMessage(message);
    setPendingRequestSectionRef(sectionRef);
    setPendingRequestType(requestType);
    runProtectedAction("request-clarification", () => {
      navigate("/stage2/knowledge/overview", {
        state: {
          marketplace: "knowledge-center",
          tab: tab || "library",
          cardId: cardId || "",
          serviceName: getTitle(),
          action: "request-clarification",
          requestMessage: message,
          sectionRef,
          requestType,
        },
      });
    });
  };

  const handleHelpfulVote = () => {
    if (!knowledgeItem?.id) return;
    setUsageMetric(recordHelpfulVoteMetric(knowledgeItem.id));
  };

  const handleMarkRead = () => {
    if (!knowledgeItem?.id) return;
    setUsageMetric(recordReadingDepthMetric(knowledgeItem.id, 100));
  };

  const handleFlagStale = () => {
    if (!knowledgeItem?.id) return;
    setUsageMetric(recordStaleFlagMetric(knowledgeItem.id));
  };

  const getFreshnessLabel = () => {
    const updatedAt = knowledgeItem?.updatedAt;
    if (!updatedAt) return "Unknown";
    const ageDays = Math.floor(
      (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (ageDays <= 60) return "Fresh";
    if (ageDays <= 180) return "Monitor";
    return "Review Needed";
  };

  const buildKnowledgeDetailPath = (sourceTab: KnowledgeTab, sourceId: string) =>
    `/marketplaces/knowledge-center/${sourceTab}/${sourceId}`;

  const integrationLinks = [
    {
      id: "learning-center",
      title: "Open Learning Center",
      description: "Start or continue role-based courses linked to this topic.",
      action: () => navigate("/marketplaces/learning-center?source=knowledge-center"),
    },
    {
      id: "portfolio-management",
      title: "Launch Portfolio Management (Training)",
      description: "Apply this guidance to active portfolio decisions and prioritization.",
      action: () =>
        navigate(
          "/stage2/portfolio-management?tab=application-portfolio&mode=training&source=knowledge-center"
        ),
    },
    {
      id: "lifecycle-management",
      title: "Open Lifecycle Management (Training)",
      description: "Use this content while preparing lifecycle stage-gate artifacts.",
      action: () =>
        navigate("/stage2/lifecycle-management?mode=training&source=knowledge-center"),
    },
  ];

  const showcaseGradients = [
    "from-blue-400 to-purple-500",
    "from-green-400 to-blue-500",
    "from-orange-400 to-pink-500",
    "from-teal-400 to-cyan-500",
    "from-indigo-400 to-blue-500",
    "from-rose-400 to-orange-500",
  ];

  const levelBadgeClass = (value: string) => {
    if (value === "Stage 2") return "bg-orange-100 text-orange-700";
    return "bg-blue-100 text-blue-700";
  };

  const getGradientForSeed = (seed: string) =>
    showcaseGradients[seed.length % showcaseGradients.length];

  const renderBestPracticeDetail = () => {
    const practice = item as typeof bestPractices[0];
    const Icon = practice.icon;
    
    return (
      <>
        <div className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-lg bg-green-50 flex items-center justify-center">
                <Icon className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium mr-2">
                  {practice.domain}
                </span>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                  {practice.category}
                </span>
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-4">
              {practice.title}
            </h1>
            <div className="flex flex-wrap gap-4 mb-4">
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                {practice.maturityLevel}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Tag className="w-4 h-4" />
                {practice.complexity} Complexity
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Added {practice.dateAdded}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <Tabs value={contentTab} onValueChange={setContentTab}>
                <TabsList className="bg-white border-b border-gray-200 w-full justify-start rounded-none h-auto p-0 gap-0">
                  {["About", "Implementation", "Examples", "Resources"].map((t) => (
                    <TabsTrigger
                      key={t}
                      value={t.toLowerCase()}
                      className="px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:shadow-none"
                    >
                      {t}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="about" className="mt-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
                  <p className="text-muted-foreground mb-6">{practice.summary}</p>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">Impact Areas</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {practice.impactAreas.map((area) => (
                      <span key={area} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                        {area}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-3">Department Applicability</h3>
                  <p className="text-muted-foreground">
                    {mapBestPracticeToDepartment(practice)}
                  </p>
                </TabsContent>

                <TabsContent value="implementation" className="mt-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Implementation Guide</h2>
                  <p className="text-muted-foreground mb-4">
                    Use this pattern in phased increments to reduce delivery risk and improve adoption.
                  </p>
                  <ol className="list-decimal ml-5 space-y-2 text-sm text-muted-foreground">
                    <li>Establish outcomes and baseline measures for {practice.impactAreas[0] ?? "target capability"}.</li>
                    <li>Define the operating model, ownership, and governance controls across {mapBestPracticeToDepartment(practice)}.</li>
                    <li>Pilot in one value stream, then scale with reusable templates and checkpoints.</li>
                    <li>Track progress monthly and adjust controls based on adoption, quality, and speed metrics.</li>
                  </ol>
                </TabsContent>

                <TabsContent value="examples" className="mt-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Real-World Examples</h2>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="p-3 rounded-lg border border-gray-200">
                      <p className="font-semibold text-foreground mb-1">Enterprise Rollout Example</p>
                      <p>
                        A cross-functional team applied this pattern to standardize decision-making and improve governance quality while maintaining delivery speed.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200">
                      <p className="font-semibold text-foreground mb-1">Business Unit Pilot Example</p>
                      <p>
                        A focused pilot used this approach to improve consistency in architecture and handoffs, then scaled to adjacent teams.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="mt-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Additional Resources</h2>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      Implementation checklist and decision templates.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      Governance cadence and KPI scorecard starter pack.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      Related case studies and references in Knowledge Center library.
                    </li>
                  </ul>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:w-96">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg sticky top-24">
                <h3 className="text-lg font-bold text-foreground mb-6">Best Practice Profile</h3>
                <table className="w-full mb-6">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Domain</td>
                      <td className="text-sm font-medium text-foreground py-3">{practice.domain}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Complexity</td>
                      <td className="text-sm font-medium text-foreground py-3">{practice.complexity}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Maturity Level</td>
                      <td className="text-sm font-medium text-foreground py-3">{practice.maturityLevel}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Content Type</td>
                      <td className="text-sm font-medium text-foreground py-3">{practice.contentType}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Department</td>
                      <td className="text-sm font-medium text-foreground py-3">{knowledgeItem?.department}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Audience</td>
                      <td className="text-sm font-medium text-foreground py-3">{knowledgeItem?.audience}</td>
                    </tr>
                    <tr>
                      <td className="text-sm text-muted-foreground py-3 pr-4">Updated</td>
                      <td className="text-sm font-medium text-foreground py-3">{knowledgeItem?.updatedAt}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h4 className="text-base font-semibold text-foreground mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    {["Implementation guide", "Templates & checklists", "Case study examples", "Expert insights"].map((i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  variant="outline"
                  onClick={handleToggleSave}
                  className="w-full mb-3"
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  {isSaved ? "Saved to Workspace" : "Save to Workspace"}
                </Button>

                <Button 
                  onClick={handleViewResource}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  View Resource
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderTestimonialDetail = () => {
    const testimonial = item as typeof testimonials[0];
    
    return (
      <>
        <div className="py-8 lg:py-12 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl">
                {testimonial.organization.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{testimonial.organization}</h2>
                <p className="text-sm text-muted-foreground">
                  {mapIndustryToDepartment(testimonial.industry)}
                </p>
              </div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <BadgeCheck className="w-4 h-4" />
                TO Verified
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-4">
              {testimonial.title}
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <blockquote className="text-xl text-muted-foreground italic mb-8 border-l-4 border-purple-500 pl-6">
                "{testimonial.quote}"
              </blockquote>

              <div className="mb-8">
                <p className="text-lg font-semibold text-foreground">{testimonial.speaker.name}</p>
                <p className="text-muted-foreground">{testimonial.speaker.role}</p>
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-4">Key Outcomes</h3>
              <div className="grid gap-4">
                {testimonial.outcomes.map((outcome) => (
                  <div key={outcome} className="flex items-center gap-3 bg-green-50 p-4 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-foreground font-medium">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-96">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg sticky top-24">
                <h3 className="text-lg font-bold text-foreground mb-6">Testimonial Profile</h3>
                <table className="w-full mb-6">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Organization Type</td>
                      <td className="text-sm font-medium text-foreground py-3">{testimonial.organizationType}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Phase</td>
                      <td className="text-sm font-medium text-foreground py-3">{testimonial.phase}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Published</td>
                      <td className="text-sm font-medium text-foreground py-3">{testimonial.date}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Department</td>
                      <td className="text-sm font-medium text-foreground py-3">{knowledgeItem?.department}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Audience</td>
                      <td className="text-sm font-medium text-foreground py-3">{knowledgeItem?.audience}</td>
                    </tr>
                    <tr>
                      <td className="text-sm text-muted-foreground py-3 pr-4">Updated</td>
                      <td className="text-sm font-medium text-foreground py-3">{knowledgeItem?.updatedAt}</td>
                    </tr>
                  </tbody>
                </table>

                <Button
                  variant="outline"
                  onClick={handleToggleSave}
                  className="w-full mb-3"
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  {isSaved ? "Saved to Workspace" : "Save to Workspace"}
                </Button>

                <Button 
                  onClick={handleViewResource}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  View Full Case Study
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderPlaybookDetail = () => {
    const playbook = item as typeof playbooks[0];
    
    return (
      <>
        <div className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                {playbook.type}
              </span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {mapIndustryToDepartment(playbook.industry)}
                </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {playbook.format}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-4">
              {playbook.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">{playbook.description}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div
                className="aspect-video rounded-xl mb-8 flex items-center justify-center"
                style={{ background: playbook.coverGradient }}
              >
                <BookOpen className="w-24 h-24 text-white/30" />
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-4">Topics Covered</h3>
              <ul className="space-y-3 mb-8">
                {playbook.topics.map((topic) => (
                  <li key={topic} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-muted-foreground">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:w-96">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg sticky top-24">
                <h3 className="text-lg font-bold text-foreground mb-6">Playbook Profile</h3>
                <table className="w-full mb-6">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Department</td>
                      <td className="text-sm font-medium text-foreground py-3">
                        {mapIndustryToDepartment(playbook.industry)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Scope</td>
                      <td className="text-sm font-medium text-foreground py-3">{playbook.scope}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Format</td>
                      <td className="text-sm font-medium text-foreground py-3">{playbook.format}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Contributor</td>
                      <td className="text-sm font-medium text-foreground py-3">{playbook.contributor}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Audience</td>
                      <td className="text-sm font-medium text-foreground py-3">{knowledgeItem?.audience}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Phase</td>
                      <td className="text-sm font-medium text-foreground py-3">{knowledgeItem?.phase}</td>
                    </tr>
                    <tr>
                      <td className="text-sm text-muted-foreground py-3 pr-4">Updated</td>
                      <td className="text-sm font-medium text-foreground py-3">{knowledgeItem?.updatedAt}</td>
                    </tr>
                  </tbody>
                </table>

                <Button
                  variant="outline"
                  onClick={handleToggleSave}
                  className="w-full mb-3"
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  {isSaved ? "Saved to Workspace" : "Save to Workspace"}
                </Button>

                <Button 
                  onClick={handleViewResource}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  View Playbook
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderLibraryItemDetail = () => {
    const libraryItem = item as typeof libraryItems[0];
    
    return (
      <>
        <div className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {libraryItem.contentType}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {libraryItem.format}
              </span>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                {libraryItem.audience}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-4">
              {libraryItem.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">{libraryItem.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {libraryItem.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {libraryItem.length}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {libraryItem.datePublished}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-4">Topics</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {libraryItem.topics.map((topic) => (
                  <span key={topic} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {topic}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-4">Description</h3>
              <p className="text-muted-foreground mb-8">
                This {libraryItem.contentType.toLowerCase()} provides comprehensive insights into 
                {libraryItem.topics.slice(0, 2).join(" and ")}. Access the full document to explore 
                detailed frameworks, best practices, and implementation guidance.
              </p>
            </div>

            <div className="lg:w-96">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg sticky top-24">
                <h3 className="text-lg font-bold text-foreground mb-6">Document Profile</h3>
                <table className="w-full mb-6">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Type</td>
                      <td className="text-sm font-medium text-foreground py-3">{libraryItem.contentType}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Format</td>
                      <td className="text-sm font-medium text-foreground py-3">{libraryItem.format}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Length</td>
                      <td className="text-sm font-medium text-foreground py-3">{libraryItem.length}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Audience</td>
                      <td className="text-sm font-medium text-foreground py-3">{libraryItem.audience}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Department</td>
                      <td className="text-sm font-medium text-foreground py-3">{knowledgeItem?.department}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Owner</td>
                      <td className="text-sm font-medium text-foreground py-3">{knowledgeItem?.author}</td>
                    </tr>
                    <tr>
                      <td className="text-sm text-muted-foreground py-3 pr-4">Updated</td>
                      <td className="text-sm font-medium text-foreground py-3">{knowledgeItem?.updatedAt}</td>
                    </tr>
                  </tbody>
                </table>

                <Button
                  variant="outline"
                  onClick={handleToggleSave}
                  className="w-full mb-3"
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  {isSaved ? "Saved to Workspace" : "Save to Workspace"}
                </Button>

                <Button 
                  onClick={() => handleDownload(`${getTitle()}-resource`)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Resource
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderMigratedDocumentDetail = () => {
    const libraryItem = item as typeof libraryItems[0];

    return (
      <>
        <div className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {libraryItem.contentType}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {libraryItem.format}
              </span>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                {libraryItem.audience}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-4">
              {libraryItem.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">{libraryItem.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {libraryItem.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {libraryItem.length}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {libraryItem.datePublished}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-4">Topics</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {libraryItem.topics.map((topic) => (
                  <span key={topic} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {topic}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-4">Description</h3>
              <p className="text-muted-foreground mb-8">
                This {libraryItem.contentType.toLowerCase()} provides comprehensive insights into{" "}
                {libraryItem.topics.slice(0, 2).join(" and ")}.
              </p>
            </div>

            <div className="lg:w-96">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg sticky top-24">
                <h3 className="text-lg font-bold text-foreground mb-6">Document Profile</h3>
                <table className="w-full mb-6">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Type</td>
                      <td className="text-sm font-medium text-foreground py-3">{libraryItem.contentType}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Format</td>
                      <td className="text-sm font-medium text-foreground py-3">{libraryItem.format}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Length</td>
                      <td className="text-sm font-medium text-foreground py-3">{libraryItem.length}</td>
                    </tr>
                    <tr>
                      <td className="text-sm text-muted-foreground py-3 pr-4">Updated</td>
                      <td className="text-sm font-medium text-foreground py-3">{knowledgeItem?.updatedAt}</td>
                    </tr>
                  </tbody>
                </table>

                <Button variant="outline" onClick={handleToggleSave} className="w-full mb-3">
                  <Bookmark className="w-4 h-4 mr-2" />
                  {isSaved ? "Saved to Workspace" : "Save to Workspace"}
                </Button>

                <Button
                  onClick={handleViewResource}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  View Resource
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces" className="hover:text-foreground transition-colors">Marketplaces</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces/knowledge-center" className="hover:text-foreground transition-colors">
              Knowledge Center
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link 
              to={`/marketplaces/knowledge-center?tab=${tab}`} 
              className="hover:text-foreground transition-colors"
            >
              {getTabLabel()}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground truncate max-w-[200px]">
              {getTitle()}
            </span>
          </nav>
        </div>
      </div>

      {readerOpen && (
        <section id="resource-reader" className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Resource Reader</h2>
                <p className="text-sm text-muted-foreground">
                  In-app preview for {getTitle()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleToggleSave}>
                  <Bookmark className="w-4 h-4 mr-2" />
                  {isSaved ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" onClick={() => setReaderOpen(false)}>
                  Close Reader
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-[240px_1fr] gap-6">
              <aside className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-fit">
                <h3 className="font-semibold text-foreground mb-3">Contents</h3>
                <nav className="space-y-2 text-sm">
                  <a href="#reader-overview" className="block text-muted-foreground hover:text-foreground">Overview</a>
                  <a href="#reader-insights" className="block text-muted-foreground hover:text-foreground">Key Insights</a>
                  <a href="#reader-implementation" className="block text-muted-foreground hover:text-foreground">Implementation Notes</a>
                  <a href="#reader-attachments" className="block text-muted-foreground hover:text-foreground">Attachments</a>
                  <a href="#reader-metadata" className="block text-muted-foreground hover:text-foreground">Metadata</a>
                  <a href="#reader-governance" className="block text-muted-foreground hover:text-foreground">Governance Signals</a>
                  <a href="#reader-collaboration" className="block text-muted-foreground hover:text-foreground">Collaboration</a>
                  <a href="#reader-requests" className="block text-muted-foreground hover:text-foreground">Request to TO</a>
                </nav>
              </aside>

              <div className="space-y-6">
                <section id="reader-overview" className="border border-gray-200 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Overview</h3>
                  <p className="text-sm text-muted-foreground">
                    {knowledgeItem?.description ?? "This resource provides curated guidance and practical references for transformation delivery."}
                  </p>
                </section>

                <section id="reader-insights" className="border border-gray-200 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Key Insights</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc ml-5">
                    {Array.from(
                      new Set(knowledgeItem?.tags ?? ["Transformation", "Governance", "Execution"])
                    )
                      .slice(0, 5)
                      .map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </section>

                <section id="reader-implementation" className="border border-gray-200 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Implementation Notes</h3>
                  <p className="text-sm text-muted-foreground">
                    Use this content as a baseline playbook, then adapt for your department context and maturity level.
                  </p>
                </section>

                <section id="reader-attachments" className="border border-gray-200 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Attachments</h3>
                  <div className="space-y-2">
                    {getAttachmentList().map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between gap-4 p-3 border border-gray-100 rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-orange-600" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{attachment.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {attachment.kind} - {attachment.size}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(attachment.label)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="reader-metadata" className="border border-gray-200 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Metadata</h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <p><span className="text-muted-foreground">Department:</span> {knowledgeItem?.department ?? "Cross-Department"}</p>
                    <p><span className="text-muted-foreground">Type:</span> {knowledgeItem?.type ?? "Resource"}</p>
                    <p><span className="text-muted-foreground">Audience:</span> {knowledgeItem?.audience ?? "All Roles"}</p>
                    <p><span className="text-muted-foreground">Updated:</span> {knowledgeItem?.updatedAt ?? "N/A"}</p>
                  </div>
                </section>

                <section id="reader-governance" className="border border-gray-200 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-foreground mb-2">TO Governance Signals</h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm mb-3">
                    <p><span className="text-muted-foreground">Owner:</span> {knowledgeItem?.author ?? "Transformation Office"}</p>
                    <p><span className="text-muted-foreground">Freshness:</span> {getFreshnessLabel()}</p>
                    <p><span className="text-muted-foreground">Views:</span> {usageMetric?.views ?? 0}</p>
                    <p><span className="text-muted-foreground">Save Actions:</span> {usageMetric?.saves ?? 0}</p>
                    <p><span className="text-muted-foreground">Helpful Votes:</span> {usageMetric?.helpfulVotes ?? 0}</p>
                    <p><span className="text-muted-foreground">Reading Depth:</span> {usageMetric?.readingDepth ?? 0}%</p>
                    <p><span className="text-muted-foreground">Stale Flags:</span> {usageMetric?.staleFlags ?? 0}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={handleHelpfulVote}>
                      Mark Helpful
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleMarkRead}>
                      Mark 100% Read
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleFlagStale}>
                      Flag as Potentially Stale
                    </Button>
                  </div>
                </section>

                <section id="reader-collaboration" className="border border-gray-200 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Comments and @Mentions</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Mention teammates using @Name. Directory: {getCollaboratorDirectory().join(", ")}
                  </p>

                  {mentionNotifications.length > 0 && (
                    <div className="mb-4 space-y-2">
                      <h4 className="text-sm font-semibold text-foreground">Recent Mention Notifications</h4>
                      {mentionNotifications.map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full text-left p-2 rounded border text-xs ${
                            notification.read
                              ? "border-gray-200 text-muted-foreground"
                              : "border-orange-300 bg-orange-50 text-foreground"
                          }`}
                        >
                          {notification.message}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    <textarea
                      value={commentDraft}
                      onChange={(event) => setCommentDraft(event.target.value)}
                      placeholder="Add a comment or mention someone, e.g. @Amina Johnson please review this section."
                      className="w-full min-h-24 border border-gray-300 rounded-md p-3 text-sm"
                    />
                    <div className="flex justify-end">
                      <Button size="sm" onClick={handleAddComment}>
                        Post Comment
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {comments.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No comments yet. Start the discussion for this resource.
                      </p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="border border-gray-200 rounded-md p-3">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-sm font-semibold text-foreground">
                              {comment.authorName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{comment.authorRole}</p>
                          <p className="text-sm text-foreground whitespace-pre-wrap">{comment.body}</p>
                          {comment.mentions.length > 0 && (
                            <p className="text-xs text-orange-700 mt-2">
                              Mentioned: {comment.mentions.join(", ")}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section id="reader-requests" className="border border-gray-200 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Request Clarification or Update
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Submit to Transformation Office for review.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <label className="text-sm">
                      <span className="text-xs text-muted-foreground">Request Type</span>
                      <select
                        value={requestType}
                        onChange={(event) =>
                          setRequestType(event.target.value as TORequestType)
                        }
                        className="mt-1 w-full border border-gray-300 rounded-md px-2 py-2 text-sm bg-white"
                      >
                        <option value="clarification">Request Clarification</option>
                        <option value="outdated-section">Report Outdated Section</option>
                      </select>
                    </label>
                    <label className="text-sm">
                      <span className="text-xs text-muted-foreground">Section (Optional)</span>
                      <input
                        value={requestSectionRef}
                        onChange={(event) => setRequestSectionRef(event.target.value)}
                        placeholder="e.g. Key Insights / Slide 12"
                        className="mt-1 w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
                      />
                    </label>
                  </div>

                  <textarea
                    value={requestMessage}
                    onChange={(event) => setRequestMessage(event.target.value)}
                    placeholder="Describe the clarification needed or what appears outdated."
                    className="w-full min-h-24 border border-gray-300 rounded-md p-3 text-sm mb-3"
                  />
                  <div className="flex justify-end mb-4">
                    <Button size="sm" onClick={handleSubmitTORequest}>
                      Submit Request
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {resourceRequests.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No requests submitted for this resource yet.
                      </p>
                    ) : (
                      resourceRequests.map((request) => (
                        <div key={request.id} className="border border-gray-200 rounded-md p-3">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-sm font-semibold text-foreground">
                              {request.type === "clarification"
                                ? "Clarification Request"
                                : "Outdated Section Report"}
                            </p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                request.status === "Open"
                                  ? "bg-orange-100 text-orange-700"
                                  : request.status === "In Review"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {request.status}
                            </span>
                          </div>
                          {request.sectionRef && (
                            <p className="text-xs text-muted-foreground mb-1">
                              Section: {request.sectionRef}
                            </p>
                          )}
                          <p className="text-sm text-foreground">{request.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </section>

              </div>
            </div>
          </div>
        </section>
      )}

      {!readerOpen && (
        <>
          {/* Render appropriate detail view */}
          {tab === "best-practices" && renderBestPracticeDetail()}
          {tab === "testimonials" && renderTestimonialDetail()}
          {tab === "playbooks" && renderPlaybookDetail()}
          {tab === "library" && renderLibraryItemDetail()}
          {tab === "policy-reports" && renderMigratedDocumentDetail()}
          {tab === "procedure-reports" && renderMigratedDocumentDetail()}
          {tab === "executive-summaries" && renderMigratedDocumentDetail()}
          {tab === "strategy-docs" && renderMigratedDocumentDetail()}

          <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8">Related Content</h2>
          {relatedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {relatedItems.map((related) => (
                <button
                  key={related.id}
                  type="button"
                  onClick={() =>
                    navigate(buildKnowledgeDetailPath(related.sourceTab, related.sourceId))
                  }
                  className="bg-white border border-gray-200 rounded-xl hover:shadow-xl hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
                >
                  <div className={`aspect-video bg-gradient-to-br ${getGradientForSeed(related.id)} flex items-center justify-center`}>
                    <Image className="w-12 h-12 text-white/40" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-2">Knowledge Center</p>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{related.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{related.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        On demand
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <BookOpen className="w-3 h-3" />
                        {related.type}
                      </span>
                      <Badge className={`${levelBadgeClass("Discovery")} border-0 text-xs`}>
                        Discovery
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={`${related.id}-${i}`}
                            className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">{related.department}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-12">
              No related content found for this item yet.
            </p>
          )}

          <h2 className="text-2xl font-bold text-foreground mb-8">Connected Workflows</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {integrationLinks.slice(0, 3).map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={link.action}
                className="bg-white border border-gray-200 rounded-xl hover:shadow-xl hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
              >
                <div className={`aspect-video bg-gradient-to-br ${getGradientForSeed(link.id)} flex items-center justify-center`}>
                  <Image className="w-12 h-12 text-white/40" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-2">Workflow Handoff</p>
                  <p className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{link.title}</p>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{link.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      Guided
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <BookOpen className="w-3 h-3" />
                      Workflow
                    </span>
                    <Badge className={`${levelBadgeClass("Stage 2")} border-0 text-xs`}>
                      Stage 2
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={`${link.id}-${i}`}
                          className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">Operational Path</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
        </>
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        context={{
          marketplace: "knowledge-center",
          tab: tab || "library",
          cardId: cardId || "",
          serviceName: getTitle(),
          action: pendingAction,
          commentText: pendingCommentText,
          requestMessage: pendingRequestMessage,
          sectionRef: pendingRequestSectionRef,
          requestType: pendingRequestType,
        }}
      />

      <Footer />
    </div>
  );
}
