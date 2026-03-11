import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronRight, Download, ExternalLink, CheckCircle, Bookmark, Clock, FileText, Image, Star } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LoginModal } from "@/components/learningCenter/LoginModal";
import { bestPractices } from "@/data/knowledgeCenter/bestPractices";
import { testimonials } from "@/data/knowledgeCenter/testimonials";
import { playbooks } from "@/data/knowledgeCenter/playbooks";
import {
  architectureStandards,
  designReports,
  executiveSummaries,
  governanceFrameworks,
  policiesProcedures,
  strategyDocs,
  type DewaDocumentItem,
} from "@/data/knowledgeCenter/dewaDocuments";
import { getKnowledgeItem, getRelatedKnowledgeItems, type KnowledgeTab } from "@/data/knowledgeCenter/knowledgeItems";
import { isSavedKnowledgeItem, toggleSavedKnowledgeItem } from "@/data/knowledgeCenter/userKnowledgeState";

type DetailTab = "about" | "implementation" | "examples" | "resources";

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

export default function KnowledgeCenterDetailPage() {
  const { tab, cardId } = useParams<{ tab: string; cardId: string }>();
  const navigate = useNavigate();
  const [contentTab, setContentTab] = useState<DetailTab>("about");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const normalizedTab = validTabs.includes(tab as KnowledgeTab) ? (tab as KnowledgeTab) : null;

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
  }, [normalizedTab, cardId]);

  const knowledgeItem = normalizedTab && cardId ? getKnowledgeItem(normalizedTab, cardId) : undefined;
  const relatedItems = normalizedTab && cardId ? getRelatedKnowledgeItems(normalizedTab, cardId, 3) : [];

  if (!item || !normalizedTab || !cardId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Item Not Found</h1>
          <Button onClick={() => navigate("/marketplaces/knowledge-center")}>Back to Knowledge Centre</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const title = "title" in item ? item.title : "Knowledge Item";
  const description = "description" in item ? item.description : "";
  const isDocument = !("summary" in item) && !("quote" in item) && !("topics" in item && "coverGradient" in item);
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

  const getRelatedPath = (sourceTab: KnowledgeTab, sourceId: string) =>
    `/marketplaces/knowledge-center/${sourceTab}/${sourceId}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-muted-foreground flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces" className="hover:text-foreground transition-colors">Marketplaces</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces/knowledge-center" className="hover:text-foreground transition-colors">Knowledge Centre</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to={`/marketplaces/knowledge-center?tab=${normalizedTab}`} className="hover:text-foreground transition-colors">{tabLabels[normalizedTab]}</Link>
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
              <Badge key={badge} className="bg-slate-100 text-slate-700 border-0">{badge}</Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleViewResource} disabled={!!document?.comingSoon}>
              {document?.liveUrl ? <ExternalLink className="w-4 h-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
              {document?.comingSoon ? "Coming Soon" : "View Resource"}
            </Button>
            <Button variant="outline" onClick={handleSave}>
              <Bookmark className="w-4 h-4 mr-2" />
              {isSaved ? "Saved" : "Save to Workspace"}
            </Button>
          </div>
        </div>
      </section>

      <Tabs value={contentTab} onValueChange={(value) => setContentTab(value as DetailTab)} className="w-full">
        <div className="bg-white border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto">
            <TabsList className="h-auto bg-transparent p-0 gap-1 overflow-x-auto flex justify-start px-4 lg:px-8">
              {["about", "implementation", "examples", "resources"].map((entry) => (
                <TabsTrigger
                  key={entry}
                  value={entry}
                  className="px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy data-[state=active]:shadow-none bg-transparent capitalize"
                >
                  {entry}
                </TabsTrigger>
              ))}
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
                        <Badge key={tag} className="bg-orange-50 text-orange-700 border-0">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="implementation" className="mt-0">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">Implementation Guidance</h2>
                  <p className="text-muted-foreground">
                    Use this resource as a DEWA reference point for architecture decisions, governance reviews, and programme execution. Apply the guidance in the context of the relevant division, 4D phase, and connected platform or initiative.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="examples" className="mt-0">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">Examples</h2>
                  <p className="text-muted-foreground">
                    Related examples, case signals, and reference points should be interpreted against DEWA's operational environment, architecture standards, and transformation governance requirements.
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
                        <p className="text-sm text-muted-foreground">{document?.format ?? "PDF"} resource</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>

            <aside className="lg:w-80 flex-shrink-0">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-4">Resource Details</h3>
                <div className="space-y-3 text-sm">
                  <p><span className="text-muted-foreground">Type:</span> {knowledgeItem?.type ?? tabLabels[normalizedTab]}</p>
                  <p><span className="text-muted-foreground">Audience:</span> {knowledgeItem?.audience ?? "All Roles"}</p>
                  <p><span className="text-muted-foreground">Updated:</span> {knowledgeItem?.updatedAt ?? document?.year}</p>
                  <p><span className="text-muted-foreground">Author:</span> {knowledgeItem?.author ?? document?.author}</p>
                  {document?.pageCount && <p><span className="text-muted-foreground">Length:</span> {document.pageCount}</p>}
                </div>
                {isDesignReport && document && (
                  <div className="mt-6 rounded-lg bg-orange-50 border border-orange-200 p-4 text-sm">
                    <p className="font-semibold text-orange-800 mb-2">Design Reports Demo</p>
                    <p className="text-orange-700">
                      This item is published from Document Studio. The live demo card opens the generated report directly; placeholders remain visible but unavailable until publication.
                    </p>
                  </div>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{related.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{related.description}</p>
                    <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">{related.type}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No related content found for this item yet.</p>
          )}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8">Connected Workflows</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Open Learning Centre", description: "Start linked learning pathways and role-based courses." },
              { title: "Launch Portfolio Management", description: "Apply this guidance to active transformation initiatives." },
              { title: "Open Lifecycle Management", description: "Use this content while preparing lifecycle artefacts." },
            ].map((workflow) => (
              <div key={workflow.title} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <p className="text-lg font-semibold text-gray-900 mb-2">{workflow.title}</p>
                <p className="text-sm text-gray-600 mb-4">{workflow.description}</p>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className={`w-4 h-4 ${index < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
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
