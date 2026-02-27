import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  ArrowLeft,
  BookOpen,
  Brain,
  BarChart3,
  Database,
  Rocket,
  Sparkles,
  CheckCircle2,
  Target,
  Lightbulb,
  Activity,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  DollarSign,
  Shield,
  CheckCircle,
  Network,
  Gauge,
  Users,
  AlertCircle,
  Link as LinkIcon,
  Cpu,
  GitBranch,
  Map,
  Zap,
  ShieldAlert,
  Calendar,
  MessageSquare,
  Clock,
  Eye,
  FileText,
  LucideIcon,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { IntelligenceCard } from "@/components/digitalIntelligence";
import {
  systemsPortfolio,
  digitalMaturity,
  projectsPortfolio,
  type SystemsPortfolioService,
  type DigitalMaturityService,
  type ProjectsPortfolioService,
} from "@/data/digitalIntelligence";

const iconMap: Record<string, LucideIcon> = {
  Activity, AlertTriangle, TrendingUp, RefreshCw, DollarSign, Shield,
  CheckCircle, Network, Gauge, Users, AlertCircle, Link: LinkIcon, Target, Cpu,
  GitBranch, BarChart3, Map, Zap, ShieldAlert, Calendar, MessageSquare, BookOpen,
};

type ContentTab = "about" | "ai-model" | "insights" | "data-integration" | "getting-started";

type ServiceType = SystemsPortfolioService | DigitalMaturityService | ProjectsPortfolioService;

const CONTENT_TABS: { key: ContentTab; label: string; icon: React.ReactNode }[] = [
  { key: "about", label: "About", icon: <BookOpen className="w-4 h-4" /> },
  { key: "ai-model", label: "AI Model", icon: <Brain className="w-4 h-4" /> },
  { key: "insights", label: "Insights & Outputs", icon: <BarChart3 className="w-4 h-4" /> },
  { key: "data-integration", label: "Data & Integration", icon: <Database className="w-4 h-4" /> },
  { key: "getting-started", label: "Getting Started", icon: <Rocket className="w-4 h-4" /> },
];

export default function DigitalIntelligenceDetailPage() {
  const { tab, cardId } = useParams<{ tab: string; cardId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ContentTab>("about");

  let service: ServiceType | undefined;
  let tabDisplayName = "";
  let allServices: ServiceType[] = [];

  switch (tab) {
    case "systems-portfolio":
      service = systemsPortfolio.find((s) => s.id === cardId);
      tabDisplayName = "Systems Portfolio";
      allServices = systemsPortfolio;
      break;
    case "digital-maturity":
      service = digitalMaturity.find((s) => s.id === cardId);
      tabDisplayName = "Digital Maturity";
      allServices = digitalMaturity;
      break;
    case "projects-portfolio":
      service = projectsPortfolio.find((s) => s.id === cardId);
      tabDisplayName = "Projects Portfolio";
      allServices = projectsPortfolio;
      break;
  }

  const relatedServices = useMemo(() => {
    if (!service) return [];
    return allServices
      .filter((s) => s.id !== service!.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  }, [service, allServices]);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center" id="main-content">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Service Not Found</h1>
            <p className="text-gray-600 mb-8">
              The intelligence service you are looking for does not exist or may have been moved.
            </p>
            <Link
              to="/marketplaces/digital-intelligence"
              className="inline-flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Digital Intelligence
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const IconComponent = iconMap[service.icon] || Activity;

  const handleBackClick = () => {
    navigate(`/marketplaces/digital-intelligence?tab=${tab}`);
  };

  const handleAccessClick = () => {
    navigate(`/marketplaces/digital-intelligence/${tab}/${service!.id}/dashboard`);
  };

  const handleRelatedClick = (serviceId: string) => {
    navigate(`/marketplaces/digital-intelligence/${tab}/${serviceId}`);
  };

  const dataSource =
    (service as SystemsPortfolioService).dataSource ||
    (service as ProjectsPortfolioService).dataSource ||
    "Multiple Sources";

  const updateFrequency =
    (service as SystemsPortfolioService).updateFrequency ||
    (service as ProjectsPortfolioService).updateFrequency ||
    "";

  const visualizationType =
    (service as SystemsPortfolioService).visualizationType ||
    (service as ProjectsPortfolioService).visualizationType ||
    "";

  const outputFormat = (service as DigitalMaturityService).outputFormat || "";

  const assessmentFrequency = (service as DigitalMaturityService).assessmentFrequency || "";

  const framework = (service as DigitalMaturityService).framework || "";

  const systemScope = (service as SystemsPortfolioService).systemScope || "";

  const assessmentScope = (service as DigitalMaturityService).assessmentScope || "";

  const projectType = (service as ProjectsPortfolioService).projectType || "";

  // ── Tab content renderers ──

  const renderAboutTab = () => (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
        <p className="text-gray-700 leading-relaxed">
          {service.description} This AI-powered intelligence service provides actionable insights
          to help organizations make data-driven decisions and optimize their digital transformation journey.
        </p>
      </section>

      {service.aiCapabilities.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Capabilities
          </h2>
          <ul className="space-y-3">
            {service.aiCapabilities.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {service.keyInsights.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Key Insights Provided
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {service.keyInsights.map((insight, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                {insight}
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Business Value
        </h2>
        <ul className="space-y-3">
          {[
            "Reduce decision-making time with actionable insights",
            "Identify risks and opportunities before they materialize",
            "Optimize resource allocation and costs",
            "Enable continuous improvement through data-driven insights",
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  const renderAIModelTab = () => (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">AI Model Architecture</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          {service.aiPowered
            ? `This service uses advanced machine learning algorithms including ensemble methods, 
               neural networks, and statistical analysis to deliver accurate predictions and insights.`
            : `This service uses traditional analytics and statistical methods to provide insights.`}
        </p>

        {service.aiPowered && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-semibold text-purple-900 mb-3">Model Components</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Data Processing", desc: "Real-time and batch data processing pipelines" },
                { title: "Feature Engineering", desc: "Automated feature extraction and selection" },
                { title: "Model Inference", desc: "Low-latency prediction serving" },
                { title: "Continuous Learning", desc: "Regular model retraining with new data" },
              ].map((component) => (
                <div key={component.title} className="bg-white rounded-lg p-4 border border-purple-100">
                  <h4 className="font-medium text-gray-900 mb-2">{component.title}</h4>
                  <p className="text-sm text-gray-600">{component.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Accuracy Metrics</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{service.accuracy.replace("Accuracy", "").trim() || "85%"}</p>
              <p className="text-sm text-gray-600 mt-1">Prediction Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">&lt;12%</p>
              <p className="text-sm text-gray-600 mt-1">False Positive Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">7 days</p>
              <p className="text-sm text-gray-600 mt-1">Avg Lead Time</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">Monthly</p>
              <p className="text-sm text-gray-600 mt-1">Model Updates</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderInsightsTab = () => (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Primary Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {service.keyInsights.map((insight, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{insight}</h3>
              </div>
              <p className="text-sm text-gray-600">
                Comprehensive analysis and visualization of {insight.toLowerCase()}.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Dashboard Views</h2>
        <div className="space-y-4">
          {[
            { title: "Executive Overview", desc: "High-level summary with key metrics and trends" },
            { title: "Detailed Analytics", desc: "Deep-dive analysis with drill-down capabilities" },
            { title: "Trend Analysis", desc: "Historical trends and forecasting visualizations" },
          ].map((view) => (
            <div key={view.title} className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-2">{view.title}</h3>
              <p className="text-sm text-gray-600">{view.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Export Formats</h2>
        <div className="flex flex-wrap gap-3">
          {["PDF Report", "Excel Export", "API Access", "Email Alerts"].map((format) => (
            <span key={format} className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium">
              {format}
            </span>
          ))}
        </div>
      </section>
    </div>
  );

  const renderDataIntegrationTab = () => (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Required Data Sources</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">{dataSource}</h3>
              <Badge className="bg-green-100 text-green-700 border-0">Required</Badge>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-3">
              Primary data source for this intelligence service. Ensure connectivity and data quality requirements are met.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Real-time sync", "Historical data", "API access"].map((feature) => (
                <span key={feature} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Integration Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "API Integration", desc: "REST APIs for pulling metrics from source systems" },
            { title: "Agent-Based Collection", desc: "Lightweight agents deployed on monitored systems" },
          ].map((method) => (
            <div key={method.title} className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
              <p className="text-sm text-gray-600">{method.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Data Quality Requirements</h2>
        <ul className="space-y-3">
          {[
            "Minimum 90 days of historical data",
            "Consistent metric collection (no gaps >4 hours)",
            "Accurate metadata and system information",
          ].map((req, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{req}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  const renderGettingStartedTab = () => (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Prerequisites</h2>
        <ul className="space-y-3">
          {[
            "Active DTMP platform subscription",
            "Data source connectivity configured",
            "Minimum historical data available",
            "User access permissions configured",
          ].map((prereq, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{prereq}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Setup Process</h2>
        <div className="space-y-4">
          {[
            { phase: "Phase 1: Data Source Configuration", duration: "1-2 weeks", description: "Configure API connections and validate data collection" },
            { phase: "Phase 2: Initial Model Training", duration: "1 week", description: "Train models on your historical data" },
            { phase: "Phase 3: Pilot Deployment", duration: "2-4 weeks", description: "Deploy for pilot user group and validate accuracy" },
            { phase: "Phase 4: Full Rollout", duration: "2-4 weeks", description: "Enterprise-wide deployment and training" },
          ].map((step, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-700 font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{step.phase}</h3>
                    <Badge className="bg-blue-100 text-blue-700 border-0">{step.duration}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Training Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Platform Overview Training (2 hours)",
            "Dashboard Configuration (3 hours)",
            "Interpreting Insights Workshop (4 hours)",
            "Administrator Training (1 day)",
          ].map((resource, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-purple-500 flex-shrink-0" />
              {resource}
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "about": return renderAboutTab();
      case "ai-model": return renderAIModelTab();
      case "insights": return renderInsightsTab();
      case "data-integration": return renderDataIntegrationTab();
      case "getting-started": return renderGettingStartedTab();
      default: return renderAboutTab();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1" id="main-content">
        {/* ── Dark Header Section ── */}
        <div className="bg-gradient-to-r from-[#0B1437] to-[#1a2555] text-white">
          <div className="max-w-7xl mx-auto px-4 pt-6 pb-10">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-sm text-gray-300 mb-6 flex-wrap"
            >
              <button onClick={() => navigate("/")} className="hover:text-white transition-colors">
                Home
              </button>
              <ChevronRight size={14} aria-hidden="true" className="text-gray-500" />
              <button onClick={() => navigate("/marketplaces")} className="hover:text-white transition-colors">
                Marketplaces
              </button>
              <ChevronRight size={14} aria-hidden="true" className="text-gray-500" />
              <button onClick={() => navigate("/marketplaces/digital-intelligence")} className="hover:text-white transition-colors">
                Digital Intelligence
              </button>
              <ChevronRight size={14} aria-hidden="true" className="text-gray-500" />
              <span className="text-white font-medium" aria-current="page">
                {service.title}
              </span>
            </nav>

            {/* Back Button */}
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Back to {tabDisplayName}
            </button>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-sm font-semibold">
                {service.analyticsType}
              </Badge>
              {service.aiPowered && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-sm font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI-Powered
                </Badge>
              )}
              <Badge className="bg-orange-500/20 text-orange-300 border border-orange-400/30 text-sm font-semibold">
                {service.complexity} Complexity
              </Badge>
            </div>

            {/* Title & Description */}
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-white/20">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  {service.title}
                </h1>
                <p className="text-gray-300 text-base leading-relaxed max-w-3xl">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab Navigation ── */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex overflow-x-auto" role="tablist">
              {CONTENT_TABS.map((t) => {
                const isActive = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(t.key)}
                    className={`px-5 py-4 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${
                      isActive
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                    }`}
                  >
                    {t.icon}
                    <span className="hidden sm:inline">{t.label}</span>
                    <span className="sm:hidden">{t.label.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Two-Column Content ── */}
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Tab Content */}
            <div className="flex-1 min-w-0">
              {renderActiveTabContent()}
            </div>

            {/* Right Column: Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-20 space-y-6">
                {/* Service Details Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-5">Service Details</h3>
                  <dl className="space-y-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-500 flex items-center gap-2">
                        <Target className="w-4 h-4" /> Accuracy
                      </dt>
                      <dd className="text-sm font-semibold text-gray-900">{service.accuracy}</dd>
                    </div>
                    <div className="border-t border-gray-100" />

                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-500 flex items-center gap-2">
                        <Gauge className="w-4 h-4" /> Complexity
                      </dt>
                      <dd className="text-sm font-semibold text-gray-900">{service.complexity}</dd>
                    </div>
                    <div className="border-t border-gray-100" />

                    {(updateFrequency || assessmentFrequency) && (
                      <>
                        <div className="flex items-center justify-between">
                          <dt className="text-sm text-gray-500 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> {assessmentFrequency ? "Frequency" : "Update Freq."}
                          </dt>
                          <dd className="text-sm font-semibold text-gray-900">{updateFrequency || assessmentFrequency}</dd>
                        </div>
                        <div className="border-t border-gray-100" />
                      </>
                    )}

                    {dataSource && dataSource !== "Multiple Sources" && (
                      <>
                        <div className="flex items-center justify-between">
                          <dt className="text-sm text-gray-500 flex items-center gap-2">
                            <Database className="w-4 h-4" /> Data Source
                          </dt>
                          <dd className="text-sm font-semibold text-gray-900">{dataSource}</dd>
                        </div>
                        <div className="border-t border-gray-100" />
                      </>
                    )}

                    {(visualizationType || outputFormat) && (
                      <>
                        <div className="flex items-center justify-between">
                          <dt className="text-sm text-gray-500 flex items-center gap-2">
                            <Eye className="w-4 h-4" /> {outputFormat ? "Output" : "Visualization"}
                          </dt>
                          <dd className="text-sm font-semibold text-gray-900">{visualizationType || outputFormat}</dd>
                        </div>
                        <div className="border-t border-gray-100" />
                      </>
                    )}

                    {(systemScope || assessmentScope) && (
                      <>
                        <div className="flex items-center justify-between">
                          <dt className="text-sm text-gray-500 flex items-center gap-2">
                            <Network className="w-4 h-4" /> Scope
                          </dt>
                          <dd className="text-sm font-semibold text-gray-900">{systemScope || assessmentScope}</dd>
                        </div>
                        <div className="border-t border-gray-100" />
                      </>
                    )}

                    {framework && (
                      <>
                        <div className="flex items-center justify-between">
                          <dt className="text-sm text-gray-500 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Framework
                          </dt>
                          <dd className="text-sm font-semibold text-gray-900">{framework}</dd>
                        </div>
                        <div className="border-t border-gray-100" />
                      </>
                    )}

                    {projectType && (
                      <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-500 flex items-center gap-2">
                          <FileText className="w-4 h-4" /> Project Type
                        </dt>
                        <dd className="text-sm font-semibold text-gray-900">{projectType}</dd>
                      </div>
                    )}
                  </dl>

                  {/* What's Included — same card */}
                  <div className="border-t border-gray-200 mt-5 pt-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">What's Included</h3>
                  <ul className="space-y-3">
                    {[
                      { icon: <BarChart3 className="w-4 h-4 text-purple-500" />, label: "Interactive Dashboard" },
                      { icon: <Sparkles className="w-4 h-4 text-purple-500" />, label: service.aiPowered ? "AI-Powered Insights" : "Analytics Insights" },
                      { icon: <FileText className="w-4 h-4 text-purple-500" />, label: "Exportable Reports" },
                      { icon: <CheckCircle2 className="w-4 h-4 text-purple-500" />, label: "Onboarding Support" },
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm text-gray-700">
                        {item.icon}
                        {item.label}
                      </li>
                    ))}
                  </ul>
                  </div>

                  {/* CTA Button — inside the card */}
                  <div className="border-t border-gray-200 mt-5 pt-5">
                    <button
                      onClick={handleAccessClick}
                      className="w-full bg-orange-600 text-white hover:bg-orange-700 px-6 py-3.5 rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20"
                    >
                      <BarChart3 className="w-5 h-5" />
                      View Analytics
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* ── Related Services Section ── */}
        {relatedServices.length > 0 && (
          <div className="bg-gray-100 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Services</h2>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                role="list"
                aria-label="Related intelligence services"
              >
                {relatedServices.map((related) => (
                  <IntelligenceCard
                    key={related.id}
                    service={{
                      ...related,
                      dataSource: (related as SystemsPortfolioService).dataSource || (related as ProjectsPortfolioService).dataSource,
                      updateFrequency: (related as SystemsPortfolioService).updateFrequency || (related as ProjectsPortfolioService).updateFrequency,
                      visualizationType: (related as SystemsPortfolioService).visualizationType || (related as ProjectsPortfolioService).visualizationType,
                      outputFormat: (related as DigitalMaturityService).outputFormat,
                    }}
                    onClick={() => handleRelatedClick(related.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
