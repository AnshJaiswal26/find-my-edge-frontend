import { formatForInput, parseInputValue, INPUT_TYPES } from "@shared/utils";
import { useTradeStore } from "@shared/stores";

export const CellInput = ({ colId, draft, setDraft, onCommit, setEditing }) => {
  const type = useTradeStore((s) => s.schemasById[colId].semanticType);

  const onBlur = () => {
    const normalized = parseInputValue(draft, type);
    onCommit(normalized);
    console.log({ normalized }, "instance of: ", typeof normalized);
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
      className="w-full px-2 py-1 outline-0 h-[28px] appearance-none"
      autoFocus
      type={INPUT_TYPES[type] || "text"}
      step={1}
      value={formatForInput(draft, type)}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={onBlur}
    />
  );
};
