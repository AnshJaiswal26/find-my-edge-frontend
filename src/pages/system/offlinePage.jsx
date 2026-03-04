import { Button } from "@shared/components/ui";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--surface)">
      <div className="text-center max-w-md p-8 bg-(--surface-muted) rounded-xl shadow-lg">
        <div className="flex justify-center mb-4">
          <WifiOff className="h-12 w-12 text-gray-500" />
        </div>

        <h1 className="text-2xl font-semibold text-(--text)">You're Offline</h1>

        <p className="text-(--text-muted) mt-2">
          It looks like your internet connection is lost. Please check your
          connection and try again.
        </p>

        <div className="flex justify-center mt-6 w-full">
          <Button
            onClick={() => window.location.reload()}
            variant="info"
            text={"Retry"}
          />
        </div>
      </div>
    </div>
  );
}
