import { useTableStore } from "../../store/useTableStore";

export const CellInput = ({ colId, draft, setDraft, onCommit, setEditing }) => {
  const type = useTableStore((s) => s.columnsById[colId].type);

  const isValidType = ["date", "time", "number", "text"].includes(type);

  return (
    <input
      className={`w-full h-full px-2 py-1 outline-0 border-r-1 border-r-(--border) [appearance:textfield]
      [&::-webkit-outer-spin-button]:appearance-none
      [&::-webkit-inner-spin-button]:appearance-none ${
        type === "date" ? "py-[3px]" : ""
      }
      ${type === "time" ? "py-[2px]" : ""}`}
      type={isValidType ? type : "text"}
      step={1}
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        onCommit(draft, colId);
        setEditing(false);
      }}
    />
  );
};
