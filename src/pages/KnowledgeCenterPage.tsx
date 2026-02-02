import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ChevronRight, BookOpen, Users, Award, Lightbulb, Quote, Map, Library } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FilterPanel, MobileFilterButton } from "@/components/learningCenter/FilterPanel";
import { SearchBar } from "@/components/learningCenter/SearchBar";
import { BestPracticeCard } from "@/components/knowledgeCenter/BestPracticeCard";
import { TestimonialCard } from "@/components/knowledgeCenter/TestimonialCard";
import { PlaybookCard } from "@/components/knowledgeCenter/PlaybookCard";
import { LibraryItemCard } from "@/components/knowledgeCenter/LibraryItemCard";
import { bestPractices, bestPracticesFilters } from "@/data/knowledgeCenter/bestPractices";
import { testimonials, testimonialsFilters } from "@/data/knowledgeCenter/testimonials";
import { playbooks, playbooksFilters } from "@/data/knowledgeCenter/playbooks";
import { libraryItems, libraryFilters } from "@/data/knowledgeCenter/library";

type TabType = "best-practices" | "testimonials" | "playbooks" | "library";

const tabPlaceholders: Record<TabType, string> = {
  "best-practices": "Search best practices, patterns, or topics...",
  testimonials: "Search testimonials, organizations, or outcomes...",
  playbooks: "Search playbooks, industries, or use cases...",
  library: "Search documents, topics, or authors...",
};

const tabIcons: Record<TabType, React.ElementType> = {
  "best-practices": Lightbulb,
  testimonials: Quote,
  playbooks: Map,
  library: Library,
};

export default function KnowledgeCenterPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabType) || "best-practices";
  
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const handleTabChange = (value: string) => {
    const tab = value as TabType;
    setActiveTab(tab);
    setSearchParams({ tab });
    setSelectedFilters({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (group: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[group] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [group]: updated };
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
  };

  const getCurrentFilters = () => {
    switch (activeTab) {
      case "best-practices":
        return bestPracticesFilters;
      case "testimonials":
        return testimonialsFilters;
      case "playbooks":
        return playbooksFilters;
      case "library":
        return libraryFilters;
      default:
        return {};
    }
  };

  const getResultCount = () => {
    switch (activeTab) {
      case "best-practices":
        return bestPractices.length;
      case "testimonials":
        return testimonials.length;
      case "playbooks":
        return playbooks.length;
      case "library":
        return libraryItems.length;
      default:
        return 0;
    }
  };

  const getResultLabel = () => {
    switch (activeTab) {
      case "best-practices":
        return "best practices";
      case "testimonials":
        return "testimonials";
      case "playbooks":
        return "playbooks";
      case "library":
        return "library items";
      default:
        return "items";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Marketplace Header */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces" className="hover:text-foreground transition-colors">
              Marketplaces
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground">Knowledge Center</span>
          </nav>

          {/* Phase Badge */}
          <span className="inline-block bg-phase-discern-bg text-phase-discern px-3 py-1 rounded-full text-xs font-semibold uppercase mb-3">
            Discern
          </span>

          {/* Title & Description */}
          <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-3">
            DTMP Knowledge Center
          </h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-3xl mb-4">
            Access proven practices, real-world transformation examples, and expert insights. 
            Leverage industry playbooks, best practices, testimonials, and comprehensive 
            reference materials to accelerate your digital transformation journey.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              65 Total Resources
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Enterprise-wide Access
            </span>
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Expert-Validated Content
            </span>
          </div>
        </div>
      </section>

      {/* Feature Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="bg-white border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto">
            <TabsList className="h-auto bg-transparent p-0 gap-2 overflow-x-auto flex justify-start px-4 lg:px-8">
              {(["best-practices", "testimonials", "playbooks", "library"] as TabType[]).map((tab) => {
                const Icon = tabIcons[tab];
                const counts = {
                  "best-practices": bestPractices.length,
                  testimonials: testimonials.length,
                  playbooks: playbooks.length,
                  library: libraryItems.length,
                };
                const labels = {
                  "best-practices": "Best Practices",
                  testimonials: "Testimonials",
                  playbooks: "Industry Playbooks",
                  library: "Library",
                };
                return (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="flex items-center gap-2 px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy data-[state=active]:shadow-none bg-transparent"
                  >
                    <Icon className="w-4 h-4" />
                    {labels[tab]}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`}>
                      {counts[tab]}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={tabPlaceholders[activeTab]}
        />

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto flex">
          {/* Filter Panel */}
          <FilterPanel
            filters={getCurrentFilters()}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearAll={clearAllFilters}
            isOpen={filterOpen}
            onClose={() => setFilterOpen(false)}
          />

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* Result Count */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 lg:px-8 py-3">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{getResultCount()}</span> {getResultLabel()}
              </p>
            </div>

            {/* Cards Grid */}
            <div className="px-4 lg:px-8 py-6">
              <TabsContent value="best-practices" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {bestPractices.map((practice) => (
                    <BestPracticeCard
                      key={practice.id}
                      practice={practice}
                      onClick={() => navigate(`/marketplaces/knowledge-center/best-practices/${practice.id}`)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="testimonials" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {testimonials.map((testimonial) => (
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                      onClick={() => navigate(`/marketplaces/knowledge-center/testimonials/${testimonial.id}`)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="playbooks" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {playbooks.map((playbook) => (
                    <PlaybookCard
                      key={playbook.id}
                      playbook={playbook}
                      onClick={() => navigate(`/marketplaces/knowledge-center/playbooks/${playbook.id}`)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="library" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {libraryItems.map((item) => (
                    <LibraryItemCard
                      key={item.id}
                      item={item}
                      onClick={() => navigate(`/marketplaces/knowledge-center/library/${item.id}`)}
                    />
                  ))}
                </div>
              </TabsContent>
            </div>
          </div>
        </div>
      </Tabs>

      {/* Mobile Filter Button */}
      <MobileFilterButton onClick={() => setFilterOpen(true)} />

      <Footer />
    </div>
  );
}
