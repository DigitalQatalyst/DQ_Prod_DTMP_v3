import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { GovernancePhase } from "@/data/governance";
import { IconBadge } from "@/components/landing/shared";

const phaseColors: Record<string, string> = {
  Discern: "#6d28d9",
  Design: "#0369A1",
  Deploy: "#16A34A",
  Drive: "#D97706",
};

interface GovernanceCardProps {
  phase: GovernancePhase;
}

export function GovernanceCard({ phase }: GovernanceCardProps) {
  const { icon: Icon, name, subtitle, description, deliverables, ctaLabel, route } = phase;
  const accent = phaseColors[name] ?? "#6d28d9";

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <IconBadge icon={<Icon size={18} className="text-white" />} />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: accent }}>Phase</p>
          <h3 className="font-bold text-slate-800 text-lg">{name}</h3>
          <p className="text-sm italic text-slate-400">{subtitle}</p>
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{description}</p>

      <p className="text-xs font-semibold text-slate-400 uppercase mb-2">What It Governs</p>
      <ul className="space-y-1 mb-6 flex-1">
        {deliverables.map((item) => (
          <li key={item} className="text-sm text-slate-600 flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: accent }} />
            {item}
          </li>
        ))}
      </ul>

      <Link
        to={route}
        className="text-sm font-semibold inline-flex items-center gap-1"
        style={{ color: accent }}
      >
        {ctaLabel} <ChevronRight size={14} />
      </Link>
    </div>
  );
}
