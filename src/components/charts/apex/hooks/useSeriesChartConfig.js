import { useCallback, useMemo } from "react";
import { useChartStore } from "@charts/apex/store/useChartStore";
import { configGenerator } from "../configs";
import {
  evaluateColorRules,
  FILTER_OPERATION_MAP,
  SORT_OPERATION_MAP,
} from "@utils";
import { seriesTooltipCallback } from "../tooltip/series.tooltip";
import {
  COMPUTATION_MODE,
  computeOverSequence,
} from "@lib/analytics/engine/execute";

const buildSeries = ({
  seriesConfig,
  seriesById,
  filteredOrder,
  mode,
  schemasById,
  type,
  groupSpec,
}) => {
  return seriesConfig.map((s) => {
    /* ------------------ DATA ------------------ */

    const data =
      mode === "GROUP_AGGREGATE"
        ? filteredOrder.map((group) =>
            computeOverSequence({
              schema: { ast: groupSpec.ast },

              getTradeAt: (index) => {
                const id = group.tradeIds[index];
                return id ? seriesById[id] : null;
              },

              getTradeCount: () => group.tradeIds.length,

              getSchemaType: (key) => {
                const schema = schemasById[key];
                return {
                  format: schema?.display?.format,
                  type: schema.semanticType,
                };
              },

              getValue: (trade, key) => trade[key] ?? null,
              setValue: () => null,

              mode: COMPUTATION_MODE.AGGREGATE,
            }),
          )
        : filteredOrder.map((id) => seriesById[id]?.[s.key]);

    /* ------------------ COLOR ------------------ */

    // 🔥 LINE → fixed color
    if (type === "line") {
      return {
        name: s.name,
        data,
        color: s.color,
      };
    }

    // 🔥 BAR → dynamic color rules
    return {
      name: s.name,
      data,
      color: ({ value }) => evaluateColorRules(value, s.colorRules)?.color,
    };
  });
};

export const seriesGenerator = {
  bar: (args) => buildSeries({ ...args, type: "bar" }),
  line: (args) => buildSeries({ ...args, type: "line" }),
};

// const seriesGenerator = {
//   bar: ({ seriesConfig, seriesById, filteredOrder }) => {
//     return seriesConfig.map((s) => ({
//       name: s.name,
//       data: filteredOrder.map((id) => seriesById[id]?.[s.key]),
//       color: ({ value }) => evaluateColorRules(value, s.colorRules)?.color,
//     }));
//   },

//   line: ({ seriesConfig, seriesById, filteredOrder }) => {
//     return seriesConfig.map((s) => ({
//       name: s.name,
//       data: filteredOrder.map((id) => seriesById[id]?.[s.key]),
//       color: s.color,
//     }));
//   },
// };

export default function useSeriesChartConfig({
  chartId,
  layout,
  groups,
  groupSpec,
  selectedGroupIndex,
  seriesOrder,
  seriesById,
  seriesConfig,
  selectedSeriesKeys,
}) {
  const type = useChartStore((s) => s[chartId].meta.type);

  const filters = useChartStore((s) => s[chartId].filters);
  const sort = useChartStore((s) => s[chartId].sort);
  const selection = useChartStore((s) => s[chartId].selection);

  const mode = useMemo(() => {
    if (!groups) return "SERIES";
    if (groupSpec?.ast) return "GROUP_AGGREGATE";
    return "GROUP_SELECT";
  }, [groups, groupSpec]);

  // const finalOrder = useMemo(() => {
  //   let order = groups
  //     ? (groups[selectedGroupIndex ?? 0]?.tradeIds ?? seriesOrder)
  //     : seriesOrder;

  //   /* SELECTION */
  //   if (selection.from !== null && selection.to !== null) {
  //     order = order.slice(selection.from, selection.to);
  //   }

  //   /* FILTER */
  //   if (filters.length) {
  //     order = order.filter((id) =>
  //       filters.some((f) => {
  //         const fn = FILTER_OPERATION_MAP[f.operator];
  //         return fn?.(seriesById[id][f.key], f.value, f.value2);
  //       }),
  //     );
  //   }

  //   /* SORT */
  //   if (sort.key && sort.operator !== "none") {
  //     const fn = SORT_OPERATION_MAP[sort.operator];
  //     order = [...order].sort((a, b) => {
  //       return fn?.(seriesById[a][sort.key], seriesById[b][sort.key]) ?? 0;
  //     });
  //   }

  //   return order;
  // }, [
  //   seriesOrder,
  //   seriesById,
  //   filters,
  //   sort.key,
  //   sort.operator,
  //   selection.from,
  //   selection.to,
  //   selectedGroupIndex,
  //   groups,
  // ]);

  const finalOrder = useMemo(() => {
    /* ------------------ MODE: SERIES ------------------ */
    if (mode === "SERIES") {
      let order = seriesOrder;

      if (selection.from !== null && selection.to !== null) {
        order = order.slice(selection.from, selection.to);
      }

      if (filters.length) {
        order = order.filter((id) =>
          filters.some((f) => {
            const fn = FILTER_OPERATION_MAP[f.operator];
            return fn?.(seriesById[id][f.key], f.value, f.value2);
          }),
        );
      }

      if (sort.key && sort.operator !== "none") {
        const fn = SORT_OPERATION_MAP[sort.operator];
        order = [...order].sort((a, b) => {
          return fn?.(seriesById[a][sort.key], seriesById[b][sort.key]) ?? 0;
        });
      }

      return order;
    }

    /* ------------------ MODE: GROUP_SELECT ------------------ */
    if (mode === "GROUP_SELECT") {
      let order = groups[selectedGroupIndex ?? 0]?.tradeIds ?? [];

      if (selection.from !== null && selection.to !== null) {
        order = order.slice(selection.from, selection.to);
      }

      if (filters.length) {
        order = order.filter((id) =>
          filters.some((f) => {
            const fn = FILTER_OPERATION_MAP[f.operator];
            return fn?.(seriesById[id][f.key], f.value, f.value2);
          }),
        );
      }

      if (sort.key && sort.operator !== "none") {
        const fn = SORT_OPERATION_MAP[sort.operator];
        order = [...order].sort((a, b) => {
          return fn?.(seriesById[a][sort.key], seriesById[b][sort.key]) ?? 0;
        });
      }

      return order;
    }

    /* ------------------ MODE: GROUP_AGGREGATE ------------------ */
    if (mode === "GROUP_AGGREGATE") {
      // ❗ No flattening → return groups directly
      return groups.map((g) => ({
        label: g.label,
        tradeIds: g.tradeIds,
      }));
    }

    return [];
  }, [
    mode,
    seriesOrder,
    seriesById,
    filters,
    sort.key,
    sort.operator,
    selection.from,
    selection.to,
    selectedGroupIndex,
    groups,
  ]);

  const computedSeries = useMemo(() => {
    return seriesGenerator[type]({
      seriesConfig: selectedSeriesKeys
        ? seriesConfig.filter((s) => selectedSeriesKeys.includes(s.key))
        : seriesConfig,
      filteredOrder: finalOrder,
      seriesById,
      mode,
      groupSpec,
    });
  }, [
    type,
    seriesConfig,
    selectedSeriesKeys,
    finalOrder,
    mode,
    groupSpec,
    seriesById,
  ]);

  const tooltipCallback = useCallback(
    (seriesValue, index, seriesIndex) =>
      seriesTooltipCallback({
        seriesValue,
        index,
        seriesIndex,
        chartId,

        getTitle: (i, key) => {
          const item = finalOrder[i];

          // 🔥 GROUP AGGREGATE
          if (mode === "GROUP_AGGREGATE") {
            return item?.label; // show group name (Jan, Feb, etc.)
          }

          // 🔥 SERIES / GROUP_SELECT
          return seriesById?.[item]?.[key];
        },

        selectedSeriesKeys,
      }),
    [chartId, seriesById, finalOrder, selectedSeriesKeys, mode],
  );

  const options = useMemo(() => {
    return configGenerator?.[type]?.({
      chart: useChartStore.getState()[chartId],
      chartId,
      order: finalOrder,
      seriesById,
      selectedSeriesKeys,
      tooltipCallback,
      mode,
    });
  }, [
    type,
    chartId,
    finalOrder,
    seriesById,
    selectedSeriesKeys,
    layout, // if config depends on layout
    layout?.area,
    mode,
  ]);
  console.log(computedSeries, groups, groupSpec);

  return { options, series: computedSeries, type };
}
