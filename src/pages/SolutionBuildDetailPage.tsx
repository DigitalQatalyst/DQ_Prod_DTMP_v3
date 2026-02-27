import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  Clock,
  Wrench,
  CheckCircle,
  FileX,
  TrendingUp,
  ArrowLeft,
  Check,
} from "lucide-react";
import { preBuiltSolutions } from "@/data/solutionBuild";
import type { SolutionType as BuildSolutionType, BuildPriority } from "@/data/solutionBuild";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/learningCenter/LoginModal";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DetailTab = "overview" | "features" | "requirements" | "customization";

const getSolutionTypeColor = (type: BuildSolutionType) => {
  const colors: Record<BuildSolutionType, string> = {
    DBP: "bg-blue-100 text-blue-800",
    DIA: "bg-purple-100 text-purple-800",
    DXP: "bg-green-100 text-green-800",
    SDO: "bg-orange-100 text-orange-800",
    DWS: "bg-pink-100 text-pink-800",
  };
  return colors[type];
};

export function SolutionBuildDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    department: '',
    priority: '' as BuildPriority | '',
    customizations: [] as string[],
    additionalRequirements: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const solution = preBuiltSolutions.find((s) => s.id === id);

  if (!solution) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16" id="main-content">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileX className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Solution Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The solution you are looking for does not exist or may have been moved.
            </p>
            <Button
              onClick={() => navigate("/marketplaces/solution-build")}
              className="inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Solution Build
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedSolutions = preBuiltSolutions
    .filter((s) => s.category === solution.category && s.id !== solution.id)
    .slice(0, 3);

  const handleRequestAccess = () => {
    if (isLoggedIn) {
      setShowRequestForm(true);
    } else {
      setShowLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setIsLoggedIn(true);
    setShowRequestForm(true);
  };

  const handleSubmitRequest = () => {
    const errors: Record<string, string> = {};
    if (!formData.department) errors.department = 'Required';
    if (!formData.priority) errors.priority = 'Required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Store the request in localStorage
    const newRequest = {
      id: `BLD-2026-${String(Date.now()).slice(-3)}`,
      type: 'pre-built' as const,
      status: 'intake' as const,
      priority: formData.priority,
      name: solution.name,
      businessNeed: `Pre-built solution request: ${solution.name}${formData.additionalRequirements ? '. Additional requirements: ' + formData.additionalRequirements : ''}`,
      requestedBy: 'Current User',
      sponsor: 'N/A',
      department: formData.department,
      submittedAt: new Date().toISOString(),
      progress: 0,
      budget: { approved: 0, spent: 0 },
      requirements: [],
      phases: [
        { id: '1', name: 'Discovery', status: 'not-started' as const, progress: 0, tasks: [] },
        { id: '2', name: 'Design', status: 'not-started' as const, progress: 0, tasks: [] },
        { id: '3', name: 'Development', status: 'not-started' as const, progress: 0, tasks: [] },
        { id: '4', name: 'Testing', status: 'not-started' as const, progress: 0, tasks: [] },
        { id: '5', name: 'Deployment', status: 'not-started' as const, progress: 0, tasks: [] },
      ],
      blockers: [],
      deliverables: [],
      documents: [],
      messages: [],
      customizations: formData.customizations,
      additionalRequirements: formData.additionalRequirements,
      solutionId: solution.id,
    };
    
    const existingRequests = JSON.parse(localStorage.getItem('buildRequests') || '[]');
    const updatedRequests = [newRequest, ...existingRequests];
    localStorage.setItem('buildRequests', JSON.stringify(updatedRequests));
    
    // Dispatch custom event to notify Stage2 page to refresh
    window.dispatchEvent(new CustomEvent('buildRequestAdded', { detail: newRequest }));
    
    navigate('/stage2', { state: { marketplace: 'solution-build', autoSelectMyRequests: true } });
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
            <Link to="/marketplaces/solution-build" className="hover:text-foreground transition-colors">
              Solution Build
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground line-clamp-1">{solution.name}</span>
          </nav>
        </div>
      </div>

      {/* Detail Header */}
      <section className="bg-white border-b border-gray-200 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-4">{solution.name}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={getSolutionTypeColor(solution.category)}>{solution.category}</Badge>
            <Badge className="bg-blue-100 text-blue-700 border-0 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {solution.previousDeployments} Deployments
            </Badge>
          </div>
          <p className="text-base lg:text-lg text-muted-foreground max-w-3xl">
            {solution.description}
          </p>
        </div>
      </section>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DetailTab)} className="w-full">
        <div className="bg-white border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto">
            <TabsList className="h-auto bg-transparent p-0 gap-1 overflow-x-auto flex justify-start px-4 lg:px-8">
              {["overview", "features", "requirements", "customization"].map((tabName) => (
                <TabsTrigger
                  key={tabName}
                  value={tabName}
                  className="px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy data-[state=active]:shadow-none bg-transparent capitalize"
                >
                  {tabName}
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
              <TabsContent value="overview" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Solution Overview</h2>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {solution.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Key Deliverables</h3>
                    <ul className="space-y-3">
                      {solution.deliverables.map((deliverable, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Solution Features</h2>
                    <div className="grid gap-4">
                      {solution.deliverables.map((feature, idx) => (
                        <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-foreground">{feature}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="requirements" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Technical Requirements</h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      {solution.technicalRequirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="customization" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Customization Options</h2>
                    <p className="text-muted-foreground mb-4">
                      This solution can be customized to meet your specific needs:
                    </p>
                    <div className="grid gap-3">
                      {solution.customizationOptions.map((option, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <Wrench className="w-5 h-5 text-blue-700" />
                          <span className="text-foreground">{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>

            {/* Right Sidebar */}
            <aside className="lg:w-96 flex-shrink-0">
              <div className="lg:sticky lg:top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-foreground mb-6">Solution Details</h3>

                <table className="w-full mb-6">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Timeline</td>
                      <td className="text-sm font-medium text-foreground py-3">{solution.timelineMin}-{solution.timelineMax} weeks</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Complexity</td>
                      <td className="text-sm font-medium text-foreground py-3">
                        {solution.customizationOptions.length > 3 ? 'High' : solution.customizationOptions.length > 1 ? 'Medium' : 'Low'}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Deployments</td>
                      <td className="text-sm font-medium text-foreground py-3">{solution.previousDeployments}</td>
                    </tr>
                    <tr>
                      <td className="text-sm text-muted-foreground py-3 pr-4">Popularity</td>
                      <td className="text-sm font-medium text-foreground py-3">{solution.popularity}%</td>
                    </tr>
                  </tbody>
                </table>

                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h4 className="text-base font-semibold text-foreground mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    {solution.deliverables.slice(0, 4).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={handleRequestAccess}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold transition-all hover:shadow-xl"
                  disabled={showRequestForm}
                >
                  {showRequestForm ? 'Request Form Below' : 'Request Access'}
                </Button>

              </div>
            </aside>
          </div>

          {/* Request Form */}
          {showRequestForm && (
            <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Request This Solution</h2>
              <div className="space-y-4">
                <div>
                  <Label>Department *</Label>
                  <Select value={formData.department} onValueChange={(v) => { setFormData({...formData, department: v}); setFormErrors({...formErrors, department: ''}); }}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="Platform">Platform</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.department && <p className="text-sm text-red-600 mt-1">{formErrors.department}</p>}
                </div>

                <div>
                  <Label>Customization Options</Label>
                  <p className="text-sm text-gray-500 mb-2">Select any customizations you need:</p>
                  <div className="space-y-2">
                    {solution.customizationOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                        <Checkbox
                          id={option}
                          checked={formData.customizations.includes(option)}
                          onCheckedChange={(checked) => {
                            setFormData({
                              ...formData,
                              customizations: checked
                                ? [...formData.customizations, option]
                                : formData.customizations.filter(c => c !== option)
                            });
                          }}
                        />
                        <Label htmlFor={option} className="flex-1 cursor-pointer text-sm">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="additionalRequirements">Additional Requirements or Changes</Label>
                  <Textarea
                    id="additionalRequirements"
                    value={formData.additionalRequirements}
                    onChange={(e) => setFormData({...formData, additionalRequirements: e.target.value})}
                    placeholder="Describe any specific changes or additional requirements..."
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Priority *</Label>
                  <RadioGroup value={formData.priority} onValueChange={(v) => { setFormData({...formData, priority: v as BuildPriority}); setFormErrors({...formErrors, priority: ''}); }} className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="critical" id="critical" />
                      <Label htmlFor="critical" className="flex-1 cursor-pointer">
                        <div className="font-medium text-red-600">Critical</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high" className="flex-1 cursor-pointer">
                        <div className="font-medium text-orange-600">High</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="flex-1 cursor-pointer">
                        <div className="font-medium text-yellow-600">Medium</div>
                      </Label>
                    </div>
                  </RadioGroup>
                  {formErrors.priority && <p className="text-sm text-red-600 mt-1">{formErrors.priority}</p>}
                </div>

                <Button 
                  onClick={handleSubmitRequest} 
                  className="w-full" 
                  style={{ backgroundColor: '#16a34a', color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
                >
                  <Check className="w-4 h-4 mr-2" />Submit Request
                </Button>
              </div>
            </div>
          )}
        </div>
      </Tabs>

      {/* Related Solutions */}
      {relatedSolutions.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Solutions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedSolutions.map((related) => (
                <div
                  key={related.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/marketplaces/solution-build/${related.id}`)}
                >
                  <Badge className={getSolutionTypeColor(related.category)} >{related.category}</Badge>
                  <h3 className="text-lg font-semibold text-gray-900 mt-3 mb-2">{related.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{related.description}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {related.timelineMin}-{related.timelineMax} weeks
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        context={{
          marketplace: "solution-build",
          tab: "catalog",
          cardId: solution.id,
          serviceName: solution.name,
          action: "request-access",
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      <Footer />
    </div>
  );
}
