const mapRange = (value, inMin, inMax, outMin, outMax) => {
  const clamped = Math.min(Math.max(value, inMin), inMax);
  return outMin + ((clamped - inMin) * (outMax - outMin)) / (inMax - inMin);
};

const CalendarCell = ({
  day,
  year,
  month,
  trade,
  isToday,
  onSelectDate,
  isYearView,
}) => {
  if (!day) {
    return <div className="h-11 rounded-md bg-(--surface-muted)/20" />;
  }

  const intensity = trade ? Math.min(Math.abs(trade.amount) / 1000, 1) : 0;

  const base = `
  ${isYearView ? "h-7 text-[10px]" : "h-11 text-xs"}
  flex items-center justify-center
  font-semibold
  rounded-md
  transition-all duration-150
  relative
  overflow-visible
  ${trade ? "cursor-pointer hover:scale-105" : "cursor-default"}
`;

  let style = {};
  let textClass = "text-(--text)";
  let defaultBg = "bg-(--surface) hover:bg-(--hover) hover:text-(--text)";

  if (trade) {
    const boosted = Math.pow(intensity, 0.55);
    const tint = mapRange(boosted, 0, 1, 10, 30);

    if (trade.type === "profit") {
      style.background = `color-mix(in srgb, var(--success) ${tint}%, var(--surface))`;
    } else if (trade.type === "loss") {
      style.background = `color-mix(in srgb, var(--error) ${tint}%, var(--surface))`;
    }
  }

  const dotSize = mapRange(
    intensity,
    0,
    1,
    isYearView ? 4 : 5,
    isYearView ? 5 : 9,
  );

  const handleClick = () => {
    if (!onSelectDate || !day) return;

    const dateStr =
      trade?.date ??
      `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    onSelectDate(dateStr);
  };

  const tooltipText = trade
    ? `P&L: ₹${Number(trade.amount).toFixed(2)}`
    : "No trades";

  const color = trade
    ? trade.type === "profit"
      ? "var(--success)"
      : "var(--error)"
    : "var(--text)";

  return (
    <div
      onClick={handleClick}
      className={`group ${base} ${defaultBg} ${textClass} ${isToday ? "!bg-(--info-soft) ring-2 !ring-(--info)" : ""}`}
      style={style}
    >
      {/* Performance Dot */}
      {trade?.type && (
        <div
          className="absolute bottom-1 right-1 rounded-full"
          style={{
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            backgroundColor:
              trade.type === "profit" ? "var(--success)" : "var(--error)",
            opacity: 0.9,
          }}
        />
      )}

      <span
        className="relative"
        style={{
          fontSize: `${dotSize + 5}px`,
          color,
        }}
      >
        {day}
      </span>

      {/* Tooltip */}
      <div
        style={{ color }}
        className="
    pointer-events-none
    absolute -top-7 left-1/2 -translate-x-1/2
    whitespace-nowrap
    rounded-md
    bg-(--surface)
    border border-(--border)
    px-2 py-1
    text-[10px] font-medium
    text-(--text)
    shadow-lg
    opacity-0 group-hover:opacity-100
    transition-opacity duration-150
    z-10
  "
      >
        {tooltipText}
      </div>
    </div>
  );
};

export default CalendarCell;
