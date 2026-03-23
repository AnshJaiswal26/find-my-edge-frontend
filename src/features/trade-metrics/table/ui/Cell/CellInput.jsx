import { formatForInput, INPUT_TYPES, parseInputValue } from "@shared/utils";
import { useTradeStore } from "@shared/stores";
import { DurationInput } from "@shared/components/ui";

export const CellInput = ({ colId, draft, setDraft, onCommit, setEditing }) => {
  const type = useTradeStore((s) => s.schemasById[colId].semanticType);

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
        className="!w-full py-1 h-[28px]"
      />
    );
  }

  return (
    <input
      className="w-full px-2 py-1 outline-0 h-[28px]"
      autoFocus
      type={INPUT_TYPES[type] || "text"}
      step={1}
      value={formatForInput(draft, type)}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={onBlur}
    />
  );
};
