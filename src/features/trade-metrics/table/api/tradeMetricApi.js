import { apiFetch } from "@lib/api/client";

export const tradeMetricApi = {
  init() {
    return apiFetch("api/trade-metric/init");
  },

  updateColumnWidth(columnId, width) {
    return apiFetch(`api/pages/trade-metric/table/columnWidth/${columnId}`, {
      method: "POST",
      body: width,
    });
  },

  updateHighlightRow(rowId, highlight) {
    return apiFetch(`api/pages/trade-metric/table/highlightRow/${rowId}`, {
      method: "POST",
      body: highlight, // Boolean body
    });
  },
};
