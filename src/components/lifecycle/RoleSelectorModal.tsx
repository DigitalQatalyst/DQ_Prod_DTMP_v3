import { useState } from "react";
import { X, User, Users, Briefcase, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type LifecycleInsightsRole,
  LIFECYCLE_ROLE_LABELS,
  LIFECYCLE_ROLE_DESCRIPTIONS,
  getDemoAccount,
  setLifecycleRole,
} from "@/data/shared/lifecycleRole";

interface Props {
  onClose: () => void;
  onRoleSelected: (role: LifecycleInsightsRole) => void;
}

const ROLE_ORDER: LifecycleInsightsRole[] = [
  "initiative-owner",
  "senior-stakeholder",
  "general-staff",
];

const ROLE_ICONS: Record<LifecycleInsightsRole, React.ReactNode> = {
  "initiative-owner": <Briefcase className="w-5 h-5" />,
  "senior-stakeholder": <Users className="w-5 h-5" />,
  "general-staff": <User className="w-5 h-5" />,
};

const ROLE_ACCENT: Record<LifecycleInsightsRole, string> = {
  "initiative-owner": "border-teal-400 bg-teal-50",
  "senior-stakeholder": "border-blue-400 bg-blue-50",
  "general-staff": "border-slate-300 bg-slate-50",
};

const ROLE_ICON_BG: Record<LifecycleInsightsRole, string> = {
  "initiative-owner": "bg-teal-100 text-teal-700",
  "senior-stakeholder": "bg-blue-100 text-blue-700",
  "general-staff": "bg-slate-200 text-slate-600",
};

export function RoleSelectorModal({ onClose, onRoleSelected }: Props) {
  const [hoveredRole, setHoveredRole] = useState<LifecycleInsightsRole | null>(null);

  const handleSelect = (role: LifecycleInsightsRole) => {
    setLifecycleRole(role);
    onRoleSelected(role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Select Your Role</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Demo — choose a role to see the matching depth of initiative detail.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role options */}
        <div className="p-6 space-y-3">
          {ROLE_ORDER.map((role) => {
            const account = getDemoAccount(role);
            return (
              <button
                key={role}
                onClick={() => handleSelect(role)}
                onMouseEnter={() => setHoveredRole(role)}
                onMouseLeave={() => setHoveredRole(null)}
                className={`w-full text-left rounded-xl border-2 p-4 transition-all duration-150 flex items-start gap-4 ${
                  hoveredRole === role ? ROLE_ACCENT[role] : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className={`rounded-lg p-2 flex-shrink-0 ${ROLE_ICON_BG[role]}`}>
                  {ROLE_ICONS[role]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900 text-sm">
                      {LIFECYCLE_ROLE_LABELS[role]}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {LIFECYCLE_ROLE_DESCRIPTIONS[role]}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                      {account.name.charAt(0)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {account.name} · {account.title}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-6 pb-5">
          <p className="text-xs text-slate-400 text-center">
            This is a demo role selector. In production, your role is set by your DEWA profile.
          </p>
        </div>
      </div>
    </div>
  );
}
