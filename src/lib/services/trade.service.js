import { tradeApi } from "@lib/api/trade.api";
import { formatForInput, parseInputValue } from "@shared/utils";
import { SCHEMA_SOURCE } from "@lib/analytics/schema";

/* ---------------- HELPERS ---------------- */

const transformTradeForBackend = (trade, schemasById) => {
  const cleanTrade = {};

  Object.keys(trade).forEach((key) => {
    if (key === "id") return;

    const schema = schemasById[key];
    cleanTrade[key] = formatForInput(trade[key], schema?.semanticType);
  });

  return cleanTrade;
};

/*  Parse trades from backend */
const parseTradesFromBackend = (trades, schemasById, schemasOrder) => {
  const tradesById = {};
  const derivedByTradeId = {};
  const tradesOrder = [];

  trades.forEach((t) => {
    const id = t.id || crypto.randomUUID();
    const trade = {};
    const derived = {};

    schemasOrder.forEach((schemaId) => {
      const schema = schemasById[schemaId];
      if (!schema) return;

      if (schema.source !== SCHEMA_SOURCE.COMPUTED) {
        trade[schema.id] = parseInputValue(t[schema.id], schema.semanticType);
      } else {
        derived[schema.id] = null; // computed placeholder
      }
    });

    tradesById[id] = { id, ...trade };
    derivedByTradeId[id] = derived;
    tradesOrder.push(id);
  });

  return { tradesById, derivedByTradeId, tradesOrder };
};

/* ---------------- SERVICE ---------------- */

export const tradeService = {
  /* -------- GET ALL  -------- */
  async getAll() {
    const trades = await tradeApi.getAll();

    return trades;
  },

  parse: parseTradesFromBackend,

  /* -------- CREATE -------- */
  async create(trade) {
    if (!trade?.id) throw new Error("Trade must have id");
    return tradeApi.create(trade);
  },

  /* -------- UPDATE -------- */
  async update(id, trade, schemasById) {
    if (!id) throw new Error("Trade id required");

    const cleanTrade = transformTradeForBackend(trade, schemasById);
    return tradeApi.update(id, cleanTrade);
  },

  /* -------- DELETE -------- */
  async delete(id) {
    if (!id) throw new Error("Trade id required");
    return tradeApi.delete(id);
  },

  /* -------- BULK SYNC -------- */
  async sync({
    creates = {},
    updates = {},
    deletes = new Set(),
    tradesById,
    schemasById,
  }) {
    await Promise.all(
      Object.values(creates).map((trade) => this.create(trade)),
    );

    await Promise.all(
      Object.keys(updates).map((id) =>
        this.update(id, tradesById[id], schemasById),
      ),
    );

    await Promise.all(Array.from(deletes).map((id) => this.delete(id)));
  },
};
