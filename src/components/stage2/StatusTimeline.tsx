import { SupportTicket } from "@/data/supportData";
import { Circle, UserCheck, Play, CheckCircle } from "lucide-react";

interface StatusTimelineProps {
  ticket: SupportTicket;
}

export function StatusTimeline({ ticket }: StatusTimelineProps) {
  const steps = [
    { status: "new", label: "Submitted", icon: Circle },
    { status: "assigned", label: "Assigned", icon: UserCheck },
    { status: "in-progress", label: "In Progress", icon: Play },
    { status: "resolved", label: "Resolved", icon: CheckCircle },
  ];

  const statusIndex = steps.findIndex((s) => s.status === ticket.status);

  return (
    <div className="flex items-center gap-3">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const completed = idx < statusIndex || ticket.status === "closed";
        const active = idx === statusIndex;
        return (
          <div key={step.status} className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className={`w-10 h-10 rounded-full border flex items-center justify-center ${
                completed ? "bg-green-100 border-green-300 text-green-700" : active ? "bg-orange-50 border-orange-300 text-orange-700" : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            >
              <Icon size={18} />
            </div>
            <div className="text-sm font-medium text-gray-700 truncate">{step.label}</div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 ${completed ? "bg-green-300" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StatusTimeline;
