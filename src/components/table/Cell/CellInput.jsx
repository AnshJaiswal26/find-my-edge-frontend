export const CellInput = ({
  row,
  column,
  draft,
  setDraft,
  onCommit,
  setEditing,
}) => {
  return (
    <input
      className="w-full h-full px-2 py-1 outline-0"
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        onCommit(draft, row, column);
        setEditing(false);
      }}
    />
  );
};
