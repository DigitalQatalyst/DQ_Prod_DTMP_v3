import { Link } from "react-router-dom";
import { MarketplaceCard } from "@/components/cards/MarketplaceCard";
import { marketplaces } from "@/data/marketplaces";
import { Button } from "@/components/ui/button";

const landingMarketplaceOrder = [
  "knowledge-center",
  "solution-specs",
  "solution-build",
  "portfolio-management",
];

export function ResourceMarketplaces() {
  const displayMarketplaces = landingMarketplaceOrder
    .map((id) => marketplaces.find((marketplace) => marketplace.id === id))
    .filter((marketplace): marketplace is (typeof marketplaces)[number] => Boolean(marketplace));

  return (
    <section className="py-16 lg:py-20 section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Integrated Resource Marketplaces
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Access resources, blueprints, and tools through integrated
            marketplaces-organized around the 4D governance model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayMarketplaces.map((marketplace) => (
            <MarketplaceCard
              key={marketplace.id}
              marketplace={marketplace}
              variant="simple"
            />
          ))}
        </div>

        <div className="text-center">
          <Link to="/marketplaces">
            <Button className="bg-green hover:bg-green/90 text-accent-foreground px-10 py-4 h-auto text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
              Explore All Marketplaces
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
