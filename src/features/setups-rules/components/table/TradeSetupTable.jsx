import { Header } from "./Header";
import { Row } from "./Row";

export function TradeSetupTable() {
  return (
    <div className="flex-4 overflow-auto border-b border-(--border) text-sm h-full">
      <Header />
      {Array.from({ length: 18 }).map((_, i) => (
        <Row
          key={i}
          data={["Entry Time", "Entry Time", "<=", "09:30 AM", "GOOD"]}
        />
      ))}
    </div>
  );
}
