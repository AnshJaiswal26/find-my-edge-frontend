import { Button } from "@shared/components/ui";
import { ServerCrash } from "lucide-react";

export default function ServerUnavailablePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--surface)">
      <div className="text-center max-w-md p-8 bg-(--surface-muted) rounded-xl shadow-lg">
        <div className="flex justify-center mb-4">
          <ServerCrash className="h-12 w-12 text-red-500" />
        </div>

        <h1 className="text-2xl font-semibold text-(--text)">
          Server Unavailable
        </h1>

        <p className="text-(--text-muted) mt-2">
          We are unable to connect to the server right now. This may be due to
          maintenance or temporary downtime.
        </p>

        <div className="flex justify-center mt-6">
          <Button
            onClick={() => window.location.reload()}
            text={"Try Again"}
            variant="info"
          />
        </div>
      </div>
    </div>
  );
}
