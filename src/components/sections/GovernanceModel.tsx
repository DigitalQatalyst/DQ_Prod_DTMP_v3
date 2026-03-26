import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
          The 4D Framework operationalises EA governance across DEWA — sequencing transformation decisions from insight and design through to deployment and value realisation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {governancePhases.map((phase) => (
            <GovernanceCard key={phase.id} phase={phase} />
          ))}
        </div>
        <div className="text-center">
          <Link
            to="/marketplaces"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #6d28d9 0%, #0369A1 100%)" }}
          >
            Explore the 4D Governance Framework <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
