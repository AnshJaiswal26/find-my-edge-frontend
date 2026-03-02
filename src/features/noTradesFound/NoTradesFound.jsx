import { Button, DhanLogo } from "@shared/components/ui";
import { Inbox } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NoTradesFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[82vh] bg-(--surface) flex items-center justify-center">
      <div className="bg-(--surface) border border-(--border) rounded-2xl p-10 text-center max-w-md w-full">
        {/* Logo */}
        <DhanLogo />

        {/* Title */}
        <h2 className="text-(--text) text-xl font-semibold mb-2 flex items-center justify-center gap-2">
          <div className="bg-(--hover) w-10 h-10 rounded-full flex items-center justify-center">
            <Inbox size={26} className="stroke-(--text) stroke-[2.5]" />
          </div>
          No trades found
        </h2>

        {/* Subtitle */}
        <p className="text-(--text-muted) text-sm mb-6">
          We couldn’t find any trades in your account yet. Try syncing again or
          check your date range.
        </p>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button.Text
            onClick={() => window.location.reload()}
            className="font-serif"
          >
            Retry Sync
          </Button.Text>

          <Button.Text
            onClick={() => navigate("/settings")}
            className="font-serif"
          >
            Go to Settings →
          </Button.Text>
        </div>
      </div>
    </div>
  );
}
