import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RgbaStringColorPicker } from "react-colorful";
import { RefreshCcw } from "lucide-react";
import { Button } from "./Buttons";
import { createPortal } from "react-dom";
import { useUIStore } from "@stores";

/* -------- resolve CSS vars -------- */
/* ---------- helpers ---------- */

function hexToRgba(hex) {
  let h = hex.replace("#", "").trim();

  // #RGB
  if (h.length === 3) {
    h =
      h
        .split("")
        .map((c) => c + c)
        .join("") + "ff";
  }

  // #RRGGBB
  if (h.length === 6) {
    h += "ff";
  }

  // #RRGGBBAA
  if (h.length !== 8) return null;

  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const a = parseInt(h.slice(6, 8), 16) / 255;

  return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(3))})`;
}

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;

  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  };
}

function parseHsl(color) {
  const m = color.match(
    /hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%\s*(?:[\/,]\s*([\d.]+))?\s*\)/
  );

  if (!m) return null;

  const h = Number(m[1]);
  const s = Number(m[2]);
  const l = Number(m[3]);
  const a = m[4] !== undefined ? Number(m[4]) : 1;

  const { r, g, b } = hslToRgb(h, s, l);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/* ---------- main resolver ---------- */

export function resolveCssColor(color) {
  if (!color) return "rgba(0,0,0,1)";

  /* already safe */
  if (color.startsWith("rgba") || color.startsWith("rgb")) {
    return color;
  }

  /* hex */
  if (color.startsWith("#")) {
    return hexToRgba(color) ?? "rgba(0,0,0,1)";
  }

  /* CSS variable */
  if (color.startsWith("var(")) {
    const varName = color.slice(4, -1).trim();
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    console.log(raw, varName);

    if (!raw) return "rgba(0,0,0,1)";
    return resolveCssColor(raw); // recurse
  }

  /* hsl / hsla */
  if (color.startsWith("hsl")) {
    return parseHsl(color) ?? "rgba(0,0,0,1)";
  }

  /* named colors */
  return color;
}

export default function ColorPicker({
  label,
  value,
  onChange,
  onCommit,
  resetColor,
  disabled = false,
  reset = true,
}) {
  const pickerId = useId();
  const triggerId = `${pickerId}-trigger`;
  const paletteId = `${pickerId}-palette`;

  /* ---------- UI store ---------- */
  const activeColorPicker = useUIStore((s) => s.activeColorPicker);
  const setColorPicker = useUIStore((s) => s.setColorPicker);
  const active = activeColorPicker?.id === pickerId;

  const triggerRef = useRef(null);

  console.log("incoming picker value:", value);

  /* ---------- source of truth (RGBA string) ---------- */
  const resolvedValue = useMemo(() => resolveCssColor(value), [value]);
  const [color, setColor] = useState(resolvedValue);

  /* ---------- sync when opened / value changes ---------- */
  useEffect(() => {
    if (!active) return;
    setColor(resolvedValue);
  }, [active, resolvedValue]);

  /* ---------- positioning ---------- */
  const [pos, setPos] = useState({});

  useLayoutEffect(() => {
    if (!active || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openDown = spaceBelow >= 300 || spaceBelow >= spaceAbove;

    setPos({
      top: openDown ? rect.bottom + 6 : undefined,
      bottom: openDown ? undefined : viewportHeight - rect.top + 6,
      left: rect.left,
    });
  }, [active]);

  console.log(color);

  /* ---------- handlers ---------- */
  const handleChange = (next) => {
    console.log("picker emitted:", next);
    setColor(next);
    onChange?.(next);
  };

  const handleCommit = () => {
    console.log("committing color:", color);
    onCommit?.(color);
    setColorPicker(null);
  };

  const handleReset = () => {
    const resolved = resolveCssColor(resetColor);
    setColor(resolved);
    onChange?.(resolved);
    onCommit?.(resolved);
    setColorPicker(null);
  };

  /* ---------- render ---------- */
  return (
    <div className="inline-flex items-center gap-2 border border-(--border) px-2 py-1 rounded w-fit">
      {/* TRIGGER */}
      <button
        id={triggerId}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setColorPicker({ id: pickerId, triggerId, paletteId })}
        className="w-5 h-5 rounded border border-(--border)"
        style={{ backgroundColor: color }}
        title={label}
      />

      <span className="text-xs">{label}</span>

      {reset && (
        <Button.Icon
          tooltip={{ text: "Reset", position: "top" }}
          onClick={handleReset}
        >
          <RefreshCcw size={14} />
        </Button.Icon>
      )}

      {/* OVERLAY */}
      {active &&
        createPortal(
          <div
            id={paletteId}
            style={pos}
            className="fixed z-9999 w-64 rounded-xl border border-(--border) bg-(--surface) shadow-xl p-3"
          >
            <RgbaStringColorPicker color={color} onChange={handleChange} />

            <div className="flex justify-end mt-2">
              <button
                className="text-xs px-2 py-1 rounded bg-(--info) text-white"
                onClick={handleCommit}
              >
                Done
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
