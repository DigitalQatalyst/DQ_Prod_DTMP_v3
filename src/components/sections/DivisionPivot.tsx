import { Link } from "react-router-dom";
import {
  ChevronRight, ArrowRight,
  Zap, Activity, Globe, Droplets, CreditCard, Brain,
  TrendingUp, Users, Building2, Layers,
} from "lucide-react";
import { SectionPill } from "@/components/landing/shared";

const divisions = [
  {
    name: "Generation",
    shortName: "Generation",
    slug: "generation",
    accent: "#D97706",
    icon: Zap,
    description:
      "Power and water generation assets — combined cycle plants, desalination facilities, and MBR Solar Park portfolio governance.",
    teams: ["Jebel Ali Power Complex", "MBR Solar Park Operations", "Renewable Energy Teams"],
  },
  {
    name: "Transmission",
    shortName: "Transmission",
    slug: "transmission",
    accent: "#0EA5E9",
    icon: Activity,
    description:
      "High-voltage networks, substations, Smart Grid strategy delivery, and enterprise architecture programme execution.",
    teams: ["EA Office (Active Initiative)", "Smart Grid Programme", "Grid Infrastructure Teams"],
  },
  {
    name: "Distribution",
    shortName: "Distribution",
    slug: "distribution",
    accent: "#16A34A",
    icon: Globe,
    description:
      "Electricity distribution networks, customer connections, and smart metering infrastructure across Dubai.",
    teams: ["Distribution Networks", "Smart Metering Programme", "Customer Connection Teams"],
  },
  {
    name: "Water & Civil Division",
    shortName: "Water & Civil",
    slug: "water-civil",
    accent: "#0D9488",
    icon: Droplets,
    description:
      "Desalination operations, water network management, civil infrastructure, and sustainability-aligned water services across Dubai.",
    teams: ["Desalination Operations", "Hatta Hydroelectric Plant", "Water Network Management"],
  },
  {
    name: "Billing Services Division",
    shortName: "Billing Services",
    slug: "billing-services",
    accent: "#7C3AED",
    icon: CreditCard,
    description:
      "Customer billing, smart collection platforms, digital service delivery, Rammas AI operations, and Services 360 customer experience.",
    teams: ["Billing & Collections", "Rammas AI Operations", "Services 360 Programme"],
  },
  {
    name: "Innovation & The Future Division",
    shortName: "Innovation",
    slug: "innovation-future",
    accent: "#0369A1",
    icon: Brain,
    description:
      "AI platforms, Virtual Engineer development, future technology programmes, and enterprise digital innovation across DEWA.",
    teams: ["Virtual Engineer Programme", "AI & Data Science Teams", "Future Technology Office"],
  },
  {
    name: "Power & Water Planning",
    shortName: "P&W Planning",
    slug: "power-water-planning",
    accent: "#DC2626",
    icon: TrendingUp,
    description:
      "Long-term capacity planning, demand forecasting, and strategic infrastructure investment governance for DEWA's power and water future.",
    teams: ["Power Capacity Planning", "Water Demand Planning", "Strategic Infrastructure"],
  },
  {
    name: "Business Support & HR Division",
    shortName: "Business Support",
    slug: "business-support-hr",
    accent: "#0891B2",
    icon: Users,
    description:
      "The operational foundation every division depends on — HR platforms, procurement systems, PMO governance, QHSE, and the DEWA Academy.",
    teams: ["Human Resources", "DEWA Academy", "PMO & SCM", "QHSE"],
  },
];

const extraCards = [
  {
    name: "Corporate & Strategy",
    accent: "#1e3a5f",
    icon: Building2,
    description: "CEO, executive leadership, Corporate Strategy Office, CIO/CDO/CTO, and the Corporate EA Office — cross-divisional governance and enterprise direction.",
    teams: ["CEO & Executive Leadership", "Corporate Strategy Office", "Corporate EA Office"],
    route: "/divisions/corporate",
    cta: "Enter Corporate Hub",
  },
  {
    name: "DEWA Group Subsidiaries",
    accent: "#6d28d9",
    icon: Layers,
    description: "Moro Hub, Empower, Etihad ESCO, and other DEWA Group subsidiaries — all governed under the DTMP enterprise framework.",
    teams: ["Moro Hub", "Empower", "Etihad ESCO", "Digital X"],
    route: "/divisions/subsidiaries",
    cta: "Explore Group DTMP",
  },
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
          Architecture governance looks different in Generation than it does in Billing Services — or Business Support. Find your division and get straight to the programmes, decisions, and resources that matter where you work.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {divisions.map((division) => {
            const Icon = division.icon;
            return (
              <Link
                key={division.name}
                to={`/divisions/${division.slug}`}
                className="group block bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all flex flex-col"
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "6px 8px 24px rgba(0,0,0,0.13)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "")}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: division.accent }}
                  >
                    <Icon size={18} className="text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">{division.name}</h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">{division.description}</p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Key Teams & Programmes</p>
                <ul className="space-y-1 mb-4">
                  {division.teams.map((team) => (
                    <li key={team} className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-300 inline-block" />
                      {team}
                    </li>
                  ))}
                </ul>
                <span className="text-sm font-semibold inline-flex items-center gap-1" style={{ color: division.accent }}>
                  Enter {division.shortName} <ChevronRight size={14} />
                </span>
              </Link>
            );
          })}

          {extraCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.name}
                to={card.route}
                className="group block bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all flex flex-col"
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "6px 8px 24px rgba(0,0,0,0.13)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "")}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: card.accent }}
                  >
                    <Icon size={18} className="text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">{card.name}</h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">{card.description}</p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Key Teams & Programmes</p>
                <ul className="space-y-1 mb-4">
                  {card.teams.map((team) => (
                    <li key={team} className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-300 inline-block" />
                      {team}
                    </li>
                  ))}
                </ul>
                <span className="text-sm font-semibold inline-flex items-center gap-1" style={{ color: card.accent }}>
                  {card.cta} <ChevronRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/marketplaces/learning-center"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0369A1 100%)" }}
          >
            New to DTMP? Start in the Learning Centre <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
