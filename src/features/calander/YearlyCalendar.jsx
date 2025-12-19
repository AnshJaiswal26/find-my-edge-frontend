import React, { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import PopupSummary from "./PopupSummary";
import PopupOverview from "./PopupOverview";
import { Container } from "@layout";

const YearlyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const data = [
    { date: "2025-04-18", type: "profit", amount: 500 },
    { date: "2025-04-15", type: "loss", amount: 200 },
    { date: "2025-04-16", type: "no-trade" },
  ];

  return (
    <div
      className="
          flex flex-wrap justify-center gap-6
          w-full max-w-[1400px] h-full
        "
    >
      <Container childClassName="gap-2!" className="flex-3">
        <CalendarHeader
          date={currentDate}
          onPrev={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
            )
          }
          onNext={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
            )
          }
        />

        <CalendarGrid currentDate={currentDate} data={data} />
      </Container>

      <div className="flex flex-col flex-2 gap-6 min-w-[300px]">
        <PopupSummary />
        <PopupOverview />
      </div>
    </div>
  );
};

export default YearlyCalendar;
