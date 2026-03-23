import { Bell, Bookmark, BookOpen, Clock, FileQuestion, LayoutGrid, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MentionNotification } from "@/data/knowledgeCenter/collaborationState";
import type { TORequest, TORequestStatus } from "@/data/knowledgeCenter/requestState";
import type { KnowledgeHistoryEntry } from "@/data/knowledgeCenter/userKnowledgeState";

export type KnowledgeWorkspaceTab = "overview" | "saved" | "history";

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
];

export const isKnowledgeWorkspaceTab = (
  value: string | undefined
): value is KnowledgeWorkspaceTab =>
  value === "overview" || value === "saved" || value === "history";

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
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search saved/history..."
            className="pl-9"
          />
        </div>
        <div className="space-y-2">
          {knowledgeTabConfig.map((workspaceTab) => {
            const Icon = workspaceTab.icon;
            return (
              <button
                key={workspaceTab.id}
                type="button"
                onClick={() => onTabChange(workspaceTab.id)}
                className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                  activeTab === workspaceTab.id
                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                    : "text-gray-700 hover:bg-gray-50 border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium">{workspaceTab.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {workspaceTab.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Request type label map ───────────────────────────────────────────────────
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

// ── Small KPI card ────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  onClick,
}: {
  label: string;
  value: number;
  sub: string;
  icon: React.ElementType;
  accent: string;
  onClick?: () => void;
}) {
  const inner = (
    <div className={`bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 h-full ${onClick ? "hover:shadow-md hover:border-gray-300 transition-all cursor-pointer" : ""}`}>
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
  return onClick ? (
    <button type="button" onClick={onClick} className="text-left h-full">
      {inner}
    </button>
  ) : (
    <div>{inner}</div>
  );
}

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

  return (
    <div className="h-full">
      <div className="p-6 space-y-6">
        {/* ── Page header ───────────────────────────────────────────────────── */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {knowledgeTabConfig.find((t) => t.id === activeTab)?.label}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {knowledgeTabConfig.find((t) => t.id === activeTab)?.description}
          </p>
        </div>

        {/* ── OVERVIEW ──────────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPI row */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <KpiCard
                label="Saved Resources"
                value={savedItems.length}
                sub="in your workspace"
                icon={Bookmark}
                accent="bg-orange-100 text-orange-600"
                onClick={() => onTabChange("saved")}
              />
              <KpiCard
                label="Articles Read"
                value={historyItems.length}
                sub="in reading history"
                icon={BookOpen}
                accent="bg-blue-100 text-blue-600"
                onClick={() => onTabChange("history")}
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

            {/* Continue Reading — hero section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-gray-900">Continue Reading</h4>
                {historyItems.length > 6 && (
                  <button
                    type="button"
                    onClick={() => onTabChange("history")}
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                  >
                    View full history →
                  </button>
                )}
              </div>
              {continueItems.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 text-center">
                  <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">No reading activity yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Browse the Knowledge Center and open any resource to build your reading list.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {continueItems.slice(0, 6).map(({ item, entry }) => (
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
              )}
            </section>

            {/* My Requests — status-only, no workflow controls */}
            {requests.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-900">My Submitted Requests</h4>
                  <span className="text-xs text-gray-400">{openRequestCount} open</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
                  {requests.slice(0, 5).map((request) => (
                    <div key={request.id} className="px-5 py-3.5 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 truncate">{request.message}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {REQUEST_TYPE_LABELS[request.type] ?? request.type}
                        </span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${REQUEST_STATUS_COLORS[request.status]}`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Mention notifications — only shown if any exist */}
            {mentionNotifications.length > 0 && (
              <section>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Mentions</h4>
                <div className="space-y-2">
                  {mentionNotifications.slice(0, 4).map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => onNotificationClick(notification)}
                      className={`w-full text-left text-xs rounded-xl border px-4 py-3 transition-colors ${
                        notification.read
                          ? "border-gray-200 text-gray-500 hover:border-gray-300"
                          : "border-orange-300 bg-orange-50 text-gray-800 hover:bg-orange-100"
                      }`}
                    >
                      {notification.message}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* ── SAVED ─────────────────────────────────────────────────────────── */}
        {activeTab === "saved" && (
          <div className="space-y-3">
            {savedItems.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 text-center">
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

        {/* ── HISTORY ───────────────────────────────────────────────────────── */}
        {activeTab === "history" && (
          <div className="space-y-3">
            {historyItems.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 text-center">
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
      </div>
    </div>
  );
}
