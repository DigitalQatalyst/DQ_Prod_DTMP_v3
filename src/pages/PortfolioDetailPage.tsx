import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ChevronRight, 
  Clock, 
  Target, 
  Zap, 
  CheckCircle, 
  ExternalLink,
  BarChart3,
  TrendingUp,
  Users,
  Award
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoginModal } from "@/components/learningCenter/LoginModal";
import { allPortfolioServices } from "@/data/portfolio";

type DetailTab = "about" | "methodology" | "deliverables" | "getting-started";

const complexityColors: Record<string, string> = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-blue-100 text-blue-700", 
  High: "bg-purple-100 text-purple-700",
};

const PortfolioDetailPage = () => {
  const { tab, cardId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DetailTab>("about");
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Find the service
  const service = allPortfolioServices.find(s => s.id === cardId && s.tab === tab);

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested portfolio service could not be found.</p>
          <Button onClick={() => navigate('/marketplaces/portfolio-management')}>
            Back to Portfolio Management
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const tabDisplayName = tab === 'application-portfolio' ? 'Application Portfolio' : 'Project Portfolio';

  const handleEnroll = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-muted-foreground flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces" className="hover:text-foreground transition-colors">
              Marketplaces
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces/portfolio-management" className="hover:text-foreground transition-colors">
              Portfolio Management
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to={`/marketplaces/portfolio-management?tab=${tab}`} className="hover:text-foreground transition-colors">
              {tabDisplayName}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground line-clamp-1">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Detail Header */}
      <section className="bg-white border-b border-gray-200 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-4">{service.title}</h1>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-blue-100 text-blue-700 border-0">{tabDisplayName}</Badge>
                <Badge className="bg-purple-100 text-purple-700 border-0">{service.category}</Badge>
                <Badge className={`${complexityColors[service.complexity]} border-0`}>
                  {service.complexity}
                </Badge>
                {service.realtime && (
                  <Badge className="bg-green-100 text-green-700 border-0 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Real-time
                  </Badge>
                )}
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl">
                {service.description}
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex-shrink-0">
              <Button
                onClick={handleEnroll}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold transition-all hover:shadow-xl flex items-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                Access Service
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DetailTab)} className="w-full">
        <div className="bg-white border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto">
            <TabsList className="h-auto bg-transparent p-0 gap-1 overflow-x-auto flex justify-start px-4 lg:px-8">
              {["about", "methodology", "deliverables", "getting-started"].map((tabName) => (
                <TabsTrigger
                  key={tabName}
                  value={tabName}
                  className="px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy data-[state=active]:shadow-none bg-transparent capitalize"
                >
                  {tabName.replace("-", " ")}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Tab Content */}
            <div className="flex-1 min-w-0">
              <TabsContent value="about" className="mt-0">
                <div className="space-y-8">
                  {/* Introduction */}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Service Overview</h2>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {service.description} This comprehensive service provides strategic insights and actionable 
                      recommendations for optimizing your {tab === 'application-portfolio' ? 'application' : 'project'} portfolio 
                      through data-driven analysis and industry best practices.
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Key Metrics & Insights</h3>
                    <ul className="space-y-3">
                      {service.keyMetrics.map((metric, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{metric}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Service Highlights */}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Service Highlights</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Comprehensive portfolio assessment and analysis</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Real-time dashboards and reporting capabilities</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Strategic recommendations and roadmap development</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Industry best practices and benchmarking</span>
                      </li>
                    </ul>
                  </div>

                  {/* What You'll Get */}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">What You'll Get</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Executive-level portfolio health dashboard</li>
                      <li>Detailed analysis report with actionable insights</li>
                      <li>Strategic recommendations prioritized by impact</li>
                      <li>Implementation roadmap with timelines</li>
                      <li>Cost optimization opportunities identification</li>
                      <li>Risk assessment and mitigation strategies</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="methodology" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Analysis Methodology</h2>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Our proven methodology combines industry best practices with advanced analytics to deliver 
                      actionable insights for portfolio optimization.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-xs font-semibold text-orange-600 uppercase">Phase 1</span>
                          <h4 className="text-lg font-semibold text-foreground">Data Collection & Analysis</h4>
                        </div>
                        <span className="text-sm text-muted-foreground">Week 1</span>
                      </div>
                      <p className="text-muted-foreground">
                        Comprehensive data gathering from multiple sources including CMDB, financial systems, 
                        and stakeholder input to ensure complete portfolio visibility.
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-xs font-semibold text-orange-600 uppercase">Phase 2</span>
                          <h4 className="text-lg font-semibold text-foreground">Assessment Framework</h4>
                        </div>
                        <span className="text-sm text-muted-foreground">Weeks 2-3</span>
                      </div>
                      <p className="text-muted-foreground">
                        Multi-dimensional evaluation framework assessing business value, technical health, 
                        cost efficiency, and strategic alignment.
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-xs font-semibold text-orange-600 uppercase">Phase 3</span>
                          <h4 className="text-lg font-semibold text-foreground">Recommendations & Roadmap</h4>
                        </div>
                        <span className="text-sm text-muted-foreground">Week 4</span>
                      </div>
                      <p className="text-muted-foreground">
                        Prioritized recommendations with detailed implementation roadmap and business case 
                        for portfolio optimization initiatives.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="deliverables" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Service Deliverables</h2>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Comprehensive set of deliverables designed to provide immediate value and long-term strategic guidance.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-foreground">Executive Dashboard</h3>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Real-time portfolio health dashboard with key performance indicators and trend analysis.
                      </p>
                      <Badge className="bg-blue-100 text-blue-700 border-0">Interactive</Badge>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-foreground">Analysis Report</h3>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Comprehensive analysis with findings, recommendations, and implementation roadmap.
                      </p>
                      <Badge className="bg-green-100 text-green-700 border-0">PDF Report</Badge>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-foreground">Data Templates</h3>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Raw data exports and customizable templates for ongoing portfolio management.
                      </p>
                      <Badge className="bg-purple-100 text-purple-700 border-0">Excel</Badge>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="font-semibold text-foreground">Implementation Guide</h3>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Step-by-step implementation guide with best practices and success metrics.
                      </p>
                      <Badge className="bg-orange-100 text-orange-700 border-0">Guide</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="getting-started" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Getting Started</h2>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Ready to optimize your portfolio? Here's what you need to know to get started with this service.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Prerequisites</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Access to portfolio data and systems</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Stakeholder availability for interviews and validation</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Executive sponsorship and commitment to act on findings</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Get Started?</h3>
                    <p className="text-muted-foreground mb-4">
                      Our portfolio management experts are available to help you get the most out of this service.
                    </p>
                    <Button 
                      onClick={handleEnroll}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Access Service Now
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>

            {/* Right Sidebar */}
            <aside className="lg:w-96 flex-shrink-0">
              <div className="lg:sticky lg:top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-foreground mb-6">Service Details</h3>

                {/* Details Table */}
                <table className="w-full mb-6">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Delivery Model</td>
                      <td className="text-sm font-medium text-foreground py-3">{service.deliveryModel}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Update Frequency</td>
                      <td className="text-sm font-medium text-foreground py-3">{service.updateFrequency}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Complexity</td>
                      <td className="text-sm font-medium text-foreground py-3">{service.complexity}</td>
                    </tr>
                    <tr>
                      <td className="text-sm text-muted-foreground py-3 pr-4">Category</td>
                      <td className="text-sm font-medium text-foreground py-3">{service.category}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Inclusions */}
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h4 className="text-base font-semibold text-foreground mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    {[
                      "Executive dashboard access",
                      "Detailed analysis report",
                      "Strategic recommendations",
                      "Implementation roadmap",
                      "Data export templates",
                      "Expert consultation"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={handleEnroll}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold transition-all hover:shadow-xl"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Access Service
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </Tabs>
      
      <Footer />
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        context={{
          marketplace: "portfolio-management",
          tab: tab || "",
          cardId: cardId || "",
          serviceName: service.title,
          action: "access service"
        }}
      />
    </div>
  );
};

export default PortfolioDetailPage;