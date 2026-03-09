import {
  useApexEffects,
  useSeriesChartConfig,
} from "@modules/charts/apex/hooks";
import { formatValue } from "@shared/utils";
import { useCallback, useMemo } from "react";
import ReactApexChart from "react-apexcharts";

export function CartesianChartViewport(props) {
  const { seriesById, seriesOrder, schemasById, groups, selectedGroupIndex } =
    props;
  const { options, series } = useSeriesChartConfig(props);

  const type = props.layout.area && props.type === "line" ? "area" : props.type;

  useApexEffects({ ...props, series });

  const getIds = useCallback(
    (mode) => {
      if (mode === "SERIES") return seriesOrder;
      if (mode === "GROUP_SELECT")
        return groups ? groups[selectedGroupIndex].tradeIds : [];
    },
    [seriesById, seriesOrder, groups, selectedGroupIndex],
  );

  const valueSelector = useCallback(
    (id, metric) => {
      const value = seriesById[id][metric] ?? 0;
      const type = schemasById[metric]?.type;

      formatValue(value, xSeriesConfig.type, {
        format: layout.xFormat,
        decimals: layout.xDecimals,
      });
      return seriesById[id][metric] ?? 0;
    },
    [seriesById],
  );

  <CartesianChartViewport2
    idsSelector={getIds}
    seriesSelector={valueSelector}
  />;

  return (
    <ReactApexChart
      options={options}
      series={series}
      type={type}
      height="100%"
      width="100%"
    />
  );
}

export function CartesianChartViewport2({ seriesSelector }) {
  const { options, series } = useSeriesChartConfig(props);

  const type = props.layout.area && props.type === "line" ? "area" : props.type;

  useApexEffects({ ...props, series });

  return (
    <ReactApexChart
      options={options}
      series={series}
      type={type}
      height="100%"
      width="100%"
    />
  );
}
