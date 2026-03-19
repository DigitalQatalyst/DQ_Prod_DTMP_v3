import { useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  ChevronRight,
  FileX,
  HelpCircle,
} from "lucide-react";
import { solutionSpecs, SolutionType } from "@/data/blueprints/solutionSpecs";
import { solutionSpecsFilters } from "@/data/blueprints/filters";
import { createCustomSolutionSpecRequest } from "@/data/solutionSpecsWorkspace";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarketplaceHeader } from "@/components/shared/MarketplaceHeader";
import { TypeTabs } from "@/components/shared/TypeTabs";
import { FilterPanel } from "@/components/shared/FilterPanel";
import { SolutionSpecCard } from "@/components/cards/SolutionSpecCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterValue = string | string[] | number | boolean | undefined;

// ── Request Spec Dialog ──────────────────────────────────────────────────────
const DIVISIONS = [
  "Generation",
  "Transmission",
  "Distribution",
  "Water Services",
  "Customer Services",
  "Digital DEWA & Moro Hub",
  "Corporate Services",
];

const STREAMS = ["DBP", "DXP", "DWS", "DIA", "SDO"];
const SCOPES = ["Enterprise", "Departmental", "Project"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

interface RequestFormState {
  name: string;
  division: string;
  stream: string;
  scope: string;
  title: string;
  problem: string;
  priority: string;
  timeline: string;
}

const EMPTY_FORM: RequestFormState = {
  name: "",
  division: "",
  stream: "",
  scope: "",
  title: "",
  problem: "",
  priority: "",
  timeline: "",
};

function RequestSpecDialog({
  open,
  onClose,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [form, setForm] = useState<RequestFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const set = (field: keyof RequestFormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canSubmit =
    form.name.trim() &&
    form.division &&
    form.stream &&
    form.scope &&
    form.title.trim() &&
    form.problem.trim() &&
    form.priority;

  const handleSubmit = () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    // Persist to localStorage + create Stage 3 queue entry
    createCustomSolutionSpecRequest({
      requesterName: form.name.trim(),
      division: form.division,
      stream: form.stream as SolutionType,
      scope: form.scope,
      title: form.title.trim(),
      problem: form.problem.trim(),
      priority: form.priority as "Low" | "Medium" | "High" | "Urgent",
      timeline: form.timeline.trim(),
    });
    setForm(EMPTY_FORM);
    setLoading(false);
    onClose();
    // Navigate to Stage 2 My Requests
    onSubmitted();
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Request a Solution Spec
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Can't find what you need? Tell us what you're looking for and the
                TO Office will create a contextualised spec for your division.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="rs-name">Your Name <span className="text-red-500">*</span></Label>
                <Input
                  id="rs-name"
                  placeholder="e.g. Ahmed Al Mansouri"
                  value={form.name}
                  onChange={(e) => set("name")(e.target.value)}
                />
              </div>

              {/* Division */}
              <div className="space-y-1.5">
                <Label>Division <span className="text-red-500">*</span></Label>
                <Select value={form.division} onValueChange={set("division")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your division" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIVISIONS.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Stream + Scope — side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>DBP Stream <span className="text-red-500">*</span></Label>
                  <Select value={form.stream} onValueChange={set("stream")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Stream" />
                    </SelectTrigger>
                    <SelectContent>
                      {STREAMS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Scope <span className="text-red-500">*</span></Label>
                  <Select value={form.scope} onValueChange={set("scope")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Scope" />
                    </SelectTrigger>
                    <SelectContent>
                      {SCOPES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Spec title */}
              <div className="space-y-1.5">
                <Label htmlFor="rs-title">Spec Title <span className="text-red-500">*</span></Label>
                <Input
                  id="rs-title"
                  placeholder="e.g. Smart Metering Integration Architecture"
                  value={form.title}
                  onChange={(e) => set("title")(e.target.value)}
                />
              </div>

              {/* Problem / context */}
              <div className="space-y-1.5">
                <Label htmlFor="rs-problem">
                  What problem are you solving? <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="rs-problem"
                  placeholder="Describe the business challenge, the system context, and what the spec should address..."
                  rows={3}
                  value={form.problem}
                  onChange={(e) => set("problem")(e.target.value)}
                  className="resize-none"
                />
              </div>

              {/* Priority + Timeline — side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Priority <span className="text-red-500">*</span></Label>
                  <Select value={form.priority} onValueChange={set("priority")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rs-timeline">Target Timeline</Label>
                  <Input
                    id="rs-timeline"
                    placeholder="e.g. Q3 2026"
                    value={form.timeline}
                    onChange={(e) => set("timeline")(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || loading}
                className="bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
              >
                {loading ? "Submitting…" : "Submit Request"}
              </Button>
            </div>
          </>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export function SolutionSpecsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [requestOpen, setRequestOpen] = useState(false);

  const initialType = (searchParams.get("type") as SolutionType | null) || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<SolutionType | "all">(initialType);
  const [activeFilters, setActiveFilters] = useState<Record<string, FilterValue>>({});

  const typeCounts = useMemo(() => {
    const counts: Record<SolutionType, number> = {
      DBP: 0, DXP: 0, DWS: 0, DIA: 0, SDO: 0,
    };
    solutionSpecs.forEach((spec) => { counts[spec.solutionType]++; });
    return counts;
  }, []);

  const filteredSpecs = useMemo(() => {
    let results = solutionSpecs;
    if (activeType !== "all") results = results.filter((s) => s.solutionType === activeType);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    const scopeF = activeFilters.scope as string[] | undefined;
    if (scopeF?.length) results = results.filter((s) => scopeF.includes(s.scope));
    const matF = activeFilters.maturityLevel as string[] | undefined;
    if (matF?.length) results = results.filter((s) => matF.includes(s.maturityLevel));
    const diagF = activeFilters.hasDiagrams as string[] | undefined;
    if (diagF?.includes("true")) results = results.filter((s) => s.diagramCount > 0);
    const divF = activeFilters.divisionRelevance as string[] | undefined;
    if (divF?.length)
      results = results.filter((s) => s.divisionRelevance.some((d) => divF.includes(d)));
    const strF = activeFilters.stream as string[] | undefined;
    if (strF?.length) results = results.filter((s) => strF.includes(s.solutionType));
    return results;
  }, [searchQuery, activeType, activeFilters]);

  const handleTypeChange = useCallback(
    (type: SolutionType | "all") => {
      setActiveType(type);
      if (type === "all") searchParams.delete("type");
      else searchParams.set("type", type);
      setSearchParams(searchParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const handleFilterChange = useCallback((filterKey: string, value: FilterValue) => {
    setActiveFilters((prev) => ({ ...prev, [filterKey]: value }));
  }, []);

  const handleFilterReset = useCallback(() => setActiveFilters({}), []);

  const handleCardClick = useCallback(
    (id: string) => navigate(`/marketplaces/solution-specs/${id}`),
    [navigate]
  );

  // Right-column button passed into the header
  const requestButton = (
    <div className="flex flex-col gap-3">
      <Button
        size="sm"
        className="bg-white text-orange-600 hover:bg-orange-50 font-semibold self-start border border-orange-200"
        onClick={() => setRequestOpen(true)}
      >
        <HelpCircle className="w-4 h-4 mr-1" />
        Can't find the spec you need?
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
            <span className="font-medium text-foreground">Solution Specs</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <MarketplaceHeader
        title="Solution Specs"
        description="Browse DEWA's blueprint-led solution specifications across the Digital Business Platform streams. Find comprehensive architecture designs, component specifications, and implementation guidance contextualized to DEWA divisions and programmes."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        itemCount={filteredSpecs.length}
        searchPlaceholder="Search DEWA solution specs..."
        rightContent={requestButton}
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
            filters={solutionSpecsFilters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onReset={handleFilterReset}
          />
          <div className="flex-1">
            {filteredSpecs.length > 0 ? (
              <div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                role="list"
                aria-label="Solution specifications"
              >
                {filteredSpecs.map((spec) => (
                  <SolutionSpecCard key={spec.id} spec={spec} onClick={handleCardClick} />
                ))}
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-16 px-4 text-center"
                role="status"
                aria-live="polite"
              >
                <FileX className="w-16 h-16 text-gray-300 mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No solution specs found</h3>
                <p className="text-gray-600 max-w-md">
                  Try adjusting your search query or filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Request Spec Dialog */}
      <RequestSpecDialog
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        onSubmitted={() => navigate("/stage2/specs/my-requests")}
      />
    </div>
  );
}
