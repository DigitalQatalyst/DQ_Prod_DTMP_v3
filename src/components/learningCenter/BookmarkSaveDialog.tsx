import { useState } from "react";
import { BookMarked, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { addBookmark } from "@/data/learningCenter/bookmarks";

interface BookmarkSaveDialogProps {
  isOpen: boolean;
  courseId: string;
  courseTitle: string;
  courseCategory?: string;
  onClose: () => void;
  onSaved: () => void;
}

export function BookmarkSaveDialog({
  isOpen,
  courseId,
  courseTitle,
  courseCategory,
  onClose,
  onSaved,
}: BookmarkSaveDialogProps) {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    addBookmark(courseId, note.trim() || undefined);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setNote("");
      onSaved();
    }, 1200);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
          <BookMarked className="w-6 h-6 text-purple-600" />
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 text-center mb-1">
          Save for Later
        </h2>
        {courseCategory && (
          <p className="text-xs text-center text-purple-600 font-medium mb-1 uppercase tracking-wide">
            {courseCategory}
          </p>
        )}
        <p className="text-sm text-gray-500 text-center mb-4 leading-snug">
          {courseTitle}
        </p>

        {saved ? (
          <div className="text-center py-4">
            <div className="text-green-600 font-semibold text-base mb-1">Bookmarked!</div>
            <p className="text-sm text-gray-500">You'll find this in My Learning → Bookmarks</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bookmark-note" className="text-sm font-medium text-gray-700">
                Add a note <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                id="bookmark-note"
                placeholder="e.g. Want to take this after completing Track 1"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                className="resize-none text-sm"
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "#ea580c" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c2410c")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ea580c")}
            >
              <BookMarked className="w-4 h-4" />
              Save Bookmark
            </button>
            <Button
              variant="ghost"
              className="w-full text-gray-500"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
