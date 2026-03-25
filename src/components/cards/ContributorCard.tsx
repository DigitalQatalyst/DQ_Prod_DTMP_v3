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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col">
      <IconBadge icon={<Icon size={18} className="text-white" />} />
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
