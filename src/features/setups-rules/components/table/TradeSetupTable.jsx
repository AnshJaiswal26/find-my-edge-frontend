import { Header } from "./Header";
import { TableBody } from "./TableBody";
import { useRef } from "react";

export function TradeSetupTable({ id }) {
  const tableRef = useRef(null);
  return (
    <div className="flex-5 overflow-auto text-sm h-full">
      <div
        ref={tableRef}
        className="relative border border-(--border) overflow-auto"
      >
        <div className="w-fit">
          <Header id={id} tableRef={tableRef} />
          <TableBody id={id} tableRef={tableRef} />
        </div>
      </div>
    </div>
  );
}
