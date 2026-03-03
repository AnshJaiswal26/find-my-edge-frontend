const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export async function apiFetch(url, options = {}) {
  const res = await fetch(`${BASE_API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message);
  }

  console.log("API response for", url, json);

  return json.data || json; //  directly return data
}
