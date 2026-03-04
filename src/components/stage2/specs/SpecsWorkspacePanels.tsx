import React from "react";
import SolutionSpecsOverview from "@/pages/stage2/specs/SolutionSpecsOverview";
import ArchitectureLibraryPage from "@/pages/stage2/specs/ArchitectureLibraryPage";
import BlueprintDetailPage from "@/pages/stage2/specs/BlueprintDetailPage";
import DesignTemplatesPage from "@/pages/stage2/specs/DesignTemplatesPage";
import SpecTemplateDetailPage from "@/pages/stage2/specs/TemplateDetailPage";
import DesignPatternsPage from "@/pages/stage2/specs/DesignPatternsPage";
import PatternDetailPage from "@/pages/stage2/specs/PatternDetailPage";
import MyDesignsPage from "@/pages/stage2/specs/MyDesignsPage";
import DesignDetailPage from "@/pages/stage2/specs/DesignDetailPage";
import SpecsMyRequestsPage from "@/pages/stage2/specs/MyRequestsPage";

export type SpecsWorkspaceTab = "overview" | "my-requests";

interface SpecsWorkspaceSidebarProps {
    activeTab: SpecsWorkspaceTab;
    onTabChange: (tab: SpecsWorkspaceTab) => void;
}

export const SpecsWorkspaceSidebar: React.FC<SpecsWorkspaceSidebarProps> = ({
    activeTab,
    onTabChange,
}) => {
    return (
        <div className="space-y-2">
            <button
                onClick={() => onTabChange("overview")}
                className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${activeTab === "overview"
                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                    : "text-gray-700 hover:bg-gray-50 border border-transparent"
                    }`}
            >
                <div className="text-left">
                    <div className="font-medium">Overview</div>
                    <div className="text-xs text-gray-500 mt-0.5">Solutions specs workspace summary</div>
                </div>
            </button>
            <button
                onClick={() => onTabChange("my-requests")}
                className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${activeTab === "my-requests"
                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                    : "text-gray-700 hover:bg-gray-50 border border-transparent"
                    }`}
            >
                <div className="text-left">
                    <div className="font-medium">My Requests</div>
                    <div className="text-xs text-gray-500 mt-0.5">Track and manage spec builds</div>
                </div>
            </button>
        </div>
    );
};

interface SpecsWorkspaceMainProps {
    activeTab: SpecsWorkspaceTab;
}

export const SpecsWorkspaceMain: React.FC<SpecsWorkspaceMainProps> = ({
    activeTab,
}) => {
    return (
        <div className="h-full">
            {activeTab === "overview" && <SolutionSpecsOverview />}
            {activeTab === "my-requests" && <SpecsMyRequestsPage />}
        </div>
    );
};
