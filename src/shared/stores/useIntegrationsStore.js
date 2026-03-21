import { brokersService } from "@shared/services/brokers.service";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useUIStore } from "./useUIStore";

import { BROKERS } from "@features/integrations/brokers/config";
import { TOAST } from "@shared/constants";

export const useIntegrationsStore = create(
  immer((set, get) => ({
    brokers: {
      ...Object.keys(BROKERS).reduce((acc, key) => {
        acc[BROKERS[key].key] = {
          loading: false,
          status: null,
          connectedAt: null,
          expiresAt: null,
        };
        return acc;
      }, {}),

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
          s.brokers[broker].expiresAt = res.expiresOn;

          s.initialized = true;
        });
      } catch (err) {
        useUIStore
          .getState()
          .showToast(TOAST.ERROR, "Failed to fetch broker status");
      } finally {
        set((s) => {
          s.brokers[broker].loading = false;
          s.initializing = false;
        });
      }
    },

    connectBroker: (broker) => {
      set((s) => {
        s.brokers[broker].loading = true;
      });

      brokersService.connect(broker); // redirect → browser leaves page

      set((s) => {
        s.brokers[broker].loading = false;
      });
    },

    disconnectBroker: async (broker) => {
      set((s) => {
        s.brokers[broker].loading = true;
      });

      await brokersService.disconnect(broker);

      set((s) => {
        s.brokers[broker].loading = false;
      });
    },
  })),
);
