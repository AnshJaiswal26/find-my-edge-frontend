import {
  FUNCTION_REGISTRY,
  FUNCTION_ALLOW_BY_MODE,
} from "@lib/analytics/engine/functions";
import { ChevronDown } from "lucide-react";
import React, { useMemo, useState } from "react";

const GROUP_LABELS = {
  BASE: "🧮 Row Functions",
  WINDOW: "📈 Rolling Window Functions",
  RATIO: "⚖️ Trading Ratio Functions",
  GLOBAL: "🌍 Global Aggregate Functions",
  CONDITION: "🔀 Conditional Functions",
};

export function FunctionDocsPanel({ mode = "ALL" }) {
  const [openGroup, setOpenGroup] = useState(null);
  const [openRef, setOpenRef] = useState(false);

  const grouped = useMemo(() => {
    const map = {};

    console.log(mode);

    // Decide which function names are allowed
    const allowedNames =
      mode === "ALL"
        ? Object.keys(FUNCTION_REGISTRY)
        : Array.from(FUNCTION_ALLOW_BY_MODE[mode] || []);

    for (const name of allowedNames) {
      const def = FUNCTION_REGISTRY[name];
      if (!def) continue;

      const key = def.type || "OTHER"; // BASE / WINDOW / GLOBAL / etc.
      if (!map[key]) map[key] = [];
      map[key].push({ name, ...def });
    }

    return map;
  }, [mode]);

  return (
    <div className="border border-(--border) rounded-lg bg-(--surface-disabled) text-sm">
      <div
        className="p-3 font-semibold flex justify-between items-center select-none"
        onClick={() => setOpenRef((p) => !p)}
      >
        <span>{mode !== "ALL" ? "Allowed" : ""} Function Reference</span>
        <ChevronDown
          size={16}
          className={`transition-all duration-300 ${openRef ? "rotate-180" : ""}`}
        />
      </div>

      {openRef &&
        Object.entries(grouped).map(([type, list]) => (
          <div key={type} className="border-t border-(--border)">
            <button
              onClick={() => setOpenGroup(openGroup === type ? null : type)}
              className="w-full text-left px-3 py-2 font-medium hover:bg-(--hover) flex justify-between items-center"
            >
              <span>
                {GROUP_LABELS[type] || type} ({list.length})
              </span>
              <ChevronDown
                size={14}
                className={`transition-all duration-300 ${openGroup === type ? "rotate-180" : ""}`}
              />
            </button>

            {openGroup === type && (
              <div className="px-4 pb-3 space-y-2 border border-(--border)">
                {list.map((fn) => (
                  <div
                    key={fn.name}
                    className="p-2 rounded bg-(--surface-disabled) border-t border-(--border) first:border-0"
                  >
                    <div className="font-mono text-(--info)">
                      {fn.signature || `${fn.name}(${fn.arity} args)`}
                    </div>
                    <div className="text-(--text-muted)">{fn.description}</div>

                    {fn.argTypes && (
                      <div className="mt-1 text-xs text-(--text-muted)">
                        Args: {fn.argTypes.join(", ")} → Returns:{" "}
                        {fn.returnType || "any"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
