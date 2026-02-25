 import { useState } from "react";
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
   LucideIcon,
 } from "lucide-react";
 import { Header } from "@/components/layout/Header";
 import { Footer } from "@/components/layout/Footer";
 import { Badge } from "@/components/ui/badge";
 import { LoginModal } from "@/components/learningCenter";
 import {
   systemsPortfolio,
   digitalMaturity,
   projectsPortfolio,
   type SystemsPortfolioService,
   type DigitalMaturityService,
   type ProjectsPortfolioService,
 } from "@/data/digitalIntelligence";
 
 // ─── Icon Map ────────────────────────────────────────────────────────────────
 
 const iconMap: Record<string, LucideIcon> = {
   Activity, AlertTriangle, TrendingUp, RefreshCw, DollarSign, Shield,
   CheckCircle, Network, Gauge, Users, AlertCircle, Link: LinkIcon, Target, Cpu,
   GitBranch, BarChart3, Map, Zap, ShieldAlert, Calendar, MessageSquare, BookOpen,
 };
 
 // ─── Types ───────────────────────────────────────────────────────────────────
 
 type ContentTab = "about" | "ai-model" | "insights" | "data-integration" | "getting-started";
 
 type ServiceType = SystemsPortfolioService | DigitalMaturityService | ProjectsPortfolioService;
 
 const CONTENT_TABS: { key: ContentTab; label: string; icon: React.ReactNode }[] = [
   { key: "about", label: "About", icon: <BookOpen className="w-4 h-4" /> },
   { key: "ai-model", label: "AI Model", icon: <Brain className="w-4 h-4" /> },
   { key: "insights", label: "Insights & Outputs", icon: <BarChart3 className="w-4 h-4" /> },
   { key: "data-integration", label: "Data & Integration", icon: <Database className="w-4 h-4" /> },
   { key: "getting-started", label: "Getting Started", icon: <Rocket className="w-4 h-4" /> },
 ];
 
 const complexityColors: Record<string, string> = {
   Low: "bg-green-100 text-green-700",
   Medium: "bg-yellow-100 text-yellow-700",
   High: "bg-red-100 text-red-700",
 };
 
 // ─── Component ───────────────────────────────────────────────────────────────
 
 export default function DigitalIntelligenceDetailPage() {
   const { tab, cardId } = useParams<{ tab: string; cardId: string }>();
   const navigate = useNavigate();
   const [activeTab, setActiveTab] = useState<ContentTab>("about");
   const [showLoginModal, setShowLoginModal] = useState(false);
 
   // Find service from the correct data array
   let service: ServiceType | undefined;
   let tabDisplayName = "";
 
   switch (tab) {
     case "systems-portfolio":
       service = systemsPortfolio.find((s) => s.id === cardId);
       tabDisplayName = "Systems Portfolio";
       break;
     case "digital-maturity":
       service = digitalMaturity.find((s) => s.id === cardId);
       tabDisplayName = "Digital Maturity";
       break;
     case "projects-portfolio":
       service = projectsPortfolio.find((s) => s.id === cardId);
       tabDisplayName = "Projects Portfolio";
       break;
   }
 
   // ─── 404 ────────────────────────────────────────────────────────────────────
 
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
 
   // ─── Derived values ─────────────────────────────────────────────────────────
 
   const IconComponent = iconMap[service.icon] || Activity;
 
   const handleBackClick = () => {
     navigate(`/marketplaces/digital-intelligence?tab=${tab}`);
   };
 
   const handleAccessClick = () => {
     setShowLoginModal(true);
   };
 
   // ─── Tab Content Renderers ──────────────────────────────────────────────────
 
   const renderAboutTab = () => (
     <div className="space-y-8">
       {/* Overview */}
       <section>
         <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
         <p className="text-gray-700 leading-relaxed">
           {service.description} This AI-powered intelligence service provides actionable insights
           to help organizations make data-driven decisions and optimize their digital transformation journey.
         </p>
       </section>
 
       {/* AI Capabilities */}
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
 
       {/* Key Insights */}
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
 
       {/* Business Value */}
       <section>
         <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
           <Target className="w-5 h-5 text-blue-600" />
           Business Value
         </h2>
         <ul className="space-y-3">
           <li className="flex items-start gap-3">
             <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
             <span className="text-gray-700">Reduce decision-making time with actionable insights</span>
           </li>
           <li className="flex items-start gap-3">
             <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
             <span className="text-gray-700">Identify risks and opportunities before they materialize</span>
           </li>
           <li className="flex items-start gap-3">
             <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
             <span className="text-gray-700">Optimize resource allocation and costs</span>
           </li>
           <li className="flex items-start gap-3">
             <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
             <span className="text-gray-700">Enable continuous improvement through data-driven insights</span>
           </li>
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
               <div className="bg-white rounded-lg p-4 border border-purple-100">
                 <h4 className="font-medium text-gray-900 mb-2">Data Processing</h4>
                 <p className="text-sm text-gray-600">Real-time and batch data processing pipelines</p>
               </div>
               <div className="bg-white rounded-lg p-4 border border-purple-100">
                 <h4 className="font-medium text-gray-900 mb-2">Feature Engineering</h4>
                 <p className="text-sm text-gray-600">Automated feature extraction and selection</p>
               </div>
               <div className="bg-white rounded-lg p-4 border border-purple-100">
                 <h4 className="font-medium text-gray-900 mb-2">Model Inference</h4>
                 <p className="text-sm text-gray-600">Low-latency prediction serving</p>
               </div>
               <div className="bg-white rounded-lg p-4 border border-purple-100">
                 <h4 className="font-medium text-gray-900 mb-2">Continuous Learning</h4>
                 <p className="text-sm text-gray-600">Regular model retraining with new data</p>
               </div>
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
           <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
             <h3 className="font-semibold text-gray-900 mb-2">Executive Overview</h3>
             <p className="text-sm text-gray-600">High-level summary with key metrics and trends</p>
           </div>
           <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
             <h3 className="font-semibold text-gray-900 mb-2">Detailed Analytics</h3>
             <p className="text-sm text-gray-600">Deep-dive analysis with drill-down capabilities</p>
           </div>
           <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
             <h3 className="font-semibold text-gray-900 mb-2">Trend Analysis</h3>
             <p className="text-sm text-gray-600">Historical trends and forecasting visualizations</p>
           </div>
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
 
   const renderDataIntegrationTab = () => {
     const dataSource = (service as SystemsPortfolioService).dataSource || 
                        (service as ProjectsPortfolioService).dataSource || 
                        "Multiple Sources";
 
     return (
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
             <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
               <h3 className="font-semibold text-gray-900 mb-2">API Integration</h3>
               <p className="text-sm text-gray-600">REST APIs for pulling metrics from source systems</p>
             </div>
             <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
               <h3 className="font-semibold text-gray-900 mb-2">Agent-Based Collection</h3>
               <p className="text-sm text-gray-600">Lightweight agents deployed on monitored systems</p>
             </div>
           </div>
         </section>
 
         <section>
           <h2 className="text-xl font-bold text-gray-900 mb-4">Data Quality Requirements</h2>
           <ul className="space-y-3">
             <li className="flex items-start gap-3">
               <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
               <span className="text-gray-700">Minimum 90 days of historical data</span>
             </li>
             <li className="flex items-start gap-3">
               <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
               <span className="text-gray-700">Consistent metric collection (no gaps &gt;4 hours)</span>
             </li>
             <li className="flex items-start gap-3">
               <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
               <span className="text-gray-700">Accurate metadata and system information</span>
             </li>
           </ul>
         </section>
       </div>
     );
   };
 
   const renderGettingStartedTab = () => (
     <div className="space-y-8">
       <section>
         <h2 className="text-xl font-bold text-gray-900 mb-4">Prerequisites</h2>
         <ul className="space-y-3">
           <li className="flex items-start gap-3">
             <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
             <span className="text-gray-700">Active DTMP platform subscription</span>
           </li>
           <li className="flex items-start gap-3">
             <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
             <span className="text-gray-700">Data source connectivity configured</span>
           </li>
           <li className="flex items-start gap-3">
             <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
             <span className="text-gray-700">Minimum historical data available</span>
           </li>
           <li className="flex items-start gap-3">
             <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
             <span className="text-gray-700">User access permissions configured</span>
           </li>
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
                   <div className="flex items-center gap-3 mb-2">
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
       case "about":
         return renderAboutTab();
       case "ai-model":
         return renderAIModelTab();
       case "insights":
         return renderInsightsTab();
       case "data-integration":
         return renderDataIntegrationTab();
       case "getting-started":
         return renderGettingStartedTab();
       default:
         return renderAboutTab();
     }
   };
 
   // ─── Render ─────────────────────────────────────────────────────────────────
 
   return (
     <div className="min-h-screen flex flex-col bg-gray-50">
       <Header />
 
       <main className="flex-1" id="main-content">
         <div className="max-w-7xl mx-auto px-4 py-12">
           {/* Breadcrumb Navigation */}
           <nav
             aria-label="Breadcrumb"
             className="flex items-center gap-2 text-sm text-gray-600 mb-6 flex-wrap"
           >
             <button
               onClick={() => navigate("/")}
               className="hover:text-purple-600 transition-colors"
             >
               Home
             </button>
             <ChevronRight size={16} aria-hidden="true" />
             <button
               onClick={() => navigate("/marketplaces")}
               className="hover:text-purple-600 transition-colors"
             >
               Marketplaces
             </button>
             <ChevronRight size={16} aria-hidden="true" />
             <button
               onClick={() => navigate("/marketplaces/digital-intelligence")}
               className="hover:text-purple-600 transition-colors"
             >
               Digital Intelligence
             </button>
             <ChevronRight size={16} aria-hidden="true" />
             <span className="text-gray-900 font-medium" aria-current="page">
               {service.title}
             </span>
           </nav>
 
           {/* Back Button */}
           <button
             onClick={handleBackClick}
             className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors mb-6"
           >
             <ArrowLeft size={16} />
             Back to {tabDisplayName}
           </button>
 
           {/* Service Header */}
           <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
             {/* Top Row: Badges */}
             <div className="flex flex-wrap items-center gap-3 mb-4">
               <Badge className="bg-blue-100 text-blue-700 border-0 text-sm font-semibold">
                 {service.analyticsType}
               </Badge>
               {service.aiPowered && (
                 <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-sm font-semibold flex items-center gap-1">
                   <Sparkles className="w-3 h-3" />
                   AI-Powered
                 </Badge>
               )}
               <Badge className={`${complexityColors[service.complexity]} border-0 text-sm font-semibold`}>
                 {service.complexity} Complexity
               </Badge>
             </div>
 
             {/* Title */}
             <div className="flex items-start gap-4 mb-4">
               <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                 <IconComponent className="w-8 h-8 text-purple-600" />
               </div>
               <div className="flex-1">
                 <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                   {service.title}
                 </h1>
                 <p className="text-gray-600 text-base leading-relaxed">
                   {service.description}
                 </p>
               </div>
             </div>
 
             {/* Key Metadata */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pt-4 border-t border-gray-200">
               <div>
                 <dt className="text-xs font-semibold text-gray-500 uppercase mb-1">Accuracy</dt>
                 <dd className="text-sm text-gray-900 font-medium">{service.accuracy}</dd>
               </div>
               <div>
                 <dt className="text-xs font-semibold text-gray-500 uppercase mb-1">Complexity</dt>
                 <dd className="text-sm text-gray-900 font-medium">{service.complexity}</dd>
               </div>
               {"updateFrequency" in service && service.updateFrequency && (
                 <div>
                   <dt className="text-xs font-semibold text-gray-500 uppercase mb-1">Update Frequency</dt>
                   <dd className="text-sm text-gray-900 font-medium">{service.updateFrequency}</dd>
                 </div>
               )}
               {"assessmentFrequency" in service && (
                 <div>
                   <dt className="text-xs font-semibold text-gray-500 uppercase mb-1">Assessment Frequency</dt>
                   <dd className="text-sm text-gray-900 font-medium">{(service as DigitalMaturityService).assessmentFrequency}</dd>
                 </div>
               )}
             </div>

             {/* CTA Button */}
             <button
               onClick={handleAccessClick}
               className="bg-orange-600 text-white hover:bg-orange-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
             >
               <BarChart3 className="w-5 h-5" />
               View Analytics
             </button>
           </div>
 
           {/* Content Tabs */}
           <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
             {/* Tab Navigation */}
             <div className="border-b border-gray-200 overflow-x-auto">
               <div className="flex" role="tablist">
                 {CONTENT_TABS.map((tab) => {
                   const isActive = activeTab === tab.key;
                   return (
                     <button
                       key={tab.key}
                       role="tab"
                       aria-selected={isActive}
                       onClick={() => setActiveTab(tab.key)}
                       className={`px-4 md:px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                         isActive
                           ? "border-b-2 border-purple-600 text-purple-600 bg-purple-50"
                           : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                       }`}
                     >
                       {tab.icon}
                       <span className="hidden sm:inline">{tab.label}</span>
                       <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                     </button>
                   );
                 })}
               </div>
             </div>
 
             {/* Tab Content */}
             <div className="p-6 lg:p-8">
               {renderActiveTabContent()}
             </div>
           </div>
         </div>
       </main>
 
       {/* Login Modal */}
       <LoginModal
         isOpen={showLoginModal}
         onClose={() => setShowLoginModal(false)}
         context={{
           marketplace: "digital-intelligence",
           tab: tab || "systems-portfolio",
           cardId: service.id,
           serviceName: service.title,
           action: "Request Dashboard",
         }}
       />
 
       <Footer />
     </div>
   );
 }