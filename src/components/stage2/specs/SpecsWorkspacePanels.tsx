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
import SpecsRequestDetailPage from "@/pages/stage2/specs/SpecsRequestDetailPage";
import AcquiredSpecsPage from "@/pages/stage2/specs/AcquiredSpecsPage";

export type SpecsWorkspaceTab = "overview" | "my-requests" | "acquired-specs";

interface SpecsWorkspaceSidebarProps {
    activeTab: SpecsWorkspaceTab;
    onTabChange: (tab: SpecsWorkspaceTab) => void;
}

export const SpecsWorkspaceSidebar: React.FC<SpecsWorkspaceSidebarProps> = ({
    activeTab,
    onTabChange,
}) => {
    const btn = (id: SpecsWorkspaceTab, label: string, sub: string) => (
        <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                activeTab === id
                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                    : "text-gray-700 hover:bg-gray-50 border border-transparent"
            }`}
        >
            <div className="text-left">
                <div className="font-medium">{label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
            </div>
        </button>
    );

    return (
        <div className="space-y-2">
            {btn("overview",        "Overview",                "Solutions specs workspace summary")}
            {btn("my-requests",     "My Requests",             "Track and manage spec builds")}
            {btn("acquired-specs",  "Acquired Solution Specs", "View and download acquired specs")}
        </div>
    );
};

interface SpecsWorkspaceMainProps {
    activeTab: SpecsWorkspaceTab;
    requestId?: string;
}

export const SpecsWorkspaceMain: React.FC<SpecsWorkspaceMainProps> = ({
    activeTab,
    requestId,
}) => {
    return (
        <div className="h-full">
            {activeTab === "overview"       && <SolutionSpecsOverview />}
            {activeTab === "my-requests"    && !requestId && <SpecsMyRequestsPage />}
            {activeTab === "my-requests"    && !!requestId && <SpecsRequestDetailPage />}
            {activeTab === "acquired-specs" && <AcquiredSpecsPage />}
        </div>
    );
};
