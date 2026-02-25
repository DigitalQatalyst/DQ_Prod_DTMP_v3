import { TicketComment } from "@/data/supportData";
import { Info } from "lucide-react";

interface ConversationItemProps {
  comment: TicketComment;
}

const initials = (name?: string) =>
  name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

export function ConversationItem({ comment }: ConversationItemProps) {
  const isSystem = comment.author.role === "system";
  const isUser = comment.author.role === "user";

  if (isSystem) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-md px-3 py-2 text-sm text-blue-800 flex items-center gap-2">
        <Info size={16} />
        <span>{comment.content}</span>
        <span className="text-xs text-blue-700 ml-auto">{new Date(comment.timestamp).toLocaleString()}</span>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
          isUser ? "bg-gray-200 text-gray-700" : "bg-orange-100 text-orange-700"
        }`}
      >
        {comment.author.avatar || initials(comment.author.name)}
      </div>
      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">{comment.author.name}</div>
          <div className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString()}</div>
        </div>
        <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{comment.content}</p>
        {comment.type === "status-change" && comment.metadata && (
          <div className="text-xs text-gray-600 mt-2">
            Status changed from <strong>{comment.metadata.oldValue}</strong> to{" "}
            <strong>{comment.metadata.newValue}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationItem;
