import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { type BuildRequest } from "@/data/solutionBuild";

// --- Sidebar Component ---

interface BuildWorkspaceSidebarProps {
    requests: BuildRequest[];
    activeRequestId: string | null;
    onSelectRequest: (id: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    priorityFilter: string;
    setPriorityFilter: (priority: string) => void;
}

export const BuildWorkspaceSidebar: React.FC<BuildWorkspaceSidebarProps> = ({
    requests,
    activeRequestId,
    onSelectRequest,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
}) => {
    const [showFilters, setShowFilters] = useState(false);

    const activeFiltersCount = [statusFilter, priorityFilter].filter(
        (f) => f !== "all"
    ).length;

    const clearFilters = () => {
        setStatusFilter("all");
        setPriorityFilter("all");
    };

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

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b flex-shrink-0">
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        placeholder="Search requests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 h-9 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="h-7 px-2 text-xs flex items-center gap-1 text-gray-600 hover:bg-gray-100 rounded"
                >
                    <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
                    Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </button>
                {showFilters && (
                    <div className="mt-2 space-y-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full h-8 text-xs border border-gray-300 rounded px-2"
                        >
                            <option value="all">All Statuses</option>
                            <option value="intake">Intake</option>
                            <option value="triage">Triage</option>
                            <option value="queue">Queue</option>
                            <option value="in-progress">In Progress</option>
                            <option value="testing">Testing</option>
                            <option value="deployed">Deployed</option>
                            <option value="closed">Closed</option>
                        </select>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="w-full h-8 text-xs border border-gray-300 rounded px-2"
                        >
                            <option value="all">All Priorities</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                        {activeFiltersCount > 0 && (
                            <button onClick={clearFilters} className="text-xs text-orange-600 hover:underline">
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto">
                {requests.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        <Filter className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No requests found</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {requests.map((request) => (
                            <button
                                key={request.id}
                                onClick={() => onSelectRequest(request.id)}
                                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${activeRequestId === request.id
                                        ? "bg-orange-50 border-l-4 border-orange-600"
                                        : ""
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-medium text-sm text-gray-900 truncate flex-1 mr-2">
                                        {request.name}
                                    </h4>
                                    <span
                                        className={`flex-shrink-0 px-2 py-0.5 text-xs rounded-full ${getStatusColor(
                                            request.status
                                        )}`}
                                    >
                                        {request.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">
                                    {request.id} · {request.department}
                                </p>
                                <Progress value={request.progress} className="h-1.5" />
                                <p className="text-xs text-gray-500 mt-1">{request.progress}% complete</p>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Content Component ---

interface BuildWorkspaceMainProps {
    selectedRequest: BuildRequest | null;
}

export const BuildWorkspaceMain: React.FC<BuildWorkspaceMainProps> = ({
    selectedRequest,
}) => {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        businessNeed: true,
        progress: true,
        communication: true,
        deliverables: true,
    });

    const toggleSection = (section: string) =>
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

    // Helpers copied from SolutionBuildWorkspacePage
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

    const renderStageCard = (request: BuildRequest) => {
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
                                                            width: `${(request.currentSprint.completedStoryPoints /
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
                                {/* Note: Navigate logic would need to be handled via props or router if active */}
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    if (!selectedRequest) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Filter className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 font-medium">Select a request to view details</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50 overflow-hidden h-full">
            {/* Detail header */}
            <div className="bg-white border-b px-6 py-4 flex-shrink-0">
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">{selectedRequest.name}</h2>
                    <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            selectedRequest.status
                        )}`}
                    >
                        {selectedRequest.status}
                    </span>
                </div>
                <p className="text-sm text-gray-500">
                    {selectedRequest.id} · {selectedRequest.department} · Submitted{" "}
                    {new Date(selectedRequest.submittedAt).toLocaleDateString()}
                </p>
                <div className="mt-3">
                    <Progress value={selectedRequest.progress} className="h-2" />
                </div>
            </div>

            {/* Detail body */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl space-y-6">
                    {/* Quick stats */}
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
                            <p
                                className={`text-lg font-semibold capitalize ${getPriorityColor(
                                    selectedRequest.priority
                                )}`}
                            >
                                {selectedRequest.priority}
                            </p>
                        </div>
                    </div>

                    {/* Stage-specific card */}
                    {renderStageCard(selectedRequest)}

                    {/* Business Need */}
                    <div className="bg-white rounded-lg border">
                        <button
                            onClick={() => toggleSection("businessNeed")}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                        >
                            <h3 className="font-semibold text-gray-900">Business Need</h3>
                            {expandedSections.businessNeed ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        {expandedSections.businessNeed && (
                            <div className="px-4 pb-4 border-t">
                                <p className="text-sm text-gray-700 mt-4">{selectedRequest.businessNeed}</p>
                                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                    {selectedRequest.targetDate && (
                                        <div>
                                            <span className="text-gray-500">Target Date:</span>
                                            <p className="font-medium">
                                                {new Date(selectedRequest.targetDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                    {selectedRequest.assignedTeam && (
                                        <div>
                                            <span className="text-gray-500">Assigned Team:</span>
                                            <p className="font-medium capitalize">
                                                {selectedRequest.assignedTeam.replace("team-", "Team ")}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Progress & Timeline */}
                    {selectedRequest.status !== "intake" && (
                        <div className="bg-white rounded-lg border">
                            <button
                                onClick={() => toggleSection("progress")}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                            >
                                <h3 className="font-semibold text-gray-900">Progress & Timeline</h3>
                                {expandedSections.progress ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
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
                    {(selectedRequest.messages.length > 0 ||
                        selectedRequest.blockers.length > 0) && (
                            <div className="bg-white rounded-lg border">
                                <button
                                    onClick={() => toggleSection("communication")}
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900">Team & Communication</h3>
                                        {selectedRequest.blockers.length > 0 && (
                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                                {selectedRequest.blockers.length} blocker
                                                {selectedRequest.blockers.length > 1 ? "s" : ""}
                                            </span>
                                        )}
                                    </div>
                                    {expandedSections.communication ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                                {expandedSections.communication && (
                                    <div className="px-4 pb-4 border-t">
                                        {selectedRequest.blockers.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                                    Active Blockers
                                                </h4>
                                                {selectedRequest.blockers.map((blocker) => (
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
                                        {selectedRequest.messages.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                                    Recent Updates
                                                </h4>
                                                <div className="space-y-2">
                                                    {selectedRequest.messages.map((message) => (
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
                    {(selectedRequest.deliverables.length > 0 ||
                        selectedRequest.documents.length > 0) && (
                            <div className="bg-white rounded-lg border">
                                <button
                                    onClick={() => toggleSection("deliverables")}
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                                >
                                    <h3 className="font-semibold text-gray-900">Deliverables & Documents</h3>
                                    {expandedSections.deliverables ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                                {expandedSections.deliverables && (
                                    <div className="px-4 pb-4 border-t">
                                        {selectedRequest.deliverables.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                                    Expected Deliverables
                                                </h4>
                                                <div className="space-y-2">
                                                    {selectedRequest.deliverables.map((d) => (
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
                                        {selectedRequest.documents.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Documents</h4>
                                                <div className="space-y-2">
                                                    {selectedRequest.documents.map((doc) => (
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
        </div>
    );
};
