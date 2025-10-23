import { Legend } from "@layout";
import { ToggleButton } from "../Buttons";
import { useResolvedValue } from "@hooks";

export default function ColorPicker({
  label,
  onChange,
  onToggle,
  disable = false,
  value,
  store,
}) {
  const isEnable = useResolvedValue(store, disable);
  const color = useResolvedValue(store, value);

  return (
    <div className="flex justify-between items-center">
      <div
        className={`flex gap-0.5 items-center relative px-2 py-1 rounded-[4px] w-fit border-1 border-[var(--color-bg-hover)] ${
          isEnable ? "pointer-events-none opacity-40" : ""
        }`}
      >
        <Legend color={color} />
        <input
          type="color"
          value={color}
          onChange={(e) => (onChange ? onChange(e.target.value) : null)}
          className="opacity-0 left-0 top-0 w-[100%] h-[100%] absolute"
        />
        <span className="text-[0.85rem]">{label}</span>
      </div>
      {onToggle && (
        <ToggleButton
          value={isEnable}
          onClick={() => (onToggle ? onToggle() : null)}
        />
      )}
    </div>
  );
}
