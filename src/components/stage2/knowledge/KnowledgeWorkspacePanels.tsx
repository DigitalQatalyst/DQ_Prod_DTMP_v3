import { useState } from "react";
import {
  Bell,
  Bookmark,
  BookOpen,
  Clock,
  FileQuestion,
  LayoutGrid,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MentionNotification } from "@/data/knowledgeCenter/collaborationState";
import type { TORequest, TORequestStatus } from "@/data/knowledgeCenter/requestState";
import type { KnowledgeHistoryEntry } from "@/data/knowledgeCenter/userKnowledgeState";

// ── Tab types ─────────────────────────────────────────────────────────────────
export type KnowledgeWorkspaceTab = "overview" | "saved" | "history" | "requests";

export const knowledgeTabConfig: Array<{
  id: KnowledgeWorkspaceTab;
  label: string;
  icon: React.ElementType;
  description: string;
}> = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutGrid,
    description: "High-level activity and quick entry points for Knowledge Center collaboration.",
  },
  {
    id: "saved",
    label: "Saved",
    icon: Bookmark,
    description: "Curated resources you bookmarked for later action and team follow-up.",
  },
  {
    id: "history",
    label: "History",
    icon: Clock,
    description: "Recent resources opened in your knowledge workspace.",
  },
  {
    id: "requests",
    label: "My Requests",
    icon: FileQuestion,
    description: "Track the status of your submitted clarifications and stale flags.",
  },
];

export const isKnowledgeWorkspaceTab = (
  value: string | undefined
): value is KnowledgeWorkspaceTab =>
  value === "overview" ||
  value === "saved" ||
  value === "history" ||
  value === "requests";

// ── Shared view types ─────────────────────────────────────────────────────────
interface KnowledgeItemView {
  id: string;
  title: string;
  type: string;
  department: string;
  sourceTab: string;
  sourceId: string;
}

interface KnowledgeSignalView extends KnowledgeItemView {
  author: string;
  updatedAt: string;
  views: number;
  helpfulVotes: number;
  staleFlags: number;
}

interface KnowledgeHistoryItemView {
  item: KnowledgeItemView;
  entry: KnowledgeHistoryEntry;
}

// ── Request display helpers ───────────────────────────────────────────────────
const REQUEST_TYPE_LABELS: Record<string, string> = {
  clarification: "Clarification",
  "outdated-section": "Outdated Section",
  "stale-flag": "Stale Flag",
  collaboration: "Collaboration",
};

const REQUEST_STATUS_COLORS: Record<TORequestStatus, string> = {
  Open: "bg-amber-100 text-amber-700",
  "In Review": "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-700",
};

// ── KPI card (display-only, not clickable) ────────────────────────────────────
function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  sub: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs font-medium text-gray-700 mt-0.5">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
interface KnowledgeSidebarProps {
  activeTab: KnowledgeWorkspaceTab;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onTabChange: (tab: KnowledgeWorkspaceTab) => void;
}

export function KnowledgeWorkspaceSidebar({
  activeTab,
  searchQuery,
  onSearchChange,
  onTabChange,
}: KnowledgeSidebarProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Knowledge Workspace</h3>
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search saved/history..."
            className="pl-9"
          />
        </div>
        <div className="space-y-2">
          {knowledgeTabConfig.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                    : "text-gray-700 hover:bg-gray-50 border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{tab.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
interface KnowledgeMainProps {
  activeTab: KnowledgeWorkspaceTab;
  mentionNotifications: MentionNotification[];
  requests: TORequest[];
  usageSignals: KnowledgeSignalView[];
  continueItems: KnowledgeHistoryItemView[];
  savedItems: KnowledgeItemView[];
  historyItems: KnowledgeHistoryItemView[];
  formatViewedAt: (value: string) => string;
  onTabChange: (tab: KnowledgeWorkspaceTab) => void;
  onNotificationClick: (notification: MentionNotification) => void;
  onAdvanceRequestStatus: (requestId: string, currentStatus: TORequestStatus) => void;
  getNextRequestStatus: (status: TORequestStatus) => TORequestStatus;
  onOpenItem: (sourceTab: string, sourceId: string) => void;
  onToggleSave: (itemId: string) => void;
}

export function KnowledgeWorkspaceMain({
  activeTab,
  mentionNotifications,
  requests,
  continueItems,
  savedItems,
  historyItems,
  formatViewedAt,
  onTabChange,
  onNotificationClick,
  onOpenItem,
  onToggleSave,
}: KnowledgeMainProps) {
  const openRequestCount = requests.filter((r) => r.status !== "Resolved").length;
  const unreadMentionCount = mentionNotifications.filter((n) => !n.read).length;

  // Requests tab local filter
  const [requestStatusFilter, setRequestStatusFilter] = useState<"All" | TORequestStatus>("All");
  const filteredRequests =
    requestStatusFilter === "All"
      ? requests
      : requests.filter((r) => r.status === requestStatusFilter);

  const activeConfig = knowledgeTabConfig.find((t) => t.id === activeTab);

  return (
    <div className="h-full">
      <div className="p-6 space-y-6">
        {/* Page header */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{activeConfig?.label}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{activeConfig?.description}</p>
        </div>

        {/* ── OVERVIEW ────────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-8">

            {/* KPI row — display only */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <KpiCard
                label="Saved Resources"
                value={savedItems.length}
                sub="in your workspace"
                icon={Bookmark}
                accent="bg-orange-100 text-orange-600"
              />
              <KpiCard
                label="Articles Read"
                value={historyItems.length}
                sub="in reading history"
                icon={BookOpen}
                accent="bg-blue-100 text-blue-600"
              />
              <KpiCard
                label="Open Requests"
                value={openRequestCount}
                sub="pending with TO"
                icon={FileQuestion}
                accent="bg-amber-100 text-amber-600"
              />
              <KpiCard
                label="Mentions"
                value={unreadMentionCount}
                sub="unread"
                icon={Bell}
                accent="bg-purple-100 text-purple-600"
              />
            </div>

            {/* Continue Reading — 3 cards max */}
            <section>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Continue Reading</h4>
              {continueItems.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">No reading activity yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Browse the Knowledge Center and open any resource to build your reading list.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-3 gap-4">
                    {continueItems.slice(0, 3).map(({ item, entry }) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onOpenItem(item.sourceTab, item.sourceId)}
                        className="text-left bg-white border border-gray-200 rounded-xl p-5 hover:border-orange-300 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100">
                            {item.type}
                          </span>
                          <span className="text-[11px] text-gray-400">{item.department}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-700 transition-colors leading-snug">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Last viewed {formatViewedAt(entry.lastViewedAt)}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="flex items-center gap-5 mt-4">
                    <button
                      type="button"
                      onClick={() => onTabChange("saved")}
                      className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      View all saved resources →
                    </button>
                    <button
                      type="button"
                      onClick={() => onTabChange("history")}
                      className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Full reading history →
                    </button>
                  </div>
                </>
              )}
            </section>

            {/* My Requests — 3 rows max */}
            <section>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">My Submitted Requests</h4>
              {requests.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <FileQuestion className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">No requests submitted yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Flag outdated content or request clarification from any article.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
                    {requests.slice(0, 3).map((req) => (
                      <div key={req.id} className="px-5 py-3.5 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-700 truncate">{req.message}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            {REQUEST_TYPE_LABELS[req.type] ?? req.type}
                          </span>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full ${REQUEST_STATUS_COLORS[req.status]}`}
                          >
                            {req.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onTabChange("requests")}
                    className="mt-4 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    View all requests →
                  </button>
                </>
              )}
            </section>

            {/* Mentions — only if any */}
            {mentionNotifications.length > 0 && (
              <section>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Mentions</h4>
                <div className="space-y-2">
                  {mentionNotifications.slice(0, 4).map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => onNotificationClick(n)}
                      className={`w-full text-left text-xs rounded-xl border px-4 py-3 transition-colors ${
                        n.read
                          ? "border-gray-200 text-gray-500 hover:border-gray-300"
                          : "border-orange-300 bg-orange-50 text-gray-800 hover:bg-orange-100"
                      }`}
                    >
                      {n.message}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* ── SAVED ───────────────────────────────────────────────────────── */}
        {activeTab === "saved" && (
          <div className="space-y-3">
            {savedItems.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center">
                <Bookmark className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">No saved resources yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Use "Save to Workspace" from any resource detail page.
                </p>
              </div>
            ) : (
              savedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-4 hover:border-orange-200 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => onOpenItem(item.sourceTab, item.sourceId)}
                    className="text-left flex-1"
                  >
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.type} · {item.department}
                    </p>
                  </button>
                  <Button variant="outline" size="sm" onClick={() => onToggleSave(item.id)}>
                    Remove
                  </Button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── HISTORY ─────────────────────────────────────────────────────── */}
        {activeTab === "history" && (
          <div className="space-y-3">
            {historyItems.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center">
                <Clock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">No history yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Open a resource from Stage 1 or Stage 2 to populate this list.
                </p>
              </div>
            ) : (
              historyItems.map(({ item, entry }) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpenItem(item.sourceTab, item.sourceId)}
                  className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-orange-300 hover:shadow-sm transition-all group"
                >
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-700 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.type} · {item.department}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Last viewed {formatViewedAt(entry.lastViewedAt)} · {entry.views} view(s)
                  </p>
                </button>
              ))
            )}
          </div>
        )}

        {/* ── MY REQUESTS ─────────────────────────────────────────────────── */}
        {activeTab === "requests" && (
          <div className="space-y-4">
            {/* Status filter */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-2">
                Status:
              </span>
              {(["All", "Open", "In Review", "Resolved"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRequestStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    requestStatusFilter === s
                      ? "bg-orange-600 text-white border-orange-600"
                      : "bg-white text-gray-700 border-gray-200 hover:border-orange-300"
                  }`}
                >
                  {s}
                </button>
              ))}
              <span className="ml-auto text-sm text-gray-400">
                {filteredRequests.length} request(s)
              </span>
            </div>

            {/* Request list */}
            {filteredRequests.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center">
                <FileQuestion className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">
                  {requests.length === 0
                    ? "No requests submitted yet"
                    : "No requests match this filter"}
                </p>
                {requests.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    Flag outdated content or request clarification from any article.
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
                {filteredRequests.map((req) => (
                  <div key={req.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-gray-800 flex-1 min-w-0">{req.message}</p>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {REQUEST_TYPE_LABELS[req.type] ?? req.type}
                        </span>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full ${REQUEST_STATUS_COLORS[req.status]}`}
                        >
                          {req.status}
                        </span>
                      </div>
                    </div>
                    {req.sectionRef && (
                      <p className="text-xs text-gray-400 mt-1">Section: {req.sectionRef}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(req.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    {req.toResponse && (
                      <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
                        <p className="text-[11px] font-semibold text-green-700 uppercase tracking-wide mb-1">
                          TO Response
                        </p>
                        <p className="text-xs text-green-800 leading-relaxed">{req.toResponse}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
