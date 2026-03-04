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

  /* -------- DELETE -------- */
  async delete(id) {
    if (!id) throw new Error("Trade id required");
    return tradeApi.delete(id);
  },

  /* -------- BULK SYNC -------- */
  async sync({ creates = {}, updates = {}, deletes = new Set(), tradesById }) {
    await Promise.all(
      Object.values(creates).map((trade) => this.create(trade)),
    );

    await Promise.all(
      Object.keys(updates).map((id) => this.update(id, tradesById[id])),
    );

    await Promise.all(Array.from(deletes).map((id) => this.delete(id)));
  },
};
