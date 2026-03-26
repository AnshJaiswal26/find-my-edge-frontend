import { useEffect, useState } from "react";
import { TAG_CONFIG } from "./tagConfig";

export function RulesBar({ matched, total, tag }) {
  const [width, setWidth] = useState(0);
  const pct = total > 0 ? (matched / total) * 100 : 0;
  const cfg = TAG_CONFIG[tag] || TAG_CONFIG.GOOD;

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 300);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-baseline">
        <span
          className="text-xs font-medium tracking-wide"
          style={{ color: "var(--text-muted)" }}
        >
          Rules matched
        </span>
        <span
          className="text-lg font-bold leading-none tabular-nums"
          style={{ color: cfg.color }}
        >
          {matched}{" "}
          <span
            className="text-sm font-medium"
            style={{ color: "var(--text-disabled)" }}
          >
            / {total}
          </span>
        </span>
      </div>
      <div
        className="relative h-1.5 rounded-full overflow-visible"
        style={{ background: "var(--border-muted)" }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full min-w-[6px]"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${cfg.hex}cc, ${cfg.hex})`,
            boxShadow: `0 0 10px ${cfg.hex}66`,
            transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        />
        {[25, 50, 75].map((t) => (
          <div
            key={t}
            className="absolute top-1/2 -translate-y-1/2 w-px h-2.5 rounded-sm"
            style={{ left: `${t}%`, background: "var(--text-muted)" }}
          />
        ))}
      </div>
    </div>
  );
}
