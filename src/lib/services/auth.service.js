import { apiFetch, setAccessToken } from "@lib/api/client";

export const authService = {
  async login(payload) {
    const res = await apiFetch("auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setAccessToken(res.accessToken);

    return res;
  },

  async register(payload) {
    const res = await apiFetch("auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setAccessToken(res.accessToken);

    return res;
  },

  async getMe() {
    return apiFetch("auth/me", {
      method: "GET",
    });
  },

  async refresh() {
    return apiFetch("auth/refresh", {
      method: "POST",
    });
  },

  async logout() {
    return apiFetch("auth/logout", {
      method: "POST",
    });
  },
};
