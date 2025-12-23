import { useTableStore } from "../store";

export const CellInput = ({ colId, draft, setDraft, onCommit, setEditing }) => {
  const type = useTableStore((s) => s.columnsById[colId].type);

  const isValidType = type === "date" || type === "text" || type === "number";

  return (
    <input
      className={`w-full h-full px-2 py-1 outline-0 border-r-1 border-r-(--border) [appearance:textfield]
      [&::-webkit-outer-spin-button]:appearance-none
      [&::-webkit-inner-spin-button]:appearance-none ${
        type === "date" ? "py-[3px]" : ""
      }`}
      type={isValidType ? type : "text"}
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
