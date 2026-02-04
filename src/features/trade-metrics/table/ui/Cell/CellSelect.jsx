import { useTableStore } from "@table/store/useTableStore";

export const CellSelect = ({
  rowId,
  colId,
  draft,
  setDraft,
  onCommit,
  setEditing,
}) => {
  const options = useTableStore((s) => s.columnsById[colId].options);

  return (
    <select
      className="w-full h-full px-2 py-1 outline-0"
      autoFocus
      value={draft}
      onChange={(e) => {
        console.log(e.target.value);
        setDraft(e.target.value);
      }}
      onBlur={() => {
        onCommit(draft);
        setEditing(false);
      }}
    >
      {options.map((o) => (
        <option key={o} className="bg-(--surface)">
          {o}
        </option>
      ))}
    </select>
  );
};
