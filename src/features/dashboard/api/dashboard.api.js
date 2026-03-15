import { apiFetch } from "@lib/api/client";

export const dashboardApi = {
  init() {
    return apiFetch("api/dashboard/init");
  },

  updateGridLayout(pageName, layout) {
    return apiFetch(`api/pages/${pageName}/layout`, {
      method: "PATCH",
      body: JSON.stringify(layout),
    });
  },
};
