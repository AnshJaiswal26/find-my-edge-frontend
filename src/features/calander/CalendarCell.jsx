const mapRange = (value, inMin, inMax, outMin, outMax) => {
  const clamped = Math.min(Math.max(value, inMin), inMax);
  return outMin + ((clamped - inMin) * (outMax - outMin)) / (inMax - inMin);
};

const CalendarCell = ({ day, trade, isToday, onSelectDate }) => {
  if (!day) {
    return <div className="h-10 rounded-md bg-(--surface-muted)/20" />;
  }

  const intensity = trade ? Math.min(Math.abs(trade.amount) / 1000, 1) : 0;

  const base = `
    h-10
    flex items-center justify-center
    text-xs font-semibold
    rounded-md
    transition-all duration-150
    relative
    overflow-hidden
    ${trade ? "cursor-pointer hover:scale-105" : "cursor-default"}
  `;

  let style = {};
  let textClass = "text-(--text)";
  let defaultBg = "bg-(--surface) hover:bg-(--hover) hover:text-(--text)";

  if (trade) {
    const mix = mapRange(intensity, 0, 1, 60, 100);

    if (trade.type === "profit") {
      style.background = `
        linear-gradient(
          to bottom,
          color-mix(in srgb, var(--success-soft) ${mix}%, transparent),
          color-mix(in srgb, var(--success) ${intensity * 45}%, transparent)
        )
      `;
    } else if (trade.type === "loss") {
      style.background = `
        linear-gradient(
          to bottom,
          color-mix(in srgb, var(--error-soft) ${mix}%, transparent),
          color-mix(in srgb, var(--error) ${intensity * 45}%, transparent)
        )
      `;
    }
  }

  const dotSize = mapRange(intensity, 0, 1, 4, 9);

  const handleClick = () => {
    if (trade && onSelectDate) {
      onSelectDate(trade.date); // 🔥 send selected date to parent
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`${base} ${defaultBg} ${textClass}`}
      style={style}
    >
      {/* Performance Dot */}
      {trade && (
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

      {/* Today ring */}
      {isToday && !trade && (
        <div className="absolute inset-0 rounded-md ring-1 ring-(--info) opacity-70" />
      )}

      <span className="relative z-10">{day}</span>
    </div>
  );
};

export default CalendarCell;
