import { Activity, DollarSign, Target, TrendingUp } from "lucide-react";
import PortfolioHealthDashboard from "@/components/portfolio/PortfolioHealthDashboard";

interface PortfolioSubService {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface PortfolioWorkspaceSidebarProps {
  portfolioSubServices: PortfolioSubService[];
  activeSubService: string | null;
  onSelectSubService: (subServiceId: string) => void;
}

export function PortfolioWorkspaceSidebar({
  portfolioSubServices,
  activeSubService,
  onSelectSubService,
}: PortfolioWorkspaceSidebarProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Portfolio Tools</h3>
        <div className="space-y-2">
          {portfolioSubServices.map((subService) => {
            const Icon = subService.icon;
            return (
              <button
                key={subService.id}
                onClick={() => onSelectSubService(subService.id)}
                className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                  activeSubService === subService.id
                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                    : "text-gray-700 hover:bg-gray-50 border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium">{subService.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{subService.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface PortfolioWorkspaceMainProps {
  activeSubService: string;
  portfolioSubServices: PortfolioSubService[];
}

export function PortfolioWorkspaceMain({
  activeSubService,
  portfolioSubServices,
}: PortfolioWorkspaceMainProps) {
  return (
    <div className="h-full">
      {activeSubService === "portfolio-health-dashboard" && (
        <PortfolioHealthDashboard className="h-full" />
      )}

      {activeSubService === "application-rationalization" && (
        <div className="p-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-red-900">Redundant Apps</h3>
                </div>
                <p className="text-2xl font-bold text-red-900">23</p>
                <p className="text-sm text-red-700">Candidates for retirement</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-900">Potential Savings</h3>
                </div>
                <p className="text-2xl font-bold text-orange-900">$1.2M</p>
                <p className="text-sm text-orange-700">Annual cost reduction</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">Rationalization Score</h3>
                </div>
                <p className="text-2xl font-bold text-green-900">78%</p>
                <p className="text-sm text-green-700">Portfolio efficiency</p>
              </div>
            </div>
            <div className="text-center py-12">
              <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Rationalization Assessment</h3>
              <p className="text-gray-500">Comprehensive analysis and recommendations would be displayed here</p>
            </div>
          </div>
        </div>
      )}

      {activeSubService === "tco-optimization" && (
        <div className="p-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Total TCO</h3>
                </div>
                <p className="text-2xl font-bold text-blue-900">$2.4M</p>
                <p className="text-sm text-blue-700">Annual portfolio cost</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">Cost per User</h3>
                </div>
                <p className="text-2xl font-bold text-green-900">$1,200</p>
                <p className="text-sm text-green-700">Per user annually</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">Savings Potential</h3>
                </div>
                <p className="text-2xl font-bold text-purple-900">$480K</p>
                <p className="text-sm text-purple-700">License optimization</p>
              </div>
            </div>
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">TCO Optimization</h3>
              <p className="text-gray-500">Cost analysis and optimization tools would be displayed here</p>
            </div>
          </div>
        </div>
      )}

      {!["portfolio-health-dashboard", "application-rationalization", "tco-optimization"].includes(
        activeSubService
      ) && (
        <div className="p-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center py-12">
              <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {portfolioSubServices.find((s) => s.id === activeSubService)?.name}
              </h3>
              <p className="text-gray-500">
                {portfolioSubServices.find((s) => s.id === activeSubService)?.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
