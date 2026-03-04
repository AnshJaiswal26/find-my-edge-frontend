import { brokersApi } from "@shared/api/brokers.api";

const BASE_URL = import.meta.env.VITE_BASE_API_URL;

export const brokersService = {
  async fetchStatus(broker) {
    return brokersApi.getStatus(broker);
  },

  connect(broker) {
    window.location.href = `${BASE_URL}/api/integrations/${broker}/connect`;
  },

  async disconnect(broker) {
    return brokersApi.disconnect(broker);
  },
};
