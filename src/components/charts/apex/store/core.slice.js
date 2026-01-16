import { tradeData } from "@data";
import { createChart } from "../model/factory";

export const createCoreSlice = (set, get) => ({
  seriesById: {},
  seriesOrder: [],

  initDemoData() {
    if (get().seriesOrder.length > 0) return;

    const seriesOrder = [];
    const seriesById = {};

    Array.from({ length: 1 }).forEach(() => {
      tradeData.forEach((t) => {
        const id = crypto.randomUUID();

        // const trade = {
        //   date: t.Date,
        //   entryTime: t["Entry Time"],
        //   exitTime: t["Exit Time"],
        //   duration: t.Duration,
        //   symbol: t.Symbol,
        //   entry: t.Entry,
        //   exit: t.Exit,
        //   qty: t.Qty,
        // };

        t.id = id;

        seriesOrder.push(id);
        seriesById[id] = t;
      });
    });

    set({ seriesById, seriesOrder });
  },

  loadInitialCharts() {
    if (get().order.length > 0) return;

    const bar = createChart("bar", {
      layout: {
        xTitleText: "Trades",
        yTitleText: "Risk/Reward",
        yLabelPrefix: "1:",
        title: "P&L Booked on Risk/Reward",
      },
      x: "Date",
      y: [
        {
          key: "Risk/Reward",
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
    });

    const line = createChart("line", {
      layout: {
        xTitleText: "Date",
        yTitleText: "Pnl",
        yLabelPrefix: "₹",
        title: "P&L Over Time",
      },
      x: "Entry Time",
      y: [
        {
          key: "Pnl",
          name: "Pnl",
          tooltipLabel: "Pnl",
          color: "var(--cyan)",
          markerColor: "var(--cyan)",
          areaColor: "var(--cyan)",
        },
        {
          key: "Cummulative Pnl",
          name: "Cummulative Pnl",
          tooltipLabel: "Cummulative Pnl",
          color: "var(--warning)",
          markerColor: "var(--warning)",
          areaColor: "var(--warning)",
        },
      ],
    });

    set((s) => {
      s[bar.meta.id] = bar;
      s[line.meta.id] = line;
      s.order.push({
        id: bar.meta.id,
        category: bar.meta.category,
        type: bar.meta.type,
      });
      s.order.push({
        id: line.meta.id,
        category: line.meta.category,
        type: line.meta.type,
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
