import { useTableStore } from "../../store/useTableStore";

function normalizeValue(type, rawValue) {
  switch (type) {
    case "number":
    case "computed":
      return rawValue === "" || rawValue == null ? null : Number(rawValue);

    default:
      return rawValue;
  }
}

export const CellInput = ({ colId, draft, setDraft, onCommit, setEditing }) => {
  const type = useTableStore((s) => s.columnsById[colId].type);

  const isValidType = ["date", "time", "number", "text"].includes(type);

  return (
    <input
      className={`w-full h-full px-2 py-1 outline-0 [appearance:textfield]
      [&::-webkit-outer-spin-button]:appearance-none
      [&::-webkit-inner-spin-button]:appearance-none ${
        type === "date" ? "py-[3px]" : ""
      }
      ${type === "time" ? "py-[2px]" : ""}`}
      type={isValidType ? type : "text"}
      step={1}
      autoFocus
      value={draft ?? ""}
      onChange={(e) => {
        const value = normalizeValue(type, e.target.value);
        setDraft(value);
      }}
      onBlur={() => {
        onCommit(draft, colId);
        setEditing(false);
      }}
    />
  );
};
