import { useTradeSetupStore } from "@shared/stores";
import { TAG_STYLES } from "../tagStyles";

const getCellClass = (tag, text) => {
  if (!tag) return "text-(--text)";
  return TAG_STYLES[text];
};

export const Cell = ({ text, index, tag = false, setupId }) => {
  const width = useTradeSetupStore((s) => s.columnWidths[setupId][index]);
  return (
    <div
      style={{ width: width ?? 130 }}
      className={`
      text-left
      p-2 px-3
      text-ellipsis overflow-hidden
      whitespace-nowrap font-bold select-none
      ${getCellClass(tag, text)}`}
    >
      <span>{tag ? text.replace("_", " ") : text}</span>
    </div>
  );
};
