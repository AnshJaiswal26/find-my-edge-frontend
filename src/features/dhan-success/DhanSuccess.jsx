import { ConnectionBadge, DhanLogo } from "@shared/components/ui";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function DhanSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  //   useEffect(() => {
  //     const code = params.get("code"); // from Dhan redirect

  //     if (code) {
  //       // 👉 Call backend to exchange token
  //       fetch(`/api/dhan/exchange?code=${code}`)
  //         .then(() => {
  //           // after success → go dashboard
  //           setTimeout(() => navigate("/dashboard"), 1500);
  //         })
  //         .catch(() => {
  //           navigate("/settings");
  //         });
  //     } else {
  //       navigate("/settings");
  //     }
  //   }, []);

  return (
    <div className="min-h-[82vh] bg-(--surface) flex items-center justify-center">
      <div className="bg-(--surface-muted) border border-(--border) rounded-2xl p-10 text-center max-w-md w-full space-y-4">
        {/* Logo */}
        <DhanLogo />

        <ConnectionBadge
          text="You have successfully connected to dhan 🎉"
          size="md"
        />

        {/* Subtitle */}
        <p className="text-(--text-muted) text-sm">
          Your account has been successfully linked. We’re preparing your
          dashboard...
        </p>

        {/* Loader */}
        <div className="flex justify-center">
          <div className="w-8 h-8 border-3 border-(--hover) border-t-(--text) border-r-(--text) rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
