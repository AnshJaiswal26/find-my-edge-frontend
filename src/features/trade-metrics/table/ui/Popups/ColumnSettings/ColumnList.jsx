export function ColumnList({
  columnsById,
  columnsOrder,
  activeColId,
  onSelect,
}) {
  return (
    <div className="w-44 border-r border-(--border) overflow-auto">
      {columnsOrder.map((id) => {
        const col = columnsById[id];
        return (
          <div
            key={id}
            onClick={() => {
              onSelect(id);
            }}
            className={`
              flex items-center gap-2 px-3 py-2 cursor-pointer
              ${id === activeColId ? "bg-(--hover)" : ""}
            `}
          >
            <span className="text-sm">{col.label}</span>
          </div>
        );
      })}
    </div>
  );
}
