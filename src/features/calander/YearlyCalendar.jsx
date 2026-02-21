import TradeDayDetails from "./TradeDayDetails";
import { useCalendarTrades } from "./hooks/useCalendarData";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import PopupSummary from "./PopupSummary";
import { Container } from "@shared/components/layout";
import { Select } from "@shared/components/ui";
import { YearMonthBlock } from "./YearlyMonthBlock";
import { useCalendarStore } from "./store/uesCalendarStore";

const YearlyCalendar = () => {
  const viewMode = useCalendarStore((s) => s.viewMode);
  const setViewMode = useCalendarStore((s) => s.setViewMode);

  const currentDate = useCalendarStore((s) => s.currentDate);
  const selectedDate = useCalendarStore((s) => s.selectedDate);
  const setCurrentDate = useCalendarStore((s) => s.setCurrentDate);

  // 🟢 Calendar grid ALWAYS follows navigation month
  const gridYear = currentDate.getFullYear();
  const gridMonth = currentDate.getMonth();
  const data = useCalendarTrades(gridYear, gridMonth);

  const baseYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => String(baseYear - i));

  const selectedYear = currentDate.getFullYear();

  return (
    <div className="w-full flex">
      <div
        className={`flex gap-5 w-full ${
          viewMode === "Year" ? "flex-col h-fit" : ""
        }`}
      >
        <Container
          className={`gap-4! ${viewMode === "Year" ? "flex-6" : "flex-2"}`}
        >
          <div className="flex space-x-5">
            {" "}
            <Select
              label={"View"}
              vertical
              options={["Month", "Year"]}
              value={viewMode}
              onChange={setViewMode}
            />
            {viewMode === "Year" && (
              <Select
                label={"Year"}
                vertical
                options={yearOptions}
                value={String(selectedYear)}
                onChange={(y) => {
                  const newYear = Number(y);
                  const month = currentDate.getMonth();
                  setCurrentDate(new Date(newYear, month, 1));
                }}
              />
            )}
          </div>

          {viewMode === "Month" ? (
            <>
              <CalendarHeader />

              <CalendarGrid data={data} />
            </>
          ) : (
            <div className="gap-3 overflow-y-auto grid grid-cols-4">
              {Array.from({ length: 12 }, (_, m) => (
                <YearMonthBlock key={m} year={gridYear} month={m} />
              ))}
            </div>
          )}
        </Container>

        <TradeDayDetails data={data} />

        {/* RIGHT SIDE */}
        {/* <div>
          <PopupSummary data={data} currentDate={currentDate} />
        </div> */}
      </div>
    </div>
  );
};

export default YearlyCalendar;
