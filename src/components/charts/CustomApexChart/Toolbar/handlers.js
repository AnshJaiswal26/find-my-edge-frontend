import { useChartStore } from "@stores";

export const handleZoomIn = (updater, chartId) => {
  updater(chartId, (chart) => {
    const prev = chart.live.layout.chartWidth;

    if (prev === 1000) return;

    chart.live.layout.chartWidth = typeof prev === "string" ? 200 : prev + 100;
  });
};

export const handleZoomOut = (updater, chartId) => {
  updater(chartId, (chart) => {
    const prev = chart.live.layout.chartWidth;

    if (prev === 100 || typeof prev === "string") return;

    chart.live.layout.chartWidth = prev - 100;
  });
};

export const handleDownloadPNG = (chartId, filename = "apexchart.svg") => {
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
};

export const handleDownloadCSV = (chartId) => {
  const chart = useChartStore.getState()[chartId];
  const { filteredSeries, seriesConfig, xLabelsKey } = chart;

  // Build CSV header
  const headers = [xLabelsKey, ...seriesConfig.map((cfg) => cfg.key)];
  const rows = filteredSeries.map((row) => [
    row[xLabelsKey],
    ...seriesConfig.map((cfg) => row[cfg.key]),
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\n"
  );

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${chartId}_series.csv`;
  link.click();
};

export const handleReset = (chartId, updater) => {
  const originalSeries = useChartStore.getState()[chartId].originalSeries;
  updater(chartId, originalSeries);
};
