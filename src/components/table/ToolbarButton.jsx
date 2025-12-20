export function ToolbarButton({ icon: Icon, label, onClick, primary = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm
        border cursor-pointer bg-(--surface) text-(--text) border-(--border) hover:bg-(--hover)
       
      `}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}
