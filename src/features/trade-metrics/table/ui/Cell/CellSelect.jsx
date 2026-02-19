import { useTradeStore } from "@stores";

export const CellSelect = ({
  rowId,
  colId,
  draft,
  setDraft,
  onCommit,
  setEditing,
}) => {
  const options = useTradeStore((s) => s.schemasById[colId].options);

  return (
    <select
      className="w-full h-full px-2 py-1 outline-0"
      autoFocus
      value={draft || "—"}
      onChange={(e) => {
        setDraft(e.target.value);
      }}
      onBlur={() => {
        onCommit(draft || "—");
        setEditing(false);
      }}
    >
      <option className="bg-(--surface)">—</option>
      {options.map((o) => (
        <option key={o} className="bg-(--surface)">
          {o}
        </option>
      ))}
    </select>
  );
};
