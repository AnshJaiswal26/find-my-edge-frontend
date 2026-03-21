import { useCalendarStore } from "../store/uesCalendarStore";
import { useCalendarTrades } from "../hooks/useCalendarData";
import { CalendarGrid } from "./CalendarGrid";

export const YearMonthBlock = ({ year, month }) => {
  const setSelectedDate = useCalendarStore((s) => s.setSelectedDate);
  const setCurrentDate = useCalendarStore((s) => s.setCurrentDate);

  const data = useCalendarTrades(year, month);
  const date = new Date(year, month, 1);

  return (
    <div className="w-full border border-(--border) rounded p-2">
      <div className="text-sm font-semibold text-(--text-muted) mb-2">
        {date.toLocaleString("en-US", { month: "long" })}
      </div>

      <CalendarGrid
        currentDate={date}
        data={data}
        isYearView
        onSelectDate={(d) => {
          setSelectedDate(d);
          setCurrentDate(d);
        }}
      />
    </div>
  );
};
