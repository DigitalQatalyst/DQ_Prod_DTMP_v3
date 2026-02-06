import { useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { solutionSpecs, SolutionType } from "@/data/blueprints/solutionSpecs";
import { solutionSpecsFilters } from "@/data/blueprints/filters";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarketplaceHeader } from "@/components/shared/MarketplaceHeader";
import { TypeTabs } from "@/components/shared/TypeTabs";
import { FilterPanel } from "@/components/shared/FilterPanel";
import { SolutionSpecCard } from "@/components/cards/SolutionSpecCard";
import { FileX } from "lucide-react";

type FilterValue = string | string[] | number | boolean | undefined;

export function SolutionSpecsPage() {
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

    solutionSpecs.forEach((spec) => {
      counts[spec.solutionType]++;
    });

    return counts;
  }, []);

  // Filter and search logic with memoization
  const filteredSpecs = useMemo(() => {
    let results = solutionSpecs;

    // Filter by solution type
    if (activeType !== "all") {
      results = results.filter((spec) => spec.solutionType === activeType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (spec) =>
          spec.title.toLowerCase().includes(query) ||
          spec.description.toLowerCase().includes(query) ||
          spec.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply active filters
    const scopeFilters = activeFilters.scope as string[] | undefined;
    if (scopeFilters && scopeFilters.length > 0) {
      results = results.filter((spec) => scopeFilters.includes(spec.scope));
    }

    const maturityFilters = activeFilters.maturityLevel as string[] | undefined;
    if (maturityFilters && maturityFilters.length > 0) {
      results = results.filter((spec) => maturityFilters.includes(spec.maturityLevel));
    }

    const hasDiagramsFilter = activeFilters.hasDiagrams as string[] | undefined;
    if (hasDiagramsFilter && hasDiagramsFilter.includes("true")) {
      results = results.filter((spec) => spec.diagramCount > 0);
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
      navigate(`/marketplaces/solution-specs/${id}`);
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
            <span className="font-medium text-foreground">Solution Specs</span>
          </nav>
        </div>
      </div>

      {/* Header Section */}
      <MarketplaceHeader
        title="Solution Specs"
        description="Explore blueprint-led solution specifications organized by solution type. Find comprehensive architecture designs, diagrams, and component specifications for your digital transformation initiatives."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        itemCount={filteredSpecs.length}
        searchPlaceholder="Search solution specs..."
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
            filters={solutionSpecsFilters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onReset={handleFilterReset}
          />

          {/* Content Grid */}
          <div className="flex-1">
            {filteredSpecs.length > 0 ? (
              <div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                role="list"
                aria-label="Solution specifications"
              >
                {filteredSpecs.map((spec) => (
                  <SolutionSpecCard
                    key={spec.id}
                    spec={spec}
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
                  No solution specs found
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
