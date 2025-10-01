import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { ToggleButton } from "@ui";
import { tradeData } from "@data";
import { customTooltip } from "@charts/apex/configs";

function CapitalGrowthLineChart({ data, theme, isSidebarOpen }) {
  const demoData = tradeData.reduce(
    ({ demat, capital, array }, { pnl }, i) => {
      array.push({
        day: `Day ${i + 1}`,
        demat: parseInt(demat),
        capital: parseInt(capital),
        pnl,
      });

      demat = demat + pnl;
      capital = capital + pnl;

      return { demat, capital, array };
    },
    { demat: 15000, capital: 25000, array: [] }
  );

  const [audienceMetricsData, setAudienceMetricsData] = useState(
    demoData.array
  );

  // Pagination logic
  const pageSize = 7;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(audienceMetricsData.length / pageSize);

  const [fullSize, setFullSize] = useState(false);

  const [isDematCapital, setIsTotalCapital] = useState(true);

  const [nextDisabled, setNextDisabled] = useState(false);
  const [prevDisabled, setPrevDisabled] = useState(false);

  const checkPrevButton = () => {
    setPage((p) => Math.max(0, p - 1));
    page === 1 ? setPrevDisabled(true) : setNextDisabled(false);
  };

  const checkNextButton = () => {
    setPage((p) => Math.min(totalPages - 1, p + 1));
    page === totalPages - 2 ? setNextDisabled(true) : setPrevDisabled(false);
  };

  const handleCapitalChange = () => {
    setIsTotalCapital(!isDematCapital);
  };

  const paginatedData = fullSize
    ? audienceMetricsData
    : audienceMetricsData.slice(
        page !== 0 ? page * pageSize - 1 : page * pageSize,
        page * pageSize + pageSize
      );

  const val1 = paginatedData[0].capital;
  const val2 = paginatedData[paginatedData.length - 1].capital;
  const diff = val2 - val1;

  const categories = paginatedData.map((item) => item.day);
  const capitalSeries = paginatedData.map((item) =>
    isDematCapital ? item.demat : item.capital
  );

  const fix = (v) => +parseFloat(v).toFixed(2) || 0;

  const customTooltipCallback = (seriesValue, dataPointIndex) => {
    const pnl = paginatedData[dataPointIndex - 1]?.pnl || 0;
    const isNeg = pnl < 0;
    const returns = `${fix((pnl / capitalSeries[0]) * 100)}%`;
    const color = isNeg ? "var(--color-red)" : "var(--color-green)";

    return {
      title: paginatedData[dataPointIndex].day,
      dataArray: [
        { label: "Captial: ", value: `₹${seriesValue[0]}`, indicator: false },
        { label: "P&L: ", value: `₹${pnl}`, color },
        { label: "Returns: ", value: returns, color },
      ],
    };
  };

  const apexOptions = useMemo(
    () => ({
      chart: {
        type: "line",
        toolbar: { show: false },
        fontFamily: "inherit",
        selection: { enabled: false },
        zoom: { enabled: false },
      },
      grid: {
        strokeDashArray: 3,
        yaxis: { lines: { show: true } },
        xaxis: { lines: { show: false } },
      },
      xaxis: {
        categories,
        labels: {
          show: !fullSize,
          style: {
            fontSize: "12px",
            colors: "var(--apexcharts-axis-labels-color)",
          },
        },
        max: fullSize ? categories.length + 3 : categories.length,
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "12px",
            colors: "var(--apexcharts-axis-labels-color)",
          },
        },
      },
      tooltip: {
        custom: customTooltip(customTooltipCallback),
        style: {
          fontSize: "14px",
          color: "#34495e",
        },
        x: {
          show: true,
          style: {
            fontSize: "12px",
            fontWeight: "700",
            color: "#ddd",
          },
        },
      },
      stroke: {
        curve: "smooth",
        width: 2,
        colors: [val2 > val1 ? "#05ab72" : "#fe5a5a"],
      },
      colors: [val2 > val1 ? "#05ab72" : "#fe5a5a"],
      markers: {
        size: 0,
        strokeWidth: 0,
        hover: { size: 4 },
      },
      legend: { show: false },
      dataLabels: {
        enabled: false,
      },
    }),
    [theme, categories, val1, val2]
  );

  const apexSeries = [
    {
      name: "Capital",
      data: capitalSeries,
    },
  ];

  return (
    <div className="capital-graph-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <h3>Capital Graph From Intial Capital</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span>Growth:</span>
          <span
            className={
              diff > 0
                ? `badge badge-profit ${theme}`
                : `badge badge-loss ${theme}`
            }
          >
            {`${diff > 0 ? "+" : ""}${parseFloat((diff / val1) * 100).toFixed(
              2
            )}%`}
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "16px",
          justifyContent: "space-between",
        }}
      >
        <ToggleButton
          label={["Total Capital", "Demat Capital"]}
          toggleOn={isDematCapital}
          color={"#05ab72"}
          onClick={handleCapitalChange}
          bothSide={true}
        />

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {audienceMetricsData.length > pageSize && (
            <button
              onClick={() => setFullSize((v) => !v)}
              className="show-button"
            >
              {fullSize ? "Show Paginated" : "Show All"}
            </button>
          )}

          {!fullSize && audienceMetricsData.length > pageSize && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => checkPrevButton()}
                className={`prev-button ${
                  prevDisabled || page === 0 ? "disabled" : ""
                }`}
                disabled={prevDisabled || page === 0}
                style={{ marginRight: 8 }}
              >
                Prev
              </button>
              <span>
                Page {page + 1} of {totalPages}
              </span>
              <button
                className={`next-button ${nextDisabled ? "disabled" : ""}`}
                onClick={() => checkNextButton()}
                disabled={nextDisabled}
                style={{ marginLeft: 8 }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <Chart
        options={apexOptions}
        series={apexSeries}
        type="line"
        height={"410px"}
        width={"100%"}
      />
    </div>
  );
}

export default CapitalGrowthLineChart;
