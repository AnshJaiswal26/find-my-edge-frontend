import { useTableStore } from "../store";

export const CellGhost = ({ ref }) => {
  const select = useTableStore((s) => s.selectedCell);
  if (!select) return null;

  const rect = ref.current.getBoundingClientRect();

  return (
    <div
      className="
        pointer-events-none
        absolute
        bg-(--info-soft)
        border-1
        border-(--info)
        z-1
      "
      style={{
        top: select.top - rect.top,
        left: select.left - rect.left,
        height: select.height,
        width: select.width,
      }}
    />
  );
};
