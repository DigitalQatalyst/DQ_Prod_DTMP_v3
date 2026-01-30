import { useLocation, Link } from "react-router-dom";
import { Construction, ArrowLeft, LayoutGrid } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

interface LocationState {
  marketplace?: string;
  tab?: string;
  cardId?: string;
  serviceName?: string;
  action?: string;
}

export default function TransactAppPage() {
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  const {
    marketplace = "learning-center",
    tab = "courses",
    serviceName = "Unknown Service",
    action = "Enroll Now",
  } = state;

  const marketplaceLabel = marketplace
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const tabLabel = tab
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 flex items-center justify-center py-20">
        <div className="max-w-2xl mx-auto text-center p-8">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
            <Construction className="w-10 h-10 text-orange-600" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-primary-navy mb-2">
            Stage 2 - Transact App
          </h1>
          <p className="text-xl text-muted-foreground mb-8">Coming Soon</p>

          {/* Request Context Box */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">
              Request Context:
            </h3>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-sm text-muted-foreground">Marketplace:</td>
                  <td className="py-2 text-sm font-medium text-foreground">{marketplaceLabel}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-sm text-muted-foreground">Tab:</td>
                  <td className="py-2 text-sm font-medium text-foreground">{tabLabel}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-sm text-muted-foreground">Service:</td>
                  <td className="py-2 text-sm font-medium text-foreground">{serviceName}</td>
                </tr>
                <tr>
                  <td className="py-2 text-sm text-muted-foreground">Action:</td>
                  <td className="py-2 text-sm font-medium text-foreground capitalize">{action}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Description */}
          <p className="text-base text-muted-foreground mb-8 max-w-lg mx-auto">
            The Transact App is currently under development. This is where you would complete
            your enrollment, track your progress, access course materials, and manage your
            learning journey.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="outline"
              className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              <Link to={`/marketplaces/${marketplace}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {marketplaceLabel}
              </Link>
            </Button>
            <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white">
              <Link to="/marketplaces">
                <LayoutGrid className="w-4 h-4 mr-2" />
                View All Marketplaces
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
