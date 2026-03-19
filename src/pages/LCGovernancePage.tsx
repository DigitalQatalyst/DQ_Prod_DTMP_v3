import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BookOpen,
  ArrowLeft,
  LayoutDashboard,
  Library,
  FileEdit,
  ClipboardCheck,
  CheckSquare,
  BarChart3,
} from "lucide-react";
import { getSessionRole } from "@/data/sessionRole";
import { getLCChangeRequests } from "@/data/learningCenter/stage3/lcChangeRequests";
import type { LCChangeRequest } from "@/data/learningCenter/stage3/lcChangeRequests";
import LCGovOverview from "@/components/learningCenter/stage3/LCGovOverview";
import LCContentBrowser from "@/components/learningCenter/stage3/LCContentBrowser";
import LCChangeRequests from "@/components/learningCenter/stage3/LCChangeRequests";
import LCPendingApproval from "@/components/learningCenter/stage3/LCPendingApproval";
import LCApprovedChanges from "@/components/learningCenter/stage3/LCApprovedChanges";
import LCAnalytics from "@/components/learningCenter/stage3/LCAnalytics";

type LCGovView =
  | "dashboard"
  | "content-browser"
  | "change-requests"
  | "pending-approval"
  | "approved-changes"
  | "analytics";

const isValidView = (v: string): v is LCGovView =>
  ["dashboard", "content-browser", "change-requests", "pending-approval", "approved-changes", "analytics"].includes(v);

interface NavItem {
  id: LCGovView;
  label: string;
  icon: React.ReactNode;
}

export default function LCGovernancePage() {
  const navigate = useNavigate();
  const { view: routeView } = useParams<{ view?: string }>();
  const role = getSessionRole();

  const [view, setView] = useState<LCGovView>(
    routeView && isValidView(routeView) ? routeView : "dashboard"
  );
  const [requests, setRequests] = useState<LCChangeRequest[]>(() => getLCChangeRequests());

  useEffect(() => {
    if (routeView && isValidView(routeView)) {
      setView(routeView);
    }
  }, [routeView]);

  const refresh = useCallback(() => {
    setRequests(getLCChangeRequests());
  }, []);

  const handleNav = (v: LCGovView) => {
    navigate(`/stage3/learning-centre/${v}`);
    setView(v);
  };

  const submittedCount = requests.filter((r) => r.status === "submitted").length;

  const roleBadge =
    role === "to-admin" ? "Content Approver" : "Content Manager";

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "content-browser", label: "Content Browser", icon: <Library className="w-4 h-4" /> },
    { id: "change-requests", label: "Change Requests", icon: <FileEdit className="w-4 h-4" /> },
    { id: "pending-approval", label: "Pending Approval", icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: "approved-changes", label: "Approved Changes", icon: <CheckSquare className="w-4 h-4" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex h-screen overflow-hidden">
      {/* Column 1: Icon rail (64px) */}
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 flex-shrink-0 h-full">
        {/* DTMP logo placeholder */}
        <div className="w-9 h-9 bg-orange-600 rounded-lg flex items-center justify-center mb-6 flex-shrink-0">
          <span className="text-white text-xs font-bold">D</span>
        </div>

        {/* Learning Centre icon — highlighted */}
        <button
          className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-50 text-orange-600 border border-orange-200 mb-2"
          title="Learning Centre"
        >
          <BookOpen className="w-5 h-5" />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Back arrow */}
        <button
          onClick={() => navigate("/marketplaces/learning-center")}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title="Back to Marketplace"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Column 2: Service nav (240px) */}
      <div className="w-60 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 h-full overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-0.5">
            Content Governance
          </p>
          <p className="text-xs text-gray-500">EA Office · Learning Centre</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
              {roleBadge}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = view === item.id;
            const showBadge = item.id === "pending-approval" && submittedCount > 0;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive
                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className={isActive ? "text-orange-600" : "text-gray-500"}>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {showBadge && (
                  <span className="bg-orange-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                    {submittedCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider + Back link */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => navigate("/marketplaces/learning-center")}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Marketplace
          </button>
        </div>
      </div>

      {/* Column 3: Main content */}
      <div className="flex-1 overflow-y-auto">
        {view === "dashboard" && (
          <LCGovOverview requests={requests} role={role} />
        )}
        {view === "content-browser" && (
          <LCContentBrowser onRequestCreated={refresh} />
        )}
        {view === "change-requests" && (
          <LCChangeRequests requests={requests} onRefresh={refresh} />
        )}
        {view === "pending-approval" && (
          <LCPendingApproval requests={requests} role={role} onRefresh={refresh} />
        )}
        {view === "approved-changes" && (
          <LCApprovedChanges requests={requests} role={role} onRefresh={refresh} />
        )}
        {view === "analytics" && (
          <LCAnalytics />
        )}
      </div>
    </div>
  );
}
