import { Link } from "react-router-dom";
import { ChevronRight, Building2 } from "lucide-react";
import { SectionPill } from "@/components/landing/shared";

const divisions = [
  {
    name: "Generation",
    slug: "generation",
    accent: "#D97706",
    description:
      "Power generation assets, combined cycle operations, and MBR Solar Park portfolio governance.",
    teams: ["Jebel Ali Power Complex", "MBR Solar Park Operations", "Renewable Energy Teams"],
  },
  {
    name: "Transmission",
    slug: "transmission",
    accent: "#0EA5E9",
    description:
      "High-voltage networks, substations, Smart Grid strategy delivery, and enterprise architecture programme execution.",
    teams: ["EA Office (Active Initiative)", "Smart Grid Programme", "Grid Infrastructure Teams"],
  },
  {
    name: "Distribution",
    slug: "distribution",
    accent: "#16A34A",
    description:
      "Electricity and water distribution networks, customer connections, and smart metering infrastructure.",
    teams: ["Distribution Networks", "Smart Metering Programme", "Customer Connection Teams"],
  },
  {
    name: "Water Services",
    slug: "water-services",
    accent: "#0D9488",
    description:
      "Desalination operations, water network management, and sustainability-aligned infrastructure services.",
    teams: ["Desalination Operations", "Hatta Hydroelectric Plant", "Water Network Management"],
  },
  {
    name: "Customer Services",
    slug: "customer-services",
    accent: "#7C3AED",
    description:
      "Customer experience, Rammas AI, Services 360, and DubaiNow-aligned service operations.",
    teams: ["Customer Experience Teams", "Rammas AI Operations", "Services 360 Programme"],
  },
  {
    name: "Digital DEWA & Moro Hub",
    slug: "digital-dewa-moro-hub",
    accent: "#0369A1",
    description:
      "AI platforms, Virtual Engineer development, cybersecurity, and enterprise digital innovation programmes.",
    teams: ["Moro Hub Operations", "Virtual Engineer Programme", "AI & Data Science Teams"],
  },
];

const corporateTeams = [
  "CEO & Executive Leadership",
  "Corporate Strategy Office",
  "CIO / CDO / CTO",
  "Corporate EA Office",
];

export function DivisionPivot() {
  return (
    <section className="py-20" style={{ background: "#EEF2FF" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <SectionPill label="User Journeys" />
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-3">
          Find Your DTMP Experience
        </h2>
        <p className="text-slate-500 text-center max-w-2xl mx-auto mb-12 text-sm leading-relaxed">
          Select your DEWA division to enter a tailored DTMP context while staying
          inside one unified enterprise platform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {divisions.map((division) => (
            <Link
              key={division.name}
              to={`/divisions/${division.slug}`}
              className="block bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: division.accent }}
                >
                  {division.name[0]}
                </div>
                <h3 className="font-bold text-slate-800 text-base">{division.name}</h3>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">{division.description}</p>
              <ul className="space-y-1 mb-4">
                {division.teams.map((team) => (
                  <li key={team} className="text-xs text-slate-400 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-300 inline-block" />
                    {team}
                  </li>
                ))}
              </ul>
              <span
                className="text-sm font-semibold inline-flex items-center gap-1"
                style={{ color: division.accent }}
              >
                Enter {division.name} DTMP <ChevronRight size={14} />
              </span>
            </Link>
          ))}
        </div>

        {/* Corporate strip */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-800">
              <Building2 size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Corporate &amp; Strategy</p>
              <p className="text-xs text-slate-400">Cross-divisional governance roles</p>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              {corporateTeams.map((team) => (
                <span key={team} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                  {team}
                </span>
              ))}
            </div>
          </div>
          <Link
            to="/stage3/dashboard"
            className="text-sm font-semibold text-slate-700 inline-flex items-center gap-1 flex-shrink-0"
          >
            Enter Corporate DTMP <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
