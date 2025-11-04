import { request } from "./client.js";
export const ItemAPI = {
  getItemList: (authToken) => 
    request("/item/list", { authToken }),

  buyItem: ({ userId, itemId }, authToken) =>
    request("/item/buy", { 
      httpMethod: "POST",
      dataToSend: { userId, itemId },
      authToken
    }),

  equipItem: ({ userId, itemId, equip }, authToken) =>
    request("/item/equip", { 
      httpMethod: "POST",
      dataToSend: { userId, itemId, equip },
      authToken
    }),
};