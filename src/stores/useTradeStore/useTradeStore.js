import { tradeData } from "@data";
import { columnsById } from "@table/data";
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
      set({ isLoading: true });

      // const res = await fetch("http://localhost:8080/api/trades");

      // if (!res.ok) {
      //   throw new Error("Failed to fetch trades");
      // }

      // const trades = await res.json();

      const trades = tradeData; // demo

      const tradesById = {};
      const tradeOrder = [];

      trades.forEach((t) => {
        const id = crypto.randomUUID();
        tradesById[id] = { id, ...t };
        tradeOrder.push(id);
      });

      set({ tradesById, tradeOrder, isLoading: false });
    },

    addTrade(trade) {
      const id = crypto.randomUUID();
      set((s) => {
        s.tradesById[id] = { id, ...trade };
        s.tradeOrder.push(id);
      });
    },

    updateTrade(id, patch) {
      set((s) => Object.assign(s.tradesById[id], patch));
    },

    deleteTrade(id) {
      set((s) => {
        delete s.tradesById[id];
        s.tradeOrder = s.tradeOrder.filter((x) => x !== id);
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
