import { beforeEach, describe, expect, it } from "vitest";
import { stage3Requests } from "@/data/stage3/requests";
import {
  createKnowledgeStage3Intake,
  createLearningEscalationStage3Intake,
  createLearningChangeReviewStage3Intake,
} from "@/data/stage3/intake";
import { getTORequests } from "@/data/knowledgeCenter/requestState";
import { getLearningTORequests } from "@/data/learningCenter/requestState";
import {
  upsertLearningDraftChangeSet,
  getLearningChangeSetById,
} from "@/data/learningCenter/changeReviewState";
import type { CourseSettings } from "@/data/learningCenter/stage2/types";

// ── helpers ───────────────────────────────────────────────────────────────────

const baseSettings: CourseSettings = {
  courseTitle: "Agile Transformation",
  courseCode: "AT-101",
  duration: "8 weeks",
  difficulty: "Intermediate",
  language: "English",
  enrollmentType: "open",
  maxEnrollments: "50",
  enrollmentStart: "2026-01-01",
  enrollmentEnd: "2026-12-31",
  passingScore: 70,
  quizAttempts: "3",
  requireCompleteModules: true,
  requirePassQuizzes: false,
  requireFinalProject: false,
  requireFinalExam: false,
  finalExamPassScore: 0,
  cpeCredits: 8,
  primaryInstructor: "Jane Smith",
  notifyNewEnrollments: true,
  notifyWeeklyReports: false,
  notifyInactivity: false,
  notifyQuizFailures: false,
};

beforeEach(() => {
  window.localStorage.clear();
  stage3Requests.length = 0;
});

// ─── createKnowledgeStage3Intake ─────────────────────────────────────────────

describe("createKnowledgeStage3Intake", () => {
  const base = {
    itemId: "library:api-first-patterns",
    requesterName: "Sarah Johnson",
    requesterEmail: "sarah@dtmp.local",
    requesterRole: "Solution Architect",
    type: "clarification" as const,
    message: "Need clarification on section 3.2.",
  };

  it("returns both marketplace request and stage3 request", () => {
    const result = createKnowledgeStage3Intake(base);
    expect(result).not.toBeNull();
    expect(result!.request).toBeTruthy();
    expect(result!.stage3).toBeTruthy();
  });

  it("persists the marketplace TO request to localStorage", () => {
    createKnowledgeStage3Intake(base);
    const stored = getTORequests("Sarah Johnson");
    expect(stored).toHaveLength(1);
    expect(stored[0].itemId).toBe("library:api-first-patterns");
    expect(stored[0].type).toBe("clarification");
    expect(stored[0].status).toBe("Open");
  });

  it("links the marketplace request to the stage3 request id", () => {
    const result = createKnowledgeStage3Intake(base)!;
    const stored = getTORequests("Sarah Johnson");
    expect(stored[0].stage3RequestId).toBe(result.stage3.id);
  });

  it("adds the stage3 request to the in-memory array", () => {
    createKnowledgeStage3Intake(base);
    expect(stage3Requests).toHaveLength(1);
    expect(stage3Requests[0].type).toBe("knowledge-center");
  });

  it("sets stage3 type to knowledge-center", () => {
    const result = createKnowledgeStage3Intake(base)!;
    expect(result.stage3.type).toBe("knowledge-center");
  });

  it("includes the related asset link in stage3 relatedAssets", () => {
    const result = createKnowledgeStage3Intake(base)!;
    expect(result.stage3.relatedAssets).toContain(
      `knowledge-request:${result.request!.id}`
    );
  });

  it("sets stage3 title based on request type — clarification", () => {
    const result = createKnowledgeStage3Intake(base)!;
    expect(result.stage3.title).toBe("Knowledge: Clarification Request");
  });

  it("sets stage3 title based on request type — outdated-section", () => {
    const result = createKnowledgeStage3Intake({ ...base, type: "outdated-section" })!;
    expect(result.stage3.title).toBe("Knowledge: Outdated Section Report");
  });

  it("includes optional sectionRef in stage3 description", () => {
    const result = createKnowledgeStage3Intake({
      ...base,
      sectionRef: "Section 3.2",
    })!;
    expect(result.stage3.description).toContain("[Section: Section 3.2]");
    expect(result.stage3.notes).toContain("Section reference: Section 3.2.");
  });

  it("assigns 8 estimated hours for collaboration type", () => {
    const result = createKnowledgeStage3Intake({ ...base, type: "collaboration" })!;
    expect(result.stage3.estimatedHours).toBe(8);
  });

  it("assigns 4 estimated hours for clarification type", () => {
    const result = createKnowledgeStage3Intake(base)!;
    expect(result.stage3.estimatedHours).toBe(4);
  });

  it("applies caller-supplied priority", () => {
    const result = createKnowledgeStage3Intake({ ...base, priority: "high" })!;
    expect(result.stage3.priority).toBe("high");
  });

  it("defaults to medium priority when not provided", () => {
    const result = createKnowledgeStage3Intake(base)!;
    expect(result.stage3.priority).toBe("medium");
  });

  it("returns null when message is empty", () => {
    expect(createKnowledgeStage3Intake({ ...base, message: "   " })).toBeNull();
  });

  it("does not create any stage3 request for empty message", () => {
    createKnowledgeStage3Intake({ ...base, message: "" });
    expect(stage3Requests).toHaveLength(0);
  });
});

// ─── createLearningEscalationStage3Intake ────────────────────────────────────

describe("createLearningEscalationStage3Intake", () => {
  const base = {
    courseId: "course-agile-001",
    courseName: "Agile Transformation Leadership",
    requesterName: "Amina TO",
    requesterEmail: "amina@dtmp.local",
    requesterRole: "Business Analyst",
    message: "User completed prerequisite externally; needs manual enrollment.",
  };

  it("returns both marketplace request and stage3 request", () => {
    const result = createLearningEscalationStage3Intake(base);
    expect(result).not.toBeNull();
    expect(result!.request).toBeTruthy();
    expect(result!.stage3).toBeTruthy();
  });

  it("persists the LearningTORequest to localStorage", () => {
    createLearningEscalationStage3Intake(base);
    const stored = getLearningTORequests("Amina TO");
    expect(stored).toHaveLength(1);
    expect(stored[0].courseId).toBe("course-agile-001");
    expect(stored[0].type).toBe("admin-escalation");
    expect(stored[0].status).toBe("Open");
  });

  it("links the learning request to the stage3 request id", () => {
    const result = createLearningEscalationStage3Intake(base)!;
    const stored = getLearningTORequests("Amina TO");
    expect(stored[0].stage3RequestId).toBe(result.stage3.id);
  });

  it("adds a stage3 request to the in-memory array", () => {
    createLearningEscalationStage3Intake(base);
    expect(stage3Requests).toHaveLength(1);
  });

  it("sets stage3 type to learning-center", () => {
    const result = createLearningEscalationStage3Intake(base)!;
    expect(result.stage3.type).toBe("learning-center");
  });

  it("includes the related asset link in stage3 relatedAssets", () => {
    const result = createLearningEscalationStage3Intake(base)!;
    expect(result.stage3.relatedAssets).toContain(
      `learning-request:${result.request!.id}`
    );
  });

  it("includes the course name in the stage3 title", () => {
    const result = createLearningEscalationStage3Intake(base)!;
    expect(result.stage3.title).toContain("Agile Transformation Leadership");
  });

  it("applies caller-supplied priority", () => {
    const result = createLearningEscalationStage3Intake({ ...base, priority: "critical" })!;
    expect(result.stage3.priority).toBe("critical");
  });

  it("returns null when message is empty", () => {
    expect(createLearningEscalationStage3Intake({ ...base, message: "" })).toBeNull();
  });
});

// ─── createLearningChangeReviewStage3Intake ───────────────────────────────────

describe("createLearningChangeReviewStage3Intake", () => {
  const requesterBase = {
    requesterName: "Course Manager",
    requesterEmail: "cm@dtmp.local",
    requesterRole: "Course Admin",
  };

  const setupDraft = (overrides: Partial<CourseSettings> = {}, deleteRequested = false) => {
    const after = { ...baseSettings, ...overrides };
    return upsertLearningDraftChangeSet({
      courseId: "course-001",
      courseName: "Agile Transformation",
      requestedBy: "Course Manager",
      settingsBefore: baseSettings,
      settingsAfter: after,
      deleteRequested,
    });
  };

  it("submits the draft and creates a linked stage3 request", () => {
    const draft = setupDraft({ passingScore: 80 });
    const result = createLearningChangeReviewStage3Intake({
      changeSetId: draft.id,
      ...requesterBase,
    });
    expect(result).not.toBeNull();
    expect(result!.stage3).toBeTruthy();
    expect(stage3Requests).toHaveLength(1);
  });

  it("sets the changeSet status to in-review after intake", () => {
    const draft = setupDraft({ passingScore: 80 });
    createLearningChangeReviewStage3Intake({ changeSetId: draft.id, ...requesterBase });
    const changeSet = getLearningChangeSetById(draft.id);
    expect(changeSet?.status).toBe("in-review");
  });

  it("stores the stage3RequestId on the change set", () => {
    const draft = setupDraft({ passingScore: 80 });
    const result = createLearningChangeReviewStage3Intake({
      changeSetId: draft.id,
      ...requesterBase,
    })!;
    const changeSet = getLearningChangeSetById(draft.id);
    expect(changeSet?.stage3RequestId).toBe(result.stage3.id);
  });

  it("sets high priority for deletion requests", () => {
    const draft = setupDraft({}, true);
    const result = createLearningChangeReviewStage3Intake({
      changeSetId: draft.id,
      ...requesterBase,
    })!;
    expect(result.stage3.priority).toBe("high");
  });

  it("sets medium priority for setting changes", () => {
    const draft = setupDraft({ passingScore: 85 });
    const result = createLearningChangeReviewStage3Intake({
      changeSetId: draft.id,
      ...requesterBase,
    })!;
    expect(result.stage3.priority).toBe("medium");
  });

  it("sets low priority when there are no diffs and no deletion", () => {
    const draft = setupDraft({});
    const result = createLearningChangeReviewStage3Intake({
      changeSetId: draft.id,
      ...requesterBase,
    })!;
    expect(result.stage3.priority).toBe("low");
  });

  it("includes the related asset link in stage3 relatedAssets", () => {
    const draft = setupDraft({ passingScore: 80 });
    const result = createLearningChangeReviewStage3Intake({
      changeSetId: draft.id,
      ...requesterBase,
    })!;
    expect(result.stage3.relatedAssets).toContain(`learning-change:${draft.id}`);
  });

  it("returns null for an unknown changeSet id", () => {
    const result = createLearningChangeReviewStage3Intake({
      changeSetId: "nonexistent-change-id",
      ...requesterBase,
    });
    expect(result).toBeNull();
    expect(stage3Requests).toHaveLength(0);
  });
});
