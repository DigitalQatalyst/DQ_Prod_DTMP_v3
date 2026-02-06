import { useNavigate } from "react-router-dom";
import { Eye, ShieldCheck } from "lucide-react";

interface ViewToggleProps {
  currentView: "user" | "admin";
  courseId: string;
}

const ViewToggle = ({ currentView, courseId }: ViewToggleProps) => {
  const navigate = useNavigate();

  return (
    <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
      <button
        onClick={() =>
          navigate(`/stage2/learning-center/course/${courseId}/user`)
        }
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
          currentView === "user"
            ? "bg-orange-600 text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <Eye className="w-4 h-4" />
        User View
      </button>
      <button
        onClick={() =>
          navigate(`/stage2/learning-center/course/${courseId}/admin`)
        }
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
          currentView === "admin"
            ? "bg-orange-600 text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <ShieldCheck className="w-4 h-4" />
        Admin View
      </button>
    </div>
  );
};

export default ViewToggle;
