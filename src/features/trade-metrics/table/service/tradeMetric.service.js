import { tradeMetricApi } from "@features/trade-metrics/table/api/tradeMetricApi";

export const tradeMetricService = {
  async init() {
    return tradeMetricApi.init();
  },

  async updateColumnWidth(columnId, width) {
    return tradeMetricApi.updateColumnWidth(columnId, width);
  },

  async updateHighlightRow(rowId, highlight) {
    return tradeMetricApi.updateHighlightRow(rowId, highlight);
  },
};
