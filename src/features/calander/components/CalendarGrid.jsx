import { CalendarCell } from "./CalendarCell";
import { useCalendarStore } from "../store/uesCalendarStore";

export const CalendarGrid = ({ currentDate, data, isYearView = false }) => {
  const storeDate = useCalendarStore((s) => s.currentDate);

  const setSelectedDate = useCalendarStore((s) => s.setSelectedDate);
  const setCurrentDate = useCalendarStore((s) => s.setCurrentDate);

  const activeDate = isYearView ? currentDate : storeDate;

  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();

  const days = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const today = new Date();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  const handleSelectDate = (dateStr) => {
    const d = new Date(dateStr);
    setSelectedDate(d);
    setCurrentDate(d);
  };

  return (
    <div className="mt-4">
      <div
        className={`grid grid-cols-7 mb-2 px-1 font-normal text-(--text-muted) ${isYearView ? "text-[10px]" : "text-xs"}`}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      <div
        className={`
          grid grid-cols-7
          ${isYearView ? "gap-1 p-1" : "gap-1.5 p-1.5"}
          rounded-xl
          bg-(--surface-muted)/30
        `}
      >
        {cells.map((d, i) => {
          const dateStr =
            d &&
            `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

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
              year={year}
              month={month}
              isToday={isToday}
              isYearView={isYearView}
              onSelectDate={handleSelectDate}
            />
          );
        })}
      </div>
    </div>
  );
};
