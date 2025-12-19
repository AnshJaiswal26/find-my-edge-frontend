import { CalendarDaysIcon, ChevronLeft, ChevronRight } from "lucide-react";

const CalendarHeader = ({ date, onPrev, onNext }) => {
  return (
    <div
      className="
        flex items-center justify-between
        px-6 py-4 rounded-xl
        bg-gradient-to-b from-(--surface) to-(--surface-muted)
        text-(--text)
        shadow-lg
        border border-(--border-muted)
      "
    >
      <button
        onClick={onPrev}
        className="
          p-2 rounded-full
          hover:bg-(--hover)
          transition
        "
      >
        <ChevronLeft size={19} />
      </button>

      <div className="flex items-center gap-3 text-lg font-semibold">
        <span className="opacity-80">
          <CalendarDaysIcon />
        </span>
        {date.toLocaleString("default", { month: "long" })} {date.getFullYear()}
      </div>

      <button
        onClick={onNext}
        className="
          p-2 rounded-full
          hover:bg-(--hover)
          transition
        "
      >
        <ChevronRight size={19} />
      </button>
    </div>
  );
};

export default CalendarHeader;
