import { apiFetch } from "@lib/api/client";

export const tradeApi = {
  getAll: () => apiFetch("api/trades"),

  create: (data) =>
    apiFetch("api/trades", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiFetch(`api/trades/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiFetch(`api/trades/${id}`, {
      method: "DELETE",
    }),

  fullSync: (broker) =>
    apiFetch(`api/trades/${broker}/sync/full`, {
      method: "POST",
    }),

  incrementalSync: (broker) =>
    apiFetch(`api/trades/${broker}/sync/incremental`, {
      method: "POST",
    }),

  customSync: (broker, fromDate, toDate) =>
    apiFetch(`api/trades/${broker}/sync/custom`, {
      method: "POST",
      params: { fromDate, toDate },
    }),
};
