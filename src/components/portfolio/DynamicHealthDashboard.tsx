import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, DollarSign, Shield, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ActionFormModal, ActionFormData } from "./ActionFormModal";
import { LoginModal } from "@/components/learningCenter/LoginModal";
import { useAuth } from "@/contexts/AuthContext";
import { addRequest } from "@/data/requests/mockRequests";

interface HealthData {
  category: string;
  healthy: number;
  watch: number;
  atRisk: number;
  total: number;
}

interface DynamicHealthDashboardProps {
  context?: 'application' | 'project';
}

export function DynamicHealthDashboard({ context = 'application' }: DynamicHealthDashboardProps) {
  const [activeView, setActiveView] = useState<"overview" | "dimensions">("overview");
  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null);
  const [showActionForm, setShowActionForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [actionContext, setActionContext] = useState<any>(null);
  const [pendingActionData, setPendingActionData] = useState<ActionFormData | null>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Context-specific data
  const isApplication = context === 'application';
  
  const healthData: HealthData[] = isApplication ? [
    { category: "Business Applications", healthy: 142, watch: 58, atRisk: 47, total: 247 },
    { category: "Infrastructure Apps", healthy: 89, watch: 34, atRisk: 23, total: 146 },
    { category: "Data Applications", healthy: 67, watch: 28, atRisk: 15, total: 110 },
    { category: "Cloud Services", healthy: 78, watch: 12, atRisk: 8, total: 98 }
  ] : [
    { category: "Strategic Projects", healthy: 12, watch: 5, atRisk: 3, total: 20 },
    { category: "IT Projects", healthy: 18, watch: 8, atRisk: 4, total: 30 },
    { category: "Business Projects", healthy: 15, watch: 6, atRisk: 2, total: 23 },
    { category: "Innovation Projects", healthy: 8, watch: 3, atRisk: 1, total: 12 }
  ];

  const healthDimensions = isApplication ? [
    { name: "Business Fit", score: 78, trend: "up" as const, description: "Alignment with business objectives and strategic value", tooltip: "Measures how well applications support current business needs" },
    { name: "Technical Fitness", score: 72, trend: "up" as const, description: "Technical health, maintainability, and architecture quality", tooltip: "Evaluates code quality, architecture patterns, technical debt" },
    { name: "Support Risk", score: 65, trend: "down" as const, description: "Vendor support status, EOL risks, and skill availability", tooltip: "Assesses vendor support status, end-of-life risks" },
    { name: "Security Posture", score: 82, trend: "up" as const, description: "Security compliance, vulnerabilities, and risk exposure", tooltip: "Tracks security vulnerabilities, compliance status" }
  ] : [
    { name: "Schedule Performance", score: 76, trend: "up" as const, description: "On-time delivery and milestone achievement", tooltip: "Measures project schedule adherence and milestone completion" },
    { name: "Budget Performance", score: 82, trend: "up" as const, description: "Budget variance and cost control", tooltip: "Tracks budget utilization, variance, and cost management" },
    { name: "Resource Health", score: 68, trend: "down" as const, description: "Resource availability and utilization", tooltip: "Assesses resource allocation, availability, and team capacity" },
    { name: "Quality Metrics", score: 79, trend: "up" as const, description: "Deliverable quality and defect rates", tooltip: "Evaluates deliverable quality, defect rates" }
  ];

  const totalAssets = healthData.reduce((sum, d) => sum + d.total, 0);
  const totalHealthy = healthData.reduce((sum, d) => sum + d.healthy, 0);
  const totalWatch = healthData.reduce((sum, d) => sum + d.watch, 0);
  const totalAtRisk = healthData.reduce((sum, d) => sum + d.atRisk, 0);

  const stats = isApplication ? {
    tracked: 601, atRisk: 93, avgHealth: 74, complianceRate: 91, upcomingRenewals: 6, criticalAlerts: 2,
    annualSpend: "$42.3M", costPerAsset: "$70K", savingsIdentified: "$3.2M"
  } : {
    tracked: 85, atRisk: 10, avgHealth: 78, complianceRate: 94, upcomingRenewals: 3, criticalAlerts: 1,
    annualSpend: "$18.7M", costPerAsset: "$220K", savingsIdentified: "$1.8M"
  };

  const insights = isApplication ? [
    "Support Risk dimension needs attention - 12 applications approaching end-of-life",
    "Business Fit improving - 8 applications recently aligned with strategic initiatives",
    "Security Posture strong - 94% of critical applications meet security standards"
  ] : [
    "Resource Health needs attention - 8 projects experiencing resource constraints",
    "Budget Performance improving - 82% of projects within budget variance threshold",
    "Schedule Performance strong - 76% of projects meeting milestone targets"
  ];

  const getHealthPercentage = (data: HealthData) => ({
    healthy: (data.healthy / data.total) * 100,
    watch: (data.watch / data.total) * 100,
    atRisk: (data.atRisk / data.total) * 100
  });

  const handleRequestRemediation = (category: string, count: number) => {
    // Show action form immediately
    setActionContext({
      type: "request-remediation" as const,
      title: `${category} - ${count} At Risk`,
      description: `Request remediation plan for ${count} ${isApplication ? 'applications' : 'projects'} in the "${category}" category that are currently at risk.`,
      severity: "high" as const,
      relatedItem: category
    });
    setShowActionForm(true);
  };

  const submitRemediationRequest = (formData: ActionFormData) => {
    const mappedPriority =
      formData.priority === "normal" ? "medium" : formData.priority;
    const request = addRequest({
      userId: user?.id || "user-123",
      userName: user?.name || "John Doe",
      userEmail: user?.email || "john.doe@company.com",
      serviceName: isApplication
        ? "Application Portfolio Health Dashboard"
        : "Project Portfolio Health Dashboard",
      serviceId: isApplication ? "portfolio-health-dashboard" : "project-health-tracking",
      requestType: "Remediation Action Request",
      requestCategory: "consulting",
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

    submitRemediationRequest(formData);
  };

  return (
    <section className="bg-white py-8 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isApplication ? 'Application' : 'Project'} Portfolio Health Dashboard
            </h2>
            <p className="text-gray-600">
              Real-time visibility into {isApplication ? 'application' : 'project'} health across all dimensions
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600">Live Data</span>
          </div>
        </div>

        {/* Grouped Key Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Health & Risk Category */}
          <TooltipProvider>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Health & Risk
                </h3>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-blue-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Overall {isApplication ? 'application' : 'project'} health status and risk distribution
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">{isApplication ? 'Assets' : 'Projects'} Tracked</span>
                  <span className="text-2xl font-bold text-blue-900">{stats.tracked}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">At Risk</span>
                  <span className="text-xl font-bold text-red-600">{stats.atRisk}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">Avg Health Score</span>
                  <span className="text-xl font-bold text-green-600">{stats.avgHealth}%</span>
                </div>
              </div>
            </div>
          </TooltipProvider>

          {/* Compliance Category */}
          <TooltipProvider>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-green-900 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {isApplication ? 'Compliance' : 'Governance'}
                </h3>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-green-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      {isApplication ? 'Security compliance status and certifications' : 'Project governance and compliance status'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-800">Compliance Rate</span>
                  <span className="text-2xl font-bold text-green-900">{stats.complianceRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-800">{isApplication ? 'Upcoming Renewals' : 'Gate Reviews'}</span>
                  <span className="text-xl font-bold text-orange-600">{stats.upcomingRenewals}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-800">Critical Alerts</span>
                  <span className="text-xl font-bold text-red-600">{stats.criticalAlerts}</span>
                </div>
              </div>
            </div>
          </TooltipProvider>

          {/* Cost Overview Category */}
          <TooltipProvider>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-purple-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  {isApplication ? 'Cost Overview' : 'Budget Overview'}
                </h3>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-purple-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      {isApplication ? 'Total cost of ownership and optimization' : 'Project budget and cost performance'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-800">Annual Spend</span>
                  <span className="text-2xl font-bold text-purple-900">{stats.annualSpend}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-800">Cost per {isApplication ? 'Asset' : 'Project'}</span>
                  <span className="text-xl font-bold text-purple-900">{stats.costPerAsset}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-800">Savings Identified</span>
                  <span className="text-xl font-bold text-green-600">{stats.savingsIdentified}</span>
                </div>
              </div>
            </div>
          </TooltipProvider>
        </div>

        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "overview" | "dimensions")}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Health Overview</TabsTrigger>
            <TabsTrigger value="dimensions">Health Dimensions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {healthData.map((data) => {
                const percentages = getHealthPercentage(data);
                
                return (
                  <div key={data.category} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
                    <h3 className="font-semibold text-gray-900 mb-4">{data.category}</h3>
                    
                    {/* Total Count */}
                    <div className="text-3xl font-bold text-gray-900 mb-4">{data.total}</div>
                    
                    {/* Health Bar */}
                    <div className="mb-4">
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-green-500 h-full transition-all duration-500"
                          style={{ width: `${percentages.healthy}%` }}
                          title={`Healthy: ${data.healthy}`}
                        />
                        <div 
                          className="bg-yellow-500 h-full transition-all duration-500"
                          style={{ width: `${percentages.watch}%` }}
                          title={`Watch: ${data.watch}`}
                        />
                        <div 
                          className="bg-red-500 h-full transition-all duration-500"
                          style={{ width: `${percentages.atRisk}%` }}
                          title={`At Risk: ${data.atRisk}`}
                        />
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-gray-600">Healthy</span>
                        </div>
                        <span className="font-semibold text-gray-900">{data.healthy}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span className="text-gray-600">Watch</span>
                        </div>
                        <span className="font-semibold text-gray-900">{data.watch}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="text-gray-600">At Risk</span>
                        </div>
                        <span className="font-semibold text-gray-900">{data.atRisk}</span>
                      </div>
                    </div>

                    {/* Action Button for At Risk items */}
                    {data.atRisk > 0 && (
                      <Button
                        size="sm"
                        onClick={() => handleRequestRemediation(data.category, data.atRisk)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white text-xs"
                      >
                        Request Remediation
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Summary Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Healthy {isApplication ? 'Assets' : 'Projects'}</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{totalHealthy}</p>
                <p className="text-xs text-green-700 mt-1">{Math.round((totalHealthy/totalAssets)*100)}% of portfolio</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">Watch List</span>
                </div>
                <p className="text-2xl font-bold text-yellow-900">{totalWatch}</p>
                <p className="text-xs text-yellow-700 mt-1">{Math.round((totalWatch/totalAssets)*100)}% of portfolio</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-900">At Risk</span>
                </div>
                <p className="text-2xl font-bold text-red-900">{totalAtRisk}</p>
                <p className="text-xs text-red-700 mt-1">{Math.round((totalAtRisk/totalAssets)*100)}% of portfolio</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Total {isApplication ? 'Assets' : 'Projects'}</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{totalAssets}</p>
                <p className="text-xs text-blue-700 mt-1">Across all categories</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dimensions" className="mt-0">
            <div className="grid md:grid-cols-2 gap-6">
              {healthDimensions.map((dimension) => (
                <div 
                  key={dimension.name}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all relative"
                  onMouseEnter={() => setHoveredDimension(dimension.name)}
                  onMouseLeave={() => setHoveredDimension(null)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{dimension.name}</h3>
                      <p className="text-sm text-gray-600">{dimension.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">{dimension.score}%</span>
                      {dimension.trend === "up" ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <Progress 
                      value={dimension.score} 
                      className="h-3"
                    />
                  </div>

                  {/* Score Interpretation */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Score</span>
                    <span className={`font-medium ${
                      dimension.score >= 75 ? 'text-green-600' :
                      dimension.score >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {dimension.score >= 75 ? 'Excellent' :
                       dimension.score >= 60 ? 'Good' :
                       'Needs Improvement'}
                    </span>
                  </div>

                  {/* Tooltip */}
                  {hoveredDimension === dimension.name && (
                    <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-gray-900 text-white text-sm rounded-lg shadow-xl z-10">
                      <p>{dimension.tooltip}</p>
                      <div className="absolute -top-2 left-6 w-4 h-4 bg-gray-900 transform rotate-45"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actionable Insights */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Actionable Insights
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                {insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>

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
          cardId: "health-dashboard",
          serviceName: isApplication ? "Application Portfolio Health Dashboard" : "Project Portfolio Health Dashboard",
          action: "request remediation"
        }}
        onLoginSuccess={() => {
          if (pendingActionData) {
            submitRemediationRequest(pendingActionData);
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
