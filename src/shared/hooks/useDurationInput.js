import { useEffect, useMemo, useState } from "react";

/* helpers */

const pad = (n) => n.toString().padStart(2, "0");

const toParts = (str = "00:00:00:00") => str.split(":");

const fromParts = (parts) => parts.map((p) => pad(parseInt(p || 0))).join(":");

export default function useDurationInput(value, onChange) {
  const safeValue = value || "00:00:00:00";

  const [parts, setParts] = useState(toParts(safeValue));

  /* sync when external value changes */
  useEffect(() => {
    setParts(toParts(safeValue));
  }, [safeValue]);

  const updatePart = (index, val, e) => {
    const clean = val.replace(/\D/g, "").slice(0, 2);

    const newParts = [...parts];
    newParts[index] = clean;

    setParts(newParts);

    const formatted = fromParts(newParts);

    onChange?.(formatted, e);

    /* auto move cursor */
    if (clean.length === 2) {
      const next = e.target
        .closest("div")
        ?.nextElementSibling?.querySelector("input");

      next?.focus();
    }
  };

  const handleArrow = (index, e) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;

    e.preventDefault();

    const delta = e.key === "ArrowUp" ? 1 : -1;

    const newParts = [...parts];

    let num = parseInt(newParts[index] || "0");

    num = Math.max(0, num + delta);

    newParts[index] = String(num).slice(0, 2);

    setParts(newParts);

    onChange?.(fromParts(newParts), e);
  };

  return {
    parts,
    updatePart,
    handleArrow,
  };
}
