import { Link } from "react-router-dom";
import { MarketplaceCard } from "@/components/cards/MarketplaceCard";
import { marketplaces } from "@/data/marketplaces";
import { Button } from "@/components/ui/button";

export function ResourceMarketplaces() {
  // Show first 6 marketplaces on landing page
  const displayMarketplaces = marketplaces.slice(0, 6);

  return (
    <section className="py-16 lg:py-20 section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Explore Our Resource Marketplace
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover valuable tools, insights, and resources that support every stage of your digital transformation journey.
          </p>
        </div>

        {/* Marketplace Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayMarketplaces.map((marketplace) => (
            <MarketplaceCard
              key={marketplace.id}
              marketplace={marketplace}
              variant="simple"
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/marketplaces">
            <Button className="bg-green hover:bg-green/90 text-accent-foreground px-10 py-4 h-auto text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
              Explore Marketplaces
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
