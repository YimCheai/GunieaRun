// src/api/client.js  (ESM)
// 모든 네트워크 요청은 이 파일만 거치도록!
const BASE_URL = import.meta.env?.VITE_API_BASE ?? "http://localhost:3000";

// 공통 fetch 래퍼
async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // 공통 에러 처리
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }

  if (!res.ok || data?.ok === false) {
    const msg = data?.error || res.statusText || "Request failed";
    throw new Error(`[API] ${method} ${path} -> ${msg}`);
  }
  return data;
}

// 개별 도메인 API (점수/아이템/지갑/유틸)
export const ScoreAPI = {
  save: ({ userId, score }, token) =>
    request("/score/save", { method: "POST", body: { userId, score }, token }),
  rank: ({ limit = 10 } = {}, token) =>
    request(`/score/rank?limit=${limit}`, { token }),
};

export const ItemAPI = {
  list: (token) => request("/item/list", { token }),
  buy: ({ userId, itemId }, token) =>
    request("/item/buy", { method: "POST", body: { userId, itemId }, token }),
  equip: ({ userId, itemId, equip }, token) =>
    request("/item/equip", { method: "POST", body: { userId, itemId, equip }, token }),
};

export const UserAPI = {
  inventory: ({ userId }, token) =>
    request(`/user/inventory?userId=${encodeURIComponent(userId)}`, { token }),
  balance: ({ userId }, token) =>
    request(`/wallet/balance?userId=${encodeURIComponent(userId)}`, { token }),
  health: () => request("/api/health"),
};

// 도메인 상수(점/아이템 타입 등) — 프론트 전역에서 쓰게 export
export const ITEM_TYPES = Object.freeze({
  HAT: "hat",
  RIBBON: "ribbon",
});

export const FRUIT_SCORES = Object.freeze({
  peach: 10,   // 복숭아
  cherry: 20,  // 체리 (복숭아보다 점수 높음)
});
