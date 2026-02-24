export interface KnowledgeComment {
  id: string;
  itemId: string;
  authorName: string;
  authorRole: string;
  body: string;
  mentions: string[];
  createdAt: string;
}

export interface MentionNotification {
  id: string;
  itemId: string;
  commentId: string;
  mentionedUser: string;
  mentionedBy: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const COMMENTS_KEY = "dtmp.knowledge.comments";
const NOTIFICATIONS_KEY = "dtmp.knowledge.mentionNotifications";

const collaboratorDirectory = [
  "John Doe",
  "Amina Johnson",
  "Michael Rodriguez",
  "Sarah Chen",
  "David Park",
];

const isBrowser = typeof window !== "undefined";

const normalize = (value: string) => value.trim().toLowerCase();

const parseJson = <T>(raw: string | null, fallback: T): T => {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const readComments = (): KnowledgeComment[] => {
  if (!isBrowser) return [];
  return parseJson<KnowledgeComment[]>(
    window.localStorage.getItem(COMMENTS_KEY),
    []
  );
};

const writeComments = (comments: KnowledgeComment[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
};

const readNotifications = (): MentionNotification[] => {
  if (!isBrowser) return [];
  return parseJson<MentionNotification[]>(
    window.localStorage.getItem(NOTIFICATIONS_KEY),
    []
  );
};

const writeNotifications = (notifications: MentionNotification[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem(
    NOTIFICATIONS_KEY,
    JSON.stringify(notifications.slice(0, 200))
  );
};

export const getCollaboratorDirectory = () => [...collaboratorDirectory];

export const extractMentions = (body: string): string[] => {
  const pattern = /@([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/g;
  const matches = new Set<string>();
  let result = pattern.exec(body);
  while (result) {
    const matched = collaboratorDirectory.find(
      (person) => normalize(person) === normalize(result[1])
    );
    if (matched) matches.add(matched);
    result = pattern.exec(body);
  }
  return Array.from(matches);
};

export const getCommentsForKnowledgeItem = (itemId: string): KnowledgeComment[] =>
  readComments()
    .filter((comment) => comment.itemId === itemId)
    .sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

export const addKnowledgeComment = ({
  itemId,
  authorName,
  authorRole,
  body,
}: {
  itemId: string;
  authorName: string;
  authorRole: string;
  body: string;
}): KnowledgeComment | null => {
  const trimmed = body.trim();
  if (!trimmed) return null;

  const mentions = extractMentions(trimmed).filter(
    (name) => normalize(name) !== normalize(authorName)
  );
  const comment: KnowledgeComment = {
    id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    itemId,
    authorName,
    authorRole,
    body: trimmed,
    mentions,
    createdAt: new Date().toISOString(),
  };

  const comments = readComments();
  writeComments([...comments, comment]);

  if (mentions.length > 0) {
    const notifications = readNotifications();
    const newNotifications = mentions.map<MentionNotification>((mentionedUser) => ({
      id: `mention-${Date.now()}-${mentionedUser.replace(/\s+/g, "-").toLowerCase()}`,
      itemId,
      commentId: comment.id,
      mentionedUser,
      mentionedBy: authorName,
      message: `${authorName} mentioned you in a knowledge comment`,
      createdAt: new Date().toISOString(),
      read: false,
    }));
    writeNotifications([...newNotifications, ...notifications]);
  }

  return comment;
};

export const getMentionNotifications = (forUser: string): MentionNotification[] =>
  readNotifications()
    .filter((notification) => normalize(notification.mentionedUser) === normalize(forUser))
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

export const markMentionNotificationRead = (notificationId: string) => {
  const updated = readNotifications().map((notification) =>
    notification.id === notificationId ? { ...notification, read: true } : notification
  );
  writeNotifications(updated);
};
