export interface KnowledgeUsageMetric {
  itemId: string;
  views: number;
  saves: number;
  helpfulVotes: number;
  readingDepth: number;
  staleFlags: number;
  lastViewedAt?: string;
}

const METRICS_KEY = "dtmp.knowledge.metrics";
const isBrowser = typeof window !== "undefined";

const parseJson = <T>(raw: string | null, fallback: T): T => {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const readMetrics = (): KnowledgeUsageMetric[] => {
  if (!isBrowser) return [];
  return parseJson<KnowledgeUsageMetric[]>(
    window.localStorage.getItem(METRICS_KEY),
    []
  );
};

const writeMetrics = (metrics: KnowledgeUsageMetric[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem(METRICS_KEY, JSON.stringify(metrics.slice(0, 500)));
};

const ensureMetric = (itemId: string, metrics: KnowledgeUsageMetric[]) => {
  const existing = metrics.find((metric) => metric.itemId === itemId);
  if (existing) return existing;
  const created: KnowledgeUsageMetric = {
    itemId,
    views: 0,
    saves: 0,
    helpfulVotes: 0,
    readingDepth: 0,
    staleFlags: 0,
  };
  metrics.push(created);
  return created;
};

const mutateMetric = (
  itemId: string,
  mutator: (metric: KnowledgeUsageMetric) => void
): KnowledgeUsageMetric => {
  const metrics = readMetrics();
  const metric = ensureMetric(itemId, metrics);
  mutator(metric);
  writeMetrics(metrics);
  return metric;
};

export const getKnowledgeUsageMetrics = (): KnowledgeUsageMetric[] =>
  readMetrics().sort((a, b) => b.views - a.views);

export const getKnowledgeUsageMetric = (
  itemId: string
): KnowledgeUsageMetric | undefined => readMetrics().find((metric) => metric.itemId === itemId);

export const recordKnowledgeViewMetric = (itemId: string): KnowledgeUsageMetric =>
  mutateMetric(itemId, (metric) => {
    metric.views += 1;
    metric.lastViewedAt = new Date().toISOString();
  });

export const recordKnowledgeSaveMetric = (
  itemId: string,
  saved: boolean
): KnowledgeUsageMetric =>
  mutateMetric(itemId, (metric) => {
    if (saved) metric.saves += 1;
  });

export const recordHelpfulVoteMetric = (itemId: string): KnowledgeUsageMetric =>
  mutateMetric(itemId, (metric) => {
    metric.helpfulVotes += 1;
  });

export const recordReadingDepthMetric = (
  itemId: string,
  depthPercent: number
): KnowledgeUsageMetric =>
  mutateMetric(itemId, (metric) => {
    metric.readingDepth = Math.max(metric.readingDepth, Math.max(0, Math.min(100, depthPercent)));
  });

export const recordStaleFlagMetric = (itemId: string): KnowledgeUsageMetric =>
  mutateMetric(itemId, (metric) => {
    metric.staleFlags += 1;
  });
