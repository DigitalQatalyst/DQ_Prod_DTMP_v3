import { ApprovalStep } from "@/data/supportData";
import { CheckCircle, X, Clock } from "lucide-react";

interface ApprovalWorkflowProps {
  steps: ApprovalStep[];
}

export function ApprovalWorkflow({ steps }: ApprovalWorkflowProps) {
  return (
    <div className="space-y-3">
      {steps.map((step, idx) => {
        const statusClass =
          step.status === "approved"
            ? "border-green-200 bg-green-50"
            : step.status === "rejected"
              ? "border-red-200 bg-red-50"
              : "border-amber-200 bg-amber-50";
        const Icon = step.status === "approved" ? CheckCircle : step.status === "rejected" ? X : Clock;
        return (
          <div key={step.id} className={`border rounded-lg p-3 flex items-start gap-3 ${statusClass}`}>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Icon size={18} className="text-current" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{step.approverRole}</p>
                  <p className="text-xs text-gray-600">{step.approverName}</p>
                </div>
                <div className="text-xs text-gray-600">Step {step.stepNumber}</div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs font-medium text-gray-700">
                {step.required && <span className="px-2 py-0.5 rounded-full bg-white border text-orange-600 border-orange-200">Required</span>}
                <span className="capitalize">{step.status.replace("-", " ")}</span>
                {step.approvedAt && <span>• {new Date(step.approvedAt).toLocaleString()}</span>}
              </div>
              {step.comments && <p className="text-xs text-gray-700 mt-1">{step.comments}</p>}
            </div>
            {idx < steps.length - 1 && <div className="w-px bg-gray-200 h-14 hidden sm:block" aria-hidden="true" />}
          </div>
        );
      })}
    </div>
  );
}

export default ApprovalWorkflow;
