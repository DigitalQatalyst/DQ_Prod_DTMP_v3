import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ChevronRight, BookOpen, Users, Award, Lightbulb, Quote, Map, FileText, ScrollText, ShieldCheck, Scale } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FilterPanel, MobileFilterButton } from "@/components/learningCenter/FilterPanel";
import { SearchBar } from "@/components/learningCenter/SearchBar";
import { BestPracticeCard } from "@/components/knowledgeCenter/BestPracticeCard";
import { TestimonialCard } from "@/components/knowledgeCenter/TestimonialCard";
import { PlaybookCard } from "@/components/knowledgeCenter/PlaybookCard";
import { LibraryItemCard } from "@/components/knowledgeCenter/LibraryItemCard";
import { DesignReportCard } from "@/components/knowledgeCenter/DesignReportCard";
import { bestPractices, bestPracticesFilters } from "@/data/knowledgeCenter/bestPractices";
import { testimonials, testimonialsFilters } from "@/data/knowledgeCenter/testimonials";
import { playbooks, playbooksFilters } from "@/data/knowledgeCenter/playbooks";
import {
  architectureStandards,
  architectureStandardsFilters,
  designReports,
  designReportsFilters,
  executiveSummaries,
  governanceFrameworks,
  governanceFrameworksFilters,
  policiesProcedures,
  policiesProceduresFilters,
  strategyDocs,
  type DewaDocumentItem,
} from "@/data/knowledgeCenter/dewaDocuments";

type TabType =
  | "best-practices"
  | "testimonials"
  | "playbooks"
  | "design-reports"
  | "policies-procedures"
  | "executive-summaries"
  | "strategy-docs"
  | "architecture-standards"
  | "governance-frameworks";

const ITEMS_PER_PAGE = 9;

const tabConfig: Array<{ id: TabType; label: string; icon: React.ElementType }> = [
  { id: "best-practices", label: "Best Practices", icon: Lightbulb },
  { id: "testimonials", label: "Testimonials", icon: Quote },
  { id: "playbooks", label: "Industry Playbooks", icon: Map },
  { id: "design-reports", label: "Design Reports", icon: FileText },
  { id: "policies-procedures", label: "Policies & Procedures", icon: ScrollText },
  { id: "executive-summaries", label: "Executive Summaries", icon: FileText },
  { id: "strategy-docs", label: "Strategy Docs", icon: FileText },
  { id: "architecture-standards", label: "Architecture Standards", icon: ShieldCheck },
  { id: "governance-frameworks", label: "Governance Frameworks", icon: Scale },
];

const tabPlaceholders: Record<TabType, string> = {
  "best-practices": "Search best practices, patterns, or topics...",
  testimonials: "Search testimonials, organisations, or outcomes...",
  playbooks: "Search playbooks, topics, or contributors...",
  "design-reports": "Search design reports, divisions, or streams...",
  "policies-procedures": "Search policies, procedures, or governance documents...",
  "executive-summaries": "Search executive summaries...",
  "strategy-docs": "Search strategy docs...",
  "architecture-standards": "Search architecture standards...",
  "governance-frameworks": "Search governance frameworks...",
};

const includesQuery = (fields: Array<string | undefined>, query: string) => {
  if (!query.trim()) return true;
  const normalized = query.trim().toLowerCase();
  return fields.some((field) => (field ?? "").toLowerCase().includes(normalized));
};

const toDocumentCardItem = (item: DewaDocumentItem) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  contentType: item.domainLabel,
  format: item.format,
  typeIcon: "FileText",
  author: item.author,
  length: item.pageCount,
  datePublished: item.publishedDate ?? item.year,
  topics: item.topicPills,
  audience: item.audienceTag,
  statusBadge: item.statusBadge,
  version: item.version,
  subType: item.documentSubType,
});

export default function KnowledgeCenterPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabType) || "best-practices";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const totalResourceCount =
    bestPractices.length +
    testimonials.length +
    playbooks.length +
    designReports.length +
    policiesProcedures.length +
    executiveSummaries.length +
    strategyDocs.length +
    architectureStandards.length +
    governanceFrameworks.length;

  const handleTabChange = (value: string) => {
    const nextTab = value as TabType;
    setActiveTab(nextTab);
    setSearchParams({ tab: nextTab });
    setSelectedFilters({});
    setCurrentPage(1);
  };

  const handleFilterChange = (group: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[group] || [];
      const updated = current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value];
      return { ...prev, [group]: updated };
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, selectedFilters]);

  const filteredBestPractices = useMemo(
    () =>
      bestPractices.filter((item) => {
        if (!includesQuery([item.title, item.summary, item.domain, item.category, item.divisionTags.join(" "), item.impactAreas.join(" ")], searchQuery)) {
          return false;
        }
        const domains = selectedFilters.domain ?? [];
        if (domains.length > 0 && !domains.includes(item.domain) && !domains.includes(item.category)) return false;
        const divisions = selectedFilters.departmentApplicability ?? [];
        if (divisions.length > 0 && !divisions.some((division) => item.divisionTags.includes(division) || item.divisionTags.includes("All Divisions"))) return false;
        const maturity = selectedFilters.maturityLevel ?? [];
        if (maturity.length > 0 && !maturity.includes(item.maturityBand)) return false;
        const complexity = selectedFilters.implementationComplexity ?? [];
        if (complexity.length > 0 && !complexity.includes(item.complexity)) return false;
        const contentType = selectedFilters.contentType ?? [];
        if (contentType.length > 0 && !contentType.includes(item.contentType)) return false;
        return true;
      }),
    [searchQuery, selectedFilters]
  );

  const filteredTestimonials = useMemo(
    () =>
      testimonials.filter((item) => {
        if (!includesQuery([item.title, item.organization, item.quote, item.department, item.sectorTag, item.outcomes.join(" ")], searchQuery)) {
          return false;
        }
        const department = selectedFilters.department ?? [];
        if (department.length > 0 && !department.includes(item.department)) return false;
        const orgType = selectedFilters.organizationType ?? [];
        if (orgType.length > 0 && !orgType.includes(item.organizationType)) return false;
        const phase = selectedFilters.transformationPhase ?? [];
        if (phase.length > 0 && !phase.includes("All Phases") && !phase.includes(item.phase)) return false;
        const outcomes = selectedFilters.outcomeType ?? [];
        if (outcomes.length > 0 && !outcomes.some((entry) => item.outcomeType.includes(entry))) return false;
        return true;
      }),
    [searchQuery, selectedFilters]
  );

  const filteredPlaybooks = useMemo(
    () =>
      playbooks.filter((item) => {
        if (!includesQuery([item.title, item.description, item.departmentTag, item.dewaRelevanceTag, item.topics.join(" "), item.contributor], searchQuery)) {
          return false;
        }
        const department = selectedFilters.department ?? [];
        if (department.length > 0 && !department.includes(item.departmentTag)) return false;
        const type = selectedFilters.playbookType ?? [];
        if (type.length > 0 && !type.includes(item.type)) return false;
        const scope = selectedFilters.scope ?? [];
        if (scope.length > 0 && !scope.includes(item.scope)) return false;
        const format = selectedFilters.format ?? [];
        if (format.length > 0 && !format.includes(item.format)) return false;
        const contributor = selectedFilters.contributedBy ?? [];
        if (contributor.length > 0 && !contributor.includes(item.contributor)) return false;
        return true;
      }),
    [searchQuery, selectedFilters]
  );

  const filterDocuments = (items: DewaDocumentItem[], config?: { allowDocType?: boolean; allowStatus?: boolean; allowDomain?: boolean; allowAudience?: boolean; allowSubtype?: boolean; allowDivision?: boolean; allowStream?: boolean; allowAi?: boolean }) =>
    items.filter((item) => {
      if (
        !includesQuery(
          [
            item.title,
            item.description,
            item.domainLabel,
            item.docTypeLabel,
            item.documentSubType,
            item.division,
            item.stream,
            item.topicPills.join(" "),
          ],
          searchQuery
        )
      ) {
        return false;
      }

      if (config?.allowDomain) {
        const domain = selectedFilters.domain ?? [];
        if (domain.length > 0 && !domain.includes(item.domainLabel)) return false;
      }
      if (config?.allowStatus) {
        const status = selectedFilters.status ?? [];
        if (status.length > 0 && item.statusBadge && !status.includes(item.statusBadge)) return false;
      }
      if (config?.allowAudience) {
        const audience = selectedFilters.audience ?? [];
        if (audience.length > 0 && !audience.includes(item.audienceTag)) return false;
      }
      if (config?.allowSubtype) {
        const subtypes = selectedFilters.documentSubType ?? [];
        if (subtypes.length > 0 && item.documentSubType && !subtypes.includes(item.documentSubType)) return false;
      }
      if (config?.allowDivision) {
        const division = selectedFilters.division ?? [];
        if (division.length > 0 && item.division && !division.includes(item.division)) return false;
      }
      if (config?.allowStream) {
        const stream = selectedFilters.stream ?? [];
        if (stream.length > 0 && item.stream && !stream.includes(item.stream)) return false;
      }
      if (config?.allowDocType) {
        const docType = selectedFilters.docType ?? [];
        if (docType.length > 0 && item.docTypeLabel && !docType.includes(item.docTypeLabel)) return false;
      }
      if (config?.allowAi) {
        const ai = selectedFilters.aiGeneration ?? [];
        if (ai.length > 0 && item.aiGenerationBadge && !ai.includes(item.aiGenerationBadge)) return false;
      }
      return true;
    });

  const filteredDesignReports = useMemo(() => filterDocuments(designReports, { allowDivision: true, allowStream: true, allowDocType: true }), [searchQuery, selectedFilters]);
  const filteredPoliciesProcedures = useMemo(() => filterDocuments(policiesProcedures, { allowSubtype: true, allowDomain: true, allowAudience: true, allowAi: true }), [searchQuery, selectedFilters]);
  const filteredExecutiveSummaries = useMemo(() => filterDocuments(executiveSummaries), [searchQuery, selectedFilters]);
  const filteredStrategyDocs = useMemo(() => filterDocuments(strategyDocs), [searchQuery, selectedFilters]);
  const filteredArchitectureStandards = useMemo(() => filterDocuments(architectureStandards, { allowDomain: true, allowStatus: true, allowAudience: true }), [searchQuery, selectedFilters]);
  const filteredGovernanceFrameworks = useMemo(() => filterDocuments(governanceFrameworks, { allowDomain: true, allowStatus: true, allowAudience: true }), [searchQuery, selectedFilters]);

  const activeItems = (() => {
    switch (activeTab) {
      case "best-practices": return filteredBestPractices;
      case "testimonials": return filteredTestimonials;
      case "playbooks": return filteredPlaybooks;
      case "design-reports": return filteredDesignReports;
      case "policies-procedures": return filteredPoliciesProcedures;
      case "executive-summaries": return filteredExecutiveSummaries;
      case "strategy-docs": return filteredStrategyDocs;
      case "architecture-standards": return filteredArchitectureStandards;
      case "governance-frameworks": return filteredGovernanceFrameworks;
    }
  })();

  const totalPages = Math.max(1, Math.ceil(activeItems.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginate = <T,>(items: T[]) =>
    items.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const pagedBestPractices = paginate(filteredBestPractices);
  const pagedTestimonials = paginate(filteredTestimonials);
  const pagedPlaybooks = paginate(filteredPlaybooks);
  const pagedDesignReports = paginate(filteredDesignReports);
  const pagedPoliciesProcedures = paginate(filteredPoliciesProcedures);
  const pagedExecutiveSummaries = paginate(filteredExecutiveSummaries);
  const pagedStrategyDocs = paginate(filteredStrategyDocs);
  const pagedArchitectureStandards = paginate(filteredArchitectureStandards);
  const pagedGovernanceFrameworks = paginate(filteredGovernanceFrameworks);

  const getCurrentFilters = () => {
    switch (activeTab) {
      case "best-practices": return bestPracticesFilters;
      case "testimonials": return testimonialsFilters;
      case "playbooks": return playbooksFilters;
      case "design-reports": return designReportsFilters;
      case "policies-procedures": return policiesProceduresFilters;
      case "executive-summaries": return {};
      case "strategy-docs": return {};
      case "architecture-standards": return architectureStandardsFilters;
      case "governance-frameworks": return governanceFrameworksFilters;
    }
  };

  const counts: Record<TabType, number> = {
    "best-practices": filteredBestPractices.length,
    testimonials: filteredTestimonials.length,
    playbooks: filteredPlaybooks.length,
    "design-reports": filteredDesignReports.length,
    "policies-procedures": filteredPoliciesProcedures.length,
    "executive-summaries": filteredExecutiveSummaries.length,
    "strategy-docs": filteredStrategyDocs.length,
    "architecture-standards": filteredArchitectureStandards.length,
    "governance-frameworks": filteredGovernanceFrameworks.length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-gradient-to-b from-blue-50 to-white py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces" className="hover:text-foreground transition-colors">Marketplaces</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground">Knowledge Centre</span>
          </nav>

          <span className="inline-block bg-phase-discern-bg text-phase-discern px-3 py-1 rounded-full text-xs font-semibold uppercase mb-3">
            Discern
          </span>

          <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-3">DTMP Knowledge Centre</h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-4xl mb-4">
            Access DEWA-specific enterprise architecture resources, transformation knowledge, and governance reference materials. Browse best practices, testimonials, industry playbooks, DEWA design outputs, policies, procedures, executive summaries, strategy documents, architecture standards, and governance frameworks - all curated by DEWA&apos;s Corporate EA Office.
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" />{totalResourceCount} Total Resources</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4" />Enterprise-wide Access</span>
            <span className="flex items-center gap-2"><Award className="w-4 h-4" />Expert-Validated Content</span>
          </div>
        </div>
      </section>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="bg-white border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto">
            <TabsList className="h-auto bg-transparent p-0 gap-2 overflow-x-auto flex justify-start px-4 lg:px-8">
              {tabConfig.map(({ id, label, icon: Icon }) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className="flex items-center gap-2 px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy data-[state=active]:shadow-none bg-transparent"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === id ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`}>
                    {counts[id]}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={tabPlaceholders[activeTab]} />

        <div className="max-w-7xl mx-auto flex">
          <FilterPanel
            filters={getCurrentFilters()}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearAll={clearAllFilters}
            isOpen={filterOpen}
            onClose={() => setFilterOpen(false)}
          />

          <div className="flex-1 min-w-0">
            <div className="bg-gray-50 border-b border-gray-200 px-4 lg:px-8 py-3">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{activeItems.length}</span> items
              </p>
            </div>

            <div className="px-4 lg:px-8 py-6">
              <TabsContent value="best-practices" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pagedBestPractices.map((item) => (
                    <BestPracticeCard key={item.id} practice={item} onClick={() => navigate(`/marketplaces/knowledge-center/best-practices/${item.id}`)} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="testimonials" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pagedTestimonials.map((item) => (
                    <TestimonialCard key={item.id} testimonial={item} onClick={() => navigate(`/marketplaces/knowledge-center/testimonials/${item.id}`)} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="playbooks" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pagedPlaybooks.map((item) => (
                    <PlaybookCard key={item.id} playbook={item} onClick={() => navigate(`/marketplaces/knowledge-center/playbooks/${item.id}`)} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="design-reports" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pagedDesignReports.map((item) => (
                    <DesignReportCard key={item.id} report={item} onClick={() => navigate(`/marketplaces/knowledge-center/design-reports/${item.id}`)} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="policies-procedures" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pagedPoliciesProcedures.map((item) => (
                    <LibraryItemCard
                      key={item.id}
                      item={toDocumentCardItem(item)}
                      onClick={() => navigate(`/marketplaces/knowledge-center/policies-procedures/${item.id}`)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="executive-summaries" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pagedExecutiveSummaries.map((item) => (
                    <LibraryItemCard
                      key={item.id}
                      item={toDocumentCardItem(item)}
                      onClick={() => navigate(`/marketplaces/knowledge-center/executive-summaries/${item.id}`)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="strategy-docs" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pagedStrategyDocs.map((item) => (
                    <LibraryItemCard
                      key={item.id}
                      item={toDocumentCardItem(item)}
                      onClick={() => navigate(`/marketplaces/knowledge-center/strategy-docs/${item.id}`)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="architecture-standards" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pagedArchitectureStandards.map((item) => (
                    <LibraryItemCard
                      key={item.id}
                      item={toDocumentCardItem(item)}
                      onClick={() => navigate(`/marketplaces/knowledge-center/architecture-standards/${item.id}`)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="governance-frameworks" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pagedGovernanceFrameworks.map((item) => (
                    <LibraryItemCard
                      key={item.id}
                      item={toDocumentCardItem(item)}
                      onClick={() => navigate(`/marketplaces/knowledge-center/governance-frameworks/${item.id}`)}
                    />
                  ))}
                </div>
              </TabsContent>

              {activeItems.length === 0 && (
                <p className="text-sm text-muted-foreground">No items match your current search and filters.</p>
              )}

              {activeItems.length > 0 && totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4">
                  <p className="text-sm text-muted-foreground">Page {safePage} of {totalPages}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={safePage === 1}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={safePage === totalPages}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Tabs>

      <MobileFilterButton onClick={() => setFilterOpen(true)} />
      <Footer />
    </div>
  );
}
