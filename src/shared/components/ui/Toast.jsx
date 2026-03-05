import { useUIStore } from "@shared/stores";
import { X, CheckCircle, Info, AlertCircle, AlertTriangle } from "lucide-react";

export default function ToastContainer() {
  const removeToast = useUIStore((s) => s.removeToast);
  const toasts = useUIStore((s) => s.toasts);

  if (!toasts.length) return null;

  const iconMap = {
    success: <CheckCircle size={16} className="text-green-500 shrink-0" />,
    error: <AlertCircle size={16} className="text-red-500 shrink-0" />,
    info: <Info size={16} className="text-sky-500 shrink-0" />,
    warning: <AlertTriangle size={16} className="text-amber-500 shrink-0" />,
  };

  const progressColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-sky-500",
    warning: "bg-amber-500",
  };

  return (
    <div
      className="
        fixed bottom-3 right-10
        z-[1000]
        flex flex-col gap-2
        w-[280px]
        pointer-events-none
      "
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto
            relative
            flex items-center gap-2
            px-3 py-2
            rounded-lg
            text-[13px]
            backdrop-blur-md
            border border-white/10
            shadow-md
            bg-(--surface-disabled)
            opacity-0 translate-x-4
            animate-[toast-in_200ms_ease_forwards]
            ${toast.leaving ? "animate-[toast-out_180ms_ease_forwards]" : ""}
          `}
        >
          {/* icon */}
          {iconMap[toast.type]}

          {/* message */}
          <div className="flex-1 text-(--text) leading-snug">
            {toast.message}
          </div>

          {/* close */}
          <button
            onClick={() => removeToast(toast.id)}
            className="
              opacity-60
              hover:opacity-100
              transition
              cursor-pointer
              text-(--text)
            "
          >
            <X size={14} />
          </button>

          {/* progress */}
          {!toast.leaving && (
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-(--surface)">
              <div
                className={`h-full ${progressColor[toast.type]} animate-[toast-progress_5s_linear]`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
