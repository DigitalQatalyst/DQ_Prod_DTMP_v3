import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus, Search, Filter, SlidersHorizontal, ArrowUpDown, X, Users, DollarSign, CheckCircle2, TrendingUp, Package, FileText, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildRequests, type BuildRequest, deliveryTeams } from "@/data/solutionBuild";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

type ViewTab = 'all' | 'my-requests' | 'in-progress' | 'delivered';
type SortOption = 'date-desc' | 'date-asc' | 'priority' | 'progress';
type DetailTab = 'overview' | 'requirements' | 'team' | 'budget';

export default function SolutionBuildServicePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allRequests, setAllRequests] = useState<BuildRequest[]>(buildRequests);
  const [selectedRequest, setSelectedRequest] = useState<BuildRequest | null>(
    id ? buildRequests.find(r => r.id === id) || null : null
  );
  
  // Load requests from localStorage
  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem('buildRequests') || '[]');
    setAllRequests([...storedRequests, ...buildRequests]);
  }, []);
  
  // Week 3: New state for filters, sorting, and tabs
  const [activeTab, setActiveTab] = useState<ViewTab>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort logic
  const filteredAndSortedRequests = useMemo(() => {
    let filtered = allRequests;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(req =>
        req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tab filter
    if (activeTab === 'my-requests') {
      filtered = filtered.filter(req => req.requestedBy === 'Sarah Johnson'); // Mock user
    } else if (activeTab === 'in-progress') {
      filtered = filtered.filter(req => ['in-progress', 'testing'].includes(req.status));
    } else if (activeTab === 'delivered') {
      filtered = filtered.filter(req => ['deployed', 'closed'].includes(req.status));
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(req => req.type === typeFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(req => req.priority === priorityFilter);
    }

    // Team filter
    if (teamFilter !== 'all') {
      filtered = filtered.filter(req => req.assignedTeam === teamFilter);
    }

    // Sort
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
  }, [searchQuery, activeTab, statusFilter, typeFilter, priorityFilter, teamFilter, sortBy, allRequests]);

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

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden h-screen">
      {/* Column 1: Service Navigation */}
      <div className={`${leftSidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 flex-shrink-0`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!leftSidebarCollapsed && (
              <div>
                <h2 className="font-semibold text-sm">Solution Build</h2>
                <p className="text-xs text-gray-500">Service Hub</p>
              </div>
            )}
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

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start mb-3"
              onClick={() => navigate('/stage2')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {!leftSidebarCollapsed && "Back to Stage 2"}
            </Button>
            <Button
              variant="default"
              size="sm"
              className="w-full justify-start bg-orange-600 hover:bg-orange-700 mb-2"
              onClick={() => navigate('/stage2/build/request')}
            >
              <Plus className="w-4 h-4 mr-2" />
              {!leftSidebarCollapsed && "New Request"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => navigate('/stage2/build/catalog')}
            >
              <Package className="w-4 h-4 mr-2" />
              {!leftSidebarCollapsed && "Browse Catalog"}
            </Button>
          </div>
        </nav>
      </div>

      {/* Column 2: Build Request List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Build Requests</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="h-7 px-2"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">{activeFiltersCount}</Badge>
                )}
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* View Tabs */}
          <div className="flex gap-1 mb-3">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 px-2 py-1.5 text-xs rounded ${
                activeTab === 'all' ? 'bg-orange-100 text-orange-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All ({allRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('my-requests')}
              className={`flex-1 px-2 py-1.5 text-xs rounded ${
                activeTab === 'my-requests' ? 'bg-orange-100 text-orange-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              My Requests
            </button>
            <button
              onClick={() => setActiveTab('in-progress')}
              className={`flex-1 px-2 py-1.5 text-xs rounded ${
                activeTab === 'in-progress' ? 'bg-orange-100 text-orange-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('delivered')}
              className={`flex-1 px-2 py-1.5 text-xs rounded ${
                activeTab === 'delivered' ? 'bg-orange-100 text-orange-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Delivered
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Filters</span>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
                    Clear all
                  </Button>
                )}
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="intake">Intake</SelectItem>
                  <SelectItem value="triage">Triage</SelectItem>
                  <SelectItem value="queue">Queue</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="deployed">Deployed</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pre-built">Pre-Built</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="enhancement">Enhancement</SelectItem>
                  <SelectItem value="integration">Integration</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {deliveryTeams.map(team => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Sort */}
          <div className="flex items-center gap-2 mb-3">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="h-7 text-xs border-0 shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {statusFilter !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  {statusFilter}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setStatusFilter('all')} />
                </Badge>
              )}
              {typeFilter !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  {typeFilter}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setTypeFilter('all')} />
                </Badge>
              )}
              {priorityFilter !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  {priorityFilter}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setPriorityFilter('all')} />
                </Badge>
              )}
              {teamFilter !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  {deliveryTeams.find(t => t.id === teamFilter)?.name}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setTeamFilter('all')} />
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredAndSortedRequests.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p className="text-sm">No requests found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAndSortedRequests.map((request) => (
                <button
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedRequest?.id === request.id ? 'bg-orange-50 border-l-4 border-orange-600' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 truncate">{request.name}</h4>
                      <p className="text-xs text-gray-500">{request.id}</p>
                    </div>
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusColor(request.status)} flex-shrink-0`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className={getPriorityColor(request.priority)}>{request.priority}</span>
                    <span>•</span>
                    <span>{request.department}</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-orange-600 h-1.5 rounded-full"
                        style={{ width: `${request.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{request.progress}% complete</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Column 3: Build Request Detail */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {selectedRequest ? (
          <>
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">{selectedRequest.name}</h2>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{selectedRequest.id} • {selectedRequest.department}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-gray-50 overflow-y-auto">
              <Tabs defaultValue="overview" className="h-full">
                <div className="bg-white border-b border-gray-200 px-6">
                  <TabsList className="h-12">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="requirements">Requirements</TabsTrigger>
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                    <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                    <TabsTrigger value="budget">Budget</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6">
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="mt-0">
                    <div className="max-w-4xl mx-auto space-y-6">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-500">Progress</p>
                          </div>
                          <p className="text-2xl font-semibold text-gray-900">{selectedRequest.progress}%</p>
                        </div>
                        {selectedRequest.budget.approved > 0 && (
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <p className="text-sm text-gray-500">Budget Used</p>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">
                              {Math.round((selectedRequest.budget.spent / selectedRequest.budget.approved) * 100)}%
                            </p>
                          </div>
                        )}
                        {selectedRequest.assignedTeam && (
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <p className="text-sm text-gray-500">Team</p>
                            </div>
                            <p className="text-lg font-semibold text-gray-900 capitalize">
                              {selectedRequest.assignedTeam.replace('team-', '')}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Request Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Type</p>
                            <p className="text-sm font-medium text-gray-900 capitalize">{selectedRequest.type}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Priority</p>
                            <p className={`text-sm font-medium capitalize ${getPriorityColor(selectedRequest.priority)}`}>
                              {selectedRequest.priority}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Requested By</p>
                            <p className="text-sm font-medium text-gray-900">{selectedRequest.requestedBy}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Sponsor</p>
                            <p className="text-sm font-medium text-gray-900">{selectedRequest.sponsor}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="text-sm font-medium text-gray-900">{selectedRequest.department}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Submitted</p>
                            <p className="text-sm font-medium text-gray-900">{selectedRequest.submittedAt}</p>
                          </div>
                          {selectedRequest.targetDate && (
                            <div>
                              <p className="text-sm text-gray-500">Target Date</p>
                              <p className="text-sm font-medium text-gray-900">{selectedRequest.targetDate}</p>
                            </div>
                          )}
                          {selectedRequest.estimatedDelivery && (
                            <div>
                              <p className="text-sm text-gray-500">Estimated Delivery</p>
                              <p className="text-sm font-medium text-gray-900">{selectedRequest.estimatedDelivery}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Business Need */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Business Need</h3>
                        <p className="text-sm text-gray-700">{selectedRequest.businessNeed}</p>
                      </div>

                      {/* Build Phases */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Build Phases</h3>
                        <div className="space-y-3">
                          {selectedRequest.phases.map((phase) => (
                            <div key={phase.id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium text-gray-900">{phase.name}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  phase.status === 'completed' ? 'bg-green-100 text-green-700' :
                                  phase.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {phase.status}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-orange-600 h-1.5 rounded-full"
                                  style={{ width: `${phase.progress}%` }}
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{phase.progress}% complete</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Requirements Tab */}
                  <TabsContent value="requirements" className="mt-0">
                    <div className="max-w-4xl mx-auto">
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">Requirements</h3>
                          <Badge variant="secondary">
                            {selectedRequest.requirements.filter(r => r.status === 'completed').length} / {selectedRequest.requirements.length} Complete
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          {selectedRequest.requirements.map((req) => (
                            <div key={req.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 mb-1">{req.description}</p>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    req.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    req.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                    req.status === 'approved' ? 'bg-purple-100 text-purple-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {req.status}
                                  </span>
                                  <span className={`text-xs font-medium ${getPriorityColor(req.priority)}`}>
                                    {req.priority} priority
                                  </span>
                                  {req.assignedTo && (
                                    <span className="text-xs text-gray-500">• Assigned to {req.assignedTo}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Team Tab */}
                  <TabsContent value="team" className="mt-0">
                    <div className="max-w-4xl mx-auto">
                      {selectedRequest.assignedTeam ? (
                        (() => {
                          const team = deliveryTeams.find(t => t.id === selectedRequest.assignedTeam);
                          return team ? (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                              <h3 className="font-semibold text-gray-900 mb-4">Team {team.name}</h3>
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm text-gray-500 mb-1">Specialty</p>
                                  <p className="text-sm font-medium text-gray-900">{team.specialty}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 mb-2">Skills</p>
                                  <div className="flex flex-wrap gap-2">
                                    {team.skills.map((skill, index) => (
                                      <Badge key={index} variant="secondary">{skill}</Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                  <div>
                                    <p className="text-sm text-gray-500">Capacity</p>
                                    <p className="text-sm font-medium text-gray-900">{team.currentLoad} / {team.capacity} builds</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Utilization</p>
                                    <p className="text-sm font-medium text-gray-900">{team.utilization}%</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Completed Builds</p>
                                    <p className="text-sm font-medium text-gray-900">{team.completedBuilds}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Avg Delivery Time</p>
                                    <p className="text-sm font-medium text-gray-900">{team.averageDeliveryTime} weeks</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null;
                        })()
                      ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                          <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p className="text-sm text-gray-500">No team assigned yet</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Budget Tab */}
                  <TabsContent value="budget" className="mt-0">
                    <div className="max-w-4xl mx-auto">
                      {selectedRequest.budget.approved > 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                          <h3 className="font-semibold text-gray-900 mb-4">Budget Tracking</h3>
                          <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Approved</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                  ${selectedRequest.budget.approved.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Spent</p>
                                <p className="text-2xl font-semibold text-orange-600">
                                  ${selectedRequest.budget.spent.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Remaining</p>
                                <p className="text-2xl font-semibold text-green-600">
                                  ${(selectedRequest.budget.approved - selectedRequest.budget.spent).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-gray-700">Budget Utilization</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {Math.round((selectedRequest.budget.spent / selectedRequest.budget.approved) * 100)}%
                                </p>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className={`h-3 rounded-full ${
                                    (selectedRequest.budget.spent / selectedRequest.budget.approved) > 0.9 ? 'bg-red-600' :
                                    (selectedRequest.budget.spent / selectedRequest.budget.approved) > 0.75 ? 'bg-orange-600' :
                                    'bg-green-600'
                                  }`}
                                  style={{ width: `${(selectedRequest.budget.spent / selectedRequest.budget.approved) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                          <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p className="text-sm text-gray-500">No budget allocated yet</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Progress Tab */}
                  <TabsContent value="progress" className="mt-0">
                    <div className="max-w-4xl mx-auto space-y-6">
                      {/* Current Sprint */}
                      {selectedRequest.currentSprint && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                          <h3 className="font-semibold text-gray-900 mb-4">Current Sprint</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{selectedRequest.currentSprint.name}</p>
                                <p className="text-sm text-gray-500">
                                  {selectedRequest.currentSprint.startDate} - {selectedRequest.currentSprint.endDate}
                                </p>
                              </div>
                              <Badge variant="secondary">
                                {selectedRequest.currentSprint.completedStoryPoints} / {selectedRequest.currentSprint.totalStoryPoints} points
                              </Badge>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-700">Sprint Progress</p>
                                <p className="text-sm font-medium">
                                  {Math.round((selectedRequest.currentSprint.completedStoryPoints / selectedRequest.currentSprint.totalStoryPoints) * 100)}%
                                </p>
                              </div>
                              <Progress value={(selectedRequest.currentSprint.completedStoryPoints / selectedRequest.currentSprint.totalStoryPoints) * 100} />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-2">Sprint Goals</p>
                              <ul className="space-y-1">
                                {selectedRequest.currentSprint.goals.map((goal, index) => (
                                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="text-orange-600">•</span>
                                    {goal}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Phases with Tasks */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Build Phases</h3>
                        <div className="space-y-4">
                          {selectedRequest.phases.map((phase) => (
                            <div key={phase.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <h4 className="font-medium text-gray-900">{phase.name}</h4>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    phase.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    phase.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {phase.status}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500">{phase.progress}%</p>
                              </div>
                              <Progress value={phase.progress} className="mb-3" />
                              {phase.tasks.length > 0 && (
                                <div className="space-y-2 mt-3 pt-3 border-t">
                                  {phase.tasks.map((task) => (
                                    <div key={task.id} className="flex items-center gap-2 text-sm">
                                      <input
                                        type="checkbox"
                                        checked={task.completed}
                                        readOnly
                                        className="rounded"
                                      />
                                      <span className={task.completed ? 'text-gray-500 line-through' : 'text-gray-700'}>
                                        {task.title}
                                      </span>
                                      {task.assignedTo && (
                                        <span className="text-xs text-gray-500">• {task.assignedTo}</span>
                                      )}
                                      {task.dueDate && (
                                        <span className="text-xs text-gray-500">• Due {task.dueDate}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Blockers */}
                      {selectedRequest.blockers.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                          <h3 className="font-semibold text-gray-900 mb-4">Blockers</h3>
                          <div className="space-y-3">
                            {selectedRequest.blockers.map((blocker) => (
                              <div key={blocker.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium text-gray-900">{blocker.title}</h4>
                                  <Badge variant={blocker.status === 'resolved' ? 'secondary' : 'destructive'}>
                                    {blocker.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{blocker.description}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                  <span className={`font-medium ${
                                    blocker.impact === 'high' ? 'text-red-600' :
                                    blocker.impact === 'medium' ? 'text-orange-600' :
                                    'text-yellow-600'
                                  }`}>
                                    {blocker.impact} impact
                                  </span>
                                  <span>Owner: {blocker.owner}</span>
                                  {blocker.supportTicketId && (
                                    <span>Ticket: {blocker.supportTicketId}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Deliverables Tab */}
                  <TabsContent value="deliverables" className="mt-0">
                    <div className="max-w-4xl mx-auto">
                      {selectedRequest.deliverables.length > 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Deliverables</h3>
                            <Badge variant="secondary">
                              {selectedRequest.deliverables.filter(d => d.completed).length} / {selectedRequest.deliverables.length} Complete
                            </Badge>
                          </div>
                          <div className="space-y-3">
                            {selectedRequest.deliverables.map((deliverable) => (
                              <div key={deliverable.id} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-3">
                                    <Package className="w-4 h-4 text-gray-400" />
                                    <div>
                                      <h4 className="font-medium text-gray-900">{deliverable.name}</h4>
                                      <p className="text-xs text-gray-500 capitalize">{deliverable.type}</p>
                                    </div>
                                  </div>
                                  <Badge variant={deliverable.completed ? 'default' : 'secondary'}>
                                    {deliverable.completed ? 'Complete' : 'Pending'}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                                  <span>Due: {deliverable.dueDate}</span>
                                  {deliverable.documentUrl && (
                                    <a href={deliverable.documentUrl} className="text-orange-600 hover:underline">
                                      View Document
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                          <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p className="text-sm text-gray-500">No deliverables defined yet</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Documents Tab */}
                  <TabsContent value="documents" className="mt-0">
                    <div className="max-w-4xl mx-auto">
                      {selectedRequest.documents.length > 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                          <h3 className="font-semibold text-gray-900 mb-4">Documents</h3>
                          <div className="space-y-3">
                            {selectedRequest.documents.map((doc) => (
                              <div key={doc.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-gray-400" />
                                    <div>
                                      <h4 className="font-medium text-gray-900">{doc.name}</h4>
                                      <p className="text-xs text-gray-500">
                                        {doc.type.toUpperCase()} • {(doc.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    Download
                                  </Button>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-600 mt-2 ml-8">
                                  <span>Uploaded by {doc.uploadedBy}</span>
                                  <span>•</span>
                                  <span>{doc.uploadedAt}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p className="text-sm text-gray-500">No documents uploaded yet</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Activity Tab */}
                  <TabsContent value="activity" className="mt-0">
                    <div className="max-w-4xl mx-auto">
                      {selectedRequest.messages.length > 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                          <h3 className="font-semibold text-gray-900 mb-4">Activity Timeline</h3>
                          <div className="space-y-4">
                            {selectedRequest.messages.map((message) => (
                              <div key={message.id} className="flex gap-3">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-orange-600" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium text-sm text-gray-900">{message.sender}</p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(message.timestamp).toLocaleString()}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-700">{message.content}</p>
                                  {message.mentions.length > 0 && (
                                    <div className="flex gap-1 mt-2">
                                      {message.mentions.map((mention, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          @{mention}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p className="text-sm text-gray-500">No activity yet</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <Filter className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Build Request</h3>
              <p className="text-gray-500">Choose a request from the list to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
