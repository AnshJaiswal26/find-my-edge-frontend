import { apiFetch } from "@lib/api/client";

export const dashboardApi = {
  init() {
    return apiFetch("api/dashboard/init");
  },
};
