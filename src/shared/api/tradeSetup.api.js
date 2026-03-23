import { apiFetch } from "@lib/api/client";

export const tradeSetupApi = {
  /* -------- CREATE -------- */
  create: (data) =>
    apiFetch(`api/trade-setups`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /* -------- GET ALL -------- */
  getAll: () => apiFetch(`api/trade-setups`),

  /* -------- GET BY ID -------- */
  getById: (setupId) => apiFetch(`api/trade-setups/${setupId}`),

  /* -------- UPDATE -------- */
  update: (setupId, data) =>
    apiFetch(`api/trade-setups/${setupId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  /* -------- DELETE -------- */
  delete: (setupId) =>
    apiFetch(`api/trade-setups/${setupId}`, {
      method: "DELETE",
    }),

  /* -------- ADD FIELD -------- */
  addField: (setupId, data) =>
    apiFetch(`api/trade-setups/${setupId}/fields`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /* -------- UPDATE FIELD -------- */
  updateField: (setupId, fieldId, data) =>
    apiFetch(`api/trade-setups/${setupId}/fields/${fieldId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  /* -------- DELETE FIELD -------- */
  deleteField: (setupId, fieldId) =>
    apiFetch(`api/trade-setups/${setupId}/fields/${fieldId}`, {
      method: "DELETE",
    }),
};
