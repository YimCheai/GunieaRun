import { request } from "./client.js";

export const ScoreAPI = {
  saveGameScore: ({ userId, score }, authToken) =>
    request("/score/save", { 
      httpMethod: "POST",
      dataToSend: { userId, score },
      authToken
    }),

  getRankingList: ({ limit = 10 } = {}, authToken) =>
    request(`/score/rank?limit=${limit}`, { 
      authToken
    }),
};