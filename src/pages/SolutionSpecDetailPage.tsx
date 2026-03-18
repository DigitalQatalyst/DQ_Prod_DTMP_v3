import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Building2,
  Calendar,
  CheckCircle,
  ChevronRight,
  FileText,
  GitBranch,
  Layers,
  Link2,
  User,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginModal } from "@/components/learningCenter/LoginModal";
import { isUserAuthenticated } from "@/data/sessionAuth";
import { solutionSpecs, type SolutionSpec, type SolutionType } from "@/data/blueprints/solutionSpecs";
import {
  createSolutionSpecRequest,
  defaultSolutionSpecRequestDraft,
  type SolutionSpecRequestDraft,
  type SolutionSpecOutput,
} from "@/data/solutionSpecsWorkspace";

const SOLUTION_TYPE_COLORS: Record<SolutionType, { bg: string; text: string; border: string; header: string }> = {
  DBP: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", header: "from-blue-600 to-blue-800" },
  DXP: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", header: "from-purple-600 to-purple-800" },
  DWS: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", header: "from-teal-600 to-teal-800" },
  DIA: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", header: "from-orange-500 to-orange-700" },
  SDO: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", header: "from-red-600 to-red-800" },
};

const SCOPE_LABELS: Record<string, string> = {
  enterprise: "Enterprise",
  departmental: "Departmental",
  project: "Project",
};

const MATURITY_LABELS: Record<string, string> = {
  conceptual: "Conceptual",
  proven: "Proven",
  reference: "Reference",
};

const OUTPUT_OPTIONS: SolutionSpecOutput[] = [
  "Full Spec Document (PDF)",
  "Architecture Diagrams",
  "Component Definitions",
  "Implementation Roadmap",
];

export function SolutionSpecDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const spec = solutionSpecs.find((item) => item.id === id);
  const relatedSpecs = useMemo(
    () => solutionSpecs.filter((item) => spec?.connectedSpecIds.includes(item.id)).slice(0, 3),
    [spec]
  );

  const [draft, setDraft] = useState<SolutionSpecRequestDraft | null>(
    spec ? defaultSolutionSpecRequestDraft(spec) : null
  );

  if (!spec || !draft) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
          <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h1 className="mb-3 text-2xl font-bold text-gray-900">Solution Spec Not Found</h1>
            <p className="mb-6 text-gray-600">
              The specification you are looking for does not exist or may have been moved.
            </p>
            <Button onClick={() => navigate("/marketplaces/solution-specs")}>Back to Solution Specs</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const colors = SOLUTION_TYPE_COLORS[spec.solutionType];

  const updateDraft = <K extends keyof SolutionSpecRequestDraft>(
    key: K,
    value: SolutionSpecRequestDraft[K]
  ) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  };

  const handleOpenRequest = () => {
    if (!isUserAuthenticated()) {
      setShowLoginModal(true);
      return;
    }
    setShowRequestDialog(true);
  };

  const toggleOutput = (value: SolutionSpecOutput) => {
    const set = new Set(draft.preferredOutputs);
    if (set.has(value)) {
      set.delete(value);
    } else {
      set.add(value);
    }
    updateDraft("preferredOutputs", Array.from(set));
  };

  const handleSubmit = () => {
    const request = createSolutionSpecRequest(spec, draft);
    setShowRequestDialog(false);
    navigate("/stage2/specs/my-requests", {
      state: {
        marketplace: "solution-specs",
        specId: spec.id,
        requestId: request.id,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-muted-foreground flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces" className="hover:text-foreground transition-colors">Marketplaces</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces/solution-specs" className="hover:text-foreground transition-colors">Solution Specs</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground line-clamp-1">{spec.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-white border-b border-gray-200 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Stream accent line */}
          <div className={`w-12 h-1 rounded-full bg-gradient-to-r ${colors.header} mb-5`} />

          {/* Badge row */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`} variant="outline">
              {spec.solutionType}
            </Badge>
            <Badge variant="outline">{SCOPE_LABELS[spec.scope]}</Badge>
            <Badge variant="outline">{MATURITY_LABELS[spec.maturityLevel]}</Badge>
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-3">{spec.title}</h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-3xl mb-5">{spec.description}</p>

          {/* Division + Alignment badges */}
          <div className="space-y-2 mb-6">
            <div className="flex flex-wrap gap-2">
              {spec.divisionRelevance.map((division) => (
                <Badge key={division} className="border border-orange-300 bg-white text-orange-700">
                  {division}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {spec.dewaAlignment.map((alignment) => (
                <Badge key={alignment} className="bg-blue-50 text-blue-700 border-0">
                  {alignment}
                </Badge>
              ))}
            </div>
          </div>

          {/* Metadata strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 border-t border-gray-200 pt-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-500 mb-1"><Building2 className="h-3.5 w-3.5" />Scope</div>
              <div className="text-sm font-medium text-gray-900">{SCOPE_LABELS[spec.scope]}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-500 mb-1"><Award className="h-3.5 w-3.5" />Maturity</div>
              <div className="text-sm font-medium text-gray-900">{MATURITY_LABELS[spec.maturityLevel]}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-500 mb-1"><Layers className="h-3.5 w-3.5" />Diagrams</div>
              <div className="text-sm font-medium text-gray-900">{spec.diagramCount}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-500 mb-1"><GitBranch className="h-3.5 w-3.5" />Components</div>
              <div className="text-sm font-medium text-gray-900">{spec.componentCount}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-500 mb-1"><Calendar className="h-3.5 w-3.5" />Updated</div>
              <div className="text-sm font-medium text-gray-900">{new Date(spec.lastUpdated).toLocaleDateString("en-US")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs + Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab bar */}
        <div className="bg-white border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto">
            <TabsList className="h-auto bg-transparent p-0 gap-1 overflow-x-auto flex justify-start px-4 lg:px-8">
              {[
                { value: "overview", label: "Overview" },
                { value: "architecture", label: "Architecture" },
                { value: "implementation", label: "Implementation" },
                { value: "documents", label: "Documents" },
                { value: "ea-office", label: "EA Office Info" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy data-[state=active]:shadow-none bg-transparent"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left — tab content */}
            <div className="flex-1 min-w-0">
              <TabsContent value="overview" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">DEWA Context</h2>
                    <p className="text-base text-muted-foreground leading-relaxed">{spec.overview}</p>
                  </div>

                  {spec.keyHighlights.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">Key Highlights</h3>
                      <ul className="space-y-3">
                        {spec.keyHighlights.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {spec.useCases.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">Use Cases</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        {spec.useCases.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="text-orange-500 font-bold mt-0.5">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t border-gray-200">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{spec.author}</span>
                    <span className="text-gray-400">·</span>
                    <span>EA Office Owner</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="architecture" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Architecture Summary</h2>
                    <p className="text-base text-muted-foreground leading-relaxed">{spec.architectureSummary}</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Layers className="h-5 w-5 text-orange-500" />
                        <div className="text-sm font-semibold text-gray-900">Architecture Diagrams</div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{spec.diagramCount}</div>
                      <div className="text-sm text-gray-500">Views included in the spec package</div>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <GitBranch className="h-5 w-5 text-orange-500" />
                        <div className="text-sm font-semibold text-gray-900">Component Definitions</div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{spec.componentCount}</div>
                      <div className="text-sm text-gray-500">Component specifications detailed</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="implementation" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Implementation Guidance</h2>
                    <p className="text-base text-muted-foreground leading-relaxed">{spec.implementationGuidance}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Included Artifacts</h3>
                    <ul className="space-y-3">
                      {spec.includedArtifacts.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">Spec Documents</h2>
                  <div className="grid gap-4">
                    {spec.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
                      >
                        <FileText className="w-8 h-8 text-orange-500 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">{doc.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{doc.summary}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ea-office" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">EA Office Information</h2>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Specifications in the Solution Specs marketplace are Corporate EA Office-owned reference assets for DEWA. They represent the authoritative architectural direction across all DBP streams and divisions.
                    </p>
                  </div>
                  <div className="grid gap-4 border border-gray-200 rounded-xl p-5 bg-gray-50">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Owner:</span>
                      <span className="font-medium text-gray-900">{spec.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Last updated:</span>
                      <span className="font-medium text-gray-900">{new Date(spec.lastUpdated).toLocaleDateString("en-US")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Maturity:</span>
                      <span className="font-medium text-gray-900">{MATURITY_LABELS[spec.maturityLevel]}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>

            {/* Right Sidebar */}
            <aside className="lg:w-96 flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-5">
                {/* Single unified card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                  <h3 className="text-base font-semibold text-foreground mb-4">Spec Details</h3>

                  <table className="w-full mb-6">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="text-sm text-muted-foreground py-3 pr-4 flex items-center gap-2"><Building2 className="h-3.5 w-3.5" />Scope</td>
                        <td className="text-sm font-medium text-foreground py-3">{SCOPE_LABELS[spec.scope]}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="text-sm text-muted-foreground py-3 pr-4"><span className="flex items-center gap-2"><Award className="h-3.5 w-3.5" />Maturity</span></td>
                        <td className="text-sm font-medium text-foreground py-3">{MATURITY_LABELS[spec.maturityLevel]}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="text-sm text-muted-foreground py-3 pr-4"><span className="flex items-center gap-2"><Layers className="h-3.5 w-3.5" />Diagrams</span></td>
                        <td className="text-sm font-medium text-foreground py-3">{spec.diagramCount}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="text-sm text-muted-foreground py-3 pr-4"><span className="flex items-center gap-2"><GitBranch className="h-3.5 w-3.5" />Components</span></td>
                        <td className="text-sm font-medium text-foreground py-3">{spec.componentCount}</td>
                      </tr>
                      <tr>
                        <td className="text-sm text-muted-foreground py-3 pr-4"><span className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />Updated</span></td>
                        <td className="text-sm font-medium text-foreground py-3">{new Date(spec.lastUpdated).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="border-t border-gray-200 pt-5 mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {spec.includedArtifacts.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={handleOpenRequest}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-base font-semibold transition-all hover:shadow-xl"
                  >
                    Make Request
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

              </div>
            </aside>
          </div>
        </div>
      </Tabs>

      {/* Related Specifications — full-width bottom section */}
      {relatedSpecs.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedSpecs.map((related) => {
                const rc = SOLUTION_TYPE_COLORS[related.solutionType];
                return (
                  <button
                    key={related.id}
                    onClick={() => navigate(`/marketplaces/solution-specs/${related.id}`)}
                    className="bg-white border border-gray-200 rounded-xl p-5 text-left transition-all hover:border-orange-300 hover:shadow-lg hover:-translate-y-0.5 duration-200"
                  >
                    <div className={`mb-3 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${rc.bg} ${rc.text} ${rc.border}`}>
                      <Link2 className="h-3 w-3" />
                      {related.solutionType}
                    </div>
                    <div className="text-base font-bold text-gray-900 mb-2">{related.title}</div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{related.description}</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" />{related.diagramCount} diagrams</span>
                      <span className="flex items-center gap-1"><GitBranch className="h-3.5 w-3.5" />{related.componentCount} components</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-3xl flex flex-col max-h-[90vh]">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Request This Spec</DialogTitle>
            <DialogDescription>
              Submit DEWA context so the Transformation Office can produce a tailored solution specification.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 pr-1">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Request Type</label>
              <select
                value={draft.requestType}
                onChange={(e) => updateDraft("requestType", e.target.value as SolutionSpecRequestDraft["requestType"])}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option>Current Build</option>
                <option>Enhancement</option>
                <option>Integration</option>
                <option>New Initiative</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">DEWA Division</label>
              <select
                value={draft.dewaDivision}
                onChange={(e) => updateDraft("dewaDivision", e.target.value as SolutionSpecRequestDraft["dewaDivision"])}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option>Generation</option>
                <option>Transmission</option>
                <option>Distribution</option>
                <option>Water Services</option>
                <option>Customer Services</option>
                <option>Digital DEWA & Moro Hub</option>
                <option>Enterprise-wide</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Solution Name</label>
              <Input value={spec.title} readOnly />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">DBP Stream</label>
              <Input value={spec.solutionType} readOnly />
            </div>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Programme / Initiative</label>
              <Input value={draft.programme} onChange={(e) => updateDraft("programme", e.target.value)} placeholder="Smart Grid Modernisation" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Business Need</label>
              <Textarea value={draft.businessNeed} onChange={(e) => updateDraft("businessNeed", e.target.value)} rows={3} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Current State</label>
              <Textarea value={draft.currentState} onChange={(e) => updateDraft("currentState", e.target.value)} rows={3} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Key Requirements</label>
              <Textarea value={draft.keyRequirements} onChange={(e) => updateDraft("keyRequirements", e.target.value)} rows={3} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Architecture Constraints</label>
              <Textarea value={draft.architectureConstraints} onChange={(e) => updateDraft("architectureConstraints", e.target.value)} rows={3} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Timeline &amp; Priority</label>
              <select
                value={draft.timelinePriority}
                onChange={(e) => updateDraft("timelinePriority", e.target.value as SolutionSpecRequestDraft["timelinePriority"])}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option>Urgent (within 1 month)</option>
                <option>Standard (1-3 months)</option>
                <option>Planning (3-6 months)</option>
                <option>Future (6+ months)</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Preferred Output</label>
              <div className="grid gap-2 md:grid-cols-2">
                {OUTPUT_OPTIONS.map((output) => (
                  <label key={output} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm cursor-pointer hover:border-orange-300">
                    <input
                      type="checkbox"
                      checked={draft.preferredOutputs.includes(output)}
                      onChange={() => toggleOutput(output)}
                    />
                    {output}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Additional Notes</label>
              <Textarea value={draft.additionalNotes} onChange={(e) => updateDraft("additionalNotes", e.target.value)} rows={3} />
            </div>
          </div>
          </div>

          <DialogFooter className="flex-shrink-0 border-t border-gray-200 pt-4 mt-2">
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !draft.programme.trim() ||
                !draft.businessNeed.trim() ||
                !draft.currentState.trim() ||
                !draft.keyRequirements.trim() ||
                draft.preferredOutputs.length === 0
              }
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          setShowLoginModal(false);
          setShowRequestDialog(true);
        }}
        context={{
          marketplace: "solution-specs",
          tab: "specs",
          cardId: spec.id,
          serviceName: spec.title,
          action: "Request This Spec",
        }}
      />

      <Footer />
    </div>
  );
}
