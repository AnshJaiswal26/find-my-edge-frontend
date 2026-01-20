import { useTableStore } from "@table/store/useTableStore";
import { useTradeStore } from "./useTradeStore";

/* ----------------- SCHEMA → TABLE ----------------- */
useTradeStore.subscribe(
  (s) => [s.schemasById, s.schemaOrder],
  () => {
    useTableStore.getState().hydrateSchema();
    useTableStore.getState().hydrateRows(); // schema changed → rows must rebuild
  },
);

useTradeStore.subscribe(
  (s) => [s.tradesById, s.tradeOrder],
  () => {
    useTableStore.getState().hydrateRows(); // trades only
  },
);
