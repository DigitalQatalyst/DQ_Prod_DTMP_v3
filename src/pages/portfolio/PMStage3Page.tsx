import { useState } from "react";
import {
  LayoutGrid,
  Clock,
  CheckCircle,
  Edit3,
  Settings,
  Search,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertTriangle,
  Plus,
  Trash2,
  FileText,
} from "lucide-react";
import { getPMRequests, type PMRequest, type PMRequestStatus } from "@/data/portfolioManagement/serviceRequests";
import { PM_TAB_CONFIG, type PMTab } from "@/data/portfolioManagement";

type Stage3Nav = "overview" | "request-queue" | "active-requests" | "completed" | "content-management";

const STATUS_COLOR: Record<PMRequestStatus, string> = {
  Submitted: "bg-blue-100 text-blue-700",
  Assigned: "bg-purple-100 text-purple-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Delivered: "bg-green-100 text-green-700",
  Completed: "bg-gray-100 text-gray-700",
};

// ── Content Management demo data ─────────────────────────────────────────

interface ContentCard {
  id: string;
  type: "rationalisation" | "asset-digitisation";
  title: string;
  division: string;
  status: "Published" | "Draft" | "Archived";
  lastUpdated: string;
  flaggedForReview?: boolean;
}

const DEMO_CONTENT: ContentCard[] = [
  { id: "C-01", type: "rationalisation", title: "CRM Platform Duplication", division: "Customer Services & Distribution", status: "Published", lastUpdated: "2026-03-01" },
  { id: "C-02", type: "rationalisation", title: "Data Warehouse Proliferation", division: "Digital DEWA, Generation, Water Services", status: "Published", lastUpdated: "2026-02-15" },
  { id: "C-03", type: "rationalisation", title: "Document Management Duplication", division: "All Divisions", status: "Published", lastUpdated: "2026-01-20", flaggedForReview: true },
  { id: "C-04", type: "asset-digitisation", title: "Generation PLCs — Firmware Currency", division: "Generation", status: "Published", lastUpdated: "2026-03-10", flaggedForReview: true },
  { id: "C-05", type: "asset-digitisation", title: "Water Pipelines — Leak Detection", division: "Water Services", status: "Published", lastUpdated: "2026-02-28" },
];

export default function PMStage3Page() {
  const [activeNav, setActiveNav] = useState<Stage3Nav>("overview");
  const [expandedReq, setExpandedReq] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [generated, setGenerated] = useState<Set<string>>(new Set());
  const [contentCards, setContentCards] = useState<ContentCard[]>(DEMO_CONTENT);
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [publishType, setPublishType] = useState<"rationalisation" | "asset-digitisation">("rationalisation");
  const [newTitle, setNewTitle] = useState("");
  const [newDivision, setNewDivision] = useState("");

  const all = getPMRequests();
  const queue = all.filter((r) => r.status === "Submitted");
  const active = all.filter((r) => ["Assigned", "In Progress"].includes(r.status));
  const completed = all.filter((r) => ["Delivered", "Completed"].includes(r.status));
  const flagged = contentCards.filter((c) => c.flaggedForReview && c.status === "Published");

  const handleGenerate = (id: string) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      setGenerated((prev) => new Set(prev).add(id));
    }, 2500);
  };

  const handlePublishCard = () => {
    if (!newTitle || !newDivision) return;
    const card: ContentCard = {
      id: `C-${String(contentCards.length + 1).padStart(2, "0")}`,
      type: publishType,
      title: newTitle,
      division: newDivision,
      status: "Published",
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    setContentCards((prev) => [card, ...prev]);
    setNewTitle("");
    setNewDivision("");
    setShowPublishForm(false);
  };

  const navItems: { id: Stage3Nav; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "request-queue", label: "Request Queue", count: queue.length },
    { id: "active-requests", label: "Active Requests", count: active.length },
    { id: "completed", label: "Completed", count: completed.length },
    { id: "content-management", label: "Content Management" },
  ];

  return (
    <div className="flex h-full">
      {/* Sub-nav */}
      <aside className="w-44 border-r border-gray-100 bg-gray-50 flex-shrink-0 p-3 space-y-1">
        {navItems.map((n) => (
          <button
            key={n.id}
            onClick={() => setActiveNav(n.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
              activeNav === n.id ? "bg-orange-100 text-orange-700 font-medium" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>{n.label}</span>
            {n.count !== undefined && n.count > 0 && (
              <span className="text-xs bg-orange-200 text-orange-800 rounded-full px-1.5 py-0.5">{n.count}</span>
            )}
          </button>
        ))}
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeNav === "overview" && (
          <div className="space-y-5 max-w-3xl">
            <h2 className="text-lg font-bold text-gray-900">TO Operations — Portfolio Management</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Active Requests", value: active.length + queue.length, color: "text-amber-600 bg-amber-50" },
                { label: "In Queue", value: queue.length, color: "text-blue-600 bg-blue-50" },
                { label: "Delivered This Week", value: completed.length, color: "text-green-600 bg-green-50" },
                { label: "Content Alerts", value: flagged.length, color: "text-red-600 bg-red-50" },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className={`text-2xl font-bold ${s.color.split(" ")[0]}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Requests by tab */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Requests by Portfolio Tab</h3>
              <div className="space-y-2">
                {(Object.entries(PM_TAB_CONFIG) as [PMTab, { label: string }][]).map(([k, v]) => {
                  const count = all.filter((r) => r.tabSource === k).length;
                  return (
                    <div key={k} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-48 truncate">{v.label}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-orange-400"
                          style={{ width: `${all.length > 0 ? (count / all.length) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-4">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content alerts */}
            {flagged.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-semibold text-amber-900">Content Management Alerts</h3>
                </div>
                {flagged.map((c) => (
                  <div key={c.id} className="text-xs text-amber-700 mb-1">
                    • {c.title} — flagged for review (last updated {c.lastUpdated})
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {(activeNav === "request-queue" || activeNav === "active-requests") && (
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-lg font-bold text-gray-900">
              {activeNav === "request-queue" ? "Request Queue" : "Active Requests"}
            </h2>
            <p className="text-sm text-gray-500">
              {activeNav === "request-queue" ? "Unassigned requests awaiting TO assignment" : "Requests currently being fulfilled"}
            </p>
            {(activeNav === "request-queue" ? queue : active).length === 0 ? (
              <div className="text-center py-14 text-gray-400 text-sm">No requests in this view</div>
            ) : (
              <div className="space-y-3">
                {(activeNav === "request-queue" ? queue : active).map((req) => (
                  <TORequestCard
                    key={req.id}
                    req={req}
                    expanded={expandedReq === req.id}
                    generating={generating === req.id}
                    generated={generated.has(req.id)}
                    onToggle={() => setExpandedReq(expandedReq === req.id ? null : req.id)}
                    onGenerate={() => handleGenerate(req.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeNav === "completed" && (
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-lg font-bold text-gray-900">Completed</h2>
            {completed.length === 0 ? (
              <div className="text-center py-14 text-gray-400 text-sm">No completed requests</div>
            ) : (
              <div className="space-y-3">
                {completed.map((req) => (
                  <div key={req.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-4">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{req.reportType}</p>
                      <p className="text-xs text-gray-400">{req.assetTitle} · {req.tabLabel} · Delivered {req.targetDeliveryDate}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[req.status]}`}>{req.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeNav === "content-management" && (
          <div className="space-y-5 max-w-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Content Management</h2>
                <p className="text-sm text-gray-500">
                  Publish and manage Technology Rationalisation and Operational Asset Digitisation cards
                </p>
              </div>
              <button
                onClick={() => setShowPublishForm(!showPublishForm)}
                className="flex items-center gap-1.5 text-sm px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Publish Card
              </button>
            </div>

            {showPublishForm && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">Publish New Card</h3>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Card Type</label>
                  <select
                    value={publishType}
                    onChange={(e) => setPublishType(e.target.value as "rationalisation" | "asset-digitisation")}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <option value="rationalisation">Technology Rationalisation</option>
                    <option value="asset-digitisation">Operational Asset Digitisation</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Title / Overlap Name</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
                    placeholder="e.g. ERP Platform Duplication"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Divisions Affected</label>
                  <input
                    type="text"
                    value={newDivision}
                    onChange={(e) => setNewDivision(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
                    placeholder="e.g. All Divisions"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePublishCard}
                    disabled={!newTitle || !newDivision}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-sm py-2 rounded-lg"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => setShowPublishForm(false)}
                    className="flex-1 border border-gray-200 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {contentCards.map((card) => (
                <div
                  key={card.id}
                  className={`bg-white border rounded-xl px-5 py-4 flex items-center gap-4 ${card.flaggedForReview ? "border-amber-200 bg-amber-50/30" : "border-gray-200"}`}
                >
                  <div className={`w-2 h-8 rounded-full flex-shrink-0 ${card.type === "rationalisation" ? "bg-amber-400" : "bg-teal-400"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${card.type === "rationalisation" ? "bg-amber-100 text-amber-700" : "bg-teal-100 text-teal-700"}`}>
                        {card.type === "rationalisation" ? "Tech Rationalisation" : "Asset Digitisation"}
                      </span>
                      {card.flaggedForReview && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Review needed
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{card.title}</p>
                    <p className="text-xs text-gray-400">{card.division} · Updated {card.lastUpdated}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setContentCards((prev) => prev.map((c) => c.id === card.id ? { ...c, flaggedForReview: false } : c))}
                      className="text-xs px-2 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setContentCards((prev) => prev.map((c) => c.id === card.id ? { ...c, status: "Archived" } : c))}
                      className="text-xs px-2 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TORequestCard({
  req,
  expanded,
  generating,
  generated,
  onToggle,
  onGenerate,
}: {
  req: PMRequest;
  expanded: boolean;
  generating: boolean;
  generated: boolean;
  onToggle: () => void;
  onGenerate: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 flex items-start gap-4 cursor-pointer" onClick={onToggle}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[req.status]}`}>{req.status}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{req.tabLabel}</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">{req.reportType}</p>
          <p className="text-xs text-gray-500">{req.assetTitle} · Submitted {req.submittedDate} · SLA {req.sla}</p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />}
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-4">
          <p className="text-xs text-gray-600">
            <strong>Due:</strong> {req.targetDeliveryDate} · <strong>SLA status:</strong>{" "}
            <span className={req.slaStatus === "On Track" ? "text-green-700" : req.slaStatus === "Approaching" ? "text-amber-700" : "text-red-700"}>
              {req.slaStatus}
            </span>
          </p>

          {/* Generate panel */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              Generate with AI DocWriter
            </h4>
            {!generated ? (
              <button
                onClick={onGenerate}
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white text-sm py-2.5 rounded-lg transition-colors"
              >
                {generating ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Generating document...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Generate {req.reportType}
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Document generated successfully
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{req.reportType}</p>
                    <p className="text-xs text-gray-400">Ready for review and delivery</p>
                  </div>
                </div>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2.5 rounded-lg transition-colors">
                  Deliver to User
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
