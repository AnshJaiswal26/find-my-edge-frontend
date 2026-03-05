import { brokersService } from "@shared/services/brokers.service";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useUIStore } from "./useUIStore";

import { Brokers } from "@features/integrations/brokers/config";

export const useIntegrationStore = create(
  immer((set, get) => ({
    brokers: {
      [Brokers.DHAN.key]: {
        loading: false,
        status: null,
        connectionStatus: null,
        connectedAt: null,
      },
      [Brokers.ZERODHA.key]: {
        connected: false,
        isTokenValid: false,
        loading: false,
      },

      initializing: true,
      initialized: false,
    },

    fetchConnectionStatus: async (broker, force = false) => {
      if (get().initialized && !force) return;

      set((s) => {
        s.brokers[broker].loading = true;
      });

      try {
        const res = await brokersService.fetchStatus(broker);

        set((s) => {
          s.brokers[broker].status = res.status;
          s.brokers[broker].connectedAt = res.connectedAt;
          s.brokers.initialized = true;
        });
      } catch (err) {
        useUIStore
          .getState()
          .showToast("ERROR", "Failed to fetch broker status");
      } finally {
        set((s) => {
          s.brokers[broker].loading = false;
          s.brokers.initializing = false;
        });
      }
    },

    connectBroker: (broker) => {
      set((s) => {
        s.brokers[broker].loading = true;
      });

      brokersService.connect(broker); // redirect → browser leaves page
    },

    disconnectBroker: async (broker) => {
      set((s) => {
        s.brokers[broker].loading = true;
      });

      await brokersService.disconnect(broker);

      set((s) => {
        s.brokers[broker].loading = false;
        s.brokers[broker].connected = false;
        s.brokers[broker].isTokenValid = false;
      });
    },
  })),
);
