import { brokersApi } from "@shared/api/brokers.api";

export const brokersService = {
  async fetchStatus(broker) {
    return brokersApi.getStatus(broker);
  },

  async connect(broker) {
    const res = await brokersApi.connect(broker);
    window.location.href = res.url;
  },

  async disconnect(broker) {
    return brokersApi.disconnect(broker);
  },
};
