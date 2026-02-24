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
import { allLifecycleServices } from "@/data/lifecycle";

type DetailTab = "about" | "methodology" | "deliverables" | "getting-started";

const complexityColors: Record<string, string> = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-blue-100 text-blue-700", 
  High: "bg-purple-100 text-purple-700",
};

const LifecycleDetailPage = () => {
  const { tab, cardId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DetailTab>("about");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const service = allLifecycleServices.find(s => s.id === cardId && s.tab === tab);

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested lifecycle service could not be found.</p>
          <Button onClick={() => navigate('/marketplaces/lifecycle-management')}>
            Back to Lifecycle Management
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const tabDisplayName = tab === 'project-lifecycle' ? 'Project Lifecycle' : tab === 'product-lifecycle' ? 'Product Lifecycle' : 'Application Lifecycle';

  const handleEnroll = () => {
    setShowLoginModal(true);
  };

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
            <Link to="/marketplaces/lifecycle-management" className="hover:text-foreground transition-colors">Lifecycle Management</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to={`/marketplaces/lifecycle-management?tab=${tab}`} className="hover:text-foreground transition-colors">{tabDisplayName}</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground line-clamp-1">{service.title}</span>
          </nav>
        </div>
      </div>

      <section className="bg-white border-b border-gray-200 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-4">{service.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-blue-100 text-blue-700 border-0">{tabDisplayName}</Badge>
                <Badge className="bg-purple-100 text-purple-700 border-0">{service.category}</Badge>
                <Badge className={`${complexityColors[service.complexity]} border-0`}>{service.complexity}</Badge>
                {service.realtime && (
                  <Badge className="bg-green-100 text-green-700 border-0 flex items-center gap-1">
                    <Zap className="w-3 h-3" />Real-time
                  </Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl">{service.description}</p>
            </div>
            <div className="flex-shrink-0">
              <Button onClick={handleEnroll} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold transition-all hover:shadow-xl flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />Access Service
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DetailTab)} className="w-full">
        <div className="bg-white border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto">
            <TabsList className="h-auto bg-transparent p-0 gap-1 overflow-x-auto flex justify-start px-4 lg:px-8">
              {["about", "methodology", "deliverables", "getting-started"].map((tabName) => (
                <TabsTrigger key={tabName} value={tabName} className="px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy data-[state=active]:shadow-none bg-transparent capitalize">
                  {tabName.replace("-", " ")}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <TabsContent value="about" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Service Overview</h2>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {service.description} This comprehensive service provides strategic lifecycle management frameworks and governance workflows for managing your {tab?.includes('project') ? 'projects' : tab?.includes('product') ? 'products' : 'applications'} from concept through completion.
                    </p>
                  </div>
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
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Service Highlights</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Stage-gate approval workflows</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Pre-built templates and checklists</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Compliance tracking and audit trails</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Integration with Portfolio Management</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="methodology" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Lifecycle Methodology</h2>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Our proven {service.methodology} methodology provides structured governance and stage-gate processes.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-xs font-semibold text-orange-600 uppercase">Phase 1</span>
                          <h4 className="text-lg font-semibold text-foreground">Initiation & Planning</h4>
                        </div>
                        <span className="text-sm text-muted-foreground">Week 1-2</span>
                      </div>
                      <p className="text-muted-foreground">Define scope, objectives, and create detailed plans with stakeholder alignment.</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-xs font-semibold text-orange-600 uppercase">Phase 2</span>
                          <h4 className="text-lg font-semibold text-foreground">Execution & Monitoring</h4>
                        </div>
                        <span className="text-sm text-muted-foreground">Ongoing</span>
                      </div>
                      <p className="text-muted-foreground">Execute deliverables with continuous monitoring and stage-gate approvals.</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-xs font-semibold text-orange-600 uppercase">Phase 3</span>
                          <h4 className="text-lg font-semibold text-foreground">Closure & Review</h4>
                        </div>
                        <span className="text-sm text-muted-foreground">Final Week</span>
                      </div>
                      <p className="text-muted-foreground">Complete final reviews, document lessons learned, and archive deliverables.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="deliverables" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Service Deliverables</h2>
                    <p className="text-base text-muted-foreground leading-relaxed">Comprehensive deliverables for lifecycle governance.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-foreground">Lifecycle Dashboard</h3>
                      </div>
                      <p className="text-muted-foreground mb-4">Real-time tracking of progress, gates, and approvals.</p>
                      <Badge className="bg-blue-100 text-blue-700 border-0">Interactive</Badge>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-foreground">Templates Library</h3>
                      </div>
                      <p className="text-muted-foreground mb-4">Pre-built templates for all lifecycle stages.</p>
                      <Badge className="bg-green-100 text-green-700 border-0">Templates</Badge>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-foreground">Approval Workflows</h3>
                      </div>
                      <p className="text-muted-foreground mb-4">Multi-level approval routing and tracking.</p>
                      <Badge className="bg-purple-100 text-purple-700 border-0">Workflow</Badge>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="font-semibold text-foreground">Compliance Reports</h3>
                      </div>
                      <p className="text-muted-foreground mb-4">Audit trails and compliance documentation.</p>
                      <Badge className="bg-orange-100 text-orange-700 border-0">Reports</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="getting-started" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Getting Started</h2>
                    <p className="text-base text-muted-foreground leading-relaxed">Ready to implement lifecycle governance? Here's what you need.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Prerequisites</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Executive sponsorship and governance commitment</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Stakeholder availability for approvals</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Integration with existing systems</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Get Started?</h3>
                    <p className="text-muted-foreground mb-4">Our lifecycle management experts are available to help.</p>
                    <Button onClick={handleEnroll} className="bg-blue-600 hover:bg-blue-700 text-white">Access Service Now</Button>
                  </div>
                </div>
              </TabsContent>
            </div>

            <aside className="lg:w-96 flex-shrink-0">
              <div className="lg:sticky lg:top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-foreground mb-6">Service Details</h3>
                <table className="w-full mb-6">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Methodology</td>
                      <td className="text-sm font-medium text-foreground py-3">{service.methodology}</td>
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
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h4 className="text-base font-semibold text-foreground mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    {["Lifecycle templates", "Stage-gate workflows", "Approval tracking", "Compliance reports", "Integration support", "Expert consultation"].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-600" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button onClick={handleEnroll} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold transition-all hover:shadow-xl">
                  <ExternalLink className="w-5 h-5 mr-2" />Access Service
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </Tabs>
      
      <Footer />
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        context={{
          marketplace: "lifecycle-management",
          tab: tab || "",
          cardId: cardId || "",
          serviceName: service.title,
          action: "access service"
        }}
      />
    </div>
  );
};

export default LifecycleDetailPage;
