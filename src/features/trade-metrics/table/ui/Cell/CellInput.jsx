import { formatForInput, parseInputValue } from "@utils";
import { useTableStore } from "@table/store/useTableStore";

function getInputType(semanticType) {
  switch (semanticType) {
    case "number":
      return "number";

    case "date":
      return "date";

    case "time":
      return "time";

    case "datetime":
      return "datetime-local";

    case "duration":
      return "text"; // 🔥 custom parsing

    case "boolean":
      return "checkbox";

    default:
      return "text";
  }
}

export const CellInput = ({ colId, draft, setDraft, onCommit, setEditing }) => {
  const type = useTableStore((s) => s.columnsById[colId].semanticType);

  const inputType = getInputType(type);

  return (
    <input
      className="w-ful px-2 py-1 outline-0  h-[28px]  
      appearance-none
      [-moz-appearance:textfield]
      [&::-webkit-outer-spin-button]:appearance-none
      [&::-webkit-inner-spin-button]:appearance-none"
      autoFocus
      type={inputType}
      step={1}
      value={
        draft != null
          ? typeof draft === "number"
            ? formatForInput(draft, type) // ✅ correct
            : draft // ✅ already valid input string
          : ""
      }
      onChange={(e) => {
        setDraft(e.target.value);
      }}
      onBlur={() => {
        const normalized = parseInputValue(draft, type);
        onCommit(normalized);
        setEditing(false);
      }}
    />
  );
};
