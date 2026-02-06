import { CalendarDaysIcon, ChevronLeft, ChevronRight } from "lucide-react";

const CalendarHeader = ({ date, onPrev, onNext }) => {
  return (
    <div
      className="
        flex items-center justify-between
        px-4 py-3
        rounded-xl
        bg-(--surface)
        border border-(--border-muted)
      "
    >
      {/* Left Nav */}
      <button
        onClick={onPrev}
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
            {date.toLocaleString("default", { month: "long" })}{" "}
            {date.getFullYear()}
          </span>
        </div>
      </div>

      {/* Right Nav */}
      <button
        onClick={onNext}
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
