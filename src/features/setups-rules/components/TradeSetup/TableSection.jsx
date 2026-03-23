import { Button } from "@shared/components/ui";
import { useTradeSetupStore } from "@shared/stores";
import { EmptyStateWrapper } from "../layout";
import { TradeSetupTable } from "../table";

export function TableSection({ id }) {
  const isLengthEmpty = useTradeSetupStore(
    (s) => s.tradeSetupsById[id].fieldOrder.length === 0,
  );
  const openPopup = useTradeSetupStore((s) => s.openPopup);

  if (isLengthEmpty) {
    return (
      <EmptyStateWrapper className="flex-5 flex-col gap-1">
        <span>No fields and mapping found</span>
        <Button.Text onClick={() => openPopup("field-add", id)}>
          + Add Field
        </Button.Text>
      </EmptyStateWrapper>
    );
  }

  return <TradeSetupTable id={id} />;
}
