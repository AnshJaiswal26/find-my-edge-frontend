import { DhanLogo } from "@shared/components/ui";
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
      <div className="bg-(--surface-muted) border border-(--border) rounded-2xl p-10 text-center max-w-md w-full">
        {/* Logo */}
        <DhanLogo />

        {/* Title */}
        <h2 className="text-(--text) text-xl font-semibold mb-2 flex items-center justify-center gap-2">
          <div className="bg-(--success) w-10 h-10 rounded-full flex items-center justify-center">
            <Check size={28} className="stroke-white stroke-5" />
          </div>{" "}
          Connected to Dhan 🎉
        </h2>

        {/* Subtitle */}
        <p className="text-(--text-muted) text-sm mb-6">
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
