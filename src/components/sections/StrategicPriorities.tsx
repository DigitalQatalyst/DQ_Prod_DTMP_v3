const priorities = [
  {
    number: "01",
    title: "Enterprise Architecture Coherence",
    body: "One architecture standard across all DEWA divisions with no fragmentation and no conflicting frameworks.",
    kpi: "KPI: Cross-Division EA Compliance Rate",
    tagClass: "badge-discern",
  },
  {
    number: "02",
    title: "Digital DEWA Programme Governance",
    body: "Govern Solar, Storage, AI, and Digital Services as architecturally aligned and mutually reinforcing programmes.",
    kpi: "KPI: Digital DEWA Architecture Alignment Score",
    tagClass: "badge-design",
  },
  {
    number: "03",
    title: "Net-Zero Architecture Alignment",
    body: "Make every architecture decision traceable to DEWA's Net-Zero 2050 commitments.",
    kpi: "KPI: Net-Zero Architecture Contribution Score",
    tagClass: "badge-deploy",
  },
  {
    number: "04",
    title: "Technology Investment Control",
    body: "Deliver enterprise visibility for smarter prioritisation, reduced duplication, and accountable investment governance.",
    kpi: "KPI: Technology Rationalisation Rate",
    tagClass: "badge-drive",
  },
  {
    number: "05",
    title: "AI-Native Operations Readiness",
    body: "Prepare all divisions for AI-native operations with governance frameworks and reusable architecture blueprints.",
    kpi: "KPI: AI Readiness Assessment Score",
    tagClass: "badge-design",
  },
  {
    number: "06",
    title: "World-Class Service Reliability",
    body: "Protect DEWA's benchmark reliability through architecture governance linked to continuity and customer outcomes.",
    kpi: "KPI: Architecture-Linked Service Continuity",
    tagClass: "badge-deploy",
  },
];

export function StrategicPriorities() {
  return (
    <section className="py-16 lg:py-20 section-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[#0369A1] text-xs font-bold uppercase tracking-[0.08em] mb-2">
            Enterprise Priorities
          </p>
          <h2 className="text-[36px] lg:text-[40px] font-bold text-[#061927] mb-2">
            Enterprise Strategic Priorities
          </h2>
          <p className="section-subheading max-w-4xl mx-auto">
            Six enterprise-wide outcomes DTMP is configured to deliver for all of DEWA,
            aligned to 2030 targets and Net-Zero 2050.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {priorities.map((priority) => (
            <article
              key={priority.number}
              className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              style={{
                borderTop: `4px solid ${
                  priority.tagClass === "badge-discern"
                    ? "#0EA5E9"
                    : priority.tagClass === "badge-design"
                      ? "#F97316"
                      : priority.tagClass === "badge-deploy"
                        ? "#16A34A"
                        : "#DC2626"
                }`,
              }}
            >
              <p
                className="text-[12px] font-bold uppercase tracking-[0.08em] mb-2"
                style={{
                  color:
                    priority.tagClass === "badge-discern"
                      ? "#0EA5E9"
                      : priority.tagClass === "badge-design"
                        ? "#F97316"
                        : priority.tagClass === "badge-deploy"
                          ? "#16A34A"
                          : "#DC2626",
                }}
              >
                {priority.tagClass === "badge-discern"
                  ? "Discern"
                  : priority.tagClass === "badge-design"
                    ? "Design"
                    : priority.tagClass === "badge-deploy"
                      ? "Deploy"
                      : "Drive"}
              </p>
                <p className="text-4xl font-bold text-slate-300 mb-4">{priority.number}</p>
              <h3 className="text-xl font-bold text-foreground mb-3">{priority.title}</h3>
              <p className="text-sm text-slate-600 mb-5">{priority.body}</p>
                <span className="inline-block text-xs font-semibold text-[#0369A1]">
                  {priority.kpi}
                </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
