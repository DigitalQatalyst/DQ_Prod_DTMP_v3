import type { KnowledgeTab } from "./knowledgeItems";

const ARTICLES_KEY = "dtmp.knowledge.userArticles";
const isBrowser = typeof window !== "undefined";

// ── Types ────────────────────────────────────────────────────────────────────

export interface UserArticle {
  id: string;
  sourceId: string;
  sourceTab: KnowledgeTab;
  title: string;
  description: string; // short summary — shown on card
  body: string;        // main content — shown in artefact viewer
  type: string;
  department: string;
  tags: string[];
  audience: string;
  updatedAt: string;
  author: string;
  createdAt: string;
  createdBy: string;
}

// ── Persistence ───────────────────────────────────────────────────────────────

const readArticles = (): UserArticle[] => {
  if (!isBrowser) return [];
  try {
    const raw = window.localStorage.getItem(ARTICLES_KEY);
    return raw ? (JSON.parse(raw) as UserArticle[]) : [];
  } catch {
    return [];
  }
};

const writeArticles = (articles: UserArticle[]): void => {
  if (!isBrowser) return;
  window.localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
};

// ── CRUD ─────────────────────────────────────────────────────────────────────

export const getUserArticles = (): UserArticle[] =>
  readArticles().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

export const getUserArticle = (id: string): UserArticle | null =>
  readArticles().find((a) => a.id === id) ?? null;

export const addUserArticle = (
  input: Omit<UserArticle, "id" | "sourceId" | "createdAt">
): UserArticle => {
  const now = new Date().toISOString();
  const id = `user-article-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const article: UserArticle = { ...input, id, sourceId: id, createdAt: now };
  writeArticles([article, ...readArticles()]);
  return article;
};

export const deleteUserArticle = (id: string): void => {
  writeArticles(readArticles().filter((a) => a.id !== id));
};
