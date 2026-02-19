import { ContributorCard } from "@/components/cards/ContributorCard";
import { contributors } from "@/data/contributors";

export function Contributors() {
  return (
    <section className="py-16 lg:py-20 section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Our Key Contributors
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We work with a diverse group of experts, partners, and leaders to ensure your digital transformation is seamless and effective, with full alignment across all stakeholders.
          </p>
        </div>

        {/* Contributors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributors.map((contributor) => (
            <ContributorCard key={contributor.id} contributor={contributor} />
          ))}
        </div>
      </div>
    </section>
  );
}
