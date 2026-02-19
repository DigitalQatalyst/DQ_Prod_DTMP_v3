import { Puzzle } from "lucide-react";
import { ValueCard } from "@/components/cards/ValueCard";
import { valueProps, stats } from "@/data/valueProps";

export function TOValue() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            The Value of Transformation Office
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our Transformation Office ensures that your digital transformation is aligned, sustainable, and outcomes-driven, focusing on performance and value at every step.
          </p>
        </div>

        {/* Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {valueProps.map((value) => (
            <ValueCard key={value.id} value={value} />
          ))}
        </div>

        {/* Unified Message */}
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-accent/10 to-accent/20 border border-accent/30 rounded-xl p-8 mb-12">
          <div className="flex-shrink-0">
            <Puzzle size={48} className="text-accent" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-bold text-foreground mb-1">
              Orchestrated, Not Fragmented
            </h3>
            <p className="text-secondary-foreground">
              End-to-end alignment with unified governance under the
              Transformation Office
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card border-2 border-border rounded-xl p-6 text-center"
            >
              <p className="text-4xl font-bold text-primary mb-2">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-foreground mb-1">
                {stat.label}
              </p>
              <p className="text-xs text-muted-foreground">{stat.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
