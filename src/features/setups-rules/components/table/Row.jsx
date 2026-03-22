import { Cell } from "../ui";
import { useTradeSetupStore, useTradeStore } from "@shared/stores";
import { useMemo, useRef } from "react";
import { FILTER_OPTIONS, formatValue, isBetween } from "@shared/utils";
import { CellWrapper, RowWrapper } from "../layout";
import { DragResizeManager } from "@shared/components/ui/managers";
import { createDragResizeController } from "@shared/components/ui/controller";

export function Row({ index, setupId, id, tableRef }) {
  const rowRef = useRef(null);

  const {
    label,
    mappedSchemaId,
    condition,
    expected,
    from,
    to,
    semanticType,
    tag,
  } = useTradeSetupStore((s) => s.tradeSetupsById[setupId].fieldsById[id]);

  const startRowDrag = useTradeSetupStore((s) => s.startRowDrag);
  const endRowDrag = useTradeSetupStore((s) => s.endRowDrag);

  const schemaLabel = useTradeStore((s) => s.schemasById[mappedSchemaId].label);
  const display = useTradeStore((s) => s.schemasById[mappedSchemaId].display);

  const manager = useMemo(() => {
    return new DragResizeManager({
      parentRef: tableRef,
      controllerFactory: createDragResizeController,
      mode: "y",

      onDragStart: () => {
        startRowDrag(index);
      },

      onDragEnd: ({ lastIndex }) => endRowDrag(lastIndex, setupId),
    });
  }, [index]);

  const displayValue = useMemo(() => {
    if (isBetween(condition)) {
      const fromFormatted = formatValue(from, semanticType, display);
      const toFormatted = formatValue(to, semanticType, display);
      return `${fromFormatted} - ${toFormatted}`;
    } else {
      return formatValue(expected, semanticType, display);
    }
  }, [expected, from, to, semanticType, display]);

  return (
    <RowWrapper
      className="group relative"
      ref={rowRef}
      index={index}
      onPointerDown={(e) => manager.startDrag(e, rowRef.current)}
    >
      {[label, schemaLabel, FILTER_OPTIONS[condition], displayValue, tag].map(
        (text, i) => (
          <CellWrapper key={i}>
            <Cell text={text} index={i} setupId={setupId} tag={i === 4} />
          </CellWrapper>
        ),
      )}
    </RowWrapper>
  );
}
