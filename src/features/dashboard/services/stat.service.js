import { statApi } from "@features/dashboard/api/stat.api";

/* --------- HELPERS (optional but powerful) --------- */

const validateStat = (stat) => {
  if (!stat?.id) throw new Error("Stat must have an id");
  if (!stat?.ast) throw new Error("Stat must have an AST");
};

/* ---------------- SERVICE ---------------- */

export const statService = {
  /* -------- CREATE -------- */
  async create(page, stat) {
    validateStat(stat);

    // future: enrich stat, normalize, etc.
    return statApi.create(page, stat);
  },

  /* -------- GET ALL -------- */
  async getAll(page) {
    const res = await statApi.getAll(page);
    // normalize response if needed
    return res || {};
  },

  /* -------- UPDATE -------- */
  async update(page, id, updates) {
    if (!id) throw new Error("Stat id is required");

    return statApi.update(page, id, updates);
  },

  /* -------- DELETE -------- */
  async delete(page, id) {
    if (!id) throw new Error("Stat id is required");

    return statApi.delete(page, id);
  },

  /* -------- UPDATE ORDER -------- */
  async updateOrder(page, order) {
    if (!Array.isArray(order)) {
      throw new Error("Order must be an array");
    }

    return statApi.updateOrder(page, order);
  },
};
