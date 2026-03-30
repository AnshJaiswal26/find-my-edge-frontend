import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { RgbaStringColorPicker } from "react-colorful";
import { ArrowLeftRight, Copy, CopyCheck } from "lucide-react";

import { Button, Input } from "@shared/components/ui";
import { useUIStore } from "@shared/stores";
import { resolveCssColor, rgbaToHex } from "@shared/utils";
import { useFloatingPosition, useGlobalEvents } from "@shared/hooks";

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
  disabled = false,
}) {
  /* ---------- ids ---------- */

  const [active, setActive] = useState(false);

  /* ---------- store ---------- */
  const addRecentColor = useUIStore((s) => s.addRecentColor);

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

  /* ---------- helpers ---------- */
  const markCommitted = (next) => {
    lastCommittedRef.current = next;
  };

  /* ---------- sync on open ---------- */
  useLayoutEffect(() => {
    setColor(resolvedValue);

    if (!active) return;

    setInput(format === "hex" ? rgbaToHex(resolvedValue) : resolvedValue);
    setDirty(false);
  }, [active, resolvedValue, format]);

  // /* ---------- picker position ---------- */
  // useLayoutEffect(() => {
  //   if (!active || !triggerRef.current) return;
  //
  //   const rect = triggerRef.current.getBoundingClientRect();
  //   const viewportHeight = window.innerHeight;
  //   const spaceBelow = viewportHeight - rect.bottom;
  //   const spaceAbove = rect.top;
  //
  //   setPos({
  //     top: spaceBelow >= spaceAbove ? rect.bottom + 6 : undefined,
  //     bottom:
  //       spaceBelow < spaceAbove ? viewportHeight - rect.top + 6 : undefined,
  //     left: rect.left,
  //   });
  // }, [active]);

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
    (v) => {
      const resolved = normalizeInputColor(v);

      if (resolved) {
        setColor(resolved);
        onCommit?.(resolved);
        markCommitted(resolved);
      }

      setInput(v);
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

  return (
    <div
      className="inline-flex items-center gap-2 border border-(--border) px-2 py-1 rounded w-fit"
      ref={triggerRef}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setActive((p) => !p)}
        className="w-5 h-5 rounded border border-(--border)"
        style={{ backgroundColor: color }}
      />

      <span className="text-xs">{label}</span>

      {active &&
        createPortal(
          <Picker
            handleColorChange={handleColorChange}
            triggerRef={triggerRef}
            setActive={setActive}
            format={format}
            setFormat={setFormat}
            handleInputChange={handleInputChange}
            commitColor={commitColor}
            input={input}
            color={color}
          />,
          document.body,
        )}
    </div>
  );
}

function Picker({
  format,
  setFormat,
  handleInputChange,
  handleColorChange,
  triggerRef,
  setActive,
  commitColor,
  input,
  color,
}) {
  const pickerRef = useRef(null);

  const [isCopied, setIsCopied] = useState(false);
  const recentColors = useUIStore((s) => s.recentColors);

  const CopyIcon = isCopied ? CopyCheck : Copy;

  const options = useMemo(
    () => ({
      preferred: "bottom",
      axis: "both",
      shift: false,
      arrow: {
        show: true,
        style: {
          backgroundColor: "var(--surface)",
        },
      },
      observeResize: true,
    }),
    [],
  );

  useFloatingPosition(triggerRef, pickerRef, options);

  const events = useMemo(
    () => ["pointerdown", "resize", "scroll", "visibilitychange"],
    [],
  );

  useGlobalEvents(events, (e) => {
    const target = e.target;
    if (target.nodeType === Node.ELEMENT_NODE) {
      if (
        triggerRef.current?.contains?.(target) ||
        pickerRef.current?.contains?.(target)
      )
        return;
    }
    setActive(false);
  });

  return (
    <div
      ref={pickerRef}
      className="
        fixed space-y-2
        z-9999
        text-(--text) w-64
        rounded-xl border border-(--border)
        bg-(--surface) shadow-xl p-3 box-border"
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
            onClick={() => setFormat((f) => (f === "hex" ? "rgba" : "hex"))}
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
            className="absolute top-[50%] -translate-y-1/2 right-1 hover:bg-(--hover) p-1 rounded"
            onClick={async () => {
              setIsCopied(true);
              if (!isCopied) await navigator.clipboard.writeText(input);
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
    </div>
  );
}
