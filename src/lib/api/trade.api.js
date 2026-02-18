import { apiFetch } from "./client";

export const tradeApi = {
  getAll: () => apiFetch("/api/trades"),

  update: (id, data) =>
    apiFetch(`/api/trades/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
