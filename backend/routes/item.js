export const ItemAPI = {
  list: (token) => request("/item/list", { token }),
  buy: ({ userId, itemId }, token) =>
    request("/item/buy", { method: "POST", body: { userId, itemId }, token }),
  equip: ({ userId, itemId, equip }, token) =>
    request("/item/equip", { method: "POST", body: { userId, itemId, equip }, token }),
};