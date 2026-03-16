import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
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

interface BuildWorkspaceDetailProps {
  selectedRequest: BuildRequest | null;
}

export function BuildWorkspaceDetail({ selectedRequest }: BuildWorkspaceDetailProps) {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    businessNeed: true,
    progress: true,
    communication: true,
    deliverables: true,
  });

  const toggleSection = (section: string) =>
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

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

  if (!selectedRequest) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Filter className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">Select a request to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="bg-white border-b px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-xl font-semibold text-gray-900">{selectedRequest.name}</h2>
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedRequest.status)}`}>
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

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl space-y-6">
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
              <p className={`text-lg font-semibold capitalize ${getPriorityColor(selectedRequest.priority)}`}>
                {selectedRequest.priority}
              </p>
            </div>
          </div>

          {getStageCard(selectedRequest)}

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
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Requested:</span>
                <span className="font-medium">{new Date(selectedRequest.requestedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Target Date:</span>
                <span className="font-medium">{new Date(selectedRequest.targetDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Days Remaining:</span>
                <span className="font-medium">
                  {Math.ceil((new Date(selectedRequest.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-sm text-gray-700">{selectedRequest.description}</p>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Assigned Team</h3>
            <p className="text-sm text-gray-700">{selectedRequest.assignedTeam}</p>
          </div>

          <div className="bg-white rounded-lg border">
            <button
              onClick={() => toggleSection("requirements")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <h3 className="font-semibold text-gray-900">Requirements</h3>
              {expandedSections.requirements ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSections.requirements && (
              <div className="px-4 pb-4 border-t">
                <ul className="text-sm text-gray-700 mt-4 space-y-2 list-disc list-inside">
                  <li>Support 10,000+ concurrent users</li>
                  <li>99.9% uptime SLA requirement</li>
                  <li>Integration with existing authentication system</li>
                  <li>Mobile-responsive interface</li>
                  <li>GDPR and SOC2 compliance</li>
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border">
            <button
              onClick={() => toggleSection("technicalSpecs")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <h3 className="font-semibold text-gray-900">Technical Specifications</h3>
              {expandedSections.technicalSpecs ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSections.technicalSpecs && (
              <div className="px-4 pb-4 border-t">
                <div className="text-sm text-gray-700 mt-4 space-y-3">
                  <div>
                    <span className="font-medium">Architecture:</span> Microservices with API Gateway
                  </div>
                  <div>
                    <span className="font-medium">Tech Stack:</span> React, Node.js, PostgreSQL, Redis
                  </div>
                  <div>
                    <span className="font-medium">Infrastructure:</span> AWS ECS, RDS, ElastiCache
                  </div>
                  <div>
                    <span className="font-medium">Security:</span> OAuth 2.0, JWT tokens, encrypted at rest
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border">
            <button
              onClick={() => toggleSection("dependencies")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <h3 className="font-semibold text-gray-900">Dependencies</h3>
              {expandedSections.dependencies ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSections.dependencies && (
              <div className="px-4 pb-4 border-t">
                <ul className="text-sm text-gray-700 mt-4 space-y-2 list-disc list-inside">
                  <li>Identity Management System (v2.3+)</li>
                  <li>Data Warehouse API access</li>
                  <li>Network security group configuration</li>
                  <li>SSL certificate provisioning</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
