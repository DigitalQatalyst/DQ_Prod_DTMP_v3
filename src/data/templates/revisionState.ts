import { makeLocalStorageStore } from "@/data/shared/localStorageUtils";

export type RevisionStatus = "Submitted" | "Assigned" | "In Progress" | "Completed";

export interface TemplateRevision {
  id: string;
  linkedRequestId: string;
  documentType: string;
  documentTitle: string;
  revisionNote: string;
  submittedDate: string;
  updatedAt: string;
  status: RevisionStatus;
  assignedTo?: string;
  completedDate?: string;
}

const REVISIONS_KEY = "dtmp.templates.revisions";
const store = makeLocalStorageStore<TemplateRevision>(REVISIONS_KEY, 300);

const readRevisions = (): TemplateRevision[] => store.read();
const writeRevisions = (revisions: TemplateRevision[]): void => store.write(revisions);

export const getTemplateRevisions = (): TemplateRevision[] => {
  const revisions = readRevisions().sort(
    (a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()
  );
  return revisions;
};

export const addTemplateRevision = ({
  linkedRequestId,
  documentType,
  documentTitle,
  revisionNote,
}: {
  linkedRequestId: string;
  documentType: string;
  documentTitle: string;
  revisionNote: string;
}): TemplateRevision | null => {
  const trimmedNote = revisionNote.trim();
  if (!trimmedNote) return null;

  const now = new Date().toISOString();
  const revisionCount = readRevisions().length + 1;
  
  const revision: TemplateRevision = {
    id: `REV-2026-${String(revisionCount).padStart(3, '0')}`,
    linkedRequestId,
    documentType,
    documentTitle,
    revisionNote: trimmedNote,
    submittedDate: now,
    updatedAt: now,
    status: "Submitted",
  };

  const revisions = readRevisions();
  writeRevisions([revision, ...revisions]);
  return revision;
};

export const updateRevisionStatus = (
  revisionId: string,
  status: RevisionStatus
): TemplateRevision | null => {
  const revisions = readRevisions();
  let updated: TemplateRevision | null = null;
  const next = revisions.map((revision) => {
    if (revision.id !== revisionId) return revision;
    updated = {
      ...revision,
      status,
      updatedAt: new Date().toISOString(),
      ...(status === "Completed" ? { completedDate: new Date().toISOString() } : {}),
    };
    return updated;
  });
  writeRevisions(next);
  return updated;
};

export const assignRevision = (
  revisionId: string,
  assignedTo: string
): TemplateRevision | null => {
  const revisions = readRevisions();
  let updated: TemplateRevision | null = null;
  const next = revisions.map((revision) => {
    if (revision.id !== revisionId) return revision;
    updated = {
      ...revision,
      assignedTo,
      status: "Assigned",
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });
  writeRevisions(next);
  return updated;
};
