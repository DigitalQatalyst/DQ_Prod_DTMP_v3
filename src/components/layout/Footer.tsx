import { Link } from "react-router-dom";

const platformLinks = [
  { name: "Marketplaces", path: "/marketplaces" },
  { name: "User Groups", path: "/user-groups" },
  { name: "Execution Streams", path: "/execution-streams" },
  { name: "Assets", path: "/assets" },
];

const resourceLinks = [
  { name: "Best Practices", path: "/best-practices" },
  { name: "Architecture Standards", path: "/standards" },
  { name: "Support Center", path: "/support" },
  { name: "Documentation", path: "/docs" },
];

const governanceLinks = [
  { name: "TO Oversight", path: "/transformation-office" },
  { name: "Compliance Tracking", path: "/compliance" },
  { name: "FAQ", path: "/faq" },
  { name: "Contact Us", path: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Tagline */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-blue-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">D</span>
              </div>
              <span className="text-2xl font-bold text-primary-foreground">
                DTMP
              </span>
            </Link>
            <p className="text-sm text-primary-foreground/60 leading-relaxed">
              Platform for accelerating enterprise-wide transformation
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm uppercase font-semibold text-primary-foreground mb-4 tracking-wide">
              Platform
            </h3>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm uppercase font-semibold text-primary-foreground mb-4 tracking-wide">
              Resources
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`text-sm hover:text-primary-foreground transition-colors ${
                      link.name === "Architecture Standards"
                        ? "text-blue-accent font-semibold"
                        : "text-primary-foreground/60"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Governance Links */}
          <div>
            <h3 className="text-sm uppercase font-semibold text-primary-foreground mb-4 tracking-wide">
              Governance
            </h3>
            <ul className="space-y-3">
              {governanceLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/40">
              © DTMP Platform. Governed by Transformation Office.
            </p>
            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="text-sm text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
