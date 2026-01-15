import { tradeData } from "@data";

export const createCoreSlice = (set, get) => ({
  seriesById: {},
  seriesOrder: [],

  initDemoData() {
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
