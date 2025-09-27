import { useEffect, useState } from "react";

const handlePriceChange = (val, metrics, setMeterics) => {
  const { buyPrice, sellPrice, qty, amount } = metrics;
  const price = Number(parseFloat(val).toFixed(2));
  const sp = (amount / qty || 0) + price;

  setMeterics((prev) => ({
    ...prev,
    buyPrice: price,
    sellPrice: sp,
  }));
};

export default function CalculatorPopup() {
  const [strike, setStrike] = useState(null);
  const [metrics, setMeterics] = useState({
    buyPrice: 0,
    sellPrice: 0,
    qty: Number(30),
    amount: Number(1000),
  });

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "priceUpdate") {
        handlePriceChange(message.payload.price, metrics, setMeterics);
        setStrike(message.payload.strike);
      }
    });
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "100px",
        right: "20px",
        background: "#fff",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        zIndex: 9999,
      }}
    >
      <h4>Calculator</h4>
      {strike ? (
        <>
          <p>Strike: {strike}</p>
        </>
      ) : (
        <p>No price yet</p>
      )}
      <div style={{ display: "flex" }}>
        <Input label={"Buy Price"} value={metrics.buyPrice} readOnly={true} />
        <Input label={"Sell Price"} value={metrics.sellPrice} readOnly={true} />
      </div>
      <div style={{ display: "flex" }}>
        <Input label={"Qty"} value={metrics.qty} readOnly={true} />
        <Input label={"Amount"} value={metrics.amount} readOnly={true} />
      </div>
    </div>
  );
}

function Input({ label, value }) {
  return (
    <div>
      <p>{label}</p>
      <input type="text" value={value} />
    </div>
  );
}
