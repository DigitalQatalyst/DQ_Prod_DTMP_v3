import { useNavigate } from "react-router-dom";
import { FileText, BarChart3, CheckCircle, Clock, ArrowRight, Eye, Settings2 } from "lucide-react";
import { getPMRequests, getPMReports } from "@/data/portfolioManagement/serviceRequests";
import { getSessionRole, isTOStage3Role } from "@/data/sessionRole";

export default function PMOverviewPage() {
  const navigate = useNavigate();
  const isTOUser = isTOStage3Role(getSessionRole());
  const requests = getPMRequests();
  const reports = getPMReports();

  const active = requests.filter((r) => ["Submitted", "Assigned", "In Progress"].includes(r.status));
  const delivered = requests.filter((r) => r.status === "Delivered" || r.status === "Completed");
  const pendingThisWeek = requests.filter((r) => r.status === "Submitted");
  const recent = requests.slice(0, 5);

  const stats = [
    { label: "Total Requests", value: requests.length, icon: FileText, color: "text-blue-600 bg-blue-50" },
    { label: "Active Requests", value: active.length, icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Reports Delivered", value: delivered.length, icon: CheckCircle, color: "text-green-600 bg-green-50" },
    { label: "Pending This Week", value: pendingThisWeek.length, icon: BarChart3, color: "text-orange-600 bg-orange-50" },
  ];

  const statusColor: Record<string, string> = {
    Submitted: "bg-blue-100 text-blue-700",
    Assigned: "bg-purple-100 text-purple-700",
    "In Progress": "bg-amber-100 text-amber-700",
    Delivered: "bg-green-100 text-green-700",
    Completed: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Portfolio Management</h2>
        <p className="text-sm text-gray-500">Your governance report requests and intelligence activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent requests */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Recent Requests</h3>
          <button
            onClick={() => navigate("/stage2/portfolio-management", { state: { cardId: "my-requests" } })}
            className="text-xs text-orange-600 hover:text-orange-800 flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        {recent.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No requests yet</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.reportType}</p>
                  <p className="text-xs text-gray-400">{r.assetTitle} · {r.submittedDate}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[r.status] || "bg-gray-100 text-gray-700"}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: "Browse Portfolio", desc: "Explore governance intelligence", onClick: () => navigate("/marketplaces/portfolio-management"), icon: Eye },
          { label: "View All Requests", desc: "Track your report requests", onClick: () => navigate("/stage2/portfolio-management", { state: { cardId: "my-requests" } }), icon: Clock },
          { label: "View Reports", desc: "Access delivered reports", onClick: () => navigate("/stage2/portfolio-management", { state: { cardId: "my-reports" } }), icon: FileText },
          ...(isTOUser ? [{ label: "TO Operations Console", desc: "Manage requests, generate reports, publish content", onClick: () => navigate("/stage3/portfolio-management/overview"), icon: Settings2 }] : []),
        ].map((a) => (
          <button
            key={a.label}
            onClick={a.onClick}
            className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-orange-300 hover:shadow-md transition-all group"
          >
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors">
              <a.icon className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900">{a.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
