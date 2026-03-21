import { GripVertical } from "lucide-react";

export const RowHeader = () => {
  return (
    <div
      className="w-4.5 flex items-center justify-between relative
      opacity-0
      border-0
      group-hover:text-(--text-muted)
      group-hover:opacity-100"
    >
      <GripVertical size={16} className="cursor-grab" />
    </div>
  );
};
