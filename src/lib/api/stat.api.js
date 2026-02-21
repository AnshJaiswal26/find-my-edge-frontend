import { apiFetch } from "./client";

export const statApi = {
  create: (page, data) =>
    apiFetch(`/workspace/${page}/stats`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: (page) => apiFetch(`/workspace/${page}/stats`),

  update: (page, id, data) =>
    apiFetch(`/workspace/${page}/stats/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (page, id) =>
    apiFetch(`/workspace/${page}/stats/${id}`, {
      method: "DELETE",
    }),

  updateOrder: (page, order) =>
    apiFetch(`/workspace/${page}/stats/order`, {
      method: "PUT",
      body: JSON.stringify(order),
    }),
};
