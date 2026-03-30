import { useUIStore } from "@shared/stores";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";

export default function ToastContainer() {
  const removeToast = useUIStore((s) => s.removeToast);
  const toasts = useUIStore((s) => s.toasts);

  if (!toasts.length) return null;

  const iconMap = {
    success: <CheckCircle size={16} className="text-(--success) shrink-0" />,
    error: <AlertCircle size={16} className="text-(--error) shrink-0" />,
    info: <Info size={16} className="text-(--info) shrink-0" />,
    warning: <AlertTriangle size={16} className="text-(--warning) shrink-0" />,
  };

  const progressColor = {
    success: "bg-(--success)",
    error: "bg-(--error)",
    info: "bg-(--info)",
    warning: "bg-(--warning)",
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
            p-3
            rounded
            text-[13px]
            backdrop-blur-md
            border border-(--border)
            shadow-md
            bg-(--surface-muted)
            opacity-0 translate-x-4
            overflow-hidden
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
            <div className="absolute bottom-0 left-0 h-[3px] w-full bg-(--surface)">
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
