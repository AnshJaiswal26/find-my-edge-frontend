import { useCallback, useMemo } from "react";
import { useChartStore } from "@stores";
import { configGenerator } from "../configs";

export default function useChartCfgGenerator({ chartId, chartRef, type }) {
  const layout = useChartStore((s) => s.charts[chartId].layout);
  const filteredSeries = useChartStore((s) => s.charts[chartId].filteredSeries);
  const seriesConfig = useChartStore((s) => s.charts[chartId].seriesConfig);

  // --- Tooltip callback ---
  const tooltipCallBack = useCallback((seriesValue, index, w) => {
    const { filteredSeries, xLabelsKey, seriesConfig } =
      useChartStore.getState().charts[chartId];

    if (type === "bar") {
      return {
        title: filteredSeries?.[index]?.[xLabelsKey],
        dataArray: seriesValue?.map((value, i) => {
          if (
            layout.selectedLegendIndex !== null &&
            layout.selectedLegendIndex !== i
          )
            return null;
          const { color, label } = seriesConfig[i].colors.reduce((a, r) => {
            if (r.from <= value && value <= r.to) {
              a.color = r.color;
              a.label = r.label;
            }
            return a;
          }, {});
          return {
            value: layout.yLabelPrefix + value + layout.yLabelSuffix,
            label,
            color,
          };
        }),
      };
    }

    // line / area tooltip
    return {
      title: filteredSeries[index][xLabelsKey],
      dataArray: seriesValue.map((value, i) => {
        if (
          layout.selectedLegendIndex != null &&
          layout.selectedLegendIndex !== i
        )
          return;

        return {
          value: layout.yLabelPrefix + value + layout.yLabelSuffix,
          label: seriesConfig[i].name,
          color: seriesConfig[i].color,
        };
      }),
    };
  }, []);

  const options = useMemo(
    () =>
      configGenerator?.[type]({
        chart: useChartStore.getState().charts[chartId],
        chartRef,
        chartId,
        tooltipCallBack,
      }),
    [layout, seriesConfig, filteredSeries]
  );

  // --- Series ---
  const computedSeries =
    type === "bar"
      ? layout.selectedLegendIndex !== null
        ? [
            {
              name: seriesConfig[layout.selectedLegendIndex].name,
              data: filteredSeries.map(
                (d) => d[seriesConfig[layout.selectedLegendIndex].key]
              ),
              color: ({ value }) =>
                seriesConfig[layout.selectedLegendIndex].colors.reduce(
                  (a, r) => {
                    r.from <= value && value <= r.to && (a = r.color);
                    return a;
                  },
                  "var(--color-default)"
                ),
            },
          ]
        : seriesConfig.map((s, i) => {
            return {
              name: s.name,
              data: filteredSeries.map((d) => d?.[s.key]),
              color: ({ value }) =>
                s.colors.reduce((a, r) => {
                  r.from <= value && value <= r.to && (a = r.color);
                  return a;
                }, "var(--color-default)"),
            };
          })
      : type === "line"
      ? layout.selectedLegendIndex !== null
        ? [
            {
              name: seriesConfig[layout.selectedLegendIndex].name,
              data: filteredSeries.map(
                (d) => d[seriesConfig[layout.selectedLegendIndex].key]
              ),
              color: seriesConfig[layout.selectedLegendIndex].color,
            },
          ]
        : seriesConfig.map((s, i) => {
            return {
              name: s.name,
              data: filteredSeries.map((d) => d?.[s.key]),
              color: s.color,
            };
          })
      : type === "radialBar"
      ? layout.selectedLegendIndex !== null
        ? [
            filteredSeries[layout.selectedLegendIndex][
              seriesConfig[layout.selectedLegendIndex].key
            ],
          ]
        : seriesConfig.map((s, i) => {
            return filteredSeries[i][s.key];
          })
      : null;

  return { options, computedSeries, seriesConfig, layout };
}
