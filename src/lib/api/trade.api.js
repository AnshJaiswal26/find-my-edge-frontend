import { apiFetch } from "./client";

export const tradeApi = {
  getAll: () => apiFetch("/api/trades"),

  create: (data) =>
    apiFetch(`/api/trades`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiFetch(`/api/trades/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiFetch(`/api/trades/${id}`, {
      method: "DELETE",
    }),
};
