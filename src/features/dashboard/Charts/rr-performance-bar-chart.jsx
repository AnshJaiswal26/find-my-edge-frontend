import { getBarChartConfig } from "@charts/apex/configs";
import { Badge, Container } from "@layout";
import { IconButton, Pagination } from "@ui";
import { tradeData } from "@data";
import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { Filter, FunctionSquareIcon, Pin, Plus, Settings2 } from "lucide-react";

function RRPerformanceBarChart({ data, theme, isSidebarOpen }) {
  const rrData = tradeData.map(({ pnl, risk }) => ({
    rr: +parseFloat(pnl / risk).toFixed(2) || 0,
  }));

  const [paginatedData, setPaginatedData] = useState(rrData);
  const [categories, setCategories] = useState(
    paginatedData.map((_, i) => `Trade ${i + 1}`)
  );

  const rrSeries = paginatedData.map((item) => item.rr);

  const best = Math.max(...rrSeries);
  const worst = Math.min(...rrSeries);

  const handlePageChange = ({ pages, currentPage, paginatedData }) => {
    setPaginatedData(paginatedData);

    const isFullSize = paginatedData.length === rrData.length;
    setCategories(
      paginatedData.map((_, idx) =>
        isFullSize
          ? `Trade ${idx + 1}`
          : `Trade ${currentPage * pages + idx + 1}`
      )
    );
  };

  const customTooltipCallback = (seriesValue, dataPointIndex) => {
    const value = rrSeries[dataPointIndex];
    const category = categories[dataPointIndex];
    const isProfit = value >= 0.6;
    const isBreakeven = value <= 0.59999 && value >= 0;

    const color = isProfit ? "#05ab72" : isBreakeven ? "#f8c75f" : "#fe5a5a";
    return {
      title: category,
      dataArray: [
        {
          label: isProfit
            ? "Reward Taken: "
            : isBreakeven
            ? "Breakeven: "
            : "Risk Taken: ",
          value: value.toFixed(2),
          color: color,
        },
      ],
    };
  };

  const apexOptions = useMemo(
    () =>
      getBarChartConfig({
        horizontal: false,
        customTooltipCallback,
        conditionalColorRange: [
          { from: 0.6, to: 100, color: "#05ab72" },
          { from: 0, to: 0.59999, color: "#f8c75f" },
          { from: -100, to: -0.00001, color: "#fe5a5a" },
        ],
        dataLabels: {
          enabled: paginatedData.length !== rrData.length,
          style: { fontSize: "0.75rem" },
        },
        xaxis: {
          categories:
            paginatedData.length === rrData.length
              ? [...categories, , , , ,]
              : categories,
          labels: { show: false, style: { fontSize: "0.75rem" } },
        },
        yaxis: {
          labels: { style: { fontSize: "0.75rem" } },
        },
      }),
    [categories, theme, isSidebarOpen]
  );

  const apexSeries = [{ data: rrSeries }];

  const IconCmpt = [
    { icon: Pin, title: "Pin Chart" },
    { icon: Settings2, title: "Chart Settings" },
    { icon: FunctionSquareIcon, title: "Custom Function" },
    { icon: Plus, title: "Add Stats" },
    { icon: Filter, title: "Filter Series" },
  ];

  return (
    <Container
      title={"P&L Booked on Risk/Reward"}
      childClassName="flex-row flex-wrap"
    >
      <div className="flex-[3.5]">
        <div className="flex items-center justify-between bg-[#191f2a] pl-2  rounded-[4px] select-none">
          <Pagination
            pages={10}
            onPageChange={handlePageChange}
            data={rrData}
          />
          <div className="flex-box gap-0">
            {IconCmpt.map((item, index) => (
              <IconButton
                key={index}
                className={"rounded-none"}
                icon={<item.icon size={17} />}
                tooltip={{ show: true, title: item.title, position: "top" }}
              />
            ))}
          </div>
        </div>
        <div className="min-w-[600px] h-full">
          <Chart
            options={apexOptions}
            series={apexSeries}
            type="bar"
            height={"400px"}
            width={"100%"}
          />
        </div>
      </div>

      <div className="flex-box flex-col rounded-[4px] bg-[#191f2a] p-5 flex-1 mt-[-50px]">
        <div className="flex-box">
          <Badge
            value={best}
            label={"Best: "}
            formatter={(v) => (v < 0 ? v : `1 : ${v}`)}
          />
          <Badge value={worst} label={"Worst: "} />
        </div>
      </div>
    </Container>
  );
}

export default RRPerformanceBarChart;
