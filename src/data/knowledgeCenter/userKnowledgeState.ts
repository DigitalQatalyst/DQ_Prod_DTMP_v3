import { getKnowledgeItem, knowledgeItems, type KnowledgeTab } from "./knowledgeItems";

const STORAGE_SAVED_KEY = "dtmp.knowledge.saved";
const STORAGE_HISTORY_KEY = "dtmp.knowledge.history";

export interface KnowledgeHistoryEntry {
  id: string;
  sourceTab: KnowledgeTab;
  sourceId: string;
  title: string;
  lastViewedAt: string;
  views: number;
}

const isBrowser = typeof window !== "undefined";

const readArray = (key: string): string[] => {
  if (!isBrowser) return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
  } catch {
    return [];
  }
};

const writeArray = (key: string, values: string[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(values));
};

const readHistory = (): KnowledgeHistoryEntry[] => {
  if (!isBrowser) return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_HISTORY_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter(
          (entry) =>
            typeof entry?.id === "string" &&
            typeof entry?.sourceTab === "string" &&
            typeof entry?.sourceId === "string"
        )
      : [];
  } catch {
    return [];
  }
};

const writeHistory = (entries: KnowledgeHistoryEntry[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(entries));
};

const toCompositeId = (tab: KnowledgeTab, sourceId: string) => `${tab}:${sourceId}`;

export const getSavedKnowledgeIds = (): string[] => readArray(STORAGE_SAVED_KEY);

export const isSavedKnowledgeItem = (tab: KnowledgeTab, sourceId: string): boolean =>
  getSavedKnowledgeIds().includes(toCompositeId(tab, sourceId));

export const toggleSavedKnowledgeItem = (
  tab: KnowledgeTab,
  sourceId: string
): { saved: boolean; ids: string[] } => {
  const compositeId = toCompositeId(tab, sourceId);
  const existing = getSavedKnowledgeIds();
  const saved = !existing.includes(compositeId);
  const next = saved
    ? [compositeId, ...existing]
    : existing.filter((id) => id !== compositeId);
  writeArray(STORAGE_SAVED_KEY, next);
  return { saved, ids: next };
};

export const recordKnowledgeView = (tab: KnowledgeTab, sourceId: string): void => {
  const item = getKnowledgeItem(tab, sourceId);
  if (!item) return;

  const existing = readHistory();
  const now = new Date().toISOString();
  const existingEntry = existing.find((entry) => entry.id === item.id);
  const nextEntry: KnowledgeHistoryEntry = existingEntry
    ? {
        ...existingEntry,
        lastViewedAt: now,
        views: existingEntry.views + 1,
      }
    : {
        id: item.id,
        sourceTab: tab,
        sourceId,
        title: item.title,
        lastViewedAt: now,
        views: 1,
      };

  const remaining = existing.filter((entry) => entry.id !== item.id);
  writeHistory([nextEntry, ...remaining].slice(0, 100));
};

export const getKnowledgeHistory = (): KnowledgeHistoryEntry[] =>
  readHistory().sort(
    (a, b) =>
      new Date(b.lastViewedAt).getTime() - new Date(a.lastViewedAt).getTime()
  );

export const getContinueReading = (limit = 6): KnowledgeHistoryEntry[] =>
  getKnowledgeHistory().slice(0, limit);

export const getSavedKnowledgeItems = () => {
  const ids = getSavedKnowledgeIds();
  const byId = new Map(knowledgeItems.map((item) => [item.id, item]));
  return ids.map((id) => byId.get(id)).filter(Boolean);
};
