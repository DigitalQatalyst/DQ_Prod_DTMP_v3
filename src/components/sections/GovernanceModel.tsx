import { GovernanceCard } from "@/components/cards/GovernanceCard";
import { governancePhases } from "@/data/governance";
import { SectionPill } from "@/components/landing/shared";

export function GovernanceModel() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <SectionPill label="Structuring Enterprise-Wide Transformation" />
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-3">
          The 4D Governance Model
        </h2>
        <p className="text-slate-500 text-center max-w-2xl mx-auto mb-12 text-sm leading-relaxed">
          The governance structure through which DEWA&apos;s Corporate EA Office orchestrates
          architecture across Generation, Transmission, Distribution, Customer Services, and Digital DEWA.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {governancePhases.map((phase) => (
            <GovernanceCard key={phase.id} phase={phase} />
          ))}
        </div>
      </div>
    </section>
  );
}
