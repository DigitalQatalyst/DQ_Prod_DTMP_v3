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
} from "lucide-react";
import { solutionSpecs, SolutionType } from "@/data/blueprints/solutionSpecs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/learningCenter/LoginModal";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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

export function SolutionSpecDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  // Find the solution spec
  const spec = solutionSpecs.find((s) => s.id === id);

  // Handle 404 state
  if (!spec) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16" id="main-content">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileX className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Solution Spec Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The solution specification you are looking for does not exist or may have been
              moved.
            </p>
            <Button
              onClick={() => navigate("/marketplaces/solution-specs")}
              className="inline-flex items-center gap-2"
            >
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

  // Find related specifications (same solution type, excluding current)
  const relatedSpecs = solutionSpecs
    .filter((s) => s.solutionType === spec.solutionType && s.id !== spec.id)
    .slice(0, 3);

  const handleBackClick = () => {
    navigate("/marketplaces/solution-specs");
  };

  const handleRequestResource = () => {
    setShowLogin(true);
  };

  const loginContext = {
    marketplace: "solution-specs",
    tab: "specs",
    cardId: spec?.id || "",
    serviceName: spec?.title || "",
    action: "request",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8" id="main-content">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm text-gray-600 mb-6 flex-wrap"
        >
          <Link to="/" className="hover:text-[hsl(var(--orange))] transition-colors">
            Home
          </Link>
          <ChevronRight size={16} aria-hidden="true" />
          <Link
            to="/marketplaces/solution-specs"
            className="hover:text-[hsl(var(--orange))] transition-colors"
          >
            Solution Specs
          </Link>
          <ChevronRight size={16} aria-hidden="true" />
          <span className="text-gray-900 font-medium" aria-current="page">
            {spec.title}
          </span>
        </nav>

        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[hsl(var(--orange))] transition-colors mb-6 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--orange))] focus:ring-offset-2 rounded px-2 py-1"
        >
          <ArrowLeft size={16} />
          Back to Solution Specs
        </button>

        {/* Specification Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
          {/* Solution Type Badge */}
          <div className="flex items-center gap-3 mb-4">
            <Badge
              className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`}
              variant="outline"
            >
              {spec.solutionType}
            </Badge>
            <FileText className="w-5 h-5 text-gray-400" aria-hidden="true" />
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {spec.title}
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            {spec.description}
          </p>

          {/* Key Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6 pb-6 border-b border-gray-200">
            {/* Scope */}
            <div>
              <dt className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase mb-2">
                <Building2 className="w-4 h-4" />
                Scope
              </dt>
              <dd className="text-sm text-gray-900 font-medium">
                {SCOPE_LABELS[spec.scope]}
              </dd>
            </div>

            {/* Maturity Level */}
            <div>
              <dt className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase mb-2">
                <Award className="w-4 h-4" />
                Maturity
              </dt>
              <dd className="text-sm text-gray-900 font-medium">
                {MATURITY_LABELS[spec.maturityLevel]}
              </dd>
            </div>

            {/* Diagram Count */}
            <div>
              <dt className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase mb-2">
                <Layers className="w-4 h-4" />
                Diagrams
              </dt>
              <dd className="text-sm text-gray-900 font-medium">
                {spec.diagramCount} {spec.diagramCount === 1 ? "diagram" : "diagrams"}
              </dd>
            </div>

            {/* Component Count */}
            <div>
              <dt className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase mb-2">
                <GitBranch className="w-4 h-4" />
                Components
              </dt>
              <dd className="text-sm text-gray-900 font-medium">
                {spec.componentCount} {spec.componentCount === 1 ? "component" : "components"}
              </dd>
            </div>

            {/* Last Updated */}
            <div>
              <dt className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase mb-2">
                <Calendar className="w-4 h-4" />
                Updated
              </dt>
              <dd className="text-sm text-gray-900 font-medium">
                {new Date(spec.lastUpdated).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </dd>
            </div>
          </div>

          {/* Author */}
          <div className="mb-6">
            <dt className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase mb-2">
              <User className="w-4 h-4" />
              Author
            </dt>
            <dd className="text-sm text-gray-900 font-medium">{spec.author}</dd>
          </div>

          {/* Tags */}
          {spec.tags.length > 0 && (
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase mb-3">Tags</dt>
              <dd className="flex flex-wrap gap-2">
                {spec.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-lg text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </dd>
            </div>
          )}

          {/* Request Resource Button */}
          {spec.downloadUrl && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                onClick={handleRequestResource}
                className="inline-flex items-center gap-2 bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90 text-white"
              >
                <Download size={18} />
                Request Resource
              </Button>
            </div>
          )}
        </div>

        {/* Related Specifications Section */}
        {relatedSpecs.length > 0 && (
          <section className="bg-white border border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedSpecs.map((relatedSpec) => {
                const relatedColors = SOLUTION_TYPE_COLORS[relatedSpec.solutionType];
                return (
                  <article
                    key={relatedSpec.id}
                    onClick={() => navigate(`/marketplaces/solution-specs/${relatedSpec.id}`)}
                    className="border border-gray-200 rounded-lg p-6 hover:border-[hsl(var(--orange))] hover:shadow-md transition-all cursor-pointer group"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(`/marketplaces/solution-specs/${relatedSpec.id}`);
                      }
                    }}
                    aria-label={`View ${relatedSpec.title}`}
                  >
                    <Badge
                      className={`${relatedColors.bg} ${relatedColors.text} ${relatedColors.border} border font-semibold mb-3`}
                      variant="outline"
                    >
                      {relatedSpec.solutionType}
                    </Badge>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[hsl(var(--orange))] transition-colors">
                      {relatedSpec.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {relatedSpec.description}
                    </p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {relatedSpec.diagramCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3 h-3" />
                        {relatedSpec.componentCount}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        context={loginContext}
      />

      <Footer />
    </div>
  );
}
