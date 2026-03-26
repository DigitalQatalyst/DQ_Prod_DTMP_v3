import { Link } from "react-router-dom";

const platformLinks = [
  { name: "All Marketplaces", path: "/marketplaces" },
  { name: "Learning Centre", path: "/marketplaces/learning-center" },
  { name: "Knowledge Centre", path: "/marketplaces/knowledge-center" },
  { name: "Document Studio", path: "/marketplaces/document-studio" },
  { name: "Solution Specs", path: "/marketplaces/solution-specs" },
  { name: "Solution Build", path: "/marketplaces/solution-build" },
  { name: "Lifecycle Management", path: "/marketplaces/lifecycle-management" },
  { name: "Portfolio Management", path: "/marketplaces/portfolio-management" },
  { name: "Digital Intelligence", path: "/marketplaces/digital-intelligence" },
  { name: "Support Services", path: "/marketplaces/support-services" },
];

const divisionLinks = [
  { name: "Generation", path: "/divisions/generation" },
  { name: "Transmission", path: "/divisions/transmission" },
  { name: "Distribution", path: "/divisions/distribution" },
  { name: "Water & Civil", path: "/divisions/water-civil" },
  { name: "Billing Services", path: "/divisions/billing-services" },
  { name: "Innovation & The Future", path: "/divisions/innovation-future" },
  { name: "Power & Water Planning", path: "/divisions/power-water-planning" },
  { name: "Business Support & HR", path: "/divisions/business-support-hr" },
  { name: "Corporate & Strategy", path: "/divisions/corporate" },
  { name: "DEWA Group Subsidiaries", path: "/divisions/subsidiaries" },
];

const resourceLinks = [
  { name: "EA Charter & Strategy", path: "/marketplaces/knowledge-center" },
  { name: "User Guides", path: "/marketplaces/learning-center" },
  { name: "Support Centre", path: "/marketplaces/support-services" },
  { name: "Release Notes", path: "/marketplaces/knowledge-center" },
  { name: "FAQs", path: "/marketplaces/learning-center" },
];

const governanceLinks = [
  { name: "Enterprise EA Standards", path: "/marketplaces/knowledge-center" },
  { name: "Architecture Compliance", path: "/marketplaces/lifecycle-management" },
  { name: "Privacy Policy", path: "/marketplaces/knowledge-center" },
  { name: "Contact Corporate EA Office", path: "/marketplaces/support-services" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                <img src="/dewa-logo.webp" alt="DEWA logo" className="w-10 h-10 object-contain" />
              </div>
              <span className="text-2xl font-bold text-primary-foreground">DEWA</span>
            </Link>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Governed by DEWA&apos;s Corporate Enterprise Architecture Office.
            </p>
          </div>

          <div>
            <h3 className="text-sm uppercase font-semibold text-primary-foreground mb-4 tracking-wide">Platform</h3>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase font-semibold text-primary-foreground mb-4 tracking-wide">Divisions</h3>
            <ul className="space-y-3">
              {divisionLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase font-semibold text-primary-foreground mb-4 tracking-wide">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase font-semibold text-primary-foreground mb-4 tracking-wide">Governance</h3>
            <ul className="space-y-3">
              {governanceLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/55">
              DTMP | Governed by DEWA&apos;s Corporate Enterprise Architecture Office | Enterprise Edition
            </p>
            <p className="text-sm text-primary-foreground/40">
              2025 Dubai Electricity and Water Authority. Platform delivered by DigitalQatalyst.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
