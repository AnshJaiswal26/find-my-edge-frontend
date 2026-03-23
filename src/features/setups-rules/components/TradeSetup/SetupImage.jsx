import { useTradeSetupStore } from "@shared/stores";
import { EmptyStateWrapper } from "../layout";
import { Button } from "@shared/components/ui";

export function SetupImage({ id }) {
  const imgUrl = useTradeSetupStore((s) => s.tradeSetupsById[id].imageUrl);
  const openPopup = useTradeSetupStore((s) => s.openPopup);
  return (
    <div className="flex-4 h-full border border-(--border) object-cover rounded overflow-hidden">
      {imgUrl && imgUrl !== "" ? (
        <img src={imgUrl} className="!w-full !h-full" />
      ) : (
        <EmptyStateWrapper className="flex-col gap-2">
          <span>No image available</span>
          <Button.Text onClick={() => openPopup("setup-edit", id)}>
            + Add Image
          </Button.Text>
        </EmptyStateWrapper>
      )}
    </div>
  );
}
