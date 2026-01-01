import { useTableStore } from "../../store/useTableStore";

export const ColumnGhost = ({ ref }) => {
  const draggingColumn = useTableStore((s) => s.draggingColumn);
  const colDragX = useTableStore((s) => s.colDragX);
  const resizeWidth = useTableStore((s) => s.resizeWidth);
  const colDragMode = useTableStore((s) => s.colDragMode);
  const selectedColumn = useTableStore((s) => s.selectedColumn);

  if (!draggingColumn && !selectedColumn) return null;

  const rect = ref.current.getBoundingClientRect();

  return (
    <div
      className={`
        pointer-events-none
        absolute
        bg-(--cyan-soft)
        border-(--cyan-soft)
        rounded
        shadow-xl
        top-0 ${
          colDragMode !== "reorder"
            ? colDragMode === "select"
              ? "bg-(--info-soft)! border-x-2! border-(--info)!"
              : "border-r-5!"
            : "border-x-5!"
        }
      `}
      style={{
        height: rect.height,
        left:
          (colDragMode === "reorder"
            ? draggingColumn.left + colDragX
            : draggingColumn?.left || selectedColumn.left) - rect.left,
        width:
          colDragMode === "resize"
            ? resizeWidth
            : draggingColumn?.width || selectedColumn.width,
        zIndex: 50,
      }}
    />
  );
};
