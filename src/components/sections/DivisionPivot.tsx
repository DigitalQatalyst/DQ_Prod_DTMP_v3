import { Link } from "react-router-dom";

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
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[#0369A1] text-xs font-bold uppercase tracking-[0.08em] mb-2">
            Enterprise-Exclusive Feature
          </p>
          <h2 className="text-[36px] lg:text-[40px] font-bold text-[#061927] mb-2">Find Your DTMP Experience</h2>
          <p className="section-subheading max-w-4xl mx-auto">
            Select your DEWA division to enter a tailored DTMP context while staying
            inside one unified enterprise platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {divisions.map((division) => (
              <Link
                key={division.name}
                to={`/divisions/${division.slug}`}
                className="block bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:[border-top-width:6px]"
                style={{ borderTop: `4px solid ${division.accent}` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-3"
                    style={{ backgroundColor: division.accent }}
                  >
                    {division.name[0]}
                  </div>
                  <h3 className="text-[18px] font-bold flex-1" style={{ color: division.accent }}>
                    {division.name}
                  </h3>
                </div>
                <p className="text-[15px] text-[#334155] mb-4">{division.description}</p>
                <ul className="list-disc list-inside text-[14px] text-[#64748B] space-y-1 mb-4">
                  {division.teams.map((team) => (
                    <li key={team}>{team}</li>
                  ))}
                </ul>
                <span className="text-sm font-semibold" style={{ color: division.accent }}>→ Enter {division.name} DTMP</span>
              </Link>
            ))}
          </div>

          <article
            className="bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
            style={{ borderTop: "4px solid #061927" }}
          >
            <h3 className="text-2xl font-bold mb-2 text-[#061927]">Corporate & Strategy</h3>
            <p className="text-slate-700 mb-4">
              Entry point for DEWA corporate leadership and cross-divisional governance roles.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-5">
              {corporateTeams.map((team) => (
                <li key={team}>{team}</li>
              ))}
            </ul>
            <Link to="/stage3/dashboard" className="cta-tertiary text-sm">
              → Enter Corporate & Strategy DTMP
            </Link>
          </article>
      </div>
    </section>
  );
}
