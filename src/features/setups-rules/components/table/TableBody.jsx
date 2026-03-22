import { Row } from "./Row";
import { useTradeSetupStore } from "@shared/stores";

export function TableBody({ id, tableRef }) {
  const fieldOrder = useTradeSetupStore(
    (s) => s.tradeSetupsById[id].fieldOrder,
  );

  return fieldOrder.map((fieldId, i) => (
    <Row key={i} id={fieldId} index={i} setupId={id} tableRef={tableRef} />
  ));
}
