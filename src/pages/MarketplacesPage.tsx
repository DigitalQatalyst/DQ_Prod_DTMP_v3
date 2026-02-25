import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarketplaceCard } from "@/components/cards/MarketplaceCard";
import {
  marketplaces,
  getMarketplacesByPhase,
  phases,
  phaseColors,
  Phase,
} from "@/data/marketplaces";

const MarketplacesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Hero */}
        <section className="py-12 lg:py-16 section-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-blue-accent transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="font-medium text-foreground">Marketplaces</span>
            </nav>

            <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
              Explore Our Transformation Resources
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Access a range of tools, resources, and blueprints designed to support your journey towards a successful digital transformation.
            </p>
          </div>
        </section>

        {/* Marketplaces by Phase */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {phases.map((phase) => {
              const phaseMarketplaces = getMarketplacesByPhase(phase);
              const colors = phaseColors[phase];

              if (phaseMarketplaces.length === 0) return null;

              return (
                <div key={phase} className="mb-16 last:mb-0">
                  {/* Phase Header */}
                  <div className="mb-8">
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-xs font-semibold uppercase mb-2 ${colors.badge}`}
                    >
                      {phase}
                    </span>
                    <h2 className="text-3xl font-bold text-primary mb-2">
                      {phase === "Discern" && "Discover Key Resources"}
                      {phase === "Design" && "Design Your Solutions"}
                      {phase === "Deploy" && "Deploy with Confidence"}
                      {phase === "Drive" && "Drive Continuous Improvement"}
                    </h2>
                    <p className="text-muted-foreground">
                      {phase === "Discern" && "Explore resources that help you assess and understand the foundational aspects of digital transformation."}
                      {phase === "Design" && "Access tools and blueprints to design effective transformation solutions tailored to your needs."}
                      {phase === "Deploy" && "Implement your transformation initiatives with ready-to-use solutions and best practices."}
                      {phase === "Drive" && "Monitor, optimize, and sustain your transformation with ongoing insights and support."}
                    </p>
                  </div>

                  {/* Marketplace Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {phaseMarketplaces.map((marketplace) => (
                      <MarketplaceCard
                        key={marketplace.id}
                        marketplace={marketplace}
                        variant="enhanced"
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MarketplacesPage;
