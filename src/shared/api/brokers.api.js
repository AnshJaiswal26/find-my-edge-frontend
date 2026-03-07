import { apiFetch } from "@lib/api/client";

export const brokersApi = {
  async getStatus(broker) {
    return apiFetch(`api/integrations/${broker}/status`);
  },

  async connect(broker) {
    return apiFetch(`api/integrations/${broker}/connect`);
  },

  async disconnect(broker) {
    return apiFetch(`api/integrations/${broker}/disconnect`, {
      method: "DELETE",
    });
  },
};
