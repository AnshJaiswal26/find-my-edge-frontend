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
        if (!res.ok) throw new Error("Refresh failed");

        const json = await res.json();
        accessToken = json?.accessToken ?? json?.data?.accessToken;
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function doRequest(url, options = {}) {
  return fetch(`${BASE_API_URL}/${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
    ...options,
  });
}

export async function apiFetch(url, options = {}) {
  let res = await doRequest(url, options);

  if (res.status === 401 && url !== "auth/refresh") {
    try {
      await refreshAccessToken();

      // retry request
      res = await doRequest(url, options);
    } catch (err) {
      // redirect to login if refresh fails
      window.location.href = "/login";
      throw err;
    }
  }

  console.log("API response for", url);
  let json = null;

  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok) {
    throw new Error(json?.message || "API error");
  }

  return json.data || json;
}
