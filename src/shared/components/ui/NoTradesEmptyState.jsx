import { Button } from "@shared/components/ui";
import { Inbox } from "lucide-react";

export default function NoTradesEmptyState({
  title = "No trades available",
  message = "You don’t have any trades to display right now.",
  onRetry,
  className = "",
}) {
  return (
    <div
      className={`min-h-[80vh] flex items-center justify-center bg-(--surface) ${className}`}
    >
      <div className="border border-(--border) bg-(--surface) rounded-2xl p-8 text-center max-w-md w-full shadow-sm">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-(--hover) w-12 h-12 rounded-full flex items-center justify-center">
            <Inbox size={26} className="stroke-(--text) stroke-[2.5]" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-(--text) text-lg font-semibold mb-2">{title}</h2>

        {/* Message */}
        <p className="text-(--text-muted) text-sm mb-6">{message}</p>

        {/* Optional Action */}
        {onRetry && (
          <Button.Text onClick={onRetry} className="font-serif">
            Refresh
          </Button.Text>
        )}
      </div>
    </div>
  );
}
