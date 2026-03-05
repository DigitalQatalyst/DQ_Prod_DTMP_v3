import { Contributor } from "@/data/contributors";
import { Link } from "react-router-dom";

interface ContributorCardProps {
  contributor: Contributor;
}

export function ContributorCard({ contributor }: ContributorCardProps) {
  const { icon: Icon, name, role, description, contributions, ctaLabel, ctaRoute } =
    contributor;
  const accent =
    contributor.id === "corporate-ea"
      ? "#F97316"
      : contributor.id === "executive"
        ? "#0EA5E9"
        : contributor.id === "division-architects"
          ? "#16A34A"
          : contributor.id === "digital-ai"
            ? "#7C3AED"
            : contributor.id === "project-delivery"
              ? "#0EA5E9"
              : "#F97316";

  return (
    <div
      className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-lg transition-shadow"
      style={{ borderTop: `4px solid ${accent}` }}
    >
      <div className="p-6">
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] mb-3" style={{ color: accent }}>
          Role
        </p>
        <div className="mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accent}1A` }}>
            <Icon size={22} style={{ color: accent }} />
          </div>
        </div>

        <h3 className="text-[18px] font-bold text-[#0F172A] mb-1">{name}</h3>
        <p className="text-sm font-medium text-[#64748B] mb-3">{role}</p>
        <p className="text-[15px] leading-relaxed text-[#334155] mb-4">{description}</p>

        <div className="border-t border-border pt-4">
          <p className="text-[11px] font-semibold text-[#64748B] uppercase mb-2">
            Key Contributions
          </p>
          <ul className="list-disc list-inside space-y-1 text-[14px] text-[#334155]">
            {contributions.map((contribution) => (
              <li key={contribution}>{contribution}</li>
            ))}
          </ul>
          <Link to={ctaRoute} className="inline-block mt-4 text-sm font-semibold" style={{ color: accent }}>
            → {ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
