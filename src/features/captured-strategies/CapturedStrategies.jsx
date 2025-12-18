import { Badge, Container } from "@layout";
import { useEffect, useState } from "react";

export default function CapturedStrategies() {
  const [tradeRecords, setTradeRecords] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:8080/api/backtest");
      const parsedRes = await res.json();
      setTradeRecords(parsedRes.data);
    };

    fetchData();
  });

  if (!tradeRecords) return <Badge value={-40} />;

  return (
    <div className=" flex">
      <Container className="bg-(--surface) flex-1">
        {tradeRecords.map(({ tradeId, createdAt, fields }, index) => (
          <div className="flex flex-col" key={index}>
            <div className="flex border-x-1 border-t-1 px-1">
              <span>{new Date(createdAt).toLocaleTimeString()}</span>
            </div>
            <div className="flex">
              {fields.map((field, idx) => (
                <div className="flex flex-col p-1 border-1 flex-1" key={idx}>
                  <span className="border-b-1">{field.label}</span>
                  <span>{field.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
}
