import { request } from "./client.js";

export const UserAPI = {
  registerNewUser: ({ userId, nickName }, authToken) =>
    request("/user/register", { 
      httpMethod: "POST",
      dataToSend: { userId, nickName },
      authToken
    }),

  getUserInfo: ({ userId }, authToken) =>
    request(`/user/info?userId=${encodeURIComponent(userId)}`, { 
      authToken // GET 방식이니까 특정 친구 불러와야지. userId를 링크에 포함해야겠죠?
    }), // encodeURIComponent: 특수문자 안 이상해지게(?)UTF-8 같은 느낌이려나

  // 유저가 가진 아이템 인벤 가져오기
  getUserInventory: ({ userId }, authToken) =>
    request(`/user/inventory?userId=${encodeURIComponent(userId)}`, { 
      authToken 
    }),

  // 서버야 살아있니..
  checkServerHealth: () => request("/api/health"),
};