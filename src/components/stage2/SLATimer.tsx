import { Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface SLATimerProps {
  deadline: string;
  timeRemainingMinutes: number;
  breached: boolean;
}

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.max(minutes % 60, 0);
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
};

export function SLATimer({ deadline, timeRemainingMinutes, breached }: SLATimerProps) {
  let state: "safe" | "warning" | "danger" | "breached" = "safe";
  if (breached) {
    state = "breached";
  } else if (timeRemainingMinutes <= 60) {
    state = "danger";
  } else if (timeRemainingMinutes <= 240) {
    state = "warning";
  }

  const colorMap = {
    safe: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    breached: "bg-red-100 text-red-800 border-red-300 animate-pulse",
  }[state];

  const Icon = breached ? XCircle : state === "safe" ? CheckCircle : state === "warning" ? AlertTriangle : Clock;

  return (
    <div className={`border rounded-lg p-4 flex items-center gap-3 ${colorMap}`}>
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/70">
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{breached ? "SLA Breached" : "Time to SLA Breach"}</p>
        <p className="text-lg font-bold">{breached ? "Overdue" : formatTime(timeRemainingMinutes)}</p>
        {!breached && (
          <p className="text-xs text-current/80">Due: {new Date(deadline).toLocaleString()}</p>
        )}
      </div>
    </div>
  );
}

export default SLATimer;
