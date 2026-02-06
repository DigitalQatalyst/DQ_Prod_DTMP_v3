import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  ArrowLeft,
  Code,
  Wrench,
  Zap,
  Calendar,
  User,
  ExternalLink,
  FileX,
  Cpu,
} from "lucide-react";
import { solutionBuilds } from "@/data/blueprints/solutionBuilds";
import { SolutionType } from "@/data/blueprints/solutionSpecs";
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

const COMPLEXITY_LABELS: Record<string, string> = {
  basic: "Basic",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const AUTOMATION_LABELS: Record<string, string> = {
  manual: "Manual",
  "semi-automated": "Semi-Automated",
  "fully-automated": "Fully Automated",
};

export function SolutionBuildDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  // Find the solution build
  const build = solutionBuilds.find((b) => b.id === id);

  // Handle 404 state
  if (!build) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16" id="main-content">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileX className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Solution Build Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The solution build you are looking for does not exist or may have been moved.
            </p>
            <Button
              onClick={() => navigate("/marketplaces/solution-build")}
              className="inline-flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Back to Solution Build
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const colors = SOLUTION_TYPE_COLORS[build.solutionType];

  // Find related builds (same solution type, excluding current)
  const relatedBuilds = solutionBuilds
    .filter((b) => b.solutionType === build.solutionType && b.id !== build.id)
    .slice(0, 3);

  const handleBackClick = () => {
    navigate("/marketplaces/solution-build");
  };

  const handleRequestResource = () => {
    setShowLogin(true);
  };

  const loginContext = {
    marketplace: "solution-build",
    tab: "builds",
    cardId: build?.id || "",
    serviceName: build?.title || "",
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
            to="/marketplaces/solution-build"
            className="hover:text-[hsl(var(--orange))] transition-colors"
          >
            Solution Build
          </Link>
          <ChevronRight size={16} aria-hidden="true" />
          <span className="text-gray-900 font-medium" aria-current="page">
            {build.title}
          </span>
        </nav>

        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[hsl(var(--orange))] transition-colors mb-6 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--orange))] focus:ring-offset-2 rounded px-2 py-1"
        >
          <ArrowLeft size={16} />
          Back to Solution Build
        </button>

        {/* Build Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
          {/* Solution Type Badge */}
          <div className="flex items-center gap-3 mb-4">
            <Badge
              className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`}
              variant="outline"
            >
              {build.solutionType}
            </Badge>
            <Code className="w-5 h-5 text-gray-400" aria-hidden="true" />
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {build.title}
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            {build.description}
          </p>

          {/* Key Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6 pb-6 border-b border-gray-200">
            {/* Build Complexity */}
            <div>
              <dt className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase mb-2">
                <Cpu className="w-4 h-4" />
                Complexity
              </dt>
              <dd className="text-sm text-gray-900 font-medium">
                {COMPLEXITY_LABELS[build.buildComplexity]}
              </dd>
            </div>

            {/* Automation Level */}
            <div>
              <dt className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase mb-2">
                <Zap className="w-4 h-4" />
                Automation
              </dt>
              <dd className="text-sm text-gray-900 font-medium">
                {AUTOMATION_LABELS[build.automationLevel]}
              </dd>
            </div>

            {/* Code Samples */}
            <div>
              <dt className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase mb-2">
                <Wrench className="w-4 h-4" />
                Code Samples
              </dt>
              <dd className="text-sm text-gray-900 font-medium">
                {build.codeSamples ? "Available" : "Not Available"}
              </dd>
            </div>

            {/* Last Updated */}
            <div>
              <dt className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase mb-2">
                <Calendar className="w-4 h-4" />
                Updated
              </dt>
              <dd className="text-sm text-gray-900 font-medium">
                {new Date(build.lastUpdated).toLocaleDateString("en-US", {
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
            <dd className="text-sm text-gray-900 font-medium">{build.author}</dd>
          </div>

          {/* Technology Stack */}
          {build.technologyStack.length > 0 && (
            <div className="mb-6">
              <dt className="text-xs font-semibold text-gray-500 uppercase mb-3">
                Technology Stack
              </dt>
              <dd className="flex flex-wrap gap-2">
                {build.technologyStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {tech}
                  </span>
                ))}
              </dd>
            </div>
          )}

          {/* Tags */}
          {build.tags.length > 0 && (
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase mb-3">Tags</dt>
              <dd className="flex flex-wrap gap-2">
                {build.tags.map((tag) => (
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
          {build.repositoryUrl && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                onClick={handleRequestResource}
                className="inline-flex items-center gap-2 bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90 text-white"
              >
                <ExternalLink size={18} />
                Request Resource
              </Button>
            </div>
          )}
        </div>

        {/* Code Samples Section */}
        {build.codeSamples && (
          <section className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Code className="w-6 h-6" />
              Code Samples & Resources
            </h2>
            <p className="text-gray-600 mb-4">
              This solution build includes comprehensive code samples, configuration files,
              and implementation resources to help you get started quickly.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                Access the complete code repository and documentation using the "View
                Repository" button above.
              </p>
            </div>
          </section>
        )}

        {/* Related Builds Section */}
        {relatedBuilds.length > 0 && (
          <section className="bg-white border border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Builds</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBuilds.map((relatedBuild) => {
                const relatedColors = SOLUTION_TYPE_COLORS[relatedBuild.solutionType];
                return (
                  <article
                    key={relatedBuild.id}
                    onClick={() => navigate(`/marketplaces/solution-build/${relatedBuild.id}`)}
                    className="border border-gray-200 rounded-lg p-6 hover:border-[hsl(var(--orange))] hover:shadow-md transition-all cursor-pointer group"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(`/marketplaces/solution-build/${relatedBuild.id}`);
                      }
                    }}
                    aria-label={`View ${relatedBuild.title}`}
                  >
                    <Badge
                      className={`${relatedColors.bg} ${relatedColors.text} ${relatedColors.border} border font-semibold mb-3`}
                      variant="outline"
                    >
                      {relatedBuild.solutionType}
                    </Badge>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[hsl(var(--orange))] transition-colors">
                      {relatedBuild.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {relatedBuild.description}
                    </p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3" />
                        {COMPLEXITY_LABELS[relatedBuild.buildComplexity]}
                      </span>
                      {relatedBuild.codeSamples && (
                        <span className="flex items-center gap-1 text-green-600">
                          <Code className="w-3 h-3" />
                          Code samples
                        </span>
                      )}
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
