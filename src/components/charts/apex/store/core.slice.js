import { createChart } from "../model/factory";

export const createCoreSlice = (set, get) => ({
  seriesById: {},
  seriesOrder: [],

  loadInitialCharts() {
    const { order, seriesById, seriesOrder } = get();
    if (order.length > 0) return;

    const seriesConfig = [
      {
        key: "Wins",
        name: "Wins",
        tooltipLabel: "Wins",
        color: "var(--info)",
      },
      {
        key: "Loses",
        name: "Loses",
        tooltipLabel: "Loses",
        color: "var(--warning)",
      },
    ];

    const map = {
      bar: createChart("bar", {
        layout: {
          xTitleText: "Trades",
          yTitleText: "Risk/Reward",
          yLabelPrefix: "1:",
          title: "P&L Booked on Risk/Reward",
        },
        x: { key: "date", name: "Date" },
        y: [
          {
            key: "riskReward",
            name: "Risk/Reward",
            colors: [
              {
                from: 0.61,
                to: Number.MAX_SAFE_INTEGER,
                color: "var(--success)",
                tooltipLabel: "Reward Taken",
              },
              {
                from: 0,
                to: 0.6,
                color: "var(--warning)",
                tooltipLabel: "Breakeven",
              },
              {
                from: Number.MIN_SAFE_INTEGER,
                to: -0.01,
                color: "var(--error)",
                tooltipLabel: "Risk Taken",
              },
            ],
          },
        ],
      }),

      line: createChart("line", {
        layout: {
          xTitleText: "Date",
          yTitleText: "Pnl",
          yLabelPrefix: "₹",
          title: "P&L Over Time",
        },
        x: { key: "entryTime", name: "Entry Time" },
        y: [
          {
            key: "pnl",
            name: "Pnl",
            tooltipLabel: "Pnl",
            color: "var(--cyan)",
            markerColor: "var(--cyan)",
            areaColor: "var(--cyan)",
          },
          {
            key: "cumulativePnl",
            name: "Cummulative Pnl",
            tooltipLabel: "Cummulative Pnl",
            color: "var(--warning)",
            markerColor: "var(--warning)",
            areaColor: "var(--warning)",
          },
        ],
      }),

      donut: createChart("donut", {
        seriesConfig,
        series: seriesConfig.map((s) => {
          if (s.key === "Wins") {
            return (
              (seriesOrder.reduce((acc, id) => {
                acc = seriesById[id].pnl > 0 ? acc + 1 : acc;
                return acc;
              }, 0) /
                seriesOrder.length) *
              100
            );
          }
          return (
            (seriesOrder.reduce((acc, id) => {
              acc = seriesById[id].pnl < 0 ? acc + 1 : acc;
              return acc;
            }, 0) /
              seriesOrder.length) *
            100
          );
        }),
      }),

      radialBar: createChart("radialBar", {
        seriesConfig,
        series: seriesConfig.map((s) => {
          if (s.key === "Wins") {
            return (
              (seriesOrder.reduce((acc, id) => {
                acc = seriesById[id].pnl > 0 ? acc + 1 : acc;
                return acc;
              }, 0) /
                seriesOrder.length) *
              100
            );
          }
          return (
            (seriesOrder.reduce((acc, id) => {
              acc = seriesById[id].pnl < 0 ? acc + 1 : acc;
              return acc;
            }, 0) /
              seriesOrder.length) *
            100
          );
        }),
      }),
    };

    console.log(map.donut);

    set((s) => {
      ["bar", "line", "donut", "radialBar"].map((ch) => {
        s[map[ch].meta.id] = map[ch];
        s.order.push({
          id: map[ch].meta.id,
          category: map[ch].meta.category,
          type: map[ch].meta.type,
        });
      });
    });
  },

  deleteChart(chartId) {
    set((s) => {
      delete s[chartId];
      s.order = s.order.filter(({ id }) => id !== chartId);
    });
  },

  zoomInChart(chartId) {
    const prev = get()[chartId].layout.chartWidth;
    if (prev === 1000) return;

    set((s) => {
      s[chartId].layout.chartWidth =
        typeof prev === "string" ? 200 : prev + 100;
    });
  },

  zoomOutChart(chartId) {
    const prev = get()[chartId].layout.chartWidth;
    if (prev === 100 || typeof prev === "string") return;

    set((s) => {
      s[chartId].layout.chartWidth = prev - 100;
    });
  },

  downloadCSV(chartId) {
    const chart = get()[chartId];
    const { filteredSeries, seriesConfig, xLabelsKey } = chart;

    // Build CSV header
    const headers = [xLabelsKey, ...seriesConfig.map((cfg) => cfg.key)];
    const rows = filteredSeries.map((row) => [
      row[xLabelsKey],
      ...seriesConfig.map((cfg) => row[cfg.key]),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${chartId}_series.csv`;
    link.click();
  },

  downloadPNG(chartId, filename = "apexchart.svg") {
    const svg = document
      .getElementById(`apexcharts${chartId}`)
      .querySelector("svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  },
});
