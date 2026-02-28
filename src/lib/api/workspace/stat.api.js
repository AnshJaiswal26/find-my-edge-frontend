import { apiFetch } from "../client";

export const statApi = {
  create: (page, data) =>
    apiFetch(`api/workspace/${page}/stats`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: (page) => apiFetch(`api/workspace/${page}/stats`),

  update: (page, id, data) =>
    apiFetch(`api/workspace/${page}/stats/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (page, id) =>
    apiFetch(`api/workspace/${page}/stats/${id}`, {
      method: "DELETE",
    }),

  updateOrder: (page, order) =>
    apiFetch(`api/workspace/${page}/stats/order`, {
      method: "PUT",
      body: JSON.stringify(order),
    }),
};
