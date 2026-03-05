const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

async function refreshAccessToken() {
  const res = await fetch(`${BASE_API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include", // sends httpOnly cookie
  });

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  const json = await res.json();
  accessToken = json.data.accessToken;

  return accessToken;
}

export async function apiFetch(url, options = {}) {
  let res = await fetch(`${BASE_API_URL}/${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
    ...options,
  });

  if (res.status === 401) {
    try {
      await refreshAccessToken();

      // retry request
      res = await fetch(`${BASE_API_URL}/${url}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          ...options.headers,
        },
        ...options,
      });
    } catch (err) {
      // redirect to login if refresh fails
      window.location.href = "/login";
      throw err;
    }
  }

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "API error");
  }

  console.log("API response for", url, json);

  return json.data || json;
}
