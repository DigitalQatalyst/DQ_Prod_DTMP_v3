import { Link } from "react-router-dom";
import { Puzzle, ArrowRight } from "lucide-react";
import { ValueCard } from "@/components/cards/ValueCard";
import { valueProps, stats } from "@/data/valueProps";
import { Button } from "@/components/ui/button";
import { isUserAuthenticated } from "@/data/sessionAuth";
import { getSessionRole, isTOStage3Role } from "@/data/sessionRole";

export function TOValue() {
  const authenticated = isUserAuthenticated();
  const role = getSessionRole();
  const isTOUser = authenticated && isTOStage3Role(role);

  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            How the Transformation Office Delivers Value
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Improving transformation outcomes enterprise-wide by reducing
            fragmentation, ensuring alignment, and platforming the journey to
            our Digital Business Platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {valueProps.map((value) => (
            <ValueCard key={value.id} value={value} />
          ))}
        </div>

        {isTOUser && (
          <div className="text-center mb-12">
            <Link to="/stage3/dashboard">
              <Button className="bg-accent hover:bg-orange-hover text-accent-foreground px-8 py-3 h-auto text-base font-semibold rounded-lg inline-flex items-center gap-2">
                Manage TO Operations
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        )}

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
              Transformation Office.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              title={stat.footnote}
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

        <p className="text-xs text-muted-foreground mt-4 text-center">
          * 80% acceleration rate is based on requirements delivered faster through reusable templates and guided workflows.
        </p>
      </div>
    </section>
  );
}
