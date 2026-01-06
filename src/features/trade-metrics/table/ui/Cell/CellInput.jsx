import { useTableStore } from "../../store/useTableStore";

function normalizeValue(type, raw) {
  if (type === "number" || type === "computed") {
    return raw === "" ? null : Number(raw);
  }
  return raw;
}

export const CellInput = ({ colId, draft, setDraft, onCommit, setEditing }) => {
  const type = useTableStore((s) => s.columnsById[colId].type);

  return (
    <input
      className="w-full h-full px-2 py-1 outline-0    
      appearance-none
      [-moz-appearance:textfield]
      [&::-webkit-outer-spin-button]:appearance-none
      [&::-webkit-inner-spin-button]:appearance-none"
      autoFocus
      type={["date", "time", "number"].includes(type) ? type : "text"}
      value={draft ?? ""}
      onChange={(e) => setDraft(normalizeValue(type, e.target.value))}
      onBlur={() => {
        onCommit(draft);
        setEditing(false);
      }}
    />
  );
};
