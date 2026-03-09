import { tradeApi } from "@shared/api/trade.api";

/* ---------------- SERVICE ---------------- */

export const tradeService = {
  /* -------- GET ALL  -------- */
  async getAll() {
    const trades = await tradeApi.getAll();

    return trades;
  },

  /* -------- CREATE -------- */
  async create(trade) {
    if (!trade?.id) throw new Error("Trade must have id");
    return tradeApi.create(trade);
  },

  /* -------- UPDATE -------- */
  async update(id, trade) {
    if (!id) throw new Error("Trade id required");

    return tradeApi.update(id, trade);
  },

  async updateValue(id, field, value) {
    if (!id) throw new Error("Trade id required");
    return tradeApi.updateValue(id, field, value);
  },

  /* -------- DELETE -------- */
  async delete(id) {
    if (!id) throw new Error("Trade id required");
    return tradeApi.delete(id);
  },

  async syncAllTradesFromBroker() {
    return tradeApi.syncAllTradesFromBroker();
  },

  /* -------- BULK SYNC -------- */
  async sync({ creates = {}, updates = {}, deletes = new Set() }) {
    const requests = [];

    // creates
    for (const trade of Object.values(creates)) {
      requests.push(this.create(trade));
    }

    // updates (only fields)
    for (const [tradeId, fields] of Object.entries(updates)) {
      for (const [field, value] of Object.entries(fields)) {
        requests.push(this.updateValue(tradeId, field, value));
      }
    }

    // deletes
    for (const id of deletes) {
      requests.push(this.delete(id));
    }

    return Promise.all(requests);
  },
};
