import { Contributor } from "@/data/contributors";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { IconBadge } from "@/components/landing/shared";

interface ContributorCardProps {
  contributor: Contributor;
}

export function ContributorCard({ contributor }: ContributorCardProps) {
  const { icon: Icon, name, role, description, contributions, ctaLabel, ctaRoute } = contributor;

  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all flex flex-col" onMouseEnter={e => (e.currentTarget.style.boxShadow = "8px 12px 32px rgba(0,0,0,0.18)")} onMouseLeave={e => (e.currentTarget.style.boxShadow = "")}>
      <IconBadge icon={<Icon size={18} className="text-white transition-transform group-hover:scale-110" />} />
      <h3 className="font-bold text-slate-800 mt-4 mb-1 text-base">{name}</h3>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{role}</p>
      <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">{description}</p>

      <div className="border-t border-slate-100 pt-4">
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Key Contributions</p>
        <ul className="space-y-1 mb-4">
          {contributions.map((contribution) => (
            <li key={contribution} className="text-sm text-slate-600 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-violet-400" />
              {contribution}
            </li>
          ))}
        </ul>
        <Link
          to={ctaRoute}
          className="text-sm font-semibold text-violet-700 inline-flex items-center gap-1"
        >
          {ctaLabel} <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
