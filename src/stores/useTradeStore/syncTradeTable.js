import { useTableStore } from "@table/store/useTableStore";
import { useTradeStore } from "./useTradeStore";

/* ----------------- SCHEMA → TABLE ----------------- */
useTradeStore.subscribe(
  (s) => [s.schemasById, s.schemasOrder],
  () => {
    useTableStore.getState().hydrateSchema();
    useTableStore.getState().hydrateRows(); // schema changed → rows must rebuild
  },
);

useTradeStore.subscribe(
  (s) => [s.tradesById, s.tradesOrder],
  () => {
    useTableStore.getState().hydrateRows(); // trades only
  },
);
