import { useEffect, useState } from "react";
import { Button } from "./Buttons";
import { RefreshCcw } from "lucide-react";

export default function ColorPicker({
  label,
  value,
  onChange,
  onCommit,
  resetColor,
  disabled = false,
  reset = true,
}) {
  const isCommitMode = typeof onCommit === "function";
  const [local, setLocal] = useState(value);

  // sync external → local draft
  useEffect(() => {
    if (isCommitMode) setLocal(value);
  }, [value, isCommitMode]);

  const displayColor = isCommitMode ? local : value;

  return (
    <div
      className={`
        relative
        flex items-center gap-2
        p-0.5 pl-2
        rounded-[4px]
        w-fit
        min-h-8
        border border-(--border)
        ${disabled ? "pointer-events-none opacity-40" : ""}
      `}
    >
      {/* Color indicator */}
      <span
        className="w-[0.85rem] h-[0.85rem] rounded-full"
        style={{ background: displayColor }}
      />

      {/* Hidden color input */}
      <input
        type="color"
        value={displayColor}
        onChange={(e) => {
          const next = e.target.value;

          if (isCommitMode) {
            setLocal(next);
            onChange?.(next); // optional live preview
          } else {
            onChange?.(next);
          }
        }}
        onBlur={() => {
          if (isCommitMode) onCommit(local);
        }}
        onPointerUp={() => {
          if (isCommitMode) onCommit(local);
        }}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
      />

      {/* Label */}
      <span className="text-[0.85rem]">{label}</span>

      {reset && (
        <Button.Icon
          tooltip={{ text: "Reset", position: "top" }}
          onClick={() => {
            if (isCommitMode) {
              setLocal(resetColor);
              onCommit(resetColor);
            } else {
              onChange?.(resetColor);
            }
          }}
        >
          <RefreshCcw size={16} />
        </Button.Icon>
      )}
    </div>
  );
}
