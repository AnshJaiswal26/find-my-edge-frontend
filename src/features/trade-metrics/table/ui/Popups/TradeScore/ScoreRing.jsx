import { TAG_CONFIG } from "./tagConfig";
import { useEffect, useState } from "react";

export function ScoreRing({ score, tag }) {
  const [displayed, setDisplayed] = useState(0);
  const [animated, setAnimated] = useState(false);

  const R = 60,
    STROKE = 7;
  const circumference = 2 * Math.PI * R;
  const tagCfg = TAG_CONFIG[tag] || TAG_CONFIG.GOOD;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimated(true);
      let start = null;
      const duration = 900;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplayed(Math.round(eased * score));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 200);
    return () => clearTimeout(timeout);
  }, [score]);

  const progress = animated ? (displayed / 100) * circumference : 0;

  return (
    <div className="relative w-[130px] h-[130px] flex items-center justify-center">
      <svg
        width={130}
        height={130}
        viewBox="0 0 130 130"
        style={{ overflow: "visible" }}
      >
        <circle
          cx={65}
          cy={65}
          r={R}
          fill="none"
          stroke="var(--border)"
          strokeWidth={STROKE}
        />
        <defs>
          <filter id="ringGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={65}
          cy={65}
          r={R}
          fill="none"
          stroke={tagCfg.hex}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform="rotate(-90 65 65)"
          filter="url(#ringGlow)"
          style={{ transition: "stroke 0.3s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span
          className="text-3xl font-bold leading-none tabular-nums tracking-tight"
          style={{ color: tagCfg.color }}
        >
          {displayed}
        </span>
        <span
          className="text-[11px] font-medium"
          style={{ color: "var(--text-disabled)" }}
        >
          / 100
        </span>
        <span
          className="mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
          style={{
            color: tagCfg.color,
            background: tagCfg.bg,
            boxShadow: `0 0 12px ${tagCfg.glowHex}`,
          }}
        >
          {tagCfg.label}
        </span>
      </div>
    </div>
  );
}
