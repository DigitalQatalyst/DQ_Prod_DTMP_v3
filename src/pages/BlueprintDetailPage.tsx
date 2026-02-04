import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { ChevronRight, Star, Download, ArrowLeft, icons, LucideIcon } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import {
  solutionSpecs,
  solutionBuilds,
  type SolutionSpec,
  type SolutionBuild,
} from "@/data/blueprints";

type TabValue = "solution-specs" | "solution-build";

// Solution type color mapping
const solutionTypeColors: Record<string, string> = {
  DBP: "bg-purple-100 text-purple-700",
  DXP: "bg-pink-100 text-pink-700",
  DWS: "bg-blue-100 text-blue-700",
  DIA: "bg-green-100 text-green-700",
  SDO: "bg-orange-100 text-orange-700",
};

// Complexity color mapping
const complexityColors: Record<string, string> = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-orange-100 text-orange-700",
  "Very High": "bg-red-100 text-red-700",
};

export default function BlueprintDetailPage() {
  const { tab, blueprintId } = useParams<{ tab: TabValue; blueprintId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Handle invalid tab parameter - default to 'solution-specs'
  const validTab: TabValue = tab === "solution-build" ? "solution-build" : "solution-specs";

  // Fetch blueprint data based on tab and ID
  const blueprint =
    validTab === "solution-specs"
      ? solutionSpecs.find((b) => b.id === blueprintId)
      : solutionBuilds.find((b) => b.id === blueprintId);

  // Handle invalid blueprint ID - redirect to marketplace
  useEffect(() => {
    if (!blueprint) {
      navigate(`/marketplaces/blueprints?tab=${validTab}`, { replace: true });
    } else {
      // Simulate loading state for better UX
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [blueprint, navigate, validTab]);

  // Show loading state
  if (isLoading || !blueprint) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center" id="main-content">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--orange))]" aria-label="Loading"></div>
            <p className="mt-4 text-gray-600">Loading blueprint...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Determine if this is a SolutionSpec or SolutionBuild
  const isSolutionSpec = validTab === "solution-specs";
  const spec = blueprint as SolutionSpec;
  const build = blueprint as SolutionBuild;

  // Get the icon component dynamically
  const IconComponent: LucideIcon = icons[blueprint.icon as keyof typeof icons] as LucideIcon;

  // Tab display name
  const tabName = validTab === "solution-specs" ? "Solution Specs" : "Solution Build";

  // Handle back navigation
  const handleBackClick = () => {
    navigate(`/marketplaces/blueprints?tab=${validTab}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1" id="main-content">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-6 flex-wrap">
            <button
              onClick={() => navigate("/")}
              className="hover:text-[hsl(var(--orange))] transition-colors duration-300 min-h-[44px] px-2 flex items-center focus:outline-none focus:ring-2 focus:ring-[hsl(var(--orange))] focus:ring-offset-2 rounded"
              aria-label="Go to home page"
            >
              Home
            </button>
            <ChevronRight size={16} aria-hidden="true" />
            <button
              onClick={() => navigate("/marketplaces")}
              className="hover:text-[hsl(var(--orange))] transition-colors duration-300 min-h-[44px] px-2 flex items-center focus:outline-none focus:ring-2 focus:ring-[hsl(var(--orange))] focus:ring-offset-2 rounded"
              aria-label="Go to marketplaces"
            >
              Marketplaces
            </button>
            <ChevronRight size={16} aria-hidden="true" />
            <button
              onClick={() => navigate("/marketplaces/blueprints")}
              className="hover:text-[hsl(var(--orange))] transition-colors duration-300 min-h-[44px] px-2 flex items-center focus:outline-none focus:ring-2 focus:ring-[hsl(var(--orange))] focus:ring-offset-2 rounded"
              aria-label="Go to blueprints marketplace"
            >
              Blueprints
            </button>
            <ChevronRight size={16} aria-hidden="true" />
            <button
              onClick={handleBackClick}
              className="hover:text-[hsl(var(--orange))] transition-colors duration-300 min-h-[44px] px-2 flex items-center focus:outline-none focus:ring-2 focus:ring-[hsl(var(--orange))] focus:ring-offset-2 rounded"
              aria-label={`Go back to ${tabName}`}
            >
              {tabName}
            </button>
            <ChevronRight size={16} aria-hidden="true" />
            <span className="text-gray-900 font-medium" aria-current="page">{blueprint.title}</span>
          </nav>

          {/* Header Section */}
          <article aria-labelledby="blueprint-title">
            <header className="bg-white border border-gray-200 rounded-xl p-8 mb-6">
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  {IconComponent && <IconComponent className="text-white" size={48} />}
                </div>

                {/* Title and Badges */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h1 id="blueprint-title" className="text-3xl lg:text-4xl font-bold text-primary-navy">
                      {blueprint.title}
                    </h1>
                    {blueprint.featured && (
                      <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 flex-shrink-0 ml-4" aria-label="Featured blueprint" />
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2" role="list" aria-label="Blueprint attributes">
                    <Badge
                      className={`${
                        solutionTypeColors[blueprint.solutionTypeShort]
                      } border-0 text-sm font-semibold`}
                      role="listitem"
                      aria-label={`Solution type: ${blueprint.solutionType}`}
                    >
                      {blueprint.solutionType}
                    </Badge>
                    <Badge
                      className={`${
                        complexityColors[blueprint.complexity]
                      } border-0 text-sm font-semibold`}
                      role="listitem"
                      aria-label={`Complexity level: ${blueprint.complexity}`}
                    >
                      {blueprint.complexity} Complexity
                    </Badge>
                  </div>
                </div>
              </div>
            </header>

          {/* Overview Section */}
          <section className="bg-white border border-gray-200 rounded-xl p-8 mb-6" aria-labelledby="overview-heading">
            <h2 id="overview-heading" className="text-2xl font-bold text-primary-navy mb-4">Overview</h2>
            <p className="text-base text-gray-700 leading-relaxed">
              {blueprint.description}
            </p>
          </section>

          {/* Metadata Section */}
          <section className="bg-white border border-gray-200 rounded-xl p-8 mb-6" aria-labelledby="details-heading">
            <h2 id="details-heading" className="text-2xl font-bold text-primary-navy mb-4">Details</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Scope
                </dt>
                <dd className="text-base text-gray-900">{blueprint.scope}</dd>
              </div>

              {isSolutionSpec && (
                <>
                  <div>
                    <dt className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Maturity Level
                    </dt>
                    <dd className="text-base text-gray-900">{spec.maturityLevel}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Industry Focus
                    </dt>
                    <dd className="text-base text-gray-900">{spec.industryFocus}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Deployment Model
                    </dt>
                    <dd className="text-base text-gray-900">{spec.deploymentModel}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Technical Complexity
                    </dt>
                    <dd className="text-base text-gray-900">{spec.complexity}</dd>
                  </div>
                </>
              )}

              {!isSolutionSpec && (
                <>
                  <div>
                    <dt className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Build Complexity
                    </dt>
                    <dd className="text-base text-gray-900">{build.buildComplexity}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Technology Stack
                    </dt>
                    <dd className="text-base text-gray-900">{build.technologyStack}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Deployment Target
                    </dt>
                    <dd className="text-base text-gray-900">{build.deploymentTarget}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Implementation Time
                    </dt>
                    <dd className="text-base text-gray-900">{build.implementationTime}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Skill Level
                    </dt>
                    <dd className="text-base text-gray-900">{build.skillLevel}</dd>
                  </div>
                </>
              )}
            </dl>
          </section>

          {/* Technical Details Section */}
          <section className="bg-white border border-gray-200 rounded-xl p-8 mb-6" aria-labelledby="technologies-heading">
            <h2 id="technologies-heading" className="text-2xl font-bold text-primary-navy mb-4">
              Key Technologies
            </h2>
            <ul className="flex flex-wrap gap-3" aria-label="List of key technologies">
              {blueprint.keyTechnologies.map((tech, index) => (
                <li
                  key={index}
                  className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </section>

          {/* Architecture Section */}
          {isSolutionSpec && (
            <section className="bg-white border border-gray-200 rounded-xl p-8 mb-6" aria-labelledby="architecture-heading">
              <h2 id="architecture-heading" className="text-2xl font-bold text-primary-navy mb-4">
                Architecture & Components
              </h2>
              <ul className="space-y-4" aria-label="Architecture features">
                {spec.includesDiagrams && (
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></div>
                    <span className="text-base">
                      Comprehensive architecture diagrams included
                    </span>
                  </li>
                )}
                {spec.includesComponents && (
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></div>
                    <span className="text-base">
                      {blueprint.componentCount} components documented
                    </span>
                  </li>
                )}
              </ul>
            </section>
          )}

          {/* Implementation Section (Solution Build only) */}
          {!isSolutionSpec && (
            <section className="bg-white border border-gray-200 rounded-xl p-8 mb-6" aria-labelledby="implementation-heading">
              <h2 id="implementation-heading" className="text-2xl font-bold text-primary-navy mb-4">
                Implementation Details
              </h2>
              <div className="space-y-4">
                {build.includesAutomation.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Automation Tools Included
                    </h3>
                    <ul className="flex flex-wrap gap-2" aria-label="Automation tools">
                      {build.includesAutomation.map((tool, index) => (
                        <li
                          key={index}
                          className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded text-sm"
                        >
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {build.includesCodeSamples && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></div>
                    <span className="text-base">Code samples and examples included</span>
                  </div>
                )}
                {blueprint.componentCount > 0 && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></div>
                    <span className="text-base">
                      {blueprint.componentCount} implementation components
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8" aria-labelledby="cta-heading">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 id="cta-heading" className="text-xl font-bold text-primary-navy mb-2">
                  Ready to get started?
                </h2>
                <p className="text-gray-600">
                  Download this blueprint to access all documentation and resources.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={handleBackClick}
                  className="flex items-center justify-center gap-2 border-2 border-[hsl(var(--orange))] text-[hsl(var(--orange))] hover:bg-[hsl(var(--orange)/0.05)] px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--orange))] focus:ring-offset-2"
                  aria-label="Go back to blueprints marketplace"
                >
                  <ArrowLeft size={18} aria-hidden="true" />
                  Back to Blueprints
                </button>
                <button 
                  className="flex items-center justify-center gap-2 bg-[hsl(var(--orange))] text-white hover:bg-[hsl(var(--orange-hover))] px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--orange))] focus:ring-offset-2"
                  aria-label={`Download ${blueprint.title} blueprint`}
                >
                  <Download size={18} aria-hidden="true" />
                  Download Blueprint
                </button>
              </div>
            </div>
          </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
