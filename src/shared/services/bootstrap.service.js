import { bootstrapApi } from "@shared/api/bootstrap.api";

export const bootstrapService = {
  async init() {
    return bootstrapApi.init();
  },
};
