import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  LayoutGrid, 
  Settings,
  Home,
  BarChart3,
  FileText,
  PenTool,
  Rocket,
  RefreshCw,
  Briefcase,
  Brain,
  Headphones,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Activity,
  Shield,
  Cloud,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  AlertCircle,
  MessageSquare,
  Download,
  ExternalLink,
  Calendar,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { applicationPortfolio } from "@/data/portfolio";
import PortfolioHealthDashboard from "@/components/portfolio/PortfolioHealthDashboard";
import { enrolledCourses } from "@/data/learning";
import { CourseDetailView } from "@/components/learning";
import { buildRequests, type BuildRequest, deliveryTeams } from "@/data/solutionBuild";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type ViewTab = 'my-requests';
type SortOption = 'date-desc' | 'date-asc' | 'priority' | 'progress';

interface LocationState {
  marketplace?: string;
  tab?: string;
  cardId?: string;
  serviceName?: string;
  action?: string;
  autoSelectMyRequests?: boolean;
}

export default function Stage2AppPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as LocationState) || {};
  
  const {
    marketplace = "solution-build",
    cardId = "",
    serviceName = "Solution Build",
    autoSelectMyRequests = false,
  } = state;

  const marketplaceLabel = marketplace
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // State for navigation
  const [activeService, setActiveService] = useState("Solution Build");
  
  const [activeSubService, setActiveSubService] = useState<string | null>(() => {
    // Auto-select the specific service if coming from a portfolio or learning center card
    if ((marketplace === "portfolio-management" || marketplace === "learning-center") && cardId) {
      return cardId;
    }
    return null;
  });

  // Solution Build state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<BuildRequest | null>(null);
  const [activeTab, setActiveTab] = useState<ViewTab>('my-requests');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [showFilters, setShowFilters] = useState(false);
  const [solutionBuildView, setSolutionBuildView] = useState('overview');
  const [allBuildRequests, setAllBuildRequests] = useState<BuildRequest[]>(buildRequests);
  
  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    businessNeed: true,
    progress: true,
    communication: true,
    deliverables: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Load build requests from localStorage and refresh when returning from submission
  useEffect(() => {
    const loadRequests = () => {
      const storedRequests = JSON.parse(localStorage.getItem('buildRequests') || '[]');
      setAllBuildRequests([...storedRequests, ...buildRequests]);
    };
    
    loadRequests();
    
    // Listen for custom event when new requests are added
    const handleNewRequest = () => {
      loadRequests();
    };
    
    window.addEventListener('buildRequestAdded', handleNewRequest);
    
    return () => window.removeEventListener('buildRequestAdded', handleNewRequest);
  }, []);

  // Collapsible sidebar states
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);

  // Solution Build filter and sort logic
  const filteredAndSortedRequests = useMemo(() => {
    // Always filter to current user's requests only
    let filtered = allBuildRequests.filter(req => req.requestedBy === 'Sarah Johnson' || req.requestedBy === 'Current User');

    if (searchQuery) {
      filtered = filtered.filter(req =>
        req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(req => req.type === typeFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(req => req.priority === priorityFilter);
    }

    if (teamFilter !== 'all') {
      filtered = filtered.filter(req => req.assignedTeam === teamFilter);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        case 'date-asc':
          return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        case 'priority': {
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case 'progress':
          return b.progress - a.progress;
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, activeTab, statusFilter, typeFilter, priorityFilter, teamFilter, sortBy, allBuildRequests]);
  
  // Auto-select first request when coming from submission
  useEffect(() => {
    if (autoSelectMyRequests && filteredAndSortedRequests.length > 0 && !selectedRequest) {
      setSelectedRequest(filteredAndSortedRequests[0]);
    }
  }, [autoSelectMyRequests, filteredAndSortedRequests, selectedRequest]);

  const activeFiltersCount = [statusFilter, typeFilter, priorityFilter, teamFilter].filter(f => f !== 'all').length;

  const clearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setPriorityFilter('all');
    setTeamFilter('all');
  };

  const getStatusColor = (status: BuildRequest['status']) => {
    const colors = {
      'intake': 'bg-gray-100 text-gray-700',
      'triage': 'bg-blue-100 text-blue-700',
      'queue': 'bg-yellow-100 text-yellow-700',
      'in-progress': 'bg-purple-100 text-purple-700',
      'testing': 'bg-orange-100 text-orange-700',
      'deployed': 'bg-green-100 text-green-700',
      'closed': 'bg-gray-100 text-gray-500'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: BuildRequest['priority']) => {
    const colors = {
      'critical': 'text-red-600',
      'high': 'text-orange-600',
      'medium': 'text-yellow-600',
      'low': 'text-gray-600'
    };
    return colors[priority];
  };

  const getPhaseIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (status === 'in-progress') return <Circle className="w-5 h-5 text-blue-600 fill-blue-600" />;
    return <Circle className="w-5 h-5 text-gray-300" />;
  };

  const getStageSpecificCard = (request: BuildRequest) => {
    switch (request.status) {
      case 'intake':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Request Received</h3>
                <p className="text-sm text-blue-700">Your request is under review. The TO team will assess it within 2 business days.</p>
              </div>
            </div>
          </div>
        );
      
      case 'triage':
        return request.toAssessment ? (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3 mb-3">
              <Activity className="w-5 h-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900 mb-1">Under Assessment</h3>
                <p className="text-sm text-purple-700 mb-3">The TO team is evaluating your request.</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-purple-600 font-medium">Estimated Timeline:</span>
                    <p className="text-purple-900">{request.toAssessment.estimatedEffort} weeks</p>
                  </div>
                  <div>
                    <span className="text-purple-600 font-medium">Recommended Team:</span>
                    <p className="text-purple-900 capitalize">{request.toAssessment.recommendedTeam.replace('team-', 'Team ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null;
      
      case 'queue':
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 mb-1">Approved & Queued</h3>
                <p className="text-sm text-yellow-700 mb-3">Your request has been approved and assigned to {request.assignedTeam?.replace('team-', 'Team ')}.</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {request.queuePosition && (
                    <div>
                      <span className="text-yellow-600 font-medium">Queue Position:</span>
                      <p className="text-yellow-900">#{request.queuePosition}</p>
                    </div>
                  )}
                  {request.estimatedDelivery && (
                    <div>
                      <span className="text-yellow-600 font-medium">Estimated Delivery:</span>
                      <p className="text-yellow-900">{new Date(request.estimatedDelivery).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'in-progress':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Rocket className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">Active Development</h3>
                {request.currentSprint ? (
                  <>
                    <p className="text-sm text-blue-700 mb-3">{request.currentSprint.name} in progress</p>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-blue-600 font-medium">Sprint Goals:</span>
                        <ul className="list-disc list-inside text-blue-900 mt-1">
                          {request.currentSprint.goals.map((goal, idx) => (
                            <li key={idx}>{goal}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-medium">Progress:</span>
                        <div className="flex-1 bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(request.currentSprint.completedStoryPoints / request.currentSprint.totalStoryPoints) * 100}%` }}
                          />
                        </div>
                        <span className="text-blue-900">{request.currentSprint.completedStoryPoints}/{request.currentSprint.totalStoryPoints}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-blue-700">Team is actively working on your solution.</p>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'testing':
        return (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 mb-1">Testing Phase</h3>
                <p className="text-sm text-orange-700 mb-3">Your solution is being tested and prepared for deployment.</p>
                {request.estimatedDelivery && (
                  <div className="text-sm">
                    <span className="text-orange-600 font-medium">Expected Deployment:</span>
                    <p className="text-orange-900">{new Date(request.estimatedDelivery).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'deployed':
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 mb-2">🎉 Solution Deployed!</h3>
                <p className="text-sm text-green-700 mb-3">Your solution is now live and ready to use.</p>
                {request.createdAppId && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Launch Solution
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Portfolio Management sub-services - Use actual application portfolio services
  const portfolioSubServices = applicationPortfolio.map(service => ({
    id: service.id,
    name: service.title,
    description: service.description,
    icon: getIconComponent(service.iconName),
    category: service.category,
    realtime: service.realtime,
    complexity: service.complexity
  }));

  // Learning Center sub-services - Use actual enrolled courses
  const learningSubServices = enrolledCourses.map(course => ({
    id: course.id,
    name: course.courseName,
    description: `${course.instructor} • ${course.duration} • ${course.progress}% complete`,
    icon: BookOpen,
    category: course.difficulty,
    status: course.status,
    progress: course.progress
  }));

  // Icon mapping function
  function getIconComponent(iconName: string): React.ComponentType<{ className?: string }> {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      Activity,
      DollarSign,
      Shield,
      Cloud,
      BarChart3,
      Users,
      Target,
      TrendingUp
    };
    return iconMap[iconName] || Activity;
  }

  const isActiveService = (service: string) => {
    return activeService === service ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-gray-50";
  };

  const isOverviewActive = () => {
    return activeService === "Overview" ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-gray-50";
  };

  const handleServiceClick = (service: string) => {
    setActiveService(service);
    setActiveSubService(null);
    // Reset Solution Build state when switching services
    if (service !== "Solution Build") {
      setSelectedRequest(null);
      setSearchQuery("");
      setActiveTab('all');
      clearFilters();
      setSolutionBuildView('overview');
    }
  };

  const handleSubServiceClick = (subServiceId: string) => {
    setActiveSubService(subServiceId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden h-screen">
      {/* Left Sidebar - Navigation */}
      <div className={`${leftSidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 flex-shrink-0 h-full`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center gap-3 ${leftSidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <LayoutGrid className="w-4 h-4 text-white" />
              </div>
              {!leftSidebarCollapsed && (
                <div>
                  <h2 className="font-semibold text-sm">DTMP Platform</h2>
                  <p className="text-xs text-gray-500">Stage 2 - Service Hub</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
              className="p-1 h-6 w-6"
            >
              {leftSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            <button 
              onClick={() => handleServiceClick("Overview")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isOverviewActive()}`}
              title="Overview"
            >
              <Home className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Overview"}
            </button>
            
            {/* Service Categories */}
            {!leftSidebarCollapsed && (
              <div className="pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
                  Services
                </p>
              </div>
            )}
            
            <button 
              onClick={() => handleServiceClick("AI DocWriter")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("AI DocWriter")}`}
              title="AI DocWriter"
            >
              <PenTool className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "AI DocWriter"}
            </button>
            
            <button 
              onClick={() => handleServiceClick("Learning Center")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("Learning Center")}`}
              title="Learning Center"
            >
              <Headphones className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Learning Center"}
            </button>
            
            <button 
              onClick={() => handleServiceClick("Design Blueprints")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("Design Blueprints")}`}
              title="Design Blueprints"
            >
              <LayoutGrid className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Design Blueprints"}
            </button>
            
            <button 
              onClick={() => handleServiceClick("Deploy Blueprints")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("Deploy Blueprints")}`}
              title="Deploy Blueprints"
            >
              <Rocket className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Deploy Blueprints"}
            </button>
            
            <button 
              onClick={() => handleServiceClick("Lifecycle Management")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("Lifecycle Management")}`}
              title="Lifecycle Management"
            >
              <RefreshCw className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Lifecycle Management"}
            </button>
            
            <button 
              onClick={() => handleServiceClick("Portfolio Management")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("Portfolio Management")}`}
              title="Portfolio Management"
            >
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Portfolio Management"}
            </button>
            
            <button 
              onClick={() => handleServiceClick("Digital Intelligence")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("Digital Intelligence")}`}
              title="Digital Intelligence"
            >
              <Brain className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Digital Intelligence"}
            </button>
            
            <button 
              onClick={() => handleServiceClick("Solution Build")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("Solution Build")}`}
              title="Solution Build"
            >
              <Rocket className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Solution Build"}
            </button>
            
            {/* Analytics Section */}
            {!leftSidebarCollapsed && (
              <div className="pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
                  Analytics
                </p>
              </div>
            )}
            
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-50"
              title="Dashboards"
            >
              <BarChart3 className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Dashboards"}
            </button>
            
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-50"
              title="Reports"
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Reports"}
            </button>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className={`flex items-center gap-3 mb-3 ${leftSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-orange-700 text-xs font-medium">JD</span>
            </div>
            {!leftSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-gray-500">Portfolio Manager</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Middle Column - Context & Controls */}
      <div className={`${rightSidebarCollapsed ? 'w-0' : 'w-80'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden flex-shrink-0 h-full`}>
        {!rightSidebarCollapsed && (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => activeService === "Solution Build" ? navigate('/marketplaces/solution-build') : navigate(`/marketplaces/${marketplace}`)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {activeService === "Solution Build" ? "Back to Marketplace" : `Back to ${marketplaceLabel}`}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRightSidebarCollapsed(true)}
                  className="p-1 h-6 w-6"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>

              {/* Service Context */}
              <div className="space-y-3">
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{activeService}</h1>
                  <p className="text-sm text-gray-500">Service Hub</p>
                </div>
              </div>
            </div>

            {/* Dynamic Content Based on Active Service */}
            <div className="flex-1 p-4 overflow-y-auto">
              {activeService === "Portfolio Management" ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Portfolio Tools</h3>
                    <div className="space-y-2">
                      {portfolioSubServices.map((subService) => {
                        const Icon = subService.icon;
                        return (
                          <button
                            key={subService.id}
                            onClick={() => handleSubServiceClick(subService.id)}
                            className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                              activeSubService === subService.id 
                                ? "bg-orange-50 text-orange-700 border border-orange-200" 
                                : "text-gray-700 hover:bg-gray-50 border border-transparent"
                            }`}
                          >
                            <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div className="text-left">
                              <div className="font-medium">{subService.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{subService.description}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : activeService === "Learning Center" ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">My Courses</h3>
                    <div className="space-y-2">
                      {learningSubServices.map((course) => {
                        const Icon = course.icon;
                        const statusColor = course.status === 'completed' ? 'text-green-600' : 
                                          course.status === 'in-progress' ? 'text-blue-600' : 'text-gray-400';
                        return (
                          <button
                            key={course.id}
                            onClick={() => handleSubServiceClick(course.id)}
                            className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                              activeSubService === course.id 
                                ? "bg-orange-50 text-orange-700 border border-orange-200" 
                                : "text-gray-700 hover:bg-gray-50 border border-transparent"
                            }`}
                          >
                            <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${statusColor}`} />
                            <div className="text-left flex-1">
                              <div className="font-medium">{course.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{course.description}</div>
                              {course.progress > 0 && (
                                <div className="mt-2">
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className="bg-orange-600 h-1.5 rounded-full" 
                                      style={{ width: `${course.progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : activeService === "Solution Build" ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button 
                        variant="outline"
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => navigate('/marketplaces/solution-build')}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Browse Solutions
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">My Requests</h3>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Requests</span>
                        <Badge variant="secondary">
                          {allBuildRequests.filter(req => req.requestedBy === 'Sarah Johnson' || req.requestedBy === 'Current User').length}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeService === "Overview" ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Dashboard
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Recent Reports
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Access {activeService}
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        View Documentation
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {rightSidebarCollapsed && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRightSidebarCollapsed(false)}
                  className="p-1 h-8 w-8"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeSubService ? 
                    (activeService === "Portfolio Management" 
                      ? portfolioSubServices.find(s => s.id === activeSubService)?.name 
                      : activeService === "Learning Center"
                      ? learningSubServices.find(s => s.id === activeSubService)?.name
                      : activeService)
                    : activeService === "Solution Build" ? "My Build Requests" : activeService
                  }
                </h2>
                <p className="text-sm text-gray-500">
                  {activeSubService ? 
                    (activeService === "Portfolio Management"
                      ? portfolioSubServices.find(s => s.id === activeSubService)?.description
                      : activeService === "Learning Center"
                      ? learningSubServices.find(s => s.id === activeSubService)?.description
                      : `${activeService} • Service Hub`)
                    : activeService === "Solution Build" 
                      ? `${allBuildRequests.filter(req => req.requestedBy === 'Sarah Johnson' || req.requestedBy === 'Current User').length} active requests`
                      : `${activeService} • Service Hub`
                  }
                </p>
              </div>
            </div>
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {activeService === "Portfolio Management" && activeSubService ? (
            <div className="h-full">
              {activeSubService === "portfolio-health-dashboard" && (
                <PortfolioHealthDashboard className="h-full" />
              )}

              {activeSubService === "application-rationalization" && (
                <div className="p-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Activity className="w-5 h-5 text-red-600" />
                          <h3 className="font-semibold text-red-900">Redundant Apps</h3>
                        </div>
                        <p className="text-2xl font-bold text-red-900">23</p>
                        <p className="text-sm text-red-700">Candidates for retirement</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <DollarSign className="w-5 h-5 text-orange-600" />
                          <h3 className="font-semibold text-orange-900">Potential Savings</h3>
                        </div>
                        <p className="text-2xl font-bold text-orange-900">$1.2M</p>
                        <p className="text-sm text-orange-700">Annual cost reduction</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <h3 className="font-semibold text-green-900">Rationalization Score</h3>
                        </div>
                        <p className="text-2xl font-bold text-green-900">78%</p>
                        <p className="text-sm text-green-700">Portfolio efficiency</p>
                      </div>
                    </div>
                    <div className="text-center py-12">
                      <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Rationalization Assessment</h3>
                      <p className="text-gray-500">Comprehensive analysis and recommendations would be displayed here</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSubService === "tco-optimization" && (
                <div className="p-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <DollarSign className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-blue-900">Total TCO</h3>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">$2.4M</p>
                        <p className="text-sm text-blue-700">Annual portfolio cost</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <h3 className="font-semibold text-green-900">Cost per User</h3>
                        </div>
                        <p className="text-2xl font-bold text-green-900">$1,200</p>
                        <p className="text-sm text-green-700">Per user annually</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Target className="w-5 h-5 text-purple-600" />
                          <h3 className="font-semibold text-purple-900">Savings Potential</h3>
                        </div>
                        <p className="text-2xl font-bold text-purple-900">$480K</p>
                        <p className="text-sm text-purple-700">License optimization</p>
                      </div>
                    </div>
                    <div className="text-center py-12">
                      <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">TCO Optimization</h3>
                      <p className="text-gray-500">Cost analysis and optimization tools would be displayed here</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Other sub-services with placeholder content */}
              {!["portfolio-health-dashboard", "application-rationalization", "tco-optimization"].includes(activeSubService) && (
                <div className="p-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="text-center py-12">
                      <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {portfolioSubServices.find(s => s.id === activeSubService)?.name}
                      </h3>
                      <p className="text-gray-500">
                        {portfolioSubServices.find(s => s.id === activeSubService)?.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeService === "Learning Center" && activeSubService ? (
            <div className="h-full">
              {/* Learning Center Course Content */}
              {(() => {
                const course = enrolledCourses.find(c => c.id === activeSubService);
                if (!course) return null;
                
                return <CourseDetailView course={course} />;
              })()}
            </div>
          ) : activeService === "Solution Build" ? (
            <div className="h-full flex flex-col">
              <div className="flex-1 flex overflow-hidden">
                  <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b flex-shrink-0">
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input placeholder="Search requests..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9" />
                      </div>

                      <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="h-7 px-2 text-xs">
                        <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                      </Button>
                      {showFilters && (
                        <div className="mt-2 space-y-2">
                          <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Statuses</SelectItem>
                              <SelectItem value="intake">Intake</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="deployed">Deployed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {filteredAndSortedRequests.length === 0 ? (
                        <div className="p-6 text-center text-gray-500"><p className="text-sm">No requests found</p></div>
                      ) : (
                        <div className="divide-y">
                          {filteredAndSortedRequests.map((request) => (
                            <button key={request.id} onClick={() => setSelectedRequest(request)} className={`w-full p-4 text-left hover:bg-gray-50 ${selectedRequest?.id === request.id ? 'bg-orange-50 border-l-4 border-orange-600' : ''}`}>
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-sm text-gray-900 truncate flex-1">{request.name}</h4>
                                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusColor(request.status)}`}>{request.status}</span>
                              </div>
                              <p className="text-xs text-gray-500">{request.id} • {request.department}</p>
                              <div className="mt-2">
                                <Progress value={request.progress} className="h-1.5" />
                                <p className="text-xs text-gray-500 mt-1">{request.progress}% complete</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    {selectedRequest ? (
                      <>
                        <div className="bg-white border-b px-6 py-4">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-semibold">{selectedRequest.name}</h2>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedRequest.status)}`}>{selectedRequest.status}</span>
                          </div>
                          <p className="text-sm text-gray-500">{selectedRequest.id} • {selectedRequest.department} • Submitted {new Date(selectedRequest.submittedAt).toLocaleDateString()}</p>
                          <div className="mt-3">
                            <Progress value={selectedRequest.progress} className="h-2" />
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                          <div className="max-w-4xl space-y-6">
                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-white rounded-lg border p-4">
                                <p className="text-sm text-gray-500 mb-1">Progress</p>
                                <p className="text-2xl font-semibold">{selectedRequest.progress}%</p>
                              </div>
                              <div className="bg-white rounded-lg border p-4">
                                <p className="text-sm text-gray-500 mb-1">Type</p>
                                <p className="text-lg font-semibold capitalize">{selectedRequest.type}</p>
                              </div>
                              <div className="bg-white rounded-lg border p-4">
                                <p className="text-sm text-gray-500 mb-1">Priority</p>
                                <p className={`text-lg font-semibold capitalize ${getPriorityColor(selectedRequest.priority)}`}>{selectedRequest.priority}</p>
                              </div>
                            </div>

                            {/* Stage-Specific Card */}
                            {getStageSpecificCard(selectedRequest)}

                            {/* Business Need Section */}
                            <div className="bg-white rounded-lg border">
                              <button
                                onClick={() => toggleSection('businessNeed')}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                              >
                                <h3 className="font-semibold text-gray-900">Business Need</h3>
                                {expandedSections.businessNeed ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                              </button>
                              {expandedSections.businessNeed && (
                                <div className="px-4 pb-4 border-t">
                                  <p className="text-sm text-gray-700 mt-4">{selectedRequest.businessNeed}</p>
                                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                    {selectedRequest.targetDate && (
                                      <div>
                                        <span className="text-gray-500">Target Date:</span>
                                        <p className="font-medium">{new Date(selectedRequest.targetDate).toLocaleDateString()}</p>
                                      </div>
                                    )}
                                    {selectedRequest.assignedTeam && (
                                      <div>
                                        <span className="text-gray-500">Assigned Team:</span>
                                        <p className="font-medium capitalize">{selectedRequest.assignedTeam.replace('team-', 'Team ')}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Progress & Timeline Section */}
                            {selectedRequest.status !== 'intake' && (
                              <div className="bg-white rounded-lg border">
                                <button
                                  onClick={() => toggleSection('progress')}
                                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                                >
                                  <h3 className="font-semibold text-gray-900">Progress & Timeline</h3>
                                  {expandedSections.progress ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </button>
                                {expandedSections.progress && (
                                  <div className="px-4 pb-4 border-t">
                                    <div className="space-y-3 mt-4">
                                      {selectedRequest.phases.map((phase) => (
                                        <div key={phase.id} className="flex items-start gap-3">
                                          {getPhaseIcon(phase.status)}
                                          <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                              <span className="font-medium text-sm">{phase.name}</span>
                                              <span className="text-sm text-gray-500">{phase.progress}%</span>
                                            </div>
                                            {phase.progress > 0 && (
                                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${phase.progress}%` }} />
                                              </div>
                                            )}
                                            {phase.tasks && phase.tasks.length > 0 && (
                                              <div className="mt-2 space-y-1">
                                                {phase.tasks.map((task) => (
                                                  <div key={task.id} className="flex items-center gap-2 text-xs text-gray-600">
                                                    {task.completed ? (
                                                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                                                    ) : (
                                                      <Circle className="w-3 h-3 text-gray-400" />
                                                    )}
                                                    <span>{task.title}</span>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Communication Section */}
                            {(selectedRequest.messages.length > 0 || selectedRequest.blockers.length > 0) && (
                              <div className="bg-white rounded-lg border">
                                <button
                                  onClick={() => toggleSection('communication')}
                                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                                >
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-gray-900">Team & Communication</h3>
                                    {selectedRequest.blockers.length > 0 && (
                                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                        {selectedRequest.blockers.length} blocker{selectedRequest.blockers.length > 1 ? 's' : ''}
                                      </span>
                                    )}
                                  </div>
                                  {expandedSections.communication ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </button>
                                {expandedSections.communication && (
                                  <div className="px-4 pb-4 border-t">
                                    {/* Blockers */}
                                    {selectedRequest.blockers.length > 0 && (
                                      <div className="mt-4">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Active Blockers</h4>
                                        {selectedRequest.blockers.map((blocker) => (
                                          <div key={blocker.id} className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                                            <div className="flex items-start gap-2">
                                              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                                              <div className="flex-1">
                                                <p className="font-medium text-sm text-red-900">{blocker.title}</p>
                                                <p className="text-xs text-red-700 mt-1">{blocker.description}</p>
                                                <div className="flex items-center gap-3 mt-2 text-xs text-red-600">
                                                  <span>Impact: {blocker.impact}</span>
                                                  <span>•</span>
                                                  <span>Owner: {blocker.owner}</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* Messages */}
                                    {selectedRequest.messages.length > 0 && (
                                      <div className="mt-4">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Recent Updates</h4>
                                        <div className="space-y-2">
                                          {selectedRequest.messages.map((message) => (
                                            <div key={message.id} className="bg-gray-50 rounded-lg p-3">
                                              <div className="flex items-start gap-2">
                                                <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <div className="flex-1">
                                                  <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-sm">{message.sender}</span>
                                                    <span className="text-xs text-gray-500">
                                                      {new Date(message.timestamp).toLocaleDateString()}
                                                    </span>
                                                  </div>
                                                  <p className="text-sm text-gray-700">{message.content}</p>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Deliverables & Documents Section */}
                            {(selectedRequest.deliverables.length > 0 || selectedRequest.documents.length > 0) && (
                              <div className="bg-white rounded-lg border">
                                <button
                                  onClick={() => toggleSection('deliverables')}
                                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                                >
                                  <h3 className="font-semibold text-gray-900">Deliverables & Documents</h3>
                                  {expandedSections.deliverables ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </button>
                                {expandedSections.deliverables && (
                                  <div className="px-4 pb-4 border-t">
                                    {/* Deliverables */}
                                    {selectedRequest.deliverables.length > 0 && (
                                      <div className="mt-4">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Expected Deliverables</h4>
                                        <div className="space-y-2">
                                          {selectedRequest.deliverables.map((deliverable) => (
                                            <div key={deliverable.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                                              {deliverable.completed ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                              ) : (
                                                <Circle className="w-4 h-4 text-gray-400" />
                                              )}
                                              <div className="flex-1">
                                                <p className="text-sm font-medium">{deliverable.name}</p>
                                                <p className="text-xs text-gray-500">Due: {new Date(deliverable.dueDate).toLocaleDateString()}</p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Documents */}
                                    {selectedRequest.documents.length > 0 && (
                                      <div className="mt-4">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Documents</h4>
                                        <div className="space-y-2">
                                          {selectedRequest.documents.map((doc) => (
                                            <div key={doc.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100">
                                              <FileText className="w-4 h-4 text-gray-400" />
                                              <div className="flex-1">
                                                <p className="text-sm font-medium">{doc.name}</p>
                                                <p className="text-xs text-gray-500">
                                                  Uploaded {new Date(doc.uploadedAt).toLocaleDateString()} by {doc.uploadedBy}
                                                </p>
                                              </div>
                                              <Button size="sm" variant="ghost">
                                                <Download className="w-4 h-4" />
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <Filter className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p className="text-gray-500">Select a request to view details</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {activeService} Interface
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {activeService === "Overview" ? 
                      "Welcome to the DTMP Service Hub" :
                      `${activeService} tools and interfaces would be displayed here`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}