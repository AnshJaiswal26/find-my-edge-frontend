import { Trash2 } from "lucide-react";
import { Cell, RowHeader } from "../ui";

export function Row({ data }) {
  return (
    <div className="flex border border-(--border) divide-x divide-(--border) group relative">
      <RowHeader />
      {data.map((text, i) => (
        <Cell text={text} key={i} index={i} />
      ))}
      <div className="absolute cursor-pointer right-2 self-center opacity-0 group-hover:opacity-100">
        <Trash2 size={16} className="hover:text-(--error)" />
      </div>
    </div>
  );
}
