export function DEWAOrgChart() {
  const divisions = [
    { abbr: "GEN", name: "Generation (P&W)", accent: "#D97706", evp: "Nasser Bin Lootah" },
    { abbr: "TXN", name: "Transmission Power", accent: "#0EA5E9", evp: "Hussain Lootah" },
    { abbr: "DST", name: "Distribution Power", accent: "#16A34A", evp: "Rashid Humaidan" },
    { abbr: "WTR", name: "Water & Civil", accent: "#0D9488", evp: "Abdulla Obaidulla" },
    { abbr: "BLS", name: "Billing Services", accent: "#7C3AED", evp: "Mohamed Almana" },
    { abbr: "INV", name: "Innovation & The Future", accent: "#0369A1", evp: "Marwan Bin Haider" },
    { abbr: "PWP", name: "Power & Water Planning", accent: "#DC2626", evp: "A. Al Aghbari" },
    { abbr: "HR", name: "Business Support & HR", accent: "#059669", evp: "Dr. Yousef Alakraf" },
  ];

  const corporateFunctions = [
    { title: "CFO", name: "Thomas Varghese", dept: "Finance" },
    { title: "CDO", name: "A. Aljaziri (Ag.)", dept: "Digital Solutions & Services" },
    { title: "Chief Innovation Officer", name: "Dr. Ali Alsuwaidi", dept: "Innovation" },
    { title: "CISO", name: "Moaza Al Shamsi", dept: "Information Security" },
    { title: "CCHO", name: "Saleh Al Marzouqi", dept: "Customer Happiness" },
    { title: "COO", name: "Omar Almansoori", dept: "Digital Operations" },
    { title: "EVP Strategy", name: "Khawla Almehairi", dept: "Strategy & Comms" },
    { title: "EVP Business Dev", name: "Waleed Salman", dept: "Business Dev & Excellence" },
    { title: "Chief Legal Advisor", name: "Ahmed Abdelrehim", dept: "Legal Affairs" },
    { title: "VP Internal Audit", name: "Ahmed Noor", dept: "Internal Audit" },
  ];

  const subsidiaries = [
    { name: "Moro Hub", desc: "UAE's premier data centre & cloud hub" },
    { name: "Empower", desc: "World's largest district cooling provider" },
    { name: "Etihad ESCO", desc: "UAE energy efficiency services" },
    { name: "Digital X", desc: "Digital transformation services" },
  ];

  return (
    <div className="w-full font-sans text-sm select-none overflow-x-auto">

      {/* CEO */}
      <div className="flex justify-center mb-6">
        <div
          className="rounded-2xl px-8 py-4 text-center shadow-md"
          style={{ background: "linear-gradient(135deg, #0a1628 0%, #1e3a5f 100%)", minWidth: 320 }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-1">MD & CEO</p>
          <p className="text-white font-bold text-base">HE Saeed Mohammed Al Tayer</p>
          <p className="text-white/60 text-xs mt-0.5">Managing Director & Chief Executive Officer</p>
        </div>
      </div>

      {/* Connector line down */}
      <div className="flex justify-center mb-0">
        <div className="w-px h-6 bg-slate-300" />
      </div>

      {/* Horizontal rule with three branches */}
      <div className="flex justify-center mb-0">
        <div className="flex items-start" style={{ width: "100%", maxWidth: 960 }}>
          <div className="flex-1 border-t-2 border-slate-300 mt-0 mr-0" style={{ marginTop: 0 }} />
          <div className="w-px h-6 bg-slate-300 mx-0" />
          <div className="flex-1 border-t-2 border-slate-300" />
        </div>
      </div>

      {/* Three column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-0">

        {/* Corporate Functions */}
        <div>
          <div className="rounded-xl px-4 py-2 mb-3 text-center" style={{ background: "#1e3a5f" }}>
            <p className="text-white font-bold text-xs uppercase tracking-widest">Corporate Functions</p>
          </div>
          <div className="space-y-2">
            {corporateFunctions.map((fn) => (
              <div
                key={fn.title}
                className="bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100 flex items-start gap-3"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: "#1e3a5f" }}
                >
                  {fn.title.split(" ").map(w => w[0]).join("").slice(0, 3)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-xs leading-tight">{fn.title}</p>
                  <p className="text-slate-400 text-xs">{fn.dept}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operating Divisions */}
        <div>
          <div className="rounded-xl px-4 py-2 mb-3 text-center" style={{ background: "#0369A1" }}>
            <p className="text-white font-bold text-xs uppercase tracking-widest">8 Operating Divisions</p>
          </div>
          <div className="space-y-2">
            {divisions.map((div) => (
              <div
                key={div.abbr}
                className="bg-white rounded-xl px-4 py-2.5 border border-slate-100 flex items-center gap-3 shadow-sm"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: div.accent }}
                >
                  {div.abbr}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-xs leading-tight">{div.name} Division</p>
                  <p className="text-slate-400 text-xs truncate">EVP: {div.evp}</p>
                </div>
              </div>
            ))}
          </div>
          {/* EA Office callout */}
          <div className="mt-3 rounded-xl px-4 py-2.5 border border-violet-200 bg-violet-50">
            <p className="text-xs font-bold text-violet-700 uppercase tracking-widest mb-0.5">Corporate EA Office</p>
            <p className="text-violet-600 text-xs">Governs architecture across all 8 divisions — standards, compliance, and DTMP governance.</p>
          </div>
        </div>

        {/* DEWA Group Subsidiaries */}
        <div>
          <div className="rounded-xl px-4 py-2 mb-3 text-center" style={{ background: "#6d28d9" }}>
            <p className="text-white font-bold text-xs uppercase tracking-widest">DEWA Group Subsidiaries</p>
          </div>
          <div className="space-y-2">
            {subsidiaries.map((sub) => (
              <div
                key={sub.name}
                className="bg-white rounded-xl px-4 py-3 border border-slate-100 shadow-sm"
              >
                <p className="font-bold text-slate-800 text-sm">{sub.name}</p>
                <p className="text-slate-400 text-xs mt-0.5">{sub.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl px-4 py-2.5 border border-purple-200 bg-purple-50">
            <p className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-0.5">Group EA Framework</p>
            <p className="text-purple-600 text-xs">All subsidiaries governed under the same enterprise architecture standards as DEWA's core divisions.</p>
          </div>
        </div>

      </div>

      {/* Source note */}
      <p className="text-xs text-slate-400 text-center mt-6">
        Source: DEWA Official Organisational Chart — freejna.dewa.gov.ae/orgchart/org-chart.html
      </p>
    </div>
  );
}
