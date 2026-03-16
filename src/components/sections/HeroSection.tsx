import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isUserAuthenticated } from "@/data/sessionAuth";
import { getSessionRole, isTOStage3Role } from "@/data/sessionRole";

type JourneyPersona = "cdo" | "architect" | "pm" | "analyst" | "to";

interface HeroJourney {
  id: JourneyPersona;
  label: string;
  tagline: string;
  ctaLabel: string;
  ctaRoute: string;
}

const journeyMap: Record<JourneyPersona, HeroJourney> = {
  cdo: {
    id: "cdo",
    label: "CDO",
    tagline:
      "For executive leadership - real-time visibility into your organisation's transformation progress.",
    ctaLabel: "View Transformation Dashboard",
    ctaRoute:
      "/marketplaces/digital-intelligence/digital-maturity/dbp-maturity-assessment/dashboard",
  },
  architect: {
    id: "architect",
    label: "Architect",
    tagline:
      "For enterprise architects - access blueprints, specifications, and best practices to design your transformation.",
    ctaLabel: "Explore Design Tools",
    ctaRoute: "/marketplaces/solution-specs",
  },
  pm: {
    id: "pm",
    label: "Project Manager",
    tagline:
      "For project and delivery teams - govern your initiatives, track stage gates, and deliver transformation outcomes.",
    ctaLabel: "Track My Initiatives",
    ctaRoute:
      "/marketplaces/portfolio-management/project-portfolio/project-health-dashboard?view=insights",
  },
  analyst: {
    id: "analyst",
    label: "Strategy Analyst",
    tagline:
      "For strategy and transformation analysts - access insights, request assessments, and build the evidence base for your transformation strategy.",
    ctaLabel: "Explore Insights",
    ctaRoute: "/marketplaces/knowledge-center?tab=strategy-docs",
  },
  to: {
    id: "to",
    label: "Transformation Office",
    tagline:
      "For the Transformation Office - govern, assign, and deliver transformation services at scale.",
    ctaLabel: "TO Operations",
    ctaRoute: "/stage3/dashboard",
  },
};

export function HeroSection() {
  const authenticated = isUserAuthenticated();
  const role = getSessionRole();
  const isTOUser = authenticated && isTOStage3Role(role);
  const [activePersona, setActivePersona] = useState<JourneyPersona>("cdo");

  const activeJourney = useMemo(() => {
    if (isTOUser) return journeyMap.to;
    return journeyMap[activePersona];
  }, [activePersona, isTOUser]);

  return (
    <section className="relative min-h-[460px] lg:min-h-[540px] flex flex-col items-center justify-start text-center bg-gradient-to-br from-primary via-primary to-navy-light overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-primary-foreground mb-4">
          <Target size={16} className="text-accent" />
          Target State
        </div>

        <p className="text-sm text-blue-accent uppercase tracking-wide mb-4">
          Internal Platform
        </p>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 max-w-4xl mx-auto leading-tight">
          Orchestrating Our Digital Business Platform
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-primary-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
          The unified architecture layer-designed, deployed, and evolved to grow
          our Digital Business Platform through incrementally structured
          enterprise-wide transformation.
        </p>

        <p className="text-sm sm:text-base text-blue-accent font-medium mb-4 max-w-3xl mx-auto">
          {activeJourney.tagline}
        </p>

        {!isTOUser && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {(Object.keys(journeyMap) as JourneyPersona[])
              .filter((persona) => persona !== "to")
              .map((persona) => (
                <button
                  key={persona}
                  onClick={() => setActivePersona(persona)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
                    activePersona === persona
                      ? "bg-blue-accent text-primary border-blue-accent"
                      : "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground/80 hover:bg-primary-foreground/20"
                  }`}
                >
                  {journeyMap[persona].label}
                </button>
              ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12">
          <Link to="/marketplaces">
            <Button className="bg-accent hover:bg-orange-hover text-accent-foreground px-8 py-4 h-auto text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
              Access Platform
              <ArrowRight size={18} />
            </Button>
          </Link>

          <Link to={activeJourney.ctaRoute}>
            <Button className="border border-blue-accent text-blue-accent bg-transparent hover:bg-blue-accent/10 px-8 py-4 h-auto text-base font-semibold rounded-lg inline-flex items-center gap-2">
              {activeJourney.ctaLabel}
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
