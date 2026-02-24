import { PropsWithChildren, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Headphones, Home, Ticket, ClipboardList, BookOpen, Menu, X } from "lucide-react";

interface SupportLayoutProps extends PropsWithChildren {
  title?: string;
  description?: string;
}

const navItems = [
  { label: "Overview", to: "/stage2/support/overview", icon: Home },
  { label: "My Tickets", to: "/stage2/support/tickets", icon: Ticket },
  { label: "Service Requests", to: "/stage2/support/requests", icon: ClipboardList },
  { label: "Knowledge Base", to: "/stage2/support/knowledge", icon: BookOpen },
];

export function SupportLayout({ children, title = "Support Services", description }: SupportLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleNav = (to: string) => {
    navigate(to);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-72 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center text-white">
            <Headphones size={18} />
          </div>
          <div>
            <p className="text-xs uppercase text-gray-500">Stage 2</p>
            <p className="font-semibold text-gray-900">Support Services</p>
          </div>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-64px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <button
                key={item.to}
                onClick={() => handleNav(item.to)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-orange-50 text-orange-700 border border-orange-200" : "text-gray-700 hover:bg-gray-50 border border-transparent"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg border border-gray-200"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div>
              <p className="text-xs uppercase text-gray-500">Support Services</p>
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
              {description && <p className="text-sm text-gray-600">{description}</p>}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-6 py-6">{children}</main>
      </div>
    </div>
  );
}

export default SupportLayout;
