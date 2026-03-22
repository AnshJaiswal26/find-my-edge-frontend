import { useTradeSetupStore } from "@shared/stores";

export function SetupImage({ id }) {
  const imgUrl = useTradeSetupStore((s) => s.tradeSetupsById[id].imageUrl);
  return (
    <div className="flex-4 h-full border border-(--border) object-cover rounded overflow-hidden">
      <img src={imgUrl} className="!w-full !h-full object-cover" />
    </div>
  );
}
