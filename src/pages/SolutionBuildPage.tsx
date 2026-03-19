import { useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams, Link, useLocation } from "react-router-dom";
import { ChevronRight, HelpCircle, Rocket } from "lucide-react";
import { solutionBuilds, DEWA_DIVISIONS } from "@/data/blueprints/solutionBuilds";
import type { SolutionType } from "@/data/blueprints/solutionSpecs";
import { solutionBuildFilters } from "@/data/blueprints/filters";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarketplaceHeader } from "@/components/shared/MarketplaceHeader";
import { TypeTabs } from "@/components/shared/TypeTabs";
import { FilterPanel } from "@/components/shared/FilterPanel";
import { SolutionBuildCard } from "@/components/cards/SolutionBuildCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileX } from "lucide-react";
import { createCustomBuildRequest } from "@/data/solutionBuildWorkspace";
import type { BuildRequestPriority, BuildTimeline } from "@/data/solutionBuildWorkspace";
import type { DewaDivision } from "@/data/blueprints/solutionBuilds";

type FilterValue = string | string[] | number | boolean | undefined;

export function SolutionBuildPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const sourceSpecTitle = (location.state as { sourceSpecTitle?: string } | null)?.sourceSpecTitle;
  const sourceStream = (location.state as { sourceStream?: string } | null)?.sourceStream;

  const initialType = (searchParams.get("type") as SolutionType | null) || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<SolutionType | "all">(initialType);
  const [activeFilters, setActiveFilters] = useState<Record<string, FilterValue>>({});

  // Custom build dialog
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customForm, setCustomForm] = useState({
    dewaDivision: DEWA_DIVISIONS[0] as DewaDivision,
    programme: "",
    businessNeed: "",
    currentState: "",
    keyRequirements: "",
    timelinePreference: "Standard" as BuildTimeline,
    priority: "Medium" as BuildRequestPriority,
    additionalRequirements: "",
  });
  const [customSubmitting, setCustomSubmitting] = useState(false);

  const typeCounts = useMemo(() => {
    const counts: Record<SolutionType, number> = { DBP: 0, DXP: 0, DWS: 0, DIA: 0, SDO: 0 };
    solutionBuilds.forEach(b => { counts[b.solutionType]++; });
    return counts;
  }, []);

  const filteredBuilds = useMemo(() => {
    let results = [...solutionBuilds];

    if (activeType !== "all") {
      results = results.filter(b => b.solutionType === activeType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.shortDescription.toLowerCase().includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q)) ||
        b.divisionRelevance.some(d => d.toLowerCase().includes(q))
      );
    }

    const complexityFilters = activeFilters.complexity as string[] | undefined;
    if (complexityFilters && complexityFilters.length > 0) {
      results = results.filter(b => complexityFilters.includes(b.complexity));
    }

    const divisionFilters = activeFilters.divisionRelevance as string[] | undefined;
    if (divisionFilters && divisionFilters.length > 0) {
      results = results.filter(b =>
        divisionFilters.some(d => b.divisionRelevance.includes(d))
      );
    }

    const specFilter = activeFilters.hasMatchingSpec as string[] | undefined;
    if (specFilter && specFilter.includes("yes")) {
      results = results.filter(b => !!b.fromSpecId);
    }

    return results;
  }, [searchQuery, activeType, activeFilters]);

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

  const handleFilterChange = useCallback((filterKey: string, value: FilterValue) => {
    setActiveFilters(prev => ({ ...prev, [filterKey]: value }));
  }, []);

  const handleFilterReset = useCallback(() => {
    setActiveFilters({});
  }, []);

  const handleCardClick = useCallback(
    (id: string) => {
      navigate(`/marketplaces/solution-build/${id}`);
    },
    [navigate]
  );

  const handleCustomSubmit = () => {
    if (!customForm.businessNeed.trim()) return;
    setCustomSubmitting(true);
    try {
      createCustomBuildRequest({
        dewaDivision: customForm.dewaDivision,
        programme: customForm.programme,
        businessNeed: customForm.businessNeed,
        currentState: customForm.currentState,
        keyRequirements: customForm.keyRequirements,
        timelinePreference: customForm.timelinePreference,
        priority: customForm.priority,
        additionalRequirements: customForm.additionalRequirements,
      });
      setShowCustomDialog(false);
      navigate("/stage2/build/requests");
    } finally {
      setCustomSubmitting(false);
    }
  };

  const totalDeployments = solutionBuilds.reduce((sum, b) => sum + b.deploymentCount, 0);
  const streamCount = 5;

  const rightContent = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{solutionBuilds.length}</div>
          <div className="text-xs text-white/70 mt-0.5">Build Solutions</div>
        </div>
        <div className="w-px bg-white/20 self-stretch" />
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{streamCount}</div>
          <div className="text-xs text-white/70 mt-0.5">DBP Streams</div>
        </div>
        <div className="w-px bg-white/20 self-stretch" />
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{totalDeployments}</div>
          <div className="text-xs text-white/70 mt-0.5">Total Deployments</div>
        </div>
      </div>
      <Button
        size="sm"
        className="bg-white text-orange-600 hover:bg-orange-50 font-semibold self-start"
        onClick={() => setShowCustomDialog(true)}
      >
        <HelpCircle className="w-4 h-4 mr-1" />
        Can't find what you need?
      </Button>
    </div>
  );

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
            <span className="font-medium text-foreground">Solution Build</span>
          </nav>
        </div>
      </div>

      {/* Context banner — arriving from Solution Specs */}
      {sourceSpecTitle && (
        <div className="mx-auto mt-6 max-w-7xl px-4">
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 flex items-start gap-3">
            <Rocket className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-orange-900">
              <span className="font-semibold">Ready to build: </span>
              {sourceSpecTitle}
              {sourceStream ? ` (${sourceStream})` : ""}
              {". "}
              Browse the build solutions below and click <span className="font-semibold">Request Build</span> on the one that matches.
            </div>
          </div>
        </div>
      )}

      <MarketplaceHeader
        title="Solution Build"
        description="Production-ready DEWA deployment solutions across all 5 DBP streams. Each solution covers full delivery: architecture, integration, testing, go-live, and operational handover."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        itemCount={filteredBuilds.length}
        searchPlaceholder="Search by title, division, tag..."
        rightContent={rightContent}
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
          <FilterPanel
            filters={solutionBuildFilters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onReset={handleFilterReset}
          />

          <div className="flex-1">
            {filteredBuilds.length > 0 ? (
              <div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                role="list"
                aria-label="Solution builds"
              >
                {filteredBuilds.map(build => (
                  <SolutionBuildCard
                    key={build.id}
                    build={build}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-16 px-4 text-center"
                role="status"
                aria-live="polite"
              >
                <FileX className="w-16 h-16 text-gray-300 mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No solution builds found</h3>
                <p className="text-gray-600 max-w-md">
                  Try adjusting your search query or filters to find what you are looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Custom Build Dialog */}
      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request a Custom Build</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Can't find the right build solution? Tell us what you need and the TO team will assess it.
            </p>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">DEWA Division *</label>
                <select
                  value={customForm.dewaDivision}
                  onChange={e => setCustomForm(f => ({ ...f, dewaDivision: e.target.value as DewaDivision }))}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {DEWA_DIVISIONS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Programme / Initiative</label>
                <Input
                  placeholder="e.g. Digital DEWA Programme"
                  value={customForm.programme}
                  onChange={e => setCustomForm(f => ({ ...f, programme: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">What do you want to build? *</label>
              <Textarea
                placeholder="Describe what solution you need built and why..."
                value={customForm.businessNeed}
                onChange={e => setCustomForm(f => ({ ...f, businessNeed: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Current State</label>
              <Textarea
                placeholder="Describe the current situation or pain points..."
                value={customForm.currentState}
                onChange={e => setCustomForm(f => ({ ...f, currentState: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Key Requirements</label>
              <Textarea
                placeholder="List the key technical or business requirements..."
                value={customForm.keyRequirements}
                onChange={e => setCustomForm(f => ({ ...f, keyRequirements: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Timeline Preference</label>
                <select
                  value={customForm.timelinePreference}
                  onChange={e => setCustomForm(f => ({ ...f, timelinePreference: e.target.value as BuildTimeline }))}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ASAP (expedited)">ASAP (expedited)</option>
                  <option value="Standard">Standard</option>
                  <option value="Planned">Planned</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</label>
                <select
                  value={customForm.priority}
                  onChange={e => setCustomForm(f => ({ ...f, priority: e.target.value as BuildRequestPriority }))}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Additional Context</label>
              <Textarea
                placeholder="Any additional information, constraints, or context..."
                value={customForm.additionalRequirements}
                onChange={e => setCustomForm(f => ({ ...f, additionalRequirements: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t">
              <Button variant="outline" onClick={() => setShowCustomDialog(false)}>Cancel</Button>
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                disabled={!customForm.businessNeed.trim() || customSubmitting}
                onClick={handleCustomSubmit}
              >
                {customSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
