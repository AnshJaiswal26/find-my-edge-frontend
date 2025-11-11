import { IconButton } from "../Buttons";
import { useResolvedValue } from "@hooks";
import { RefreshCcw } from "lucide-react";
import styles from "./ColorPicker.module.css";

export default function ColorPicker({
  label,
  onChange,
  disable = false,
  value,
  resetColor,
  store,
}) {
  const isEnable = useResolvedValue(store, disable);
  const color = useResolvedValue(store, value);

  return (
    <div
      className={`${styles.colorPickerWrapper} ${
        isEnable ? styles.disable : ""
      }`}
    >
      <span className={styles.indicator} style={{ background: color }} />

      <input
        type="color"
        value={color}
        onChange={(e) => (onChange ? onChange(e.target.value) : null)}
        className={styles.colorInput}
      />
      <span className="text-[0.85rem]">{label}</span>
      <IconButton
        icon={<RefreshCcw className="w-[0.85rem] h-[0.85rem]" />}
        tooltip={{ title: "Reset", position: "top" }}
        className={"p-0"}
        onClick={() => (onChange ? onChange(resetColor) : null)}
      />
    </div>
  );
}
