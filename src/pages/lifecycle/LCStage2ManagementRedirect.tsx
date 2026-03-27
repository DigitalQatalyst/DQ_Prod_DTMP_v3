import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Stage 2 "Lifecycle Management" is driven by Stage2AppPage's internal orchestrator
 * (it reads location.state.marketplace/cardId).
 * Passes through an optional cardId from the incoming state so callers can
 * deep-link to a specific sub-view (e.g. "initiative-requests" after form submit).
 */
export default function LCStage2ManagementRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const incomingCardId = (location.state as { cardId?: string } | null)?.cardId;

  useEffect(() => {
    navigate("/stage2", {
      replace: true,
      state: {
        marketplace: "lifecycle-management",
        serviceName: "Lifecycle Management",
        cardId: incomingCardId ?? "overview",
      },
    });
  }, [navigate, incomingCardId]);

  return null;
}
