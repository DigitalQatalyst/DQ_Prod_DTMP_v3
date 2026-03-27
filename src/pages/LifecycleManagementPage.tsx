import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Eye, FileText, RefreshCw, SlidersHorizontal, TrendingUp, User, X } from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SeeInsightsDrawer } from "@/components/lifecycle/SeeInsightsDrawer";
import { RoleSelectorModal } from "@/components/lifecycle/RoleSelectorModal";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { toast } from "@/hooks/use-toast";

import {
  getInitiatives,
  getPortfolioSummary,
  type Division,
  type Initiative,
  type InitiativeStatus,
  type InitiativeType,
} from "@/data/shared/lifecyclePortfolioStore";
import {
  getDemoAccount,
  getLifecycleRole,
  type LifecycleInsightsRole,
  LIFECYCLE_ROLE_LABELS,
} from "@/data/shared/lifecycleRole";

import {
  initiativeFrameworks,
  type InitiativeFramework,
} from "@/data/lifecycle/frameworkCards";
import {
  INITIATIVE_LEVEL_SERVICES,
  LC_SERVICE_SLA,
  addApprovalRequest,
  addLCRequest,
  type LCServiceType,
} from "@/data/lifecycle/serviceRequestState";

type Stage1Tab = "initiatives" | "start-initiative";

const STATUS_BADGE_CLASSES: Record<InitiativeStatus, string> = {
  Active: "bg-teal-100 text-teal-700 border-teal-200",
  Scoping: "bg-blue-100 text-blue-700 border-blue-200",
  "At Risk": "bg-amber-100 text-amber-800 border-amber-200",
  "On Hold": "bg-slate-200 text-slate-600 border-slate-200",
  Completed: "bg-green-100 text-green-700 border-green-200",
};

const fmtBudget = (b: number | null | undefined) =>
  b == null ? "TBC" : `AED ${(b / 1_000_000).toFixed(0)}M`;

const ALL_STATUSES: InitiativeStatus[] = ["Active", "Scoping", "At Risk", "On Hold", "Completed"];

const ALL_TYPES: InitiativeType[] = [
  "Architecture Remediation", "Application Modernisation", "Technology Rationalisation",
  "AI Deployment", "EA Maturity Improvement", "DXP Programme", "DWS Modernisation",
  "IT/OT Convergence", "Net-Zero Technology", "Security Uplift", "Data Platform",
  "Platform Deployment", "Digital", "Operational", "Strategic", "Innovation",
];

const PRIORITY_OPTIONS = ["Critical", "High", "Medium", "Low"] as const;

const DIVISION_OPTIONS: Division[] = [
  "Generation",
  "Transmission",
  "Distribution",
  "Water",
  "Customer Services",
  "Corporate & Strategy",
  "Business Support & HR",
  "Innovation & AI",
  "DEWA Group Subsidiaries",
  "All Divisions",
];

const INITIATIVE_CARD_TYPE_COLORS = [
  "bg-blue-50 text-blue-700 border-blue-200",
  "bg-purple-50 text-purple-700 border-purple-200",
  "bg-teal-50 text-teal-700 border-teal-200",
  "bg-amber-50 text-amber-800 border-amber-200",
  "bg-rose-50 text-rose-700 border-rose-200",
] as const;

function pickTypeBadgeClasses(type: string): string {
  const idx = type.length % INITIATIVE_CARD_TYPE_COLORS.length;
  return INITIATIVE_CARD_TYPE_COLORS[idx] ?? INITIATIVE_CARD_TYPE_COLORS[0];
}

export default function LifecycleManagementPage() {
  const [activeTab, setActiveTab] = useState<Stage1Tab>("initiatives");

  const navigate = useNavigate();

  const [initiatives, setInitiatives] = useState<Initiative[]>(() => getInitiatives());
  const refreshInitiatives = () => setInitiatives(getInitiatives());

  const portfolioSummary = useMemo(() => getPortfolioSummary(), [initiatives.length]);

  // ── Sidebar filters ─────────────────────────────────────────────────────────
  const [filterStatuses, setFilterStatuses] = useState<Set<InitiativeStatus>>(new Set());
  const [filterDivision, setFilterDivision] = useState<Division | "all">("all");
  const [filterTypes, setFilterTypes] = useState<Set<InitiativeType>>(new Set());
  const [filterOwner, setFilterOwner] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const toggleStatus = (s: InitiativeStatus) =>
    setFilterStatuses((prev) => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; });

  const toggleType = (t: InitiativeType) =>
    setFilterTypes((prev) => { const n = new Set(prev); n.has(t) ? n.delete(t) : n.add(t); return n; });

  const clearFilters = () => {
    setFilterStatuses(new Set());
    setFilterDivision("all");
    setFilterTypes(new Set());
    setFilterOwner("");
  };

  const activeFilterCount =
    filterStatuses.size + filterTypes.size + (filterDivision !== "all" ? 1 : 0) + (filterOwner.trim() ? 1 : 0);

  const filteredInitiatives = useMemo(() => {
    const ownerQ = filterOwner.trim().toLowerCase();
    return initiatives.filter((ini) => {
      if (filterStatuses.size > 0 && !filterStatuses.has(ini.status)) return false;
      if (filterDivision !== "all" && ini.division !== filterDivision) return false;
      if (filterTypes.size > 0 && !filterTypes.has(ini.type as InitiativeType)) return false;
      if (ownerQ && !ini.owner?.toLowerCase().includes(ownerQ)) return false;
      return true;
    });
  }, [initiatives, filterStatuses, filterDivision, filterTypes, filterOwner]);

  // ── See Insights (role-gated) ───────────────────────────────────────────────
  const [drawerInitiative, setDrawerInitiative] = useState<Initiative | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerRole, setDrawerRole] = useState<LifecycleInsightsRole | null>(() => getLifecycleRole());
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const openSeeInsights = (initiative: Initiative) => {
    setDrawerInitiative(initiative);

    const currentRole = getLifecycleRole();
    if (currentRole) {
      setDrawerRole(currentRole);
      setDrawerOpen(true);
      setRoleModalOpen(false);
      return;
    }

    setDrawerRole(null);
    setRoleModalOpen(true);
  };

  // Allow Stage 2 "Open Cockpit" to deep-link into the Stage 1 drawer (demo/localStorage).
  useEffect(() => {
    const key = "dtmp.lifecycle.openInitiativeId";
    const openId = window.localStorage.getItem(key);
    if (!openId) return;

    const initiative = initiatives.find((i) => i.id === openId);
    window.localStorage.removeItem(key);

    if (initiative) openSeeInsights(initiative);
  }, [initiatives]);

  const closeSeeInsights = () => {
    setDrawerOpen(false);
    setDrawerInitiative(null);
    refreshInitiatives();
  };

  const handleChangeRole = () => {
    setDrawerOpen(false);
    setRoleModalOpen(true);
  };

  const handleRoleSelected = (role: LifecycleInsightsRole) => {
    setDrawerRole(role);
    setRoleModalOpen(false);
    // If we already chose an initiative, open the drawer now.
    if (drawerInitiative) setDrawerOpen(true);
  };

  // ── Start an Initiative (framework → request form) ─────────────────────────
  const [frameworkFilter, setFrameworkFilter] = useState<"all" | "internal" | "external">("all");
  const visibleFrameworks = useMemo(() => {
    return initiativeFrameworks.filter((f) => {
      if (frameworkFilter === "all") return true;
      const wantsExternal = frameworkFilter === "external";
      return wantsExternal ? f.category === "External" : f.category === "Internal";
    });
  }, [frameworkFilter]);

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<InitiativeFramework | null>(null);

  // ── Framework Detail (view details modal) ───────────────────────────────────
  const [detailFramework, setDetailFramework] = useState<InitiativeFramework | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [initiativeName, setInitiativeName] = useState("");
  const [initiativeDivision, setInitiativeDivision] = useState<Division>("Transmission");
  const [objective, setObjective] = useState("");
  const [scope, setScope] = useState("");
  const [keyStakeholders, setKeyStakeholders] = useState("");
  const [proposedOwner, setProposedOwner] = useState("");
  const [targetStartDate, setTargetStartDate] = useState(() => {
    const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 10);
  });
  const [estimatedBudget, setEstimatedBudget] = useState("");
  const [priority, setPriority] = useState<(typeof PRIORITY_OPTIONS)[number]>("Medium");
  const [additionalContext, setAdditionalContext] = useState("");

  const openInitiativeRequest = (framework: InitiativeFramework) => {
    setSelectedFramework(framework);
    setRequestModalOpen(true);

    // Reset form fields
    setInitiativeName("");
    setInitiativeDivision("Transmission");
    setObjective("");
    setScope("");
    setKeyStakeholders("");
    setProposedOwner("");
    setEstimatedBudget("");
    setPriority("Medium");
    setAdditionalContext("");
    const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    setTargetStartDate(d.toISOString().slice(0, 10));
  };

  const submitInitiativeRequest = () => {
    if (!selectedFramework) return;

    const trimmed = (s: string) => s.trim();
    if (!trimmed(initiativeName)) return toast({ title: "Missing fields", description: "Please enter an initiative name." });
    if (!trimmed(objective)) return toast({ title: "Missing fields", description: "Please provide an objective." });
    if (!trimmed(scope)) return toast({ title: "Missing fields", description: "Please provide a scope." });
    if (!trimmed(keyStakeholders)) return toast({ title: "Missing fields", description: "Please add key stakeholders." });
    if (!trimmed(proposedOwner)) return toast({ title: "Missing fields", description: "Please add a proposed initiative owner." });

    const role = drawerRole ?? "initiative-owner";
    const account = getDemoAccount(role);

    addApprovalRequest({
      frameworkType: selectedFramework.type,
      initiativeName: trimmed(initiativeName),
      division: initiativeDivision,
      isExternal: selectedFramework.category === "External",
      objective: trimmed(objective),
      scope: trimmed(scope),
      keyStakeholders: trimmed(keyStakeholders),
      proposedOwner: trimmed(proposedOwner),
      targetStartDate,
      estimatedBudget: trimmed(estimatedBudget) || undefined,
      priority,
      additionalContext: trimmed(additionalContext) || undefined,
      submittedBy: account.name,
    });

    setRequestModalOpen(false);
    setSelectedFramework(null);
    toast({
      title: "Submitted for TO approval",
      description: "Your initiative request was added to the approval queue.",
    });
    navigate("/stage2/lifecycle-management");
  };

  // ── Request Service (initiative-level) ──────────────────────────────────────
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [serviceInitiative, setServiceInitiative] = useState<Initiative | null>(null);

  const [serviceType, setServiceType] = useState<LCServiceType>(INITIATIVE_LEVEL_SERVICES[0]);
  const [servicePriority, setServicePriority] = useState<(typeof PRIORITY_OPTIONS)[number]>("Medium");
  const [serviceNotes, setServiceNotes] = useState("");

  const openRequestService = (initiative: Initiative) => {
    setServiceInitiative(initiative);
    setServiceType(INITIATIVE_LEVEL_SERVICES[0]);
    setServicePriority("Medium");
    setServiceNotes("");
    setServiceModalOpen(true);
  };

  const submitServiceRequest = () => {
    if (!serviceInitiative) return;

    const role = drawerRole ?? "initiative-owner";
    const account = getDemoAccount(role);

    addLCRequest({
      serviceType,
      initiativeId: serviceInitiative.id,
      initiativeName: serviceInitiative.name,
      submittedBy: account.name,
      submittedByRole: LIFECYCLE_ROLE_LABELS[role],
      status: "Submitted",
      priority: servicePriority,
      notes: serviceNotes.trim() || undefined,
      slaHours: LC_SERVICE_SLA[serviceType],
    });

    setServiceModalOpen(false);
    setServiceInitiative(null);
    navigate("/stage2/lifecycle-management");
    toast({
      title: "Service request submitted",
      description: "Saved locally for the Stage 2 tracker (demo).",
    });
  };

  const getInitiativeProjectCount = (i: Initiative) => i.projects.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-gradient-to-b from-orange-50 to-white py-8 lg:py-12">
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
            <span className="font-medium text-foreground">Lifecycle Management</span>
          </nav>

          <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold uppercase mb-4">
            Drive
          </span>

          <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-3">Lifecycle Management</h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-4xl mb-4">
            The operational execution layer for DEWA transformation initiatives — from conception through delivery and verified outcome.
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground" role="list" aria-label="Lifecycle summary stats">
            <span className="flex items-center gap-2" role="listitem">
              <RefreshCw className="w-4 h-4" />
              {portfolioSummary.activeInitiatives} Active Initiatives
            </span>
            <span className="flex items-center gap-2" role="listitem">
              <TrendingUp className="w-4 h-4" />
              {portfolioSummary.totalProjects} Projects in Delivery
            </span>
            <span className="flex items-center gap-2" role="listitem">
              <span className="inline-flex h-6 items-center px-2 rounded bg-orange-50 border border-orange-100 text-orange-700 text-xs font-semibold">
                EA Office Governed
              </span>
            </span>
          </div>
        </div>
      </section>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Stage1Tab)} className="w-full">
        <div className="bg-white border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <TabsList className="h-auto bg-transparent p-0 gap-2 overflow-x-auto flex justify-start">
              <TabsTrigger
                value="initiatives"
                className="flex items-center gap-2 px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy bg-transparent"
              >
                Initiatives
              </TabsTrigger>
              <TabsTrigger
                value="start-initiative"
                className="flex items-center gap-2 px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy bg-transparent"
              >
                Start an Initiative
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <TabsContent value="initiatives" className="mt-0">
            <div className="flex gap-6">
              {/* Sidebar filters */}
              <aside className={filtersOpen ? "w-60 flex-shrink-0" : "w-auto flex-shrink-0"}>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setFiltersOpen((p) => !p)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      {filtersOpen ? "Filters" : ""}
                      {activeFilterCount > 0 && (
                        <span className="ml-1 w-5 h-5 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
                          {activeFilterCount}
                        </span>
                      )}
                    </span>
                    {filtersOpen && activeFilterCount > 0 && (
                      <span
                        onClick={(e) => { e.stopPropagation(); clearFilters(); }}
                        className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" /> Clear
                      </span>
                    )}
                  </button>

                  {filtersOpen && (
                    <div className="px-4 pb-4 space-y-5 border-t border-gray-100">

                      {/* Status */}
                      <div className="pt-4 space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</p>
                        {ALL_STATUSES.map((s) => (
                          <label key={s} className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={filterStatuses.has(s)}
                              onChange={() => toggleStatus(s)}
                              className="rounded border-gray-300 text-orange-500"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">{s}</span>
                            <span className={`ml-auto inline-flex h-4 px-1.5 rounded text-xs font-medium items-center ${STATUS_BADGE_CLASSES[s]}`}>
                              {initiatives.filter((i) => i.status === s).length}
                            </span>
                          </label>
                        ))}
                      </div>

                      {/* Division */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Division</p>
                        <Select value={filterDivision} onValueChange={(v) => setFilterDivision(v as any)}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="All divisions" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All divisions</SelectItem>
                            {DIVISION_OPTIONS.map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Initiative Type */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Initiative Type</p>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {ALL_TYPES.map((t) => (
                            <label key={t} className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={filterTypes.has(t)}
                                onChange={() => toggleType(t)}
                                className="rounded border-gray-300 text-orange-500"
                              />
                              <span className="text-xs text-gray-700 group-hover:text-gray-900 leading-tight">{t}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Owner search */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Owner</p>
                        <Input
                          value={filterOwner}
                          onChange={(e) => setFilterOwner(e.target.value)}
                          placeholder="Search by owner name"
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </aside>

              {/* Main grid */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-500">
                    {filteredInitiatives.length} of {initiatives.length} initiatives
                    {activeFilterCount > 0 && <span className="ml-1 text-orange-600 font-medium">(filtered)</span>}
                  </p>
                </div>

                {filteredInitiatives.length === 0 ? (
                  <div className="text-center py-12">
                    {initiatives.length === 0 ? (
                      <>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No initiatives found</h3>
                        <p className="text-gray-600">Create an initiative from the "Start an Initiative" tab.</p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No results</h3>
                        <p className="text-gray-600 mb-4">No initiatives match your current filters.</p>
                        <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredInitiatives.map((initiative) => (
                      <Card
                        key={initiative.id}
                        className="bg-white border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                      >
                        <CardContent className="p-5 space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500 mb-2 truncate">{initiative.division}</p>
                              <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{initiative.name}</h3>
                            </div>
                            <Badge className={`${STATUS_BADGE_CLASSES[initiative.status]} border flex-shrink-0`}>
                              {initiative.status}
                            </Badge>
                          </div>

                          {/* Owner + budget row */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1 truncate">
                              <User className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{initiative.owner ?? "Unassigned"}</span>
                            </span>
                            <span className="font-medium text-gray-700 flex-shrink-0 ml-2">
                              {fmtBudget(initiative.budget)}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className={`text-xs ${pickTypeBadgeClasses(initiative.type)} border`}>
                              {initiative.type}
                            </Badge>
                            <Badge className={`text-xs ${initiative.eaAlignmentScore === null ? "bg-slate-100 text-slate-700 border-slate-200" : "bg-slate-50 text-slate-800 border-slate-200"} border`}>
                              EA: {initiative.eaAlignmentScore === null ? "TBD" : `${initiative.eaAlignmentScore}%`}
                            </Badge>
                            {initiative.fromPortfolio && (
                              <Badge variant="outline" className="text-xs border-blue-200 bg-blue-50 text-blue-700">
                                Portfolio
                              </Badge>
                            )}
                          </div>

                          {(initiative.status === "Active" || initiative.status === "At Risk") && (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Progress</span>
                                <span className="font-medium text-foreground">{initiative.progress}%</span>
                              </div>
                              <Progress value={initiative.progress} className="h-1.5" />
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{getInitiativeProjectCount(initiative)} projects</span>
                            <span>Target: {initiative.targetDate}</span>
                          </div>

                          <Separator />

                          <div className="flex gap-2">
                            <Button
                              className="flex-1 bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 text-xs"
                              onClick={() => openSeeInsights(initiative)}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Insights
                            </Button>
                            <Button
                              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs"
                              onClick={() => openRequestService(initiative)}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              Request
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="start-initiative" className="mt-0">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Initiative Type Frameworks</h2>
                <p className="text-sm text-muted-foreground">Browse what DEWA needs next and submit a request to start.</p>
              </div>

              <div className="min-w-[220px]">
                <Select value={frameworkFilter} onValueChange={(v) => setFrameworkFilter(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="internal">Internal only</SelectItem>
                    <SelectItem value="external">External only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleFrameworks.map((framework) => (
                <Card
                  key={framework.id}
                  className="bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 mb-2">Type</p>
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{framework.type}</h3>
                      </div>
                      <Badge
                        className={`text-xs border ${framework.category === "Internal" ? "bg-teal-50 text-teal-800 border-teal-200" : "bg-blue-50 text-blue-800 border-blue-200"}`}
                      >
                        {framework.category}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-3">{framework.description}</p>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="border-slate-200 text-slate-700">
                        Duration: {framework.typicalDuration}
                      </Badge>
                      <Badge variant="outline" className="border-slate-200 text-slate-700">
                        Scope: {framework.typicalScope}
                      </Badge>
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                        onClick={() => { setDetailFramework(framework); setDetailModalOpen(true); }}
                      >
                        View Details
                      </Button>
                      <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white" onClick={() => openInitiativeRequest(framework)}>
                        Start Initiative
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* See Insights role selector — rendered outside any Dialog to avoid CSS transform containment */}
      {roleModalOpen && (
        <RoleSelectorModal
          onClose={() => setRoleModalOpen(false)}
          onRoleSelected={handleRoleSelected}
        />
      )}

      {/* Initiative request form */}
      <Dialog open={requestModalOpen} onOpenChange={setRequestModalOpen}>
        <DialogContent className="flex flex-col sm:max-w-2xl max-h-[90vh] p-0 gap-0">
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
            <DialogHeader>
              <DialogTitle>Start an Initiative</DialogTitle>
              <DialogDescription>Complete the form below and submit for TO approval.</DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
          {selectedFramework && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <Badge className={`text-xs border ${selectedFramework.category === "Internal" ? "bg-teal-50 text-teal-800 border-teal-200" : "bg-blue-50 text-blue-800 border-blue-200"}`} >
                    {selectedFramework.category}
                  </Badge>
                  <Badge variant="outline" className="border-slate-200 text-slate-700">
                    Typical: {selectedFramework.typicalDuration} • {selectedFramework.typicalScope}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{selectedFramework.description}</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-600">Key phases</p>
                <div className="flex flex-wrap gap-2">
                  {selectedFramework.keyPhases.map((p) => (
                    <Badge key={p} variant="outline" className="border-slate-200 text-slate-700 bg-white">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">Initiative Name</label>
                  <Input value={initiativeName} onChange={(e) => setInitiativeName(e.target.value)} placeholder="e.g. Transmission Architecture Remediation Q2 2026" />
                </div>

                <div className="sm:col-span-1">
                  <label className="text-sm font-medium text-foreground">Division</label>
                  <Select value={initiativeDivision} onValueChange={(v) => setInitiativeDivision(v as Division)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select division" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIVISION_OPTIONS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-1">
                  <label className="text-sm font-medium text-foreground">Target Start Date</label>
                  <Input type="date" value={targetStartDate} onChange={(e) => setTargetStartDate(e.target.value)} />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">Objective</label>
                  <Textarea value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="What problem/opportunity will this initiative address?" />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">Scope</label>
                  <Textarea value={scope} onChange={(e) => setScope(e.target.value)} placeholder="Systems/applications/asset classes/domains in scope." />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Key Stakeholders</label>
                  <Input value={keyStakeholders} onChange={(e) => setKeyStakeholders(e.target.value)} placeholder="Names/roles, comma-separated" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Proposed Initiative Owner</label>
                  <Input value={proposedOwner} onChange={(e) => setProposedOwner(e.target.value)} placeholder="Name" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Estimated Budget (optional)</label>
                  <Input value={estimatedBudget} onChange={(e) => setEstimatedBudget(e.target.value)} placeholder="e.g. AED 10M" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Priority</label>
                  <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">Additional Context (optional)</label>
                  <Textarea value={additionalContext} onChange={(e) => setAdditionalContext(e.target.value)} placeholder="Any extra information for the TO team." />
                </div>
              </div>
            </div>
          )}
          </div>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
            <DialogFooter>
              <Button variant="outline" onClick={() => setRequestModalOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={submitInitiativeRequest}>
                Submit for Approval
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Initiative-level service request (demo) */}
      <Dialog open={serviceModalOpen} onOpenChange={setServiceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Service</DialogTitle>
            <DialogDescription>Submit an initiative-level request (demo/localStorage).</DialogDescription>
          </DialogHeader>

          {serviceInitiative && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-slate-600">Initiative</p>
                <p className="text-sm font-medium text-slate-900">{serviceInitiative.name}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">Service Type</label>
                  <Select value={serviceType} onValueChange={(v) => setServiceType(v as LCServiceType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {INITIATIVE_LEVEL_SERVICES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Priority</label>
                  <Select value={servicePriority} onValueChange={(v) => setServicePriority(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">SLA (hours)</label>
                  <Input value={String(LC_SERVICE_SLA[serviceType])} readOnly />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">Notes (optional)</label>
                  <Textarea value={serviceNotes} onChange={(e) => setServiceNotes(e.target.value)} placeholder="What do you need from TO?" />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setServiceModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={submitServiceRequest}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Framework detail modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="flex flex-col sm:max-w-2xl max-h-[90vh] p-0 gap-0">
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <DialogTitle className="text-xl">{detailFramework?.type}</DialogTitle>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {detailFramework && (
                    <Badge className={`text-xs border ${detailFramework.category === "Internal" ? "bg-teal-50 text-teal-800 border-teal-200" : "bg-blue-50 text-blue-800 border-blue-200"}`}>
                      {detailFramework.category}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs border-slate-200 text-slate-700">
                    {detailFramework?.typicalDuration}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-slate-200 text-slate-700">
                    {detailFramework?.typicalScope}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
            {detailFramework && (
              <>
                <p className="text-sm text-gray-600 leading-relaxed">{detailFramework.description}</p>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Key Phases</p>
                  <div className="flex flex-wrap gap-2">
                    {detailFramework.keyPhases.map((p) => (
                      <Badge key={p} variant="outline" className="border-slate-200 text-slate-700 bg-slate-50">{p}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide">What TO Provides</p>
                    <ul className="space-y-1.5">
                      {detailFramework.whatTOProvides.map((item) => (
                        <li key={item} className="text-sm text-teal-900 flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">What Division Provides</p>
                    <ul className="space-y-1.5">
                      {detailFramework.whatDivisionProvides.map((item) => (
                        <li key={item} className="text-sm text-orange-900 flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Expected Outcomes</p>
                  <ul className="space-y-1.5">
                    {detailFramework.expectedOutcomes.map((item) => (
                      <li key={item} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailModalOpen(false)}>
                Close
              </Button>
              <Button
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => {
                  setDetailModalOpen(false);
                  if (detailFramework) openInitiativeRequest(detailFramework);
                }}
              >
                Start Initiative
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* See Insights drawer */}
      {drawerOpen && drawerInitiative && drawerRole && (
        <SeeInsightsDrawer
          initiative={drawerInitiative}
          role={drawerRole}
          onClose={closeSeeInsights}
          onChangeRole={handleChangeRole}
        />
      )}

      <Footer />
    </div>
  );
}
