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
          className="relative py-16 lg:py-24 overflow-hidden flex items-center"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(6,25,39,0.85) 45%, rgba(6,25,39,0.45) 100%), url('${hero}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "560px",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-start mb-8">
              <Link to="/marketplaces">
                <Button className="cta-primary inline-flex items-center gap-2">
                  Enter the Platform
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => document.getElementById("division-roles")?.scrollIntoView({ behavior: "smooth" })}
                className="cta-secondary"
              >
                Find Your Role
              </Button>
              <button
                onClick={() => document.getElementById("marketplaces")?.scrollIntoView({ behavior: "smooth" })}
                className="cta-primary bg-transparent border-0 text-white hover:text-blue-accent font-bold text-[16px] px-4 py-2 rounded-md hover:bg-blue-accent/10 transition-colors"
              >
                → Explore Marketplaces
              </button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-12 bg-orange-500"></div>
                <p className="text-sm font-bold text-orange-500 uppercase tracking-wider">Divisional Context</p>
                <div className="h-1 flex-1 bg-orange-500"></div>
              </div>
              <h2 className="text-[36px] lg:text-[40px] font-bold text-[#061927] mb-6">{data.contextTitle}</h2>
              <p className="text-lg italic text-slate-600 mb-8 max-w-4xl">
                {data.contextOverview[0]}
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-amber-900 to-amber-800 text-white p-6 rounded-xl">
                  <h3 className="text-lg font-bold mb-4 text-amber-100">Division Overview</h3>
                  <div className="space-y-3 text-sm leading-relaxed">
                    {data.contextOverview.slice(1).map((paragraph, idx) => (
                      <p key={idx} className="text-amber-50">{paragraph}</p>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 text-white p-6 rounded-xl">
                  <h3 className="text-lg font-bold mb-4 text-slate-200">Why DTMP Matters Here</h3>
                  <ul className="space-y-2 text-sm">
                    {data.whyItMatters.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-200">
                        <span className="text-orange-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wider">
                  EA Initiative: {data.initiative}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 section-alt">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-12 bg-orange-500"></div>
              <p className="text-sm font-bold text-orange-500 uppercase tracking-wider">Divisional Priorities</p>
              <div className="h-1 flex-1 bg-orange-500"></div>
            </div>
            <h2 className="text-[36px] lg:text-[40px] font-bold text-[#061927] mb-2">Four Strategic Priorities</h2>
            <p className="section-subheading mb-8 italic">The measurable outcomes DTMP is configured to deliver for this division.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.priorities.map((priority, idx) => (
                <article
                  key={`priority-${idx}`}
                  className="text-slate-800 rounded-xl p-6 shadow-lg h-full flex flex-col"
                  style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderTop: `4px solid ${idx === 0 ? '#0ea5e9' : idx === 1 ? '#f59e0b' : idx === 2 ? '#22c55e' : '#a855f7'}`,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-6xl font-bold opacity-20">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold uppercase tracking-wider opacity-60">Priority</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{priority.title}</h3>
                  <p className="text-sm mb-4 leading-relaxed opacity-80 flex-grow">{priority.description}</p>
                  <div className="border-t border-slate-200 pt-3 mt-auto">
                    <span className="text-xs font-semibold uppercase tracking-wider opacity-60">{priority.kpi}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="marketplaces" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-12 bg-orange-500"></div>
              <p className="text-sm font-bold text-orange-500 uppercase tracking-wider">Marketplaces</p>
              <div className="h-1 flex-1 bg-orange-500"></div>
            </div>
            <h2 className="text-[36px] lg:text-[40px] font-bold text-[#061927] mb-2">Six Integrated EA Marketplaces</h2>
            <p className="section-subheading mb-8 italic">All six marketplaces available — with content and services scoped to your division.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.marketplaces.map((marketplace, idx) => (
                <article
                  key={`marketplace-${idx}`}
                  className="text-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-full flex flex-col"
                  style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderTop: `4px solid ${
                      marketplace.phase === "Discern" ? '#0ea5e9' :
                      marketplace.phase === "Design" ? '#f59e0b' :
                      marketplace.phase === "Deploy" ? '#22c55e' :
                      '#ef4444'
                    }`,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold uppercase tracking-wider opacity-60">
                      {marketplace.phase}
                    </p>
                  </div>
                  <h3 className="text-lg font-bold mb-3">{marketplace.name}</h3>
                  <p className="text-sm mb-4 leading-relaxed opacity-80 flex-grow">{marketplace.description}</p>
                  <p className="text-xs mb-4 opacity-60">For: {marketplace.audience}</p>
                  <div className="border-t border-slate-200 pt-3 mt-auto">
                    <Link
                      to={marketplace.route}
                      className="text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors inline-flex items-center gap-1"
                    >
                      → {marketplace.cta}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-12 text-center bg-slate-100 rounded-xl p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Explore All Marketplaces →</h3>
              <p className="text-slate-600 mb-4">Enter the full DTMP marketplace for your division</p>
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
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-12 bg-orange-500"></div>
              <p className="text-sm font-bold text-orange-500 uppercase tracking-wider">User Journeys</p>
              <div className="h-1 flex-1 bg-orange-500"></div>
            </div>
            <h2 className="text-[36px] lg:text-[40px] font-bold text-[#061927] mb-2">Who This Experience Serves</h2>
            <p className="section-subheading mb-8 italic">Role-based entry points for every stakeholder in this division.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.roles.map((role, idx) => (
                <article
                  key={`role-${idx}`}
                  className="text-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-full flex flex-col"
                  style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderTop: `4px solid ${
                      idx === 0 ? '#f59e0b' :
                      idx === 1 ? '#0ea5e9' :
                      idx === 2 ? '#f59e0b' :
                      idx === 3 ? '#22c55e' :
                      idx === 4 ? '#a855f7' :
                      '#ef4444'
                    }`,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">
                      {role.name.includes("EA") ? "GENERATION EA LEAD" : 
                       role.name.includes("Strategy") ? "GENERATION STRATEGY & LEADERSHIP" :
                       role.name.includes("Solar") ? "SOLAR & RENEWABLE ENERGY ARCHITECTS" :
                       role.name.includes("Project") ? "GENERATION PROJECT TEAMS" :
                       role.name.includes("Asset") ? "ASSET & LIFECYCLE OPERATIONS" :
                       "OT SECURITY & DEVOPS"}
                    </p>
                    <h3 className="text-lg font-bold mb-3">{role.name}</h3>
                  </div>
                  <p className="text-sm mb-4 leading-relaxed opacity-80 flex-grow">{role.summary}</p>
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">Key Actions:</p>
                    <ul className="space-y-1 text-sm opacity-80">
                      {role.actions.map((action, actionIdx) => (
                        <li key={actionIdx} className="flex items-start gap-2">
                          <span className="text-slate-400 mt-1">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-slate-200 pt-3 mt-auto">
                    <Link to={role.route} className="text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors">
                      → {role.cta}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white border-t border-[#E2E8F0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-slate-100 rounded-xl p-8 mb-8">
              <p className="text-sm font-bold text-sky-600 uppercase tracking-wider mb-2">
                Ready to Govern Generation's Digital Transformation?
              </p>
              <h2 className="text-[36px] lg:text-[40px] font-bold text-[#061927] mb-4">
                Start Governing. Start Delivering.
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                The DTMP experience scoped for Generation — built on DEWA's enterprise architecture platform.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/marketplaces">
                <Button className="cta-primary px-8 py-3 text-base">Enter Marketplace</Button>
              </Link>
              <Link to="/" className="cta-secondary text-base inline-flex items-center px-6 py-3">
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
