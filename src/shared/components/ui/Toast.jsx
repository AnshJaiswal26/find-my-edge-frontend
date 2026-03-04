import { useUIStore } from "@shared/stores";

export default function ToastContainer() {
  const removeToast = useUIStore((s) => s.removeToast);
  const toasts = useUIStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div
      className="
        fixed bottom-5 right-5
        z-1000
        flex flex-col gap-2.5
        pointer-events-none
      "
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto
            flex items-start justify-between gap-2.5
            px-[7px] py-[4px]
            rounded-[3px]
            text-white
            shadow-[0_6px_18px_rgba(0,0,0,0.12)]
            border-l-4 border-white/10
            opacity-0 translate-x-[12px]
            animate-[toast-in_260ms_ease_forwards]
            ${
              toast.type === "success"
                ? "bg-(--success) border-l-green-700"
                : toast.type === "error"
                  ? "bg-(--error) border-l-red-700"
                  : "bg-(--info) border-l-sky-600"
            }
            ${toast.leaving ? "animate-[toast-out_220ms_ease_forwards]" : ""}
          `}
        >
          {/* message */}
          <div className="max-w-[260px] text-sm overflow-hidden">
            <span>{toast.message}</span>
          </div>

          {/* close */}
          <button
            onClick={() => removeToast(toast.id)}
            className="
              bg-white/25
              text-white/90
              cursor-pointer
              text-sm
              p-1
              leading-none
              rounded
              opacity-90
              hover:bg-white/50
              hover:opacity-100
            "
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
