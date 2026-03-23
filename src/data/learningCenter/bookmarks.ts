// Persistent bookmark store — localStorage under "dtmp.lc.bookmarks"

const BOOKMARKS_KEY = "dtmp.lc.bookmarks";
const isBrowser = typeof window !== "undefined";

export interface BookmarkEntry {
  courseId: string;
  savedAt: string; // ISO date string
  note?: string;
}

// Seed IDs shown in Stage 2 before the user adds their own
const SEED_IDS = [
  "net-zero-2050-architecture-role",
  "digital-customer-experience-utilities",
  "cybersecurity-architecture-operational-technology",
  "enterprise-architecture-governance-leading-ea-office",
];

function seedIfEmpty(entries: BookmarkEntry[]): BookmarkEntry[] {
  if (entries.length > 0) return entries;
  return SEED_IDS.map((courseId, i) => ({
    courseId,
    savedAt: new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }));
}

export function getBookmarks(): BookmarkEntry[] {
  if (!isBrowser) return [];
  try {
    const raw = window.localStorage.getItem(BOOKMARKS_KEY);
    const parsed: BookmarkEntry[] = raw ? JSON.parse(raw) : [];
    const seeded = seedIfEmpty(parsed);
    if (seeded !== parsed) {
      window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(seeded));
    }
    return seeded;
  } catch {
    return [];
  }
}

export function isBookmarked(courseId: string): boolean {
  return getBookmarks().some((b) => b.courseId === courseId);
}

export function addBookmark(courseId: string, note?: string): BookmarkEntry[] {
  if (!isBrowser) return [];
  const existing = getBookmarks().filter((b) => b.courseId !== courseId);
  const entry: BookmarkEntry = { courseId, savedAt: new Date().toISOString(), note };
  const updated = [entry, ...existing];
  window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  return updated;
}

export function removeBookmark(courseId: string): BookmarkEntry[] {
  if (!isBrowser) return [];
  const updated = getBookmarks().filter((b) => b.courseId !== courseId);
  window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  return updated;
}
