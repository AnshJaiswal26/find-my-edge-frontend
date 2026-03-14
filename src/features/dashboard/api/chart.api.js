import { apiFetch } from "@lib/api/client";

export const chartApi = {
  /* -------- CREATE -------- */
  create: (page, data) =>
    apiFetch(`api/pages/${page}/charts`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /* -------- GET ALL -------- */
  getAll: (page) => apiFetch(`api/pages/${page}/charts`),

  /* -------- GET BY ID -------- */
  getById: (page, chartId) => apiFetch(`api/pages/${page}/charts/${chartId}`),

  /* -------- UPDATE -------- */
  update: (page, chartId, data) =>
    apiFetch(`api/pages/${page}/charts/${chartId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  /* -------- DELETE -------- */
  delete: (page, chartId) =>
    apiFetch(`api/pages/${page}/charts/${chartId}`, {
      method: "DELETE",
    }),

  /* -------- UPDATE LAYOUT -------- */
  updateLayout: (page, chartId, layout) =>
    apiFetch(`api/pages/${page}/charts/${chartId}/layout`, {
      method: "PATCH",
      body: JSON.stringify(layout),
    }),

  /* -------- UPDATE SERIES -------- */
  updateSeries: (page, chartId, series) =>
    apiFetch(`api/pages/${page}/charts/${chartId}/series`, {
      method: "PATCH",
      body: JSON.stringify(series),
    }),
};
