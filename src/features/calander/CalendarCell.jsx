const CalendarCell = ({ day, trade, isToday, isInactive }) => {
  if (!day) {
    return <div className="h-18 border border-(--border)" />;
  }

  const base = `
    h-18
    flex items-start justify-end
    p-3
    text-sm font-semibold
    border border-(--border-muted)
    cursor-pointer
    text-(--text-muted)!
  `;

  const type =
    trade?.type === "profit"
      ? "bg-(--success-soft) text-(--success) border-2 border-(--success)"
      : trade?.type === "loss"
      ? "bg-(--error-soft) text-(--error) border-2 border-(--error)"
      : isToday
      ? "bg-(--info-soft) text-(--info) border-2 border-(--info)"
      : "text-white hover:bg-(--hover)";

  return (
    <div
      className={`
        ${base}
        ${type}
      `}
    >
      {day}
    </div>
  );
};

export default CalendarCell;
