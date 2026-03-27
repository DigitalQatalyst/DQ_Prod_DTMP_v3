// ── Portfolio Management Service Requests (localStorage-backed) ──────────

import { type PMTab } from "../portfolioManagement";

export type PMRequestStatus =
  | "Submitted"
  | "Assigned"
  | "In Progress"
  | "Delivered"
  | "Completed";

export interface PMRequest {
  id: string;
  reportType: string;
  assetTitle: string;
  tabSource: PMTab;
  tabLabel: string;
  status: PMRequestStatus;
  submittedDate: string;
  targetDeliveryDate: string;
  sla: string;
  slaStatus: "On Track" | "Approaching" | "Overdue";
  assignedTo?: string;
  notes?: string;
}

export interface PMReport {
  id: string;
  reportTitle: string;
  tabSource: PMTab;
  tabLabel: string;
  reportType: string;
  format: "PDF" | "PPTX";
  deliveredDate: string;
  requestId: string;
}

const REQUESTS_KEY = "pm_service_requests";
const REPORTS_KEY = "pm_reports";

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function addBusinessDays(days: number): string {
  const d = new Date();
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) added++;
  }
  return d.toISOString().split("T")[0];
}

const DEMO_REQUESTS: PMRequest[] = [
  {
    id: "PMR-001",
    reportType: "Architecture Review Board Pack (PPTX)",
    assetTitle: "Transmission Division",
    tabSource: "governance-health",
    tabLabel: "Governance Health",
    status: "In Progress",
    submittedDate: "2026-03-20",
    targetDeliveryDate: "2026-03-27",
    sla: "5 business days",
    slaStatus: "Approaching",
    assignedTo: "Ahmed Al Rashidi",
  },
  {
    id: "PMR-002",
    reportType: "Application Health Assessment",
    assetTitle: "Legacy Billing System (BIS-3)",
    tabSource: "application-portfolio",
    tabLabel: "Application Portfolio",
    status: "Delivered",
    submittedDate: "2026-03-15",
    targetDeliveryDate: "2026-03-18",
    sla: "3 business days",
    slaStatus: "On Track",
    assignedTo: "Sara Al Blooshi",
  },
  {
    id: "PMR-003",
    reportType: "Rationalisation Business Case",
    assetTitle: "CRM Platform Duplication",
    tabSource: "technology-rationalisation",
    tabLabel: "Technology Rationalisation",
    status: "Submitted",
    submittedDate: "2026-03-26",
    targetDeliveryDate: "2026-04-02",
    sla: "5 business days",
    slaStatus: "On Track",
  },
  {
    id: "PMR-004",
    reportType: "Project Health Report",
    assetTitle: "OT Network Segmentation",
    tabSource: "project-portfolio",
    tabLabel: "Project Portfolio",
    status: "Completed",
    submittedDate: "2026-03-10",
    targetDeliveryDate: "2026-03-12",
    sla: "48 hours",
    slaStatus: "On Track",
    assignedTo: "Ahmed Al Rashidi",
  },
];

const DEMO_REPORTS: PMReport[] = [
  {
    id: "RPT-001",
    reportTitle: "Application Health Assessment — Legacy Billing System (BIS-3)",
    tabSource: "application-portfolio",
    tabLabel: "Application Portfolio",
    reportType: "Application Health Assessment",
    format: "PDF",
    deliveredDate: "2026-03-18",
    requestId: "PMR-002",
  },
  {
    id: "RPT-002",
    reportTitle: "Project Health Report — OT Network Segmentation",
    tabSource: "project-portfolio",
    tabLabel: "Project Portfolio",
    reportType: "Project Health Report",
    format: "PDF",
    deliveredDate: "2026-03-12",
    requestId: "PMR-004",
  },
];

function loadRequests(): PMRequest[] {
  try {
    const stored = localStorage.getItem(REQUESTS_KEY);
    if (stored) return JSON.parse(stored) as PMRequest[];
  } catch {}
  return DEMO_REQUESTS;
}

function saveRequests(requests: PMRequest[]): void {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

function loadReports(): PMReport[] {
  try {
    const stored = localStorage.getItem(REPORTS_KEY);
    if (stored) return JSON.parse(stored) as PMReport[];
  } catch {}
  return DEMO_REPORTS;
}

function saveReports(reports: PMReport[]): void {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function getPMRequests(): PMRequest[] {
  return loadRequests();
}

export function getPMReports(): PMReport[] {
  return loadReports();
}

export function addPMRequest(
  reportType: string,
  assetTitle: string,
  tabSource: PMTab,
  tabLabel: string,
  sla: string,
  notes?: string
): PMRequest {
  const requests = loadRequests();
  const newReq: PMRequest = {
    id: `PMR-${String(requests.length + 1).padStart(3, "0")}`,
    reportType,
    assetTitle,
    tabSource,
    tabLabel,
    status: "Submitted",
    submittedDate: today(),
    targetDeliveryDate: addBusinessDays(sla.includes("48") ? 2 : sla.includes("3") ? 3 : 5),
    sla,
    slaStatus: "On Track",
    notes,
  };
  requests.unshift(newReq);
  saveRequests(requests);
  return newReq;
}
