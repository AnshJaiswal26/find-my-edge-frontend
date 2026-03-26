import { memo, useMemo } from "react";

import { evaluateColorRules, formatForInput, formatValue } from "@shared/utils";

import { useTableStore } from "@features/trade-metrics/table/store";
import { useTradeSetupStore, useTradeStore } from "@shared/stores";
import { SCHEMA_SOURCE } from "@lib/analytics/schema";
import { hideTooltip } from "@shared/components/ui/tooltip";
import { handleShowTooltip } from "./cellUtils";

const SetupName = ({ value }) => {
  const tradeSetups = useTradeSetupStore((s) => s.tradeSetupsById);

  return <span>{tradeSetups[value]?.name || "—"}</span>;
};

export const CellDisplay = memo(function CellDisplay({
  value,
  rowId,
  colId,
  width,
  type,
  display,
  setDraft,
  setEditing,
}) {
  const colorRules = useTradeStore((s) => s.schemasById[colId].colorRules);
  const isColEditable = useTradeStore(
    (s) => s.schemasById[colId].source !== SCHEMA_SOURCE.COMPUTED,
  );

  const isColUnlocked = useTableStore(
    (s) => s.lockedColumnsMap?.[colId] !== true,
  );

  const editable = isColUnlocked && isColEditable;

  const unselectColumn = useTableStore((s) => s.unselectColumn);

  const color = useMemo(() => {
    const { color, label } = evaluateColorRules(value, colorRules);
    return label === "Default" ? null : color;
  }, [value, colorRules]);

  const displayValue = useMemo(
    () => formatValue(value, type, display),
    [value, type, display],
  );

  return (
    <div
      tabIndex={-1}
      style={{ width, color }}
      className="relative px-2 py-1 border-1 border-(--border) truncate overflow-hidden focus:border-(--info) h-full"
      onClick={() => {
        unselectColumn({ id: colId });
      }}
      onDoubleClick={() => {
        if (!editable) return;
        setDraft(formatForInput(value ?? "", type));
        setEditing(true);
      }}
      onMouseEnter={(e) =>
        handleShowTooltip(e, {
          type,
          value: displayValue,
          colId,
          rowId,
          color,
        })
      }
      onMouseLeave={hideTooltip}
      // onMouseEnter={(e) => handleMouseEnter(e, type, cell, colId, rowId, color)}
      // onMouseLeave={tooltipApi.hide}
    >
      {colId === "setup" ? <SetupName value={displayValue} /> : displayValue}
    </div>
  );
});
