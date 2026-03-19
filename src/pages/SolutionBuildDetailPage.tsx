import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  Clock,
  BarChart3,
  Rocket,
  Link2,
  CheckCircle2,
  FileX,
  AlertCircle,
  Users,
  Calendar,
} from "lucide-react";
import { solutionBuilds, STREAM_COLORS, DEWA_DIVISIONS } from "@/data/blueprints/solutionBuilds";
import type { DewaDivision } from "@/data/blueprints/solutionBuilds";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createBuildRequest } from "@/data/solutionBuildWorkspace";
import type { BuildRequestDraft, BuildRequestPriority, BuildTimeline } from "@/data/solutionBuildWorkspace";
import { isUserAuthenticated } from "@/data/sessionAuth";
import { LoginModal } from "@/components/learningCenter/LoginModal";

const COMPLEXITY_COLORS = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-red-100 text-red-700",
};

export function SolutionBuildDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const build = solutionBuilds.find(b => b.id === id);

  // Request form state
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [form, setForm] = useState<{
    dewaDivision: DewaDivision;
    programme: string;
    customisationSelections: string[];
    businessNeed: string;
    currentState: string;
    keyRequirements: string;
    timelinePreference: BuildTimeline;
    plannedStartDate: string;
    priority: BuildRequestPriority;
    additionalRequirements: string;
  }>({
    dewaDivision: DEWA_DIVISIONS[0],
    programme: build?.programme ?? "",
    customisationSelections: [],
    businessNeed: "",
    currentState: "",
    keyRequirements: "",
    timelinePreference: "Standard",
    plannedStartDate: "",
    priority: "High",
    additionalRequirements: "",
  });

  // 404 state
  if (!build) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileX className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Solution Build Not Found</h1>
            <p className="text-gray-600 mb-8">
              The solution build you are looking for does not exist or may have been moved.
            </p>
            <Button onClick={() => navigate("/marketplaces/solution-build")}>
              <ArrowLeft size={18} className="mr-2" />
              Back to Solution Build
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const colors = STREAM_COLORS[build.solutionType] ?? STREAM_COLORS["DBP"];
  const relatedBuilds = solutionBuilds
    .filter(b => b.solutionType === build.solutionType && b.id !== build.id)
    .slice(0, 3);

  const toggleCustomisation = (optionId: string) => {
    setForm(f => ({
      ...f,
      customisationSelections: f.customisationSelections.includes(optionId)
        ? f.customisationSelections.filter(id => id !== optionId)
        : [...f.customisationSelections, optionId],
    }));
  };

  const handleSubmit = () => {
    if (!form.businessNeed.trim()) return;
    setSubmitting(true);
    try {
      const draft: BuildRequestDraft = {
        dewaDivision: form.dewaDivision,
        programme: form.programme,
        customisationSelections: form.customisationSelections,
        businessNeed: form.businessNeed,
        currentState: form.currentState,
        keyRequirements: form.keyRequirements,
        timelinePreference: form.timelinePreference,
        plannedStartDate: form.plannedStartDate || undefined,
        priority: form.priority,
        additionalRequirements: form.additionalRequirements,
        fromSpecId: build.fromSpecId,
        fromSpecTitle: build.fromSpecTitle,
      };
      // Always save the request first (localStorage persists regardless of auth state)
      createBuildRequest(build.id, draft);
      setShowRequestDialog(false);
      if (isUserAuthenticated()) {
        // Already logged in — go straight to My Requests
        navigate("/stage2/solution-build/my-requests");
      } else {
        // Not logged in — pop the login modal; on success navigate to My Requests
        setShowLoginModal(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6 flex-wrap" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[hsl(var(--orange))] transition-colors">Home</Link>
          <ChevronRight size={16} aria-hidden="true" />
          <Link to="/marketplaces/solution-build" className="hover:text-[hsl(var(--orange))] transition-colors">
            Solution Build
          </Link>
          <ChevronRight size={16} aria-hidden="true" />
          <span className="text-gray-900 font-medium truncate max-w-[300px]" aria-current="page">{build.title}</span>
        </nav>


        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

          {/* Left — main content */}
          <div className="space-y-6">

            {/* Hero card */}
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              {/* Thin stream accent line */}
              <div className={`w-12 h-1 rounded-full ${colors.headerBg} mb-5`} />

              {/* Badge row */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`} variant="outline">
                  {build.solutionType}
                </Badge>
                <Badge variant="outline" className="text-gray-600">DEPLOY</Badge>
                <Badge className={`${COMPLEXITY_COLORS[build.complexity]} text-xs font-semibold`} variant="outline">
                  {build.complexity} Complexity
                </Badge>
              </div>

              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  {build.title}
                </h1>
                <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-6">
                  {build.fullDescription}
                </p>

                {/* 5-column metadata strip */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pb-6 border-b border-gray-100">
                  <div>
                    <dt className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase mb-1">
                      <Clock className="w-3 h-3" />Timeline
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">{build.timeline}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase mb-1">
                      <BarChart3 className="w-3 h-3" />Complexity
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">{build.complexity}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase mb-1">
                      <Rocket className="w-3 h-3" />Deployments
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">{build.deploymentCount}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase mb-1">
                      <Users className="w-3 h-3" />Programme
                    </dt>
                    <dd className="text-sm font-medium text-gray-900 line-clamp-2">{build.programme}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase mb-1">
                      <Calendar className="w-3 h-3" />Updated
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {new Date(build.lastUpdated).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })}
                    </dd>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {build.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>


            {/* Tabs */}
            <Tabs defaultValue="overview" className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="border-b border-gray-200 px-6 pt-4">
                <TabsList className="bg-transparent h-auto p-0 gap-0">
                  {[
                    { value: "overview", label: "Overview" },
                    { value: "deliverables", label: "Deliverables" },
                    { value: "requirements", label: "Requirements" },
                    { value: "customisation", label: "Customisation" },
                    { value: "context", label: "DEWA Context" },
                  ].map(tab => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:bg-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Overview */}
              <TabsContent value="overview" className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">What's Included</h3>
                  <ul className="space-y-2">
                    {build.whatIncluded.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Key Deliverables</h3>
                  <ul className="space-y-2">
                    {build.keyDeliverables.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                        <Rocket className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Division Relevance</h3>
                  <div className="flex flex-wrap gap-2">
                    {build.divisionRelevance.map(div => (
                      <span key={div} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                        {div}
                      </span>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Deliverables */}
              <TabsContent value="deliverables" className="p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Key Deliverables</h3>
                <div className="space-y-3">
                  {build.keyDeliverables.map((item, i) => (
                    <div key={item} className="flex items-start gap-3 p-4 rounded-lg border border-gray-100 bg-gray-50">
                      <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {build.techSpecs && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Tech Specifications</h3>
                    <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
                      <p className="text-sm text-gray-700">{build.techSpecs}</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Requirements */}
              <TabsContent value="requirements" className="p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Dependencies & Prerequisites</h3>
                <div className="space-y-2">
                  {build.dependencies.map(dep => (
                    <div key={dep} className="flex items-start gap-2 p-3 rounded-lg border border-gray-100">
                      <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{dep}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Customisation */}
              <TabsContent value="customisation" className="p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Customisation Options</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {build.customisationOptions.map(opt => (
                    <div key={opt.id} className="p-4 rounded-lg border border-gray-200 bg-white hover:border-orange-200 transition-colors">
                      <p className="text-sm font-semibold text-gray-900 mb-1">{opt.label}</p>
                      <p className="text-xs text-gray-500">{opt.description}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* DEWA Context */}
              <TabsContent value="context" className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Division Relevance</h3>
                  <div className="flex flex-wrap gap-2">
                    {build.divisionRelevance.map(div => (
                      <span key={div} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                        {div}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Programme</h3>
                  <p className="text-sm text-gray-700">{build.programme}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Delivery Team</h3>
                  <p className="text-sm text-gray-700">{build.deliveryTeam}</p>
                </div>
                {build.fromSpecId && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">From Solution Spec</h3>
                    <button
                      onClick={() => navigate(`/marketplaces/solution-specs/${build.fromSpecId}`)}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Link2 className="w-4 h-4" />
                      {build.fromSpecTitle}
                    </button>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Related Builds */}
            {relatedBuilds.length > 0 && (
              <section className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Related Builds — {build.solutionType} Stream</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedBuilds.map(rel => {
                    const relColors = STREAM_COLORS[rel.solutionType] ?? STREAM_COLORS["DBP"];
                    return (
                      <button
                        key={rel.id}
                        onClick={() => navigate(`/marketplaces/solution-build/${rel.id}`)}
                        className="bg-white border border-gray-200 rounded-xl p-5 text-left transition-all hover:border-orange-300 hover:shadow-lg hover:-translate-y-0.5 duration-200 w-full"
                        aria-label={`View ${rel.title}`}
                      >
                        <div className={`mb-3 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${relColors.bg} ${relColors.text} ${relColors.border}`}>
                          {rel.solutionType}
                        </div>
                        <div className="text-base font-bold text-gray-900 mb-2 group-hover:text-[hsl(var(--orange))] transition-colors line-clamp-2">{rel.title}</div>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{rel.shortDescription}</p>
                        <div className="flex gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{rel.timeline}</span>
                          <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" />{rel.complexity}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Right — sticky sidebar */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Build Details</h3>
              <dl className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Timeline</dt>
                  <dd className="font-medium text-gray-900">{build.timeline}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Complexity</dt>
                  <dd>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${COMPLEXITY_COLORS[build.complexity]}`}>
                      {build.complexity}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Deployments</dt>
                  <dd className="font-medium text-gray-900">{build.deploymentCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Delivery Team</dt>
                  <dd className="font-medium text-gray-900">{build.deliveryTeam}</dd>
                </div>
              </dl>

              {build.fromSpecId && (
                <div className="mb-5 pb-5 border-b border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">From Solution Spec</p>
                  <button
                    onClick={() => navigate(`/marketplaces/solution-specs/${build.fromSpecId}`)}
                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    {build.fromSpecTitle}
                  </button>
                </div>
              )}

              <Button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                onClick={() => setShowRequestDialog(true)}
              >
                <Rocket className="w-4 h-4 mr-2" />
                Request Build
              </Button>

            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Request Build Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white pb-3 border-b mb-4">
            <DialogTitle>Request Build</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">{build.title}</p>
          </DialogHeader>

          <div className="space-y-4">
              {/* Pre-filled read-only fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Solution</label>
                  <div className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 truncate">
                    {build.title}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Stream</label>
                  <div className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                    {build.solutionType}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">DEWA Division *</label>
                  <select
                    value={form.dewaDivision}
                    onChange={e => setForm(f => ({ ...f, dewaDivision: e.target.value as DewaDivision }))}
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
                    value={form.programme}
                    onChange={e => setForm(f => ({ ...f, programme: e.target.value }))}
                  />
                </div>
              </div>

              {/* Customisation Options */}
              {build.customisationOptions.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Customisation Options (select all that apply)
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {build.customisationOptions.map(opt => (
                      <label
                        key={opt.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          form.customisationSelections.includes(opt.id)
                            ? "border-orange-300 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.customisationSelections.includes(opt.id)}
                          onChange={() => toggleCustomisation(opt.id)}
                          className="mt-0.5 accent-orange-600"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                          <p className="text-xs text-gray-500">{opt.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Business Need *</label>
                <Textarea
                  placeholder="Describe the business problem or opportunity this build will address..."
                  value={form.businessNeed}
                  onChange={e => setForm(f => ({ ...f, businessNeed: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Current State</label>
                <Textarea
                  placeholder="Describe the current situation, pain points, or gap..."
                  value={form.currentState}
                  onChange={e => setForm(f => ({ ...f, currentState: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Key Requirements</label>
                <Textarea
                  placeholder="List any specific technical or business requirements..."
                  value={form.keyRequirements}
                  onChange={e => setForm(f => ({ ...f, keyRequirements: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Timeline Preference</label>
                  <select
                    value={form.timelinePreference}
                    onChange={e => setForm(f => ({ ...f, timelinePreference: e.target.value as BuildTimeline }))}
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
                    value={form.priority}
                    onChange={e => setForm(f => ({ ...f, priority: e.target.value as BuildRequestPriority }))}
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
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Planned Start Date (optional)</label>
                <Input
                  type="date"
                  value={form.plannedStartDate}
                  onChange={e => setForm(f => ({ ...f, plannedStartDate: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Additional Requirements (optional)</label>
                <Textarea
                  placeholder="Any additional context, constraints, or requirements..."
                  value={form.additionalRequirements}
                  onChange={e => setForm(f => ({ ...f, additionalRequirements: e.target.value }))}
                  rows={2}
                />
              </div>

              {build.fromSpecId && (
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                  <p className="text-xs text-blue-700">
                    <span className="font-semibold">Based on Spec: </span>
                    {build.fromSpecTitle}
                  </p>
                </div>
              )}

              <div className="sticky bottom-0 bg-white pt-3 pb-1 border-t flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowRequestDialog(false)}>Cancel</Button>
                <Button
                  className="bg-orange-600 hover:bg-orange-700"
                  disabled={!form.businessNeed.trim() || submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? "Submitting..." : "Submit Build Request"}
                </Button>
              </div>
            </div>
        </DialogContent>
      </Dialog>

      {/* Login modal — shown after request is saved, when user isn't authenticated */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        context={{
          marketplace: "solution-build",
          tab: "my-requests",
          cardId: build?.id ?? "",
          serviceName: build?.title ?? "Solution Build",
          action: "request-build",
        }}
        onLoginSuccess={() => {
          setShowLoginModal(false);
          navigate("/stage2/solution-build/my-requests");
        }}
      />
    </div>
  );
}
