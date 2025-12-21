export const CellSelect = ({
  row,
  column,
  draft,
  setDraft,
  onCommit,
  setEditing,
}) => {
  return (
    <select
      className="w-full h-full px-2 py-1 outline-0"
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        onCommit(draft, row, column);
        setEditing(false);
      }}
    >
      <option value="" className="bg-(--surface)">
        —
      </option>
      {column.options.map((o) => (
        <option key={o} className="bg-(--surface)">
          {o}
        </option>
      ))}
    </select>
  );
};
