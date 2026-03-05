import { Link } from "react-router-dom";
import { Sun, Network, Bot, Building2 } from "lucide-react";

const contextPillars = [
  {
    icon: Sun,
    title: "Digital DEWA",
    description:
      "DEWA's four-pillar strategy: Solar Power, Energy Storage, AI, and Digital Services. DTMP governs the architecture of all four.",
    cta: "Explore Digital DEWA",
    route: "/docs",
    color: "text-blue-accent",
    bg: "bg-[#DBEAFE]",
  },
  {
    icon: Bot,
    title: "EA 4.0 Practice",
    description:
      "DEWA is recognised globally as an EA 4.0 practitioner. DTMP operationalises consistent architecture governance across divisions.",
    cta: "View EA 4.0 Context",
    route: "/docs",
    color: "text-primary",
    bg: "bg-[#BFDBFE]",
  },
  {
    icon: Network,
    title: "Smart Grid Strategy",
    description:
      "AED 7 billion invested in Smart Grid 2021-2035. DTMP ensures architecture alignment across this strategic technology portfolio.",
    cta: "View Grid Strategy Context",
    route: "/docs",
    color: "text-green",
    bg: "bg-[#BBF7D0]",
  },
  {
    icon: Building2,
    title: "Net-Zero 2050",
    description:
      "Every architecture decision is measured against clean-energy commitments, including the 36% clean energy target by 2030.",
    cta: "View Sustainability Alignment",
    route: "/docs",
    color: "text-phase-drive",
    bg: "bg-[#FECACA]",
  },
];

const stats = [
  { value: "1.27M", label: "Customer Accounts" },
  { value: "0.94", label: "Customer Minutes Lost / Year" },
  { value: "8,000", label: "MW Solar by 2030 (MBR Park)" },
  { value: "36%", label: "Clean Energy Target 2030" },
];

export function DBPOverview() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mb-12">
          <h2 className="text-[36px] lg:text-[40px] font-bold text-[#061927] mb-2">
            The World&apos;s Most Advanced Utility, Governed by One Architecture Platform.
          </h2>
          <p className="section-subheading mb-4">
            DEWA serves 1.27 million customers with 0.94 customer minutes lost per year.
            DTMP is the platform governing the architecture that sustains that benchmark
            while accelerating transformation to Net-Zero 2050.
          </p>
          <p className="text-base lg:text-lg text-slate-700 leading-relaxed">
            Digital DEWA, MBR Solar Park, Rammas AI, the Virtual Engineer programme, and
            Moro Hub are live proof of capability. DTMP ensures this transformation remains
            structured, aligned, and enterprise-governed across all divisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {contextPillars.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className={`w-14 h-14 rounded-lg ${pillar.bg} flex items-center justify-center mb-4`}>
                <pillar.icon size={28} className={pillar.color} />
              </div>
              <h3 className="text-xl font-bold text-[#061927] mb-3">{pillar.title}</h3>
              <p className="text-sm text-slate-600 mb-4">{pillar.description}</p>
              <Link to={pillar.route} className="text-sm font-semibold text-[#0369A1] hover:text-[#075985]">
                → {pillar.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center rounded-xl p-5 bg-white border border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              style={{
                borderTop: `4px solid ${
                  index === 0 ? "#0EA5E9" : index === 1 ? "#16A34A" : index === 2 ? "#F97316" : "#166534"
                }`,
              }}
            >
              <p
                className="text-[44px] lg:text-[56px] leading-none font-bold mb-2"
                style={{ color: index === 0 ? "#0EA5E9" : index === 1 ? "#16A34A" : index === 2 ? "#F97316" : "#166534" }}
              >
                {stat.value}
              </p>
              <p className="text-[14px] text-[#64748B]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
