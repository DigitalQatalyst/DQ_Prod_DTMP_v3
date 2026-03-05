import { ContributorCard } from "@/components/cards/ContributorCard";
import { contributors } from "@/data/contributors";

export function Contributors() {
  return (
    <section className="py-16 lg:py-20 section-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[#0369A1] text-xs font-bold uppercase tracking-[0.08em] mb-2">
            Contributors
          </p>
          <h2 className="text-[36px] lg:text-[40px] font-bold text-[#061927] mb-2">
            Contributors to DEWA&apos;s Digital Business Platform
          </h2>
          <p className="section-subheading text-center max-w-3xl mx-auto">
            Enterprise-wide stakeholders across all divisions and leadership levels,
            working toward DEWA&apos;s single digital destination.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributors.map((contributor) => (
            <ContributorCard key={contributor.id} contributor={contributor} />
          ))}
        </div>
      </div>
    </section>
  );
}
