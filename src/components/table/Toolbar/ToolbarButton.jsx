export function ToolbarButton({ icon: Icon, onClick, tooltip }) {
  return (
    <button
      onClick={onClick}
      data-tooltip={tooltip}
      data-tooltip-position="bottom"
      className={`
        relative
        flex items-center justify-center
        w-9 h-9
        rounded-lg
        border border-(--border)
        bg-(--surface)
        text-(--text)
        hover:bg-(--hover)
        cursor-pointer
       
      `}
    >
      <Icon size={16} />
    </button>
  );
}
