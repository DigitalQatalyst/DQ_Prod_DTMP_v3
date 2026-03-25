import { Link } from "react-router-dom";
import { Sun, Network, Bot, Building2, ArrowRight } from "lucide-react";
import { SectionPill, IconBadge, StatCard } from "@/components/landing/shared";

const contextPillars = [
  {
    icon: Sun,
    title: "Digital DEWA",
    description:
      "DEWA's four-pillar strategy: Solar Power, Energy Storage, AI, and Digital Services. DTMP governs the architecture of all four.",
  },
  {
    icon: Bot,
    title: "EA 4.0 Practice",
    description:
      "DEWA is recognised globally as an EA 4.0 practitioner. DTMP operationalises consistent architecture governance across divisions.",
  },
  {
    icon: Network,
    title: "Smart Grid Strategy",
    description:
      "AED 7 billion invested in Smart Grid 2021–2035. DTMP ensures architecture alignment across this strategic technology portfolio.",
  },
  {
    icon: Building2,
    title: "Net-Zero 2050",
    description:
      "Every architecture decision is measured against clean-energy commitments, including the 36% clean energy target by 2030.",
  },
];

const stats = [
  { value: "1.27M", label: "Customer Accounts", sub: "DEWA serves 1.27 million accounts across Dubai with award-winning reliability and digital-first service delivery." },
  { value: "0.94", label: "Customer Minutes Lost / Year", sub: "One of the world's lowest utility outage rates — DTMP governs the architecture sustaining this benchmark." },
  { value: "8,000", label: "MW Solar by 2030", sub: "The Mohammed Bin Rashid Solar Park will deliver 8,000 MW of clean energy — every architecture decision aligned through DTMP." },
  { value: "36%", label: "Clean Energy Target 2030", sub: "DEWA is on track for 36% clean energy by 2030 as part of its Net-Zero 2050 pathway, governed end-to-end through DTMP." },
];

export function DBPOverview() {
  return (
    <section className="py-20" style={{ background: "#EEF2FF" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <SectionPill label="Platform Overview" />
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-3">
          Governing the World&apos;s Most Advanced Utility.
        </h2>
        <p className="text-slate-500 text-center max-w-2xl mx-auto mb-12 text-sm leading-relaxed">
          DEWA serves 1.27 million customers with 0.94 customer minutes lost per year. DTMP is the
          platform governing the architecture that sustains that benchmark while accelerating
          transformation to Net-Zero 2050.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contextPillars.map((pillar) => (
            <div key={pillar.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all duration-200" onMouseEnter={e => (e.currentTarget.style.boxShadow = "6px 8px 24px rgba(0,0,0,0.13)")} onMouseLeave={e => (e.currentTarget.style.boxShadow = "")}>
              <IconBadge icon={<pillar.icon size={26} className="text-white" />} />
              <h3 className="font-bold text-slate-800 mt-4 mb-2 text-base">{pillar.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} sub={stat.sub} />
          ))}
        </div>
        <div className="text-center">
          <Link
            to="/marketplaces"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0369A1 100%)" }}
          >
            Explore the Unified EA Architecture <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
