import { GovernanceCard } from "@/components/cards/GovernanceCard";
import { governancePhases } from "@/data/governance";

export function GovernanceModel() {
  return (
    <section className="py-16 lg:py-20 bg-[#F0F7FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[#0369A1] text-xs font-bold uppercase tracking-[0.08em] mb-2">
            Structuring Enterprise-Wide Transformation Across All of DEWA
          </p>
          <h2 className="text-[36px] lg:text-[40px] font-bold text-[#061927] mb-2">
            The 4D Governance Model
          </h2>
          <p className="section-subheading max-w-4xl mx-auto">
            The governance structure through which DEWA&apos;s Corporate EA Office
            orchestrates architecture across Generation, Transmission, Distribution,
            Customer Services, and Digital DEWA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {governancePhases.map((phase) => (
            <GovernanceCard key={phase.id} phase={phase} />
          ))}
        </div>
      </div>
    </section>
  );
}
