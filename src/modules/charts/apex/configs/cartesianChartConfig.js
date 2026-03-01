import { useChartStore } from "@modules/charts/apex/store";
import { customTooltip } from "../tooltip/customTooltip";
import { formatGroupValue, formatValue } from "@shared/utils";

export const cartesianChartConfig = ({
  chart,
  chartId,
  data,
  tooltipCallback,
  mode,
}) => {
  const config = chart.layout;
  const xKey = chart.xSeriesConfig.key;

  const style = { fontSize: "0.75rem" };

  const axisX = {
    tooltip: { enabled: !config.horizontal && config.xTooltip },
    ...(!config.horizontal && { tickPlacement: "on" }),
    labels: {
      show: config.xLabels,
      formatter: (v) => {
        if (v < 0) return;
        const item = data[v - 1];
        if (!item) return;

        const format = { format: config.xFormat, decimals: config.xDecimals };

        //  GROUP AGGREGATE
        if (mode === "GROUP_AGGREGATE") {
          return formatGroupValue(item.meta, chart.xSeriesConfig.type, format);
        }
        //  SERIES / GROUP_SELECT
        return formatValue(
          item.values?.[xKey],
          chart.xSeriesConfig.type,
          format,
        );
      },

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
    ...(config.horizontal && { categories: data.map((_, i) => i) }),

    labels: {
      show: config.yLabels,
      offsetY: 4,
      offsetX: -6,
      formatter: (v) =>
        formatValue(v, chart.ySeriesConfig[0].type, {
          format: config.yFormat,
          decimals: config.yDecimals,
        }),
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
      id: chartId,
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
            const startIndex = Number(selection.dataset.startIndex);

            if (startIndex === dataPointIndex) return;

            // Allow both forward and reverse selection
            const [from, to] = [
              Math.min(startIndex, dataPointIndex),
              Math.max(startIndex, dataPointIndex),
            ];

            state.updateSelection(chartId, from, to + 1);

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
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      xaxis: { lines: { show: config.xGrid } },
      yaxis: { lines: { show: config.yGrid } },
    },
    tooltip: {
      enabled: config.tooltip,
      intersect: false,
      followCursor: true,
      custom: customTooltip(tooltipCallback),
    },

    dataLabels: {
      enabled: config.dataLabels,
      style: { fontSize: style.fontSize },
      ...(chart.meta.type === "bar" && {
        offsetY: 7,
        position: "middle",
      }),
    },
    xaxis: axisX,
    yaxis: axisY,
    legend: { show: false },
  };
};
