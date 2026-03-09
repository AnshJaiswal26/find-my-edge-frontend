import { useMemo } from "react";
import { useChartStore } from "@modules/charts/apex/store";

export const useChartEvents = (chartId, config) => {
  return useMemo(() => {
    return {
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

        if (!selection) {
          t.el.style.position = "relative";

          selection = document.createElement("div");
          selection.classList.add("apexcharts-custom-select");

          selection.style.position = "absolute";
          selection.style.backgroundColor = "#89d4ff";
          selection.style.opacity = "0.3";
          selection.style.pointerEvents = "none";

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

          selection.dataset.startIndex = dataPointIndex;
          t.el.prepend(selection);
        } else {
          const startIndex = Number(selection.dataset.startIndex);
          if (startIndex === dataPointIndex) return;

          const [from, to] = [
            Math.min(startIndex, dataPointIndex),
            Math.max(startIndex, dataPointIndex),
          ];

          state.updateSelection(chartId, from, to + 1);

          delete selection.dataset.startIndex;
          selection.remove();
        }
      },

      mouseMove: (e, t) => {
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
    };
  }, [chartId, config.horizontal]);
};
