import { useMemo } from "react";

/* ---------------- HELPERS ---------------- */

const pad = (n) => n.toString().padStart(2, "0");

const toParts = (str = "00:00:00:00") => {
  const [d = "00", h = "00", m = "00", s = "00"] = str.split(":");
  return {
    d: parseInt(d) || 0,
    h: parseInt(h) || 0,
    m: parseInt(m) || 0,
    s: parseInt(s) || 0,
  };
};

const fromParts = ({ d, h, m, s }) => `${pad(d)}:${pad(h)}:${pad(m)}:${pad(s)}`;

const toSeconds = ({ d, h, m, s }) => d * 86400 + h * 3600 + m * 60 + s;

const fromSeconds = (total) => {
  total = Math.max(0, total);

  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  return { d, h, m, s };
};

/* ---------------- HOOK ---------------- */

export default function useDurationInput(value, onChange) {
  const safeValue = value && value.length ? value : "00:00:00:00";

  const parts = useMemo(() => safeValue.split(":"), [safeValue]);

  /* update single segment */

  const updatePart = (index, val, e) => {
    const clean = val.replace(/\D/g, "").slice(0, 2).padStart(2, "0");

    const newParts = [...parts];
    newParts[index] = clean;

    onChange(newParts.join(":"), e);
  };

  /* arrow carry logic (same as before) */

  const handleArrow = (index, e) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;

    e.preventDefault();

    const dir = e.key === "ArrowUp" ? 1 : -1;

    const delta =
      index === 0 ? 86400 : index === 1 ? 3600 : index === 2 ? 60 : 1;

    const total = toSeconds(toParts(safeValue)) + dir * delta;

    const newParts = fromSeconds(total);

    const newValue = fromParts(newParts);

    onChange(newValue, e);
  };

  return {
    value: safeValue,
    parts,
    updatePart,
    handleArrow,
  };
}
