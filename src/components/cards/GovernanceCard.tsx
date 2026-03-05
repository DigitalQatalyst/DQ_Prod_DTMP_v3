import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { GovernancePhase } from "@/data/governance";

interface GovernanceCardProps {
  phase: GovernancePhase;
}

export function GovernanceCard({ phase }: GovernanceCardProps) {
  const {
    icon: Icon,
    name,
    subtitle,
    description,
    deliverables,
    ctaLabel,
    route,
  } = phase;

  const accent =
    name === "Discern"
      ? "#0EA5E9"
      : name === "Design"
        ? "#F97316"
        : name === "Deploy"
          ? "#16A34A"
          : "#DC2626";

  return (
    <div
      className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
      style={{ borderTop: `4px solid ${accent}` }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: accent }}>
            <Icon size={20} className="text-white" />
          </div>
        </div>

        <p className="text-[12px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: accent }}>
          Phase
        </p>
        <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
        <p className="text-sm italic text-[#0369A1] mb-3">{subtitle}</p>
        <p className="text-sm text-slate-700 mb-4 min-h-[72px]">{description}</p>

        <p className="text-[11px] font-semibold text-[#64748B] uppercase mb-2">What It Governs</p>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-4 min-h-[86px]">
          {deliverables.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <Link
          to={route}
          className="text-sm font-semibold inline-flex items-center gap-1 hover:opacity-90"
          style={{ color: accent }}
        >
          → {ctaLabel}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
