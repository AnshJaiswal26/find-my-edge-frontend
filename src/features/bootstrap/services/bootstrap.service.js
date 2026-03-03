import { bootstrapApi } from "../api/bootstrap.api";

export const bootstrapService = {
  async init() {
    return bootstrapApi.init();
  },
};