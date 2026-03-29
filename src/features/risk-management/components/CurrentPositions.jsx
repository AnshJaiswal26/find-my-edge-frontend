import { useRiskManagementStore } from "../stores";
import { useClearLogic } from "../hooks";

export function CurrentPositions() {
  const updateSection = useRiskManagementStore((s) => s.updater.section);
  const updateTab = useRiskManagementStore((s) => s.updater.tab);

  const { clearTargetAndStopLoss } = useClearLogic();

  const data = [
    {
      symbol: "BANKNIFTY",
      type: "ATM",
      date: "24-Nov-22",
      strike: "41350",
      optionType: "CE",
      buyPrice: "62.70",
      currentPrice: "65.25",
      quantity: "100",
    },
    {
      symbol: "BANKNIFTY",
      type: "OTM",
      date: "24-Nov-22",
      strike: "41450",
      optionType: "CE",
      buyPrice: "146.75",
      currentPrice: "176.05",
      quantity: "75",
    },
  ];

  const handlePriceSelect = (item) => {
    clearTargetAndStopLoss();

    updateTab("risk-management");

    const updated = {
      buyPrice: Number(item.buyPrice),
      qty: Number(item.quantity),
      sellPrice: Number(item.buyPrice),
    };

    updateSection("stopLoss", updated);
    updateSection("target", updated);
  };

  return (
    <div className="flex flex-col gap-4">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-(--surface-light) px-3 py-2 rounded-lg"
          onClick={() => handlePriceSelect(item)}
        >
          <div className="left-section">
            <div className="flex gap-2 items-center">
              <span className="text-(--text-muted)">{item.symbol}</span>
              <span
                className={`p-1 text-xs rounded ${item.type === "ATM" ? "bg-(--info-soft) text-(--info)" : "bg-(--warning-soft) text-(--warning)"}`}
              >
                {item.type}
              </span>
            </div>
            <div className="option-details">
              {item.date} {item.strike} {item.optionType}
            </div>
          </div>
          <div className="text-sm">
            <div className="price-info">
              <div className="text-(--text)">Buy Price</div>
              <div className="text-(--success)">₹{item.buyPrice}</div>
              <div className="text-(--info) text-xs">Qty: {item.quantity}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
