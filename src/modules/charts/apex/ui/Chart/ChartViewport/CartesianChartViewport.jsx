// import {
//   useApexEffects,
//   useSeriesChartConfig,
// } from "@modules/charts/apex/hooks";
// import { formatValue } from "@shared/utils";
// import { useCallback, useMemo } from "react";
// import ReactApexChart from "react-apexcharts";

// export function CartesianChartViewport(props) {
//   const { seriesById, seriesOrder, schemasById, groups, selectedGroupIndex } =
//     props;
//   const { options, series } = useSeriesChartConfig(props);

//   const type = props.layout.area && props.type === "line" ? "area" : props.type;

//   useApexEffects({ ...props, series });

//   const getIds = useCallback(
//     (mode) => {
//       if (mode === "SERIES") return seriesOrder;
//       if (mode === "GROUP_SELECT")
//         return groups ? groups[selectedGroupIndex].tradeIds : [];
//     },
//     [seriesById, seriesOrder, groups, selectedGroupIndex],
//   );

//   const valueSelector = useCallback(
//     (id, metric) => {
//       const value = seriesById[id][metric] ?? 0;
//       const type = schemasById[metric]?.type;

//       formatValue(value, xSeriesConfig.type, {
//         format: layout.xFormat,
//         decimals: layout.xDecimals,
//       });
//       return seriesById[id][metric] ?? 0;
//     },
//     [seriesById],
//   );

//   // <CartesianChartViewport2
//   //   idsSelector={getIds}
//   //   seriesSelector={valueSelector}
//   // />;

//   return (
//     <ReactApexChart
//       options={options}
//       series={series}
//       type={type}
//       height="100%"
//       width="100%"
//     />
//   );
// }

import { useEffect, useRef } from "react";
import { chartEngine } from "../../../model/chartEngine";
import { useChartStore } from "@modules/charts/apex/store";

export function CartesianChartViewport({
  chartId,
  ids,
  seriesSelector,
  groupSelector,
  groups,
  groupSpec,
  selectedGroupIndex,
}) {
  const containerRef = useRef(null);

  /* ---------------- CREATE CHART ---------------- */

  useEffect(() => {
    if (!containerRef.current) return;

    chartEngine.create(containerRef.current, chartId, useChartStore, {
      ids,
      seriesSelector,
      groupSelector,
      groups,
      groupSpec,
      selectedGroupIndex,
    });

    return () => chartEngine.destroy(chartId);
  }, [chartId]);

  /* ---------------- DATA UPDATE ---------------- */

  useEffect(() => {
    chartEngine.update(chartId);
  }, [ids, selectedGroupIndex]);

  return <div ref={containerRef} className="h-full w-full" />;
}
