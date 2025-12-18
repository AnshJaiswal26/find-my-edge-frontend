export default function StatCard({ iconSrc, title, value, icon }) {
  return (
    <div
      className="
        flex items-center gap-4
        min-w-70
        rounded-[15px]
        px-5 py-9
        bg-(--surface-muted)
        border border-(--border-muted)
        shadow-(--shadow)
        transition-transform duration-300
        hover:-translate-y-[5px]
        hover:shadow-(--shadow-hover)
      "
    >
      {icon ? (
        icon
      ) : (
        <img src={iconSrc} alt={title} className="w-[65px] h-[65px]" />
      )}

      <div>
        <h3 className="text-base font-medium text-(--text-muted)">{title}</h3>
        <p className="mt-[5px] text-[1.8rem] font-bold text-(--text)">
          {value}
        </p>
      </div>
    </div>
  );
}
