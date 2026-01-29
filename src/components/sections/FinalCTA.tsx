import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
          Ready to Orchestrate Your DBP
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Begin your structured transformation journey with DTMP—the platform
          designed to grow our Digital Business Platform
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/marketplaces">
            <Button className="bg-accent hover:bg-orange-hover text-accent-foreground px-12 py-5 h-auto text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all w-full sm:w-auto inline-flex items-center gap-2">
              Access Platform
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
