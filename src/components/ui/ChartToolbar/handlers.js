import { useChartStore } from "@stores";

export const handleZoomIn = (updater, ref, chartId) => {
  const prev = useChartStore.getState().charts[chartId].layout.chartWidth;
  if (prev === 1000) return;
  updater(chartId, {
    wrapperWidth: ref.current.getBoundingClientRect().width,
    chartWidth: typeof prev === "string" ? 200 : prev + 100,
  });
};

export const handleZoomOut = (updater, ref, chartId) => {
  const prev = useChartStore.getState().charts[chartId].layout.chartWidth;
  if (prev === 100) return;
  updater(chartId, {
    wrapperWidth: ref.current.getBoundingClientRect().width,
    chartWidth: prev - 100,
  });
};

export const handleDownloadPNG = (chartRef, filename = "apexchart.svg") => {
  if (!chartRef.current) return;

  const svg = chartRef.current.querySelector("svg");
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
  const chart = useChartStore.getState().charts[chartId];
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
  const originalSeries =
    useChartStore.getState().charts[chartId].originalSeries;
  updater(chartId, originalSeries);
};
