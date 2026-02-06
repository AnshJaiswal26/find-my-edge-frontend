import { useState } from "react";
import TradeDayDetails from "./TradeDayDetials";
import { useCalendarTrades } from "./hooks/useCalendarData";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import PopupSummary from "./PopupSummary";
import { Container } from "@layout";

const YearlyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const data = useCalendarTrades(year, month);

  return (
    <div className="w-full flex px-6 py-6 border">
      {/* LEFT SIDE */}
      <div className="flex gap-5 w-full">
        <Container className="gap-4! w-[40%]">
          <CalendarHeader
            date={currentDate}
            onPrev={() => setCurrentDate(new Date(year, month - 1, 1))}
            onNext={() => setCurrentDate(new Date(year, month + 1, 1))}
          />

          <CalendarGrid
            currentDate={currentDate}
            data={data}
            onSelectDate={setSelectedDate}
          />
        </Container>

        <TradeDayDetails data={data} selectedDate={selectedDate} />
      </div>

      {/* RIGHT SIDE */}
      {/* <div>
          <PopupSummary data={data} currentDate={currentDate} />
        </div> */}
    </div>
  );
};

export default YearlyCalendar;
