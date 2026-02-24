import { beforeEach, describe, expect, it } from "vitest";
import {
  addKnowledgeComment,
  getCommentsForKnowledgeItem,
  getMentionNotifications,
  markMentionNotificationRead,
} from "@/data/knowledgeCenter/collaborationState";
import {
  addTORequest,
  getTORequests,
  updateTORequestStatus,
} from "@/data/knowledgeCenter/requestState";
import {
  getKnowledgeUsageMetric,
  recordHelpfulVoteMetric,
  recordKnowledgeSaveMetric,
  recordKnowledgeViewMetric,
} from "@/data/knowledgeCenter/analyticsState";
import {
  getKnowledgeHistory,
  getSavedKnowledgeIds,
  recordKnowledgeView,
  toggleSavedKnowledgeItem,
} from "@/data/knowledgeCenter/userKnowledgeState";

const TEST_TAB = "library" as const;
const TEST_SOURCE_ID = "api-first-patterns";
const TEST_ITEM_ID = `${TEST_TAB}:${TEST_SOURCE_ID}`;

describe("Knowledge Center state modules", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("toggles saved state and records reading history", () => {
    const firstToggle = toggleSavedKnowledgeItem(TEST_TAB, TEST_SOURCE_ID);
    expect(firstToggle.saved).toBe(true);
    expect(getSavedKnowledgeIds()).toContain(TEST_ITEM_ID);

    const secondToggle = toggleSavedKnowledgeItem(TEST_TAB, TEST_SOURCE_ID);
    expect(secondToggle.saved).toBe(false);
    expect(getSavedKnowledgeIds()).not.toContain(TEST_ITEM_ID);

    recordKnowledgeView(TEST_TAB, TEST_SOURCE_ID);
    const history = getKnowledgeHistory();
    expect(history.length).toBe(1);
    expect(history[0].id).toBe(TEST_ITEM_ID);
    expect(history[0].views).toBe(1);
  });

  it("creates comments with @mentions and notifications", () => {
    const created = addKnowledgeComment({
      itemId: TEST_ITEM_ID,
      authorName: "John Doe",
      authorRole: "Portfolio Manager",
      body: "Please review this section @Amina Johnson",
    });

    expect(created).toBeTruthy();
    const comments = getCommentsForKnowledgeItem(TEST_ITEM_ID);
    expect(comments.length).toBe(1);
    expect(comments[0].mentions).toContain("Amina Johnson");

    const notifications = getMentionNotifications("Amina Johnson");
    expect(notifications.length).toBe(1);
    expect(notifications[0].read).toBe(false);

    markMentionNotificationRead(notifications[0].id);
    const updatedNotifications = getMentionNotifications("Amina Johnson");
    expect(updatedNotifications[0].read).toBe(true);
  });

  it("submits TO requests and updates status", () => {
    const request = addTORequest({
      itemId: TEST_ITEM_ID,
      requesterName: "John Doe",
      requesterRole: "Portfolio Manager",
      type: "clarification",
      message: "Need clarification on adoption prerequisites.",
      sectionRef: "Implementation Notes",
    });

    expect(request).toBeTruthy();
    const openRequests = getTORequests("John Doe");
    expect(openRequests.length).toBe(1);
    expect(openRequests[0].status).toBe("Open");

    const inReview = updateTORequestStatus(openRequests[0].id, "In Review");
    expect(inReview?.status).toBe("In Review");
  });

  it("captures usage metrics", () => {
    recordKnowledgeViewMetric(TEST_ITEM_ID);
    recordKnowledgeSaveMetric(TEST_ITEM_ID, true);
    recordHelpfulVoteMetric(TEST_ITEM_ID);

    const metric = getKnowledgeUsageMetric(TEST_ITEM_ID);
    expect(metric).toBeTruthy();
    expect(metric?.views).toBe(1);
    expect(metric?.saves).toBe(1);
    expect(metric?.helpfulVotes).toBe(1);
  });
});
