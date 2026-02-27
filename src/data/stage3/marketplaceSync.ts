import type { Stage3Request, Stage3RequestStatus } from "./types";
import { updateTORequestStatus, type TORequestStatus } from "@/data/knowledgeCenter/requestState";
import {
  updateLearningTORequestStatus,
  type LearningTORequestStatus,
} from "@/data/learningCenter/requestState";
import { updateLearningChangeSetStatus } from "@/data/learningCenter/changeReviewState";

const mapStage3ToMarketplaceStatus = (
  status: Stage3RequestStatus
): TORequestStatus | LearningTORequestStatus => {
  if (status === "completed") return "Resolved";
  if (status === "pending-review" || status === "in-progress" || status === "assigned") {
    return "In Review";
  }
  return "Open";
};

export const syncMarketplaceRequestStatusFromStage3 = (request: Stage3Request) => {
  const linkedAssets = request.relatedAssets ?? [];
  const mappedStatus = mapStage3ToMarketplaceStatus(request.status);

  for (const asset of linkedAssets) {
    if (asset.startsWith("knowledge-request:")) {
      const requestId = asset.replace("knowledge-request:", "").trim();
      if (requestId) updateTORequestStatus(requestId, mappedStatus as TORequestStatus);
    }
    if (asset.startsWith("learning-request:")) {
      const requestId = asset.replace("learning-request:", "").trim();
      if (requestId) {
        updateLearningTORequestStatus(requestId, mappedStatus as LearningTORequestStatus);
      }
    }
    if (asset.startsWith("learning-change:")) {
      const changeId = asset.replace("learning-change:", "").trim();
      if (!changeId) continue;
      if (request.status === "completed") {
        updateLearningChangeSetStatus(changeId, "approved", "Approved by TO in Stage 3.");
      } else if (request.status === "cancelled") {
        updateLearningChangeSetStatus(changeId, "rejected", "Rejected by TO in Stage 3.");
      } else {
        updateLearningChangeSetStatus(changeId, "in-review");
      }
    }
  }
};
