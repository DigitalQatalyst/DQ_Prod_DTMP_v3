import type { ElementType } from "react";

interface SupportSubServiceNavItem {
  id: string;
  name: string;
  description: string;
  icon: ElementType;
}

interface SupportWorkspaceSidebarProps {
  supportSubServices: SupportSubServiceNavItem[];
  activeSubService: string | null;
  onSelectSubService: (subServiceId: string) => void;
}

export function SupportWorkspaceSidebar({
  supportSubServices,
  activeSubService,
  onSelectSubService,
}: SupportWorkspaceSidebarProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Support Services</h3>
        <div className="space-y-2">
          {supportSubServices.map((svc) => {
            const Icon = svc.icon;
            return (
              <button
                key={svc.id}
                onClick={() => onSelectSubService(svc.id)}
                className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                  activeSubService === svc.id
                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                    : "text-gray-700 hover:bg-gray-50 border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium">{svc.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{svc.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
