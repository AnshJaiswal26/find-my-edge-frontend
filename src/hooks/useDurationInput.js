import { useRef } from "react";

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

/* convert to seconds for carry */
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
  const inputRef = useRef(null);

  const safeValue = value && value.length ? value : "00:00:00:00";

  /* -------- CHANGE -------- */
  const handleChange = (e) => {
    const input = e.target;
    const cursor = input.selectionStart;
    const raw = input.value;

    const parts = safeValue.split(":");

    // detect segment index
    const index = cursor <= 2 ? 0 : cursor <= 5 ? 1 : cursor <= 8 ? 2 : 3;

    // extract digits only from current segment typing
    const segmentStart = index * 3;
    const segmentRaw = raw.slice(segmentStart, segmentStart + 2);

    const clean = segmentRaw.replace(/\D/g, "").slice(0, 2);

    // preserve previous value if empty (important 🔥)
    if (clean.length === 0) {
      parts[index] = "00";
    } else if (clean.length === 1) {
      parts[index] = "0" + clean;
    } else {
      parts[index] = clean;
    }

    const formatted = parts.join(":");

    onChange(formatted, e);

    requestAnimationFrame(() => {
      let newPos = cursor;

      // prevent jumping over colon incorrectly
      if ([2, 5, 8].includes(cursor)) {
        newPos = cursor;
      }

      inputRef.current?.setSelectionRange(newPos, newPos);
    });
  };

  /* -------- ARROWS WITH CARRY -------- */
  const handleKeyDown = (e) => {
    const input = inputRef.current;
    if (!input) return;

    const cursor = input.selectionStart ?? 0;
    const parts = safeValue.split(":");

    const index = cursor <= 2 ? 0 : cursor <= 5 ? 1 : cursor <= 8 ? 2 : 3;

    const segmentStart = index * 3;
    const segment = parts[index].split("");

    let pos = cursor - segmentStart;
    pos = Math.max(0, Math.min(1, pos));

    /* ---------------- DIGIT INPUT ---------------- */
    if (/^\d$/.test(e.key)) {
      e.preventDefault();

      let newSegment;

      if (pos === 0) {
        // insert at start
        newSegment = e.key + segment[0];
      } else {
        // insert at end or middle
        newSegment = segment[0] + e.key;
      }

      // keep only 2 digits
      newSegment = newSegment.slice(0, 2);

      parts[index] = newSegment;

      const newValue = parts.join(":");
      onChange(newValue, e);

      const newPos = Math.min(segmentStart + pos + 1, segmentStart + 2);

      requestAnimationFrame(() => {
        input.setSelectionRange(newPos, newPos);
      });

      return;
    }

    /* ---------------- BACKSPACE ---------------- */
    if (e.key === "Backspace") {
      e.preventDefault();

      let deletePos = cursor - 1 - segmentStart;
      deletePos = Math.max(0, Math.min(1, deletePos));

      // ✅ segment is already array
      const chars = [...segment];

      if (deletePos === 0) {
        chars[0] = chars[1];
        chars[1] = "0";
      } else {
        chars[1] = "0";
      }

      parts[index] = chars.join("");

      const newValue = parts.join(":");
      onChange(newValue, e);

      const newPos = Math.max(cursor - 1, segmentStart);

      requestAnimationFrame(() => {
        input.setSelectionRange(newPos, newPos);
      });

      return;
    }

    /* ---------------- ARROWS (KEEP YOUR LOGIC) ---------------- */
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();

      const dir = e.key === "ArrowUp" ? 1 : -1;

      const delta =
        index === 0 ? 86400 : index === 1 ? 3600 : index === 2 ? 60 : 1;

      const total = toSeconds(toParts(safeValue)) + dir * delta;

      const newParts = fromSeconds(total);
      const newValue = fromParts(newParts);

      onChange(newValue, e);

      requestAnimationFrame(() => {
        input.setSelectionRange(cursor, cursor);
      });
    }
  };

  return {
    ref: inputRef,
    value: safeValue, // 🔥 always non-empty
    onChange: handleChange,
    onKeyDown: handleKeyDown,
  };
}
