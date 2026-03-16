import { useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ChevronRight, Plus, Check, FileX } from "lucide-react";
import { solutionSpecs, SolutionType } from "@/data/blueprints/solutionSpecs";
import { solutionSpecsFilters } from "@/data/blueprints/filters";
import {
  addBlueprintTORequest,
  linkBlueprintTORequestToStage3,
} from "@/data/blueprints/requestState";
import { createStage3Request } from "@/data/stage3";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarketplaceHeader } from "@/components/shared/MarketplaceHeader";
import { TypeTabs } from "@/components/shared/TypeTabs";
import { FilterPanel } from "@/components/shared/FilterPanel";
import { SolutionSpecCard } from "@/components/cards/SolutionSpecCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type FilterValue = string | string[] | number | boolean | undefined;
type RequestType = "current-build" | "enhancement" | "integration" | "";

interface SpecFormData {
  requestType: RequestType;
  solutionName: string;
  businessNeed: string;
  requirements: string;
  timeline: string;
}

const REQUEST_TYPES = [
  { value: "current-build", label: "Current Build",  description: "Adopt the blueprint as-is without modifications" },
  { value: "enhancement",   label: "Enhancement",    description: "Enhance an existing solution" },
  { value: "integration",   label: "Integration",    description: "Integrate multiple systems" },
] as const;

const TIMELINE_OPTIONS = [
  "Less than 1 month",
  "1 – 3 months",
  "3 – 6 months",
  "6 – 12 months",
  "More than 12 months",
];

export function SolutionSpecsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialType = (searchParams.get("type") as SolutionType | null) || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<SolutionType | "all">(initialType);
  const [activeFilters, setActiveFilters] = useState<Record<string, FilterValue>>({});

  const [showFormDialog, setShowFormDialog] = useState(false);
  const [formData, setFormData] = useState<SpecFormData>({
    requestType: "",
    solutionName: "",
    businessNeed: "",
    requirements: "",
    timeline: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const typeCounts = useMemo(() => {
    const counts: Record<SolutionType, number> = { DBP: 0, DXP: 0, DWS: 0, DIA: 0, SDO: 0 };
    solutionSpecs.forEach((spec) => { counts[spec.solutionType]++; });
    return counts;
  }, []);

  const filteredSpecs = useMemo(() => {
    let results = solutionSpecs;
    if (activeType !== "all") results = results.filter((s) => s.solutionType === activeType);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    const scopeFilters = activeFilters.scope as string[] | undefined;
    if (scopeFilters?.length) results = results.filter((s) => scopeFilters.includes(s.scope));
    const maturityFilters = activeFilters.maturityLevel as string[] | undefined;
    if (maturityFilters?.length) results = results.filter((s) => maturityFilters.includes(s.maturityLevel));
    const hasDiagrams = activeFilters.hasDiagrams as string[] | undefined;
    if (hasDiagrams?.includes("true")) results = results.filter((s) => s.diagramCount > 0);
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

  const handleFilterChange = useCallback((key: string, value: FilterValue) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleFilterReset = useCallback(() => setActiveFilters({}), []);

  const handleCardClick = useCallback(
    (id: string) => navigate(`/marketplaces/solution-specs/${id}`),
    [navigate]
  );

  const openNewRequest = () => {
    setFormData({ requestType: "", solutionName: "", businessNeed: "", requirements: "", timeline: "" });
    setFormErrors({});
    setShowFormDialog(true);
  };

  const handleSubmitRequest = () => {
    const errors: Record<string, string> = {};
    if (!formData.requestType)          errors.requestType  = "Required";
    if (!formData.solutionName.trim())  errors.solutionName = "Required";
    if (!formData.businessNeed.trim())  errors.businessNeed = "Required";
    if (!formData.requirements.trim())  errors.requirements = "Required";
    if (!formData.timeline)             errors.timeline     = "Required";
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    const blueprintRequest = addBlueprintTORequest({
      itemId: `custom-${Date.now()}`,
      itemTitle: formData.solutionName,
      marketplace: "solution-specs",
      requesterName: "Amina TO",
      requesterRole: "Portfolio Manager",
      message: JSON.stringify({
        requestType: formData.requestType,
        timeline: formData.timeline,
        businessNeed: formData.businessNeed,
        requirements: formData.requirements,
      }),
    });

    if (blueprintRequest) {
      const stage3Request = createStage3Request({
        type: "solution-specs",
        title: `Solution Spec Build: ${formData.solutionName}`,
        description: formData.businessNeed,
        requester: { name: "Amina TO", email: "amina.to@dtmp.local", department: "Transformation Office", organization: "DTMP" },
        priority: "medium",
        estimatedHours: 16,
        tags: ["solution-specs", formData.requestType.replace("-", " ")],
        relatedAssets: [`solution-spec-request:${blueprintRequest.id}`],
        notes: [
          `Request Type: ${formData.requestType}`,
          `Timeline: ${formData.timeline}`,
          `Business Need: ${formData.businessNeed}`,
          `Requirements: ${formData.requirements}`,
        ],
      });
      linkBlueprintTORequestToStage3(blueprintRequest.id, stage3Request.id);
    }

    setShowFormDialog(false);
    navigate("/stage2/specs/overview", {
      state: { fromRequest: true, serviceName: formData.solutionName, requestType: formData.requestType },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <nav className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces" className="hover:text-foreground transition-colors">Marketplaces</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground">Solution Specs</span>
          </nav>
          <button
            onClick={openNewRequest}
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
        </div>
      </div>

      <MarketplaceHeader
        title="Solution Specs"
        description="Explore blueprint-led solution specifications organized by solution type. Find comprehensive architecture designs, diagrams, and component specifications for your digital transformation initiatives."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        itemCount={filteredSpecs.length}
        searchPlaceholder="Search solution specs..."
      />

      <TypeTabs activeType={activeType} onTypeChange={handleTypeChange} typeCounts={typeCounts} />

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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" role="list" aria-label="Solution specifications">
                {filteredSpecs.map((spec) => (
                  <SolutionSpecCard key={spec.id} spec={spec} onClick={handleCardClick} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center" role="status" aria-live="polite">
                <FileX className="w-16 h-16 text-gray-300 mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No solution specs found</h3>
                <p className="text-gray-600 max-w-md">Try adjusting your search query or filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* ── Request Form Dialog ── */}
      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">New Solution Spec Request</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">Submit a custom solution specification build request</p>
          </DialogHeader>

          <div className="space-y-6 mt-2">

            {/* Request Type */}
            <div>
              <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                Request Type <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={formData.requestType}
                onValueChange={(v) => { setFormData({ ...formData, requestType: v as RequestType }); setFormErrors({ ...formErrors, requestType: "" }); }}
                className="space-y-2"
              >
                {REQUEST_TYPES.map((type) => (
                  <div
                    key={type.value}
                    onClick={() => { setFormData({ ...formData, requestType: type.value }); setFormErrors({ ...formErrors, requestType: "" }); }}
                    className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 cursor-pointer transition-all ${
                      formData.requestType === type.value ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                    }`}
                  >
                    <RadioGroupItem value={type.value} id={`pg-rt-${type.value}`} className="flex-shrink-0" />
                    <div>
                      <Label htmlFor={`pg-rt-${type.value}`} className="text-sm font-semibold text-gray-900 cursor-pointer block">{type.label}</Label>
                      <p className="text-xs text-gray-500 mt-0.5">{type.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
              {formErrors.requestType && <p className="text-xs text-red-600 mt-1">{formErrors.requestType}</p>}
            </div>

            {/* Solution Name */}
            <div>
              <Label htmlFor="pg-solutionName" className="text-sm font-semibold text-gray-900 mb-2 block">
                Solution Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pg-solutionName"
                value={formData.solutionName}
                onChange={(e) => { setFormData({ ...formData, solutionName: e.target.value }); setFormErrors({ ...formErrors, solutionName: "" }); }}
                placeholder="Enter a name for this solution request"
                className="w-full"
              />
              {formErrors.solutionName && <p className="text-xs text-red-600 mt-1">{formErrors.solutionName}</p>}
            </div>

            {/* Business Need */}
            <div>
              <Label htmlFor="pg-businessNeed" className="text-sm font-semibold text-gray-900 mb-1 block">
                Business Need <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500 mb-2">Describe the business problem or opportunity this solution should address.</p>
              <Textarea
                id="pg-businessNeed"
                value={formData.businessNeed}
                onChange={(e) => { setFormData({ ...formData, businessNeed: e.target.value }); setFormErrors({ ...formErrors, businessNeed: "" }); }}
                placeholder="e.g. We need to unify our customer data across 5 regional systems to enable real-time personalisation..."
                rows={4}
                className="w-full resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{formData.businessNeed.length} characters</p>
              {formErrors.businessNeed && <p className="text-xs text-red-600">{formErrors.businessNeed}</p>}
            </div>

            {/* Requirements */}
            <div>
              <Label htmlFor="pg-requirements" className="text-sm font-semibold text-gray-900 mb-1 block">
                Requirements <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500 mb-2">List the functional and non-functional requirements for this solution.</p>
              <Textarea
                id="pg-requirements"
                value={formData.requirements}
                onChange={(e) => { setFormData({ ...formData, requirements: e.target.value }); setFormErrors({ ...formErrors, requirements: "" }); }}
                placeholder={`e.g.\n• Must integrate with SAP and Salesforce\n• Real-time data synchronisation\n• Role-based access control`}
                rows={4}
                className="w-full resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{formData.requirements.length} characters</p>
              {formErrors.requirements && <p className="text-xs text-red-600">{formErrors.requirements}</p>}
            </div>

            {/* Timeline */}
            <div>
              <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                Expected Timeline <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {TIMELINE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => { setFormData({ ...formData, timeline: option }); setFormErrors({ ...formErrors, timeline: "" }); }}
                    className={`text-left px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      formData.timeline === option
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-gray-50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {formErrors.timeline && <p className="text-xs text-red-600 mt-1">{formErrors.timeline}</p>}
            </div>

            {/* Submit */}
            <Button onClick={handleSubmitRequest} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3">
              <Check className="w-4 h-4 mr-2" />
              Submit Request
            </Button>

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
