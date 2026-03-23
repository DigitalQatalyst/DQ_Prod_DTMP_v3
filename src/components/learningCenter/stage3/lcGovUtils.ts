import type { LCChangeStatus, LCUrgency, LCChangeType } from "@/data/learningCenter/stage3/lcChangeRequests";

export function getStatusBadgeClass(status: LCChangeStatus): string {
  switch (status) {
    case "submitted":
      return "bg-sky-100 text-sky-700";
    case "approved":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    case "in-implementation":
      return "bg-blue-100 text-blue-700";
    case "implemented":
      return "bg-amber-100 text-amber-700";
    case "verified":
      return "bg-emerald-100 text-emerald-700";
    case "draft":
      return "bg-gray-100 text-gray-600";
    case "closed-not-verified":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export function getStatusLabel(status: LCChangeStatus): string {
  switch (status) {
    case "submitted":
      return "Submitted";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    case "in-implementation":
      return "In Implementation";
    case "implemented":
      return "Implemented";
    case "verified":
      return "Verified";
    case "draft":
      return "Draft";
    case "closed-not-verified":
      return "Closed – Not Verified";
    default:
      return status;
  }
}

export function getUrgencyBadgeClass(urgency: LCUrgency): string {
  switch (urgency) {
    case "critical":
      return "bg-red-100 text-red-700";
    case "high":
      return "bg-orange-100 text-orange-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "low":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export function getChangeTypeBadgeClass(_type: LCChangeType): string {
  return "bg-violet-100 text-violet-700";
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function isThisMonth(iso: string): boolean {
  try {
    const d = new Date(iso);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  } catch {
    return false;
  }
}
