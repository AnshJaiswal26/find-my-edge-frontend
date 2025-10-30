import { useChartStore } from "@stores";
import { customTooltip } from "../../../utils/chartConfigs/customTooltip";

export const cartesianChartConfig = ({
  chart,
  chartId,
  chartRef,
  tooltipCallBack,
}) => {
  const config = chart.layout;
  const series = chart.filteredSeries;

  const style = { fontSize: "0.75rem" };

  const isPrefix = config.xLabelPrefixIndexing && config.xLabelsKey !== "";
  const isSuffix = config.xLabelSuffixIndexing && config.xLabelsKey !== "";

  const formatterX = (v) => {
    return `${isPrefix ? v : ""}${config.xLabelPrefix}${
      v === 0 ? "" : series[v - 1]?.[config.xLabelsKey] || v
    }${config.xLabelSuffix}${isSuffix ? v : ""}`;
  };

  const formatterY = (v) => `${config.yLabelPrefix}${v}${config.yLabelSuffix}`;

  const axisX = {
    categories: series.map((s) => s[config.xLabelsKey] || ""),
    tooltip: { enabled: !config.horizontal && config.xTooltip },
    labels: {
      show: config.xLabels,
      formatter: formatterX,
      style: { fontSize: style.fontSize, colors: config.xLabelsColor },
    },
    title: {
      text: config.xTitleText,
      style: { fontSize: style.fontSize, color: config.xTitleColor },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  };

  const axisY = {
    labels: {
      show: config.yLabels,
      offsetY: 4,
      offsetX: -6,
      formatter: formatterY,
      style: { fontSize: style.fontSize, colors: config.yLabelsColor },
    },
    title: {
      text: config.yTitleText,
      offsetX: 6,
      style: { fontSize: style.fontSize, color: config.yTitleColor },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  };

  return {
    chart: {
      fontFamily: "inherit",
      toolbar: { show: true, tools: { download: true, selection: false } },
      zoom: { enabled: false },
      selection: { enabled: false },
      events: {
        click: (e, t, { dataPointIndex }) => {
          const state = useChartStore.getState();
          const chart = state.charts[chartId];
          const isSelecting = chart.layout.selection;
          if (!isSelecting) return;

          const svgRect = t.el.getBoundingClientRect();
          const gridRect = t.el
            .querySelector(".apexcharts-grid")
            ?.getBoundingClientRect();
          if (!gridRect) return;

          let selection = t.el.querySelector(".apexcharts-custom-select");

          // --- Start selection ---
          if (!selection) {
            t.el.style.position = "relative";

            selection = document.createElement("div");
            selection.classList.add("apexcharts-custom-select");

            // Base styles
            selection.style.position = "absolute";
            selection.style.backgroundColor = "#89d4ff";
            selection.style.opacity = "0.3";
            selection.style.pointerEvents = "none";

            // Align selection start
            const startX = e.clientX - svgRect.left;
            const startY = e.clientY - svgRect.top;

            if (config.horizontal) {
              selection.style.left = "0px";
              selection.style.width = `${gridRect.width}px`;
              selection.style.top = `${startY}px`;
              selection.dataset.startY = startY;
              selection.style.height = "0px";
            } else {
              selection.style.top = `${gridRect.top - svgRect.top}px`;
              selection.style.height = `${gridRect.height}px`;
              selection.style.left = `${startX}px`;
              selection.dataset.startX = startX;
              selection.style.width = "0px";
            }

            // ✅ Store the starting data index
            selection.dataset.startIndex = dataPointIndex;

            // Add to DOM
            t.el.prepend(selection);
          }

          // --- End selection ---
          else {
            // ✅ Prefer dataset value (fallback to state if missing)
            const startIndex = Number(selection.dataset.startIndex);

            if (startIndex === dataPointIndex) return;

            // Allow both forward and reverse selection
            const [from, to] = [
              Math.min(startIndex, dataPointIndex),
              Math.max(startIndex, dataPointIndex),
            ];

            const filteredSeries = [...chart.filteredSeries];
            const sliced = filteredSeries.slice(from, to + 1);
            const updatedSeries = sliced.length < 1 ? filteredSeries : sliced;

            state.updateChart(chartId, (chart) => {
              chart.filteredSeries = updatedSeries;
            });

            // ✅ Clean up DOM data
            delete selection.dataset.startIndex;
            selection.remove();
          }
        },

        // --- Handle mouse drag / movement ---
        mouseMove: function (e, t) {
          const selection = t.el.querySelector(".apexcharts-custom-select");
          if (!selection) return;
          const svgRect = t.el.getBoundingClientRect();

          const chart = useChartStore.getState().charts[chartId];
          const isSelecting = chart.layout.selection;
          if (!isSelecting) return;

          if (config.horizontal) {
            const startY = parseFloat(selection.dataset.startY);
            const currentY = e.clientY - svgRect.top;
            const height = currentY - startY;

            selection.style.height = `${Math.abs(height)}px`;
            selection.style.top = `${height < 0 ? currentY : startY}px`;
          } else {
            const startX = parseFloat(selection.dataset.startX);
            const currentX = e.clientX - svgRect.left;
            const width = currentX - startX;

            selection.style.width = `${Math.abs(width)}px`;
            selection.style.left = `${width < 0 ? currentX : startX}px`;
          }
        },
        mounted: (chartCtx) => (chartRef.current = chartCtx.el),
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      xaxis: { lines: { show: config.xGrid } },
      yaxis: { lines: { show: config.yGrid } },
      padding: {
        top: 0,
        left: 0,
        bottom: config.xTitleText ? -5 : 15,
        right: 40,
      },
    },
    tooltip: {
      enabled: config.tooltip,
      intersect: false,
      followCursor: true,
      custom: customTooltip(tooltipCallBack),
    },

    dataLabels: {
      enabled: config.dataLabels,
      style: { fontSize: style.fontSize },
    },
    xaxis: axisX,
    yaxis: axisY,
    legend: { show: false },
  };
};
