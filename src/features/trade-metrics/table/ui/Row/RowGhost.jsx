import { useTableStore } from "../../store/useTableStore";

export const RowGhost = ({ ref }) => {
  const draggingRow = useTableStore((s) => s.draggingRow);
  const rowDragY = useTableStore((s) => s.rowDragY);

  if (!draggingRow) return null;

  const rect = ref.current.getBoundingClientRect();

  return (
    <div
      className="
        pointer-events-none
        absolute
        bg-(--cyan-soft)
        border-(--cyan-soft)
        rounded
        shadow-lg
        left-0
      "
      style={{
        top: draggingRow.top + rowDragY - rect.top,
        height: draggingRow.height,
        width: rect.width,
        zIndex: 40,
      }}
    />
  );
};
