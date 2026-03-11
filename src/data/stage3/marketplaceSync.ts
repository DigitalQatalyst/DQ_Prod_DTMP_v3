import type { Stage3Request, Stage3RequestStatus } from "./types";
import { updateTORequestStatus, type TORequestStatus } from "@/data/knowledgeCenter/requestState";
import {
  updateLearningTORequestStatus,
  type LearningTORequestStatus,
} from "@/data/learningCenter/requestState";
import { updateLearningChangeSetStatus } from "@/data/learningCenter/changeReviewState";
import {
  getSupportTORequestById,
  updateSupportTORequestStatus,
  type SupportRequestStatus,
} from "@/data/supportServices/requestState";
import {
  syncStoredSupportRequestFromStage3,
  syncStoredSupportTicketFromStage3,
} from "@/data/supportServices/userSupportState";
import {
  updateBlueprintTORequestStatus,
  type BlueprintRequestStatus,
} from "@/data/blueprints/requestState";
import {
  updateTemplateTORequestStatus,
  type TemplateRequestStatus,
} from "@/data/templates/requestState";
import {
  updateDITORequestStatus,
  type DIRequestStatus,
} from "@/data/digitalIntelligence/requestState";
import {
  updatePortfolioRequestStatus,
  type PortfolioRequestStatus,
} from "@/data/portfolio/requestState";

const mapStage3ToMarketplaceStatus = (
  status: Stage3RequestStatus
): TORequestStatus | LearningTORequestStatus | PortfolioRequestStatus => {
  if (status === "completed") return "Resolved";
  if (status === "pending-review" || status === "in-progress" || status === "assigned") {
    return "In Review";
  }
  return "Open";
};

export const syncMarketplaceRequestStatusFromStage3 = (request: Stage3Request) => {
  const linkedAssets = request.relatedAssets ?? [];
  const mappedStatus = mapStage3ToMarketplaceStatus(request.status);
  const supportSubjectFromTitle = request.title.replace(/^support:\s*/i, "").trim();
  let supportSyncedViaLinkedAsset = false;

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
    if (asset.startsWith("support-request:")) {
      const requestId = asset.replace("support-request:", "").trim();
      if (!requestId) continue;
      const syncedRequest =
        updateSupportTORequestStatus(requestId, mappedStatus as SupportRequestStatus) ??
        getSupportTORequestById(requestId);
      if (!syncedRequest) continue;
      supportSyncedViaLinkedAsset = true;

      syncStoredSupportTicketFromStage3({
        supportTicketId: syncedRequest.supportTicketId,
        supportSubject: syncedRequest.subject || supportSubjectFromTitle,
        supportDescription: syncedRequest.description,
        stage3Status: request.status,
        assignedTo: request.assignedTo,
        assignedTeam: request.assignedTeam,
        updatedAt: request.updatedAt,
      });
      syncStoredSupportRequestFromStage3({
        supportServiceRequestId: syncedRequest.supportServiceRequestId,
        supportTitle: syncedRequest.subject || supportSubjectFromTitle,
        supportDescription: syncedRequest.description,
        stage3Status: request.status,
        updatedAt: request.updatedAt,
      });
    }
    if (asset.startsWith("solution-spec-request:")) {
      const requestId = asset.replace("solution-spec-request:", "").trim();
      if (requestId) updateBlueprintTORequestStatus(requestId, mappedStatus as BlueprintRequestStatus);
    }
    if (asset.startsWith("solution-build-request:")) {
      const requestId = asset.replace("solution-build-request:", "").trim();
      if (requestId) updateBlueprintTORequestStatus(requestId, mappedStatus as BlueprintRequestStatus);
    }
    if (asset.startsWith("template-request:")) {
      const requestId = asset.replace("template-request:", "").trim();
      if (requestId) updateTemplateTORequestStatus(requestId, mappedStatus as TemplateRequestStatus);
    }
    if (asset.startsWith("di-request:")) {
      const requestId = asset.replace("di-request:", "").trim();
      if (requestId) updateDITORequestStatus(requestId, mappedStatus as DIRequestStatus);
    }
    if (asset.startsWith("portfolio-request:")) {
      const requestId = asset.replace("portfolio-request:", "").trim();
      if (requestId) updatePortfolioRequestStatus(requestId, mappedStatus as PortfolioRequestStatus);
    }
  }

  if (!supportSyncedViaLinkedAsset && request.type === "support-services" && supportSubjectFromTitle) {
    syncStoredSupportTicketFromStage3({
      supportSubject: supportSubjectFromTitle,
      stage3Status: request.status,
      assignedTo: request.assignedTo,
      assignedTeam: request.assignedTeam,
      updatedAt: request.updatedAt,
    });
    syncStoredSupportRequestFromStage3({
      supportTitle: supportSubjectFromTitle,
      stage3Status: request.status,
      updatedAt: request.updatedAt,
    });
  }
};
