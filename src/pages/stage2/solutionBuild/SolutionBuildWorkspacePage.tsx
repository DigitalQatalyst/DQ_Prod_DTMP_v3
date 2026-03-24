import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  AlertCircle,
  MessageSquare,
  Download,
  ExternalLink,
  Filter,
  FileText,
  Rocket,
  Activity,
  Users,
  X,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { buildRequests, deliveryTeams, type BuildRequest } from "@/data/solutionBuild";
import { BuildWorkspaceSidebar, type BuildWorkspaceTab } from "@/components/stage2/build/BuildWorkspacePanels";
import { BuildPhaseTimeline } from "@/components/stage2/build/BuildPhaseTimeline";

export default function SolutionBuildWorkspacePage() {
  const navigate = useNavigate();

  // State
  const [sbSearchQuery, setSbSearchQuery] = useState("");
  const [selectedBuildRequest, setSelectedBuildRequest] = useState<BuildRequest | null>(null);
  const [sbStatusFilter, setSbStatusFilter] = useState<string>("all");
  const [sbTypeFilter, setSbTypeFilter] = useState<string>("all");
  const [sbPriorityFilter, setSbPriorityFilter] = useState<string>("all");
  const [sbTeamFilter, setSbTeamFilter] = useState<string>("all");
  const [sbSortBy, setSbSortBy] = useState<"date-desc" | "date-asc" | "priority" | "progress">("date-desc");
  const [sbShowFilters, setSbShowFilters] = useState(false);
  const [allBuildRequests, setAllBuildRequests] = useState<BuildRequest[]>(buildRequests);
  const [sbExpandedSections, setSbExpandedSections] = useState<Record<string, boolean>>({
    businessNeed: true,
    progress: true,
    communication: true,
    deliverables: true,
  });
  const [leftView, setLeftView] = useState<BuildWorkspaceTab>("overview");
  const [uatSignOffMode, setUatSignOffMode] = useState<"idle" | "concern">("idle");
  const [uatConcernText, setUatConcernText] = useState("");

  // Load from localStorage (picks up any newly submitted requests)
  useEffect(() => {
    const loadRequests = () => {
      const stored: BuildRequest[] = JSON.parse(localStorage.getItem("buildRequests") || "[]");
      const combined = [...stored, ...buildRequests];
      setAllBuildRequests(combined);
      
      // Auto-select the newest request if it exists
      if (stored.length > 0 && !selectedBuildRequest) {
        setSelectedBuildRequest(stored[0]);
      }
    };
    loadRequests();
    window.addEventListener("buildRequestAdded", loadRequests);
    return () => window.removeEventListener("buildRequestAdded", loadRequests);
  }, []);

  // Filtered + sorted
  const filteredRequests = useMemo(() => {
    let filtered = allBuildRequests.filter(
      (r) => r.requestedBy === "Sarah Johnson" || r.requestedBy === "Current User"
    );
    if (sbSearchQuery) {
      const q = sbSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
      );
    }
    if (sbStatusFilter !== "all") filtered = filtered.filter((r) => r.status === sbStatusFilter);
    if (sbTypeFilter !== "all") filtered = filtered.filter((r) => r.type === sbTypeFilter);
    if (sbPriorityFilter !== "all") filtered = filtered.filter((r) => r.priority === sbPriorityFilter);
    if (sbTeamFilter !== "all") filtered = filtered.filter((r) => r.assignedTeam === sbTeamFilter);

    return [...filtered].sort((a, b) => {
      switch (sbSortBy) {
        case "date-desc": return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        case "date-asc": return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        case "priority": {
          const ord: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
          return (ord[a.priority] ?? 4) - (ord[b.priority] ?? 4);
        }
        case "progress": return b.progress - a.progress;
        default: return 0;
      }
    });
  }, [sbSearchQuery, sbStatusFilter, sbTypeFilter, sbPriorityFilter, sbTeamFilter, sbSortBy, allBuildRequests]);

  const activeFiltersCount = [sbStatusFilter, sbTypeFilter, sbPriorityFilter, sbTeamFilter].filter(
    (f) => f !== "all"
  ).length;

  const clearFilters = () => {
    setSbStatusFilter("all");
    setSbTypeFilter("all");
    setSbPriorityFilter("all");
    setSbTeamFilter("all");
  };

  const toggleSection = (section: string) =>
    setSbExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const handleSignOff = (action: "accepted" | "concern") => {
    if (!selectedBuildRequest) return;

    if (action === "accepted") {
      // Update request status to completed
      const updatedRequests = allBuildRequests.map((req) =>
        req.id === selectedBuildRequest.id
          ? {
              ...req,
              status: "deployed" as const,
              currentPhase: "Go-Live" as const,
              progress: 100,
              uatApproval: {
                approver: "Current User",
                approvedAt: new Date().toISOString(),
                feedback: "UAT approved - ready for Go-Live",
                approved: true,
              },
            }
          : req
      );
      setAllBuildRequests(updatedRequests);
      setSelectedBuildRequest(updatedRequests.find((r) => r.id === selectedBuildRequest.id) || null);
      
      // Update localStorage
      const stored = JSON.parse(localStorage.getItem("buildRequests") || "[]");
      const updatedStored = stored.map((req: BuildRequest) =>
        req.id === selectedBuildRequest.id
          ? updatedRequests.find((r) => r.id === selectedBuildRequest.id)
          : req
      );
      localStorage.setItem("buildRequests", JSON.stringify(updatedStored));
      
      alert("✅ UAT approved! Your solution is now moving to Go-Live.");
    } else {
      setUatSignOffMode("concern");
    }
  };

  const submitConcern = () => {
    if (!selectedBuildRequest || !uatConcernText.trim()) return;

    // Update request with concern
    const updatedRequests = allBuildRequests.map((req) =>
      req.id === selectedBuildRequest.id
        ? {
            ...req,
            status: "in-progress" as const,
            uatApproval: {
              approver: "Current User",
              rejectedAt: new Date().toISOString(),
              feedback: uatConcernText,
              approved: false,
            },
            messages: [
              {
                id: `msg-${Date.now()}`,
                sender: "Current User",
                content: `UAT Concern: ${uatConcernText}`,
                timestamp: new Date().toISOString(),
                mentions: [],
              },
              ...req.messages,
            ],
          }
        : req
    );
    setAllBuildRequests(updatedRequests);
    setSelectedBuildRequest(updatedRequests.find((r) => r.id === selectedBuildRequest.id) || null);
    
    // Update localStorage
    const stored = JSON.parse(localStorage.getItem("buildRequests") || "[]");
    const updatedStored = stored.map((req: BuildRequest) =>
      req.id === selectedBuildRequest.id
        ? updatedRequests.find((r) => r.id === selectedBuildRequest.id)
        : req
    );
    localStorage.setItem("buildRequests", JSON.stringify(updatedStored));
    
    setUatSignOffMode("idle");
    setUatConcernText("");
    alert("Your concern has been submitted to the delivery team.");
  };

  // Helpers
  const getStatusColor = (status: BuildRequest["status"]) => {
    const map: Record<string, string> = {
      intake: "bg-gray-100 text-gray-700",
      triage: "bg-blue-100 text-blue-700",
      queue: "bg-yellow-100 text-yellow-700",
      "in-progress": "bg-purple-100 text-purple-700",
      testing: "bg-orange-100 text-orange-700",
      deployed: "bg-green-100 text-green-700",
      closed: "bg-gray-100 text-gray-500",
    };
    return map[status] ?? "bg-gray-100 text-gray-600";
  };

  const getPriorityColor = (priority: BuildRequest["priority"]) => {
    const map: Record<string, string> = {
      critical: "text-red-600",
      high: "text-orange-600",
      medium: "text-yellow-600",
      low: "text-gray-600",
    };
    return map[priority] ?? "text-gray-600";
  };

  const getPhaseIcon = (status: string) => {
    if (status === "completed") return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (status === "in-progress") return <Circle className="w-5 h-5 text-blue-600 fill-blue-600" />;
    return <Circle className="w-5 h-5 text-gray-300" />;
  };

  const getStageCard = (request: BuildRequest) => {
    switch (request.status) {
      case "intake":
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Request Received</h3>
                <p className="text-sm text-blue-700">
                  Your request is under review. The TO team will assess it within 2 business days.
                </p>
              </div>
            </div>
          </div>
        );
      case "triage":
        return request.toAssessment ? (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
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
                    <p className="text-purple-900 capitalize">
                      {request.toAssessment.recommendedTeam.replace("team-", "Team ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null;
      case "queue":
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 mb-1">Approved & Queued</h3>
                <p className="text-sm text-yellow-700 mb-3">
                  Your request has been approved and assigned to{" "}
                  {request.assignedTeam?.replace("team-", "Team ")}.
                </p>
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
                      <p className="text-yellow-900">
                        {new Date(request.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case "in-progress":
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
                          {request.currentSprint.goals.map((g, i) => (
                            <li key={i}>{g}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-medium">Progress:</span>
                        <div className="flex-1 bg-blue-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${
                                (request.currentSprint.completedStoryPoints /
                                  request.currentSprint.totalStoryPoints) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-blue-900">
                          {request.currentSprint.completedStoryPoints}/
                          {request.currentSprint.totalStoryPoints}
                        </span>
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
      case "testing":
        return (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 mb-1">Testing Phase</h3>
                <p className="text-sm text-orange-700 mb-3">
                  Your solution is being tested and prepared for deployment.
                </p>
                {request.estimatedDelivery && (
                  <div className="text-sm">
                    <span className="text-orange-600 font-medium">Expected Deployment:</span>
                    <p className="text-orange-900">
                      {new Date(request.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "deployed":
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 mb-2">🎉 Solution Deployed!</h3>
                <p className="text-sm text-green-700 mb-3">Your solution is now live and ready to use.</p>
                {request.createdAppId && (
                  <button
                    onClick={() => navigate(`/stage2/solution-build/${request.createdAppId}`)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  >
                    <ExternalLink className="w-4 h-4" /> Launch Solution
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-80 border-r bg-gray-50 flex-shrink-0 overflow-y-auto p-4">
        <BuildWorkspaceSidebar
          activeTab={leftView}
          onTabChange={setLeftView}
          searchQuery={sbSearchQuery}
          onSearchChange={setSbSearchQuery}
          statusFilter={sbStatusFilter}
          onStatusFilterChange={setSbStatusFilter}
          priorityFilter={sbPriorityFilter}
          onPriorityFilterChange={setSbPriorityFilter}
          showFilters={sbShowFilters}
          onToggleFilters={() => setSbShowFilters(!sbShowFilters)}
          activeFiltersCount={activeFiltersCount}
          onClearFilters={clearFilters}
          requests={filteredRequests}
          selectedRequest={selectedBuildRequest}
          onSelectRequest={setSelectedBuildRequest}
          getStatusColor={getStatusColor}
        />
      </div>

      {/* Main content - request detail */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedBuildRequest ? (
          <>
            {/* Detail header */}
            <div className="bg-white border-b px-6 py-4 flex-shrink-0">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-semibold text-gray-900">{selectedBuildRequest.name}</h2>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                    selectedBuildRequest.status
                  )}`}
                >
                  {selectedBuildRequest.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {selectedBuildRequest.id} · {selectedBuildRequest.department} · Submitted{" "}
                {new Date(selectedBuildRequest.submittedAt).toLocaleDateString()}
              </p>
              <div className="mt-3">
                <Progress value={selectedBuildRequest.progress} className="h-2" />
              </div>
            </div>

            {/* Detail body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl space-y-6">
                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg border p-4">
                    <p className="text-sm text-gray-500 mb-1">Progress</p>
                    <p className="text-2xl font-semibold">{selectedBuildRequest.progress}%</p>
                  </div>
                  <div className="bg-white rounded-lg border p-4">
                    <p className="text-sm text-gray-500 mb-1">Type</p>
                    <p className="text-lg font-semibold capitalize">{selectedBuildRequest.type}</p>
                  </div>
                  <div className="bg-white rounded-lg border p-4">
                    <p className="text-sm text-gray-500 mb-1">Priority</p>
                    <p
                      className={`text-lg font-semibold capitalize ${getPriorityColor(
                        selectedBuildRequest.priority
                      )}`}
                    >
                      {selectedBuildRequest.priority}
                    </p>
                  </div>
                </div>

                {/* Stage-specific card */}
                {getStageCard(selectedBuildRequest)}

                {/* Phase Timeline */}
                {selectedBuildRequest.currentPhase && (
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Build Lifecycle</h3>
                    <BuildPhaseTimeline currentPhase={selectedBuildRequest.currentPhase} />
                  </div>
                )}

                {/* UAT Sign-off Flow */}
                {(() => {
                  console.log('Debug UAT Card:', {
                    currentPhase: selectedBuildRequest.currentPhase,
                    hasUatApproval: !!selectedBuildRequest.uatApproval,
                    shouldShow: selectedBuildRequest.currentPhase === "UAT" && !selectedBuildRequest.uatApproval
                  });
                  return selectedBuildRequest.currentPhase === "UAT" && !selectedBuildRequest.uatApproval;
                })() && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-amber-900 mb-1">Your build is ready for testing</h4>
                        <p className="text-sm text-amber-800 mb-4">
                          The delivery team has completed the build and it is ready for your User Acceptance Testing.
                          Please test the solution in the provided environment and confirm acceptance or raise any concerns.
                        </p>
                        {uatSignOffMode === "idle" ? (
                          <div className="flex gap-3">
                            <Button
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleSignOff("accepted")}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Accept & Confirm Go-Live
                            </Button>
                            <Button variant="outline" onClick={() => handleSignOff("concern")}>
                              Raise a Concern
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-amber-900 mb-2 block">
                                Describe your concern:
                              </label>
                              <Textarea
                                value={uatConcernText}
                                onChange={(e) => setUatConcernText(e.target.value)}
                                placeholder="Please describe the issue or concern you've identified during UAT..."
                                className="min-h-[100px] bg-white"
                              />
                            </div>
                            <div className="flex gap-3">
                              <Button
                                onClick={submitConcern}
                                disabled={!uatConcernText.trim()}
                                className="bg-amber-600 hover:bg-amber-700 text-white"
                              >
                                Submit Concern
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  setUatSignOffMode("idle");
                                  setUatConcernText("");
                                }}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Team */}
                {selectedBuildRequest.assignedTeam && (() => {
                  const assignedTeam = deliveryTeams.find(t => t.id === selectedBuildRequest.assignedTeam);
                  return assignedTeam ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-primary-navy mb-2">Your Delivery Team</h4>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Team {assignedTeam.name}</p>
                          <p className="text-xs text-muted-foreground">{assignedTeam.specialty}</p>
                          <p className="text-xs text-muted-foreground">Lead: {assignedTeam.lead}</p>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Business Need */}
                <div className="bg-white rounded-lg border">
                  <button
                    onClick={() => toggleSection("businessNeed")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <h3 className="font-semibold text-gray-900">Business Need</h3>
                    {sbExpandedSections.businessNeed ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {sbExpandedSections.businessNeed && (
                    <div className="px-4 pb-4 border-t">
                      <p className="text-sm text-gray-700 mt-4">{selectedBuildRequest.businessNeed}</p>
                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        {selectedBuildRequest.targetDate && (
                          <div>
                            <span className="text-gray-500">Target Date:</span>
                            <p className="font-medium">
                              {new Date(selectedBuildRequest.targetDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {selectedBuildRequest.assignedTeam && (
                          <div>
                            <span className="text-gray-500">Assigned Team:</span>
                            <p className="font-medium capitalize">
                              {selectedBuildRequest.assignedTeam.replace("team-", "Team ")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress & Timeline */}
                {selectedBuildRequest.status !== "intake" && (
                  <div className="bg-white rounded-lg border">
                    <button
                      onClick={() => toggleSection("progress")}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <h3 className="font-semibold text-gray-900">Progress & Timeline</h3>
                      {sbExpandedSections.progress ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    {sbExpandedSections.progress && (
                      <div className="px-4 pb-4 border-t">
                        <div className="space-y-3 mt-4">
                          {selectedBuildRequest.phases.map((phase) => (
                            <div key={phase.id} className="flex items-start gap-3">
                              {getPhaseIcon(phase.status)}
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-sm">{phase.name}</span>
                                  <span className="text-sm text-gray-500">{phase.progress}%</span>
                                </div>
                                {phase.progress > 0 && (
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-blue-600 h-1.5 rounded-full"
                                      style={{ width: `${phase.progress}%` }}
                                    />
                                  </div>
                                )}
                                {phase.tasks && phase.tasks.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {phase.tasks.map((task) => (
                                      <div
                                        key={task.id}
                                        className="flex items-center gap-2 text-xs text-gray-600"
                                      >
                                        {task.completed ? (
                                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                                        ) : (
                                          <Circle className="w-3 h-3 text-gray-400 flex-shrink-0" />
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

                {/* Team & Communication */}
                {(selectedBuildRequest.messages.length > 0 ||
                  selectedBuildRequest.blockers.length > 0) && (
                  <div className="bg-white rounded-lg border">
                    <button
                      onClick={() => toggleSection("communication")}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">Team & Communication</h3>
                        {selectedBuildRequest.blockers.length > 0 && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                            {selectedBuildRequest.blockers.length} blocker
                            {selectedBuildRequest.blockers.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      {sbExpandedSections.communication ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    {sbExpandedSections.communication && (
                      <div className="px-4 pb-4 border-t">
                        {selectedBuildRequest.blockers.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">
                              Active Blockers
                            </h4>
                            {selectedBuildRequest.blockers.map((blocker) => (
                              <div
                                key={blocker.id}
                                className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2"
                              >
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="font-medium text-sm text-red-900">{blocker.title}</p>
                                    <p className="text-xs text-red-700 mt-1">{blocker.description}</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-red-600">
                                      <span>Impact: {blocker.impact}</span>
                                      <span>·</span>
                                      <span>Owner: {blocker.owner}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {selectedBuildRequest.messages.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">
                              Recent Updates
                            </h4>
                            <div className="space-y-2">
                              {selectedBuildRequest.messages.map((message) => (
                                <div key={message.id} className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-start gap-2">
                                    <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
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

                {/* Deliverables & Documents */}
                {(selectedBuildRequest.deliverables.length > 0 ||
                  selectedBuildRequest.documents.length > 0) && (
                  <div className="bg-white rounded-lg border">
                    <button
                      onClick={() => toggleSection("deliverables")}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <h3 className="font-semibold text-gray-900">Deliverables & Documents</h3>
                      {sbExpandedSections.deliverables ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    {sbExpandedSections.deliverables && (
                      <div className="px-4 pb-4 border-t">
                        {selectedBuildRequest.deliverables.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">
                              Expected Deliverables
                            </h4>
                            <div className="space-y-2">
                              {selectedBuildRequest.deliverables.map((d) => (
                                <div
                                  key={d.id}
                                  className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                                >
                                  {d.completed ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  )}
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{d.name}</p>
                                    <p className="text-xs text-gray-500">
                                      Due: {new Date(d.dueDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedBuildRequest.documents.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Documents</h4>
                            <div className="space-y-2">
                              {selectedBuildRequest.documents.map((doc) => (
                                <div
                                  key={doc.id}
                                  className="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100"
                                >
                                  <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{doc.name}</p>
                                    <p className="text-xs text-gray-500">
                                      Uploaded {new Date(doc.uploadedAt).toLocaleDateString()} by{" "}
                                      {doc.uploadedBy}
                                    </p>
                                  </div>
                                  <button className="p-1 hover:bg-gray-200 rounded flex-shrink-0">
                                    <Download className="w-4 h-4 text-gray-500" />
                                  </button>
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
              <Filter className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 font-medium">Select a request to view details</p>
              <p className="text-sm text-gray-400 mt-1">
                {filteredRequests.length} request{filteredRequests.length !== 1 ? "s" : ""} in your
                queue
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
