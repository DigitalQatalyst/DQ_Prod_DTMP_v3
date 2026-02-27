import { useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { solutionBuilds } from "@/data/blueprints/solutionBuilds";
import { SolutionType } from "@/data/blueprints/solutionSpecs";
import { solutionBuildFilters } from "@/data/blueprints/filters";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarketplaceHeader } from "@/components/shared/MarketplaceHeader";
import { TypeTabs } from "@/components/shared/TypeTabs";
import { FilterPanel } from "@/components/shared/FilterPanel";
import { SolutionBuildCard } from "@/components/cards/SolutionBuildCard";
import { FileX } from "lucide-react";

type FilterValue = string | string[] | number | boolean | undefined;

export function SolutionBuildPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize activeType from URL query parameter
  const initialType = (searchParams.get("type") as SolutionType | null) || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<SolutionType | "all">(initialType);
  const [activeFilters, setActiveFilters] = useState<Record<string, FilterValue>>({});

  // Calculate type counts
  const typeCounts = useMemo(() => {
    const counts: Record<SolutionType, number> = {
      DBP: 0,
      DXP: 0,
      DWS: 0,
      DIA: 0,
      SDO: 0,
    };

    solutionBuilds.forEach((build) => {
      counts[build.solutionType]++;
    });

    return counts;
  }, []);

  // Filter and search logic with memoization
  const filteredBuilds = useMemo(() => {
    let results = solutionBuilds;

    // Filter by solution type
    if (activeType !== "all") {
      results = results.filter((build) => build.solutionType === activeType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (build) =>
          build.title.toLowerCase().includes(query) ||
          build.description.toLowerCase().includes(query) ||
          build.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          build.technologyStack.some((tech) => tech.toLowerCase().includes(query))
      );
    }

    // Apply active filters
    const complexityFilters = activeFilters.buildComplexity as string[] | undefined;
    if (complexityFilters && complexityFilters.length > 0) {
      results = results.filter((build) => complexityFilters.includes(build.buildComplexity));
    }

    const automationFilters = activeFilters.automationLevel as string[] | undefined;
    if (automationFilters && automationFilters.length > 0) {
      results = results.filter((build) => automationFilters.includes(build.automationLevel));
    }

    const hasCodeSamplesFilter = activeFilters.hasCodeSamples as string[] | undefined;
    if (hasCodeSamplesFilter && hasCodeSamplesFilter.includes("true")) {
      results = results.filter((build) => build.codeSamples);
    }

    return results;
  }, [searchQuery, activeType, activeFilters]);

  // Handle type change and update URL
  const handleTypeChange = useCallback(
    (type: SolutionType | "all") => {
      setActiveType(type);
      if (type === "all") {
        searchParams.delete("type");
      } else {
        searchParams.set("type", type);
      }
      setSearchParams(searchParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Handle filter changes
  const handleFilterChange = useCallback((filterKey: string, value: FilterValue) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  }, []);

  // Handle filter reset
  const handleFilterReset = useCallback(() => {
    setActiveFilters({});
  }, []);

  // Handle card click
  const handleCardClick = useCallback(
    (id: string) => {
      navigate(`/marketplaces/solution-build/${id}`);
    },
    [navigate]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces" className="hover:text-foreground transition-colors">
              Marketplaces
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground">Solution Build</span>
          </nav>
        </div>
      </div>

      {/* Header Section */}
      <MarketplaceHeader
        title="Solution Build"
        description="Ready-to-deploy solutions organized by solution type. Access production-ready implementations, code samples, and technical resources for your digital transformation projects."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        itemCount={filteredBuilds.length}
        searchPlaceholder="Search solution builds..."
      />

      {/* Type Tabs */}
      <TypeTabs
        activeType={activeType}
        onTypeChange={handleTypeChange}
        typeCounts={typeCounts}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <FilterPanel
            filters={solutionBuildFilters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onReset={handleFilterReset}
          />

          {/* Content Grid */}
          <div className="flex-1">
            {filteredBuilds.length > 0 ? (
              <div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                role="list"
                aria-label="Solution builds"
              >
                {filteredBuilds.map((build) => (
                  <SolutionBuildCard
                    key={build.id}
                    build={build}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
            ) : (
              // Empty State
              <div
                className="flex flex-col items-center justify-center py-16 px-4 text-center"
                role="status"
                aria-live="polite"
              >
                <FileX className="w-16 h-16 text-gray-300 mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No solution builds found
                </h3>
                <p className="text-gray-600 max-w-md">
                  Try adjusting your search query or filters to find what you're looking
                  for.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
