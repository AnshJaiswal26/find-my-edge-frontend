import { brokersService } from "@shared/services/brokers.service";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useUIStore } from "./useUIStore";

import {
  Brokers,
  ConnectionStatus,
} from "@features/integrations/brokers/config";

export const useIntegrationStore = create(
  immer((set, get) => ({
    brokers: {
      [Brokers.DHAN.key]: {
        connected: null,
        isTokenValid: false,
        loading: false,
      },
      [Brokers.ZERODHA.key]: {
        connected: false,
        isTokenValid: false,
        loading: false,
      },
    },

    fetchBrokerStatus: async (broker) => {
      if (get().brokers[broker].connected !== null) return;

      set((s) => {
        s.brokers[broker].loading = true;
      });

      try {
        const res = await brokersService.fetchStatus(broker);

        set((s) => {
          s.brokers[broker].connected =
            res.status === ConnectionStatus.CONNECTED;

          s.brokers[broker].isTokenValid =
            res.status !== ConnectionStatus.TOKEN_EXPIRED;
        });
      } catch (err) {
        useUIStore
          .getState()
          .showToast("ERROR", "Failed to fetch broker status");
      } finally {
        set((s) => {
          s.brokers[broker].loading = false;
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
