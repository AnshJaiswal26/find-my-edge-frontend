import { tradeData } from "@data";
import { columnsById } from "@table/data";
import { parseInputValue } from "@utils";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const useTradeStore = create(
  immer((set, get) => ({
    tradesById: {},
    tradeOrder: [],
    isLoading: false,

    schemasById: { ...columnsById },
    schemaOrder: Object.keys(columnsById),

    async fetchTrades() {
      const { schemasById, schemaOrder } = get();

      set({ isLoading: true });

      // const res = await fetch("http://localhost:8080/api/trades");

      // if (!res.ok) {
      //   throw new Error("Failed to fetch trades");
      // }

      // const trades = await res.json();

      const tradesById = {};
      const tradeOrder = [];

      tradeData.forEach((t) => {
        const id = crypto.randomUUID();
        const trade = {};

        schemaOrder.forEach((schemaId) => {
          const schema = schemasById[schemaId];

          if (!schema.type.includes("computed"))
            trade[schema.id] = parseInputValue(t[schema.id], schema.type);
        });

        tradesById[id] = { id, ...trade };
        tradeOrder.push(id);
      });

      set({ tradesById, tradeOrder, isLoading: false });
    },

    getChangesSince(lastSeenVersion) {
      const { tradeVersions, schemaVersions } = get();

      const changedTrades = Object.keys(tradeVersions).filter(
        (id) => tradeVersions[id] > lastSeenVersion,
      );

      const changedSchemas = Object.keys(schemaVersions).filter(
        (id) => schemaVersions[id] > lastSeenVersion,
      );

      return { changedTrades, changedSchemas };
    },

    addTrade(trade, id) {
      set((s) => {
        s.tradesById[id] = { id, ...trade };
        s.tradeOrder.push(id);
      });
    },

    updateTrade(id, patch) {
      set((s) => {
        Object.assign(s.tradesById[id], patch);
      });
    },

    deleteTrade(id) {
      set((s) => {
        delete s.tradesById[id];
        s.tradeOrder = s.tradeOrder.filter((x) => x !== id);
      });
    },

    updateSchemaOrder(order) {
      set((s) => {
        s.schemaOrder = order;
      });
    },

    addSchema(schema) {
      set((s) => {
        s.schemasById[schema.id] = schema;
        s.schemaOrder.push(schema.id);
      });
    },

    updateSchema(id, draft) {
      set((s) => {
        Object.assign(s.schemasById[id], draft);
      });
    },

    deleteSchema(id) {
      set((s) => {
        delete s.schemasById[id];
        s.schemaOrder = s.schemaOrder.filter((x) => x !== id);
      });
    },
  })),
);
