import { CalendarDaysIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendarStore } from "./store/uesCalendarStore";

const CalendarHeader = () => {
  const currentDate = useCalendarStore((s) => s.currentDate);
  const setCurrentDate = useCalendarStore((s) => s.setCurrentDate);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrev = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNext = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div
      className="
        flex items-center justify-between
        px-4 py-3
        rounded-xl
        bg-(--surface)
        border border-(--border-muted)
        shadow-lg
      "
    >
      {/* Left Nav */}
      <button
        onClick={handlePrev}
        className="
          flex items-center justify-center
          w-9 h-9
          rounded-lg
          bg-(--surface-muted)
          hover:bg-(--hover)
          text-(--text-muted)
          hover:text-(--text)
        "
      >
        <ChevronLeft size={18} />
      </button>

      {/* Center Title */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-(--surface-muted) text-(--text-muted)">
          <CalendarDaysIcon size={18} />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-xs uppercase tracking-wider text-(--text-muted)">
            Trading Calendar
          </span>
          <span className="text-base font-semibold text-(--text)">
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
            {currentDate.getFullYear()}
          </span>
        </div>
      </div>

      {/* Right Nav */}
      <button
        onClick={handleNext}
        className="
          flex items-center justify-center
          w-9 h-9
          rounded-lg
          bg-(--surface-muted)
          hover:bg-(--hover)
          text-(--text-muted)
          hover:text-(--text)
        "
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default CalendarHeader;
