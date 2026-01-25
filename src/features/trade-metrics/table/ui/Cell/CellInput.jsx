import { parseInputValue } from "@utils";
import { useTableStore } from "@table/store/useTableStore";

export const CellInput = ({ colId, draft, setDraft, onCommit, setEditing }) => {
  const type = useTableStore((s) => s.columnsById[colId].type);

  return (
    <input
      className="w-ful px-2 py-1 outline-0  h-[28px]  
      appearance-none
      [-moz-appearance:textfield]
      [&::-webkit-outer-spin-button]:appearance-none
      [&::-webkit-inner-spin-button]:appearance-none"
      autoFocus
      type={["date", "time", "number"].includes(type) ? type : "text"}
      step={1}
      value={draft ?? ""}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        const normalized = parseInputValue(draft, type);
        onCommit(normalized);
        setEditing(false);
      }}
    />
  );
};
