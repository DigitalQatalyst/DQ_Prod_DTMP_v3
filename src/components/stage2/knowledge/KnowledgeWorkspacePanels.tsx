import { Bell, Bookmark, Clock, LayoutGrid, Search } from "lucide-react";
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

interface KnowledgeMainProps {
  activeTab: KnowledgeWorkspaceTab;
  mentionNotifications: MentionNotification[];
  requests: TORequest[];
  usageSignals: KnowledgeSignalView[];
  continueItems: KnowledgeHistoryItemView[];
  savedItems: KnowledgeItemView[];
  historyItems: KnowledgeHistoryItemView[];
  formatViewedAt: (value: string) => string;
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
  usageSignals,
  continueItems,
  savedItems,
  historyItems,
  formatViewedAt,
  onNotificationClick,
  onAdvanceRequestStatus,
  getNextRequestStatus,
  onOpenItem,
  onToggleSave,
}: KnowledgeMainProps) {
  return (
    <div className="h-full">
      <div className="p-6 space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-primary-navy mb-1">
            {knowledgeTabConfig.find((workspaceTab) => workspaceTab.id === activeTab)?.label}
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            {knowledgeTabConfig.find((workspaceTab) => workspaceTab.id === activeTab)?.description}
          </p>

          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="w-4 h-4 text-orange-600" />
                  <h4 className="text-sm font-semibold text-foreground">Mention Notifications</h4>
                </div>
                {mentionNotifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No mention notifications yet.</p>
                ) : (
                  <div className="space-y-2">
                    {mentionNotifications.slice(0, 4).map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => onNotificationClick(notification)}
                        className={`w-full text-left text-xs rounded-md border p-2 ${
                          notification.read
                            ? "border-gray-200 text-muted-foreground"
                            : "border-orange-300 bg-orange-50 text-foreground"
                        }`}
                      >
                        {notification.message}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h4 className="text-sm font-semibold text-foreground">Clarification/Update Requests</h4>
                  <span className="text-xs text-muted-foreground">
                    {requests.filter((request) => request.status !== "Resolved").length} open
                  </span>
                </div>
                {requests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No requests submitted yet.</p>
                ) : (
                  <div className="space-y-2">
                    {requests.slice(0, 4).map((request) => (
                      <div key={request.id} className="border border-gray-200 rounded-md p-2">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-xs font-semibold text-foreground">
                            {request.type === "clarification" ? "Clarification" : "Outdated Section"}
                          </p>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full ${
                              request.status === "Open"
                                ? "bg-orange-100 text-orange-700"
                                : request.status === "In Review"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {request.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{request.message}</p>
                        {request.status !== "Resolved" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAdvanceRequestStatus(request.id, request.status)}
                            className="h-7 text-xs"
                          >
                            Demo: Advance to {getNextRequestStatus(request.status)}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  TO Governance Signals (Read-side)
                </h4>
                {usageSignals.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No usage signals captured yet.</p>
                ) : (
                  <div className="space-y-2">
                    {usageSignals.map((signal) => (
                      <button
                        key={signal.id}
                        type="button"
                        onClick={() => onOpenItem(signal.sourceTab, signal.sourceId)}
                        className="w-full text-left border border-gray-200 rounded-md p-2 hover:border-orange-300"
                      >
                        <p className="text-xs font-semibold text-foreground">{signal.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Owner: {signal.author} | Freshness: {signal.updatedAt}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Views: {signal.views} | Helpful: {signal.helpfulVotes} | Stale Flags: {signal.staleFlags}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {continueItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No reading activity yet. Open any Knowledge Center resource to build your continue-reading list.
                </p>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {continueItems.map(({ item, entry }) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onOpenItem(item.sourceTab, item.sourceId)}
                      className="text-left border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50/30 transition-colors"
                    >
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.type} | {item.department}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Continue reading - Last viewed {formatViewedAt(entry.lastViewedAt)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "saved" && (
            <div className="space-y-3">
              {savedItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No saved resources yet. Use "Save to Workspace" from any resource detail page.
                </p>
              ) : (
                savedItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 flex items-start justify-between gap-4"
                  >
                    <button
                      type="button"
                      onClick={() => onOpenItem(item.sourceTab, item.sourceId)}
                      className="text-left flex-1"
                    >
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.type} | {item.department}
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

          {activeTab === "history" && (
            <div className="space-y-3">
              {historyItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No history yet. Open a resource from Stage 1 or Stage 2 to populate this list.
                </p>
              ) : (
                historyItems.map(({ item, entry }) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onOpenItem(item.sourceTab, item.sourceId)}
                    className="w-full text-left border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50/30 transition-colors"
                  >
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.type} | {item.department}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last viewed {formatViewedAt(entry.lastViewedAt)} - {entry.views} view(s)
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
