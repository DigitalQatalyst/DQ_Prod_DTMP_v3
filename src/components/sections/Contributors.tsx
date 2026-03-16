import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContributorCard } from "@/components/cards/ContributorCard";
import { contributors } from "@/data/contributors";
import { LoginModal } from "@/components/learningCenter/LoginModal";
import { useToast } from "@/components/ui/use-toast";
import { isUserAuthenticated } from "@/data/sessionAuth";
import { getSessionRole, isTOStage3Role } from "@/data/sessionRole";

export function Contributors() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showTOLogin, setShowTOLogin] = useState(false);

  const handleTOCardCta = () => {
    if (isUserAuthenticated() && isTOStage3Role(getSessionRole())) {
      navigate("/stage3/dashboard");
      return;
    }
    setShowTOLogin(true);
  };

  const handleTOLoginSuccess = () => {
    const role = getSessionRole();
    setShowTOLogin(false);

    if (isTOStage3Role(role)) {
      navigate("/stage3/dashboard");
      return;
    }

    toast({
      title: "TO access required",
      description: "Sign in with a TO account (any@to.dtmp.com or admin@to.dtmp.com) to open Stage 3.",
      variant: "destructive",
    });
  };

  return (
    <section className="py-16 lg:py-20 section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Contributors to Our DBP
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Enterprise-wide stakeholders—defined as governors, designers,
            executors, or contributors—working toward our shared Digital
            Business Platform
          </p>
        </div>

        {/* Contributors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributors.map((contributor) => (
            <ContributorCard
              key={contributor.id}
              contributor={contributor}
              onCtaClick={contributor.id === "to" ? handleTOCardCta : undefined}
            />
          ))}
        </div>
      </div>

      <LoginModal
        isOpen={showTOLogin}
        onClose={() => setShowTOLogin(false)}
        onLoginSuccess={handleTOLoginSuccess}
        context={{
          marketplace: "platform",
          tab: "to-operations",
          cardId: "to-dashboard",
          serviceName: "Transformation Office Dashboard",
          action: "to-operations",
        }}
      />
    </section>
  );
}
