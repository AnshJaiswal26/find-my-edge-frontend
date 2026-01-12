import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RgbaStringColorPicker } from "react-colorful";
import { RefreshCcw, ArrowLeftRight, Copy } from "lucide-react";
import { Button } from "./Buttons";
import { createPortal } from "react-dom";
import { useUIStore } from "@stores";
import { resolveCssColor, rgbaToHex } from "@utils";
import Input from "./Input";

function normalizeInputColor(input) {
  try {
    return resolveCssColor(input);
  } catch {
    return null;
  }
}

/* ---------- component ---------- */
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

  const activeColorPicker = useUIStore((s) => s.activeColorPicker);
  const setColorPicker = useUIStore((s) => s.setColorPicker);
  const active = activeColorPicker?.id === pickerId;

  const triggerRef = useRef(null);

  /* ---------- single source of truth ---------- */
  const resolvedValue = useMemo(() => resolveCssColor(value), [value]);

  const [color, setColor] = useState(resolvedValue);
  const [dirty, setDirty] = useState(false);
  const [format, setFormat] = useState("hex");
  const [input, setInput] = useState("");

  /* ---------- sync ONLY when picker opens ---------- */
  useLayoutEffect(() => {
    setColor(resolvedValue);

    if (!active) return;
    setInput(format === "hex" ? rgbaToHex(resolvedValue) : resolvedValue);
    setDirty(false);
  }, [active, resolvedValue, format]);

  /* ---------- commit on pointer up ---------- */
  useEffect(() => {
    if (!active || !dirty) return;

    const handlePointerUp = () => {
      onCommit?.(color);
      setDirty(false);
    };

    document.addEventListener("pointerup", handlePointerUp);
    return () => document.removeEventListener("pointerup", handlePointerUp);
  }, [active, dirty, color, onCommit]);

  /* ---------- position ---------- */
  const [pos, setPos] = useState({});

  useLayoutEffect(() => {
    if (!active || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    setPos({
      top: spaceBelow >= spaceAbove ? rect.bottom + 6 : undefined,
      bottom:
        spaceBelow < spaceAbove ? viewportHeight - rect.top + 6 : undefined,
      left: rect.left,
    });
  }, [active]);

  /* ---------- handlers ---------- */
  const handleColorChange = (next) => {
    setColor(next);
    setDirty(true);
    onChange?.(next);
    setInput(format === "hex" ? rgbaToHex(next) : next);
  };

  const handleInputChange = (e) => {
    const resolved = normalizeInputColor(e.target.value);
    if (resolved) {
      setColor(resolved);
      onCommit?.(resolved);
    }
    setInput(e.target.value);
  };

  const commitColor = (next) => {
    setColor(next);
    onChange?.(next);
    onCommit?.(next);
    setDirty(false);
    setInput(format === "hex" ? rgbaToHex(next) : next);
  };

  const handleReset = () => {
    const resolved = resolveCssColor(resetColor);
    commitColor(resolved);
    setColorPicker(null);
  };

  return (
    <div className="inline-flex items-center gap-2 border border-(--border) px-2 py-1 rounded w-fit">
      <button
        id={triggerId}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setColorPicker({ id: pickerId, triggerId, paletteId })}
        className="w-5 h-5 rounded border border-(--border)"
        style={{ backgroundColor: color }}
      />

      <span className="text-xs">{label}</span>

      {reset && (
        <Button.Icon onClick={handleReset}>
          <RefreshCcw size={14} />
        </Button.Icon>
      )}

      {active &&
        createPortal(
          <div
            id={paletteId}
            style={pos}
            className="fixed space-y-2 z-9999 text-(--text) w-64 rounded-xl border border-(--border) bg-(--surface) shadow-xl p-3"
          >
            <RgbaStringColorPicker
              color={color}
              onChange={handleColorChange}
              className="!w-full"
            />

            <div className="flex items-center gap-2 text-xs">
              <div className="flex justify-between gap-2 items-center">
                <span>{format.toUpperCase()}</span>
                <Button.Icon
                  onClick={() => {
                    setFormat((f) => (f === "hex" ? "rgba" : "hex"));
                  }}
                >
                  <ArrowLeftRight size={12} />
                </Button.Icon>
              </div>

              <Input
                vertical
                size="sm"
                value={input}
                onChange={handleInputChange}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
