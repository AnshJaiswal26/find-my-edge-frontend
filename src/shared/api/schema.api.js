import { apiFetch } from "../../lib/api/client";

export const schemaApi = {
  create: (data) =>
    apiFetch("api/schema", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: () => apiFetch("api/schema"),

  update: (id, data) =>
    apiFetch(`api/schema/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiFetch(`api/schema/${id}`, {
      method: "DELETE",
    }),

  updateOrder: (order, viewType) =>
    apiFetch("api/schema/order", {
      method: "PUT",
      body: JSON.stringify({
        order,
        viewType,
      }),
    }),
};
