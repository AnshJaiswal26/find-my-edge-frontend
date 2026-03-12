import { formatForInput, parseInputValue, INPUT_TYPES } from "@shared/utils";
import { useTradeStore } from "@shared/stores";
import { DurationInput } from "@shared/components/ui";

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
        className="!w-full pl-2 py-1 outline-0 h-[28px] border-r border-r-(--info)"
        wrpperClassName="flex gap-0"
        guide={false}
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
