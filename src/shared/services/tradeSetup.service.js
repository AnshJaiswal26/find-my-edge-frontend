import { tradeSetupApi } from "../api/tradeSetup.api";

const validateSetupRequest = (setup) => {
  if (!setup?.name?.trim()) {
    throw new Error("setup name is required");
  }
};

/* ---------------- SERVICE ---------------- */

export const tradeSetupService = {
  /* -------- CREATE -------- */
  async create(setup) {
    validateSetupRequest(setup);
    return tradeSetupApi.create(setup);
  },

  /* -------- GET ALL -------- */
  async getAll() {
    const res = await tradeSetupApi.getAll();
    return res || {};
  },

  /* -------- GET BY ID -------- */
  async getById(setupId) {
    if (!setupId) throw new Error("setup id is required");
    return tradeSetupApi.getById(setupId);
  },

  /* -------- UPDATE -------- */
  async update(setupId, updates) {
    if (!setupId) throw new Error("setup id is required");
    return tradeSetupApi.update(setupId, updates);
  },

  /* -------- DELETE -------- */
  async delete(setupId) {
    if (!setupId) throw new Error("setup id is required");
    return tradeSetupApi.delete(setupId);
  },

  /* -------- ADD FIELD -------- */
  async addField(setupId, field) {
    if (!setupId) throw new Error("setup id is required");

    return tradeSetupApi.addField(setupId, field);
  },

  /* -------- UPDATE FIELD -------- */
  async updateField(setupId, fieldId, updates) {
    if (!setupId) throw new Error("setup id is required");
    if (!fieldId) throw new Error("field id is required");

    return tradeSetupApi.updateField(setupId, fieldId, updates);
  },

  /* -------- DELETE FIELD -------- */
  async deleteField(setupId, fieldId) {
    if (!setupId) throw new Error("setup id is required");
    if (!fieldId) throw new Error("field id is required");

    return tradeSetupApi.deleteField(setupId, fieldId);
  },
};
