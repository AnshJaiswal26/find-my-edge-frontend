import { useState } from "react";

/* helpers */

const pad = (n) => String(n).padStart(2, "0");

const toParts = (str = "00:00:00:00") => str.split(":");

const format = (parts) => parts.map((p) => pad(parseInt(p || 0))).join(":");

const normalize = (parts) => {
  let [d, h, m, s] = parts.map((v) => parseInt(v || 0));

  /* handle borrow */

  if (s < 0) {
    m -= 1;
    s += 60;
  }

  if (m < 0) {
    h -= 1;
    m += 60;
  }

  if (h < 0) {
    d -= 1;
    h += 24;
  }

  /* handle overflow */

  if (s >= 60) {
    m += Math.floor(s / 60);
    s %= 60;
  }

  if (m >= 60) {
    h += Math.floor(m / 60);
    m %= 60;
  }

  if (h >= 24) {
    d += Math.floor(h / 24);
    h %= 24;
  }

  /* clamp days */

  d = Math.max(0, d);

  return [d, h, m, s].map(String);
};

export default function useDurationInput(value, onChange, inputRefs) {
  const [parts, setParts] = useState(toParts(value || "00:00:00:00"));

  const updatePart = (index, val, e) => {
    const clean = val.replace(/\D/g, "").slice(0, 2);

    const nextParts = [...parts];
    nextParts[index] = clean;

    setParts(nextParts);

    /* normalize only if overflow possible */
    if (parseInt(clean) >= 60 || index === 1) {
      const normalized = normalize(nextParts);
      setParts(normalized);
      onChange?.(format(normalized), e);
    } else {
      onChange?.(format(nextParts), e);
    }

    /* auto jump when typing full value */
    const input = e.target;

    if (clean.length === 2 && input.selectionStart === input.value.length) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleArrow = (index, e) => {
    const input = e.target;

    /* horizontal navigation */

    if (e.key === "ArrowLeft" && input.selectionStart === 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
      return;
    }

    if (e.key === "ArrowRight" && input.selectionStart === input.value.length) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
      return;
    }

    /* vertical increment */

    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;

    e.preventDefault();

    const delta = e.key === "ArrowUp" ? 1 : -1;

    const nextParts = [...parts];
    const num = (+nextParts[index] || 0) + delta;

    nextParts[index] = String(num);

    const normalized = normalize(nextParts);

    setParts(normalized);
    onChange?.(format(normalized), e);
  };

  return {
    parts,
    updatePart,
    handleArrow,
  };
}
