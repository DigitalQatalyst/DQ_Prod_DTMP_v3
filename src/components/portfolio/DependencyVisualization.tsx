import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Network, Database, Cloud, Server, Layers, AlertCircle, Info, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ActionFormModal, ActionFormData } from "./ActionFormModal";
import { LoginModal } from "@/components/learningCenter/LoginModal";
import { useAuth } from "@/contexts/AuthContext";
import { addRequest } from "@/data/requests/mockRequests";

interface DependencyNode {
  id: string;
  name: string;
  type: "application" | "infrastructure" | "data" | "vendor" | "capability" | "project" | "resource" | "deliverable";
  criticality: "critical" | "high" | "medium" | "low";
  upstreamCount: number;
  downstreamCount: number;
}

interface DependencyVisualizationProps {
  context?: 'application' | 'project';
}

export function DependencyVisualization({ context = 'application' }: DependencyVisualizationProps) {
  const [selectedNode, setSelectedNode] = useState<DependencyNode | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [showFullNetwork, setShowFullNetwork] = useState(false);
  const [showActionForm, setShowActionForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [actionContext, setActionContext] = useState<any>(null);
  const [pendingActionData, setPendingActionData] = useState<ActionFormData | null>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const isApplication = context === 'application';

  const mockNodes: DependencyNode[] = isApplication ? [
    { id: "crm", name: "CRM System", type: "application", criticality: "critical", upstreamCount: 3, downstreamCount: 8 },
    { id: "erp", name: "ERP Platform", type: "application", criticality: "critical", upstreamCount: 5, downstreamCount: 12 },
    { id: "payment", name: "Payment Gateway", type: "application", criticality: "critical", upstreamCount: 2, downstreamCount: 4 },
    { id: "analytics", name: "Analytics Engine", type: "application", criticality: "high", upstreamCount: 6, downstreamCount: 2 },
    { id: "database", name: "Central Database", type: "infrastructure", criticality: "critical", upstreamCount: 0, downstreamCount: 15 },
    { id: "api-gateway", name: "API Gateway", type: "infrastructure", criticality: "high", upstreamCount: 1, downstreamCount: 10 }
  ] : [
    { id: "digital-transform", name: "Digital Transformation", type: "project", criticality: "critical", upstreamCount: 2, downstreamCount: 5 },
    { id: "cloud-migration", name: "Cloud Migration", type: "project", criticality: "critical", upstreamCount: 3, downstreamCount: 4 },
    { id: "erp-upgrade", name: "ERP Upgrade", type: "project", criticality: "high", upstreamCount: 4, downstreamCount: 3 },
    { id: "mobile-app", name: "Mobile App Dev", type: "project", criticality: "high", upstreamCount: 2, downstreamCount: 2 },
    { id: "dev-team", name: "Development Team", type: "resource", criticality: "critical", upstreamCount: 0, downstreamCount: 8 },
    { id: "budget-pool", name: "IT Budget Pool", type: "resource", criticality: "high", upstreamCount: 0, downstreamCount: 6 }
  ];

  const typeConfig = isApplication ? {
    application: { icon: Layers, color: "blue", label: "Application" },
    infrastructure: { icon: Server, color: "purple", label: "Infrastructure" },
    data: { icon: Database, color: "green", label: "Data Asset" },
    vendor: { icon: Cloud, color: "orange", label: "Vendor Service" },
    capability: { icon: Network, color: "pink", label: "Business Capability" }
  } : {
    project: { icon: Layers, color: "blue", label: "Project" },
    resource: { icon: Users, color: "purple", label: "Resource" },
    deliverable: { icon: Calendar, color: "green", label: "Deliverable" },
    vendor: { icon: Cloud, color: "orange", label: "Vendor" },
    capability: { icon: Network, color: "pink", label: "Capability" }
  };

const criticalityConfig = {
  critical: { color: "red", label: "Critical" },
  high: { color: "orange", label: "High" },
  medium: { color: "yellow", label: "Medium" },
  low: { color: "gray", label: "Low" }
};

  const handleRequestAnalysis = () => {
    // Show action form immediately
    setActionContext({
      type: "request-analysis" as const,
      title: "Dependency Impact Analysis",
      description: "Request detailed analysis of dependency impacts for retirement, modification, or migration planning.",
      severity: "high" as const,
      relatedItem: "CRM System"
    });
    setShowActionForm(true);
  };

  const submitDependencyAnalysisRequest = (formData: ActionFormData) => {
    const mappedPriority =
      formData.priority === "normal" ? "medium" : formData.priority;
    const request = addRequest({
      userId: user?.id || "user-123",
      userName: user?.name || "John Doe",
      userEmail: user?.email || "john.doe@company.com",
      serviceName: isApplication
        ? "Application Dependency Mapping"
        : "Project Dependency & Resource Mapping",
      serviceId: isApplication ? "application-dependencies" : "project-dependencies",
      requestType: "Dependency Impact Analysis Request",
      requestCategory: "deep-dive-analysis",
      priority: mappedPriority,
      businessJustification: formData.description,
      desiredCompletionDate: formData.targetDate,
      additionalRequirements: formData.actionPlan,
      specificData: {
        actionType: formData.actionType,
        notifyStakeholders: formData.notifyStakeholders,
        requestBudget: formData.requestBudget,
        budgetAmount: formData.budgetAmount,
        additionalNotes: formData.additionalNotes,
        context: actionContext,
      },
    });

    navigate("/stage2/portfolio-management", {
      state: {
        marketplace: "portfolio-management",
        tab: "my-requests",
        cardId: request.serviceId,
        serviceName: request.serviceName,
        submittedRequestId: request.id,
      },
    });
  };

  const handleActionSubmit = (formData: ActionFormData) => {
    // Check if user is authenticated before submitting
    if (!isAuthenticated) {
      // Show login modal
      setShowActionForm(false);
      setPendingActionData(formData);
      setShowLoginModal(true);
      return;
    }

    submitDependencyAnalysisRequest(formData);
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isApplication ? 'Application Dependency Mapping & Impact Analysis' : 'Project Dependency & Resource Mapping'}
          </h2>
          <p className="text-gray-600">
            {isApplication 
              ? 'Visualize relationships between applications, infrastructure, data assets, vendors, and business capabilities'
              : 'Visualize project dependencies, resource sharing, and cross-project impacts'}
          </p>
        </div>

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "map" | "list")}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="map">Dependency Map</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowFullNetwork(true)}
            >
              <Network className="w-4 h-4" />
              View Full Network Graph
            </Button>
          </div>

          <TabsContent value="map" className="mt-0">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              {/* Simplified Dependency Visualization */}
              <div className="relative">
                {/* Central Node */}
                <div className="flex justify-center mb-12">
                  <div 
                    className="relative cursor-pointer group"
                    onClick={() => setSelectedNode(mockNodes[0])}
                  >
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all">
                      <Layers className="w-8 h-8 mb-2" />
                      <span className="text-sm font-semibold text-center px-2">CRM System</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      C
                    </div>
                  </div>
                </div>

                {/* Upstream Dependencies */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">↑</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">Upstream Dependencies (3)</h3>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-sm">Central Database</span>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700 text-xs">Infrastructure</Badge>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Cloud className="w-5 h-5 text-orange-600" />
                        <span className="font-medium text-sm">Auth Service</span>
                      </div>
                      <Badge className="bg-orange-100 text-orange-700 text-xs">Vendor</Badge>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Server className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-sm">API Gateway</span>
                      </div>
                      <Badge className="bg-green-100 text-green-700 text-xs">Infrastructure</Badge>
                    </div>
                  </div>
                </div>

                {/* Downstream Dependencies */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">↓</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">Downstream Dependencies (8)</h3>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3">
                    {["Sales Portal", "Mobile App", "Reporting", "Analytics", "Email Service", "Notification", "Billing", "Support"].map((name, idx) => (
                      <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-xs">{name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact Assessment */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-900 mb-2">Impact Assessment</h4>
                      <p className="text-sm text-yellow-800 mb-3">
                        Retiring or modifying this application will impact 8 downstream systems and requires coordination with 3 upstream dependencies.
                      </p>
                      <div className="flex gap-2 flex-wrap mb-4">
                        <Badge className="bg-yellow-100 text-yellow-800">High Impact</Badge>
                        <Badge className="bg-yellow-100 text-yellow-800">11 Total Dependencies</Badge>
                        <Badge className="bg-yellow-100 text-yellow-800">3-6 Month Timeline</Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleRequestAnalysis}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Request Impact Analysis
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criticality</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upstream</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Downstream</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockNodes.map((node) => {
                    const typeConf = typeConfig[node.type];
                    const TypeIcon = typeConf.icon;
                    const critConf = criticalityConfig[node.criticality];
                    const totalDeps = node.upstreamCount + node.downstreamCount;

                    return (
                      <tr key={node.id} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 bg-${typeConf.color}-100 rounded-lg flex items-center justify-center`}>
                              <TypeIcon className={`w-4 h-4 text-${typeConf.color}-600`} />
                            </div>
                            <span className="font-medium text-gray-900">{node.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={`bg-${typeConf.color}-100 text-${typeConf.color}-700`}>
                            {typeConf.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={`bg-${critConf.color}-100 text-${critConf.color}-700`}>
                            {critConf.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-semibold text-gray-900">{node.upstreamCount}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-semibold text-gray-900">{node.downstreamCount}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{totalDeps}</span>
                            {totalDeps > 10 && (
                              <AlertCircle className="w-4 h-4 text-orange-500" />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            {Object.entries(typeConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-6 h-6 bg-${config.color}-100 rounded flex items-center justify-center`}>
                    <Icon className={`w-3 h-3 text-${config.color}-600`} />
                  </div>
                  <span className="text-gray-600">{config.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full Network Graph Modal */}
      <Dialog open={showFullNetwork} onOpenChange={setShowFullNetwork}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isApplication ? 'Full Application Dependency Network' : 'Full Project Dependency Network'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "map" | "list")}>
              <TabsList>
                <TabsTrigger value="map">Network Map</TabsTrigger>
                <TabsTrigger value="list">Detailed List</TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="mt-6">
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  {/* Enhanced Network Visualization */}
                  <div className="relative min-h-[600px]">
                    {/* Central Nodes */}
                    <div className="grid grid-cols-3 gap-8 mb-12">
                      {mockNodes.slice(0, 3).map((node) => {
                        const typeConf = typeConfig[node.type];
                        const TypeIcon = typeConf.icon;
                        const critConf = criticalityConfig[node.criticality];

                        return (
                          <div 
                            key={node.id}
                            className="relative cursor-pointer group"
                            onClick={() => setSelectedNode(node)}
                          >
                            <div className={`w-full h-32 bg-gradient-to-br from-${typeConf.color}-500 to-${typeConf.color}-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all`}>
                              <TypeIcon className="w-8 h-8 mb-2" />
                              <span className="text-sm font-semibold text-center px-2">{node.name}</span>
                              <div className="flex gap-2 mt-2 text-xs">
                                <span>↑{node.upstreamCount}</span>
                                <span>↓{node.downstreamCount}</span>
                              </div>
                            </div>
                            <div className={`absolute -top-2 -right-2 w-6 h-6 bg-${critConf.color}-500 rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                              {node.criticality[0].toUpperCase()}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Connection Lines Visualization */}
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Upstream Dependencies</h4>
                        <div className="space-y-3">
                          {mockNodes.slice(3).map((node) => {
                            const typeConf = typeConfig[node.type];
                            const TypeIcon = typeConf.icon;

                            return (
                              <div key={node.id} className={`bg-${typeConf.color}-50 border border-${typeConf.color}-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer`}>
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 bg-${typeConf.color}-100 rounded-lg flex items-center justify-center`}>
                                    <TypeIcon className={`w-5 h-5 text-${typeConf.color}-600`} />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{node.name}</p>
                                    <p className="text-xs text-gray-600">{typeConf.label}</p>
                                  </div>
                                  <Badge className={`bg-${typeConf.color}-100 text-${typeConf.color}-700 text-xs`}>
                                    {node.upstreamCount + node.downstreamCount} deps
                                  </Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Downstream Dependencies</h4>
                        <div className="space-y-3">
                          {["Sales Portal", "Mobile App", "Reporting Dashboard", "Analytics Engine", "Email Service", "Notification System"].map((name, idx) => (
                            <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Layers className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{name}</p>
                                  <p className="text-xs text-gray-600">Application</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Impact Summary */}
                    <div className="mt-8 bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-orange-900 mb-2">Network Impact Analysis</h4>
                          <p className="text-sm text-orange-800 mb-3">
                            This network shows {mockNodes.length} critical nodes with {mockNodes.reduce((sum, n) => sum + n.upstreamCount + n.downstreamCount, 0)} total dependencies. 
                            Changes to any critical node will have cascading effects across the network.
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            <Badge className="bg-orange-100 text-orange-800">High Complexity</Badge>
                            <Badge className="bg-orange-100 text-orange-800">{mockNodes.filter(n => n.criticality === 'critical').length} Critical Nodes</Badge>
                            <Badge className="bg-orange-100 text-orange-800">Requires Coordination</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="list" className="mt-6">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criticality</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upstream</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Downstream</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Impact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockNodes.map((node) => {
                        const typeConf = typeConfig[node.type];
                        const TypeIcon = typeConf.icon;
                        const critConf = criticalityConfig[node.criticality];
                        const totalDeps = node.upstreamCount + node.downstreamCount;

                        return (
                          <tr key={node.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 bg-${typeConf.color}-100 rounded-lg flex items-center justify-center`}>
                                  <TypeIcon className={`w-4 h-4 text-${typeConf.color}-600`} />
                                </div>
                                <span className="font-medium text-gray-900">{node.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={`bg-${typeConf.color}-100 text-${typeConf.color}-700`}>
                                {typeConf.label}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={`bg-${critConf.color}-100 text-${critConf.color}-700`}>
                                {critConf.label}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="font-semibold text-gray-900">{node.upstreamCount}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="font-semibold text-gray-900">{node.downstreamCount}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{totalDeps}</span>
                                {totalDeps > 10 && (
                                  <AlertCircle className="w-4 h-4 text-orange-500" />
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Form Modal */}
      {actionContext && (
        <ActionFormModal
          isOpen={showActionForm}
          onClose={() => {
            setShowActionForm(false);
            setActionContext(null);
          }}
          context={actionContext}
          onSubmit={handleActionSubmit}
        />
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        context={{
          marketplace: "portfolio-management",
          tab: context,
          cardId: "dependency-visualization",
          serviceName: isApplication ? "Application Dependency Mapping" : "Project Dependency & Resource Mapping",
          action: "request analysis"
        }}
        onLoginSuccess={() => {
          if (pendingActionData) {
            submitDependencyAnalysisRequest(pendingActionData);
            setPendingActionData(null);
            return;
          }
          navigate("/stage2/portfolio-management", {
            state: {
              marketplace: "portfolio-management",
              tab: "my-requests",
            },
          });
        }}
      />
    </section>
  );
}
