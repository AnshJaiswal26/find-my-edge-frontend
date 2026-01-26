import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { RgbaStringColorPicker } from "react-colorful";
import { RefreshCcw, ArrowLeftRight, Copy, CopyCheck } from "lucide-react";

import { Button } from "./Buttons";
import Input from "./Input/Input";
import { useUIStore } from "@stores";
import { resolveCssColor, rgbaToHex } from "@utils";

/* ---------- utils ---------- */
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
  /* ---------- ids ---------- */
  const pickerId = useId();
  const triggerId = `${pickerId}-trigger`;
  const paletteId = `${pickerId}-palette`;

  /* ---------- store ---------- */
  const activeColorPicker = useUIStore((s) => s.activeColorPicker);
  const setColorPicker = useUIStore((s) => s.setColorPicker);
  const addRecentColor = useUIStore((s) => s.addRecentColor);
  const recentColors = useUIStore((s) => s.recentColors);

  const active = activeColorPicker?.id === pickerId;

  /* ---------- refs ---------- */
  const triggerRef = useRef(null);
  const lastCommittedRef = useRef(null);
  const wasActiveRef = useRef(false);

  /* ---------- derived value ---------- */
  const resolvedValue = useMemo(() => resolveCssColor(value), [value]);

  /* ---------- local state ---------- */
  const [color, setColor] = useState(resolvedValue);
  const [dirty, setDirty] = useState(false);
  const [format, setFormat] = useState("hex");
  const [input, setInput] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [pos, setPos] = useState({});

  /* ---------- helpers ---------- */
  const markCommitted = useCallback((next) => {
    lastCommittedRef.current = next;
  }, []);

  const closePicker = useCallback(() => {
    setColorPicker(null);
  }, [setColorPicker]);

  /* ---------- sync on open ---------- */
  useLayoutEffect(() => {
    setColor(resolvedValue);

    if (!active) return;

    setInput(format === "hex" ? rgbaToHex(resolvedValue) : resolvedValue);
    setDirty(false);
  }, [active, resolvedValue, format]);

  /* ---------- picker position ---------- */
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

  /* ---------- commit on pointer up ---------- */
  useEffect(() => {
    if (!active || !dirty) return;

    const handlePointerUp = () => {
      onCommit?.(color);
      markCommitted(color);
      setDirty(false);
    };

    document.addEventListener("pointerup", handlePointerUp);
    return () => document.removeEventListener("pointerup", handlePointerUp);
  }, [active, dirty, color, onCommit, markCommitted]);

  /* ---------- detect picker close (LFU commit) ---------- */
  useLayoutEffect(() => {
    if (wasActiveRef.current && !active) {
      if (lastCommittedRef.current) {
        addRecentColor(lastCommittedRef.current);
        lastCommittedRef.current = null;
      }
    }
    wasActiveRef.current = active;
  }, [active, addRecentColor]);

  /* ---------- handlers ---------- */
  const handleColorChange = useCallback(
    (next) => {
      setColor(next);
      setDirty(true);
      onChange?.(next);
      setInput(format === "hex" ? rgbaToHex(next) : next);
    },
    [format, onChange],
  );

  const handleInputChange = useCallback(
    (e) => {
      const resolved = normalizeInputColor(e.target.value);

      if (resolved) {
        setColor(resolved);
        onCommit?.(resolved);
        markCommitted(resolved);
      }

      setInput(e.target.value);
    },
    [onCommit, markCommitted],
  );

  const commitColor = useCallback(
    (next) => {
      setColor(next);
      onChange?.(next);
      onCommit?.(next);
      markCommitted(next);
      setDirty(false);
      setInput(format === "hex" ? rgbaToHex(next) : next);
    },
    [format, onChange, onCommit, markCommitted],
  );

  const handleReset = useCallback(() => {
    const resolved = resolveCssColor(resetColor);
    commitColor(resolved);
    closePicker();
  }, [resetColor, commitColor, closePicker]);

  /* ---------- ui ---------- */
  const CopyIcon = isCopied ? CopyCheck : Copy;

  return (
    <div className="inline-flex items-center gap-2 border border-(--border) px-2 py-1 rounded w-fit">
      <button
        id={triggerId}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() =>
          active
            ? closePicker()
            : setColorPicker({ id: pickerId, triggerId, paletteId })
        }
        className="w-5 h-5 rounded border border-(--border)"
        style={{ backgroundColor: color }}
      />

      <span className="text-xs">{label}</span>

      {reset && (
        <Button.Icon
          onClick={handleReset}
          data-tooltip="Reset Color"
          data-tooltip-position="right"
        >
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
                  onClick={() =>
                    setFormat((f) => (f === "hex" ? "rgba" : "hex"))
                  }
                >
                  <ArrowLeftRight size={12} />
                </Button.Icon>
              </div>

              <div className="relative">
                <Input
                  vertical
                  size="sm"
                  value={input}
                  onChange={handleInputChange}
                />
                <CopyIcon
                  size={25}
                  className="absolute top-1 right-1 hover:bg-(--hover) p-1 rounded"
                  onClick={() => {
                    setIsCopied(true);
                    navigator.clipboard.writeText(input);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                />
              </div>
            </div>

            {recentColors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {recentColors.map(({ color }) => (
                  <button
                    key={color}
                    type="button"
                    className="w-4.5 h-4.5 rounded border border-(--border)"
                    style={{ backgroundColor: color }}
                    onClick={() => commitColor(color)}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
