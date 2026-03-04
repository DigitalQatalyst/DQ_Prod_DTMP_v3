import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Calendar, Shield, FileText, Clock, ChevronRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ActionFormModal, ActionFormData } from "./ActionFormModal";
import { LoginModal } from "@/components/learningCenter/LoginModal";
import { useAuth } from "@/contexts/AuthContext";
import { addRequest } from "@/data/requests/mockRequests";

interface ComplianceAlert {
  id: string;
  application: string;
  alertType: "certification" | "renewal" | "eol" | "security" | "audit" | "budget" | "resource" | "milestone" | "governance";
  severity: "critical" | "high" | "medium";
  daysUntilDue: number;
  dueDate: string;
  description: string;
  owner: string;
  status: "pending" | "in-progress" | "overdue";
}

interface ComplianceAlertsProps {
  context?: 'application' | 'project';
}

export function ComplianceAlerts({ context = 'application' }: ComplianceAlertsProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [showFullDashboard, setShowFullDashboard] = useState(false);
  const [showActionForm, setShowActionForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<ComplianceAlert | null>(null);
  const [pendingActionData, setPendingActionData] = useState<ActionFormData | null>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const isApplication = context === 'application';

  // Context-specific alerts
  const mockAlerts: ComplianceAlert[] = isApplication ? [
    {
      id: "1",
      application: "Customer Portal",
      alertType: "certification",
      severity: "critical",
      daysUntilDue: 7,
      dueDate: "2024-02-25",
      description: "SOC 2 Type II certification expires",
      owner: "Security Team",
      status: "pending"
    },
    {
      id: "2",
      application: "Payment Gateway",
      alertType: "renewal",
      severity: "high",
      daysUntilDue: 15,
      dueDate: "2024-03-05",
      description: "PCI DSS compliance renewal required",
      owner: "Compliance Team",
      status: "in-progress"
    },
    {
      id: "3",
      application: "Legacy CRM",
      alertType: "eol",
      severity: "critical",
      daysUntilDue: -5,
      dueDate: "2024-02-13",
      description: "Vendor support ends - migration required",
      owner: "IT Operations",
      status: "overdue"
    },
    {
      id: "4",
      application: "HR Management System",
      alertType: "security",
      severity: "high",
      daysUntilDue: 10,
      dueDate: "2024-02-28",
      description: "Critical security patches pending",
      owner: "Security Team",
      status: "pending"
    },
    {
      id: "5",
      application: "Financial Reporting",
      alertType: "audit",
      severity: "medium",
      daysUntilDue: 30,
      dueDate: "2024-03-20",
      description: "Annual compliance audit scheduled",
      owner: "Audit Team",
      status: "pending"
    },
    {
      id: "6",
      application: "Data Warehouse",
      alertType: "certification",
      severity: "high",
      daysUntilDue: 20,
      dueDate: "2024-03-10",
      description: "ISO 27001 recertification due",
      owner: "Security Team",
      status: "in-progress"
    }
  ] : [
    {
      id: "1",
      application: "Digital Transformation Initiative",
      alertType: "budget",
      severity: "critical",
      daysUntilDue: 5,
      dueDate: "2024-02-23",
      description: "Budget variance exceeds 15% threshold",
      owner: "Project Manager",
      status: "pending"
    },
    {
      id: "2",
      application: "Cloud Migration Project",
      alertType: "milestone",
      severity: "high",
      daysUntilDue: 10,
      dueDate: "2024-02-28",
      description: "Phase 2 milestone at risk of delay",
      owner: "Program Manager",
      status: "in-progress"
    },
    {
      id: "3",
      application: "ERP Upgrade",
      alertType: "resource",
      severity: "critical",
      daysUntilDue: -3,
      dueDate: "2024-02-15",
      description: "Critical resource shortage - 3 developers needed",
      owner: "Resource Manager",
      status: "overdue"
    },
    {
      id: "4",
      application: "Mobile App Development",
      alertType: "governance",
      severity: "high",
      daysUntilDue: 7,
      dueDate: "2024-02-25",
      description: "Stage gate review pending approval",
      owner: "PMO",
      status: "pending"
    },
    {
      id: "5",
      application: "Data Analytics Platform",
      alertType: "budget",
      severity: "medium",
      daysUntilDue: 20,
      dueDate: "2024-03-10",
      description: "Q1 budget review and reforecast required",
      owner: "Finance Team",
      status: "pending"
    },
    {
      id: "6",
      application: "Customer Experience Program",
      alertType: "milestone",
      severity: "high",
      daysUntilDue: 15,
      dueDate: "2024-03-05",
      description: "UAT completion deadline approaching",
      owner: "Project Manager",
      status: "in-progress"
    }
  ];

  const alertTypeConfig = isApplication ? {
    certification: { icon: Shield, label: "Certification", color: "blue" },
    renewal: { icon: FileText, label: "Renewal", color: "purple" },
    eol: { icon: AlertTriangle, label: "End of Life", color: "red" },
    security: { icon: Shield, label: "Security", color: "orange" },
    audit: { icon: FileText, label: "Audit", color: "green" }
  } : {
    budget: { icon: AlertTriangle, label: "Budget Risk", color: "red" },
    milestone: { icon: Calendar, label: "Milestone", color: "blue" },
    resource: { icon: AlertTriangle, label: "Resource Issue", color: "orange" },
    governance: { icon: Shield, label: "Governance", color: "purple" },
    audit: { icon: FileText, label: "Audit", color: "green" }
  };

const severityConfig = {
  critical: { color: "bg-red-100 text-red-700 border-red-200", label: "Critical" },
  high: { color: "bg-orange-100 text-orange-700 border-orange-200", label: "High" },
  medium: { color: "bg-yellow-100 text-yellow-700 border-yellow-200", label: "Medium" }
};

const statusConfig = {
  pending: { color: "bg-gray-100 text-gray-700", label: "Pending" },
  "in-progress": { color: "bg-blue-100 text-blue-700", label: "In Progress" },
  overdue: { color: "bg-red-100 text-red-700", label: "Overdue" }
};

  const filteredAlerts = mockAlerts.filter(alert => {
    if (filterSeverity !== "all" && alert.severity !== filterSeverity) return false;
    if (filterType !== "all" && alert.alertType !== filterType) return false;
    return true;
  });

  // Show only critical and high priority by default
  const displayedAlerts = showAllAlerts 
    ? filteredAlerts 
    : filteredAlerts.filter(a => a.severity === "critical" || a.severity === "high").slice(0, 4);

  const criticalCount = mockAlerts.filter(a => a.severity === "critical").length;
  const overdueCount = mockAlerts.filter(a => a.status === "overdue").length;

  const getDaysLabel = (days: number) => {
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";
    return `${days} days remaining`;
  };

  const handleTakeAction = (alert: ComplianceAlert) => {
    // Show action form immediately
    setSelectedAlert(alert);
    setShowActionForm(true);
  };

  const submitComplianceActionRequest = (formData: ActionFormData) => {
    const mappedPriority =
      formData.priority === "normal" ? "medium" : formData.priority;
    const request = addRequest({
      userId: user?.id || "user-123",
      userName: user?.name || "John Doe",
      userEmail: user?.email || "john.doe@company.com",
      serviceName: isApplication
        ? "Application Risk & Compliance Monitoring"
        : "Project Risk & Governance Alerts",
      serviceId: isApplication ? "application-risk-compliance" : "project-risk-compliance",
      requestType: "Compliance Action Request",
      requestCategory: "consulting",
      priority: mappedPriority,
      businessJustification: formData.description,
      desiredCompletionDate: formData.targetDate,
      additionalRequirements: formData.actionPlan,
      specificData: {
        actionType: formData.actionType,
        selectedAlert,
        notifyStakeholders: formData.notifyStakeholders,
        requestBudget: formData.requestBudget,
        budgetAmount: formData.budgetAmount,
        additionalNotes: formData.additionalNotes,
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

    submitComplianceActionRequest(formData);
  };

  return (
    <section className="bg-white py-8 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isApplication ? 'Compliance & Risk Alerts' : 'Project Risk & Governance Alerts'}
            </h2>
            <p className="text-gray-600">
              {isApplication 
                ? 'Track upcoming certifications, renewals, and compliance requirements'
                : 'Monitor project risks, milestones, and governance requirements'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {isApplication ? (
                  <>
                    <SelectItem value="certification">Certification</SelectItem>
                    <SelectItem value="renewal">Renewal</SelectItem>
                    <SelectItem value="eol">End of Life</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="audit">Audit</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="budget">Budget Risk</SelectItem>
                    <SelectItem value="milestone">Milestone</SelectItem>
                    <SelectItem value="resource">Resource Issue</SelectItem>
                    <SelectItem value="governance">Governance</SelectItem>
                    <SelectItem value="audit">Audit</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-900">Critical</span>
            </div>
            <p className="text-2xl font-bold text-red-900">{criticalCount}</p>
            <p className="text-xs text-red-700 mt-1">Require immediate action</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Overdue</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">{overdueCount}</p>
            <p className="text-xs text-orange-700 mt-1">Past due date</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Next 30 Days</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{mockAlerts.filter(a => a.daysUntilDue <= 30 && a.daysUntilDue >= 0).length}</p>
            <p className="text-xs text-blue-700 mt-1">Upcoming deadlines</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{mockAlerts.filter(a => a.status === "in-progress").length}</p>
            <p className="text-xs text-green-700 mt-1">Being addressed</p>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {displayedAlerts.length > 0 ? (
            <>
              {displayedAlerts.map((alert) => {
              const typeConfig = alertTypeConfig[alert.alertType];
              const TypeIcon = typeConfig.icon;
              
              return (
                <div 
                  key={alert.id}
                  className={`bg-white border-2 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                    alert.status === "overdue" ? "border-red-300 bg-red-50" :
                    alert.severity === "critical" ? "border-orange-300" :
                    "border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-${typeConfig.color}-100`}>
                      <TypeIcon className={`w-5 h-5 text-${typeConfig.color}-600`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{alert.application}</h3>
                          <p className="text-sm text-gray-600">{alert.description}</p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={severityConfig[alert.severity].color}>
                            {severityConfig[alert.severity].label}
                          </Badge>
                          <Badge className={statusConfig[alert.status].color}>
                            {statusConfig[alert.status].label}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{alert.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className={alert.daysUntilDue < 0 ? "text-red-600 font-medium" : ""}>
                            {getDaysLabel(alert.daysUntilDue)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Owner:</span>
                          <span>{alert.owner}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Button 
                        size="sm" 
                        onClick={() => handleTakeAction(alert)}
                        className={`${
                          alert.severity === "critical" ? "bg-red-600 hover:bg-red-700" :
                          alert.severity === "high" ? "bg-orange-600 hover:bg-orange-700" :
                          "bg-blue-600 hover:bg-blue-700"
                        } text-white`}
                      >
                        Take Action
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Show More/Less Button */}
            {filteredAlerts.length > 4 && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFullDashboard(true)}
                  className="gap-2"
                >
                  Show All {filteredAlerts.length} Alerts
                </Button>
              </div>
            )}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No alerts match your filters</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setShowFullDashboard(true)}
          >
            <FileText className="w-4 h-4" />
            View Full Compliance Dashboard
          </Button>
        </div>
      </div>

      {/* Full Dashboard Modal */}
      <Dialog open={showFullDashboard} onOpenChange={setShowFullDashboard}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isApplication ? 'Full Compliance & Risk Dashboard' : 'Full Project Risk & Governance Dashboard'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-900">Critical</span>
                </div>
                <p className="text-2xl font-bold text-red-900">{criticalCount}</p>
                <p className="text-xs text-red-700 mt-1">Require immediate action</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Overdue</span>
                </div>
                <p className="text-2xl font-bold text-orange-900">{overdueCount}</p>
                <p className="text-xs text-orange-700 mt-1">Past due date</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Next 30 Days</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{mockAlerts.filter(a => a.daysUntilDue <= 30 && a.daysUntilDue >= 0).length}</p>
                <p className="text-xs text-blue-700 mt-1">Upcoming deadlines</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">In Progress</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{mockAlerts.filter(a => a.status === "in-progress").length}</p>
                <p className="text-xs text-green-700 mt-1">Being addressed</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {isApplication ? (
                    <>
                      <SelectItem value="certification">Certification</SelectItem>
                      <SelectItem value="renewal">Renewal</SelectItem>
                      <SelectItem value="eol">End of Life</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="audit">Audit</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="budget">Budget Risk</SelectItem>
                      <SelectItem value="milestone">Milestone</SelectItem>
                      <SelectItem value="resource">Resource Issue</SelectItem>
                      <SelectItem value="governance">Governance</SelectItem>
                      <SelectItem value="audit">Audit</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* All Alerts */}
            <div className="space-y-3">
              {filteredAlerts.map((alert) => {
                const typeConfig = alertTypeConfig[alert.alertType];
                const TypeIcon = typeConfig.icon;
                
                return (
                  <div 
                    key={alert.id}
                    className={`bg-white border-2 rounded-lg p-4 hover:shadow-md transition-all ${
                      alert.status === "overdue" ? "border-red-300 bg-red-50" :
                      alert.severity === "critical" ? "border-orange-300" :
                      "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-${typeConfig.color}-100`}>
                        <TypeIcon className={`w-5 h-5 text-${typeConfig.color}-600`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{alert.application}</h3>
                            <p className="text-sm text-gray-600">{alert.description}</p>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge className={severityConfig[alert.severity].color}>
                              {severityConfig[alert.severity].label}
                            </Badge>
                            <Badge className={statusConfig[alert.status].color}>
                              {statusConfig[alert.status].label}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{alert.dueDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className={alert.daysUntilDue < 0 ? "text-red-600 font-medium" : ""}>
                              {getDaysLabel(alert.daysUntilDue)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Owner:</span>
                            <span>{alert.owner}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Button 
                          size="sm" 
                          onClick={() => handleTakeAction(alert)}
                          className={`${
                            alert.severity === "critical" ? "bg-red-600 hover:bg-red-700" :
                            alert.severity === "high" ? "bg-orange-600 hover:bg-orange-700" :
                            "bg-blue-600 hover:bg-blue-700"
                          } text-white`}
                        >
                          Take Action
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Form Modal */}
      {selectedAlert && (
        <ActionFormModal
          isOpen={showActionForm}
          onClose={() => {
            setShowActionForm(false);
            setSelectedAlert(null);
          }}
          context={{
            type: "take-action",
            title: selectedAlert.application,
            description: selectedAlert.description,
            severity: selectedAlert.severity,
            dueDate: selectedAlert.dueDate,
            owner: selectedAlert.owner,
            relatedItem: alertTypeConfig[selectedAlert.alertType].label
          }}
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
          cardId: "compliance-alerts",
          serviceName: isApplication ? "Compliance & Risk Alerts" : "Project Risk & Governance Alerts",
          action: "take action"
        }}
        onLoginSuccess={() => {
          if (pendingActionData) {
            submitComplianceActionRequest(pendingActionData);
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
