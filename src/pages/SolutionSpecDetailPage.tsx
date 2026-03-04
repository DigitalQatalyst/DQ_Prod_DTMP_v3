import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  ArrowLeft,
  FileText,
  Layers,
  GitBranch,
  Download,
  Calendar,
  User,
  Building2,
  Award,
  FileX,
  ArrowRight,
  CheckCircle,
  Cpu,
  BarChart3,
  Settings,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { solutionSpecs, SolutionType } from "@/data/blueprints/solutionSpecs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoginModal } from "@/components/learningCenter/LoginModal";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

type DetailTab = "overview" | "architecture" | "implementation" | "documents" | "author";

const SOLUTION_TYPE_COLORS: Record<SolutionType, { bg: string; text: string; border: string }> = {
  DBP: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  DXP: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  DWS: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  DIA: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  SDO: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
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

const SOLUTION_TYPE_LABELS: Record<SolutionType, string> = {
  DBP: "Digital Business Platform",
  DXP: "Digital Experience Platform",
  DWS: "Digital Workplace Solution",
  DIA: "Digital Intelligence & Analytics",
  SDO: "Secure Digital Operations",
};

// Generate contextual content based on spec data
function getOverviewContent(spec: ReturnType<typeof solutionSpecs["find"]>) {
  if (!spec) return null;
  return {
    introduction: `${spec.title} is a ${MATURITY_LABELS[spec.maturityLevel].toLowerCase()}-grade solution specification designed for ${SCOPE_LABELS[spec.scope].toLowerCase()} scale deployments. This comprehensive blueprint provides the architectural foundation needed to deliver robust, scalable digital transformation outcomes.`,
    highlights: [
      `${spec.diagramCount} architecture diagram${spec.diagramCount !== 1 ? "s" : ""} covering key views`,
      `${spec.componentCount} defined components with specifications`,
      `${MATURITY_LABELS[spec.maturityLevel]} maturity level — field-tested and validated`,
      `Scoped for ${SCOPE_LABELS[spec.scope].toLowerCase()} deployments`,
      "Aligned with DTMP architecture standards and principles",
      "Supports agile and phased implementation approaches",
    ],
    useCases: [
      `Establishing a ${spec.solutionType} platform foundation`,
      "Accelerating architecture design decisions",
      "Standardising technology choices across teams",
      "Enabling reference-based delivery for faster execution",
      "Supporting digital transformation programme planning",
    ],
  };
}

function getArchitectureContent(spec: ReturnType<typeof solutionSpecs["find"]>) {
  if (!spec) return null;
  return {
    layers: [
      { name: "Presentation Layer", description: "User interfaces, portals, and front-end channels for end-user interaction." },
      { name: "Integration Layer", description: "APIs, event buses, and middleware connecting services and platforms." },
      { name: "Service Layer", description: "Core business logic, microservices, and domain-specific capabilities." },
      { name: "Data Layer", description: "Databases, data lakes, and storage solutions for persistent data management." },
      { name: "Infrastructure Layer", description: "Cloud, compute, networking, and security infrastructure foundations." },
    ],
    components: spec.tags.map((tag, idx) => ({
      id: `COMP-${String(idx + 1).padStart(3, "0")}`,
      name: tag,
      type: idx % 3 === 0 ? "Platform Service" : idx % 3 === 1 ? "Integration Component" : "Data Service",
    })),
  };
}

function getImplementationContent() {
  return {
    steps: [
      { title: "Discovery & Assessment", description: "Evaluate current architecture, identify gaps, and define target state aligned with this spec." },
      { title: "Architecture Design", description: "Adapt the reference architecture to your organisation's specific requirements and constraints." },
      { title: "Component Selection", description: "Select technology products and platforms for each architectural component." },
      { title: "Proof of Concept", description: "Validate key architectural decisions with a focused PoC on critical components." },
      { title: "Phased Delivery", description: "Implement in iterative phases following the recommended delivery sequence." },
      { title: "Operationalise", description: "Establish monitoring, governance, and support processes for ongoing operations." },
    ],
    timeline: "Typical implementation ranges from 3 to 18 months depending on scope, organisational readiness, and complexity.",
    considerations: [
      "Engage enterprise architecture stakeholders early",
      "Ensure data governance policies are defined before data layer implementation",
      "Plan for change management and user adoption alongside technical delivery",
      "Leverage existing investments where possible before introducing new platforms",
    ],
  };
}

export function SolutionSpecDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const spec = solutionSpecs.find((s) => s.id === id);

  if (!spec) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16" id="main-content">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileX className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Solution Spec Not Found</h1>
            <p className="text-gray-600 mb-8">
              The solution specification you are looking for does not exist or may have been moved.
            </p>
            <Button onClick={() => navigate("/marketplaces/solution-specs")} className="inline-flex items-center gap-2">
              <ArrowLeft size={18} />
              Back to Solution Specs
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const colors = SOLUTION_TYPE_COLORS[spec.solutionType];
  const relatedSpecs = solutionSpecs
    .filter((s) => s.solutionType === spec.solutionType && s.id !== spec.id)
    .slice(0, 3);

  const overviewContent = getOverviewContent(spec);
  const architectureContent = getArchitectureContent(spec);
  const implementationContent = getImplementationContent();

  const handleMakeRequest = () => {
    navigate("/marketplaces/solution-specs/request", {
      state: {
        specId: spec.id,
        serviceName: spec.title,
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
          <button
            onClick={() => navigate("/marketplaces/solution-specs")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to Solution Specs
          </button>

          {/* Badges Row */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`} variant="outline">
              {spec.solutionType}
            </Badge>
            <Badge className="bg-gray-100 text-gray-700 border-0">
              {SCOPE_LABELS[spec.scope]}
            </Badge>
            <Badge className="bg-gray-100 text-gray-700 border-0 flex items-center gap-1">
              <Award className="w-3 h-3" />
              {MATURITY_LABELS[spec.maturityLevel]}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{spec.title}</h1>

          {/* Solution Type Label */}
          <p className="text-sm text-muted-foreground mb-4">
            {SOLUTION_TYPE_LABELS[spec.solutionType]} &nbsp;·&nbsp; By {spec.author}
          </p>

          {/* Key Stats Row */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-orange-500" />
              {spec.diagramCount} diagram{spec.diagramCount !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-orange-500" />
              {spec.componentCount} component{spec.componentCount !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-orange-500" />
              Updated {new Date(spec.lastUpdated).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-orange-500" />
              {spec.author}
            </span>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DetailTab)} className="w-full">
        <div className="bg-white border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto">
            <TabsList className="h-auto bg-transparent p-0 gap-1 overflow-x-auto flex justify-start px-4 lg:px-8">
              {[
                { value: "overview", label: "Overview" },
                { value: "architecture", label: "Architecture" },
                { value: "implementation", label: "Implementation" },
                { value: "documents", label: "Documents" },
                { value: "author", label: "Author Info" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-gray-900 data-[state=active]:shadow-none bg-transparent"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left — Tab Content */}
            <div className="flex-1 min-w-0">

              {/* OVERVIEW TAB */}
              <TabsContent value="overview" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Spec Overview</h2>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {overviewContent?.introduction}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Highlights</h3>
                    <ul className="space-y-3">
                      {overviewContent?.highlights.map((h, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Use Cases</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
                      {overviewContent?.useCases.map((uc, idx) => (
                        <li key={idx}>{uc}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Technology Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {spec.tags.map((tag) => (
                        <span key={tag} className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg text-sm font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ARCHITECTURE TAB */}
              <TabsContent value="architecture" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Architecture Layers</h2>
                    <div className="space-y-4">
                      {architectureContent?.layers.map((layer, idx) => (
                        <div key={idx} className="flex gap-4 p-5 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{layer.name}</h4>
                            <p className="text-sm text-muted-foreground">{layer.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Key Components ({architectureContent?.components.length})
                    </h3>
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700">Component</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700">Type</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700">ID</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {architectureContent?.components.map((comp, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 font-medium text-gray-900">{comp.name}</td>
                              <td className="px-4 py-3 text-muted-foreground">{comp.type}</td>
                              <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{comp.id}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Diagrams Included</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.from({ length: spec.diagramCount }, (_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {["Context Diagram", "Container Diagram", "Component Diagram", "Deployment Diagram", "Sequence Diagram", "Data Flow Diagram"][i] || `Architecture View ${i + 1}`}
                            </p>
                            <p className="text-xs text-muted-foreground">Architecture diagram</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* IMPLEMENTATION TAB */}
              <TabsContent value="implementation" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Implementation Guide</h2>
                    <div className="space-y-4">
                      {implementationContent.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                            {idx + 1}
                          </div>
                          <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
                            <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Estimated Timeline</h3>
                    <p className="text-muted-foreground bg-blue-50 border border-blue-100 rounded-lg p-4">
                      {implementationContent.timeline}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Considerations</h3>
                    <ul className="space-y-3">
                      {implementationContent.considerations.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Settings className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* DOCUMENTS TAB */}
              <TabsContent value="documents" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Specification Documents</h2>
                    <div className="grid gap-4">
                      {[
                        { name: `${spec.title} — Full Specification`, type: "PDF", size: "2.4 MB" },
                        { name: "Architecture Diagram Pack", type: "ZIP", size: "8.1 MB" },
                        { name: "Component Reference Guide", type: "PDF", size: "1.2 MB" },
                        { name: "Implementation Checklist", type: "XLSX", size: "0.4 MB" },
                      ].map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
                        >
                          <FileText className="w-8 h-8 text-gray-400 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900">{doc.name}</h4>
                            <p className="text-xs text-muted-foreground">{doc.type} · {doc.size}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-orange-600 hover:text-orange-700"
                            onClick={handleMakeRequest}
                          >
                            <Download className="w-5 h-5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Resources</h3>
                    <ul className="space-y-3">
                      {[
                        { name: "DTMP Architecture Standards", url: "#" },
                        { name: "Solution Design Principles", url: "#" },
                        { name: "Related Implementation Guides", url: "#" },
                      ].map((r, idx) => (
                        <li key={idx}>
                          <a href={r.url} className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium">
                            <ExternalLink className="w-4 h-4" />
                            {r.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* AUTHOR TAB */}
              <TabsContent value="author" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Author</h2>
                    <div className="flex items-start gap-4 p-6 bg-gray-50 border border-gray-200 rounded-xl mb-6">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-8 h-8 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{spec.author}</h3>
                        <p className="text-sm text-muted-foreground mb-3">Enterprise Architecture Team · DTMP Platform</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          This specification was produced by the {spec.author}, responsible for defining and maintaining enterprise-grade architecture blueprints across all DTMP solution domains. The team ensures all specifications adhere to DTMP quality standards, architectural principles, and industry best practices.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Team Credentials</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
                      {[
                        "TOGAF-certified enterprise architects",
                        "15+ years combined digital transformation experience",
                        "Cross-industry domain expertise across all DTMP solution types",
                        "Regular review and alignment with emerging technology trends",
                      ].map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Other Specifications by this Team</h3>
                    <div className="space-y-3">
                      {solutionSpecs
                        .filter((s) => s.author === spec.author && s.id !== spec.id)
                        .slice(0, 3)
                        .map((other) => (
                          <div
                            key={other.id}
                            onClick={() => navigate(`/marketplaces/solution-specs/${other.id}`)}
                            className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            <BookOpen className="w-5 h-5 text-orange-500 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm">{other.title}</h4>
                              <span className="text-xs text-muted-foreground">{SOLUTION_TYPE_LABELS[other.solutionType]}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>

            {/* Right — Sticky Sidebar */}
            <aside className="lg:w-80 xl:w-96 flex-shrink-0">
              <div className="lg:sticky lg:top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Spec Details</h3>

                {/* Metadata Table */}
                <table className="w-full mb-6">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4 flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> Scope
                      </td>
                      <td className="text-sm font-medium text-gray-900 py-3">{SCOPE_LABELS[spec.scope]}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">
                        <span className="flex items-center gap-2"><Award className="w-4 h-4" /> Maturity</span>
                      </td>
                      <td className="text-sm font-medium text-gray-900 py-3">{MATURITY_LABELS[spec.maturityLevel]}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">
                        <span className="flex items-center gap-2"><Layers className="w-4 h-4" /> Diagrams</span>
                      </td>
                      <td className="text-sm font-medium text-gray-900 py-3">{spec.diagramCount}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">
                        <span className="flex items-center gap-2"><Cpu className="w-4 h-4" /> Components</span>
                      </td>
                      <td className="text-sm font-medium text-gray-900 py-3">{spec.componentCount}</td>
                    </tr>
                    <tr>
                      <td className="text-sm text-muted-foreground py-3 pr-4">
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Updated</span>
                      </td>
                      <td className="text-sm font-medium text-gray-900 py-3">
                        {new Date(spec.lastUpdated).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* What's Included */}
                <div className="border-t border-gray-200 pt-5 mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    {[
                      "Full architecture specification",
                      `${spec.diagramCount} architecture diagrams`,
                      `${spec.componentCount} component definitions`,
                      "Implementation guidance",
                      "Technology recommendations",
                      "Downloadable document pack",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Button
                  onClick={handleMakeRequest}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-base font-semibold transition-all hover:shadow-xl"
                >
                  Make Request
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                {spec.downloadUrl && (
                  <Button
                    variant="outline"
                    className="w-full mt-3"
                    onClick={handleMakeRequest}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Preview
                  </Button>
                )}
              </div>
            </aside>

          </div>
        </div>
      </Tabs>

      {/* Related Specifications */}
      {relatedSpecs.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedSpecs.map((relatedSpec) => {
                const rColors = SOLUTION_TYPE_COLORS[relatedSpec.solutionType];
                return (
                  <article
                    key={relatedSpec.id}
                    onClick={() => navigate(`/marketplaces/solution-specs/${relatedSpec.id}`)}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <Badge className={`${rColors.bg} ${rColors.text} ${rColors.border} border font-semibold mb-3`} variant="outline">
                      {relatedSpec.solutionType}
                    </Badge>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {relatedSpec.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{relatedSpec.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3" /> {relatedSpec.diagramCount} diagrams
                      </span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3 h-3" /> {relatedSpec.componentCount} components
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        context={{
          marketplace: "solution-specs",
          tab: "specs",
          cardId: spec?.id || "",
          serviceName: spec?.title || "Solution Spec",
          action: "Make Request",
        }}
      />

      <Footer />
    </div>
  );
}
