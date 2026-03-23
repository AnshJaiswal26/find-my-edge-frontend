import { useTradeSetupStore, useTradeStore } from "@shared/stores";
import { useMemo } from "react";

export const CellSelect = ({
  rowId,
  colId,
  draft,
  setDraft,
  onCommit,
  setEditing,
}) => {
  const options = useTradeStore((s) => s.schemasById[colId].options);
  const { tradeSetupsOrder, tradeSetupsById } = useTradeSetupStore.getState();

  const setupOptions = useMemo(
    () => tradeSetupsOrder.map((id) => tradeSetupsById[id].name),
    [],
  );

  const opts = colId === "setup" ? setupOptions : options;

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
      {opts.map((o) => (
        <option key={o} className="bg-(--surface)">
          {o}
        </option>
      ))}
    </select>
  );
};
