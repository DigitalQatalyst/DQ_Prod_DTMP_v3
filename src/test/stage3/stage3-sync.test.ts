import { beforeEach, describe, expect, it } from "vitest";
import { stage3Requests } from "@/data/stage3/requests";
import { syncMarketplaceRequestStatusFromStage3 } from "@/data/stage3/marketplaceSync";
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

const baseSettings: CourseSettings = {
  courseTitle: "Test Course",
  courseCode: "TC-001",
  duration: "4 weeks",
  difficulty: "Beginner",
  language: "English",
  enrollmentType: "open",
  maxEnrollments: "30",
  enrollmentStart: "2026-01-01",
  enrollmentEnd: "2026-12-31",
  passingScore: 70,
  quizAttempts: "2",
  requireCompleteModules: false,
  requirePassQuizzes: false,
  requireFinalProject: false,
  requireFinalExam: false,
  finalExamPassScore: 0,
  cpeCredits: 4,
  primaryInstructor: "Trainer A",
  notifyNewEnrollments: false,
  notifyWeeklyReports: false,
  notifyInactivity: false,
  notifyQuizFailures: false,
};

beforeEach(() => {
  window.localStorage.clear();
  stage3Requests.length = 0;
});

// ─── Knowledge Center sync ────────────────────────────────────────────────────

describe("syncMarketplaceRequestStatusFromStage3 — knowledge-center", () => {
  const knowledgeBase = {
    itemId: "library:governance-guide",
    requesterName: "Test User",
    requesterEmail: "test@dtmp.local",
    requesterRole: "Analyst",
    type: "clarification" as const,
    message: "Please clarify this section.",
  };

  it("syncs Open → In Review when stage3 status is assigned", () => {
    const { stage3 } = createKnowledgeStage3Intake(knowledgeBase)!;
    stage3.status = "assigned";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getTORequests("Test User")[0].status).toBe("In Review");
  });

  it("syncs Open → In Review when stage3 status is in-progress", () => {
    const { stage3 } = createKnowledgeStage3Intake(knowledgeBase)!;
    stage3.status = "in-progress";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getTORequests("Test User")[0].status).toBe("In Review");
  });

  it("syncs to Resolved when stage3 status is completed", () => {
    const { stage3 } = createKnowledgeStage3Intake(knowledgeBase)!;
    stage3.status = "completed";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getTORequests("Test User")[0].status).toBe("Resolved");
  });

  it("syncs to Open when stage3 status is on-hold", () => {
    const { stage3 } = createKnowledgeStage3Intake(knowledgeBase)!;
    stage3.status = "assigned";
    syncMarketplaceRequestStatusFromStage3(stage3);
    stage3.status = "on-hold";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getTORequests("Test User")[0].status).toBe("Open");
  });

  it("does nothing when there are no linked assets", () => {
    const { stage3 } = createKnowledgeStage3Intake(knowledgeBase)!;
    stage3.relatedAssets = [];
    stage3.status = "completed";
    syncMarketplaceRequestStatusFromStage3(stage3);
    // Should remain Open since no sync ran
    expect(getTORequests("Test User")[0].status).toBe("Open");
  });
});

// ─── Learning Center escalation sync ─────────────────────────────────────────

describe("syncMarketplaceRequestStatusFromStage3 — learning-center escalation", () => {
  const learningBase = {
    courseId: "course-002",
    courseName: "Digital Leadership",
    requesterName: "Sync User",
    requesterEmail: "sync@dtmp.local",
    requesterRole: "Manager",
    message: "Please override enrollment.",
  };

  it("syncs to In Review when stage3 is pending-review", () => {
    const { stage3 } = createLearningEscalationStage3Intake(learningBase)!;
    stage3.status = "pending-review";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getLearningTORequests("Sync User")[0].status).toBe("In Review");
  });

  it("syncs to Resolved when stage3 is completed", () => {
    const { stage3 } = createLearningEscalationStage3Intake(learningBase)!;
    stage3.status = "completed";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getLearningTORequests("Sync User")[0].status).toBe("Resolved");
  });
});

// ─── Learning change set sync ─────────────────────────────────────────────────

describe("syncMarketplaceRequestStatusFromStage3 — learning-change", () => {
  const requester = {
    requesterName: "Change Admin",
    requesterEmail: "admin@dtmp.local",
    requesterRole: "Course Admin",
  };

  const makeDraft = (deleteRequested = false) =>
    upsertLearningDraftChangeSet({
      courseId: "course-003",
      courseName: "Test Course",
      requestedBy: "Change Admin",
      settingsBefore: baseSettings,
      settingsAfter: { ...baseSettings, passingScore: 80 },
      deleteRequested,
    });

  it("sets change set to approved when stage3 is completed", () => {
    const draft = makeDraft();
    const { stage3 } = createLearningChangeReviewStage3Intake({
      changeSetId: draft.id,
      ...requester,
    })!;
    stage3.status = "completed";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getLearningChangeSetById(draft.id)?.status).toBe("approved");
  });

  it("sets change set to rejected when stage3 is cancelled", () => {
    const draft = makeDraft();
    const { stage3 } = createLearningChangeReviewStage3Intake({
      changeSetId: draft.id,
      ...requester,
    })!;
    stage3.status = "cancelled";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getLearningChangeSetById(draft.id)?.status).toBe("rejected");
  });

  it("keeps change set in-review for intermediate stage3 statuses", () => {
    const draft = makeDraft();
    const { stage3 } = createLearningChangeReviewStage3Intake({
      changeSetId: draft.id,
      ...requester,
    })!;
    stage3.status = "in-progress";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getLearningChangeSetById(draft.id)?.status).toBe("in-review");
  });
});
