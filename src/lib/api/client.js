import { ServerUnavailableError } from "./error";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

let refreshPromise = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("REFRESH_FAILED");

        const json = await res.json();
        accessToken = json?.accessToken ?? json?.data?.accessToken;
        return accessToken;
      })
      .catch((err) => {
        // network/server down
        if (err instanceof TypeError) {
          throw new ServerUnavailableError();
        }

        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function doRequest(url, options = {}) {
  try {
    return await fetch(`${BASE_API_URL}/${url}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
      ...options,
    });
  } catch (err) {
    if (err instanceof TypeError) {
      throw new ServerUnavailableError();
    }
    throw err;
  }
}

export async function apiFetch(url, options = {}) {
  let res;

  try {
    res = await doRequest(url, options);
  } catch (err) {
    throw err;
  }

  if (res.status === 401 && url !== "auth/refresh") {
    try {
      await refreshAccessToken();
      res = await doRequest(url, options);
    } catch (err) {
      if (err instanceof ServerUnavailableError) {
        throw err;
      }
      throw new Error("UNAUTHORIZED");
    }
  }

  let json;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok) {
    throw new Error(json?.message || "API_ERROR");
  }

  return json?.data ?? json;
}
