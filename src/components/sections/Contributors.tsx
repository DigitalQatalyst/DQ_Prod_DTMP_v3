import { ContributorCard } from "@/components/cards/ContributorCard";
import { contributors } from "@/data/contributors";
import { SectionPill } from "@/components/landing/shared";

export function Contributors() {
  return (
    <section className="py-20" style={{ background: "#EEF2FF" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <SectionPill label="Contributors" />
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-3">
          Contributors to DEWA&apos;s Digital Business Platform
        </h2>
        <p className="text-slate-500 text-center max-w-2xl mx-auto mb-12 text-sm leading-relaxed">
          Enterprise-wide stakeholders across all divisions and leadership levels,
          working toward DEWA&apos;s single digital destination.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributors.map((contributor) => (
            <ContributorCard key={contributor.id} contributor={contributor} />
          ))}
        </div>
      </div>
    </section>
  );
}
