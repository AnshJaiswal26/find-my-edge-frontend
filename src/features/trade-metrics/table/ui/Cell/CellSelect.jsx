import { useTradeSetupStore, useTradeStore } from "@shared/stores";

const Options = () => {
  const setupIds = useTradeSetupStore((s) => s.tradeSetupsOrder);
  const tradeSetups = useTradeSetupStore((s) => s.tradeSetupsById);

  return (
    <>
      <option className="bg-(--surface)">—</option>
      {setupIds.map((o) => (
        <option key={o} value={o} className="bg-(--surface)">
          {tradeSetups[o].name}
        </option>
      ))}
    </>
  );
};

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
      {colId !== "setup" ? (
        <>
          <option className="bg-(--surface)">—</option>
          {options.map((o) => (
            <option key={o} className="bg-(--surface)">
              {o}
            </option>
          ))}
        </>
      ) : (
        <Options />
      )}
    </select>
  );
};
