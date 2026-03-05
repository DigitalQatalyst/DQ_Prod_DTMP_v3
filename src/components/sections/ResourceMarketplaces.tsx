import { Link } from "react-router-dom";
import { MarketplaceCard } from "@/components/cards/MarketplaceCard";
import { marketplaces } from "@/data/marketplaces";
import { Button } from "@/components/ui/button";

export function ResourceMarketplaces() {
  const included = [
    "learning-center",
    "knowledge-center",
    "document-studio",
    "solution-specs",
    "solution-build",
    "lifecycle-management",
  ];

  const displayMarketplaces = marketplaces.filter((item) => included.includes(item.id));

  return (
    <section className="py-16 lg:py-20 section-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[#0369A1] text-xs font-bold uppercase tracking-[0.08em] mb-2">6 Integrated Marketplaces</p>
          <h2 className="text-[36px] lg:text-[40px] font-bold text-[#061927] mb-2">
            Six Integrated EA Marketplaces
          </h2>
          <p className="section-subheading text-center max-w-3xl mx-auto">
            Enterprise-wide services for all DEWA divisions, organised around the 4D model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {displayMarketplaces.map((marketplace) => (
            <MarketplaceCard
              key={marketplace.id}
              marketplace={marketplace}
              variant="simple"
            />
          ))}
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <p className="text-[#061927] text-lg font-semibold mb-1">Explore All Marketplaces - Enterprise Access</p>
          <p className="text-[#64748B] text-sm mb-5">Enter the DTMP DEWA Enterprise Platform</p>
          <Link to="/marketplaces">
            <Button className="cta-primary text-lg">Explore All Marketplaces</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
