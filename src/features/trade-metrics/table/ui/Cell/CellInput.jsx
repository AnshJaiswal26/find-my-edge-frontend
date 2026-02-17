import { DurationInput } from "@ui";
import { formatForInput, parseInputValue, INPUT_TYPES } from "@utils";
import { useTableStore } from "@table/store/useTableStore";

export const CellInput = ({ colId, draft, setDraft, onCommit, setEditing }) => {
  const type = useTableStore((s) => s.columnsById[colId].semanticType);

  const onBlur = () => {
    const normalized = parseInputValue(draft, type);
    onCommit(normalized);
    setEditing(false);
  };

  if (type === "duration") {
    return (
      <DurationInput
        value={draft}
        onChange={setDraft}
        onBlur={onBlur}
        className="w-ful px-2 py-1 outline-0 h-[28px]"
      />
    );
  }

  return (
    <input
      className="w-ful px-2 py-1 outline-0 h-[28px]"
      autoFocus
      type={INPUT_TYPES[type] || "text"}
      step={1}
      value={formatForInput(draft, type)}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={onBlur}
    />
  );
};
