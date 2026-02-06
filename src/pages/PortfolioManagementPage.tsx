import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ChevronRight, Briefcase, TrendingUp, AppWindow, FolderKanban } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { FilterPanel } from "@/components/learningCenter/FilterPanel";
import { SearchBar } from "@/components/learningCenter/SearchBar";
import { applicationPortfolio, projectPortfolio, portfolioFilters, portfolioStats } from "@/data/portfolio";

type TabType = "application-portfolio" | "project-portfolio";

const tabPlaceholders: Record<TabType, string> = {
  "application-portfolio": "Search application services or categories...",
  "project-portfolio": "Search project services or types...",
};

export default function PortfolioManagementPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabType) || "application-portfolio";
  
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

  // Get current services and filters based on active tab
  const currentServices = activeTab === "application-portfolio" ? applicationPortfolio : projectPortfolio;
  const currentFilters = activeTab === "application-portfolio" ? portfolioFilters.application : portfolioFilters.project;

  // Apply filters and search
  const filteredServices = currentServices.filter((service) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        service.keyMetrics.some(metric => metric.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Apply selected filters
    for (const [filterGroup, selectedValues] of Object.entries(selectedFilters)) {
      if (selectedValues.length > 0) {
        const serviceValue = (service as any)[filterGroup];
        if (!selectedValues.includes(serviceValue)) {
          return false;
        }
      }
    }

    return true;
  });

  const getResultLabel = () => {
    switch (activeTab) {
      case "application-portfolio":
        return "application services";
      case "project-portfolio":
        return "project services";
      default:
        return "services";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Marketplace Header */}
      <section className="bg-gradient-to-b from-orange-50 to-white py-8 lg:py-12">
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
            <span className="font-medium text-foreground">Portfolio Management</span>
          </nav>

          {/* Phase Badge */}
          <span className="inline-block bg-phase-drive-bg text-phase-drive px-3 py-1 rounded-full text-xs font-semibold uppercase mb-3">
            Drive
          </span>

          {/* Title & Description */}
          <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-3">
            DTMP Portfolio Management
          </h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-3xl mb-4">
            Strategic oversight and optimization of application and project portfolios. 
            Gain visibility into portfolio health, rationalize applications, optimize 
            TCO, track project delivery, and make data-driven investment decisions.
          </p>

          {/* Stats */}
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              {portfolioStats.totalServices} Portfolio Services
            </span>
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Real-time Analytics
            </span>
          </div>
        </div>
      </section>

      {/* Feature Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="bg-white border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto">
            <TabsList className="h-auto bg-transparent p-0 gap-2 overflow-x-auto flex justify-start px-4 lg:px-8">
              <TabsTrigger
                value="application-portfolio"
                className="flex items-center gap-2 px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy data-[state=active]:shadow-none bg-transparent"
              >
                <AppWindow className="w-5 h-5" />
                <span className="hidden sm:inline">Application Portfolio</span>
                <span className="sm:hidden">Applications</span>
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full ml-2">
                  {portfolioStats.applicationServices}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="project-portfolio"
                className="flex items-center gap-2 px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy data-[state=active]:shadow-none bg-transparent"
              >
                <FolderKanban className="w-5 h-5" />
                <span className="hidden sm:inline">Project Portfolio</span>
                <span className="sm:hidden">Projects</span>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full ml-2">
                  {portfolioStats.projectServices}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Panel */}
            <FilterPanel
              filters={currentFilters}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearAll={clearAllFilters}
              isOpen={filterOpen}
              onToggle={() => setFilterOpen(!filterOpen)}
            />

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Count */}
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {filteredServices.length} of {currentServices.length} {getResultLabel()}
                {searchQuery && ` for "${searchQuery}"`}
              </div>

              {/* Search Bar */}
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                placeholder={tabPlaceholders[activeTab]}
              />

              {/* Tab Content */}
              <TabsContent value="application-portfolio" className="mt-0">
                {filteredServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                      <PortfolioCard key={service.id} service={service} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No services found
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Try adjusting your search or filters to find what you're looking for.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="project-portfolio" className="mt-0">
                {filteredServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                      <PortfolioCard key={service.id} service={service} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No services found
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Try adjusting your search or filters to find what you're looking for.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </div>
          </div>
        </div>
      </Tabs>

      <Footer />
    </div>
  );
}