import { cn } from "@/lib/utils";

type Priority = "low" | "medium" | "high" | "critical";

interface PriorityBadgeProps {
  priority: Priority;
  size?: "small" | "medium" | "large";
}

const priorityConfig: Record<Priority, { color: string; bg: string; label: string }> = {
  critical: { color: "#ef4444", bg: "#fee2e2", label: "Critical" },
  high: { color: "#f97316", bg: "#fed7aa", label: "High" },
  medium: { color: "#f59e0b", bg: "#fef3c7", label: "Medium" },
  low: { color: "#6b7280", bg: "#f3f4f6", label: "Low" },
};

export function PriorityBadge({ priority, size = "medium" }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  const sizeClasses =
    size === "small"
      ? "text-xs px-2 py-0.5"
      : size === "large"
        ? "text-sm px-3 py-1.5"
        : "text-xs px-2.5 py-1";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold border rounded-full",
        sizeClasses
      )}
      style={{ color: config.color, backgroundColor: config.bg, borderColor: config.color }}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: config.color }} />
      {config.label}
    </span>
  );
}

export default PriorityBadge;
