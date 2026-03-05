import { tradeApi } from "@shared/api/trade.api";

export const tradeSyncService = {
  async fullSync(broker) {
    const res = await tradeApi.fullSync(broker);
    return res;
  },

  async incrementalSync(broker) {
    const res = await tradeApi.incrementalSync(broker);
    return res;
  },

  async customSync(broker, fromDate, toDate) {
    const res = await tradeApi.customSync(broker, fromDate, toDate);
    return res;
  },
};
