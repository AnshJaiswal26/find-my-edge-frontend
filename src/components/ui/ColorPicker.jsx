import { IconButton } from "./Buttons";
import { useResolvedValue } from "@hooks";
import { parseColor } from "@utils";
import { RefreshCcw } from "lucide-react";

export default function ColorPicker({
  label,
  onChange,
  disable = false,
  value,
  resetColor,
  store,
}) {
  const isDisable = useResolvedValue(store, disable);
  const color = useResolvedValue(store, value);

  return (
    <div
      className={`
        relative
        flex items-center gap-2
        p-0.5 pl-2
        rounded-[4px]
        w-fit
        border border-(--border)
        ${isDisable ? "pointer-events-none opacity-40" : ""}
      `}
    >
      {/* Color indicator */}
      <span
        className="w-[0.85rem] h-[0.85rem] rounded-full"
        style={{ background: color }}
      />

      {/* Hidden color input */}
      <input
        type="color"
        value={parseColor(color)}
        onChange={(e) => onChange?.(e.target.value)}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
      />

      {/* Label */}
      <span className="text-[0.85rem]">{label}</span>

      {/* Reset */}
      <IconButton
        icon={<RefreshCcw className="w-[0.85rem] h-[0.85rem]" />}
        tooltip={{ title: "Reset", position: "top" }}
        className="p-0"
        onClick={() => onChange?.(resetColor)}
      />
    </div>
  );
}
