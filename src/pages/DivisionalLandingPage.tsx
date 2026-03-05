import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  divisionalLandingData,
  isDivisionId,
} from "@/data/divisions/divisionalLandingData";

const divisionAccent: Record<string, string> = {
  generation: "#D97706",
  transmission: "#0EA5E9",
  distribution: "#16A34A",
  "water-services": "#0D9488",
  "customer-services": "#7C3AED",
  "digital-dewa-moro-hub": "#0369A1",
};

const divisionHeroImage: Record<string, string> = {
  generation:
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1800&q=80",
  transmission:
    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1800&q=80",
  distribution:
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=80",
  "water-services":
    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1800&q=80",
  "customer-services":
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80",
  "digital-dewa-moro-hub":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=80",
};

export default function DivisionalLandingPage() {
  const { divisionId } = useParams<{ divisionId?: string }>();

  if (!isDivisionId(divisionId)) return <Navigate to="/" replace />;

  const data = divisionalLandingData[divisionId];
  const accent = divisionAccent[divisionId];
  const hero = divisionHeroImage[divisionId];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section
          className="relative py-16 lg:py-24 overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(6,25,39,0.85) 45%, rgba(6,25,39,0.45) 100%), url('${hero}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "560px",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link to="/" className="text-sm text-blue-accent hover:underline mb-4 inline-block">
              Back to DEWA Enterprise Platform
            </Link>
            <p className="text-xs uppercase tracking-widest text-blue-accent mb-3">{data.divisionLabel} Divisional Landing Page</p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 text-left">{data.heroTitle}</h1>
            <p className="text-slate-200 text-lg max-w-3xl mb-6">{data.heroSubtitle}</p>
            <div className="flex flex-wrap gap-3 mb-6">
              {data.heroFacts.map((fact) => (
                <span
                  key={fact}
                  className="inline-flex items-center rounded-full px-4 py-2 text-xs text-white font-medium"
                  style={{ border: `1.5px solid ${accent}` }}
                >
                  {fact}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/marketplaces">
                <Button className="cta-primary">
                  Enter Marketplace
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => document.getElementById("division-roles")?.scrollIntoView({ behavior: "smooth" })}
                className="cta-tertiary text-white hover:text-blue-accent border-0 p-0"
              >
                → Find My Role
              </Button>
              <Link to="/contact" className="cta-secondary text-sm inline-flex items-center">
                Contact EA Office
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="text-[36px] lg:text-[40px] font-bold text-[#061927] mb-2">{data.contextTitle}</h2>
              {data.contextOverview.map((p) => (
                <p key={p} className="text-slate-700 mb-3 max-w-5xl">
                  {p}
                </p>
              ))}
              <p className="text-sm font-semibold text-muted-foreground uppercase mt-5 mb-2">Why DTMP Matters Here</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.whyItMatters.map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                    style={{ borderTop: `4px solid ${accent}` }}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm font-semibold text-green">EA Initiative: {data.initiative}</p>
            </div>
          </div>
        </section>

        <section className="py-16 section-alt">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-[36px] lg:text-[40px] font-bold text-[#061927] mb-2">Four Strategic Priorities</h2>
            <p className="section-subheading mb-8">Measurable outcomes DTMP is configured to deliver for {data.shortTitle}.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.priorities.map((priority, idx) => (
                <article
                  key={priority.title}
                  className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                  style={{ borderTop: `4px solid ${accent}` }}
                >
                  <p className="text-[12px] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: accent }}>
                    Priority
                  </p>
                  <p className="text-3xl font-bold mb-2" style={{ color: accent }}>{String(idx + 1).padStart(2, "0")}</p>
                  <h3 className="text-xl font-bold text-foreground mb-2">{priority.title}</h3>
                  <p className="text-sm text-slate-700 mb-4">{priority.description}</p>
                  <span className="text-xs font-semibold" style={{ color: accent }}>{priority.kpi}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-[36px] lg:text-[40px] font-bold text-[#061927] mb-2">Six Integrated EA Marketplaces</h2>
            <p className="section-subheading mb-8">All six marketplaces are available with content scoped to your division.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.marketplaces.map((marketplace) => (
                <article
                  key={marketplace.name}
                  className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                  style={{
                    borderTop: `4px solid ${
                      marketplace.phase === "Discern"
                        ? "#0EA5E9"
                        : marketplace.phase === "Design"
                          ? "#F97316"
                          : marketplace.phase === "Deploy"
                            ? "#16A34A"
                            : "#DC2626"
                    }`,
                  }}
                >
                  <p
                    className="text-[12px] font-bold uppercase tracking-[0.08em] mb-2"
                    style={{
                      color:
                        marketplace.phase === "Discern"
                          ? "#0EA5E9"
                          : marketplace.phase === "Design"
                            ? "#F97316"
                            : marketplace.phase === "Deploy"
                              ? "#16A34A"
                              : "#DC2626",
                    }}
                  >
                    {marketplace.phase}
                  </p>
                  <h3 className="text-lg font-bold text-foreground mb-2">{marketplace.name}</h3>
                  <p className="text-sm text-slate-700 mb-3">{marketplace.description}</p>
                  <p className="text-xs text-muted-foreground mb-4">For: {marketplace.audience}</p>
                  <Link
                    to={marketplace.route}
                    className="text-sm font-semibold"
                    style={{
                      color:
                        marketplace.phase === "Discern"
                          ? "#0EA5E9"
                          : marketplace.phase === "Design"
                            ? "#F97316"
                            : marketplace.phase === "Deploy"
                              ? "#16A34A"
                              : "#DC2626",
                    }}
                  >
                    → {marketplace.cta}
                  </Link>
                </article>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/marketplaces">
                <Button className="cta-primary inline-flex items-center gap-2">
                  Explore All Marketplaces
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="division-roles" className="py-16 section-alt">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-[36px] lg:text-[40px] font-bold text-[#061927] mb-2">Who This Experience Serves</h2>
            <p className="section-subheading mb-8">Role-based entry points for stakeholders in {data.shortTitle}.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.roles.map((role) => (
                <article
                  key={role.name}
                  className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                  style={{ borderTop: `4px solid ${accent}` }}
                >
                  <p className="text-[12px] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: accent }}>
                    Role
                  </p>
                  <h3 className="text-lg font-bold text-foreground mb-2">{role.name}</h3>
                  <p className="text-sm text-slate-700 mb-3">{role.summary}</p>
                  <p className="text-[11px] font-semibold text-[#64748B] uppercase mb-2">Key Actions</p>
                  <ul className="list-disc list-inside text-[14px] text-[#334155] space-y-1 mb-4">
                    {role.actions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                  <Link to={role.route} className="text-sm font-semibold" style={{ color: accent }}>
                    → {role.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white border-t border-[#E2E8F0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-[36px] lg:text-[40px] font-bold text-[#061927] mb-2">
              Ready to Govern {data.shortTitle}'s Digital Transformation?
            </h2>
            <p className="text-[18px] italic text-[#0369A1] mb-6">Start governing. Start delivering.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/marketplaces">
                <Button className="cta-primary">Enter Marketplace</Button>
              </Link>
              <Link to="/" className="cta-secondary text-sm inline-flex items-center">
                Back to Enterprise Platform
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
