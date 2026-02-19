import { GovernanceCard } from "@/components/cards/GovernanceCard";
import { governancePhases } from "@/data/governance";

export function GovernanceModel() {
  return (
    <section className="py-16 lg:py-20 section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-wide text-muted-foreground mb-2">
            Structured, Repeatable Transformation
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Our Governance Framework
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A structured approach that ensures effective management of change and transformation, led by our dedicated Transformation Office.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mb-8 hidden lg:block">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-accent/30 -translate-y-1/2" />
          <div className="flex justify-between px-[12.5%]">
            {governancePhases.map((_, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full bg-accent relative z-10"
              />
            ))}
          </div>
        </div>

        {/* Governance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {governancePhases.map((phase) => (
            <GovernanceCard key={phase.id} phase={phase} />
          ))}
        </div>
      </div>
    </section>
  );
}
