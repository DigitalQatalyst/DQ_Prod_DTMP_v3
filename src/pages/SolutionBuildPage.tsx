import { useState, useMemo } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ChevronRight, Clock, Wrench, Users, TrendingUp, ArrowLeft, CheckCircle2, Check, ArrowRight, CheckCircle, Search } from "lucide-react";
import { preBuiltSolutions, deliveryTeams } from "@/data/solutionBuild";
import { solutionBuildFilters } from "@/data/solutionBuild/filters";
import type { SolutionType as BuildSolutionType, BuildRequestType, BuildPriority } from "@/data/solutionBuild";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LoginModal } from "@/components/learningCenter/LoginModal";
import { FilterPanel, MobileFilterButton } from "@/components/learningCenter/FilterPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ViewMode = 'catalog' | 'solution-detail' | 'custom-wizard';
type WizardStep = 1 | 2 | 3 | 4;

export function SolutionBuildPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('catalog');
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [selectedSolutionId, setSelectedSolutionId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  
  // Wizard state
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);
  const [wizardFormData, setWizardFormData] = useState({
    type: '' as BuildRequestType | '',
    name: '',
    department: '',
    businessNeed: '',
    requirements: '',
    technologyStack: '',
    targetDate: '',
    budgetEstimate: '',
    priority: '' as BuildPriority | '',
  });
  const [wizardErrors, setWizardErrors] = useState<Record<string, string>>({});
  
  // Pre-built solution form state
  const [prebuiltFormData, setPrebuiltFormData] = useState({
    department: '',
    priority: '' as BuildPriority | '',
  });
  const [prebuiltErrors, setPrebuiltErrors] = useState<Record<string, string>>({});

  const handleFilterChange = (group: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[group] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [group]: updated };
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
  };

  // Filter solutions
  const filteredSolutions = useMemo(() => {
    return preBuiltSolutions.filter((solution) => {
      const matchesSearch =
        solution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        solution.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const categoryFilters = selectedFilters.category || [];
      const matchesCategory = categoryFilters.length === 0 || categoryFilters.includes(solution.category);
      
      // Timeline filter
      const timelineFilters = selectedFilters.timeline || [];
      const matchesTimeline = timelineFilters.length === 0 || timelineFilters.some(filter => {
        if (filter === 'Fast (≤4 weeks)') return solution.timelineMax <= 4;
        if (filter === 'Medium (5-8 weeks)') return solution.timelineMax > 4 && solution.timelineMax <= 8;
        if (filter === 'Long (>8 weeks)') return solution.timelineMax > 8;
        return false;
      });
      
      // Complexity filter
      const complexityFilters = selectedFilters.complexity || [];
      const matchesComplexity = complexityFilters.length === 0 || complexityFilters.some(filter => {
        const optionCount = solution.customizationOptions.length;
        if (filter === 'Low') return optionCount <= 1;
        if (filter === 'Medium') return optionCount > 1 && optionCount <= 3;
        if (filter === 'High') return optionCount > 3;
        return false;
      });
      
      // Popularity filter
      const popularityFilters = selectedFilters.popularity || [];
      const matchesPopularity = popularityFilters.length === 0 || popularityFilters.some(filter => {
        if (filter === 'High (>85)') return solution.popularity > 85;
        if (filter === 'Medium (70-85)') return solution.popularity >= 70 && solution.popularity <= 85;
        if (filter === 'Low (<70)') return solution.popularity < 70;
        return false;
      });

      return matchesSearch && matchesCategory && matchesTimeline && matchesComplexity && matchesPopularity;
    });
  }, [searchQuery, selectedFilters]);

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

  const handleSolutionClick = (solutionId: string) => {
    navigate(`/marketplaces/solution-build/${solutionId}`);
  };

  const handleCustomBuildClick = () => {
    setViewMode('custom-wizard');
    setWizardStep(1);
    window.scrollTo(0, 0);
  };

  const handleBackToCatalog = () => {
    setViewMode('catalog');
    setSelectedSolutionId(null);
    setWizardStep(1);
    setWizardFormData({
      type: '',
      name: '',
      department: '',
      businessNeed: '',
      sponsor: '',
      requirements: '',
      technologyStack: '',
      targetDate: '',
      budgetEstimate: '',
      priority: '',
    });
    setPrebuiltFormData({ department: '', priority: '' });
    window.scrollTo(0, 0);
  };

  const handlePrebuiltSubmit = () => {
    const errors: Record<string, string> = {};
    if (!prebuiltFormData.department) errors.department = 'Required';
    if (!prebuiltFormData.priority) errors.priority = 'Required';
    
    if (Object.keys(errors).length > 0) {
      setPrebuiltErrors(errors);
      return;
    }
    
    setShowLogin(true);
  };

  const handleWizardSubmit = () => {
    const errors: Record<string, string> = {};
    if (!wizardFormData.priority) errors.priority = 'Required';
    
    if (Object.keys(errors).length > 0) {
      setWizardErrors(errors);
      return;
    }
    
    setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    navigate('/stage2', { 
      state: { 
        marketplace: 'solution-build',
        autoSelectMyRequests: true 
      } 
    });
  };

  const selectedSolution = selectedSolutionId ? preBuiltSolutions.find(s => s.id === selectedSolutionId) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces" className="hover:text-foreground transition-colors">
              Marketplaces
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground">Solution Build</span>
          </nav>
        </div>
      </div>

      {viewMode === 'catalog' && (
        <>
      <div className="bg-gradient-to-br from-orange-50 to-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Solution Build Service</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl">
            Deploy pre-built solutions or request custom builds from our expert delivery teams.
            Browse our catalog of 24 pre-configured solutions or submit a custom build request.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 mb-8">
            <Button
              size="lg"
              style={{ backgroundColor: '#ea580c', color: 'white', cursor: 'pointer' }}
              onClick={handleCustomBuildClick}
            >
              New Request
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleCustomBuildClick}
            >
              Request Custom Build
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <p className="text-sm text-gray-500">Pre-Built Solutions</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">24</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-orange-600" />
                <p className="text-sm text-gray-500">Delivery Teams</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">4</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <p className="text-sm text-gray-500">Avg Delivery</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">8 wks</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <p className="text-sm text-gray-500">On-Time Rate</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">92%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Capacity Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Capacity & Wait Times</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryTeams.map((team) => (
              <div key={team.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Team {team.name}</h3>
                  <Badge variant={team.utilization >= 100 ? "destructive" : "secondary"}>
                    {team.utilization}%
                  </Badge>
                </div>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Capacity</span>
                    <span>{team.currentLoad} / {team.capacity}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        team.utilization >= 100 ? 'bg-red-600' :
                        team.utilization >= 80 ? 'bg-orange-600' :
                        'bg-green-600'
                      }`}
                      style={{ width: `${Math.min(team.utilization, 100)}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Next available: {team.nextAvailableDate}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pre-Built Solutions Catalog */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search solutions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Filter Panel */}
        <FilterPanel
          filters={solutionBuildFilters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClearAll={clearAllFilters}
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
        />

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {/* Result Count */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 lg:px-8 py-3">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredSolutions.length}</span> of {preBuiltSolutions.length} solutions
            </p>
          </div>

          {/* Solutions Grid */}
          <div className="px-4 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSolutions.map((solution) => (
            <div
              key={solution.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleSolutionClick(solution.id)}
            >
              <div className="mb-4">
                <Badge className={getSolutionTypeColor(solution.category)}>{solution.category}</Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{solution.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{solution.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {solution.timelineMin}-{solution.timelineMax} weeks
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Wrench className="w-4 h-4 mr-2" />
                  {solution.customizationOptions.length > 3 ? 'High' : solution.customizationOptions.length > 1 ? 'Medium' : 'Low'} customization
                </div>
              </div>

              <Button
                className="w-full"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/marketplaces/solution-build/${solution.id}`);
                }}
              >
                View Details
              </Button>
            </div>
          ))}
            </div>

            {/* Empty State */}
            {filteredSolutions.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-500">No solutions found matching your criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    clearAllFilters();
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <MobileFilterButton onClick={() => setFilterOpen(true)} />
        </>
      )}

      {/* Solution Detail View */}
      {viewMode === 'solution-detail' && selectedSolution && (
        <main className="max-w-5xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={handleBackToCatalog} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />Back to Catalog
          </Button>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <Badge className={getSolutionTypeColor(selectedSolution.category)} className="mb-4">
              {selectedSolution.category}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedSolution.name}</h1>
            <p className="text-gray-600 mb-6">{selectedSolution.description}</p>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Timeline</p>
                  <p className="font-medium text-gray-900">{selectedSolution.timelineMin}-{selectedSolution.timelineMax} weeks</p>
                </div>
              </div>
              <div className="flex items-center">
                <Wrench className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Customization</p>
                  <p className="font-medium text-gray-900">{selectedSolution.customizationOptions.length > 3 ? 'High' : selectedSolution.customizationOptions.length > 1 ? 'Medium' : 'Low'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Request This Solution</h2>
            <div className="space-y-4">
              <div>
                <Label>Department *</Label>
                <Select value={prebuiltFormData.department} onValueChange={(v) => { setPrebuiltFormData({...prebuiltFormData, department: v}); setPrebuiltErrors({...prebuiltErrors, department: ''}); }}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Platform">Platform</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
                {prebuiltErrors.department && <p className="text-sm text-red-600 mt-1">{prebuiltErrors.department}</p>}
              </div>

              <div>
                <Label>Priority *</Label>
                <RadioGroup value={prebuiltFormData.priority} onValueChange={(v) => { setPrebuiltFormData({...prebuiltFormData, priority: v as BuildPriority}); setPrebuiltErrors({...prebuiltErrors, priority: ''}); }} className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="critical" id="pb-critical" />
                    <Label htmlFor="pb-critical" className="flex-1 cursor-pointer">
                      <div className="font-medium text-red-600">Critical</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="high" id="pb-high" />
                    <Label htmlFor="pb-high" className="flex-1 cursor-pointer">
                      <div className="font-medium text-orange-600">High</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="medium" id="pb-medium" />
                    <Label htmlFor="pb-medium" className="flex-1 cursor-pointer">
                      <div className="font-medium text-yellow-600">Medium</div>
                    </Label>
                  </div>
                </RadioGroup>
                {prebuiltErrors.priority && <p className="text-sm text-red-600 mt-1">{prebuiltErrors.priority}</p>}
              </div>

              <Button 
                onClick={handlePrebuiltSubmit} 
                className="w-full" 
                style={{ backgroundColor: '#16a34a', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
              >
                <Check className="w-4 h-4 mr-2" />Submit Request
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedSolution.deliverables.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Technical Requirements</h2>
            <div className="space-y-2">
              {selectedSolution.technicalRequirements.map((req, index) => (
                <div key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* Custom Build Wizard */}
      {viewMode === 'custom-wizard' && (
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={handleBackToCatalog} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />Back to Catalog
          </Button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Custom Build</h1>
          <p className="text-gray-600 mb-8">Tell us what you need and our expert delivery teams will build it</p>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[{ num: 1, title: 'Type & Name' }, { num: 2, title: 'Business Need' }, { num: 3, title: 'Requirements' }, { num: 4, title: 'Timeline & Budget' }].map((step, index) => (
                <div key={step.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      wizardStep > step.num ? 'bg-green-600 text-white' :
                      wizardStep === step.num ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {wizardStep > step.num ? <CheckCircle className="w-5 h-5" /> : step.num}
                    </div>
                    <p className="text-xs mt-1 text-gray-600">{step.title}</p>
                  </div>
                  {index < 3 && (
                    <div className={`flex-1 h-1 mx-4 ${
                      wizardStep > step.num ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label>Request Type *</Label>
                  <RadioGroup value={wizardFormData.type} onValueChange={(v) => setWizardFormData({...wizardFormData, type: v as BuildRequestType})} className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="custom" id="w-custom" />
                      <Label htmlFor="w-custom" className="flex-1 cursor-pointer">
                        <div className="font-medium">Custom Build</div>
                        <div className="text-xs text-gray-500">Build a new solution from scratch</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="enhancement" id="w-enhancement" />
                      <Label htmlFor="w-enhancement" className="flex-1 cursor-pointer">
                        <div className="font-medium">Enhancement</div>
                        <div className="text-xs text-gray-500">Enhance an existing solution</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="integration" id="w-integration" />
                      <Label htmlFor="w-integration" className="flex-1 cursor-pointer">
                        <div className="font-medium">Integration</div>
                        <div className="text-xs text-gray-500">Integrate multiple systems</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {wizardFormData.type && (
                  <>
                    <div>
                      <Label htmlFor="w-name">What do you want to build? *</Label>
                      <Input id="w-name" value={wizardFormData.name} onChange={(e) => setWizardFormData({...wizardFormData, name: e.target.value})} placeholder="e.g., Customer Analytics Dashboard, Inventory Management System" className="mt-1" />
                    </div>
                    
                    <div>
                      <Label htmlFor="w-dept">Department *</Label>
                      <Select value={wizardFormData.department} onValueChange={(v) => setWizardFormData({...wizardFormData, department: v})}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select department" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Security">Security</SelectItem>
                          <SelectItem value="Platform">Platform</SelectItem>
                          <SelectItem value="Executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="w-need">What problem are you solving? *</Label>
                  <Textarea id="w-need" value={wizardFormData.businessNeed} onChange={(e) => setWizardFormData({...wizardFormData, businessNeed: e.target.value})} placeholder="Describe the business problem or opportunity:\n- What challenge are you facing?\n- Who will use this solution?\n- What outcomes do you expect?" rows={4} className="mt-1" />
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="w-req">Solution Requirements *</Label>
                  <Textarea id="w-req" value={wizardFormData.requirements} onChange={(e) => setWizardFormData({...wizardFormData, requirements: e.target.value})} placeholder="Describe what you want to build:\n- Key features and capabilities\n- User workflows and interactions\n- Data requirements\n- Integration needs" rows={6} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="w-tech">Preferred Technology Stack (Optional)</Label>
                  <Input id="w-tech" value={wizardFormData.technologyStack} onChange={(e) => setWizardFormData({...wizardFormData, technologyStack: e.target.value})} placeholder="e.g., React, Python, AWS, PostgreSQL - or leave blank for team recommendation" className="mt-1" />
                  <p className="text-xs text-gray-500 mt-1">Our delivery teams will recommend the best stack if not specified</p>
                </div>
              </div>
            )}

            {wizardStep === 4 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="w-date">Target Completion Date (Optional)</Label>
                  <Input id="w-date" type="date" value={wizardFormData.targetDate} onChange={(e) => setWizardFormData({...wizardFormData, targetDate: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="w-budget">Budget Estimate (Optional)</Label>
                  <Input id="w-budget" type="number" value={wizardFormData.budgetEstimate} onChange={(e) => setWizardFormData({...wizardFormData, budgetEstimate: e.target.value})} placeholder="e.g., 150000" className="mt-1" />
                </div>
                <div>
                  <Label>Priority *</Label>
                  <RadioGroup value={wizardFormData.priority} onValueChange={(v) => { setWizardFormData({...wizardFormData, priority: v as BuildPriority}); setWizardErrors({...wizardErrors, priority: ''}); }} className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="critical" id="w-critical" />
                      <Label htmlFor="w-critical" className="flex-1 cursor-pointer">
                        <div className="font-medium text-red-600">Critical</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="high" id="w-high" />
                      <Label htmlFor="w-high" className="flex-1 cursor-pointer">
                        <div className="font-medium text-orange-600">High</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="medium" id="w-medium" />
                      <Label htmlFor="w-medium" className="flex-1 cursor-pointer">
                        <div className="font-medium text-yellow-600">Medium</div>
                      </Label>
                    </div>
                  </RadioGroup>
                  {wizardErrors.priority && <p className="text-sm text-red-600 mt-1">{wizardErrors.priority}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setWizardStep(Math.max(1, wizardStep - 1) as WizardStep)} disabled={wizardStep === 1}>
              <ArrowLeft className="w-4 h-4 mr-2" />Back
            </Button>
            <p className="text-sm text-gray-500">Step {wizardStep} of 4</p>
            {wizardStep === 4 ? (
              <Button 
                onClick={handleWizardSubmit}
                style={{ backgroundColor: '#16a34a', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
              >
                <CheckCircle className="w-4 h-4 mr-2" />Submit Request
              </Button>
            ) : (
              <Button 
                onClick={() => setWizardStep(Math.min(4, wizardStep + 1) as WizardStep)}
                style={{ backgroundColor: '#ea580c', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c2410c'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
              >
                Next<ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </main>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        context={{
          marketplace: "solution-build",
          tab: "catalog",
          cardId: "",
          serviceName: "Solution Build",
          action: "submit-request",
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      <Footer />
    </div>
  );
}
