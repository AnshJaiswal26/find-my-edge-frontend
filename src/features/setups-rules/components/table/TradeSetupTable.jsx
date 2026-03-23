import { Header } from "./Header";
import { TableBody } from "./TableBody";
import { useRef } from "react";

export function TradeSetupTable({ id }) {
  const tableRef = useRef(null);
  return (
    <div className="flex-5 overflow-hidden text-sm h-full">
      <div
        ref={tableRef}
        className="relative w-full h-full border border-(--border) overflow-auto"
      >
        <div className="w-max min-w-full h-max">
          <Header id={id} tableRef={tableRef} />
          <TableBody id={id} tableRef={tableRef} />
        </div>
      </div>
    </div>
  );
}
