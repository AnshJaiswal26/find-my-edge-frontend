import { Loader2, LineChart } from "lucide-react";

export default function Loader({ size = 90, className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center h-screen gap-6 ${className}`}>
      {/* Animated Chart Icon */}
      <div className="relative flex items-center justify-center">
        <Loader2
          size={size}
          className="absolute animate-spin"
          color="var(--hover)"
        />

        <LineChart size={size * 0.5} color="var(--text)" />
      </div>

      {/* Trading Bars Animation */}
      <div className="flex items-end gap-1 h-10">
        <span className="w-3 bg-(--success) animate-bar1 rounded"></span>
        <span className="w-3 bg-(--error) animate-bar2 rounded"></span>
        <span className="w-3 bg-(--success) animate-bar3 rounded"></span>
      </div>

      {/* App Message */}
      <p className="text-sm text-(--text-muted) font-bold tracking-wide">
        Finding your trading edge...
      </p>
    </div>
  );
}
