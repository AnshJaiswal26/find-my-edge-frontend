import { apiFetch } from "@lib/api/client";

export const bootstrapApi = {
  init() {
    return apiFetch("api/app/init");
  },
};
