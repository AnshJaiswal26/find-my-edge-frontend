import CalendarCell from "./CalendarCell";

const CalendarGrid = ({ currentDate, data }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const today = new Date();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  return (
    <div
      className="
        mt-4
        rounded-xl
        border border-(--border)
        bg-(--surface)
        overflow-hidden
      "
    >
      {/* Week Header */}
      <div className="grid grid-cols-7 dark:bg-white/5 bg-black/5">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="
              py-3 text-center text-sm
              font-medium tracking-wide
              text-slate-400
            "
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          const dateStr =
            d &&
            `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(
              2,
              "0"
            )}`;

          const trade = data.find((t) => t.date === dateStr);

          const isToday =
            d &&
            today.getDate() === d &&
            today.getMonth() === month &&
            today.getFullYear() === year;

          return (
            <CalendarCell
              key={i}
              day={d}
              trade={trade}
              isToday={isToday}
              isInactive={!d}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
