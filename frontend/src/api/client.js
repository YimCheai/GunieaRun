// src/api/client.js
const BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE) || "";

/** 공통 fetch 래퍼 */
async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }

  if (!res.ok || data?.ok === false) {
    const msg = data?.error || res.statusText || "Request failed";
    throw new Error(`[API] ${method} ${path} -> ${msg}`);
  }
  return data;
}

/* ---------- User ---------- */
export const UserAPI = {
  register: ({ userId, nickname }, token) =>
    request("/user/register", { method: "POST", body: { userId, nickname }, token }),
  info: ({ userId }, token) =>
    request(`/user/info?userId=${encodeURIComponent(userId)}`, { token }),
  inventory: ({ userId }, token) =>
    request(`/user/inventory?userId=${encodeURIComponent(userId)}`, { token }),
  health: () => request("/api/health"),
};

/* ---------- Score ---------- */
export const ScoreAPI = {
  save: ({ userId, score }, token) =>
    request("/score/save", { method: "POST", body: { userId, score }, token }),
  rank: ({ limit = 10 } = {}, token) =>
    request(`/score/rank?limit=${limit}`, { token }),
};

/* ---------- Item ---------- */
export const ItemAPI = {
  list: (token) => request("/item/list", { token }),
  buy: ({ userId, itemId }, token) =>
    request("/item/buy", { method: "POST", body: { userId, itemId }, token }),
  equip: ({ userId, itemId, equip }, token) =>
    request("/item/equip", { method: "POST", body: { userId, itemId, equip }, token }),
};

/* ---------- 상수 (명명 통일) ---------- */
export const ITEM_TYPES = Object.freeze({ HAT: "hat", RIBBON: "ribbon" });
export const FRUIT_SCORES = Object.freeze({ peach: 10, cherry: 20 });
