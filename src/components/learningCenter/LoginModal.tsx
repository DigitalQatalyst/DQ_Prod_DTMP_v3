import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { enrolledCourses } from "@/data/learning";
import { mapRuntimeCourseToStage2CourseId } from "@/data/learningCenter/trackProgress";
import { setUserAuthenticated } from "@/data/sessionAuth";
import { setSessionRole, isTOStage3Role, type SessionRole } from "@/data/sessionRole";

const resolveRoleFromEmail = (email: string): SessionRole => {
  const lower = email.toLowerCase().trim();
  if (lower === "admin@to.dtmp.com") return "to-admin";
  if (lower.endsWith("@to.dtmp.com")) return "to-ops";
  return "business-user";
};

interface LoginModalContext {
  marketplace: string;
  tab: string;
  cardId: string;
  serviceName: string;
  action: string;
  formData?: Record<string, string>;
  dashboardName?: string;
  requestDescription?: string;
  commentText?: string;
  requestMessage?: string;
  sectionRef?: string;
  requestType?: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: LoginModalContext;
  onLoginSuccess?: (email?: string) => void;
}

export function LoginModal({
  isOpen,
  onClose,
  context,
  onLoginSuccess,
}: LoginModalProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log('LoginModal render - isOpen:', isOpen);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const actorEmail = email.trim();
    const role = resolveRoleFromEmail(actorEmail);
    setUserAuthenticated(true);
    setSessionRole(role);

    if (onLoginSuccess) {
      onLoginSuccess(email);
      return;
    }

    if (isTOStage3Role(role)) {
      navigate("/stage3/dashboard");
      return;
    }

    if (context.marketplace === "support-services" && context.action === "request-service") {
      navigate("/marketplaces/support-services/new-request", {
        state: context,
      });
      return;
    }

    if (context.marketplace === "solution-specs" && context.action === "Make Request") {
      navigate("/marketplaces/solution-specs/request", {
        state: {
          specId: context.cardId,
          serviceName: context.serviceName,
        },
      });
      return;
    }

    if (context.marketplace === "learning-center") {
      const fallbackCourseId =
        enrolledCourses[0]?.id ?? "digital-transformation-fundamentals";
      const mappedCourseId =
        mapRuntimeCourseToStage2CourseId(context.cardId) ??
        (enrolledCourses.some((course) => course.id === context.cardId)
          ? context.cardId
          : fallbackCourseId);

      navigate(`/stage2/learning-center/course/${mappedCourseId}/user`, {
        state: {
          ...context,
          cardId: mappedCourseId,
          actorEmail,
          learningRole: "learner",
        },
      });
      return;
    }

    if (context.marketplace === "knowledge-center") {
      const targetTab = context.action === "save-to-workspace" ? "saved" : "overview";
      navigate(`/stage2/knowledge/${targetTab}`, {
        state: {
          ...context,
          actorEmail,
        },
      });
      return;
    }

    if (context.marketplace === "solution-specs") {
      navigate("/stage2/specs/overview", {
        state: { fromStage1: true, specId: context.cardId },
      });
      return;
    }

    if (
      context.marketplace === "digital-intelligence" &&
      context.action &&
      context.action !== "View Analytics"
    ) {
      navigate("/stage2/intelligence/requests", {
        state: {
          ...context,
          actorEmail,
        },
      });
      return;
    }

    if (
      (context.marketplace === "templates" ||
        context.marketplace === "document-studio") &&
      context.action === "request-service"
    ) {
      navigate("/stage2/templates/new-request", {
        state: {
          ...context,
          actorEmail,
          templateId: context.cardId,
        },
      });
      return;
    }

    navigate("/stage2", {
      state: {
        ...context,
        actorEmail,
      },
    });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white max-w-md w-full rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
          <Lock className="w-8 h-8 text-orange-600" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-foreground text-center mb-2">
          Login Required
        </h2>

        {/* Description */}
        <p className="text-base text-muted-foreground text-center mb-8">
          {context.marketplace === "solution-build"
            ? `Log in to request deployment of "${context.serviceName}".`
            : context.marketplace === "solution-specs" && context.action === "Make Request"
              ? `Log in to submit your request for "${context.serviceName}".`
              : context.marketplace === "solution-specs"
                ? "Log in to access this solution specification."
                : context.marketplace === "digital-intelligence"
                  ? `Log in to submit your request for "${context.dashboardName || context.serviceName || "Digital Intelligence"}".`
                  : context.marketplace === "knowledge-center"
                    ? "Log in to save this item to your Knowledge Centre workspace."
                    : (context.marketplace === "document-studio" || context.marketplace === "templates") && context.serviceName
                      ? `Log in to request an AI-generated document for "${context.serviceName}".`
                      : "Please log in to continue with your enrollment"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              className="w-full border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Log In
          </Button>
        </form>

        {/* Signup Link */}
        <p className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <button 
            type="button"
            onClick={() => {
              console.log('Sign up clicked - navigating to registration');
              // TODO: Implement registration flow or navigate to registration page
              // navigate('/register');
            }}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Sign up
          </button>
        </p>

        {/* Demo credential hints */}
        <div className="mt-5 border-t pt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Demo credentials
          </p>
          <div className="space-y-1 text-xs text-gray-500">
            <p>
              <span className="font-medium text-gray-700">TO Ops:</span> any@to.dtmp.com
            </p>
            <p>
              <span className="font-medium text-gray-700">TO Admin:</span> admin@to.dtmp.com
            </p>
            <p>
              <span className="font-medium text-gray-700">Business User:</span> any other email
            </p>
            <p className="text-gray-400 mt-1">Password: any value</p>
          </div>
        </div>
      </div>
    </div>
  );
}
