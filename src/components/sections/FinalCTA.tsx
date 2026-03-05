import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="py-16 lg:py-20 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-[36px] lg:text-[40px] font-bold text-[#061927] mb-2">
          Ready to Govern DEWA&apos;s Digital Transformation Enterprise-Wide?
        </h2>
        <p className="text-[18px] italic text-[#0369A1] mb-10 max-w-3xl mx-auto">
          One Architecture. One DEWA. Begin the enterprise transformation governance journey
          from Transmission to Generation, from Customer Services to Net-Zero 2050.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/marketplaces">
            <Button className="cta-primary inline-flex items-center gap-2">
              Enter the Platform
              <ArrowRight size={18} />
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => document.getElementById("division-pivot")?.scrollIntoView({ behavior: "smooth" })}
            className="cta-secondary"
          >
            Find Your Division
          </Button>
          <Link to="/contact" className="cta-tertiary text-sm">
            → Contact the Corporate EA Office
          </Link>
        </div>
      </div>
    </section>
  );
}
