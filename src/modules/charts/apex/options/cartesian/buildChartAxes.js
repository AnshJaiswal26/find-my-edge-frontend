import { formatGroupValue, formatValue } from "@shared/utils";

export const buildChartAxes = ({
  ids,
  seriesSelector,
  layout,
  series,
  mode,
  xMetric,
  groupSelector,
}) => {
  const style = { fontSize: "0.75rem" };

  const xaxis = {
    // categories: ids.map((id, i) => id),
    tooltip: { enabled: !layout.horizontal && layout.xTooltip },
    ...(!layout.horizontal && { tickPlacement: "on" }),
    labels: {
      show: layout.xLabels,
      formatter: (v) => {
        if (v < 0) return;
        const index = v - 1;

        const format = { format: layout.xFormat, decimals: layout.xDecimals };

        if (mode === "SERIES") {
          // console.log(v);
          const item = seriesSelector(ids[index], xMetric.field);
          if (!item) return 0;
          return formatValue(item, xMetric.type, format);
        }

        // if (mode === "GROUP_AGGREGATE") {
        //   return formatGroupValue(meta, xMetric.type, format);
        // }
        const group = groupSelector(ids[index], xMetric.field);
        if (!group) return "";

        return formatGroupValue(group.meta, xMetric.type, format);
      },
      style: { fontSize: style.fontSize, colors: layout.xLabelsColor },
    },
    title: {
      text: layout.xTitleText,
      style: { fontSize: style.fontSize, color: layout.xTitleColor },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  };

  const yaxis = {
    ...(layout.horizontal && { categories: ids.map((_, i) => i) }),
    labels: {
      show: layout.yLabels,
      formatter: (v) =>
        formatValue(v, series[0].type, {
          format: layout.yFormat,
          decimals: layout.yDecimals,
        }),
      style: { fontSize: style.fontSize, colors: layout.yLabelsColor },
    },
    title: {
      text: layout.yTitleText,
      style: { fontSize: style.fontSize, color: layout.yTitleColor },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  };

  return { xaxis, yaxis };
};
