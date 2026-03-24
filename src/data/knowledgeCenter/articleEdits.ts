const EDITS_KEY = "dtmp.knowledge.articleEdits";
const isBrowser = typeof window !== "undefined";

export interface ArticleEdit {
  sections: Record<string, string>; // section heading → edited body
  editedBy: string;
  editedAt: string;
}

type EditStore = Record<string, ArticleEdit>; // itemId → edit

const readStore = (): EditStore => {
  if (!isBrowser) return {};
  try {
    const raw = window.localStorage.getItem(EDITS_KEY);
    return raw ? (JSON.parse(raw) as EditStore) : {};
  } catch {
    return {};
  }
};

const writeStore = (store: EditStore): void => {
  if (!isBrowser) return;
  window.localStorage.setItem(EDITS_KEY, JSON.stringify(store));
};

export const getArticleEdit = (itemId: string): ArticleEdit | null => {
  return readStore()[itemId] ?? null;
};

export const saveArticleEdit = (itemId: string, edit: ArticleEdit): void => {
  const store = readStore();
  store[itemId] = edit;
  writeStore(store);
};

export const clearArticleEdit = (itemId: string): void => {
  const store = readStore();
  delete store[itemId];
  writeStore(store);
};
