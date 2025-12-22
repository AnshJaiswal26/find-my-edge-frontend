export function SummaryCard({ label, value, accent = "info" }) {
  const accentMap = {
    success: {
      text: "text-(--success)",
      border: "border-(--success)",
      bg: "bg-(--success-soft)",
    },
    danger: {
      text: "text-(--error)",
      border: "border-(--error)",
      bg: "bg-(--error-soft)",
    },
    info: {
      text: "text-(--info)",
      border: "border-(--info)",
      bg: "bg-(--info-soft)",
    },
  };

  const a = accentMap[accent] || accentMap.info;

  return (
    <div
      className={`
        relative
        rounded-lg
        border ${a.border}
        ${a.bg}
        p-4
        overflow-hidden
      `}
    >
      {/* accent stripe */}
      <div className={`absolute left-0 top-0 h-full w-1 ${a.text}`} />

      <div className="text-xs font-medium uppercase text-(--muted)">
        {label}
      </div>

      <div className={`mt-1 text-2xl font-semibold ${a.text}`}>{value}</div>
    </div>
  );
}
