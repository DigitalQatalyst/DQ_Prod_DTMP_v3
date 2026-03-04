import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
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
  Award,
  Activity,
  Shield
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoginModal } from "@/components/learningCenter/LoginModal";
import { allPortfolioServices } from "@/data/portfolio";
import { DynamicHealthDashboard } from "@/components/portfolio/DynamicHealthDashboard";
import { ComplianceAlerts } from "@/components/portfolio/ComplianceAlerts";
import { DependencyVisualization } from "@/components/portfolio/DependencyVisualization";
import { RequestCardsSection } from "@/components/portfolio/RequestCardsSection";
import { RequestFormModal } from "@/components/portfolio/RequestFormModal";
import { RequestCard, RequestFormData } from "@/types/requests";
import { addRequest } from "@/data/requests/mockRequests";
import { useAuth } from "@/contexts/AuthContext";

type DetailTab = "about" | "methodology" | "deliverables" | "getting-started";

const complexityColors: Record<string, string> = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-blue-100 text-blue-700", 
  High: "bg-purple-100 text-purple-700",
};

const PortfolioDetailPage = () => {
  const { tab, cardId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<DetailTab>("about");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequestCard, setSelectedRequestCard] = useState<RequestCard | null>(null);
  const [pendingRequestData, setPendingRequestData] = useState<RequestFormData | null>(null);

  // Check if we should show insights view
  const showInsights = searchParams.get('view') === 'insights';

  // Auto-submit request after login
  useEffect(() => {
    if (isAuthenticated && pendingRequestData) {
      submitRequest(pendingRequestData);
      setPendingRequestData(null);
    }
  }, [isAuthenticated, pendingRequestData]);

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

  const handleRequestClick = (card: RequestCard) => {
    setSelectedRequestCard(card);
    setShowRequestModal(true);
  };

  const submitRequest = (formData: RequestFormData) => {
    const request = addRequest({
      ...formData,
      userId: user?.id || 'user-123',
      userName: user?.name || 'John Doe',
      userEmail: user?.email || 'john.doe@company.com'
    });

    // Close modal
    setShowRequestModal(false);
    setSelectedRequestCard(null);

    // Show success message (TODO: Add toast notification)
    console.log('Request submitted:', request);

    // Navigate to Stage 2 -> Portfolio My Requests
    navigate('/stage2/portfolio-management', {
      state: {
        marketplace: 'portfolio-management',
        tab: 'my-requests',
        cardId: request.serviceId,
        serviceName: request.serviceName,
        action: 'request-service',
        submittedRequestId: request.id,
      },
    });
  };

  const handleRequestSubmit = (formData: RequestFormData) => {
    submitRequest(formData);
  };

  const handleAuthRequired = (formData: RequestFormData) => {
    // Store form data
    setPendingRequestData(formData);
    
    // Close request modal
    setShowRequestModal(false);
    
    // Show login modal
    setShowLoginModal(true);
  };

  // If showing insights, render dashboard view
  if (showInsights) {
    // Determine which dashboard to show based on service ID
    const isDashboardService = [
      'application-health-dashboard',
      'application-risk-compliance', 
      'application-dependencies',
      'project-health-dashboard',
      'project-risk-compliance',
      'project-dependencies'
    ].includes(cardId);

    // For dedicated dashboard services, show only their specific dashboard
    if (isDashboardService) {
      const isHealth = cardId.includes('health');
      const isRisk = cardId.includes('risk') || cardId.includes('compliance');
      const isDeps = cardId.includes('dependencies');
      const isApplication = tab === 'application-portfolio';

      return (
        <div className="min-h-screen bg-background">
          <Header />
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <nav className="flex items-center text-sm text-muted-foreground flex-wrap">
                <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4 mx-2" />
                <Link to="/marketplaces" className="hover:text-foreground transition-colors">Marketplaces</Link>
                <ChevronRight className="w-4 h-4 mx-2" />
                <Link to="/marketplaces/portfolio-management" className="hover:text-foreground transition-colors">Portfolio Management</Link>
                <ChevronRight className="w-4 h-4 mx-2" />
                <Link to={`/marketplaces/portfolio-management?tab=${tab}`} className="hover:text-foreground transition-colors">{tabDisplayName}</Link>
                <ChevronRight className="w-4 h-4 mx-2" />
                <Link to={`/marketplaces/portfolio-management/${tab}/${cardId}`} className="hover:text-foreground transition-colors">{service.title}</Link>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="font-medium text-foreground">Dashboard</span>
              </nav>
            </div>
          </div>
          <section className="bg-white border-b border-gray-200 py-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-primary-navy mb-2">{service.title}</h1>
                  <p className="text-gray-600">Live dashboard and real-time monitoring</p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => navigate(`/marketplaces/portfolio-management/${tab}/${cardId}`)} variant="outline">Back to Details</Button>
                  <Button onClick={handleEnroll} className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Access Service
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge className="bg-blue-100 text-blue-700 border-0">{service.category}</Badge>
                <Badge className="bg-purple-100 text-purple-700 border-0">{service.scope || service.portfolioType}</Badge>
                {service.realtime && <Badge className="bg-orange-100 text-orange-700 border-0 flex items-center gap-1"><Zap className="w-3 h-3" />Real-time</Badge>}
              </div>
            </div>
          </section>
          <div className="max-w-7xl mx-auto px-4 py-8">
            {isHealth && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><Activity className="w-5 h-5 text-green-600" /></div>
                    <div><h2 className="text-xl font-semibold text-gray-900">{isApplication ? 'Application' : 'Project'} Health Metrics</h2><p className="text-sm text-gray-600">Real-time health monitoring and performance indicators</p></div>
                  </div>
                </div>
                <div className="p-6"><DynamicHealthDashboard context={isApplication ? 'application' : 'project'} /></div>
              </div>
            )}
            {isRisk && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><Shield className="w-5 h-5 text-red-600" /></div>
                    <div><h2 className="text-xl font-semibold text-gray-900">{isApplication ? 'Application' : 'Project'} Risk & Compliance</h2><p className="text-sm text-gray-600">Security vulnerabilities, compliance status, and risk alerts</p></div>
                  </div>
                </div>
                <div className="p-6"><ComplianceAlerts context={isApplication ? 'application' : 'project'} /></div>
              </div>
            )}
            {isDeps && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><TrendingUp className="w-5 h-5 text-blue-600" /></div>
                    <div><h2 className="text-xl font-semibold text-gray-900">{isApplication ? 'Application' : 'Project'} Dependencies</h2><p className="text-sm text-gray-600">Dependency mapping and relationship analysis</p></div>
                  </div>
                </div>
                <div className="p-6"><DependencyVisualization context={isApplication ? 'application' : 'project'} /></div>
              </div>
            )}
            <div className="mt-8 bg-gradient-to-br from-orange-50 to-blue-50 rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{service.keyMetrics.map((m, i) => <div key={i} className="bg-white rounded-lg p-4 border border-gray-200"><p className="text-sm text-gray-600 mb-1">{m}</p><p className="text-2xl font-bold text-gray-900">--</p><p className="text-xs text-gray-500 mt-1">Live data</p></div>)}</div>
            </div>
          </div>
          
          {/* Request Cards Section */}
          <RequestCardsSection 
            serviceId={cardId}
            onRequestClick={handleRequestClick}
          />
          
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
    }

    // For other services, show service-specific insights
    const getServiceDashboards = () => {
      // Service-specific configurations
      const configs: Record<string, any> = {
        "license-compliance-tracking": {
          health: { title: "License Utilization Metrics", metrics: [
            { label: "Compliance Rate", value: "94%", color: "green" },
            { label: "License Utilization", value: "78%", color: "blue" },
            { label: "Unused Licenses", value: "156", color: "orange" },
            { label: "Cost Savings", value: "$340K", color: "purple" }
          ]},
          risk: { title: "Compliance Risks & Alerts", alerts: [
            { severity: "high", title: "6 Licenses Expiring Soon", desc: "Microsoft Office 365 licenses expire in 30 days" },
            { severity: "medium", title: "Over-allocated Licenses", desc: "23 Adobe Creative Cloud licenses not in use" }
          ]},
          deps: { title: "License Dependencies", items: [
            { name: "Microsoft 365", type: "Enterprise License", status: "Active" },
            { name: "Adobe Creative Cloud", type: "Team License", status: "Over-provisioned" }
          ]}
        },
        "application-rationalization": {
          health: { title: "Rationalization Metrics", metrics: [
            { label: "Redundant Apps", value: "23", color: "red" },
            { label: "Consolidation Opportunities", value: "12", color: "orange" },
            { label: "Potential Savings", value: "$1.2M", color: "green" },
            { label: "Rationalization Score", value: "78%", color: "blue" }
          ]},
          risk: { title: "Rationalization Risks", alerts: [
            { severity: "high", title: "Business Process Impact", desc: "3 critical apps have no documented replacement" },
            { severity: "medium", title: "Data Migration Risk", desc: "Legacy CRM contains 10 years of historical data" }
          ]},
          deps: { title: "Application Dependencies", items: [
            { name: "Legacy CRM", type: "Retirement Candidate", status: "Has Dependencies" },
            { name: "Old Reporting Tool", type: "Retirement Candidate", status: "Replaced" }
          ]}
        },
        "tco-optimization": {
          health: { title: "TCO Analysis", metrics: [
            { label: "Total TCO", value: "$42.3M", color: "blue" },
            { label: "Cost per App", value: "$171K", color: "green" },
            { label: "License Savings", value: "$3.2M", color: "purple" },
            { label: "Cloud Savings", value: "$1.8M", color: "orange" }
          ]},
          risk: { title: "Cost Risks & Overruns", alerts: [
            { severity: "high", title: "Budget Overrun Alert", desc: "Infrastructure costs 15% over budget this quarter" },
            { severity: "medium", title: "License Waste", desc: "$450K in unused software licenses identified" }
          ]},
          deps: { title: "Cost Dependencies", items: [
            { name: "Software Licenses", type: "44% of TCO", status: "$18.5M" },
            { name: "Infrastructure", type: "29% of TCO", status: "$12.3M" }
          ]}
        },
        "technical-debt-assessment": {
          health: { title: "Technical Debt Metrics", metrics: [
            { label: "High Debt Apps", value: "34", color: "red" },
            { label: "Remediation Cost", value: "$4.2M", color: "orange" },
            { label: "Avg Debt Score", value: "62%", color: "yellow" },
            { label: "Critical Issues", value: "127", color: "purple" }
          ]},
          risk: { title: "Technical Debt Risks", alerts: [
            { severity: "high", title: "Security Vulnerabilities", desc: "18 apps running on unsupported frameworks" },
            { severity: "medium", title: "Performance Degradation", desc: "Legacy code causing 40% slower response times" }
          ]},
          deps: { title: "Technical Dependencies", items: [
            { name: "Legacy .NET Framework", type: "End of Life 2024", status: "High Risk" },
            { name: "Outdated Java Libraries", type: "Security Risk", status: "Needs Update" }
          ]}
        },
        "portfolio-health-dashboard": {
          health: { title: "Portfolio Health Overview", metrics: [
            { label: "Health Score", value: "82%", color: "green" },
            { label: "At Risk Apps", value: "12", color: "orange" },
            { label: "Critical Issues", value: "3", color: "red" },
            { label: "Availability", value: "99.7%", color: "blue" }
          ]},
          risk: { title: "Portfolio Risks", alerts: [
            { severity: "high", title: "Critical System Outage", desc: "Payment processing system experienced downtime" },
            { severity: "medium", title: "Performance Issues", desc: "5 applications showing degraded performance" }
          ]},
          deps: { title: "Portfolio Dependencies", items: [
            { name: "Core ERP System", type: "Critical Dependency", status: "Healthy" },
            { name: "API Gateway", type: "Integration Hub", status: "Healthy" }
          ]}
        },
        "portfolio-dashboard": {
          health: { title: "Project Portfolio Health", metrics: [
            { label: "Active Projects", value: "23", color: "blue" },
            { label: "On-time Delivery", value: "82%", color: "green" },
            { label: "Budget Variance", value: "-2.3%", color: "green" },
            { label: "Resource Utilization", value: "78%", color: "orange" }
          ]},
          risk: { title: "Portfolio Risks", alerts: [
            { severity: "high", title: "3 Projects Behind Schedule", desc: "Critical path projects need immediate attention" },
            { severity: "medium", title: "Resource Conflicts", desc: "8 resources over-allocated across projects" }
          ]},
          deps: { title: "Project Dependencies", items: [
            { name: "Digital Transformation", type: "Strategic Initiative", status: "On Track" },
            { name: "Cloud Migration", type: "Infrastructure Project", status: "At Risk" }
          ]}
        },
        "project-health-tracking": {
          health: { title: "Project Health Indicators", metrics: [
            { label: "Healthy Projects", value: "15", color: "green" },
            { label: "At Risk", value: "6", color: "yellow" },
            { label: "Critical", value: "2", color: "red" },
            { label: "Avg Health Score", value: "76%", color: "blue" }
          ]},
          risk: { title: "Project Health Risks", alerts: [
            { severity: "high", title: "Schedule Slippage", desc: "2 projects delayed by more than 2 weeks" },
            { severity: "medium", title: "Quality Concerns", desc: "Defect rate above threshold in 3 projects" }
          ]},
          deps: { title: "Health Dependencies", items: [
            { name: "Resource Availability", type: "Critical Factor", status: "Constrained" },
            { name: "Stakeholder Engagement", type: "Success Factor", status: "Good" }
          ]}
        },
        "resource-capacity-planning": {
          health: { title: "Resource Capacity Metrics", metrics: [
            { label: "Total Resources", value: "156", color: "blue" },
            { label: "Utilization Rate", value: "78%", color: "green" },
            { label: "Skill Gaps", value: "23", color: "orange" },
            { label: "Conflicts", value: "12", color: "red" }
          ]},
          risk: { title: "Capacity Risks", alerts: [
            { severity: "high", title: "Critical Skill Shortage", desc: "No available cloud architects for Q3 projects" },
            { severity: "medium", title: "Over-allocation", desc: "8 senior developers allocated to multiple projects" }
          ]},
          deps: { title: "Resource Dependencies", items: [
            { name: "Cloud Architecture Team", type: "Shared Resource", status: "Over-allocated" },
            { name: "QA Team", type: "Shared Resource", status: "Available" }
          ]}
        },
        "budget-variance-analysis": {
          health: { title: "Budget Performance", metrics: [
            { label: "Total Budget", value: "$12.4M", color: "blue" },
            { label: "Spent", value: "$8.9M", color: "green" },
            { label: "Variance", value: "-$340K", color: "green" },
            { label: "Forecast Accuracy", value: "94%", color: "purple" }
          ]},
          risk: { title: "Budget Risks", alerts: [
            { severity: "high", title: "Budget Overrun Risk", desc: "2 projects trending 15% over budget" },
            { severity: "medium", title: "Scope Creep", desc: "Unplanned work adding $200K to costs" }
          ]},
          deps: { title: "Budget Dependencies", items: [
            { name: "Personnel Costs", type: "65% of Budget", status: "$8.1M" },
            { name: "Infrastructure", type: "20% of Budget", status: "$2.5M" }
          ]}
        }
      };

      // Return config or default
      return configs[cardId] || {
        health: { title: `${service.title} - Metrics`, metrics: service.keyMetrics.map((m, i) => ({ label: m, value: "--", color: ["blue","green","purple","orange"][i%4] }))},
        risk: { title: `${service.title} - Risks`, alerts: [{ severity: "medium", title: "Assessment Required", desc: `${service.title} requires detailed assessment` }]},
        deps: { title: `${service.title} - Dependencies`, items: [{ name: "Integration Point", type: "System", status: "Active" }]}
      };
    };

    const dash = getServiceDashboards();
    const colorMap = { green:"bg-green-50 border-green-200 text-green-900", blue:"bg-blue-50 border-blue-200 text-blue-900", purple:"bg-purple-50 border-purple-200 text-purple-900", orange:"bg-orange-50 border-orange-200 text-orange-900", red:"bg-red-50 border-red-200 text-red-900", yellow:"bg-yellow-50 border-yellow-200 text-yellow-900" };
    const sevMap = { high:"border-l-red-500 bg-red-50", medium:"border-l-orange-500 bg-orange-50", low:"border-l-yellow-500 bg-yellow-50" };

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex items-center text-sm text-muted-foreground flex-wrap">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <Link to="/marketplaces" className="hover:text-foreground transition-colors">Marketplaces</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <Link to="/marketplaces/portfolio-management" className="hover:text-foreground transition-colors">Portfolio Management</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <Link to={`/marketplaces/portfolio-management?tab=${tab}`} className="hover:text-foreground transition-colors">{tabDisplayName}</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <Link to={`/marketplaces/portfolio-management/${tab}/${cardId}`} className="hover:text-foreground transition-colors">{service.title}</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="font-medium text-foreground">Insights</span>
            </nav>
          </div>
        </div>
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-primary-navy mb-2">{service.title}</h1>
                <p className="text-gray-600">Real-time insights and analytics for this service</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => navigate(`/marketplaces/portfolio-management/${tab}/${cardId}`)} variant="outline">Back to Details</Button>
                <Button onClick={handleEnroll} className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Access Service
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge className="bg-blue-100 text-blue-700 border-0">{service.category}</Badge>
              <Badge className="bg-purple-100 text-purple-700 border-0">{service.scope || service.portfolioType}</Badge>
              <Badge className="bg-green-100 text-green-700 border-0">{service.analysisType || service.projectPhase}</Badge>
              {service.realtime && <Badge className="bg-orange-100 text-orange-700 border-0 flex items-center gap-1"><Zap className="w-3 h-3" />Real-time</Badge>}
            </div>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><Activity className="w-5 h-5 text-green-600" /></div>
                <div><h2 className="text-xl font-semibold text-gray-900">{dash.health.title}</h2><p className="text-sm text-gray-600">Performance and health indicators</p></div>
              </div>
            </div>
            <div className="p-6"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{dash.health.metrics.map((m:any, i:number) => <div key={i} className={`${colorMap[m.color as keyof typeof colorMap].split(' ')[0]} ${colorMap[m.color as keyof typeof colorMap].split(' ')[1]} rounded-lg p-4 border`}><p className="text-sm text-gray-600 mb-1">{m.label}</p><p className={`text-2xl font-bold ${colorMap[m.color as keyof typeof colorMap].split(' ')[2]}`}>{m.value}</p></div>)}</div></div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><Shield className="w-5 h-5 text-red-600" /></div>
                <div><h2 className="text-xl font-semibold text-gray-900">{dash.risk.title}</h2><p className="text-sm text-gray-600">Risk factors and compliance alerts</p></div>
              </div>
            </div>
            <div className="p-6 space-y-4">{dash.risk.alerts.map((a:any, i:number) => <div key={i} className={`border-l-4 ${sevMap[a.severity as keyof typeof sevMap]} p-4 rounded`}><h4 className="font-semibold text-gray-900 mb-1">{a.title}</h4><p className="text-sm text-gray-700">{a.desc}</p></div>)}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><TrendingUp className="w-5 h-5 text-blue-600" /></div>
                <div><h2 className="text-xl font-semibold text-gray-900">{dash.deps.title}</h2><p className="text-sm text-gray-600">Dependencies and relationships</p></div>
              </div>
            </div>
            <div className="p-6"><div className="space-y-3">{dash.deps.items.map((d:any, i:number) => <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"><div><p className="font-medium text-gray-900">{d.name}</p><p className="text-sm text-gray-600">{d.type}</p></div><Badge className="bg-blue-100 text-blue-700 border-0">{d.status}</Badge></div>)}</div></div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics for {service.title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{service.keyMetrics.map((m, i) => <div key={i} className="bg-white rounded-lg p-4 border border-gray-200"><p className="text-sm text-gray-600 mb-1">{m}</p><p className="text-2xl font-bold text-gray-900">--</p><p className="text-xs text-gray-500 mt-1">Live data</p></div>)}</div>
          </div>
        </div>
        
        {/* Request Cards Section */}
        <RequestCardsSection 
          serviceId={cardId}
          onRequestClick={handleRequestClick}
        />
        
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
  }

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
                onClick={() => navigate(`/marketplaces/portfolio-management/${tab}/${cardId}?view=insights`)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold transition-all hover:shadow-xl flex items-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                Explore Insights
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
                  onClick={() => navigate(`/marketplaces/portfolio-management/${tab}/${cardId}?view=insights`)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold transition-all hover:shadow-xl"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Explore Insights
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
        onLoginSuccess={() => {
          if (pendingRequestData) {
            submitRequest(pendingRequestData);
            setPendingRequestData(null);
            return;
          }
          navigate('/stage2/portfolio-management', {
            state: {
              marketplace: 'portfolio-management',
              tab: 'overview',
              cardId,
              serviceName: service.title,
            },
          });
        }}
      />

      {/* Request Form Modal */}
      <RequestFormModal
        isOpen={showRequestModal}
        onClose={() => {
          setShowRequestModal(false);
          setSelectedRequestCard(null);
        }}
        card={selectedRequestCard}
        serviceName={service.title}
        onSubmit={handleRequestSubmit}
        onAuthRequired={handleAuthRequired}
      />
    </div>
  );
};

export default PortfolioDetailPage;
