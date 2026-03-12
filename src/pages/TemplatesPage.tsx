import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  ClipboardCheck,
  Layers,
  LayoutGrid,
  Sparkles,
  icons,
  LucideIcon,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchBar } from "@/components/learningCenter/SearchBar";
import { FilterPanel, MobileFilterButton } from "@/components/learningCenter/FilterPanel";
import {
  documentStudioFilters,
  documentStudioTabMeta,
  listDocumentStudioCards,
  type DocumentStudioTab,
} from "@/data/documentStudio";

const tabIcons: Record<DocumentStudioTab, LucideIcon> = {
  assessments: ClipboardCheck,
  "application-profiles": LayoutGrid,
  "design-reports": Layers,
};

const validTabs: DocumentStudioTab[] = [
  "assessments",
  "application-profiles",
  "design-reports",
];

const tabPlaceholders: Record<DocumentStudioTab, string> = {
  assessments: "Search assessments, frameworks, or scope...",
  "application-profiles": "Search application profiles, domains, or deployment models...",
  "design-reports": "Search design reports, streams, or divisions...",
};

type SortOption = "recommended" | "title-asc" | "usage-desc";

export default function DocumentStudioPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = validTabs.includes(searchParams.get("tab") as DocumentStudioTab)
    ? (searchParams.get("tab") as DocumentStudioTab)
    : "assessments";

  const [activeTab, setActiveTab] = useState<DocumentStudioTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState<SortOption>("recommended");

  const handleFilterChange = (group: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[group] ?? [];
      return {
        ...prev,
        [group]: current.includes(value)
          ? current.filter((entry) => entry !== value)
          : [...current, value],
      };
    });
  };

  const filteredCards = useMemo(() => {
    const cards = listDocumentStudioCards(activeTab);
    const q = searchQuery.trim().toLowerCase();
    const matches = cards.filter((card) => {
      const matchesSearch =
        !q ||
        card.title.toLowerCase().includes(q) ||
        card.description.toLowerCase().includes(q) ||
        Object.values(card.filters).some((value) => value.toLowerCase().includes(q));
      if (!matchesSearch) return false;

      return Object.entries(selectedFilters).every(([group, values]) => {
        if (values.length === 0) return true;
        return values.includes(card.filters[group] ?? "");
      });
    });

    if (sortBy === "title-asc") {
      return [...matches].sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortBy === "usage-desc") {
      return [...matches].sort((a, b) => b.usageCount - a.usageCount);
    }

    return matches;
  }, [activeTab, searchQuery, selectedFilters, sortBy]);

  const totalDocumentTypes = validTabs.reduce(
    (sum, tab) => sum + listDocumentStudioCards(tab).length,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-gradient-to-b from-blue-50 to-white py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces" className="hover:text-foreground transition-colors">
              Marketplaces
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground">Document Studio</span>
          </nav>

          <span className="inline-block bg-phase-design-bg text-phase-design px-3 py-1 rounded-full text-xs font-semibold uppercase mb-3">
            Design
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-3">
            Document Studio
          </h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-4xl mb-4">
            Generate context-specific documents on demand using AI. Submit a request
            with your organisational context and the Transformation Office will use AI
            DocWriter 4.0 to generate a tailored document ready for your review and use.
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4" />
              {totalDocumentTypes} Document Types
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI-Powered Generation
            </span>
            <span className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              PDF & DOCX Export
            </span>
          </div>
        </div>
      </section>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          const next = value as DocumentStudioTab;
          setActiveTab(next);
          setSearchParams({ tab: next });
          setSelectedFilters({});
          setSortBy("recommended");
        }}
      >
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <TabsList className="h-auto bg-transparent p-0 gap-2 overflow-x-auto flex justify-start px-4 lg:px-8">
              {validTabs.map((tab) => {
                const Icon = tabIcons[tab];
                const meta = documentStudioTabMeta[tab];
                return (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="flex items-center gap-2 px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 data-[state=active]:shadow-none bg-transparent"
                  >
                    <Icon className="w-4 h-4" />
                    {meta.label}
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
                      {listDocumentStudioCards(tab).length}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={tabPlaceholders[activeTab]}
        />

        <div className="max-w-7xl mx-auto flex">
          <FilterPanel
            filters={documentStudioFilters[activeTab]}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearAll={() => setSelectedFilters({})}
            isOpen={filterOpen}
            onClose={() => setFilterOpen(false)}
          />

          <div className="flex-1 min-w-0">
            <div className="bg-gray-50 border-b border-gray-200 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {filteredCards.length === 0 ? 0 : 1}
                  </span>{" "}
                  -{" "}
                  <span className="font-semibold text-foreground">{filteredCards.length}</span>{" "}
                  of <span className="font-semibold text-foreground">{filteredCards.length}</span>{" "}
                  document types
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {documentStudioTabMeta[activeTab].description}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Sort
                  </label>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortOption)}
                    className="border border-gray-300 rounded-md bg-white px-2 py-1 text-sm"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="title-asc">Title A-Z</option>
                    <option value="usage-desc">Most Used</option>
                  </select>
                </div>
              </div>
            </div>

            {validTabs.map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0">
                <div className="px-4 lg:px-8 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCards.map((card) => (
                      <DocumentStudioCard
                        key={card.id}
                        title={card.title}
                        description={card.description}
                        icon={card.icon}
                        badge={card.categoryBadge}
                        aiBadge={card.aiBadge}
                        pageRange={card.pageRange}
                        outputFormats={card.outputFormats}
                        specialFeature={card.specialFeature}
                        usageCount={card.usageCount}
                        onClick={() =>
                          navigate(`/marketplaces/document-studio/${activeTab}/${card.id}`)
                        }
                      />
                    ))}
                  </div>
                  {filteredCards.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No document types match your current filters.
                    </p>
                  )}
                </div>
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>

      <MobileFilterButton onClick={() => setFilterOpen(true)} />
      <Footer />
    </div>
  );
}

function DocumentStudioCard({
  title,
  description,
  icon,
  badge,
  aiBadge,
  pageRange,
  outputFormats,
  specialFeature,
  usageCount,
  onClick,
}: {
  title: string;
  description: string;
  icon: string;
  badge: string;
  aiBadge: string;
  pageRange: string;
  outputFormats: string[];
  specialFeature?: string;
  usageCount: number;
  onClick: () => void;
}) {
  const Icon = (icons[icon as keyof typeof icons] as LucideIcon) ?? Layers;

  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white text-left border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center">
          <Icon className="text-blue-600" size={28} />
        </div>
        <span className="bg-purple-50 border border-purple-200 px-2 py-1 rounded-full text-xs font-medium text-purple-700">
          {aiBadge}
        </span>
      </div>

      <div className="mb-3">
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
          {badge}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      <div className="space-y-2 text-xs text-gray-600 mb-4">
        <div>{pageRange}</div>
        <div>{outputFormats.join(", ")}</div>
        {specialFeature && <div>{specialFeature}</div>}
      </div>

      <div className="border-t border-gray-100 pt-4">
        <span className="text-xs text-gray-500">{usageCount} uses</span>
      </div>
    </button>
  );
}
