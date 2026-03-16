import { Link } from "react-router-dom";
import { Layers, Database, BookOpen, ArrowRight } from "lucide-react";

const capabilities = [
  {
    icon: Database,
    title: "Integrations and Data Flows",
    description:
      "Unified data architecture connecting all enterprise systems",
  },
  {
    icon: Layers,
    title: "Platform Capabilities",
    description:
      "Core capabilities supporting business and technology needs",
  },
  {
    icon: BookOpen,
    title: "Learning & Knowledge",
    description:
      "Continuous improvement through shared insights and practices",
    linkLabel: "Explore the Learning Center",
    linkRoute: "/marketplaces/learning-center",
  },
];

export function DBPOverview() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
          <div className="flex-1">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              Building Our Digital Business Platform
            </h2>
            <p className="text-lg text-muted-foreground mb-2">
              The DBP represents our target operating model-a unified set of
              capabilities, platforms, and governance structures.
            </p>
            <p className="text-sm text-muted-foreground">
              Platform Manages the Journey | DBP is the Outcome
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-xl bg-accent/10 flex items-center justify-center">
              <Layers size={40} className="text-accent" />
            </div>
            <span className="text-sm font-semibold text-accent">DBP</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="bg-secondary border border-secondary rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="icon-gradient w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <cap.icon size={28} className="text-purple" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {cap.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-3">{cap.description}</p>
              {cap.linkLabel && cap.linkRoute && (
                <Link
                  to={cap.linkRoute}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-blue-accent hover:text-blue-accent/80"
                >
                  {cap.linkLabel}
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
