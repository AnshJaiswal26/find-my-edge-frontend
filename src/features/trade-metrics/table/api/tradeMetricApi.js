import { apiFetch } from "@lib/api/client";

export const tradeMetricApi = {
  init() {
    return apiFetch("api/trade-metric/init");
  },

  updateColumnWidth(columnId, width) {
    return apiFetch(`api/pages/trade-metric/table/columns/${columnId}/width`, {
      method: "PATCH",
      body: width,
    });
  },

  updateHighlightRow(rowId, highlight) {
    return apiFetch(`api/pages/trade-metric/table/rows/${rowId}/highlight`, {
      method: "PATCH",
      body: highlight, // Boolean body
    });
  },
};
