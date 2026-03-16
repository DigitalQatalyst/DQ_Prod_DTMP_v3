import { useState } from "react";
import { X, AlertTriangle, Calendar, FileText, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export type ActionType = 
  | "take-action"           // For compliance alerts
  | "request-remediation"   // For health issues
  | "request-analysis"      // For dependencies
  | "escalate-issue"        // For critical items
  | "schedule-review";      // For planning

interface ActionContext {
  type: ActionType;
  title: string;
  description: string;
  severity?: "critical" | "high" | "medium" | "low";
  dueDate?: string;
  owner?: string;
  relatedItem?: string;
}

interface ActionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: ActionContext;
  onSubmit: (formData: ActionFormData) => void;
}

export interface ActionFormData {
  actionType: ActionType;
  priority: "urgent" | "high" | "normal" | "low";
  targetDate: string;
  description: string;
  actionPlan: string;
  notifyStakeholders: boolean;
  requestBudget: boolean;
  budgetAmount?: string;
  additionalNotes?: string;
}

export function ActionFormModal({ isOpen, onClose, context, onSubmit }: ActionFormModalProps) {
  const [formData, setFormData] = useState<ActionFormData>({
    actionType: context.type,
    priority: context.severity === "critical" ? "urgent" : context.severity === "high" ? "high" : "normal",
    targetDate: "",
    description: "",
    actionPlan: "",
    notifyStakeholders: true,
    requestBudget: false,
    budgetAmount: "",
    additionalNotes: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const actionTypeLabels: Record<ActionType, string> = {
    "take-action": "Take Action",
    "request-remediation": "Request Remediation",
    "request-analysis": "Request Analysis",
    "escalate-issue": "Escalate Issue",
    "schedule-review": "Schedule Review"
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.targetDate) {
      newErrors.targetDate = "Please select a target date";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please describe the action to be taken";
    }

    if (!formData.actionPlan.trim()) {
      newErrors.actionPlan = "Please provide an action plan";
    }

    if (formData.requestBudget && !formData.budgetAmount) {
      newErrors.budgetAmount = "Please specify budget amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      actionType: context.type,
      priority: "normal",
      targetDate: "",
      description: "",
      actionPlan: "",
      notifyStakeholders: true,
      requestBudget: false,
      budgetAmount: "",
      additionalNotes: ""
    });
    setErrors({});
    onClose();
  };

  const updateField = (field: keyof ActionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              context.severity === "critical" ? "bg-red-100" :
              context.severity === "high" ? "bg-orange-100" :
              "bg-blue-100"
            }`}>
              <AlertTriangle className={`w-5 h-5 ${
                context.severity === "critical" ? "text-red-600" :
                context.severity === "high" ? "text-orange-600" :
                "text-blue-600"
              }`} />
            </div>
            <span>{actionTypeLabels[context.type]}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Context Information */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">{context.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{context.description}</p>
            <div className="flex flex-wrap gap-2">
              {context.severity && (
                <Badge className={
                  context.severity === "critical" ? "bg-red-100 text-red-700" :
                  context.severity === "high" ? "bg-orange-100 text-orange-700" :
                  "bg-yellow-100 text-yellow-700"
                }>
                  {context.severity.toUpperCase()}
                </Badge>
              )}
              {context.dueDate && (
                <Badge className="bg-blue-100 text-blue-700">
                  Due: {context.dueDate}
                </Badge>
              )}
              {context.relatedItem && (
                <Badge className="bg-purple-100 text-purple-700">
                  {context.relatedItem}
                </Badge>
              )}
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Action Priority
              <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value) => updateField("priority", value)}
            >
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">🔴 Urgent - Immediate action required</SelectItem>
                <SelectItem value="high">🟠 High - Action needed within 1 week</SelectItem>
                <SelectItem value="normal">🟡 Normal - Action needed within 2 weeks</SelectItem>
                <SelectItem value="low">🟢 Low - Action needed within 1 month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Target Date */}
          <div className="space-y-2">
            <Label htmlFor="targetDate" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Target Completion Date
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) => updateField("targetDate", e.target.value)}
              className={errors.targetDate ? "border-red-500" : ""}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.targetDate && (
              <p className="text-sm text-red-600">{errors.targetDate}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Action Description
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what action needs to be taken..."
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Action Plan */}
          <div className="space-y-2">
            <Label htmlFor="actionPlan" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Detailed Action Plan
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="actionPlan"
              placeholder="Provide step-by-step plan to address this issue..."
              value={formData.actionPlan}
              onChange={(e) => updateField("actionPlan", e.target.value)}
              rows={4}
              className={errors.actionPlan ? "border-red-500" : ""}
            />
            {errors.actionPlan && (
              <p className="text-sm text-red-600">{errors.actionPlan}</p>
            )}
          </div>

          {/* Budget Request */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="requestBudget"
                checked={formData.requestBudget}
                onChange={(e) => updateField("requestBudget", e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <Label htmlFor="requestBudget" className="cursor-pointer">
                This action requires budget approval
              </Label>
            </div>

            {formData.requestBudget && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="budgetAmount">
                  Estimated Budget Amount
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="budgetAmount"
                  placeholder="e.g., $50,000"
                  value={formData.budgetAmount}
                  onChange={(e) => updateField("budgetAmount", e.target.value)}
                  className={errors.budgetAmount ? "border-red-500" : ""}
                />
                {errors.budgetAmount && (
                  <p className="text-sm text-red-600">{errors.budgetAmount}</p>
                )}
              </div>
            )}
          </div>

          {/* Notify Stakeholders */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="notifyStakeholders"
              checked={formData.notifyStakeholders}
              onChange={(e) => updateField("notifyStakeholders", e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <Label htmlFor="notifyStakeholders" className="cursor-pointer">
              Notify relevant stakeholders about this action
            </Label>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="additionalNotes">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="additionalNotes"
              placeholder="Any additional context or information..."
              value={formData.additionalNotes}
              onChange={(e) => updateField("additionalNotes", e.target.value)}
              rows={2}
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Action
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
