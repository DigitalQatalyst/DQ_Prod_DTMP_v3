import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Stage 2 “Lifecycle Management” is driven by Stage2AppPage's internal orchestrator
 * (it reads `location.state.marketplace/cardId`).
 */
export default function LCStage2ManagementRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/stage2", {
      replace: true,
      state: {
        marketplace: "lifecycle-management",
        serviceName: "Lifecycle Management",
        cardId: "overview",
      },
    });
  }, [navigate]);

  return null;
}

