import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, Bookmark, LayoutDashboard, Search, ArrowLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { knowledgeItems } from "@/data/knowledgeCenter/knowledgeItems";
import {
  getContinueReading,
  getKnowledgeHistory,
  getSavedKnowledgeIds,
  toggleSavedKnowledgeItem,
  type KnowledgeHistoryEntry,
} from "@/data/knowledgeCenter/userKnowledgeState";
import {
  getMentionNotifications,
  markMentionNotificationRead,
  type MentionNotification,
} from "@/data/knowledgeCenter/collaborationState";
import {
  getTORequests,
  updateTORequestStatus,
  type TORequest,
  type TORequestStatus,
} from "@/data/knowledgeCenter/requestState";
import { getKnowledgeUsageMetrics } from "@/data/knowledgeCenter/analyticsState";

type KnowledgeWorkspaceTab = "overview" | "saved" | "history";

const tabConfig: Array<{
  id: KnowledgeWorkspaceTab;
  label: string;
  icon: React.ElementType;
  description: string;
}> = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
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

export default function Stage2KnowledgePage() {
  const navigate = useNavigate();
  const { tab = "overview" } = useParams<{ tab: KnowledgeWorkspaceTab }>();
  const activeTab: KnowledgeWorkspaceTab =
    tab === "saved" || tab === "history" ? tab : "overview";
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [history, setHistory] = useState<KnowledgeHistoryEntry[]>([]);
  const [mentionNotifications, setMentionNotifications] = useState<MentionNotification[]>([]);
  const [requests, setRequests] = useState<TORequest[]>([]);
  const [usageSignals, setUsageSignals] = useState<
    Array<(typeof knowledgeItems)[number] & { views: number; staleFlags: number; helpfulVotes: number }>
  >([]);
  const currentUserName = "John Doe";

  const refreshState = () => {
    setSavedIds(getSavedKnowledgeIds());
    setHistory(getKnowledgeHistory());
    setMentionNotifications(getMentionNotifications(currentUserName));
    setRequests(getTORequests(currentUserName));
    const usageById = new Map(
      getKnowledgeUsageMetrics().map((metric) => [metric.itemId, metric])
    );
    const ranked = knowledgeItems
      .map((item) => {
        const metric = usageById.get(item.id);
        return {
          ...item,
          views: metric?.views ?? 0,
          staleFlags: metric?.staleFlags ?? 0,
          helpfulVotes: metric?.helpfulVotes ?? 0,
        };
      })
      .filter((item) => item.views > 0 || item.staleFlags > 0 || item.helpfulVotes > 0)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
    setUsageSignals(ranked);
  };

  useEffect(() => {
    refreshState();
  }, []);

  const savedItems = useMemo(
    () => knowledgeItems.filter((item) => savedIds.includes(item.id)),
    [savedIds]
  );

  const historyItems = useMemo(
    () =>
      history
        .map((entry) => ({
          entry,
          item: knowledgeItems.find((item) => item.id === entry.id),
        }))
        .filter(
          (
            candidate
          ): candidate is { entry: KnowledgeHistoryEntry; item: (typeof knowledgeItems)[number] } =>
            Boolean(candidate.item)
        ),
    [history]
  );

  const continueReadingItems = useMemo(() => {
    const continueEntries = getContinueReading(6);
    return continueEntries
      .map((entry) => ({
        entry,
        item: knowledgeItems.find((item) => item.id === entry.id),
      }))
      .filter(
        (
          candidate
        ): candidate is { entry: KnowledgeHistoryEntry; item: (typeof knowledgeItems)[number] } =>
          Boolean(candidate.item)
      );
  }, [history]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredSavedItems = savedItems.filter(
    (item) =>
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.tags.join(" ").toLowerCase().includes(normalizedQuery)
  );

  const filteredHistoryItems = historyItems.filter(
    ({ item }) =>
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.tags.join(" ").toLowerCase().includes(normalizedQuery)
  );

  const filteredContinueItems = continueReadingItems.filter(
    ({ item }) =>
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.tags.join(" ").toLowerCase().includes(normalizedQuery)
  );

  const formatViewedAt = (value: string) =>
    new Date(value).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const handleToggleSave = (itemId: string) => {
    const [sourceTab, sourceId] = itemId.split(":");
    if (!sourceTab || !sourceId) return;
    if (
      sourceTab !== "best-practices" &&
      sourceTab !== "testimonials" &&
      sourceTab !== "playbooks" &&
      sourceTab !== "library"
    ) {
      return;
    }
    toggleSavedKnowledgeItem(sourceTab, sourceId);
    refreshState();
  };

  const handleNotificationClick = (notification: MentionNotification) => {
    markMentionNotificationRead(notification.id);
    const [sourceTab, sourceId] = notification.itemId.split(":");
    if (!sourceTab || !sourceId) {
      refreshState();
      return;
    }
    navigate(`/stage2/knowledge/${sourceTab}/${sourceId}`);
    refreshState();
  };

  const getNextStatus = (status: TORequestStatus): TORequestStatus => {
    if (status === "Open") return "In Review";
    if (status === "In Review") return "Resolved";
    return "Resolved";
  };

  const handleAdvanceRequestStatus = (requestId: string, currentStatus: TORequestStatus) => {
    updateTORequestStatus(requestId, getNextStatus(currentStatus));
    refreshState();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/marketplaces/knowledge-center")}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-primary-navy">Knowledge Workspace</h1>
              <p className="text-sm text-muted-foreground">
                Stage 2 foundation for saved resources, history, and collaboration actions.
              </p>
            </div>
          </div>
          <Button
            className="bg-orange-600 hover:bg-orange-700"
            onClick={() => navigate("/marketplaces/knowledge-center")}
          >
            Open Library
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search saved items, notes, or recent activity..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-wrap gap-2">
          {tabConfig.map((workspaceTab) => {
            const Icon = workspaceTab.icon;
            return (
              <button
                key={workspaceTab.id}
                type="button"
                onClick={() => navigate(`/stage2/knowledge/${workspaceTab.id}`)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === workspaceTab.id
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {workspaceTab.label}
              </button>
            );
          })}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-primary-navy mb-1">
            {tabConfig.find((workspaceTab) => workspaceTab.id === activeTab)?.label}
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            {tabConfig.find((workspaceTab) => workspaceTab.id === activeTab)?.description}
          </p>

          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="w-4 h-4 text-orange-600" />
                  <h3 className="text-sm font-semibold text-foreground">Mention Notifications</h3>
                </div>
                {mentionNotifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No mention notifications yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {mentionNotifications.slice(0, 4).map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => handleNotificationClick(notification)}
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
                  <h3 className="text-sm font-semibold text-foreground">
                    Clarification/Update Requests
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {requests.filter((request) => request.status !== "Resolved").length} open
                  </span>
                </div>
                {requests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No requests submitted yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {requests.slice(0, 4).map((request) => (
                      <div key={request.id} className="border border-gray-200 rounded-md p-2">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-xs font-semibold text-foreground">
                            {request.type === "clarification"
                              ? "Clarification"
                              : request.type === "collaboration"
                                ? "Collaboration"
                                : "Outdated Section"}
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
                        <p className="text-xs text-muted-foreground mb-2">
                          {request.message}
                        </p>
                        {request.status !== "Resolved" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleAdvanceRequestStatus(request.id, request.status)
                            }
                            className="h-7 text-xs"
                          >
                            Demo: Advance to {getNextStatus(request.status)}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  TO Governance Signals (Read-side)
                </h3>
                {usageSignals.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No usage signals captured yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {usageSignals.map((signal) => (
                      <button
                        key={signal.id}
                        type="button"
                        onClick={() =>
                          navigate(`/stage2/knowledge/${signal.sourceTab}/${signal.sourceId}`)
                        }
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

              {filteredContinueItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No reading activity yet. Open any Knowledge Center resource to build your continue-reading list.
                </p>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredContinueItems.map(({ item, entry }) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        navigate(`/stage2/knowledge/${item.sourceTab}/${item.sourceId}`)
                      }
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
              {filteredSavedItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No saved resources yet. Use "Save to Workspace" from any resource detail page.
                </p>
              ) : (
                filteredSavedItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 flex items-start justify-between gap-4"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/stage2/knowledge/${item.sourceTab}/${item.sourceId}`)
                      }
                      className="text-left flex-1"
                    >
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.type} | {item.department}
                      </p>
                    </button>
                    <Button variant="outline" size="sm" onClick={() => handleToggleSave(item.id)}>
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-3">
              {filteredHistoryItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No history yet. Open a resource from Stage 1 or Stage 2 to populate this list.
                </p>
              ) : (
                filteredHistoryItems.map(({ item, entry }) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      navigate(`/stage2/knowledge/${item.sourceTab}/${item.sourceId}`)
                    }
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
